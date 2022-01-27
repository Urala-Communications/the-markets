<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <div v-else>
    <div
      class="home content container w-100 buffer"
      :class="view"
    >
      <!-- <div class="toggle">
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
      <div class="row">
        <div class="col-12 col-lg-8 pr-lg-0">
          <div class="row m-0 justify-content-between main-content">
            <div class="col-lg-6 pl-half">
              <!-- <div class="col-12 white-well crypto">
                <h2>Crypto
                  <NuxtLink class="index-link" to="/cryptocurrency">View all</NuxtLink>
                </h2>
                <IndexList :data="coins" type="cryptocurrency" />
              </div> -->
              <div class="col-12 white-well crypto">
                <h2>Crypto
                  <NuxtLink class="index-link" to="/cryptocurrency">View all</NuxtLink>
                </h2>
                <IndexList :data="cryptocurrency" type="cryptocurrency" />
              </div>
              <div class="col-12 white-well indices">
                <h2>Indices
                  <NuxtLink class="index-link" to="/indices">View all</NuxtLink>
                </h2>
                <IndexList :data="indices" type="indices" />
              </div>
              <div class="col-12 white-well">
                <h2>Currencies
                  <NuxtLink class="index-link" to="/currencies">View all</NuxtLink>
                </h2>
                <IndexList :data="currencies" type="currencies" />
              </div>
            </div>
            <div class="col-lg-6">
              <div class="col-12 white-well">
                <h2>Movers
                  <NuxtLink class="index-link" to="/movers">View all</NuxtLink>
                </h2>
                <IndexList :data="rising" type="rising" />
              </div>
              <div class="col-12 white-well">
                <h2>Commodities
                  <NuxtLink class="index-link" to="/commodities">View all</NuxtLink>
                </h2>
                <IndexList :data="commodities" type="commodities" />
              </div>
              <div class="col-12 white-well">
                <h2>Stocks
                  <NuxtLink class="index-link" to="/stocks">View all</NuxtLink>
                </h2>
                <IndexList :data="stocks" type="stocks" />
              </div>
              <div class="col-12 white-well">
                <h2>Bonds
                  <NuxtLink class="index-link" to="/bonds">View all</NuxtLink>
                </h2>
                <IndexList :data="bonds" type="bonds" />
              </div>
            </div>
            <div class="col-12">
              <div class="col-12 white-well">
                <h2 class="pt-3">Personal Finance</h2>
                <Articles :articles="articles" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4 mb-5 news-section">
          <div class="row m-0 justify-content-between">
            <div class="col-lg-12 white-well">
              <h2 class="mt-0">News</h2>
              <News :newsData="cryptoNews"/>
              <News :newsData="stockNews"/>
              <!-- <Ad feedAd/> -->
              <!-- <Ad feedAd/> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {cryptocurrency, currencies, stocks, indices, bonds, rising, commodities} from "./../market.js";
import Ad from "./../components/Ad.vue";
import Articles from "./../components/Articles";
export default {
    components: {
      IndexList: () => import('./../components/IndexList'),
      Ad,
      Articles
    },
    async asyncData({ $strapi }) {
      return {
        articles: await $strapi.find("articles"),
      };
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        loading: true,
        view: 'list',
        coins: [],
        cryptocurrency,
        currencies,
        stocks,
        indices,
        bonds,
        rising,
        commodities,
        chartData: null,
        chartOptions: null,
        stockNews: [],
        cryptoNews: [],
        risingNews: []
      }
    },
    methods: {
      fetchNews(symbol, type){
        this.$axios.$get(`https://api.finage.co.uk/news/market/${symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          // console.log(response)
          if(typeof response.news[0] !== 'undefined'){
            let newsfeed = type === 'rising' ? this.risingNews : this.stockNews;
            let index = newsfeed.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0]
            if(index === -1){
              newsItem.symbol = symbol
              newsItem.type = 'stocks'
              newsfeed.push(newsItem)
            }
            if(newsfeed.length > 41){
              newsfeed.pop()
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchCryptoNews(symbol, type){
        this.$axios.$get(`https://api.finage.co.uk/news/cryptocurrency/${symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          if(typeof response.news[0] !== 'undefined'){
            let newsfeed = type === 'rising' ? this.risingNews : this.cryptoNews;
            let index = newsfeed.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0]
            if(index === -1){
              newsItem.symbol = symbol
              newsItem.type = 'cryptocurrency'
              newsfeed.push(newsItem)
            }
            if(newsfeed.length > 41){
              newsfeed.pop()
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      // checkMarketStatus(){
      //   this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`)
      //   .then(response => {
      //     console.log(response)
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      // },
      showGrid() {
        this.view = 'grid';
      },
      showList() {
        this.view = 'list';
      }
    },
    // async mounted () {
    created() {
      // let topCoins = localStorage.getItem('crypto');
      // this.coins = JSON.parse(topCoins)
      // this.checkMarketStatus();
      this.$root.$on('updateCoins', (item) => {
        let itemIndex = item.indexFound ;
        this.$set(this.coins[itemIndex], 'price', item.price);
        this.$set(this.coins[itemIndex], 'difference', item.difference);
        this.$set(this.coins[itemIndex], 'change', item.change);
      });
      this.$root.$on('updateCrypto', (item) => {
        // console.log(item)
        //let itemIndex = item.indexFound ;//this.cryptocurrency.findIndex(index => index.name === item.name);
        this.$set(this.cryptocurrency[item.indexFound], 'price', item.price);
        this.$set(this.cryptocurrency[item.indexFound], 'difference', item.difference);
        this.$set(this.cryptocurrency[item.indexFound], 'change', item.change);
      });
      this.$root.$on('updateCurrency', (item) => {
        // console.log(item)
        let itemIndex = item.indexFound ;//this.currencies.findIndex(index => index.name === item.name);
        this.$set(this.currencies[itemIndex], 'price', item.price);
        this.$set(this.currencies[itemIndex], 'difference', item.difference);
        this.$set(this.currencies[itemIndex], 'change', item.change);
      });
      this.$root.$on('updateCommodity', (item) => {
        let itemIndex = this.commodities.findIndex(index => index.symbol === item.symbol);
        this.$set(this.commodities[itemIndex], 'price', item.price);
        this.$set(this.commodities[itemIndex], 'difference', item.difference);
        this.$set(this.commodities[itemIndex], 'change', item.change);
        this.loading = false;
      });
      // this.$root.$on('updateEconCommodities', (item) => {
      //   console.log(item)
      //   // let itemIndex = this.commodities.findIndex(index => index.symbol === item.symbol);
      //   // this.$set(this.commodities[itemIndex], 'price', item.price);
      //   // this.$set(this.commodities[itemIndex], 'difference', item.difference);
      //   // this.$set(this.commodities[itemIndex], 'change', item.change);
      // });
      this.$root.$on('updateStock', (item) => {
        const itemIndex = item.indexFound ;//this.stocks.findIndex(index => index.name === item.name);
        this.$set(this.stocks[itemIndex], 'price', item.price);
        this.$set(this.stocks[itemIndex], 'difference', item.difference);
        this.$set(this.stocks[itemIndex], 'change', item.change);
      });
      this.$root.$on('updateRising', (update) => {
        this.rising = update;
        this.$nextTick(() => {
        });
      });
      this.$root.$on('updateIndice', (item) => {
        let itemIndex = this.indices.findIndex(index => index.name === item.name);
        this.$set(this.indices[itemIndex], 'price', item.price);
        this.$set(this.indices[itemIndex], 'difference', item.difference);
        this.$set(this.indices[itemIndex], 'change', item.change);
      });
      this.$root.$on('updateBond', (item) => {
        let itemIndex = this.bonds.findIndex(index => index.name === item.name);
        if(typeof this.bonds[itemIndex] !== 'undefined'){
          this.$set(this.bonds[itemIndex], 'price', item.price);
          this.$set(this.bonds[itemIndex], 'difference', item.difference);
          this.$set(this.bonds[itemIndex], 'change', item.change);
        }
      });
      this.bonds = this.bonds.filter(item => item.type === 'homeBond');

      this.stocks.forEach(item => {
        if(item.symbol !== 'AMC' || item.symbol !== 'GME' || item.symbol !== 'BB' || item.symbol !== 'TSLA'){
          this.fetchNews(item.symbol);
        }
      });
      this.cryptocurrency.forEach(item => {
        this.fetchCryptoNews(item.icon);
      });
    }
  }
</script>

<style lang="scss">
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.pl-half{
  padding-left: 5px;
}

.content.container {
  padding: 20px 10px;
  margin: 0 auto 0;
  display: flex;
  /* flex-flow: wrap; */
  flex-flow: column;
  justify-content: space-between;
  min-height: calc(100vh - 603px); // height of nav/ads/footer
  /* canvas{ display: none !important;} */
  &.home {
    .white-well:not(.indices, .crypto) .instrument.index:nth-of-type(n+7){
      display: none;
    }
    .indices, .crypto{
      .instrument.index:nth-of-type(n+11){
        display: none;
      }
    }
  }
  &.home .mover.index:nth-of-type(n+7){
    display: none;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    .index {
      width: 100%;
    }
  }
  /* @media(max-width:650px){
    margin-top: 40px;
  } */
}

.grey-bg {
  background: #ededed;
  max-width: 100%;
  justify-content: center;
}

.white-well {
  background: #ffffff;
  padding: 20px 26px 24px;
  border-radius: 18px;
  box-shadow: 0px 2.5px 9px 0 rgba(218, 226, 239, 0.5);
}

.main-content{
  .white-well{
    margin-bottom: 30px;
    padding-top: 19px;
  }
}

.border-left-grey{
  border-left: 1px solid #e3e3e3;
}

.toggle {
  display: flex;
  justify-content: flex-end;
  padding-right: 0.55rem;
  .btn {
    border: none;
    width: 2.5rem;
    height: 2.5rem;
    background-size: 75%;
    background-repeat: no-repeat;
    background-position: center;
    padding: 5px;
    box-shadow: none !important;
    &:hover, &:focus, &.active{
      background-color: #F3F3F3 !important;
    }
    &.grid {
      background-image: url("./../assets/grid.svg");
    }
    &.list {
      background-image: url("./../assets/list.svg");
    }
  }
}

.list-page .toggle{
  justify-content: flex-start
}

.btn {max-width: 100%;}

h2 {
  font-family: 'Nunito', serif;
  font-family: 'Press Start 2P', sans-serif;
  letter-spacing: -1px;
  text-transform: uppercase;
  /* font-size: 20px; */
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.index-link{
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  letter-spacing: 0;
  @include main-font();
  color: #fff;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 12px;
  background-color: #4647ff;
  &:hover {
    color: #fff;
  }
}

@media(max-width:991px){
  .content.container{
    padding: 1rem;
    /* &.home {padding-top: 8px;} */
  }
  .border-left-grey{
    border-left: none;
  }
  .pl-half{
    padding-left: 15px;
  }
}

@media(max-width: 400px){
  /* .content.container{
    padding: 0 0.5rem;
  } */
  hr{
    margin-top: 0.5rem;
  }
}

@media(min-width: 1200px){
  .col-xl-4 {
    max-width: 384px;
  }
}

</style>
