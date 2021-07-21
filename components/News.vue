<template>
  <div v-if="newsData.length > 0" class="news justify-content-between">
    <div v-if="newsData.video">
      <b-card
        v-for="item in newsData"
        :key="item.title"
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
      v-for="item in newsData"
      :key="item.title"
      :href="item.url"
      target="_blank"
    >
      <b-card no-body>
        <b-row v-if="item.symbol">
          <b-col class="pr-0 col-sm-5">
            <b-card-img :src="getThumb(item)" alt="image"></b-card-img>
          </b-col>
          <b-col class="d-flex align-items-center col-sm-7">
            <b-card-body class="pl-0 pb-0 pt-0">
              <b-card-text>
                <!-- <p v-if="item.source" class="category">{{ item.source }}</p> -->
                <h5 class="card-title" v-snip="2">{{ item.title }}</h5>
                <p class="card-text" v-snip="2">{{ item.description }}</p>
                <span>{{ item.time }}</span>
              </b-card-text>
            </b-card-body>
          </b-col>
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
  margin-bottom: 1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 1px 1px 3px #ddd;
  .card-img {
    /* height: 7rem; */
    margin-right: 0;
    box-shadow: 0px 2px 4px 1px rgb(128 128 128 / 10%);
    border-radius: 7px;
  }
  .card-body{
    padding: 15px;
    overflow: hidden;
    .card-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    p.category{color: #CD34AD; font-size: 12px; margin-bottom: 8px;}
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
      padding-right: 15px !important;
    }
    .card-body{
      padding: 0 5px 0 0 !important;
      margin-left: -15px;
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
