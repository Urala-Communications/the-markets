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
import { isArray } from "util";
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
        name: "",
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
        this.item?.price +
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
          // console.log(error);
        });
    },
    checkBackground() {
      const self = this;
      document.querySelectorAll(".icon").forEach(function (icon) {
        if (window.getComputedStyle(icon).backgroundImage == "none" && self.item.logo) {
          icon.style.backgroundImage = 'url("' + self.item.logo + '")';
        }
      });
    },
    fetchPrice() {
      this.$axios
        .$get(
          `https://api.finage.co.uk/last/crypto/detailed/${this.item.symbol.toUpperCase() + "USD"}?apikey=${this.finageApiKey}`
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
          // console.log(error);
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
          // console.log(error);
        });
    },
    async fetchAggregates() {
      const self = this;
      this.live = this.item.symbol.toUpperCase() + "USDT";
      // this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${this.finageApiKey}`)
      let allcheck = true;
      let binanceCheck = await this.fetchDataByBinance(this.live, "1d");
      if (!binanceCheck) {
        let finageCheck = await this.fetchDataByFinage(this.item.symbol.toLowerCase()+ "usd", "1d");
        if (!finageCheck) {
          let coinGeckoCheck = await this.fetchDataByCoinGecko(this.item.symbol, "1");
          allcheck = coinGeckoCheck;
        }
      }
      if (allcheck) {
        // console.log("chartdata",this.chartData);
        this.loading = false;

        let last = this.chartData[this.chartData.length - 1];
        this.open = last[1];
        this.high = last[2]
        this.low = last[3];
        this.close = last[4];
        this.volume = last[5];
        this.price = last[4];
        
        this.$set(this.item, "price", last[4]);
        
        if (this.cryptoWS.readyState === 1) {
          this.cryptoWS.send(`{"method":"SUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${this.subindex}}`);
        }
      }
    },
    subscribeTrade() {
      this.cryptoWS.onopen = () => {
        if (this.live)
          this.cryptoWS.send(`{"method":"SUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${this.subindex}}`);
      };
    },
    listenTrade() {
      this.cryptoWS.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if (data.stream == `${this.live.toLowerCase()}@aggTrade`) {
          this.$root.$emit("updateTrade", {
            symbol: this.live,
            time: data.data.E,
            price: Number(data.data.p),
            volumn: Number(data.data.q),
          });
        }
      };
    },
    unsubscribeTrade() {
      this.cryptoWS.send(`{"method":"UNSUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${this.subindex}}`);
    },
    fetchAllResursive(symbol, interval, lastdate) {
      if (this.stopRun) {
        let last = new Date(
          Date.parse(lastdate) - 864e5 * 365 * 5
        ).toLocaleDateString("fr-CA");
        this.$axios
          .$get(
            `https://api.finage.co.uk/agg/crypto/${symbol.slice(0,-1)}/1/week/${last}/${lastdate}?apikey=${this.finageApiKey}`
          )
          .then((response) => {
            if (response.results) {
              this.chartData = response.results
                .map((o) => {
                  const [timestamp, openPrice, high, low, close, volume] = [o.t,o.o,o.h,o.l,o.c,o.v];
                  return [timestamp, openPrice, high, low, close, volume].map(
                    (n) => Number(n)
                  );
                })
                .concat(this.chartData);

              this.fetchAllResursive(symbol, interval, last);
            } else {
              this.$root.$emit("updatedInterval", { symbol, interval });
            }
          })
          .catch((error) => {
            // console.log(error);
            this.$root.$emit("updatedInterval", { symbol, interval });
          });
      }
    },
    async fetchHistorical(symbol, interval) {
      this.stopRun = 0;
      
      if (interval !== "MAX") {
        // console.log('nomax')
        let binanceCheck = await this.fetchDataByBinance(symbol, interval);
        if (!binanceCheck) {
          let finageCheck = await this.fetchDataByFinage(symbol.toLowerCase().slice(0, -1), interval);
          if (!finageCheck) {

            let coinGeckoCheck = await this.fetchDataByCoinGecko(symbol, interval);            
            this.$root.$emit("updatedInterval", { symbol, interval });

          } else {
            this.$root.$emit("updatedInterval", { symbol, interval });
          }
        } else {
          this.$root.$emit("updatedInterval", { symbol, interval });
        }
      } else {
        this.stopRun = 1;
        let binanceCheck = await this.fetchDataByBinance(symbol, interval);
        if (!binanceCheck) {
          let finageCheck = await this.fetchDataByFinage(symbol.toLowerCase().slice(0, -1), interval);
          if (!finageCheck) {
            let coinGeckoCheck = await this.fetchDataByCoinGecko(symbol, interval);
            this.$root.$emit("updatedInterval", { symbol, interval });
          } else {
            this.$root.$emit("updatedInterval", { symbol, interval });
            this.fetchAllResursive(symbol, interval, this.fiveYearsAgo);
          }
        } else {
          this.$root.$emit("updatedInterval", { symbol, interval });
        }
      }
    },
    updateInterval(symbol, interval, text) {
      this.stopRun = 0;
      if (symbol === this.live) {
        if (interval !== "MAX") {
          this.$axios
            .$get(
              `https://api.binance.com/api/v3/klines?limit=1000&symbol=${symbol}&interval=${interval}`
            )
            .then((response) => {
              this.chartData = response.map((o) => {
                const [timestamp, openPrice, high, low, close, volume] = [...o];
                return [timestamp, openPrice, high, low, close, volume].map(
                  (n) => Number(n)
                );
              });

              this.$root.$emit("updatedInterval", { symbol, interval });
            })
            .catch((error) => {
              // console.log(error);
            });
        } else {
          this.stopRun = 1;
          this.$axios
            .$get(
              `https://api.finage.co.uk/agg/crypto/${symbol.slice(0, -1)}/1/week/${this.fiveYearsAgo}/${this.today}?apikey=${this.finageApiKey}`
            )
            .then((response) => {
              if (response.results) {
                this.chartData = response.results.map((o) => {
                  const [timestamp, openPrice, high, low, close, volume] = [o.t,o.o,o.h,o.l,o.c,o.v];
                  return [timestamp, openPrice, high, low, close, volume].map(
                    (n) => Number(n)
                  );
                });
                this.$root.$emit("updatedInterval", { symbol, interval });
                this.fetchAllResursive(symbol, interval, this.fiveYearsAgo);
              }
            })
            .catch((error) => {
              this.$root.$emit("updatedInterval", { symbol, interval });
              // console.log(error);
            });
        }
      }
    },
    async fetchDataByBinance(symbol, interval){
      try {
        let res = await this.$axios.$get(`https://api.binance.com/api/v3/klines?limit=1000&symbol=${symbol}&interval=${interval}`);
        // console.log("binance res",res);
        if (res) {

          this.chartData = res.map((o) => {
                  const [timestamp, openPrice, high, low, close, volume] = [...o];
                  return [timestamp, openPrice, high, low, close, volume].map(
                    (n) => Number(n)
                  );
                });
          return true;
        } else
        return false;
      } catch (error) {
        // console.log("binance fetch err: ", error);
        return false;
      }
    },
    async fetchDataByFinage(symbol, interval){
      let last = this.yesterday;
      let text="";
      switch (interval) {
        
        case '1m':
          text = '1/minute';
          last = this.yesterday;
          break;
        case '5m':
          text = '5/minute';
          last = this.yesterday;
          break;
        case '15m':
          text = '15/minute';
          last = this.yesterday;
          break;
        case '30m':
          text = '30/minute';
          last = new Date(Date.now() - 864e5 * 7).toLocaleDateString("fr-CA");
          break;
        case '1h':
          text = '1/hour';
          last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
          break;
        case '4h':
          text = '4/hour';
          last = new Date(Date.now() - 864e5 * 30).toLocaleDateString("fr-CA");
          break;
        case '1d':
          text = '1/day';
          last = new Date(Date.now() - 864e5 * 365).toLocaleDateString("fr-CA");
          break;
        case '1w':
          text = '1/week';
          last = new Date(Date.now() - 864e5 * 365).toLocaleDateString("fr-CA");
          break;
        case '1M':
          text = '1/month';
          last = new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA");
          break;
        case 'MAX':
          text = '1/week';
          last = new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString("fr-CA");
          break;
        default:
          text = '1/day';
          last = new Date(Date.now() - 864e5 * 365).toLocaleDateString("fr-CA");
          break;
      }
      try {
        let res = await this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${symbol}/${text}/${last}/${this.today}?apikey=${this.finageApiKey}`);
        // console.log("finage res",res)
        if (res.results) {
          this.chartData = res.results.map((o) => {
            const [timestamp, openPrice, high, low, close, volume] = [o.t,o.o,o.h,o.l,o.c,o.v,];
            return [timestamp, openPrice, high, low, close, volume].map(
                (n) => Number(n)
            );
          });
          return true;
        } else
        return false;
      } catch (error) {
        // console.log("finage fetch err: ", error);
        return false;
      }
    },
    async fetchDataByCoinGecko(symbol, interval){
      let day=1;
      switch (interval) {
        case '1m':
        case '5m':
        case '15m':
        case '30m':
        case '1h':
        case '4h':
          day=1;
          break;
        case '1d':
          day=7;
          break;
        case '1w':
          day=90;
          break;
        case '1M':
          day=365;
          break;
        case 'MAX':
          day='max';
          break;
        default:
          break;
      }
      
      try {
        let res = await this.$axios.$get(`https://api.coingecko.com/api/v3/coins/${this.item.slug?this.item.slug.toLowerCase():(this.item.symbol.toLowerCase())}/ohlc?vs_currency=usd&days=${day}`);
        // console.log("cg res", res);
        if (res) {
          this.chartData = res.map((o) => {
            const [timestamp, openPrice, high, low, close, volume] = [
              ...o,
              0,
            ];
            return [timestamp, openPrice, high, low, close, volume].map(
              (n) => Number(n)
            );
          });
          return true;
        } else 
        return false;
        
      } catch (error) {
        // console.log("coingecko fetch err: ", error);
        return false;
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
          // console.log(error);
        });
    },
    /* findCoin() {
      return this.$store.getters.GET_COINS.find(
        (coin) =>
          coin.name.toLowerCase().replace(" ", "-") == this.symbol.toLowerCase()
      );
    }, */
    async searchCoin(symbol) {
      try {
        return this.$axios.$get(`/api/search?symbol=${symbol}`, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          json: true,
          gzip: true
        }
        );
      } catch (error) {
        return null;
      }
    },
    fetchInfos() {
      this.$set(this.item, "icon", this.item.symbol);
      // console.log(this.item)
      this.fetchDetails();
      this.checkMarketStatus();
      this.fetchPrice();
      this.fetchAggregates();
      this.fetchNews();
    },
  },
  created() {
    const self = this;

    this.$root.$on("updateCrypto", (item) => {
      if (item.symbol === this.symbol.replace("-", " ") && this.item) {
        this.$set(this.item, "price", item.price);
        this.$set(this.item, "difference", item.difference);
        this.$set(this.item, "change", item.change);
        this.$set(this.item, "time", item.time);
      }
    });

    this.$root.$on("updateTrade", ({ symbol, time, price, volumn }) => {
      if (symbol === this.live && this.item) {
        this.$set(this.item, "price", price);
      }
    });

    async function checkCryptoList() {
      let ctList = sessionStorage.getItem("cryptoList")
      if (ctList) {
        self.cryptocurrency = JSON.parse(ctList);

        self.item = self.cryptocurrency.find(
          (coin) =>
            coin.name.toLowerCase().replace(" ", "-") == self.symbol.toLowerCase()
        );
        
        if (!self.item) {
          let thiscoin = await self.searchCoin(
            self.symbol.toLowerCase().replace(" ", "-").trim()
          );
          if (thiscoin.length) {
            thiscoin = thiscoin[0];
            if (thiscoin && thiscoin.hasOwnProperty("id")) {
              self.symbol = thiscoin.symbol;
              self.item = { ...self.item, ...thiscoin };
              self.profile = thiscoin;
              self.fetchInfos();
            }
          }
        } else {
          self.fetchInfos();
        }
      } else {
        setTimeout(checkCryptoList, 50);
      }
    }
    setTimeout(checkCryptoList, 50);

    this.$root.$on("changeInterval", ({ symbol, interval, text }) => {
      this.fetchHistorical(symbol, interval);
      //this.updateInterval(symbol, interval, text);
    });
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
    window.addEventListener("scroll", this.checkBackground);
  },
  beforeDestroy() {
    this.unsubscribeTrade();
    this.cryptoWS.close();
  },
};
</script>
