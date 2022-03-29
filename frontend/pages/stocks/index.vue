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
  <div v-else>
    <div
      class="list-page content container container-fluid w-100 buffer"
      :class="view"
    >
      <div class="row m-0 index-list" id="stocks">
        <h2 class="col-12">Stocks</h2>
        <!-- <div class="toggle col-12">
          <button
            class="grid btn-outline-dark btn mb-4 mr-2"
            :class="view === 'grid' ? 'active' : ''"
            @click="showGrid()"
          />
          <button
            class="list btn-outline-dark btn mb-4"
            :class="view === 'list' ? 'active' : ''"
            @click="showList()"
          />
        </div> -->
        <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-12 white-well pt-2">
            <IndexList :data="stocks" indexPage type="stocks" />
          </div>
        </div>
        <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-lg-12 mt-4 white-well">
            <News :newsData="newsData" />
            <Ad feedAd />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuery } from "@/services/graphql.js";
import { stocks } from "./../../market.js";
import IndexList from "./../../components/IndexList.vue";
export default {
  components: {
    IndexList,
  },
  data() {
    return {
      finageApiKey: process.env.finageApiKey,
      loading: true,
      stocks,
      view: "list",
      chartData: null,
      chartOptions: null,
      newsData: [],
      yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
      today: new Date(Date.now()).toLocaleDateString("fr-CA"),
    };
  },
  methods: {
    fetchNews(symbol) {
      useQuery({
        query: "finage.news",
        variables: {
          market: "market",
          symbol,
        },
        axios: this.$axios,
      })
        .then((response) => {
          if (response.news.length) {
            if (typeof response.news[0] !== "undefined") {
              let index = this.newsData.findIndex(
                (x) => x.title === response.news[0].title
              );
              let newsItem = response.news[0];
              if (index === -1) {
                newsItem.symbol = symbol;
                newsItem.type = "stocks";
                this.newsData.push(newsItem);
              }
              this.loading = false;
              if (this.newsData.length > 17) {
                this.newsData.pop();
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
          // this.loading = false;
        });
    },
    fetchStocks() {
      this.$axios.$get(
        `https://api.finage.co.uk/last/stocks/?symbols=${stocks
          .map((s) => s.symbol)
          .join(",")}&apikey=${this.finageApiKey}`
      );

      useQuery({
        query: "finage.lastMulti",
        variables: {
          suffix: "stocks/",
          symbols: stocks.map((s) => s.symbol).join(","),
        },
        axios: this.$axios,
      })
        .then((response) => {
          response.forEach((item) => {
            const indexFound = this.stocks.findIndex(
              (stock) => stock.symbol === item.symbol
            );
            let i = this.stocks[indexFound];
            i.indexFound = indexFound;
            i.price = Number(item.ask).toFixed(2);
            i.priceNumber = item.ask;
            this.$root.$emit("updateStock", i);
          });
        })
        .then(() => {
          this.stocks.forEach((item) => {
            useQuery({
              query: "finage.agg",
              variables: {
                suffix: "stock",
                symbol: item.symbol,
                period: "1",
                multiplier: "day",
                from: "2021-01-01",
                to: this.today,
              },
              axios: this.$axios,
            })
              .then((response) => {
                const indexFound = this.stocks.findIndex(
                  (stock) => stock.symbol === response.symbol
                );
                let i = this.stocks[indexFound];
                i.indexFound = indexFound;
                let last = response.results.pop();
                i.difference = i.priceNumber - last.c;
                i.difference = i.difference.toFixed(2);
                i.change = ((i.priceNumber - last.c) / last.c) * 100;
                i.change = i.change.toFixed(2);
                this.$root.$emit("updateStock", i);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showGrid() {
      this.view = "grid";
    },
    showList() {
      this.view = "list";
    },
  },
  created() {
    this.fetchStocks();
    this.loading = false;
    this.$root.$on("updateStock", (item) => {
      let i = item.indexFound; //this.stocks.findIndex(index => index.name === item.name);
      this.$set(this.stocks[i], "price", item.price);
      this.$set(this.stocks[i], "difference", item.difference);
      this.$set(this.stocks[i], "change", item.change);
    });
    // this.$root.$on('updateRising', (item) => {
    //   let i = this.rising.findIndex(index => index.name === item.name);
    //   if(item.name !== 'Dogecoin') {
    //     this.$set(this.rising[i], 'price', item.price);
    //     this.$set(this.rising[i], 'difference', item.difference);
    //     this.$set(this.rising[i], 'change', item.change);
    //   }
    // });
    this.stocks.forEach((item) => {
      this.fetchNews(item.symbol);
    });
    setInterval(() => {
      this.stocks.forEach((item) => {
        this.fetchNews(item.symbol);
      });
      // every 5 minutes
    }, 300000);
  },
};
</script>

<style lang="scss"></style>
