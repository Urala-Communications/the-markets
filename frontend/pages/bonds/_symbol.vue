<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="bonds"
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
import {bonds} from "../../market.js";
import Item from '~/components/Item.vue'
export default {
    components: {
      Item
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
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
        bonds,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA")
      }
    },
    head() {
      return {
        title: this.symbol.replace(/-/g,' ').toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      fetchDetails() {
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        this.$axios.$get(` https://api.finage.co.uk/agg/index/${itemSymbol}/1day/2021-02-05/2021-03-02?apikey=${this.finageApiKey}`)
        .then(response => {
            this.open = response.results[0].o;
            this.high = response.results[0].h;
            this.low = response.results[0].l;
            this.close = response.results[0].c;
            this.volume = response.results[0].v;
            console.log("Details")
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchPrice() {
        // Number.prototype.toFixed = function(n) {
        //   return this.toLocaleString(undefined, {
        //     minimumFractionDigits: n,
        //     maximumFractionDigits: n
        //   });
        // };
        let i = this.bonds.find(item => item.name.toLowerCase() === this.symbol.replace(/-/g, ' '));
        this.$set(this.item, 'name', i.name);
        this.$axios.$get(`https://api.finage.co.uk/bonds/us/rate/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Price")
          console.log(response)
          this.item.price = response.value.toFixed(2);
          this.$set(this.item, 'icon', i.icon);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
      },
      checkMarketStatus(){
        this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`)
        .then(response => {
          this.marketStatus = response.nasdaq;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAggregates(){
        let i = this.bonds.find(item => item.name.toLowerCase() === this.symbol.replace(/-/g, ' '));
        this.$axios.$get(`https://api.finage.co.uk/agg/index/${i.symbol}/1day/2021-01-01/${this.yesterday}?limit=1825&apikey=${this.finageApiKey}`)
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
              this.symbol = itemSymbol;
              this.live = itemSymbol;
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
                this.symbol = i.symbol;   
                this.live = i.symbol;           
                let last = this.chartData[this.chartData.length - 1];
                this.open = last[1];
                this.high = last[2]
                this.low = last[3];
                this.close = last[4];
                this.volume = last[5];
                this.loading = false;
                this.$set(this.item, 'price', last[4].toFixed(2));
              }
            }).catch(err => {
              console.log("tradingeconomic err: ",err)
            })
            }
          })
          .catch(error => {
            console.log(error);
            this.chartData = [];
            this.loading = false;
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
            case 'MAX':
              last = new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA");
              text = '1/week';
              break;
            default:
              break;
          }
          
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/index/${i.symbol}/${text}/${last}/${this.yesterday}?limit=3000&apikey=${this.finageApiKey}&sort=desc`
          )
          .then((response) => {
            
            this.chartData = response.results.map(o => {
              const [timestamp, openPrice, high, low, close, volume] = [(new Date(o.t)).getTime(), o.o, o.h, o.l, o.c, o.v];
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
      fetchNews(){
        let i = this.bonds.find(item => item.name.toLowerCase() === this.symbol.replace(/-/g, ' '));
        this.$axios.$get(`https://api.finage.co.uk/news/forex/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          let filteredNews = response.news.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i); // filter duplicates from API - may need to also filter this.news on each fetch
          console.log('NEWS')
          console.log(filteredNews)
          this.news = filteredNews;
          if(this.news.length > 10){
            this.news.pop()
          }
        })
        .catch(error => {
          console.log(error);
        })
      },
    },
    created() {
      this.$root.$on('updateBond', (item) => {
        if(item.name.replace(/ /g, '-').toLowerCase() === this.symbol){
          let i = this.bonds.findIndex(index => index.name.toLowerCase() === item.name.toLowerCase());
          this.$set(this.item, 'name', this.bonds[i].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
          this.loading = false;
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
      // this.fetchDetails();
      this.fetchPrice();
      // this.checkMarketStatus();
      this.fetchAggregates();
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
      this.fetchNews();
      setInterval(() => {
        this.fetchNews()
      }, 300000)
    }
  }

</script>
