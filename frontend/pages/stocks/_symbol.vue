<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="stocks"
    :news="news"
    :profile="profile"
    :open="open"
    :close="close"
    :high="high"
    :low="low"
    :volume="volume"
    :chartData="chartData"
    :chartOptions="chartOptions"
    :marketStatus="marketStatus"
    :symbol="symbol"
    :live="live"
  />
</template>

<script>
import {stocks} from "../../market.js";
import Item from '~/components/Item.vue'
export default {
    components: {
      Item
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        liveApiUrl: process.env.liveApiUrl,
        item: {
          name: '',
          price: 0,
          icon: ''
        },
        profile: {},
        open: 0,
        close: 0,
        high: 0,
        low: 0,
        volume: 0,
        news: [],
        loading: true,
        symbol: '',
        live: '',
        marketStatus: '',
        stocks,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        lastTradeDate: new Date(Date.now()).toLocaleDateString("fr-CA"),
      }
    },
    head() {
      return {
        title: this.symbol.toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets - Live Charts for Financial Markets & the Global Community of Traders. Bitcoin, Ethereum, Doge, Shiba, Memes, Crypto, Indices, Stocks, Forex, Bonds, CFDs and more.'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      fetchDetails() {
        let i = this.stocks.find(item => item.name.toLowerCase() === this.symbol);
        this.$set(this.item, 'name', i.name);
        this.$axios.$get(`https://api.finage.co.uk/detail/stock/${i.symbol}?apikey=${this.finageApiKey}`)
          .then(response => {
            this.profile = response;
          })
          .catch(error => {
            console.log(error);
          })
      },
      async fetchPrice() {
        let i = this.stocks.find(item => item.name.toLowerCase() === this.symbol);
        return this.$axios.$get(`https://api.finage.co.uk/last/stock/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          this.item.price = response.ask.toFixed(2);
          this.$set(this.item, 'icon', i.icon);
          this.loading = false;
          this.lastTradeDate = new Date(Number(response.timestamp)).toLocaleDateString("fr-CA");
          this.yesterday = new Date(Number(response.timestamp) - 864e5 ).toLocaleDateString("fr-CA");
          return response;
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`)
        .then(response => {
          this.marketStatus = response.market;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAggregates(){
        let i = this.stocks.find( item => item.name.toLowerCase() === this.symbol);
        let last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
        this.$axios.$get(`https://api.finage.co.uk/agg/stock/${i.symbol}/1/hour/${last}/${this.lastTradeDate}?limit=3000&apikey=${this.finageApiKey}&sort=desc`)
          .then(response => {
            this.chartData = response.results.map(o => {
              const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
              return [timestamp, openPrice, high, low, close, volume].map(n =>
                Number(n)
              );
            }).sort((a, b) => {
              return a[0] - b[0];
            });
            this.symbol = i.symbol;
            this.live = i.symbol;
            let last = this.chartData[this.chartData.length - 1];
            this.open = last[0];
            this.high = last[1]
            this.low = last[2];
            this.close = last[3];
            this.volume = last[4];
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
          })
      },
      fetchNews(){
        let i = this.stocks.find( item => item.name.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/news/market/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          this.news = response.news;          
          if(this.news.length > 16){
            this.news.pop()
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      updateInterval(symbol, interval, text){
        if (symbol === this.live) {
          let last = this.yesterday;
          switch (interval) {
            case '1m':
            case '5m':
            case '15m':
              last = this.yesterday;
              break;
            case '30m':
              last = new Date(Date.now() - 864e5 * 7).toLocaleDateString("fr-CA");
              break;
            case '1h':
            case '4h':
              last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
              break;
            case '1d':
            case '1w':
              last = new Date(Date.now() - 864e5 * 365).toLocaleDateString("fr-CA");
              break;
            case '1M':
              last = new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA");
              break;
            default:
              break;
          }
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/stock/${symbol}/${text}/${last}/${this.lastTradeDate}?limit=3000&apikey=${this.finageApiKey}&sort=desc`
          )
          .then((response) => {
            this.chartData = response.results.map(o => {
              const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
              return [timestamp, openPrice, high, low, close, volume].map(n =>
                Number(n)
              );
            }).sort((a, b) => {
              return a[0] - b[0];
            });
            this.$root.$emit("updatedInterval", {symbol, interval});
          })
          .catch((error) => {
            console.log(error);
          });
        }
      },
    },
    created() {
      this.$root.$on('updateStock', (item) => {
        if(item.symbol === this.symbol.replace("-", " ")){
          this.$set(this.item, 'name', this.stocks[item.indexFound].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
        }
      });
      this.$root.$on("updateTrade", ({symbol, time, price, volumn}) => {
        if (symbol === this.live) {
          this.$set(this.item, "price", price);
        }
      })
      this.$root.$on("changeInterval", ({symbol, interval, text}) => {
        this.updateInterval(symbol, interval, text);
      })
      this.fetchDetails();
      this.fetchPrice().then(res => {
        this.fetchAggregates();
      });
      this.checkMarketStatus();
      this.fetchNews();
      this.checkMarketStatus();
      setInterval(() => {
        this.fetchNews()
      }, 300000)
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
    }
  }
</script>
