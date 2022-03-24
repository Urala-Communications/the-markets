<template>
  <div v-if="newsData.length > 0" class="news justify-content-between">
    <div v-if="newsData.video">
      <b-card
        v-for="(item, index) in newsData"
        :key="index"
        no-body
      >
        <b-row>
          <b-col class="pr-0">
            <b-embed
              type="iframe"
              aspect="16by9"
              :src="item.url"
              allowfullscreen
            ></b-embed>
            <!-- <iframe width="560" height="315" :src="item.url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
          </b-col>
          <b-col class="d-flex align-items-center">
            <b-card-body class="pl-0 pb-0 pt-0">
              <b-card-text>
                <h5 class="card-title" v-snip="2">{{ item.title }}</h5>
                <span>{{ item.time }}</span>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <a
      v-else
      v-for="(item, index) in newsData"
      :key="index"
      :href="item.url"
      target="_blank"
    >
      <b-card no-body>
        <b-row v-if="item.symbol">
          <b-col class="d-flex align-items-center col-12">
            <b-card-body class="pr-0 pb-0 pt-0">
              <b-card-text>
                <!-- <p v-if="item.source" class="category">{{ item.source }}</p> -->
                <p class="card-text source">{{ item.source }} | {{ formatDate(item.date) }}</p>
                <h5 class="card-title" v-snip="2">{{ item.title }}</h5>
                <p class="card-text" v-snip="2">{{ item.description }}</p>
                <span>{{ item.time }}</span>
              </b-card-text>
            </b-card-body>
          </b-col>
          <!-- <b-col class="d-flex align-items-center col-md-7">
            <b-card-body class="pr-0 pb-0 pt-0">
              <b-card-text> -->
                <!-- <p v-if="item.source" class="category">{{ item.source }}</p> -->
                <!-- <h5 class="card-title" v-snip="2">{{ item.title }}</h5>
                <p class="card-text" v-snip="2">{{ item.description }}</p>
                <span>{{ item.time }}</span>
              </b-card-text>
            </b-card-body>
          </b-col> -->
          <!-- <b-col class="pl-0 col-md-5">
            <b-card-img :src="getThumb(item)" alt="image"></b-card-img>
          </b-col> -->
        </b-row>
        <b-row v-else>
          <b-col md="12">
            <b-card-body>
              <b-card-text>
                <p v-if="item.category" class="category">{{ item.category }}</p>
                <h5 class="card-title" v-snip="2">{{ item.title }}</h5>
                <p class="card-text" v-snip="2">{{ item.description }}</p>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </a>
  </div>
  <div v-else class="loading-news">
    <div class="dummy-item">
      <h3></h3>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <div class="dummy-item">
      <h3></h3>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <div class="dummy-item">
      <h3></h3>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <div class="dummy-item">
      <h3></h3>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<script>
import VueSnip from 'vue-snip'
import {stocks, cryptocurrency} from "./../market.js";
export default {
  name: 'News',
  props: {
    newsData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      stocks,
      cryptocurrency
    }
  },
  methods: {
    getThumb(newsItem){
      let symbol = '';
      if(newsItem.type === 'cryptocurrency'){
        symbol = this[newsItem.type].find(item => item.icon === newsItem.symbol)
      } else {
        symbol = this[newsItem.type].find(item => item.symbol === newsItem.symbol)
      }
      return require(`~/assets/news/${symbol.thumb}`)
    },
    formatDate(date){
      // if(date.includes('ago')){
      //   return date
      // } else {
        let d = new Date(date)
        return d.toLocaleString('en-GB',{month:'long', year:'numeric', day:'numeric'});
      // }
    }
  }
  // mounted(){}
}
</script>

<style lang="scss">

.news{
  flex-direction: column;
}

.card {
  border: none;
  flex-direction: row;
  padding: 0.4rem 0;
  background: #ffffff;
  border-bottom: 1px solid rgba(31, 34, 99, 0.15);
  border-radius: 0;
  background: #ffffff;
  .row {overflow: hidden;}
  .card-img {

    margin-right: 0;
    border-radius: 18px;
    box-shadow: 0px 2.5px 9px 0 rgba(218, 226, 239, 0.5);
  }
  .card-body{
    padding: 0;
    overflow: hidden;
    .card-title {
      font-size: 14px;
      text-transform: capitalize;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    p.category{color: #CD34AD; font-size: 12px; margin-bottom: 8px;}
    p.source{color: rgba(31,34,99,0.61); font-size: 12px; margin-bottom: 2px; font-weight: 600;}
    p{font-size: 12px; margin-bottom: 0;}
  }
}

.loading-news {
  display: flex;
  flex-direction: column;
  .dummy-item{
    width: 100%;
    height: 5rem;
    margin-bottom: 1.5rem;
    animation: blink 0.6s ease-in infinite alternate;
    &:nth-of-type(even){
      animation-delay: 0.6s;
    }
  }
  h3, p {
    background: #eee;
    border-radius: 12px;
    width: 100%;
    height: 0.75rem;
    margin-bottom: 0.5rem;
  }
  h3 {
    width: 65%;
  }
}

@keyframes blink {
  from {opacity: 1;}
  to {opacity: 0.6;}
}

@media(min-width: 992px) and (max-width: 1199px){
  .card{
    .card-img{
      /* height: 8vw; */
    }
    .card-body{
      p{
        -webkit-line-clamp: 2 !important;
      }
    }
  }
}

@media(max-width: 992px){
  .news {
    justify-content: center !important;
    padding-right: 10px;
  }
  .card{
    .card-img{
      height: auto;
    }
  }
}

@media(max-width: 768px){
  .card{
    overflow: hidden;
    .row .pr-0{
      padding-left: 15px !important;
    }
    .col-md-7{padding-right: 5px;}
    .col-md-5{margin-right: 10px;}
    .card-body{
      padding: 0 0 0 5px !important;
      .card-title{
        font-size: 14px;
        -webkit-line-clamp: 4 !important;
      }
      p{font-size: 12px;}
    }
  }
}

@media(max-width: 450px){
  .card{
    .card-body{
      .card-title{
        /* font-size: 12px; */
      }
      .card-text .card-text{display: none !important;}
    }
  }
}

</style>
