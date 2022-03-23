<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="commodities"
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
import {commodities} from "../../market.js";
import moment from 'moment';
import Item from '~/components/Item.vue'
export default {
    components: {
      Item
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        liveApiUrl: process.env.liveApiUrl,
        tradingEconKey: process.env.tradingEconKey,
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
        commodities,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        stopRun: 0,
      }
    },
    head() {
      return {
        title: this.symbol.replace('-',' ').toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets - Live Charts for Financial Markets & the Global Community of Traders. Bitcoin, Ethereum, Doge, Shiba, Memes, Crypto, Indices, Stocks, Forex, Bonds, CFDs and more.'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      fetchDetails() {
        let i = this.commodities.find(item => item.name.replace(/ /g, '-').toLowerCase() === this.symbol);
        if (i) {
          this.$set(this.item, 'icon', i.icon);
          this.$set(this.item, 'name', i.name);
        }
        let symbol = i.symbol.split(":")[0];
        this.$axios.$get(`https://api.finage.co.uk/agg/forex/prev-close/${symbol}?apikey=${this.finageApiKey}`)
          .then(response => {
            this.open = response.results[0].o;
            this.high = response.results[0].h;
            this.low = response.results[0].l;
            this.close = response.results[0].c;
            this.volume = response.results[0].v;
          })
          .catch(error => {
            console.log(error);
          })
      },
      fetchPrice() {
        let i = this.commodities.find( item => item.name.replace(/ /g, '-').toLowerCase() === this.symbol);
        let symbol = i.symbol.split(":")[0];
        this.$axios.$get(`https://api.finage.co.uk/last/trade/forex/${symbol}?apikey=${this.finageApiKey}`)
        .then(response => {          
          this.$set(this.item, 'icon', i.icon);
          this.$set(this.item, 'price', response.price.toFixed(2));
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchNews(){
        let i = this.commodities.find(item => item.name.replace(/ /g, '-').toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/news/forex/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          let filteredNews = response.news.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i); // filter duplicates from API - may need to also filter this.news on each fetch
          this.news = filteredNews;
          if(this.news.length > 10){
            this.news.pop()
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`)
        .then(response => {
          this.marketStatus = response.currencies.fx;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAggregates(){
        let i = this.commodities.find( item => item.name.replace(/ /g, '-').toLowerCase() === this.symbol);
        let last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
          
        this.$axios.$get(`https://api.finage.co.uk/agg/forex/${i.symbol.split(":")[0]}/1/hour/${last}/${this.today}?limit=1825&apikey=${this.finageApiKey}&sort=desc`)
        .then(response => {
          if (response.totalResults) {
            this.chartData = response.results.map(o => {
              const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
              return [timestamp, openPrice, high, low, close, volume].map(n =>
                Number(n)
              );
            }).sort((a, b) => {
              return a[0] - b[0];
            });
            this.symbol = i.symbol.split(":")[0];
            this.live = i.symbol.split(":")[0];
            let last = this.chartData[this.chartData.length - 1];
            this.open = last[0];
            this.high = last[1]
            this.low = last[2];
            this.close = last[3];
            this.volume = last[4];
            this.loading = false;
          } else {
            this.$axios.$get(`https://api.tradingeconomics.com/markets/historical/${i.symbol}?c=${this.tradingEconKey}&f=json`)
            .then(response => {
              if (response.length) {
                
                this.chartData = response.map(o => {
                  const [timestamp, openPrice, high, low, close, volume] = [moment(o.Date, 'DD-MM-YYYY'), o.Open, o.High, o.Low, o.Close, 0];
                  return [timestamp, openPrice, high, low, close, volume].map(n =>
                    Number(n)
                  );
                }).sort((a, b) => {
                  return a[0] - b[0];
                });                
                this.symbol = i.symbol.split(":")[0];   
                this.live = i.symbol.split(":")[0];           
                let last = this.chartData[this.chartData.length - 1];
                this.open = last[1];
                this.high = last[2]
                this.low = last[3];
                this.close = last[4];
                this.volume = last[5];
                this.loading = false;
                this.$set(this.item, 'price', last[4].toFixed(2));
                const self = this;
                setTimeout(function(){
                  self.$root.$emit("limitRange", self.symbol);
                }, 2000)
                
              }
            }).catch(err => {
              console.log("tradingeconomic err: ",err)
            })
          }

        })
        .catch(error => {
          console.log("finage err: ",error);
        })
      },
      fetchAllResursive(symbol, interval, text, lastdate){
        if (this.stopRun) {
          let last =  new Date(Date.parse(lastdate) - 864e5 * 365 * 5 ).toLocaleDateString("fr-CA");
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/forex/${symbol}/${text}/${last}/${lastdate}?limit=3000&apikey=${this.finageApiKey}&sort=desc`
          )
          .then((response) => {
            if (response.results || response.results.length) {
              this.chartData = response.results.map(o => {
                const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
                return [timestamp, openPrice, high, low, close, volume].map(n =>
                  Number(n)
                );
              }).sort((a, b) => {
                return a[0] - b[0];
              }).concat(this.chartData);
              this.fetchAllResursive(symbol, interval, text, last);
            } else {
              this.$root.$emit("updatedInterval", {symbol, interval});
            }
          })
          .catch((error) => {
            this.$root.$emit("updatedInterval", {symbol, interval});
            console.log(error);
          });
        }
      },
      updateInterval(symbol, interval, text){
        this.stopRun = 0;
        if (symbol === this.live) {
          let last = this.yesterday;
          symbol = symbol.split(":")[0];
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
            case 'MAX':
              last = new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA");
              text = '1/week';
              break;
            default:
              break;
          }
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/forex/${symbol}/${text}/${last}/${this.today}?limit=3000&apikey=${this.finageApiKey}&sort=desc`
          )
          .then((response) => {
            if (response.totalResults) {
              this.chartData = response.results.map(o => {
                const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
                return [timestamp, openPrice, high, low, close, volume].map(n =>
                  Number(n)
                );
              }).sort((a, b) => {
                return a[0] - b[0];
              });
              this.$root.$emit("updatedInterval", {symbol, interval});
              if (interval === "MAX") {
                this.stopRun = 1;
                this.fetchAllResursive(symbol, interval, text, last);
              }
            }
          })
          .catch((error) => {
            console.log("finage err:",error);
          });
        }
      },
    },
    created() {
      this.$root.$on('updateCommodity', (item) => {
        if(item.name.replace(/ /g, '-').toLowerCase() === this.symbol){
          let i = this.commodities.findIndex(index => index.symbol === item.symbol);
          this.$set(this.item, 'name', this.commodities[i].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
          this.loading = false;
        }
      });
      this.$root.$on("changeInterval", ({symbol, interval, text}) => {
        this.updateInterval(symbol, interval, text);
      })
      this.fetchDetails();
      this.fetchPrice();
      this.checkMarketStatus();
      this.fetchAggregates();
      this.fetchNews();
      setInterval(() => {
        this.fetchNews()
      }, 300000)
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
    }
  }

</script>
