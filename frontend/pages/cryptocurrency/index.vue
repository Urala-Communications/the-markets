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
        <!-- <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-12 white-well pt-2">
            <IndexList :data="coins" type="cryptocurrency" indexPage />
          </div>
        </div> -->
        <div class="col-12">
          <div class="col-12 white-well p-0 overflow-hidden">
            <b-tabs pills card lazy :vertical="vertical">
              <b-tab title="All" active>
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                  <infinite-loading @infinite="lazyLoadCrypto">
                    <span slot="no-more"/>
                  </infinite-loading>
                </b-card-text>
              </b-tab>
              <b-tab title="DeFi">
                <b-card-text>
                  <IndexList :data="defi" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <!-- <b-tab title="Metaverse">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab> -->
              <!-- <b-tab title="NFTs">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab> -->
              <!-- <b-tab title="Memes">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="GameFi">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Solana">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Avalanche">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Polkadot">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Fantom">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Exchange">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="eSports">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Stablecoins">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Open Sea">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Web3">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab> -->
            </b-tabs>
          </div>
        </div>
        <div class="col-12">
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
import InfiniteLoading from 'vue-infinite-loading';
import { defi} from "./../../market.js";
import IndexList from './../../components/IndexList.vue'
const finageApiKey = process.env.finageApiKey;
export default {
    components: {
      IndexList,
      InfiniteLoading,
    },
    computed: {
      vertical() {
        if (this.windowWidth > 992){
          return true
        }
        return false
      }
    },
    data() {
      return {
        cmcApiKey: process.env.cmcApiKey,
        loading: true,
        coins: [],
        cryptocurrency: [],
        defi,
        view: 'list',
        chartData: null,
        chartOptions: null,
        newsData: [],
        windowWidth: 0,
        page: 1,
      }
    },
    methods: {
      fetchNews(symbol){
        this.$axios.$get(`https://api.finage.co.uk/news/cryptocurrency/${symbol}?apikey=${finageApiKey}&limit=1`)
        .then(response => {
          if(typeof response.news[0] !== 'undefined'){
            let index = this.newsData.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0];
            this.loading = false;
            if(index === -1){
              newsItem.symbol = symbol
              newsItem.type = 'cryptocurrency'
              this.newsData.push(newsItem)
            }
            if(this.newsData.length > 30){
              this.newsData.pop()
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchCrypto(symbol) {
        this.$axios.$get(`https://api.finage.co.uk/last/crypto/${symbol.toUpperCase()}USD?apikey=${finageApiKey}`)
        .then(response => {
          let indexFound = this.cryptocurrency.findIndex(crypto => crypto.symbol.toUpperCase() === response.symbol.slice(0,-3));
          if (indexFound !== -1) {
            this.$set(this.cryptocurrency[indexFound], 'price', response.price);
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchDefi(symbol) {
        this.$axios.$get(`https://api.finage.co.uk/last/crypto/${symbol}?apikey=${finageApiKey}`)
        .then(response => {
          let indexFound = this.defi.findIndex(d => d.symbol == response.symbol );
          if (indexFound !== -1) {
            let i = this.defi[indexFound];
            i.indexFound = indexFound;
            i.price = Number(response.price).toFixed(2);

            this.$root.$emit('updateDefi', i);
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      lazyLoadCrypto($state){
        this.$axios.$get(`https://api.finage.co.uk/list/cryptocurrency?apikey=${finageApiKey}&limit=50&page=${this.page}`)
        .then(response => {
          if (response.results.length) {
            this.page++;
            this.cryptocurrency = this.cryptocurrency.concat(response.results);
            if (this.page > 2)
              this.$root.$emit('addCrypto', response.results);
            $state.loaded();
            if (this.page > 4) {
              $state.complete();
            }
          } else {
            $state.complete();
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
      const self = this;
      this.loading = false; // fix news api bug
      this.$root.$on('updateCrypto', (item) => {
        if (this.cryptocurrency.length) {
          this.$set(this.cryptocurrency[item.indexFound], 'price', item.price);
          this.$set(this.cryptocurrency[item.indexFound], 'difference', item.difference);
          this.$set(this.cryptocurrency[item.indexFound], 'change', item.change);
        }
      });
      this.$root.$on('updateDefi', (item) => {

        this.$set(this.defi[item.indexFound], 'price', item.price);
        this.$set(this.defi[item.indexFound], 'difference', item.difference);
        this.$set(this.defi[item.indexFound], 'change', item.change);
      });

      this.defi.forEach(item => {
        this.fetchDefi(item.symbol);
      });
      window.onresize = () => {
        this.windowWidth = window.innerWidth
      }
    },
  }
</script>

<style lang="scss">
  .nav-pills .nav-link{
    padding: 0.25rem 1rem;
  }
  .nav-pills .nav-link.active, .nav-pills .show > .nav-link {
    background-color: #191c5f;
  }
</style>
