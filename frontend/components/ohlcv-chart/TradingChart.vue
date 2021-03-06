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
        :timezone="this.timezone"
        :chart-config="this.defaultConfig"
        ref="tradingChart">
        </trading-vue>

        <tf-selector :charts="charts" v-on:selected="on_selected">
        </tf-selector>
    </div>
</template>

<script>
import { TradingVue, DataCube } from 'trading-vue-js';
import TFSelector from '~/components/ohlcv-chart/TFSelector.vue'
import Overlays from 'tvjs-overlays'
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
            this.$root.$emit("changeInterval", {symbol: this.symbol, interval: tf.name, text: tf.text})
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
            if (this.data.length > 0 && this.$refs.tradingChart && symbol == this.symbol) {

                if (interval === "MAX") {
                    this.defaultConfig = { DEFAULT_LEN: this.data.length }
                } else {
                    this.defaultConfig = { DEFAULT_LEN: 40 }
                }
                this.$refs.tradingChart.resetChart();
            }
        });

        this.$root.$on("limitRange", (symbol) => {
            if (this.data.length > 0 && this.$refs.tradingChart && symbol == this.symbol) {
                this.charts = [{label: "1d", value:"1d", text: "1/day"}];
            }
        });

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {

            charts:[
                {label: "1m", value:"1m", text: "1/minute"},
                {label: "5m", value:"5m", text: "5/minute"},
                {label: "15m", value:"15m", text: "15/minute"},
                {label: "30m", value:"30m", text: "30/minute"},
                {label: "1h", value:"1h", text: "1/hour"},
                {label: "4h", value:"4h", text: "4/hour"},
                {label: "1d", value:"1d", text: "1/day"},
                {label: "1W", value:"1w", text: "1/week"},
                {label: "1M", value:"1M", text: "1/month"},
                {label: "MAX", value:"MAX", text: "MAX"}
            ],
            chart: new DataCube({
                chart: {
                    type: "Candles",
                    data: this.data,
                    indexBased: true,
                    tf: "1d",
                    grid: {
                        logScale: true
                    }
                },
                onchart: [
                {
                    type: 'EMA',name: 'EMA 50', data: [],
                    settings: {color: "#f7890c", length: 50}
                },
                {
                    type: 'EMA',name: 'EMA 100', data: [],
                    settings: {color: "#20c997", length: 100}
                },
                {
                    type: 'EMA',name: 'EMA 200', data: [],
                    settings: {color: "purple", length: 200}
                }
                ],
            }),
            width: document.querySelector('.row').offsetWidth - 30,
            height: 470,
            colors: {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333',
            },
            timezone: (new Date()).getTimezoneOffset() / -60,
            defaultConfig:  { DEFAULT_LEN: 40 },
            overlays: [
                Overlays['EMA']
            ],
        }
    },
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

