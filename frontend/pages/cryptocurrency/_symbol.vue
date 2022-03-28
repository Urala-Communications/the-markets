<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status" />
    </div>
  </div>
  <Item
    v-else
    :item="item"
    type="cryptocurrency"
    :news="news"
    :profile="profile"
    :open="open"
    :close="close"
    :high="high"
    :low="low"
    :volume="volume"
    :marketCap="marketCap"
    :yearHigh="yearHigh"
    :yearLow="yearLow"
    :chartData="chartData"
    :chartOptions="chartOptions"
    :marketStatus="marketStatus"
    :symbol="symbol"
    :live="live"
    ref="Item"
  />
</template>

<script>
import Item from "~/components/Item.vue";
export default {
  components: {
    Item,
  },
  data() {
    return {
      finageApiKey: process.env.finageApiKey,
      liveApiUrl: process.env.liveApiUrl,
      item: {
        name: '',
        price: 0,
        icon: "",
      },
      profile: {},
      open: 0,
      close: 0,
      high: 0,
      low: 0,
      volume: 0,
      marketCap: 0,
      yearHigh: 0,
      yearLow: 0,
      news: [],
      loading: true,
      symbol: "",
      marketStatus: "",
      cryptocurrency: [],
      chartData: [],
      chartOptions: null,
      live: "",
      subindex: 2,
      cryptoWS: new WebSocket(`wss://stream.binance.com/stream`),
      yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
      today: new Date(Date.now()).toLocaleDateString("fr-CA"),
      fiveYearsAgo: new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA"),
      stopRun: 0,
      coins: [],
    };
  },
  head() {
    return {
      title:
        this.symbol.toUpperCase().replace("-", " ") +
        " $" +
        this.item.price +
        " - " +
        "The Markets - Live Charts for Financial Markets & the Global Community of Traders. Bitcoin, Ethereum, Doge, Shiba, Memes, Crypto, Indices, Stocks, Forex, Bonds, CFDs and more.",
    };
  },
  async asyncData({ params }) {
    const symbol = params.symbol;
    return { symbol };
  },
  methods: {
    fetchDetails() {
      this.$axios
        .$get(
          `https://api.finage.co.uk/detail/cryptocurrency/${this.item.symbol}?apikey=${this.finageApiKey}`
        )
        .then((response) => {
          this.profile = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkBackground(){
      const self = this;
      document.querySelectorAll('.icon').forEach(function(icon) {
        if (window.getComputedStyle(icon).backgroundImage == "none") {
          icon.style.backgroundImage  = ('url("'+self.item.logo+'")');
        }
      });
    },
    fetchPrice() {
     
      this.$axios
        .$get(
          `https://api.finage.co.uk/last/crypto/detailed/${this.item.symbol.toUpperCase()+"USD"}?apikey=${this.finageApiKey}`
        )
        .then((response) => {
          this.open = response.open.toFixed(2);
          this.close = response.close.toFixed(2);
          this.high = response.high.toFixed(2);
          this.low = response.low.toFixed(2);
          this.volume = response.volume.toFixed(2);
          this.marketCap = response.marketCap.toFixed(2);
          this.yearHigh = response.yearHigh.toFixed(2);
          this.yearLow = response.yearLow.toFixed(2);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkMarketStatus() {
      this.$axios
        .$get(
          `https://api.finage.co.uk/marketstatus?apikey=${this.finageApiKey}`
        )
        .then((response) => {
          this.marketStatus = response.currencies.crypto;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchAggregates() {
      
      // this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${this.finageApiKey}`)
      this.$axios.$get(`https://api.binance.com/api/v3/klines?limit=1000&symbol=${this.item.symbol.toUpperCase()+"USDT"}&interval=1d`)
        .then((response) => {
          this.chartData = response.map(o => {
            const [timestamp, openPrice, high, low, close, volume] = [...o];
            return [timestamp, openPrice, high, low, close, volume].map(n =>
              Number(n)
            );
          })
          //this.symbol = i.symbol;
          this.live = this.item.symbol.toUpperCase()+"USDT";
          let last = this.chartData[this.chartData.length - 1];
          this.open = last[1];
          this.high = last[2]
          this.low = last[3];
          this.close = last[4];
          this.volume = last[5];
          this.loading = false;
          if (this.cryptoWS.readyState === 1) {
            this.cryptoWS.send(`{"method":"SUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${this.subindex}}`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    subscribeTrade(){
      this.cryptoWS.onopen = () => {
        if (this.live)
          this.cryptoWS.send(`{"method":"SUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${this.subindex}}`);
      }
    },
    listenTrade(){
      this.cryptoWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if (data.stream == `${this.live.toLowerCase()}@aggTrade`) {
          this.$root.$emit("updateTrade",
          {
            symbol: this.live,
            time: data.data.E,
            price: Number(data.data.p),
            volumn: Number(data.data.q),
          });
        }
      }
    },
    unsubscribeTrade(){
      this.cryptoWS.send(`{"method":"UNSUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${this.subindex}}`);
    },
    fetchAllResursive(symbol, interval,  lastdate){
      if (this.stopRun) {
        let last =  new Date(Date.parse(lastdate) - 864e5 * 365 * 5 ).toLocaleDateString("fr-CA");
        this.$axios
          .$get(
            `https://api.finage.co.uk/agg/crypto/${symbol.slice(0,-1)}/1/week/${last}/${lastdate}?apikey=${this.finageApiKey}`
          )
          .then((response) => {
            if (response.results) {
              this.chartData = response.results.map(o => {
                const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
                return [timestamp, openPrice, high, low, close, volume].map(n =>
                  Number(n)
                );
              }).concat(this.chartData);

              this.fetchAllResursive(symbol, interval,  last);
            } else {
              this.$root.$emit("updatedInterval", {symbol, interval});
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    updateInterval(symbol, interval){
      this.stopRun = 0;
      if (symbol === this.live) {
        if (interval !== "MAX") {
          this.$axios
          .$get(
            `https://api.binance.com/api/v3/klines?limit=1000&symbol=${symbol}&interval=${interval}`
          )
          .then((response) => {
  
            this.chartData = response.map(o => {
              const [timestamp, openPrice, high, low, close, volume] = [...o];
              return [timestamp, openPrice, high, low, close, volume].map(n =>
                Number(n)
              );
            });
  
            this.$root.$emit("updatedInterval", {symbol, interval});
          })
          .catch((error) => {
            console.log(error);
          });
        } else {
          this.stopRun = 1;
          this.$axios
          .$get(
            `https://api.finage.co.uk/agg/crypto/${symbol.slice(0,-1)}/1/week/${this.fiveYearsAgo}/${this.today}?apikey=${this.finageApiKey}`
          )
          .then((response) => {
            if (response.results) {
              this.chartData = response.results.map(o => {
                const [timestamp, openPrice, high, low, close, volume] = [o.t, o.o, o.h, o.l, o.c, o.v];
                return [timestamp, openPrice, high, low, close, volume].map(n =>
                  Number(n)
                );
              });
              this.$root.$emit("updatedInterval", {symbol, interval});
              this.fetchAllResursive(symbol, interval,  this.fiveYearsAgo);
            }
          })
          .catch((error) => {
            this.$root.$emit("updatedInterval", {symbol, interval});
            console.log(error);
          });
        }
      }
    },
    fetchNews() {
      
      this.$axios
        .$get(
          `https://api.finage.co.uk/news/cryptocurrency/${this.item.symbol}?apikey=${this.finageApiKey}`
        )
        .then((response) => {
          // filter matching articles
          // let index = newsfeed.findIndex(x => x.title === response.news[0].title);
          // if(index === -1){
          //   newsfeed.push(response.news[0])
          // }
          //console.log("NEWS");
          // console.log(response)
          this.news = response.news;
          // ?type=video
          // this.news.video = true;
          if (this.news.length > 16) {
            this.news.pop();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    findCoin(){
      return this.$store.getters.GET_COINS.find(coin => coin.name.toLowerCase().replace(" ", "-") == this.symbol.toLowerCase());
    },
    async searchCoin(slug){
      try {
        return this.$axios
          .$get(`/api/search?slug=${slug}`);
      } catch (error) {
        return null;
      }
    },
    fetchInfos(){
      this.$set(this.item, 'icon', this.item.symbol);
      this.fetchDetails();
      this.checkMarketStatus();
      this.fetchPrice();
      this.fetchAggregates();
      this.fetchNews();
    }
  },
  created() {
    const self = this;
    
    this.$root.$on("updateCrypto", (item) => {
      if (item.symbol === this.symbol.replace("-", " ")) {
        //this.$set(this.item, "price", item.price);
        this.$set(this.item, "difference", item.difference);
        this.$set(this.item, "change", item.change);
        this.$set(this.item, "time", item.time);
      }
    });

    this.$root.$on("updateTrade", ({symbol, time, price, volumn}) => {
      if (symbol === this.live) {
        this.$set(this.item, "price", price);
      }
    })

    async function checkCryptoList() {
      if (self.$store.getters.COINS_LENGTH) {
          
          self.cryptocurrency =  self.$store.getters.GET_COINS;

          self.item =  Object.assign({},self.findCoin() ) ;
          if (Object.keys(self.item).length === 0) {
            let thiscoin = await self.searchCoin(self.symbol.toLowerCase().replace(" ", "-").trim());
            if (thiscoin.hasOwnProperty("id")) {
              self.symbol = thiscoin.symbol;
              self.item = {... self.item, ...thiscoin };              
            }
            self.fetchInfos();
          } else {
            self.fetchInfos();
          }
        } else {
            setTimeout(checkCryptoList, 50);
        }
    }
    setTimeout(checkCryptoList, 50);   
    
    this.$root.$on("changeInterval", ({symbol, interval, text}) => {
      this.updateInterval(symbol, interval, text);
    })
    this.subscribeTrade();
    this.listenTrade();
    // 
    // setInterval(() => {
    //     this.fetchNews();
    // }, 300000);
    setInterval(() => {
      this.checkMarketStatus();
    }, 300000);
  },
  mounted() {
    this.checkBackground();
    window.addEventListener('scroll', this.checkBackground);
  },
  beforeDestroy() {
    this.unsubscribeTrade();
    this.cryptoWS.close();
  },
};
</script>
