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
     <div class="row m-0 index-list" id="commodities">
        <h2 class="col-12">Commodities</h2>
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
        <div class="col-12 col-lg-8 offset-lg-4">
          <div class="col-12 white-well pt-2">
            <IndexList :data="commodities" indexPage type="commodities" />
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
import {commodities} from "./../../market.js";
export default {
    components: {
      IndexList: () => import('./../../components/IndexList'),
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        tradingEconKey: process.env.tradingEconKey,
        loading: true,
        commodities,
        view: 'list',
        chartData: null,
        chartOptions: null,
        newsData: []
      }
    },
    methods: {
      fetchNews(symbol){
        this.$axios.$get(`https://api.finage.co.uk/news/forex/${symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          if (response.news.length) {
            if(typeof response.news[0] !== 'undefined'){
              let index = this.newsData.findIndex(x => x.title === response.news[0].title);
              let newsItem = response.news[0]
              let newsItem2 = response.news[1]
              this.loading = false;
              if(index === -1){
                this.newsData.push(newsItem)
                this.newsData.push(newsItem2)
              }
              if(this.newsData.length > 10){
                this.newsData.pop()
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchCommodities() {
        // Trading Economics
        this.$axios.$get(`https://api.tradingeconomics.com/markets/commodities?c=${this.tradingEconKey}&f=json`)
        .then(response => {
          this.commodities.forEach(item => {
            let match = response.filter(element => element["Symbol"] === item.symbol);
            if(match.length > 0){
              item.price = match[0]['Last'];
              item.change = match[0]['DailyChange'];
              item.difference = match[0]['DailyPercentualChange'];
              item.ticker = match[0]['Ticker'];
              this.$root.$emit('updateCommodity', item);
            }
          });
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
      this.fetchCommodities();
      this.$root.$on('updateCommodity', (item) => {
        this.loading = false; // ONLY ONCE ALL FETCHED
        let itemIndex = this.commodities.findIndex(index => index["Symbol"] === item["Symbol"]);
        this.$set(this.commodities[itemIndex], 'price', item.price);
        this.$set(this.commodities[itemIndex], 'difference', item.difference);
        this.$set(this.commodities[itemIndex], 'change', item.change);
      });
    },
  }
</script>

<style lang="scss">

</style>
