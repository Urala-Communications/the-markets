<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="currencies"
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
import {currencies, indices} from "../../market.js";
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
        currencies,
        indices,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),        
      }
    },
    head() {
      return {
        title: this.symbol.replace('-','').toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets - Live Charts for Financial Markets & the Global Community of Traders. Bitcoin, Ethereum, Doge, Shiba, Memes, Crypto, Indices, Stocks, Forex, Bonds, CFDs and more.'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      fetchDetails() {
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();  
        let i = this.currencies.find(x => x.symbol === itemSymbol);  
        if(itemSymbol === 'DOLLARINDEX'){
          i = this.currencies.find(x => x.symbol === "DXY");  
        }      
        if (i) {
          this.$set(this.item, 'icon', i.icon);
          this.$set(this.item, 'name', i.name);
        }
        if(itemSymbol !== 'DOLLARINDEX'){
          this.$axios.$get(`https://api.finage.co.uk/agg/forex/prev-close/${itemSymbol}?apikey=${this.finageApiKey}`)
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
        }
      },
      fetchPrice() {        
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        let priceType = `trade/forex/${itemSymbol}`;
        if (this.symbol === 'dollar-index'){
          priceType = 'index/dxy';
        }
        this.$axios.$get(`https://api.finage.co.uk/last/${priceType}?apikey=${this.finageApiKey}`)
        .then(response => {

          this.item.price = response.price.toFixed(4);
          this.$set(this.item, 'icon', this.item.icon);
          this.loading = false;
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
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();        
        if(itemSymbol !== 'DOLLARINDEX'){
          let last = new Date(Date.now() - 864e5 * 7).toLocaleDateString("fr-CA");
          this.$axios.$get(`https://api.finage.co.uk/agg/forex/${itemSymbol}/1/hour/${last}/${this.today}?limit=1825&apikey=${this.finageApiKey}&sort=desc`)
          .then(response => {            
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
            let last = this.chartData.pop();
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
        }
      },
      fetchNews(){
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        this.$axios.$get(`https://api.finage.co.uk/news/forex/${itemSymbol}?apikey=${this.finageApiKey}`)
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
              last = new Date(Date.now() - 864e5 * 7).toLocaleDateString("fr-CA");
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
            `https://api.finage.co.uk/agg/forex/${symbol}/${text}/${last}/${this.today}?limit=3000&apikey=${this.finageApiKey}&sort=desc`
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
      this.$root.$on('updateCurrency', (item) => {
        let itemSymbol = this.symbol.replace('-', '').toUpperCase();
        if(item.symbol === itemSymbol){          
          this.$set(this.item, 'name', this.currencies[item.indexFound].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
          this.loading = false;
        }
      });
      this.$root.$on('updateIndice', (item) => {
        if(item.name.replace(/ /g, '-').toLowerCase() === this.symbol){
          let i = this.indices.findIndex(index => index.name.toLowerCase() === item.name.toLowerCase());
          this.$set(this.item, 'name', this.indices[i].name);
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
