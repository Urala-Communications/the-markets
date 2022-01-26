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
          <div class="col-12 white-well p-0">
            <b-tabs pills card vertical lazy>
              <b-tab title="All" active>
                <b-card-text>
                  <IndexList :data="coins" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="DeFi">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Metaverse">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="NFTs">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Memes">
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
              </b-tab>
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
        coins: [],
        cryptocurrency,
        view: 'list',
        chartData: null,
        chartOptions: null,
        newsData: []
      }
    },
    methods: {
      fetchNews(symbol){
        this.$axios.$get(`https://api.finage.co.uk/news/cryptocurrency/${symbol}?apikey=${this.finageApiKey}&limit=1`)
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
      showGrid() {
        this.view = 'grid';
      },
      showList() {
        this.view = 'list';
      },

    },
    created() {
      let topCoins = localStorage.getItem('crypto');
      this.coins = JSON.parse(topCoins)
      this.coins.forEach((item) => {
        let indexFound = item.cmc_rank - 1;
        let i = this.coins[indexFound];
        i.indexFound = indexFound;
        i.price = Number(item.quote["USD"].price).toFixed(2);
        i.change = Number(item.quote["USD"].percent_change_24h).toFixed(2);
        i.marketcap = Number(item.quote["USD"].market_cap).toFixed(2);
        this.$root.$emit('updateCoins', i);
      });
      // this.checkMarketStatus();
      this.$root.$on('updateCoins', (item) => {
        let itemIndex = item.indexFound ;
        this.$set(this.coins[itemIndex], 'price', item.price);
        this.$set(this.coins[itemIndex], 'difference', item.difference);
        this.$set(this.coins[itemIndex], 'change', item.change);
        this.$set(this.coins[itemIndex], 'marketcap', item.marketcap);
      });
      this.loading = false; // fix news api bug
      this.$root.$on('updateCrypto', (item) => {
        this.$set(this.cryptocurrency[item.indexFound], 'price', item.price);
        this.$set(this.cryptocurrency[item.indexFound], 'difference', item.difference);
        this.$set(this.cryptocurrency[item.indexFound], 'change', item.change);
      });
      this.cryptocurrency.forEach(item => {
        this.fetchNews(item.icon);
      });
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
