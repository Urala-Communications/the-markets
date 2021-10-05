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
        :initData="initData"
        :chartOptions="chartOptions"
        :marketStatus="marketStatus"
        :c_symbol="c_symbol"
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
            c_symbol: "",
            yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
            today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        };
    },
    head() {
        return {
            title:
                this.symbol.toUpperCase() +
                " $" +
                this.item.price +
                " - " +
                "The Markets",
        };
    },
    async asyncData({ params }) {
        const symbol = params.symbol;
        return { symbol };
    },
    methods: {
        fetchDetails() {
            // let i = this.cryptocurrency.find( item => item.name.toLowerCase() === this.symbol);
            this.$axios
                .$get(
                    `https://api.finage.co.uk/detail/cryptocurrency/${this.symbol}?apikey=${this.finageApiKey}`
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
            Number.prototype.toLocaleFixed = function (n) {
                return this.toLocaleString(undefined, {
                    minimumFractionDigits: n,
                    maximumFractionDigits: n,
                });
            };
            let i = this.cryptocurrency.find(
                (item) => item.name.toLowerCase() === this.symbol
            );
            this.$axios
                .$get(
                    `https://api.finage.co.uk/last/crypto/detailed/${i.symbol}?apikey=${this.finageApiKey}`
                )
                .then((response) => {
                    this.open = response.open.toLocaleFixed(2);
                    this.close = response.close.toLocaleFixed(2);
                    this.high = response.high.toLocaleFixed(2);
                    this.low = response.low.toLocaleFixed(2);
                    this.volume = response.volume.toLocaleFixed(2);
                    this.marketCap = response.marketCap.toLocaleFixed(2);
                    this.yearHigh = response.yearHigh.toLocaleFixed(2);
                    this.yearLow = response.yearLow.toLocaleFixed(2);
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
                (item) => item.name.toLowerCase() === this.symbol
            );
            // this.$axios.$get(`https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${this.finageApiKey}`)
            this.$axios
                .$get(
                    `https://api.finage.co.uk/agg/crypto/${i.symbol}/1/day/${fiveYearsAgo}/${this.today}?limit=5000&apikey=${this.finageApiKey}`
                )
                .then((response) => {
                    console.log("Aggregates");
                    
                    this.chartData = response.results.map((i) => {
                        return [i.t, i.c];
                    });                    
                    this.c_symbol = i.symbol;
                    localStorage.setItem(
                        i.symbol + "-All",
                        JSON.stringify(this.chartData)
                    );
                    this.initData = this.chartData;
                    let last = response.results.pop();
                    this.open = last.o;
                    this.high = last.h;
                    this.low = last.l;
                    this.close = last.c;
                    this.volume = last.v;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        changeChartData(range, interval = "day") {
            let i = this.cryptocurrency.find(
                (item) => item.name.toLowerCase() === this.symbol
            );
            let minDate = fiveYearsAgo;
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
                    interval = "minute";
                    startPoint.setTime(
                        new Date(new Date().getTime() - 1000 * 60 * 60)
                    );
                    limit = 3000;
                    break;
                case "2h":
                    minDate = new Date(
                        new Date().getTime() - 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    interval = "minute";
                    startPoint.setTime(
                        startPoint.getTime() - 2 * 60 * 60 * 1000
                    );
                    limit = 3000;
                    break;
                case "4h":
                    minDate = new Date(
                        new Date().getTime() - 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    interval = "minute";
                    startPoint.setTime(
                        startPoint.getTime() - 4 * 60 * 60 * 1000
                    );
                    limit = 3000;
                    break;
                case "1d":
                    minDate = new Date(
                        new Date().getTime() - 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    interval = "minute";
                    startPoint = new Date(
                        new Date().getTime() - 24 * 1000 * 60 * 60
                    );
                    limit = 3000;
                    break;
                case "1w":
                    minDate = new Date(
                        new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    lastinterval.setMinutes(0);
                    startPoint = new Date(
                        new Date().getTime() - 7 * 24 * 1000 * 60 * 60
                    );
                    interval = "hour";
                    break;
                case "1M":
                    minDate = new Date(
                        new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    lastinterval.setMinutes(0);
                    startPoint = new Date(
                        new Date().getTime() - 30 * 24 * 1000 * 60 * 60
                    );
                    interval = "hour";
                    break;
                case "3M":
                    minDate = new Date(
                        new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    lastinterval.setMinutes(0);
                    lastinterval.setHours(0);
                    startPoint = new Date(
                        new Date().getTime() - 90 * 24 * 1000 * 60 * 60
                    );
                    interval = "day";
                    break;
                case "6M":
                    minDate = new Date(
                        new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    lastinterval.setMinutes(0);
                    lastinterval.setHours(0);
                    startPoint = new Date(
                        new Date().getTime() - 180 * 24 * 1000 * 60 * 60
                    );
                    interval = "day";
                    break;
                case "1y":
                    minDate = new Date(
                        new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                    ).toLocaleDateString("fr-CA");
                    lastinterval.setMinutes(0);
                    lastinterval.setHours(0);
                    startPoint = new Date(
                        new Date().getTime() - 365 * 24 * 1000 * 60 * 60
                    );
                    interval = "day";
                    break;
                case "All":
                    minDate = fiveYearsAgo;
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
            let data = localStorage.getItem(i.symbol + "-" + interval);
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
                        data: data.filter((a) => a[0] >= startPoint.getTime()),
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
            let url = `https://api.finage.co.uk/agg/crypto/${symbol}/1/${interval}/${minDate}/${this.today}?&apikey=${process.env.FINAGE_API_KEY}&limit=${limit}`;
           
            this.$axios
                .$get(
                    `https://api.finage.co.uk/agg/crypto/${symbol}/1/${interval}/${minDate}/${this.today}?&apikey=${this.finageApiKey}&limit=${limit}`
                )
                .then((response) => {
                    console.log("Aggregates");
                    //console.log(response.results);
                    let tempdata = response.results.map((i) => {
                        return [i.t, i.c];
                    });
                    console.log(startPoint.getTime());
                    this.$root.$emit("update-chart-data", {
                        interval: interval,
                        range: range,
                        data:
                            range !== "All"
                                ? tempdata.filter(
                                      (a) => a[0] >= startPoint.getTime()
                                  )
                                : tempdata,
                    });
                    //this.chartData = response.results.map(i => { return [ i.t ,i.c ]});
                    localStorage.setItem(
                        symbol + "-" + interval,
                        JSON.stringify(tempdata)
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        fetchNews() {
            let i = this.cryptocurrency.find(
                (item) => item.name.toLowerCase() === this.symbol
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
                    console.log("NEWS");
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
            if (item.name.toLowerCase() === this.symbol) {
                let i = this.cryptocurrency.findIndex(
                    (index) =>
                        index.name.toLowerCase() === item.name.toLowerCase()
                );
                this.$set(this.item, "name", this.cryptocurrency[i].name);
                this.$set(this.item, "price", item.price);
                this.$set(this.item, "difference", item.difference);
                this.$set(this.item, "change", item.change);
                this.$set(this.item, "icon", item.icon);
                this.$set(this.item, "time", item.time);
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
        this.checkMarketStatus();
        this.fetchAggregates();
        this.fetchPrice();
        this.fetchNews();
        setInterval(() => {
            this.fetchNews();
        }, 300000);
        setInterval(() => {
            this.checkMarketStatus();
        }, 300000);
    },
};
</script>
