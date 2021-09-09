<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="currencies"
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
import {currencies, indices} from "../../market.js";
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
        currencies,
        indices,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA")
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
      fetchDetails() {
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        // if(itemSymbol === 'DOLLARINDEX'){
        //   itemSymbol = 'DXY'
        // }
        if(itemSymbol !== 'DOLLARINDEX'){
          this.$axios.$get(`https://api.finage.co.uk/agg/forex/prev-close/${itemSymbol}?apikey=${this.finageApiKey}`)
          .then(response => {
              this.open = response.results[0].o;
              this.high = response.results[0].h;
              this.low = response.results[0].l;
              this.close = response.results[0].c;
              this.volume = response.results[0].v;
              console.log("Details")
          })
          .catch(error => {
            console.log(error);
          })
        }
      },
      fetchPrice() {
        Number.prototype.toLocaleFixed = function(n) {
          return this.toLocaleString(undefined, {
            minimumFractionDigits: n,
            maximumFractionDigits: n
          });
        };
        // API Price
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        let priceType = `trade/forex/${itemSymbol}`
        if(this.symbol === 'dollar-index'){
          priceType = 'index/dxy';
        }
        this.$axios.$get(`https://api.finage.co.uk/last/${priceType}?apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Price")
          console.log(response)
          this.item.price = response.price.toLocaleFixed(4);
          this.$set(this.item, 'icon', i.icon);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`)
        .then(response => {
          this.marketStatus = response.currencies.fx;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAggregates(){
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        // if(itemSymbol === 'DOLLARINDEX'){
        //   itemSymbol = 'DXY'
        // }
        if(itemSymbol !== 'DOLLARINDEX'){
          this.$axios.$get(`https://api.finage.co.uk/agg/forex/${itemSymbol}/1/day/2021-01-01/${this.yesterday}?limit=1825&apikey=${this.finageApiKey}`)
          .then(response => {
            console.log("Aggregates")
            // console.log(response.results)
            this.chartData = response.results.map(i => i.c);
          })
          .catch(error => {
            console.log(error);
          })
        }
      },
      fetchNews(){
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        this.$axios.$get(`https://api.finage.co.uk/news/forex/${itemSymbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          let filteredNews = response.news.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i); // filter duplicates from API - may need to also filter this.news on each fetch
          // console.log('NEWS')
          // console.log(filteredNews)
          this.news = filteredNews;
          if(this.news.length > 10){
            this.news.pop()
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
    },
    created() {
      this.$root.$on('updateCurrency', (item) => {
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        if(item.symbol === itemSymbol){
          let i = this.currencies.findIndex(index => index.name.toLowerCase() === item.name.toLowerCase());
          this.$set(this.item, 'name', this.currencies[i].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
          this.loading = false;
        }
      });
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
      this.fetchDetails();
      this.fetchPrice();
      this.checkMarketStatus();
      this.fetchAggregates();
      this.fetchNews();
      setInterval(() => {
        this.fetchNews()
      }, 300000)
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
    }
  }

</script>
