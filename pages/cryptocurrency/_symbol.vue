<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="cryptocurrency"
    :news="news"
    :profile="profile"
    :open="open"
    :close="close"
    :high="high"
    :low="low"
    :volume="volume"
    :marketCap="marketCap"
    :yearHigh="yearHigh"
    :yearLow="yearLow"
    :chartData="chartData"
    :chartOptions="chartOptions"
    :marketStatus="marketStatus"
  />
</template>

<script>
let date = new Date();
date.setDate(date.getDate() - 1826);
let fiveYearsAgo = date.toLocaleDateString("fr-CA");
import {cryptocurrency} from "../../market.js";
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
      marketCap: 0,
      yearHigh: 0,
      yearLow: 0,
      news: [],
      loading: true,
      symbol: '',
      marketStatus: '',
      cryptocurrency,
      chartData: [],
      chartOptions: null,
      // yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA")
      today: new Date(Date.now()).toLocaleDateString("fr-CA")
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
      // let i = this.cryptocurrency.find( item => item.name.toLowerCase() === this.symbol);
      this.$axios.$get(`https://api.finage.co.uk/detail/cryptocurrency/${this.symbol}?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          // console.log("Details")
          this.profile = response;
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
      let i = this.cryptocurrency.find( item => item.name.toLowerCase() === this.symbol);
      this.$axios.$get(`https://api.finage.co.uk/last/crypto/detailed/${i.symbol}?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          this.open = response.open.toLocaleFixed(2);
          this.close = response.close.toLocaleFixed(2);
          this.high = response.high.toLocaleFixed(2);
          this.low = response.low.toLocaleFixed(2);
          this.volume = response.volume.toLocaleFixed(2);
          this.marketCap = response.marketCap.toLocaleFixed(2);
          this.yearHigh = response.yearHigh.toLocaleFixed(2);
          this.yearLow = response.yearLow.toLocaleFixed(2);
        })
        .catch(error => {
          console.log(error);
        })
    },
    checkMarketStatus(){
      this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        this.marketStatus = response.currencies.crypto;
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchAggregates(){
      let i = this.cryptocurrency.find( item => item.name.toLowerCase() === this.symbol);
      // this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${process.env.FINAGE_API_KEY}`)
      this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/week/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          console.log("Aggregates")
          console.log(response.results)
          this.chartData = response.results.map(i => i.c);
          let last = response.results.pop();
          this.open = last.o;
          this.high = last.h;
          this.low = last.l;
          this.close = last.c;
          this.volume = last.v;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
    },
    fetchNews(){
      let i = this.cryptocurrency.find( item => item.name.toLowerCase() === this.symbol);
      this.$axios.$get(`https://api.finage.co.uk/news/cryptocurrency/${i.icon}?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        // filter matching articles
        // let index = newsfeed.findIndex(x => x.title === response.news[0].title);
        // if(index === -1){
        //   newsfeed.push(response.news[0])
        // }
        console.log('NEWS')
        // console.log(response)
        this.news = response.news;
        // ?type=video
        // this.news.video = true;
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
    this.$root.$on('updateCrypto', (item) => {
      if(item.name.toLowerCase() === this.symbol){
        let i = this.cryptocurrency.findIndex(index => index.name.toLowerCase() === item.name.toLowerCase());
        this.$set(this.item, 'name', this.cryptocurrency[i].name);
        this.$set(this.item, 'price', item.price);
        this.$set(this.item, 'difference', item.difference);
        this.$set(this.item, 'change', item.change);
        this.$set(this.item, 'icon', item.icon);
      }
    });
    this.fetchDetails();
    this.checkMarketStatus();
    this.fetchAggregates();
    this.fetchPrice();
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
