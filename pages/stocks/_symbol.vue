<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="stocks"
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
import {stocks} from "../../market.js";
import Item from '~/components/Item.vue'
export default {
    components: {
      Item
    },
    data() {
      return {
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
        stocks,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA")
      }
    },
    head() {
      return {
        title: this.symbol.toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      fetchDetails() {
        let i = this.stocks.find(item => item.name.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/detail/stock/${i.symbol}?apikey=${process.env.FINAGE_API_KEY}`)
          .then(response => {
            this.profile = response;
            console.log("Details")
          })
          .catch(error => {
            console.log(error);
          })
      },
      fetchPrice() {
        Number.prototype.toLocaleFixed = function(n) {
          return this.toLocaleString(undefined, {
            minimumFractionDigits: n,
            maximumFractionDigits: n
          });
        };
        let i = this.stocks.find(item => item.name.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/last/stock/${i.symbol}?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          console.log("Price")
          console.log(response)
          this.item.price = response.ask.toLocaleFixed(2);
          this.$set(this.item, 'icon', i.icon);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          this.marketStatus = response.market;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAggregates(){
        let i = this.stocks.find( item => item.name.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/agg/stock/${i.symbol}/1/day/2021-01-01/${this.yesterday}?limit=1825&apikey=${process.env.FINAGE_API_KEY}`)
          .then(response => {
            console.log("Aggregates")
            let today = response.results[response.results.length - 1]
            this.open = today.o;
            this.high = today.h;
            this.low = today.l;
            this.close = today.c;
            this.volume = today.v;
            this.chartData = response.results.map(i => i.h);
          })
          .catch(error => {
            console.log(error);
          })
      },
      fetchNews(){
        let i = this.stocks.find( item => item.name.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/news/market/${i.symbol}?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          this.news = response;
          if(this.news.length > 16){
            this.news.pop()
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
    },
    created() {
      this.$root.$on('updateStock', (item) => {
        if(item.name.toLowerCase() === this.symbol){
          let i = this.stocks.findIndex(index => index.name.toLowerCase() === item.name.toLowerCase());
          this.$set(this.item, 'name', this.stocks[i].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
        }
      });
      this.fetchDetails();
      this.fetchPrice();
      this.checkMarketStatus();
      this.fetchAggregates();
      this.fetchNews();
      this.checkMarketStatus();
      setInterval(() => {
        this.fetchNews()
      }, 300000)
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
    }
  }

</script>
