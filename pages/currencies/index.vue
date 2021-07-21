<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <div v-else>
    <div
      class="content container container-fluid w-100 buffer"
      :class="view"
    >
      <div class="row m-0">
        <h2 class="col-12">Currencies</h2>
        <!-- <div class="toggle col-12">
          <button
            class="grid btn-outline-dark btn mb-4 mr-2"
            :class="view === 'grid' ? 'active' : ''"
            @click="showGrid()"
          />
          <button
            class="list btn-outline-dark btn mb-4"
            :class="view === 'list' ? 'active' : ''"
            @click="showList()"
          />
        </div> -->
        <div class="col-lg-8">
          <div class="col-12 white-well pt-2">
            <IndexList :data="filteredCurrencies" indexPage type="currencies" />
          </div>
        </div>
        <div class="col-lg-4">
          <News :newsData="newsData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {currencies} from "./../../market.js";
import IndexList from './../../components/IndexList.vue'
export default {
    components: {
      IndexList
    },
    data() {
      return {
        forexWS: new WebSocket("wss://w29hxx2ndd.finage.ws:8001/?token=SOCKET_KEYFEHvG9MMnnGX5JhQ8mVJsw527EMDPAq3MKkETjUV55QQC33y"),
        loading: true,
        currencies,
        filteredCurrencies: [],
        view: 'list',
        loaded: false,
        chartData: null,
        chartOptions: null,
        newsData: []
      }
    },
    methods: {
      fetchNews(symbol){
        this.$axios.$get(`https://api.finage.co.uk/news/forex/${symbol}?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          console.log('News')
          console.log(response.news)
          if(typeof response.news[0] !== 'undefined'){
            let index = this.newsData.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0]
            this.loading = false;
            if(index === -1){
              // newsItem.symbol = symbol
              // newsItem.type = 'currencies'
              this.newsData.push(newsItem)
            }
            if(this.newsData.length > 17){
              this.newsData.pop()
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      showGrid() {
        this.view = 'grid';
      },
      showList() {
        this.view = 'list';
      },
    },
    created() {
      this.$root.$on('updateCurrency', (item) => {
        let i = this.currencies.findIndex(index => index.name === item.name);
        this.$set(this.currencies[i], 'price', item.price);
        this.$set(this.currencies[i], 'difference', item.difference);
        this.$set(this.currencies[i], 'change', item.change);
      });
      this.$root.$on('updateIndice', (item) => {
        // console.log(item)
        if(item.symbol === 'DXY'){
          let i = this.currencies.findIndex(index => index.name === item.name);
          this.$set(this.currencies[i], 'price', item.price);
          this.$set(this.currencies[i], 'difference', item.difference);
          this.$set(this.currencies[i], 'change', item.change);
        }
      });
      this.filteredCurrencies = this.currencies.filter(item => item.type === 'currency');
      this.currencies.forEach(item => {
        this.fetchNews(item.symbol);
      });
      setInterval(() => {
        this.currencies.forEach(item => {
          this.fetchNews(item.symbol);
        });
        // every 5 minutes
      }, 300000)
    },
  }
</script>

<style lang="scss">

</style>
