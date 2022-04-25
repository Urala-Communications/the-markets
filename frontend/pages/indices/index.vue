<template>
  <div v-if="loading">
    <div class="container d-flex justify-content-around w-50 pt-5 vh-100 text-center">
      <div class="loading-logo mt-5" role="status"/>
    </div>
  </div>
  <div v-else>
    <div
      class="content container container-fluid w-100 buffer"
      :class="view"
    >
      <!-- <div class="toggle">
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
      <div class="row m-0 index-list" id="indices">
        <h2 class="col-12">Indices</h2>
        <div class="col-lg-8 offset-lg-4">
          <div class="col-12 white-well pt-2">
            <IndexList :data="indices.filter(item => item.type === 'indice')" indexPage type="indices" />
            <span class="smaller pl-2">*real-time derived</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="grey-bg w-100">
      <div class="content container">
        <div class="row m-0">
          <div class="col-12">
            <h2>News
              <NuxtLink class="index-link" to="/news">See all</NuxtLink>
            </h2>
            <News :newsData="newsData"/>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import {indices} from "./../../market.js";
import {useQuery} from "@/services/graphql.js";
import IndexList from './../../components/IndexList.vue'
export default {
    components: {
      IndexList
    },
    data() {
      return {
        finageApiKey: process.env.finageApiKey,
        yesterday: new Date(Date.now() - 864e5).toLocaleDateString("fr-CA"),
        today: new Date(Date.now()).toLocaleDateString("fr-CA"),
        loading: true,
        indices,
        filteredIndices: [],
        view: 'list',
        chartData: null,
        chartOptions: null,
        newsData: [
          {
            title: 'Nikkei exceeds 25,000',
            body: 'Some quick example text to build',
            category: 'Analysis',
            img: 'https://i-invdn-com.akamaized.net/news/LYNXMPEB2100F_L.jpg',
            link: 'bbc.com'
          },
          {
            title: 'Dow dives nearly 3000',
            body: 'bulk of the cards content',
            category: 'Analysis',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqnUduYiLIbcZhb6AQHlkemCHG7A9ZI-_Sow&usqp=CAU',
            link: 'bbc.com'
          },
          {
            title: 'Gold Has Outperformed Stocks',
            body: 'On the card title and content quick example text to build',
            category: 'Analysis',
            img: 'https://wall-street.com/wp-content/uploads/2016/09/January-27-Gold-Stock.jpg',
            link: 'bbc.com'
          },
        ]
      }
    },
    methods: {
      fetchIndice(symbol) {
        useQuery({
          query: "finage.last",
          variables: {
            suffix: "index",
            symbol,
          },
          axios: this.$axios,
        })
        .then(response => {
          let indexFound = this.indices.findIndex( indice => indice.symbol === response.symbol );
          let i = this.indices[indexFound];
          i.indexFound = indexFound;
          i.price = response.price.toFixed(2);
          i.priceNumber = response.price;
          this.$root.$emit('updateIndice', i);
        })
        .then(() => {
          useQuery({
            query: "finage.agg",
            variables: {
              suffix: "index",
              symbol,
              period: "1day",
              from: "2021-01-01",
              to: this.today,
            },
            axios: this.$axios,
          })
          .then(response => {
            let indexFound = this.indices.findIndex( indice => indice.symbol === response.symbol );
            let i = this.indices[indexFound];
            i.indexFound = indexFound;
            let last = response.results.pop();
            i.difference = i.priceNumber - last.c
            i.difference = i.difference.toFixed(2)
            i.change = (i.priceNumber - last.c) / last.c * 100
            i.change = i.change.toFixed(2)
            i.price = parseFloat(last.c).toFixed(2);
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
      showGrid() {
        this.view = 'grid';
      },
      showList() {
        this.view = 'list';
      },

    },
    created() {
      //this.filteredIndices = this.indices.filter(item => item.type === 'indice');
      this.indices.forEach(item => {
        if (item.type !== 'currency'){
          if (item.type !== 'indice'){
            //this.fetchBonds(item.symbol);
          } else {
            this.fetchIndice(item.symbol);
          }
        }
      });
      this.$root.$on('updateIndice', (item) => {
        //let i = this.indices.findIndex(index => index.name === item.name && item.type=="indice");
        //console.log(item)
        if (item.indexFound !== -1) {
          this.$set(this.indices[item.indexFound], 'price', item.price);
          this.$set(this.indices[item.indexFound], 'difference', item.difference);
          this.$set(this.indices[item.indexFound], 'change', item.change);
        }
        this.$nextTick(() => {
          this.loading = false;
        });
      });
    },
  }
</script>

<style lang="scss">

</style>
