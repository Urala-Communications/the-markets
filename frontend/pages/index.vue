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
                <IndexList :data="cryptocurrency.slice(0,10)" type="cryptocurrency" />
              </div>
              <div class="col-12 white-well">
                <h2>Currencies
                  <NuxtLink class="index-link" to="/currencies">View all</NuxtLink>
                </h2>
                <IndexList :data="currencies.slice(0,6)" type="currencies" />
              </div>
              <div class="col-12 white-well bonds">
                <h2>Bonds
                  <NuxtLink class="index-link" to="/bonds">View all</NuxtLink>
                </h2>
                <IndexList :data="bonds" type="bonds" />
              </div>
            </div>
            <div class="col-lg-6">
              <div class="col-12 white-well indices">
                <h2>Indices
                  <NuxtLink class="index-link" to="/indices">View all</NuxtLink>
                </h2>
                <IndexList :data="indices.slice(0,10)" type="indices" />
                <span class="smaller pl-2">*real-time derived</span>
              </div>
              <!-- <div class="col-12 white-well">
                <h2>Movers
                  <NuxtLink class="index-link" to="/movers">View all</NuxtLink>
                </h2>
                <IndexList :data="rising" type="rising" />
              </div> -->
              <div class="col-12 white-well">
                <h2>Commodities
                  <NuxtLink class="index-link" to="/commodities">View all</NuxtLink>
                </h2>
                <IndexList :data="commodities.slice(0,6)" type="commodities" />
              </div>
              <div class="col-12 white-well">
                <h2>Stocks
                  <NuxtLink class="index-link" to="/stocks">View all</NuxtLink>
                </h2>
                <IndexList :data="stocks.slice(0,10)" type="stocks" />
              </div>
            </div>
            <!-- <div class="col-12">
              <div class="col-12 white-well">
                <h2 class="pt-3">Personal Finance</h2>
                <Articles :articles="articles" />
              </div>
            </div> -->
          </div>
        </div>
        <div class="col-12 col-lg-4 mb-5 news-section">
          <div class="row m-0 justify-content-between">
            <div class="col-lg-12 white-well">
              <h2 class="mt-0 mb-1">News</h2>
              <VueRssFeed :feedUrl="feedUrl" :name="name" :limit="limit"/>
              <News :newsData="orderedNews"/>
              <!-- <News :newsData="stockNews"/> -->
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
import {useQuery, methods} from "@/services/graphql.js"
import { currencies, stocks, indices, bonds, rising, commodities} from "./../market.js";
import Ad from "./../components/Ad.vue";
import VueRssFeed from "vue-rss-feed";
export default {
    components: {
      IndexList: () => import('./../components/IndexList'),
      Ad,
      VueRssFeed
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        tradingEconKey: process.env.tradingEconKey,
        loading: true,
        view: 'list',
        coins: [],
        cryptocurrency: [],
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
        news: [],
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        feedUrl: "https://rss.app/feeds/B8PsgfUBGpB6mM7A.xml",
        name: '',
        limit: 3,
      }
    },
    computed: {
      orderedNews: function () {
        let dateOrderedNews = this.news.sort((a,b) => {
          return new Date(b.date) - new Date(a.date);
        });
        return dateOrderedNews;
      }
    },
    methods: {
      fetchNews(symbol){
        useQuery({
          query: "finage.news",
          variables: { market: "market", symbol },
          axios: this.$axios,
        })
        .then(response => {
          // console.log(response)
          if(typeof response.news[0] !== 'undefined'){
            let newsfeed = this.stockNews;
            let index = newsfeed.findIndex(x => x.title === response.news[0].title);
            let newsItem = response.news[0]
            if(index === -1){
              newsItem.symbol = symbol
              newsItem.type = 'stocks'
              newsfeed.push(newsItem)
              this.news.push(newsItem)
            }
            // if(newsfeed.length > 8){
            //   newsfeed.pop()
            // }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchCryptoNews(symbol){
        useQuery({
          query: "finage.news",
          variables: { market: "cryptocurrency", symbol },
          axios: this.$axios,
        })
        .then(response => {
          if(typeof response.news[0] !== 'undefined'){
            let newsfeed = this.cryptoNews;
            let index = newsfeed.findIndex(x => x.title === response.news[0].title);
            let news = response.news;
            let filteredItem = news.filter(e => !e.date.includes("ago"))[0]
            if(index === -1){
              filteredItem.symbol = symbol
              filteredItem.type = 'cryptocurrency'
              newsfeed.push(filteredItem)
              this.news.push(filteredItem)
            }
            // if(newsfeed.length > 8){
            //   newsfeed.pop()
            // }
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      // checkMarketStatus(){
      //   methods.fetchMarketStatus(this.$axios)
      //   .then(response => {
      //     console.log(response)
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      // },
      fetchStocks() {
        useQuery({
          query: "finage.lastMulti",
          variables: {
            suffix: "stocks/",
            symbols: this.stocks.map((s) => s.symbol).join(","),
          },
          axios: this.$axios,
        })
        .then(response => {
          response.forEach(item => {
            const indexFound = this.stocks.findIndex( stock => stock.symbol === item.symbol );
            let i = this.stocks[indexFound];
            i.indexFound = indexFound;
            i.price = Number(item.ask).toFixed(2);
            i.priceNumber = item.ask
            this.$root.$emit('updateStock', i);
          });
        })
        .then(() => {
          this.stocks.forEach(item => {
            useQuery({
              query: "finage.agg",
              variables: {
                suffix: "stock",
                symbol: item.symbol,
                period: "1",
                multiplier: "day",
                from: "2021-01-01",
                to: this.today,
              },
              axios: this.$axios,
            })
            .then(response => {
              const indexFound = this.stocks.findIndex( stock => stock.symbol === response.symbol );
              let i = this.stocks[indexFound];
              i.indexFound = indexFound;
              let last = response.results.pop();
              i.difference = i.priceNumber - last.c
              i.difference = i.difference.toFixed(2)
              i.change = (i.priceNumber - last.c) / last.c * 100
              i.change = i.change.toFixed(2)
              this.$root.$emit('updateStock', i);
            })
            .catch(error => {
              console.log(error);
            })
          })
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchCurrency(symbol) {
        useQuery({
          query: "finage.last",
          variables: { suffix: "trade/forex", symbol },
          axios: this.$axios,
        })
        .then(response => {
          let indexFound = this.currencies.findIndex(currency => currency.symbol === response.symbol  );
          let i = this.currencies[indexFound];
          i.indexFound = indexFound;
          // if(i.type === 'commodity'){
          //   i.price = Number(response.price).toFixed(2);
          //   this.$root.$emit('updateCommodity', i);
          // } else {
            i.price = Number(response.price).toFixed(4);
            this.$root.$emit('updateCurrency', i);
          // }
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchIndice(symbol) {
        useQuery({
          query: "finage.last",
          variables: { suffix: "index", symbol },
          axios: this.$axios,
        })
        .then(response => {
          let indexFound = this.indices.findIndex( indice => indice.symbol === response.symbol );
          let i = this.indices[indexFound];
          i.indexFound = indexFound;
          i.price = response.price.toFixed(2);
          i.priceNumber = response.price;
          this.$root.$emit('updateIndice', i);
        })
        .then(() => {
          useQuery({
            query: "finage.agg",
            variables: {
              suffix: "index",
              symbol: symbol,
              multiplier: "1day",
              from: "2021-01-01",
              to: this.today,
            },
            axios: this.$axios,
         })
          .then(response => {
            let indexFound = this.indices.findIndex( indice => indice.symbol === response.symbol );
            let i = this.indices[indexFound];
            i.indexFound = indexFound;
            let last = response.results.pop();
            i.difference = i.priceNumber - last.c
            i.difference = i.difference.toFixed(2)
            i.change = (i.priceNumber - last.c) / last.c * 100
            i.change = i.change.toFixed(2)
            i.price = parseFloat(last.c).toFixed(2);
            this.$root.$emit('updateIndice', i);
          })
          .catch(error => {
            console.log(error);
          })
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchBonds(symbol) {
        useQuery({
          query: "finage.bonds",
          variables: { suffix: "us/rate", symbol: symbol },
          axios: this.$axios,
        })
        .then(response => {
          // console.log(response)
          let i = this.indices.find( indice => indice.symbol === response.symbol );
          i.price = Number(response.value).toFixed(2);
          this.$root.$emit('updateBond', i);
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
              item.price = match[0]['Last'].toFixed(2);
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
      fetchMovers() {
        this.$axios.$get(`https://api.finage.co.uk/market-information/us/most-gainers?apikey=${this.finageApiKey}`)
        .then(response => {
          this.$root.$emit('updateRising', response);
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        methods.fetchMarketStatus(this.$axios)
        .then(response => {
          this.marketStatus = response;
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
      }
    },
    // async mounted () {
    created() {
      const self = this;
      this.fetchStocks();
      this.indices.forEach(item => {
        if (item.type !== 'currency'){
          if (item.type !== 'indice'){
            this.fetchBonds(item.symbol);
          } else {
            this.fetchIndice(item.symbol);
          }
        }
      });
      this.currencies.forEach(item => {
        this.fetchCurrency(item.symbol);
      });
      this.fetchCommodities();
      this.fetchMovers();
      this.checkMarketStatus();

      function checkCryptoList() {
        let topCoins = sessionStorage.getItem('cryptoList');
        if (topCoins) {
          self.cryptocurrency =  JSON.parse(topCoins);
          let homeCrypto = self.cryptocurrency.slice(0,10)
          homeCrypto.forEach(item => {
            self.fetchCryptoNews(item.symbol);
          });
        } else {
            setTimeout(checkCryptoList, 250);
        }
      }

      setTimeout(checkCryptoList, 250);
      this.$root.$on("addCrypto", (cryptoLists) => {
        if (this.cryptocurrency.length && this.cryptocurrency.length < 200) {
          this.cryptocurrency = this.cryptocurrency.concat(cryptoLists);
        }
      })

      this.$root.$on('updateCrypto', (item) => {
        if (this.cryptocurrency.length) {
          this.$set(this.cryptocurrency[item.indexFound], 'price', item.price);
          this.$set(this.cryptocurrency[item.indexFound], 'difference', item.difference);
          this.$set(this.cryptocurrency[item.indexFound], 'change', item.change);
        }
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
        //let itemIndex = this.indices.findIndex(index => index.name === item.name);
        const itemIndex = item.indexFound ;
        if (itemIndex !== -1) {
          // let t = this.indices[item.indexFound];
          // t.price = item.price;
          // t.difference = item.difference;
          // t.change = item.change;
          // this.indices.splice(item.indexFound, 1, t);
          this.$set(this.indices[itemIndex], 'price', item.price);
          this.$set(this.indices[itemIndex], 'difference', item.difference);
          this.$set(this.indices[itemIndex], 'change', item.change);
        }
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

      let homeStocks = this.stocks.slice(0,8)
      homeStocks.forEach(item => {
        this.fetchNews(item.symbol);
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

.smaller {
  font-size: 12px;
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
  /* &.home { */
    /* .white-well:not(.indices, .crypto) .instrument.index:nth-of-type(n+7){
      display: none;
    }
    .indices, .crypto{
      .instrument.index:nth-of-type(n+11){
        display: none;
      }
    } */
  /* } */
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
    /* &.bonds{min-height: 332px;} */
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
  /* font-family: 'Press Start 2P', sans-serif; */
  /* letter-spacing: -1px; */
  text-transform: uppercase;
  font-size: 20px;
  /* font-size: 16px; */
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

.vue-rss-feed{
  h1{display: none;}
  .article{
    padding: 0.75rem;
    border-radius: 12px;
    border: none;
    box-shadow: 1px 3px 9px 1px rgb(218 226 239 / 55%);
    img{border-radius: 12px;}
    img + div {display: none;}
    h3{
      font-size: 14px;
      font-weight: 700;
    }
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

@media(max-width:768px){
  .white-well{
    padding: 20px 16px 24px;
  }
}

@media(max-width: 400px){
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
