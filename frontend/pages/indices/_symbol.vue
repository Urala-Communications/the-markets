<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="indices"
    :news="news"
    :profile="profile"
    :open="open"
    :close="close"
    :high="high"
    :low="low"
    :volume="volume"
    :chartData="chartData"
    :chartOptions="chartOptions"
    :marketStatus="marketStatus"
  />
</template>

<script>
import {indices} from "../../market.js";
import Item from '~/components/Item.vue'
export default {
    components: {
      Item
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        item: {
          price: 0,
          icon: ''
        },
        profile: {},
        open: 0,
        close: 0,
        high: 0,
        low: 0,
        volume: 0,
        news: [],
        loading: true,
        symbol: '',
        marketStatus: '',
        indices,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
      }
    },
    head() {
      return {
        title: this.symbol.replace('-','').toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      // fetchDetails() {
      //   let itemSymbol = this.symbol.replace('-', '').toUpperCase();
      //   this.$axios.$get(` https://api.finage.co.uk/agg/index/${itemSymbol}/1day/2021-02-05/2021-03-02?apikey=${this.finageApiKey}`)
      //   .then(response => {
      //     this.open = response.results[0].o;
      //     this.high = response.results[0].h;
      //     this.low = response.results[0].l;
      //     this.close = response.results[0].c;
      //     this.volume = response.results[0].v;
      //     console.log("Details")
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      // },
      fetchPrice() {
        Number.prototype.toLocaleFixed = function(n) {
          return this.toLocaleString(undefined, {
            minimumFractionDigits: n,
            maximumFractionDigits: n
          });
        };
        let i = this.indices.find( item => item.name === this.symbol.replace('-', ' ').toUpperCase());
        this.$axios.$get(`https://api.finage.co.uk/last/index/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Price")
          console.log(response)
          this.item.price = response.price.toLocaleFixed(2);
          this.item.priceNumber = response.price;
          this.$set(this.item, 'icon', i.icon);
          this.loading = false;
        })
        .then(() => {
          this.fetchAggregates();
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`)
        .then(response => {
          this.marketStatus = response.nasdaq;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAggregates(){
        let i = this.indices.find( item => item.name === this.symbol.replace('-', ' ').toUpperCase());
        this.$axios.$get(`https://api.finage.co.uk/agg/index/${i.symbol}/1day/2021-01-01/${this.yesterday}?limit=1825&&apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Aggregates")
          this.chartData = response.results.map(i => parseInt(i.c));
          let last = response.results.pop();
          this.open = last.o;
          this.high = last.h;
          this.low = last.l;
          this.close = last.c;
          this.volume = last.v;
          this.item.difference = this.item.priceNumber - this.close
          this.item.difference = this.item.difference.toFixed(2)
          this.item.change = (this.item.priceNumber - this.close) / this.close * 100;
          this.item.change = this.item.change.toFixed(2)
        })
        .catch(error => {
          console.log(error);
        })
      }
    },
    created() {
      this.$root.$on('updateIndice', (item) => {
        if(item.name.replace(/ /g, '-').toLowerCase() === this.symbol){
          let i = this.indices.findIndex(index => index.name.toLowerCase() === item.name.toLowerCase());
          this.$set(this.item, 'name', this.indices[i].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
          this.loading = false;
        }
      });
      // this.fetchDetails();
      this.fetchPrice();
      this.checkMarketStatus();
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
    }
  }

</script>

<style lang="scss">

.loading-logo{
  background-image: url('./../../assets/logo-white.svg');
  width: 5rem;
  height: 5rem;
  background-repeat: no-repeat;
  background-color: #242424;
  border-radius: 50%;
  background-size: 60%;
  background-position: center;
  animation: blink 0.6s ease-in infinite alternate;
}

</style>
