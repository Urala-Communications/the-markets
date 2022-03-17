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
    ref="Item"
    :item="item"
    type="cryptocurrency"
    :news="news"
    :profile="profile"
    :open="open"
    :close="close"
    :high="high"
    :low="low"
    :volume="volume"
    :market-cap="marketCap"
    :year-high="yearHigh"
    :year-low="yearLow"
    :chart-data="chartData"
    :chart-options="chartOptions"
    :market-status="marketStatus"
    :symbol="symbol"
    :live="live"
  />
</template>

<script>
import { useQuery } from "@/services/graphql";
import Item from "~/components/Item.vue";
export default {
  components: {
    Item,
  },
  async asyncData({ params }) {
    const symbol = params.symbol;
    return { symbol };
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
      fiveYearsAgo: new Date(Date.now() - 864e5 * 365 * 5).toLocaleDateString(
        "fr-CA"
      ),
    };
  },
  created() {
    // let topCoins = localStorage.getItem('crypto');
    // this.coins = JSON.parse(topCoins)
    // this.coins.forEach((item) => {
    //   let indexFound = item.cmc_rank - 1;
    //   let i = this.coins[indexFound];
    // });
    // console.log(item)
    // this.$set(this.item, "name", this.cryptocurrency[item.indexFound].name);
    // this.$set(this.item, "icon", this.cryptocurrency[item.indexFound].icon);
    this.$root.$on("updateCrypto", (item) => {
      if (item.symbol === this.symbol.replace("-", " ")) {
        //this.$set(this.item, "price", item.price);
        this.$set(this.item, "difference", item.difference);
        this.$set(this.item, "change", item.change);
        this.$set(this.item, "time", item.time);
      }
    });
    this.$root.$on("updateTrade", ({ symbol, time, price, volume }) => {
      if (symbol === this.live) {
        this.$set(this.item, "price", price);
      }
    });
    const self = this;
    function checkCryptoList() {
      if (localStorage.getItem("crypto")) {
        let topCoins = localStorage.getItem("crypto");
        self.cryptocurrency = JSON.parse(topCoins);

        self.fetchDetails();
        self.checkMarketStatus();
        self.fetchPrice();
        self.fetchAggregates();
        self.fetchNews();
      } else {
        setTimeout(checkCryptoList, 250);
      }
    }
    setTimeout(checkCryptoList, 250);

    this.$root.$on("changeInterval", ({ symbol, interval, text }) => {
      this.updateInterval(symbol, interval, text);
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
  beforeDestroy() {
    this.unsubscribeTrade();
    this.cryptoWS.close();
  },
  methods: {
    async fetchDetails() {
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );
      if (i) {
        this.$set(this.item, "icon", i.symbol);
        this.$set(this.item, "name", i.name);
      }

      const res = await useQuery({
        query: "finage.detailCrypto",
        variables: { symbol: i.symbol },
        axios: this.$axios,
      });

      if (!res) return;

      this.profile = res;
    },
    async fetchPrice() {
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );

      const res = await useQuery({
        query: "finage.detailCrypto",
        variables: { suffix: "cryptocurrency", symbol: i.symbol },
        axios: this.$axios,
      });

      if (!res) return;

      Object.keys(res).forEach((key) => {
        this[key] = res[key];
      });
    },
    async checkMarketStatus() {
      const res = await useQuery({
        query: "finage.marketStatus",
        axios: this.$axios,
      });

      if (!this.res) return;

      this.marketStatus = res.currencies.crypto;
    },
    fetchAggregates() {
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );
      // this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${this.finageApiKey}`)
      this.$axios
        .$get(
          `https://api.binance.com/api/v3/klines?limit=1000&symbol=${
            i.symbol.toUpperCase() + "USDT"
          }&interval=1d`
        )
        .then((response) => {
          this.chartData = response.map((o) => {
            const [timestamp, openPrice, high, low, close, volume] = [...o];
            return [timestamp, openPrice, high, low, close, volume].map((n) =>
              Number(n)
            );
          });
          this.symbol = i.symbol;
          this.live = i.symbol.toUpperCase() + "USDT";
          let last = this.chartData[this.chartData.length - 1];
          this.open = last[1];
          this.high = last[2];
          this.low = last[3];
          this.close = last[4];
          this.volume = last[5];
          this.loading = false;
          if (this.cryptoWS.readyState === 1) {
            this.cryptoWS.send(
              `{"method":"SUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${
                this.subindex
              }}`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    subscribeTrade() {
      this.cryptoWS.onopen = () => {
        if (this.live)
          this.cryptoWS.send(
            `{"method":"SUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${
              this.subindex
            }}`
          );
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
      this.cryptoWS.send(
        `{"method":"UNSUBSCRIBE","params":["${this.live.toLowerCase()}@aggTrade"],"id":${
          this.subindex
        }}`
      );
    },
    async updateInterval(symbol, interval) {
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
              console.log(error);
            });
        } else {
          const res = await useQuery({
            query: "finage.agg",
            variables: {
              suffix: "crypto",
              symbol: symbol.slice(0, -1),
              period: "1",
              multiplier: "week",
              from: this.fiveYearsAgo,
              to: this.today,
            },
            axios: this.$axios,
          });

          if (!res) return;

          this.chartData = res.results.map((o) => {
            const [timestamp, openPrice, high, low, close, volume] = [
              o.t,
              o.o,
              o.h,
              o.l,
              o.c,
              o.v,
            ];
            return [timestamp, openPrice, high, low, close, volume].map((n) =>
              Number(n)
            );
          });
          this.$root.$emit("updatedInterval", { symbol, interval });
        }
      }
    },
    async fetchNews() {
      let i = this.cryptocurrency.find(
        (item) => item.name.toLowerCase() === this.symbol.replace("-", " ")
      );

      const res = await useQuery({
        query: "finage.news",
        variables: { market: "cryptocurrency", symbol: i.symbol },
        axios: this.$axios,
      });

      if (!res) return;

      this.news = res.news;
      if (this.news.length > 16) this.news.pop();
    },
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
};
</script>
