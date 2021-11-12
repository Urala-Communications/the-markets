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
    :c_symbol="c_symbol"
  />
</template>

<script>
import {commodities} from "../../market.js";
import Item from '~/components/Item.vue'
export default {
    components: {
      Item
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        item: {
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
        marketStatus: '',
        commodities,
        chartData: [],
        chartOptions: null,
        c_symbol: "",
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
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
        let i = this.commodities.find(item => item.icon.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/agg/forex/prev-close/${i.symbol}?apikey=${this.finageApiKey}`)
          .then(response => {
            console.log("Details")
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
        Number.prototype.toLocaleFixed = function(n) {
          return this.toLocaleString(undefined, {
            minimumFractionDigits: n,
            maximumFractionDigits: n
          });
        };
        let i = this.commodities.find( item => item.icon.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/last/trade/forex/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Price")
          console.log(response)
          this.item.price = response.price.toLocaleFixed(2);
          this.$set(this.item, 'icon', i.icon);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
      },
      fetchNews(){
        let i = this.commodities.find(item => item.name.toLowerCase() === this.symbol.replace(/-/g, ' '));
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
        let i = this.commodities.find( item => item.icon.toLowerCase() === this.symbol);
        this.$axios.$get(`https://api.finage.co.uk/agg/forex/${i.symbol}/1/day/2021-01-01/${this.yesterday}?limit=1825&apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Aggregates")
          console.log(response.results)
          this.chartData = response.results.map(i => i.c);
        })
        .catch(error => {
          console.log(error);
        })
      },
      changeChartData(range, interval = "day") {
          let i = this.commodities.find(
              (item) => item.name.toLowerCase() === this.symbol
          );
          let minDate = "2021-01-01";
          let date = new Date();
          let startPoint = date;
          let lastinterval = new Date();
          lastinterval.setMilliseconds(0);
          lastinterval.setSeconds(0);
          let limit = 500;
          switch (range) {
              case "1m":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "second";
                  limit = 100;
                  break;
              case "5m":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "second";
                  limit = 3000;
                  break;
              case "10m":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "second";
                  limit = 3000;
                  break;
              case "30m":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "second";
                  startPoint.setTime(
                      new Date(new Date().getTime() - 1000 * 60 * 30)
                  );
                  limit = 3000;
                  break;
              case "1h":
                  minDate = new Date(
                      new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "minute";
                  startPoint = 1000 * 60 * 60;
                  limit = 3000;
                  break;
              case "2h":
                  minDate = new Date(
                      new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "minute";
                  startPoint = 2 * 60 * 60 * 1000;
                  limit = 3000;
                  break;
              case "4h":
                  minDate = new Date(
                      new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "minute";
                  startPoint = 4 * 60 * 60 * 1000;
                  limit = 3000;
                  break;
              case "1d":
                  minDate = new Date(
                      new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "minute";
                  startPoint = 24 * 1000 * 60 * 60;
                  limit = 3000;
                  break;
              case "1w":
                  minDate = new Date(
                      new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  startPoint = 7 * 24 * 1000 * 60 * 60;
                  interval = "minute";
                  break;
              case "1M":
                  minDate = new Date(
                      new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  startPoint = 30 * 24 * 1000 * 60 * 60;
                  interval = "minute";
                  break;
              case "3M":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  startPoint =  90 * 24 * 1000 * 60 * 60;
                  interval = "day";
                  break;
              case "6M":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  startPoint =  180 * 24 * 1000 * 60 * 60;
                  interval = "day";
                  break;
              case "1y":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  startPoint =  365 * 24 * 1000 * 60 * 60;
                  interval = "day";
                  break;
              case "All":
                  //minDate = fiveYearsAgo;
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  interval = "All";
                  break;
              default:
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  interval = "day";
                  break;
          }
          let data = localStorage.getItem(i.symbol + "-" + range);
          console.timeEnd("receivedDat");
          console.log(i.symbol + "-" + interval);
          if (interval !== "second") {
          // remove old data and add the new one
          if (data !== null) {
              data = JSON.parse(data);
              console.log("debug time compare: ", [
                  data[data.length - 1][0],
                  lastinterval.getTime(),
              ]);
              if (interval === "All") {
                  this.$root.$emit("update-chart-data", {
                      interval: interval,
                      range: range,
                      data: data,
                  });
              } else if (data[data.length - 1][0] < lastinterval.getTime()) {
                  this.startUpdateData(
                      i.symbol,
                      range,
                      limit,
                      interval,
                      minDate,
                      startPoint
                  );
              } else {
                  this.$root.$emit("update-chart-data", {
                      interval: interval,
                      range: range,
                      data: data.filter((a) => a[0] >= (new Date(data[data.length-1]).getTime() - startPoint) ),
                  });
                  //this.chartData = data;
              }
          } else {
              this.startUpdateData(
                  i.symbol,
                  range,
                  limit,
                  interval,
                  minDate,
                  startPoint
              );
          }
          } else {
              let url = `https://api.thedice.com/api/${range}/${i.symbol}/1`;

              this.$axios
              .$get(
                  url
              )
              .then((response) => {
                  let tempdata = response.map((i) => {
                      return [Date.parse(i._stop), i._value];
                  });
                  this.$root.$emit("update-chart-data", {
                      interval: interval,
                      range: range,
                      data: tempdata,
                  });
              })

          }
      },
      startUpdateData(symbol, range, limit, interval, minDate, startPoint) {
          console.log("change chart data: ", [symbol, interval, minDate]);
          let url = `https://api.finage.co.uk/agg/forex/${symbol}/1/${interval}/${minDate}/${this.today}?&apikey=${process.env.FINAGE_API_KEY}&limit=${limit}`;

          this.$axios
              .$get(
                  `https://api.finage.co.uk/agg/forex/${symbol}/1/${interval}/${minDate}/${this.today}?&apikey=${this.finageApiKey}&limit=${limit}`
              )
              .then((response) => {
                  console.log("Aggregates");
                  //console.log(response.results);
                  let tempdata = response.results.map((i) => {
                      return [i.t, i.c];
                  });
                  console.log(new Date(tempdata[tempdata.length-1][0]).getTime() - startPoint );
                  this.$root.$emit("update-chart-data", {
                      interval: interval,
                      range: range,
                      data: range !== "All"
                                ? tempdata.filter(
                                      (a) => a[0] >= ( new Date(tempdata[tempdata.length-1][0]).getTime() - startPoint)
                                  )
                                : tempdata,
                  });
                  //this.chartData = response.results.map(i => { return [ i.t ,i.c ]});
                  localStorage.setItem(
                      symbol + "-" + range,
                      JSON.stringify(tempdata)
                  );
              })
              .catch((error) => {
                  console.log(error);
              });
      },
    },
    created() {
      this.$root.$on('updateCommodity', (item) => {
        if(item.icon.toLowerCase() === this.symbol){
          let i = this.commodities.findIndex(index => index.symbol === item.symbol);
          this.$set(this.item, 'name', this.commodities[i].name);
          this.$set(this.item, 'price', item.price);
          this.$set(this.item, 'difference', item.difference);
          this.$set(this.item, 'change', item.change);
          this.$set(this.item, 'icon', item.icon);
          this.loading = false;
        }
      });
      this.$root.$on("changeRangeData", ([item, range, interval]) => {
          console.log("received emit data: ", [item, range, interval]);
          console.time("receivedDat");
          if (item.name === this.c_symbol) {
              this.changeChartData(range, interval);
          }
      });
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
