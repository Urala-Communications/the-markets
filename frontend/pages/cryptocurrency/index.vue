<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <div v-else>
    <div
      class="list-page content container container-fluid w-100 buffer"
      :class="view"
    >
      <div class="row m-0 index-list" id="crypto">
        <h2 class="col-12">Cryptocurrencies</h2>
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
        <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-12 white-well pt-2">
            <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
          </div>
        </div>
        <!-- <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-lg-12 mt-4 white-well">
            <News :newsData="newsData"/>
            <Ad feedAd/>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {cryptocurrency} from "./../../market.js";
import IndexList from './../../components/IndexList.vue'
export default {
    components: {
      IndexList
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        cmcApiKey: process.env.cmcApiKey,
        loading: true,
        cryptocurrency,
        view: 'list',
        chartData: null,
        chartOptions: null,
        newsData: []
      }
    },
    methods: {
      fetchCoinsByMarketCap() {
        Number.prototype.toLocaleFixed = function (n) {
          return this.toLocaleString(undefined, {
              minimumFractionDigits: n,
              maximumFractionDigits: n,
          });
        };
        this.$axios.$get(`/api/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=USD&CMC_PRO_API_KEY=${this.cmcApiKey}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          json: true,
          gzip: true
        })
        .then((response) => {
          console.log(response)
          // let i = this.cryptocurrency.findIndex(index => index.name === coin.name);
          // this.$set(this.cryptocurrency[i], 'marketCap', response.marketCap.toLocaleFixed(2));
        })
        .catch((error) => {
          console.log(error);
        });
      },
      fetchNews(symbol){
        this.$axios.$get(`https://api.finage.co.uk/news/cryptocurrency/${symbol}?apikey=${this.finageApiKey}&limit=1`)
        .then(response => {
          if(typeof response.news[0] !== 'undefined'){
            let index = this.newsData.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0];
            // this.loading = false;
            if(index === -1){
              newsItem.symbol = symbol
              newsItem.type = 'cryptocurrency'
              this.newsData.push(newsItem)
            }
            if(this.newsData.length > 10){
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
      this.fetchCoinsByMarketCap();
      this.loading = false; // fix news api bug
      this.$root.$on('updateCrypto', (item) => {
        let i = this.cryptocurrency.findIndex(index => index.name === item.name);
        this.$set(this.cryptocurrency[i], 'price', item.price);
        this.$set(this.cryptocurrency[i], 'difference', item.change);
        this.$set(this.cryptocurrency[i], 'change', item.difference);
      });
      // this.cryptocurrency.forEach(item => {
      //   this.fetchMarketCap(item.symbol);
      // });
      // this.cryptocurrency.forEach(item => {
      //   this.fetchNews(item.icon);
      // });
      // setInterval(() => {
      //   this.cryptocurrency.forEach(item => {
      //     this.fetchNews(item.icon);
      //   });
      //   // every 5 minutes
      // }, 300000)
    },
  }
</script>

<style lang="scss">

</style>
