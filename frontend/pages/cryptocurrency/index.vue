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
      <div id="crypto" class="row m-0 index-list">
        <h2 class="col-12">Cryptocurrencies</h2>
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
        <!-- <div class="col-12 col-lg-7 offset-lg-5">
          <div class="col-12 white-well pt-2">
            <IndexList :data="coins" type="cryptocurrency" indexPage />
          </div>
        </div> -->
        <div class="col-12">
          <div class="col-12 white-well p-0 overflow-hidden">
            <b-tabs pills card lazy :vertical="vertical">
              <b-tab title="All" active>
                <b-card-text>
                  <IndexList
                    :data="cryptocurrency"
                    type="cryptocurrency"
                    index-page
                  />
                </b-card-text>
              </b-tab>
              <b-tab title="DeFi">
                <b-card-text>
                  <IndexList :data="defi" type="cryptocurrency" index-page />
                </b-card-text>
              </b-tab>
              <!-- <b-tab title="Metaverse">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab> -->
              <!-- <b-tab title="NFTs">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab> -->
              <!-- <b-tab title="Memes">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="GameFi">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Solana">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Avalanche">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Polkadot">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Fantom">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Exchange">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="eSports">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Stablecoins">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Open Sea">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab>
              <b-tab title="Web3">
                <b-card-text>
                  <IndexList :data="cryptocurrency" type="cryptocurrency" indexPage />
                </b-card-text>
              </b-tab> -->
            </b-tabs>
          </div>
        </div>
        <!-- <div class="col-12">
          <div class="col-lg-12 mt-4 white-well">
            <News :news-data="newsData" />
            <Ad feed-ad />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { useQuery } from "@/services/graphql.js";
import { defi } from "./../../market.js";
import IndexList from "./../../components/IndexList.vue";
const finageApiKey = process.env.finageApiKey;
export default {
  components: {
    IndexList,
  },
  data() {
    return {
      cmcApiKey: process.env.cmcApiKey,
      loading: true,
      coins: [],
      cryptocurrency: [],
      defi,
      view: "list",
      chartData: null,
      chartOptions: null,
      newsData: [],
      windowWidth: 0,
    };
  },
  computed: {
    vertical() {
      if (this.windowWidth > 992) {
        return true;
      }
      return false;
    },
  },
  created() {
    const self = this;
    function checkCryptoList() {
      if (localStorage.getItem("crypto")) {
        let topCoins = localStorage.getItem("crypto");
        self.cryptocurrency = JSON.parse(topCoins);
        self.cryptocurrency.forEach((item) => {
          self.fetchCrypto(item.symbol);
          self.fetchNews(item.symbol);
        });
      } else {
        setTimeout(checkCryptoList, 250);
      }
    }
    setTimeout(checkCryptoList, 250);
    this.loading = false; // fix news api bug
    this.$root.$on("updateCrypto", (item) => {
      if (this.cryptocurrency.length) {
        this.$set(this.cryptocurrency[item.indexFound], "price", item.price);
        this.$set(
          this.cryptocurrency[item.indexFound],
          "difference",
          item.difference
        );
        this.$set(this.cryptocurrency[item.indexFound], "change", item.change);
      }
    });
    this.$root.$on("updateDefi", (item) => {
      this.$set(this.defi[item.indexFound], "price", item.price);
      this.$set(this.defi[item.indexFound], "difference", item.difference);
      this.$set(this.defi[item.indexFound], "change", item.change);
    });

    this.defi.forEach((item) => {
      this.fetchDefi(item.symbol);
    });
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  methods: {
    async fetchNews(symbol) {
      const res = await useQuery({
        query: "finage.news",
        variables: { market: "cryptocurrency", symbol },
        axios: this.$axios,
      });

      if (!res) return;

      let index = this.newsData.findIndex((x) => x.title === res.news[0].title);
      let newsItem = res.news[0];
      this.loading = false;
      if (index === -1) {
        newsItem.symbol = symbol;
        newsItem.type = "cryptocurrency";
        this.newsData.push(newsItem);
      }
      if (this.newsData.length > 30) {
        this.newsData.pop();
      }
    },
    async fetchCrypto(symbol) {
      const res = await useQuery({
        query: "finage.last",
        variables: { suffix: "crypto", symbol: `${symbol.toUpperCase()}USD` },
        axios: this.$axios,
      });

      if (!res) return;

      const indexFound = this.cryptocurrency.findIndex(
        ({ symbol: _symbol }) =>
          _symbol.toUpperCase() === res.symbol.slice(0, -3)
      );

      if (indexFound !== -1) {
        this.$set(this.cryptocurrency[indexFound], "price", res.price);
      }
    },

    async fetchDefi(symbol) {
      const res = await useQuery({
        query: "finage.last",
        variables: { suffix: "crypto", symbol },
        axios: this.$axios,
      });

      let indexFound = this.defi.findIndex((d) => d.symbol == res.symbol);
      if (indexFound !== -1) {
        let i = this.defi[indexFound];
        i.indexFound = indexFound;
        i.price = Number(res.price).toFixed(2);

        this.$root.$emit("updateDefi", i);
      }
    },

    showGrid() {
      this.view = "grid";
    },
    showList() {
      this.view = "list";
    },
  },
};
</script>

<style lang="scss">
.nav-pills .nav-link {
  padding: 0.25rem 1rem;
}
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background-color: #191c5f;
}
</style>
