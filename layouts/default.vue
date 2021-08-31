<template>
  <div>
    <Header ref="header"/>
    <Ad headerAd/>
    <Nuxt/>
    <Footer/>
  </div>
</template>

<script>
import Header from "./../components/Header.vue";
import Footer from "./../components/Footer.vue";
import Ad from "./../components/Ad.vue";
import {cryptocurrency, currencies, stocks, indices, bonds, rising, commodities} from "./../market.js";
// import { gsap } from "gsap";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// gsap.registerPlugin(DrawSVGPlugin);
export default {
  components: {
    Header,
    Footer,
    Ad
  },
  data() {
    return {
      forexWS: new WebSocket(`wss://w29hxx2ndd.finage.ws:8001/?token=${process.env.FINAGE_SOCKET_KEY}`),
      cryptoWS: new WebSocket(`wss://mZ3Zq4NXbp.finage.ws:6002/?token=${process.env.FINAGE_SOCKET_KEY}`),
      stockWS: new WebSocket(`wss://m2s3swr9mp.finage.ws:7005/?token=${process.env.FINAGE_SOCKET_KEY}`),
      indicesWS: new WebSocket(`wss://8umh1cipe9.finage.ws:9001/?token=${process.env.FINAGE_SOCKET_KEY}`),
      loading: false,
      view: 'list',
      cryptocurrency,
      currencies,
      stocks,
      indices,
      bonds,
      rising,
      commodities,
      chartData: null,
      chartOptions: null,
      newsData: [],
      mobileNavOpen: false,
      marketStatus: {}
    }
  },
  head() {
    return {
      htmlAttrs: {
        class: this.mobileNavOpen ? 'overflow-hidden' : ''
      }
    }
  },
  methods: {
    connectSockets() {
      Number.prototype.toLocaleFixed = function(n) {
        return this.toLocaleString(undefined, {
          minimumFractionDigits: n,
          maximumFractionDigits: n
        });
      };

      // FOREX
      this.forexWS.onopen = () => {
        this.loading = true;
        // console.log("FOREX Socket connection established");
        this.forexWS.send(JSON.stringify({"action": "subscribe", "symbols": "EUR/USD,USD/JPY,USD/KRW,USD/TRY,GBP/USD,USD/BRL,USD/ILS,USD/RUB,XAU/USD,XAG/USD,WTI/USD,XBR/USD"}));
      }
      this.forexWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if(typeof data.s !== 'undefined'){
          let item = this.currencies.find(index => index.name === data.s);
          item.difference = Number(data.dd).toLocaleFixed(2);
          item.change = Number(data.dc).toLocaleFixed(2);
          if(item.type === 'commodity'){
            item.price = Number(data.a).toLocaleFixed(2);
            item.marketOpen = true;
            this.$root.$emit('updateCommodity', item);
          } else {
            item.price = Number(data.a).toLocaleFixed(4);
            item.marketOpen = true;
            this.$root.$emit('updateCurrency', item);
          }
        }
        this.loading = false;
      }
      this.forexWS.onerror = (error) => {
        console.log(error)
      }
      this.forexWS.onclose = () => {
        console.log('CLOSED FOREX WEBSOCKET')
      }

      // CRYPTO
      this.cryptoWS.onopen = () => {
        this.loading = true;
        // console.log("CRYPTO Socket connection established");
        this.cryptoWS.send(JSON.stringify({"action": "subscribe", "symbols": "BTCUSD,ETHUSD,IOTAUSD,ADAUSD,XRPUSD,DOTUSD,DOGEUSD"}))
      }
      this.cryptoWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if(this.cryptocurrency.find(index => index.symbol === data['s'])){
          let item = this.cryptocurrency.find(index => index.symbol === data['s']);
          item.price = Number(data['p']).toLocaleFixed(2);
          item.difference = Number(data['dd']).toLocaleFixed(2);
          item.change = Number(data['dc']).toLocaleFixed(2);
          item.time = data['t'];
          item.marketOpen = true;
          this.$root.$emit('updateCrypto', item);
        }
        this.loading = false;
      }
      this.cryptoWS.onerror = (error) => {
        console.log(error)
      }
      this.cryptoWS.onclose = () => {
        console.log('CLOSED CRYPTO WEBSOCKET')
      }

      // STOCKS
      this.stockWS.onopen = () => {
        this.loading = true;
        // console.log("STOCK Socket connection established");
        this.stockWS.send(JSON.stringify({"action": "subscribe", "symbols": "AAPL,AMZN,BA,BABA,FB,MSFT,MRNA,NIO,NVDA,PFE,PLTR,SAN,TSLA,XPEV,GME,AMC,BB"}));
      }
      this.stockWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        // console.log(data)
        if(this.stocks.find(index => index.symbol === data['s'])){
          let item = this.stocks.find(index => index.symbol === data['s']);
          item.price = Number(data['a']).toLocaleFixed(2);
          item.difference = Number(data['dd']).toLocaleFixed(2);
          item.change = Number(data['dc']).toLocaleFixed(2);
          if(this.marketStatus.market === 'open'){
            item.marketOpen = true;
          }
          this.$root.$emit('updateStock', item);
        }
        this.loading = false;
      }
      this.stockWS.onerror = (error) => {
        console.log(error)
      }
      this.stockWS.onclose = () => {
        console.log('CLOSED STOCK WEBSOCKET')
      }

      // INDICES
      this.indicesWS.onopen = () => {
        this.loading = true;
        // console.log("INDICES Socket connection established");
        this.indicesWS.send(JSON.stringify({"action": "subscribe", "symbols": "DJI,GSPC,IXIC,GDAXI,N225,HSI,SSEC,KS11,IBEX,FTSE,XU100,DGS2,DGS5,DGS10,DGS20,DGS30,DXY"}));
      }
      this.indicesWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if(this.indices.find(index => index.symbol === data['s'])){
          let item = this.indices.find(index => index.symbol === data['s']);
          // dc: "0.1301" // dd: "19.7504" // p: 15178.1 // s: "GDAXI" // t: 1620914109
          item.price = Number(data['p']).toLocaleFixed(2);
          item.difference = Number(data['dd']).toLocaleFixed(2);
          item.change = Number(data['dc']).toLocaleFixed(2);
          // if(this.marketStatus.exchanges.nasdaq){
            // need asian market indicators
            item.marketOpen = true;
          // }
          this.$root.$emit('updateIndice', item);
        }
        this.loading = false;
      }
      this.indicesWS.onerror = (error) => {
        console.log(error)
      }
      this.indicesWS.onclose = () => {
        console.log('CLOSED INDICES WEBSOCKET')
      }
    },
    fetchStocks() {
      this.$axios.$get(`https://api.finage.co.uk/last/stocks/?symbols=AAPL,AMZN,BA,BABA,FB,MSFT,MRNA,NIO,NVDA,PFE,PLTR,SAN,TSLA,XPEV,GME,AMC,BB&apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        response.forEach(item => {
          let i = this.stocks.find( stock => stock.symbol === item.symbol );
          i.price = Number(item.ask).toLocaleFixed(2);
          i.priceNumber = item.ask
          this.$root.$emit('updateStock', i);
        });
      })
      .then(() => {
        this.stocks.forEach(item => {
          this.$axios.$get(`https://api.finage.co.uk/agg/stock/${item.symbol}/1/day/2021-01-01/2021-06-01?limit=1825&&apikey=${process.env.FINAGE_API_KEY}`)
          .then(response => {
            let i = this.stocks.find( stock => stock.symbol === response.symbol );
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
      this.$axios.$get(`https://api.finage.co.uk/last/trade/forex/${symbol}?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        let i = this.currencies.find(currency => currency.symbol === response.symbol );
        if(i.type === 'commodity'){
          i.price = Number(response.price).toLocaleFixed(2);
          this.$root.$emit('updateCommodity', i);
        } else {
          i.price = Number(response.price).toLocaleFixed(4);
          this.$root.$emit('updateCurrency', i);
        }
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchIndice(symbol) {
      this.$axios.$get(`https://api.finage.co.uk/last/index/${symbol}?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        let i = this.indices.find( indice => indice.symbol === response.symbol );
        i.price = response.price.toLocaleFixed(2);
        i.priceNumber = response.price
        this.$root.$emit('updateIndice', i);
      })
      .then(() => {
        this.$axios.$get(`https://api.finage.co.uk/agg/index/${symbol}/1day/2021-01-01/2021-06-01?limit=1825&&apikey=${process.env.FINAGE_API_KEY}`)
        .then(response => {
          let i = this.indices.find( indice => indice.symbol === response.symbol );
          let last = response.results.pop();
          i.difference = i.priceNumber - last.c
          i.difference = i.difference.toFixed(2)
          i.change = (i.priceNumber - last.c) / last.c * 100
          i.change = i.change.toFixed(2)
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
    fetchCrypto(symbol) {
      this.$axios.$get(`https://api.finage.co.uk/last/crypto/${symbol}?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        let i = this.cryptocurrency.find( crypto => crypto.symbol === response.symbol );
        i.price = Number(response.price).toLocaleFixed(2);
        // if(i.symbol === 'DOGEUSD') {
        //   this.$root.$emit('updateRising', i);
        // } else {
          this.$root.$emit('updateCrypto', i);
        // }
        // console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchBonds(symbol) {
      this.$axios.$get(`https://api.finage.co.uk/bonds/us/rate/${symbol}?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        // console.log(response)
        let i = this.indices.find( indice => indice.symbol === response.symbol );
        i.price = Number(response.value).toLocaleFixed(4);
        this.$root.$emit('updateBond', i);
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchMovers() {
      this.$axios.$get(`https://api.finage.co.uk/market-information/us/most-gainers?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        // console.log(response)
        // this.rising = response;
        // let i = this.indices.find( indice => indice.symbol === response.symbol );
        // i.price = Number(response.value).toLocaleFixed(2);
        this.$root.$emit('updateRising', response);
      })
      .catch(error => {
        console.log(error);
      })
    },
    checkMarketStatus(){
      this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${process.env.FINAGE_API_KEY}`)
      .then(response => {
        this.marketStatus = response;
      })
      .catch(error => {
        console.log(error);
      })
    },
    connect(){
      this.connectSockets();
      this.fetchStocks();
      this.currencies.forEach(item => {
        this.fetchCurrency(item.symbol);
      });
      this.indices.forEach(item => {
        if (item.type !== 'currency'){
          if (item.type !== 'indice'){
            this.fetchBonds(item.symbol);
          } else {
            this.fetchIndice(item.symbol);
          }
        }
      });
      this.cryptocurrency.forEach(item => {
        this.fetchCrypto(item.symbol);
      });
      this.fetchMovers();
      setInterval(() => {
        this.fetchMovers()
      }, 300000)
      this.checkMarketStatus();
    },
    showGrid() {
      this.view = 'grid';
    },
    showList() {
      this.view = 'list';
    },
  },
  created() {
    this.connect();
    setInterval(() => {
      this.connect()
    }, 60000);
    this.$root.$on('bv::collapse::state', (id, collapsed) => {
      if (id === "sidebar") {
        this.mobileNavOpen = collapsed;
      }
    });
  },
  beforeDestroy() {
    this.forexWS.close();
    this.cryptoWS.close();
    this.stockWS.close();
    this.indicesWS.close();
  },
//   mounted() {
//     gsap.to(".navbar-brand", {x:300, duration:2, delay: 1, repeat: -1, yoyo:true})
//   }
  watch: {
    $route () {
      // console.log('route changed', this.$route);
      this.$refs.header.closeNav();
      this.connect();
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap');
html, body {
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  overflow-x: hidden;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body{
  margin-top: 104px;
  background: #f5f3f1;
}
@media(max-width: 1200px){
  body{
    margin-top: 92px;
  }
}
@media(max-width: 750px){
  body{
    margin-top: 59px;
  }
}

.up p{
  color: $green;
}
.down p{
  color: $red;
}

a {
  color: #222;
  transition: 0.3s ease-in-out;
  &:hover {
    text-decoration: none;
    color: $blue;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

@media(min-width: 1200px){
  .container{
    max-width: 1280px;
  }
}

@media(min-width: 992px) and (max-width: 1199px){
  .container{
    max-width: 100%;
  }
}

</style>
