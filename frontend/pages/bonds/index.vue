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
      <div class="row m-0 index-list" id="bonds">
        <h2 class="col-12">Bonds</h2>
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
            <IndexList :data="bonds" indexPage type="bonds" />
          </div>
        </div>
        <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-lg-12 mt-4 white-well">
            <News :newsData="newsData"/>
            <Ad feedAd/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bonds} from "./../../market.js";
import IndexList from './../../components/IndexList.vue'
export default {
    components: {
      IndexList
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        loading: true,
        bonds,
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
              this.loading = false;
              if(index === -1){
                this.newsData.push(newsItem)
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
      fetchBonds(index,symbol) {
        this.$axios.$get(`https://api.finage.co.uk/bonds/us/rate/${symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          // console.log(response)
          let i = this.bonds.find( bond => bond.symbol === response.symbol );
          this.$root.$emit('updateBond', i);
          this.$set(this.bonds[index], 'price', Number(response.value).toFixed(2));
          this.$set(this.bonds[index], 'difference', response.difference);
          this.$set(this.bonds[index], 'change', response.change);
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
      this.$root.$on('updateBond', (item) => {
        let i = this.bonds.findIndex(index => index.name === item.name);
        this.$set(this.bonds[i], 'price', item.price);
        this.$set(this.bonds[i], 'difference', item.difference);
        this.$set(this.bonds[i], 'change', item.change);
        this.$nextTick(() => {
          this.loading = false;
        });
      });
      this.bonds.forEach((item, index) => {
        this.fetchBonds(index, item.symbol);
        this.fetchNews(item.symbol);
      });
      this.loading = false;
      setInterval(() => {
        this.bonds.forEach(item => {
          this.fetchNews(item.symbol);
        });
        // every 5 minutes
      }, 300000)
    },
  }
</script>

<style lang="scss">

</style>
