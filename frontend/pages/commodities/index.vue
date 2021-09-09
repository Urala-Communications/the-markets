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
        <div class="col-lg-8">
          <div class="col-12 white-well pt-2">
            <IndexList :data="commodities" indexPage type="commodities" />
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
import {commodities} from "./../../market.js";
import IndexList from './../../components/IndexList.vue'
export default {
    components: {
      IndexList
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
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
          // console.log('News')
          // console.log(response.news)
          if(typeof response.news[0] !== 'undefined'){
            let index = this.newsData.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0]
            this.loading = false;
            if(index === -1){
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
      this.$root.$on('updateCommodity', (item) => {
        let i = this.commodities.findIndex(index => index.symbol === item.symbol);
        this.$set(this.commodities[i], 'price', item.price);
        this.$set(this.commodities[i], 'difference', item.difference);
        this.$set(this.commodities[i], 'change', item.change);
      });
      this.commodities.forEach(item => {
        this.fetchNews(item.symbol);
      });
      setInterval(() => {
        this.commodities.forEach(item => {
          this.fetchNews(item.symbol);
        });
      }, 300000)
    },
  }
</script>

<style lang="scss">

</style>
