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
    <div class="content container container-fluid w-100 buffer" :class="view">
      <div class="row m-0 index-list" id="currencies">
        <h2 class="col-12">Currencies</h2>
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
            <IndexList
              :data="currencies.filter((item) => item.type === 'currency')"
              indexPage
              type="currencies"
            />
          </div>
        </div>
        <!-- <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-lg-12 mt-4 white-well">
            <News :newsData="newsData" />
            <Ad feedAd />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { useQuery } from "@/services/graphql.js";
import { currencies } from "./../../market.js";
import IndexList from "./../../components/IndexList.vue";
export default {
  components: {
    IndexList,
  },
  data() {
    return {
      finageApiKey: process.env.finageApiKey,
      loading: false,
      currencies,
      filteredCurrencies: [],
      view: "list",
      loaded: false,
      chartData: null,
      chartOptions: null,
      newsData: [],
    };
  },
  methods: {
    async fetchNews(symbol) {
      const res = await useQuery({
        query: "finage.news",
        variables: { market: "forex", symbol },
        axios: this.$axios,
      });

      if (!res || !res.news?.length) return;

      let index = this.newsData.findIndex((x) => x.title === res.news[0].title);
      let newsItem = res.news[0];
      let newsItem2 = res.news[1];
      this.loading = false;
      if (index === -1) {
        this.newsData.push(newsItem);
        this.newsData.push(newsItem2);
      }
      if (this.newsData.length > 17) {
        this.newsData.pop();
      }
    },
    async fetchCurrency(index, symbol) {
      const res = await useQuery({
        query: "finage.last",
        variables: { suffix: "trade/forex", symbol },
        axios: this.$axios,
      });

      if (!res) return;

      /* let indexFound = this.currencies.findIndex(currency => currency.symbol === res.symbol );
          let i = this.currencies[indexFound];
          i.indexFound = indexFound;          
          i.price = Number(res.price).toFixed(4); */
      this.$set(this.currencies[index], "price", Number(res.price).toFixed(4));
      this.$set(this.currencies[index], "difference", res.difference);
      this.$set(this.currencies[index], "change", res.change);
    },
    showGrid() {
      this.view = "grid";
    },
    showList() {
      this.view = "list";
    },
  },
  created() {
    this.filteredCurrencies = this.currencies.filter(
      (item) => item.type === "currency"
    );
    this.$root.$on("updateCurrency", (item) => {
      let i = item.indexFound; //this.currencies.findIndex(index => index.name === item.name);
      this.$set(this.currencies[i], "price", item.price);
      this.$set(this.currencies[i], "difference", item.difference);
      this.$set(this.currencies[i], "change", item.change);
    });
    this.$root.$on("updateIndice", (item) => {
      if (item.symbol === "DXY") {
        let i = this.currencies.findIndex((index) => index.name === item.name);
        this.$set(this.currencies[i], "price", item.price);
        this.$set(this.currencies[i], "difference", item.difference);
        this.$set(this.currencies[i], "change", item.change);
      }
    });

    this.filteredCurrencies.forEach((item, index) => {
      this.fetchCurrency(index, item.symbol);
      this.fetchNews(item.symbol);
    });
    this.loading = false;
    setInterval(() => {
      this.filteredCurrencies.forEach((item) => {
        this.fetchNews(item.symbol);
      });
      // every 5 minutes
    }, 300000);
  },
};
</script>

<style lang="scss">
.index-list {
  background-repeat: no-repeat;
  background-position: 16px 120px;
  background-size: 55%;
  &#commodities {
    background-image: url("./../../assets/commodities.png");
    background-position: 16px 60px;
    background-size: 45%;
  }
  &#currencies {
    background-image: url("./../../assets/currencies.png");
  }
  &#indices {
    background-image: url("./../../assets/indices.png");
  }
  &#movers {
    background-image: url("./../../assets/movers.png");
  }
  &#personal-finance {
    background-image: url("./../../assets/personal-finance.png");
  }
  &#crypto {
    background-image: url("./../../assets/crypto.png");
    background-position: 16px 40px;
    background-size: 50%;
  }
  &#stocks {
    background-image: url("./../../assets/stocks.png");
    background-size: 50%;
  }
  &#bonds {
    background-image: url("./../../assets/bonds.png");
    background-size: 50%;
    background-position: 16px 100px;
  }
  h2 {
    @include main-font();
    font-size: 37px;
    font-weight: 900;
    color: rgba(1, 3, 78, 0.9);
    position: relative;
    max-width: fit-content;
    padding: 0;
    margin-left: 1rem;
    &:after {
      content: "";
      position: absolute;
      height: 17px;
      width: 100%;
      left: 0;
      bottom: 4px;
      z-index: -1;
      background-color: #bcd0fa;
    }
  }
  .white-well {
    background: rgb(255 255 255 / 90%);
  }
  .card {
    background: none;
  }
}
</style>
