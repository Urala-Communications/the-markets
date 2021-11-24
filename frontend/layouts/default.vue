<template>
  <div>
    <Header ref="header"/>
    <Ad headerAd/>
    <Nuxt/>
    <CookieNotice v-if="showCookieNotice"/>
    <Footer/>
  </div>
</template>

<script>
// import Header from "./../components/Header.vue";
// import Footer from "./../components/Footer.vue";
import Ad from "./../components/Ad.vue";
import {currencies, stocks, indices, bonds, rising, commodities} from "./../market.js";
// import { gsap } from "gsap";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// gsap.registerPlugin(DrawSVGPlugin);
const finageApiKey = process.env.finageApiKey,
      finageSocketKey = process.env.finageSocketKey;
// import Finage from 'finage';
// const client = new Finage({ apiKey: finageApiKey });
// async function test() {
//    const res = await client.stocks.us.lastQuote({
//     params: { symbol: 'AAPL' }, queries: { ts: 'ns' }
//   }).then(() => {
//     console.log(res)
//   })
// }
// test()

export default {
  components: {
    Header: () => import('./../components/Header'),
    Footer: () => import('./../components/Footer'),
    CookieNotice: () => import('./../components/CookieNotice'),
    Ad
  },
  async asyncData () {
    let topCoins = [];
    await this.$fire.firestore()
      .collection('cryptoTop')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          topCoins.push(doc.data());
        });
        console.log(topCoins)
      });
    return {
      topCoins
    }
  },
  data() {
    return {
      forexWS: new WebSocket(`wss://w29hxx2ndd.finage.ws:8001/?token=${finageSocketKey}`),
      cryptoWS: new WebSocket(`wss://mZ3Zq4NXbp.finage.ws:6002/?token=${finageSocketKey}`),
      stockWS: new WebSocket(`wss://m2s3swr9mp.finage.ws:7005/?token=${finageSocketKey}`),
      indicesWS: new WebSocket(`wss://8umh1cipe9.finage.ws:9001/?token=${finageSocketKey}`),
      cmcApiKey: process.env.cmcApiKey,
      loading: false,
      view: 'list',
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
      marketStatus: {},
      yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
      today: new Date(Date.now()).toLocaleDateString("fr-CA"),
      showCookieNotice: false
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
    fetchCoinsByMarketCap() {
      this.$axios.$get(`/api/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=USD&CMC_PRO_API_KEY=${this.cmcApiKey}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        json: true,
        gzip: true
      })
      .then((response) => {
        console.log(response)
        // this.writeToFirestore(response)
        this.cryptocurrency = response
        this.connect();
        setInterval(() => {
          this.connect()
        }, 60000);
      })
      .catch((error) => {
        console.log(error);
      });
    },
    // async readFromFirestore() {
    //   const coinRef = this.$fire.firestore.collection('cryptoTop').doc('coins')
    //   try {
    //     const coinDoc = await coinRef.get()
    //     console.log(coinDoc.data().topFifty)
    //   } catch(e) {
    //     console.log(e)
    //     return
    //   }
    // },
    // async writeToFirestore(coinArray) {
    //   const coinRef = this.$fire.firestore.collection('cryptoTop').doc('coins')
    //   try {
    //     await coinRef.set({
    //       topFifty: coinArray
    //     })
    //   } catch(e) {
    //     console.log(e)
    //     return
    //   }
    //   console.log('Wrote data to store successfully.')
    // },
    getGDPR() {
      if (process.browser) {
        return localStorage.getItem('GDPR:accepted', true);
      }
    },
    connectSockets() {
      // Number.prototype.toFixed = function(n) {
      //   return this.toLocaleString(undefined, {
      //     minimumFractionDigits: n,
      //     maximumFractionDigits: n
      //   });
      // };

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
          item.difference = Number(data.dd).toFixed(2);
          item.change = Number(data.dc).toFixed(2);
          item.time = data['t'];
          if(item.type === 'commodity'){
            item.price = Number(data.a).toFixed(2);
            item.marketOpen = true;
            this.$root.$emit('updateCommodity', item);
          } else {
            item.price = Number(data.a).toFixed(4);
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
        this.cryptoWS.send(JSON.stringify({"action": "subscribe", "symbols": "BTCUSD,ETHUSD,BNBUSD,ADAUSD,SOLUSD,XRPUSD,DOTUSD,DOGEUSD,SHIBUSD,LUNAUSD,AVAXUSD,LTCUSD,UNIUSD,LINKUSD,MATICUSD,ALGOUSD,VETUSD,XLMUSD,AXSUSD,FILUSD,TRXUSD,ETCUSD,ATOMUSD,THETAUSD,FTTUSD,FTMUSD,HBARUSD,DAIUSD,EGLDUSD,NEARUSD,GRTUSD,XTZUSD,XMRUSD,EOSUSD,MANAUSD,HNTUSD,CAKEUSD,AAVEUSD,LRCUSD,IOTAUSD,NEOUSD,MKRUSD,ENJUSD,DASHUSD,COMPUSD,CRVUSD,BATUSD,SUSHIUSD,ZILUSD,YFIUSD,1INCHUSD"}))
      }
      this.cryptoWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if(this.cryptocurrency.find(index => index.symbol === data['s'])){
          let item = this.cryptocurrency.find(index => index.symbol === data['s']);
          if(item.symbol === 'SHIBUSD'){
            item.price = Number(data['p']);
          } else {
            item.price = Number(data['p']).toFixed(2);
          }
          item.difference = Number(data['dd']).toFixed(2);
          item.change = Number(data['dc']).toFixed(2);
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
          item.price = Number(data['a']).toFixed(2);
          item.difference = Number(data['dd']).toFixed(2);
          item.change = Number(data['dc']).toFixed(2);
          item.time = data['t'];
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
        this.indicesWS.send(JSON.stringify({"action": "subscribe", "symbols": "DJI,GSPC,IXIC,GDAXI,N225,HSI,SSEC,KS11,IBEX,FTSE,XU100"}));
        this.indicesWS.send(JSON.stringify({"action": "subscribe", "symbols": "DJI,GSPC,IXIC,GDAXI,N225,HSI,SSEC,KS11,IBEX,FTSE,XU100,DGS2,DGS5,DGS10,DGS20,DGS30,DXY", "isCFD": false}));
      }
      this.indicesWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);

        if(typeof data.p !== 'undefined'){
          if(this.indices.find(index => index.symbol === data.s)){
            // console.log('non-CFD')
            // console.log(data.p)
            // console.log(data)
            let item = this.indices.find(index => index.symbol === data.s);
            item.price = Number(data.p).toFixed(2);
            item.difference = Number(data.dd).toFixed(2);
            item.change = Number(data.dc).toFixed(2);
            item.time = data.t;
            // if(this.marketStatus.exchanges.nasdaq){
              // need asian market indicators
              // item.marketOpen = true;
            // }
            // console.log(item)
            // console.log("")
            this.$root.$emit('updateIndice', item);
          }
        } else {
          if(this.indices.find(index => index.cfd && index.symbol === data.s)){
            // console.log('CFD')
            // console.log(data.s)
            // console.log(data)
            let item = this.indices.find(index => index.cfd && index.symbol === data.s);
            // console.log('CFD')
            // console.log(item)
            // console.log("")
            item.price = Number(data.a).toFixed(2); // ask or bid or both?
            item.difference = Number(data.dd).toFixed(2);
            item.change = Number(data.dc).toFixed(2);
            item.time = data.t;
            //item.change = Number(data.dc).toFixed(2);
            // if(this.marketStatus.exchanges.nasdaq){
              // need asian market indicators
              // item.marketOpen = true;
            // }
            this.$root.$emit('updateIndice', item);
          }
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
      this.$axios.$get(`https://api.finage.co.uk/last/stocks/?symbols=AAPL,AMZN,BA,BABA,FB,MSFT,MRNA,NIO,NVDA,PFE,PLTR,SAN,TSLA,XPEV,GME,AMC,BB&apikey=${finageApiKey}`)
      .then(response => {
        response.forEach(item => {
          let i = this.stocks.find( stock => stock.symbol === item.symbol );
          i.price = Number(item.ask).toFixed(2);
          i.priceNumber = item.ask
          this.$root.$emit('updateStock', i);
        });
      })
      .then(() => {
        this.stocks.forEach(item => {
          this.$axios.$get(`https://api.finage.co.uk/agg/stock/${item.symbol}/1/day/2021-01-01/${this.today}?limit=1825&apikey=${finageApiKey}`)
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
      this.$axios.$get(`https://api.finage.co.uk/last/trade/forex/${symbol}?apikey=${finageApiKey}`)
      .then(response => {
        let i = this.currencies.find(currency => currency.symbol === response.symbol );
        if(i.type === 'commodity'){
          i.price = Number(response.price).toFixed(2);
          this.$root.$emit('updateCommodity', i);
        } else {
          i.price = Number(response.price).toFixed(4);
          this.$root.$emit('updateCurrency', i);
        }
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchIndice(symbol) {
      this.$axios.$get(`https://api.finage.co.uk/last/index/${symbol}?apikey=${finageApiKey}`)
      .then(response => {
        let i = this.indices.find( indice => indice.symbol === response.symbol );
        i.price = response.price.toFixed(2);
        i.priceNumber = response.price;
        this.$root.$emit('updateIndice', i);
      })
      .then(() => {
        this.$axios.$get(`https://api.finage.co.uk/agg/index/${symbol}/1day/2021-01-01/${this.today}?limit=1825&apikey=${finageApiKey}`)
        .then(response => {
          // if(typeof response.p !== 'undefined'){
          //   let i = this.indices.find( indice => indice.symbol === response.symbol );
          // } else {
          //   let i = this.indices.find( indice => indice.symbol === response.symbol && indice.cfd );
          // }
          let i = this.indices.find( indice => indice.symbol === response.symbol );
          let last = response.results.pop();
          i.difference = i.priceNumber - last.c
          i.difference = i.difference.toFixed(2)
          i.change = (i.priceNumber - last.c) / last.c * 100
          i.change = i.change.toFixed(2)
          i.price = parseFloat(last.c);
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
      this.$axios.$get(`https://api.finage.co.uk/last/crypto/${symbol}?apikey=${finageApiKey}`)
      .then(response => {
        let i = this.cryptocurrency.find( crypto => crypto.symbol === response.symbol );
        i.price = Number(response.price).toFixed(2);
          this.$root.$emit('updateCrypto', i);
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchBonds(symbol) {
      this.$axios.$get(`https://api.finage.co.uk/bonds/us/rate/${symbol}?apikey=${finageApiKey}`)
      .then(response => {
        // console.log(response)
        let i = this.indices.find( indice => indice.symbol === response.symbol );
        i.price = Number(response.value).toFixed(4);
        this.$root.$emit('updateBond', i);
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchMovers() {
      this.$axios.$get(`https://api.finage.co.uk/market-information/us/most-gainers?apikey=${finageApiKey}`)
      .then(response => {
        // console.log(response)
        // this.rising = response;
        // let i = this.indices.find( indice => indice.symbol === response.symbol );
        // i.price = Number(response.value).toFixed(2);
        this.$root.$emit('updateRising', response);
      })
      .catch(error => {
        console.log(error);
      })
    },
    checkMarketStatus(){
      this.$axios.$get(`https://api.finage.co.uk/marketstatus?apikey=${finageApiKey}`)
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
    this.fetchCoinsByMarketCap()
    // this.readFromFirestore()
    this.$root.$on('bv::collapse::state', (id, collapsed) => {
      if (id === "sidebar") {
        this.mobileNavOpen = collapsed;
      }
    });
    if (!this.getGDPR() === true) {
      this.showCookieNotice = true;
    }
  },
  beforeDestroy() {
    this.forexWS.close();
    this.cryptoWS.close();
    this.stockWS.close();
    this.indicesWS.close();
  },
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
/* @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=Nunito:wght@400;800&display=swap');
html, body {
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  overflow-x: hidden;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  color: rgba(1, 3, 78, 0.9);
}

body{
  margin-top: 112px;
  background: #f7faff;
}
@media(max-width: 1200px){
  body{
    margin-top: 95px;
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
  color: rgba(1, 3, 78, 0.9);
  transition: 0.3s ease-in-out;
  &:hover {
    text-decoration: none;
    color: $red;
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
