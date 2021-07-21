<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <div v-else>
    <div
      class="list-page content container w-100 buffer"
      :class="view"
    >
      <div class="row m-0 justify-content-center">
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
        <div class="col-12 col-lg-8">
          <h2 class="col-12">Movers</h2>
          <div class="col-12 white-well pt-2">
            <IndexList :data="rising" indexPage type="rising" />
          </div>
        </div>
        <!-- <div class="col-lg-4">
          <News :newsData="newsData"/>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {rising} from "../market.js";
  import IndexList from '../components/IndexList.vue'
  export default {
    components: {
      IndexList
    },
    data() {
      return {
        loading: true,
        rising,
        view: 'list',
        chartData: null,
        chartOptions: null,
        newsData: []
      }
    },
    methods: {
      fetchNews(symbol){
        this.$axios.$get(`https://api.finage.co.uk/news/market/${symbol}?apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          if(typeof response[0] !== 'undefined'){
            let index = this.newsData.findIndex(x => x.title === response[0].title);
            if(index === -1){
              this.newsData.push(response[0])
            }
            if(this.newsData.length > 16){
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
      this.$root.$on('updateRising', (update) => {
        this.rising = update;
        this.$nextTick(() => {
          this.loading = false;
        });
      });
      this.rising.forEach(item => {
        this.fetchNews(item.symbol);
      });
      setInterval(() => {
        this.rising.forEach(item => {
          this.fetchNews(item.symbol);
        });
        // every 5 minutes
      }, 300000)
    },
  }
</script>

<style lang="scss">

</style>
