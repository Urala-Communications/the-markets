<template>
  <div v-if="loading">
    <div
      class="
        container
        d-flex
        justify-content-around
        w-50
        pt-5
        vh-100
        text-center
      "
    >
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
let date = new Date();
date.setDate(date.getDate() - 1826);
let fiveYearsAgo = date.toLocaleDateString("fr-CA");
import { cryptocurrency } from "../../market.js";
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
      cryptocurrency,
      chartData: [],
      initData: [],
      tickData: [],
      livegroupData: [],
      chartOptions: null,

      live: "",
      subindex: 2,
      cryptoWS: new WebSocket(`wss://stream.binance.com/stream`),

      yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
      today: new Date(Date.now()).toLocaleDateString("fr-CA"),
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
      // let i = this.cryptocurrency.find( item => item.name.toLowerCase() === this.symbol);
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );
      this.$axios
        .$get(
          `https://api.finage.co.uk/detail/cryptocurrency/${i.icon}?apikey=${this.finageApiKey}`
        )
        .then((response) => {
          // console.log("Details")
          this.profile = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchPrice() {
      // Number.prototype.toFixed = function (n) {
      //   return this.toLocaleString(undefined, {
      //     minimumFractionDigits: n,
      //     maximumFractionDigits: n,
      //   });
      // };
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );
      this.$axios
        .$get(
          `https://api.finage.co.uk/last/crypto/detailed/${i.symbol}?apikey=${this.finageApiKey}`
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
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );
      // this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${this.finageApiKey}`)
      this.$axios
        .$get(
          `https://api.binance.com/api/v3/klines?limit=1000&symbol=${i.live}&interval=1d`
        )
        .then((response) => {
          //console.log("Aggregates");
          this.chartData = response.map(o => {
            const [timestamp, openPrice, high, low, close, volume] = [...o];
            return [timestamp, openPrice, high, low, close, volume].map(n =>
              Number(n)
            );
          })
          this.symbol = i.symbol;
          this.live = i.live;         
          
          let last = this.chartData.pop();
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
    updateInterval(symbol, interval){
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
    },
    
    
    fetchNews() {
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );
      this.$axios
        .$get(
          `https://api.finage.co.uk/news/cryptocurrency/${i.icon}?apikey=${this.finageApiKey}`
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
  },
  created() {
    this.$root.$on("updateCrypto", (item) => {
      
      if (item.symbol === this.symbol.replace("-", " ")) {
        /* let i =  this.cryptocurrency.findIndex(
           (index) => index.name.toLowerCase() === item.name.toLowerCase()
        ); */
        this.$set(this.item, "name", this.cryptocurrency[item.indexFound].name);
        //this.$set(this.item, "price", item.price);
        this.$set(this.item, "difference", item.difference);
        this.$set(this.item, "change", item.change);
        this.$set(this.item, "icon", item.icon);
        this.$set(this.item, "time", item.time);
      }
    });
    this.$root.$on("updateTrade", ({symbol, time, price, volumn}) => {
      
      if (symbol === this.live) {
        this.$set(this.item, "price", price);
      }
    })
    

    this.fetchDetails();
    this.checkMarketStatus();
    this.fetchAggregates();
    this.fetchPrice();

    this.$root.$on("changeInterval", ({symbol, interval}) => {
      this.updateInterval(symbol, interval);
    })
    this.subscribeTrade();
    this.listenTrade();
    

    // this.fetchNews();
    // setInterval(() => {
    //     this.fetchNews();
    // }, 300000);
    setInterval(() => {
      this.checkMarketStatus();
    }, 300000);
  },
  beforeDestroy() {
    this.unsubscribeTrade();
    this.cryptoWS.close();
  },
};
</script>
