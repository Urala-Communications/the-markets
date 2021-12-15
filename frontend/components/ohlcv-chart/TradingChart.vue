<template>
    <div class="trading-chart-container">
        <trading-vue 
        :data="chart" 
        :title-txt="symbol"
        :toolbar="false"        
        :width="this.width" 
        :height="this.height"
        :color-back="colors.colorBack"
        :color-grid="colors.colorGrid"
        :color-text="colors.colorText"
        :overlays="overlays"
        ref="tradingChart">
        </trading-vue>
        
        <tf-selector :charts="charts" v-on:selected="on_selected">
        </tf-selector>
    </div>
</template>

<script>
import { TradingVue, DataCube } from 'trading-vue-js';
import TFSelector from '~/components/ohlcv-chart/TFSelector.vue'

export default {
    name: 'TradingChart',
    
    props: {
        data: {
            type: Array
        },
        symbol: {
            type: String
        }
    },
    components: { TradingVue, TFSelector },
    methods: {
        onResize(event) {
            this.width = document.querySelector('.graph').offsetWidth - 20          
        },
        on_selected(tf) {
            
            this.$root.$emit("changeInterval", {symbol: this.symbol, interval: tf.name})            
        }
    },
    watch: {
        data: function(newData, oldData) {
            this.chart.set('chart.data', newData);
        }
    },
    mounted() {
        
        window.addEventListener('resize', this.onResize); 
        
        this.$root.$on("updateKline", (updateData) => {})
        this.$root.$on("updateCrypto", (updateData) => {})
        this.$root.$on("updateTrade", ({symbol, time, price, volumn}) => {
            
            if (this.data.length > 0 && this.$refs.tradingChart && symbol === this.symbol) {
                
                this.chart.update({
                    t: time,
                    price: price,
                    volumn: volumn
                })
            }

        });
        this.$root.$on("updatedInterval", ({symbol, interval}) => {
            if (this.data.length > 0 && this.$refs.tradingChart) {
                this.$refs.tradingChart.resetChart();
            }
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            
            charts:[
                {label: "1m", value:"1m"},
                {label: "5m", value:"5m"},
                {label: "15m", value:"15m"},
                {label: "30m", value:"30m"},
                {label: "1h", value:"1h"},
                {label: "4h", value:"4h"},
                {label: "1d", value:"1d"},
                {label: "1W", value:"1w"},
                {label: "1M", value:"1M"},
            ],
            chart: new DataCube({ 
                chart: {
                    type: "Candles",
                    data: this.data,
                    tf: "1d"   
                }
            }),
            width: document.querySelector('.row').offsetWidth - 30,
            height: 470,
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            },
            timezone: (new Date()).getTimezoneOffset() / -60,
            overlays: []
        }
    }
}


</script>
<style lang="scss">
/* need responsive for custom button here */
.highcharts-button {
    @media (max-width: 768px) {
    }
}

.trading-chart-container {
    position: relative;
    padding-top: 30px;
    padding-left: 10px;
}

</style>

