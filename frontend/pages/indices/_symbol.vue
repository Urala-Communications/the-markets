<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <Item v-else
    :item="item"
    type="indices"
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
import {indices} from "../../market.js";
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
        indices,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        stopRun: 0,
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
      fetchPrice() {
        let i = this.indices.find( item => item.name.replace(/ /g, '-').toLowerCase() === this.symbol);
        this.$set(this.item, 'name', i.name);
        this.$axios.$get(`https://api.finage.co.uk/last/index/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          this.item.price = response.price.toFixed(2);
          this.item.priceNumber = response.price;
          this.$set(this.item, 'icon', i.icon);
          this.$set(this.item, 'price', i.price);
          this.loading = false;
        })
        .then(() => {
          this.fetchAggregates();
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
        let i = this.indices.find( item => item.name.replace(/ /g, '-').toLowerCase() === this.symbol);
        let last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
        this.$axios.$get(`https://api.finage.co.uk/agg/index/${i.symbol}/1day/${last}/${this.today}?limit=1825&apikey=${this.finageApiKey}&sort=desc`)
        .then(response => {

          this.chartData = response.results.map(o => {
            const [ timestamp, openPrice, high, low, close, volume] = [(new Date(o.t)).getTime(), o.o, o.h, o.l, o.c, o.v];
            return [ timestamp, openPrice, high, low, close, volume].map(n =>
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
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchAllResursive(symbol, interval, range, lastdate){
        if (this.stopRun) {
          let last =  new Date(Date.parse(lastdate) - 864e5 * 365 * 5 ).toLocaleDateString("fr-CA");
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/index/${symbol}/${range}/${last}/${lastdate}?limit=3000&apikey=${this.finageApiKey}&sort=asc`
          )
          .then((response) => {
            if (!response.results || response.results.length) {
              this.chartData = response.results.map(o => {
                const [timestamp, openPrice, high, low, close, volume] = [(new Date(o.t)).getTime(), o.o, o.h, o.l, o.c, o.v];
                return [timestamp, openPrice, high, low, close, volume].map(n =>
                  Number(n)
                );
              }).sort((a, b) => {
                return a[0] - b[0];
              }).concat(this.chartData);
              this.$root.$emit("updatedInterval", {symbol, interval});
              this.fetchAllResursive(symbol, interval, range, last);
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
          let range = interval;
          let last = this.yesterday;
          switch (interval) {
            case '1m':
              range = '1min';
              last = this.yesterday;
              break;
            case '5m':
              range = '5min';
              last = this.yesterday;
              break;
            case '15m':
              range = '15min';
              last = this.yesterday;
              break;
            case '30m':
              range = '30min';
              last = new Date(Date.now() - 864e5 * 7).toLocaleDateString("fr-CA");
              break;
            case '1h':
              range = '1h';
              last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
              break;
            case '4h':
              range = '4h';
              last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
              break;
            case '1d':
              range = '1day';
              last = new Date(Date.now() - 864e5 * 365).toLocaleDateString("fr-CA");
              break;
            case '1w':
              range = '1week';
              last = new Date(Date.now() - 864e5 * 365).toLocaleDateString("fr-CA");
              break;
            case '1M':
              range = '1month'
              last = new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA");
              break;
            case 'MAX':
              range = '1week'
              last = new Date(Date.now() - 864e5 * 365 * 15).toLocaleDateString("fr-CA");
            default:
              break;
          }
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/index/${symbol}/${range}/${last}/${this.today}?limit=3000&apikey=${this.finageApiKey}&sort=asc`
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
            if (interval === "MAX") {
              this.stopRun = 1;
              this.fetchAllResursive(symbol, interval, range, last);
            }
          })
          .catch((error) => {
            console.log(error);
          });
        }
      },
    },
    created() {
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
      this.fetchPrice();
      this.checkMarketStatus();
      setInterval(() => {
        this.checkMarketStatus()
      }, 300000);
    }
  }
</script>
<style lang="scss">
.loading-logo{
  background-image: url('./../../assets/logo-white.svg');
  width: 5rem;
  height: 5rem;
  background-repeat: no-repeat;
  background-color: #242424;
  border-radius: 50%;
  background-size: 60%;
  background-position: center;
  animation: blink 0.6s ease-in infinite alternate;
}
</style>
