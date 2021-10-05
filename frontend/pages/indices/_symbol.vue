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
    :c_symbol="c_symbol"
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
        indices,
        chartData: [],
        chartOptions: null,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        c_symbol: "",
      }
    },
    head() {
      return {
        title: this.symbol.replace('-','').toUpperCase() + ' $' + this.item.price + ' - ' + 'The Markets'
      }
    },
    async asyncData({ params }) {
      const symbol = params.symbol;
      return { symbol }
    },
    methods: {
      // fetchDetails() {
      //   let itemSymbol = this.symbol.replace('-', '').toUpperCase();
      //   this.$axios.$get(` https://api.finage.co.uk/agg/index/${itemSymbol}/1day/2021-02-05/2021-03-02?apikey=${this.finageApiKey}`)
      //   .then(response => {
      //     this.open = response.results[0].o;
      //     this.high = response.results[0].h;
      //     this.low = response.results[0].l;
      //     this.close = response.results[0].c;
      //     this.volume = response.results[0].v;
      //     console.log("Details")
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      // },
      fetchPrice() {
        Number.prototype.toLocaleFixed = function(n) {
          return this.toLocaleString(undefined, {
            minimumFractionDigits: n,
            maximumFractionDigits: n
          });
        };
        let i = this.indices.find( item => item.name === this.symbol.replace('-', ' ').toUpperCase());
        this.$axios.$get(`https://api.finage.co.uk/last/index/${i.symbol}?apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Price")
          console.log(response)
          this.item.price = response.price.toLocaleFixed(2);
          this.item.priceNumber = response.price;
          this.$set(this.item, 'icon', i.icon);
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
        let i = this.indices.find( item => item.name === this.symbol.replace('-', ' ').toUpperCase());
        this.$axios.$get(`https://api.finage.co.uk/agg/index/${i.symbol}/1day/2021-01-01/${this.today}?limit=1825&apikey=${this.finageApiKey}`)
        .then(response => {
          console.log("Aggregates")
          this.c_symbol = i.symbol;
          this.chartData = response.results.map((i) => {
            return [(new Date(i.t)).getTime(), parseFloat(i.c)];
          });
          localStorage.setItem(
              i.symbol + "-All",
              JSON.stringify(this.chartData)
          );
          let last = response.results.pop();
          this.open = last.o;
          this.high = last.h;
          this.low = last.l;
          this.close = last.c;
          this.volume = last.v;
          this.item.difference = this.item.priceNumber - this.close
          this.item.difference = this.item.difference.toFixed(2)
          this.item.change = (this.item.priceNumber - this.close) / this.close * 100;
          this.item.change = this.item.change.toFixed(2)
        })
        .catch(error => {
          console.log(error);
        })
      },
      changeChartData(range, interval = "day") {
          let i = this.indices.find(
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
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "1min";
                  startPoint = 1000 * 60 * 60;
                  limit = 3000;
                  break;
              case "2h":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "1min";
                  startPoint =  2 * 60 * 60 * 1000;
                  limit = 3000;
                  break;
              case "4h":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "1min";
                  startPoint =  4 * 60 * 60 * 1000;
                  limit = 3000;
                  break;
              case "1d":
                  minDate = new Date(
                      new Date().getTime() - 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  interval = "1min";
                  startPoint = 24 * 1000 * 60 * 60;
                  limit = 3000;
                  break;
              case "1w":
                  minDate = new Date(
                      new Date().getTime() - 7 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  startPoint = 7 * 24 * 1000 * 60 * 60;
                  interval = "1h";
                  break;
              case "1M":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  startPoint = 30 * 24 * 1000 * 60 * 60;
                  interval = "1day";
                  break;
              case "3M":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  startPoint =  90 * 24 * 1000 * 60 * 60;
                  interval = "1day";
                  break;
              case "6M":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  startPoint = 180 * 24 * 1000 * 60 * 60;
                  interval = "1day";
                  break;
              case "1y":
                  minDate = new Date(
                      new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                  ).toLocaleDateString("fr-CA");
                  lastinterval.setMinutes(0);
                  lastinterval.setHours(0);
                  startPoint = 365 * 24 * 1000 * 60 * 60;
                  interval = "1day";
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
                  interval = "1day";
                  break;
          }
          let data = localStorage.getItem(i.symbol + "-" + range);
          console.log("local data:", data)
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
          let url = `https://api.finage.co.uk/agg/index/${symbol}/${interval}/${minDate}/${this.today}?&apikey=${process.env.FINAGE_API_KEY}&limit=${limit}`;
          
          this.$axios
              .$get(
                  `https://api.finage.co.uk/agg/index/${symbol}/${interval}/${minDate}/${this.today}?&apikey=${this.finageApiKey}&limit=${limit}`
              )
              .then((response) => {
                  console.log("Aggregates");
                  //console.log(response.results);
                  let tempdata = response.results.map((i) => {
                     return [(new Date(i.t)).getTime(), parseFloat(i.c)];
                  });
                  //console.log(startPoint.getTime());
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
      this.$root.$on("changeRangeData", ([item, range, interval]) => {
          console.log("received emit data: ", [item, range, interval]);
          console.time("receivedDat");
          if (item.name === this.c_symbol) {
              this.changeChartData(range, interval);
          }
      });
      // this.fetchDetails();
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
