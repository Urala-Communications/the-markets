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
      <div class="row m-0 index-list" id="bonds">
        <h2 class="col-12">Bonds</h2>
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
            <IndexList :data="bonds" indexPage type="bonds" />
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
import { bonds } from "./../../market.js";
import IndexList from "./../../components/IndexList.vue";
export default {
  components: {
    IndexList,
  },
  data() {
    return {
      finageApiKey: process.env.finageApiKey,
      loading: true,
      bonds,
      view: "list",
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
      this.loading = false;
      if (index === -1) {
        this.newsData.push(newsItem);
      }
      if (this.newsData.length > 10) {
        this.newsData.pop();
      }
    },

    async fetchBonds(index, symbol) {
      const res = await useQuery({
        query: "finage.bonds",
        variables: { suffix: "us/rate", symbol },
        axios: this.$axios,
      });

      if (!res) return;

      let i = this.bonds.find((bond) => bond.symbol === res.symbol);
      i.price = Number(res.value).toFixed(4);
      this.$root.$emit("updateBond", i);
      this.$set(this.bonds[index], "price", Number(res.value).toFixed(4));
      this.$set(this.bonds[index], "difference", res.difference);
      this.$set(this.bonds[index], "change", res.change);
    },
    showGrid() {
      this.view = "grid";
    },
    showList() {
      this.view = "list";
    },
  },
  created() {
    this.$root.$on("updateBond", (item) => {
      let i = this.bonds.findIndex((index) => index.name === item.name);
      this.$set(this.bonds[i], "price", item.price);
      this.$set(this.bonds[i], "difference", item.difference);
      this.$set(this.bonds[i], "change", item.change);
      this.$nextTick(() => {
        this.loading = false;
      });
    });
    this.bonds.forEach((item, index) => {
      this.fetchBonds(index, item.symbol);
      this.fetchNews(item.symbol);
    });
    this.loading = false;
    setInterval(() => {
      this.bonds.forEach((item) => {
        this.fetchNews(item.symbol);
      });
      // every 5 minutes
    }, 300000);
  },
};
</script>

<style lang="scss"></style>
