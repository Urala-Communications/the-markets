<template>
  <div class="symbol">
    <div class="content container buffer">
      <!-- <div class="breadcrumbs">
        <a @click="$router.back()">Back</a>
        <NuxtLink class="to-index text-uppercase" :to="`/${type}`">
          Go To {{ type }}
        </NuxtLink>
      </div> -->
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="hero">
            <div class="title row mb-3">
              <div class="col-12 d-flex justify-content-between title-wrapper">
                <h1 class="d-inline-flex w-100 text-capitalize mb-0">
                  <div class="icon" :class="type === 'cryptocurrency' ? 's-'+item.icon : item.icon"  :id="item.icon.toUpperCase()"  :style="item.logo ? `background-image: url(${item.logo})`:''"  />
                  {{ item.name }}
                </h1>
                <div v-if="typeof marketStatus !== 'undefined' && marketStatus.length > 0" class="d-inline-flex justify-content-end align-items-center mt-2">
                  <span class="status text-uppercase font-weight-bold" :class="marketStatus === 'open' ? 'green' : 'red'">Market {{ marketStatus }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="graph white-well p-0" :class="item.change > 0 ? 'up' : 'down'">
            <div class="d-flex justify-content-between row">
              <div class="d-inline-flex flex-column">
                <h2 class="price"><span v-if="type !== 'indices'">$</span>{{ item.price }}</h2>
                <p v-if="item.difference" class="diff d-flex flex-column" :class="item.change > 0 ? 'up' : 'down'">
                  <span class="pr-3"><strong class="main-font pr-2">24h Difference:</strong>{{ item.difference > 0 ? '+' : '' }}{{ item.difference }}</span>
                  <span><strong class="main-font pr-2">24h Change:</strong>{{ item.change > 0 ? '+' : '' }}{{ item.change }}%</span>
                  <span v-if="marketCap"><strong class="main-font pr-2">Marketcap:</strong>${{ convertToReadableNumber(marketCap) }}</span>
                </p>
              </div>
              <!-- <div v-if="open" class="detail col-12 d-inline-flex flex-column text-right">
                <span><strong>Open:</strong>${{ open }}</span>
                <span><strong>High:</strong>${{ high }}</span>
                <span><strong>Low:</strong>${{ low }}</span>
                <span><strong>Close:</strong>${{ close }}</span>
                <span><strong>Volume:</strong>{{ volume }}</span>
                <span v-if="marketCap"><strong>Marketcap:</strong>${{ marketCap }}</span>
              </div> -->
            </div>

            <!-- <chart
              v-if="chartData.length > 0 && type !== 'cryptocurrency'"
              :data="chartData"
              :options="chartOptions"
              :chartColour="item.change > 0 ? 'up' : 'down'"
              :c_symbol="symbol"
              :new="item"
              ref="Chart"
            /> -->
            <TradingChart
              v-if="chartData.length > 0"
              :data="chartData"
              :options="chartOptions"
              :chartColour="item.change > 0 ? 'up' : 'down'"
              :symbol="live"
              :new="item"
              ref="TradingChart"
            />

          </div>
          <div v-if="profile.description" class="info row">
            <div class="col-12 col-lg-6 pl-0">
              <div class="white-well col-12">
                <h5>About</h5>
                <p>{{ profile.description }}</p>
              </div>
              <div class="white-well col-12">
                <h5>Information</h5>
                <div v-if="profile.developers" class="developers">
                  <p><strong>Developers</strong></p>
                  <p v-for="developer in profile.developers" :key="developer.name">
                    {{ developer.name }} | {{ developer.position }}
                  </p>
                </div>
                <p v-if="profile.startedAt"><strong>Founded:</strong> {{ new Date(profile.startedAt).toLocaleDateString('en-US') }}</p>
                <p v-if="profile.address"><strong>Headquarters:</strong> {{ profile.address }}</p>
                <p v-if="profile.employees"><strong>Number of employees:</strong> {{ profile.employees }}</p>
                <p v-if="profile.exchange"><strong>Exchange:</strong> {{ profile.exchange }}</p>
              </div>
              <div class="white-well col-12">
                <h5>Statistics</h5>
                <div class="d-flex flex-column">
                  <p>Open: ${{ open }}</p>
                  <p>High: ${{ high }}</p>
                  <p>Low: ${{ low }}</p>
                  <p>Close: ${{ close }}</p>
                </div>
                <!-- <div class="d-inline-flex align-items-center w-100 mt-1">
                  <strong class="mr-1">Range:</strong>2021-05-18 09:00 - 2021-05-19 09:00
                </div> -->
                <div class="d-md-flex flex-column w-100">
                  <p v-if="marketCap">Marketcap: ${{ marketCap }}</p>
                  <p>Volume: {{ volume }}</p>
                </div>
                <div v-if="yearHigh" class="d-inline-flex flex-column w-100">
                  <p>Year High: ${{ yearHigh }}</p>
                  <p>Year Low: ${{ yearLow }}</p>
                </div>
              </div>
            </div>
            <div v-if="open" class="col-12 col-lg-6 pr-0">
              <div v-if="news.length > 0" class="col-12 white-well">
                <h5 class="mb-0">News</h5>
                <News :newsData="orderedNews"/>
              </div>
            </div>
            <!-- <div class="col-12 col-lg-4">
              <div>
                <h5>Rating</h5>
                <hr>
                <p>50%</p>
                <h5>Earnings</h5>
                <hr>
              </div>
            </div> -->
          </div>
          <div class="white-well col-12">
            <Disqus shortname="themarkets-io"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '~/components/Chart.vue'
import TradingChart from '~/components/ohlcv-chart/TradingChart.vue'
import { Disqus } from 'vue-disqus'

export default {
  name: 'Item',
  components: {
    Chart,
    TradingChart,
    Disqus
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    profile: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String
    },
    news: {
      type: Array,
      default: () => []
    },
    open: {
      type: [String, Number]
    },
    close: {
      type: [String, Number]
    },
    high: {
      type: [String, Number]
    },
    low: {
      type: [String, Number]
    },
    volume: {
      type: [String, Number]
    },
    marketCap: {
      type: [String, Number]
    },
    yearHigh: {
      type: [String, Number]
    },
    yearLow: {
      type: [String, Number]
    },
    chartData: {
      type: Array,
      default: () => []
    },
    chartOptions: {
      type: Object,
      default: () => {}
    },
    marketStatus: {
      type: String
    },
    symbol: {
      type: String
    },
    live: {
      type: String
    }

  },
  computed: {
    orderedNews: function () {
      let dateOrderedNews = this.news.sort((a,b) => {
        return new Date(b.date) - new Date(a.date);
      });
      return dateOrderedNews;
    }
  },
  methods: {
    getchart() {
      return this.$refs.Chart
    },
    convertToReadableNumber(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e+9
      ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
      // Six Zeroes for Millions
      : Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3
      ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
      : Math.abs(Number(labelValue));
    }
  },
  created(){
    // console.log(this.item)
  }
}
</script>

<style lang="scss">
.symbol{
  .spinner-grow{
    margin-top: 30rem;
  }
  .breadcrumbs{
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    font-weight: bold;
    padding: 0 1rem 1rem;
    align-items: flex-end;
    .to-index{
      font-size: 14px;
      color: $green;
      text-transform: uppercase;
    }
  }
  .hero {
    /* height: 626px; */
    /* border-top: 1px solid #e2e7ee; */
    /* border-bottom: 1px solid #e2e7ee; */
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }
  h1 {
    font-size: 40px;
    align-items: center;
    @include title-font();
    @include main-font();
    font-weight: 900;
    color: rgba(1, 3, 78, 0.9);
    /* flex-direction: column; */
    margin-bottom: 0;
    .icon{
      margin-right: 8px;
      width: 40px;
      height: 40px;
    }
  }
  .status{
    font-size: 13px;
    width: 120px;
    position: relative;
    color: $green;
    &:before{
      content: '';
      border-radius: 50%;
      width: 8px;
      height: 8px;
      position: absolute;
      left: -11px;
      top: 5px;
    }
    &.green:before{background: $green; animation: blink 0.6s ease-in infinite alternate;}
    &.red:before{background: $red;}
  }
  /* .up span{
    color: $green;
    strong{color: #222;}
  }
  .down span{
    color: $red;
    strong{color: #222;}
  } */
  span{
    color: $red;
    strong{color: #222;}
  }
  .detail{
    font-size: 14px;
    width: auto;
    vertical-align: top;
    padding-top: 16px;
    padding-right: 24px;
    flex: 1;
    span{
      padding-right: 10px;
      text-transform: capitalize;
    }
    strong {
      /* font-size: 16px; */
      padding-right: 5px;
      @include main-font;
    }
    .status{
      position: relative;
      &:after{
        content: '';
        border-radius: 50%;
        width: 15px;
        height: 15px;
        position: absolute;
        right: -12px;
        top: 5px;
      }
      &.green:after{background: $green; animation: pulse 0.7s ease-in-out infinite alternate;}
      &.red:after{background: $red;}
    }
  }
  @keyframes pulse {
    from{filter: brightness(1);}
    to{filter: brightness(1.1);}
  }
  h5{
    font-weight: bold;
    margin-bottom: 12px;
    @include title-font();
  }
  p {
    display: block;
    width: 100%;
    /* color: #90a4be; */
    /* color: #454545; */
  }
  .title {
    p{
      /* @include number-font; */
    }
  }
  .graph {
    /* display: flex; */
    /* flex-direction: column; */
    /* justify-content: flex-end; */
    margin-bottom: 35px;
    overflow: hidden;
    /* &.up h2.price{
      color: $green;
    }
    &.down h2.price{
      color: $red;
    } */
    h2.price {
      /* @include main-font; */
      @include number-font;
      font-size: 30px;
      display: inline-block;
      padding-top: 16px;
      padding-left: 34px;
      color: $red;
    }
    .diff{
      padding-left: 34px;
      /* font-size: 14px; */
      @include number-font;
    }
    .highcharts-input-group{
      display: none;
    }
  }
  .info.row{
    max-width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    width: 100%;
    .white-well {
      padding-top: 10px;
      padding-bottom: 10px;
      margin-bottom: 2rem;
      /* p{
        margin-bottom: 0;
      } */
    }
  }
  .overflow {
    position: relative;
    max-height: 120px;
    overflow: hidden;
    padding-right: 1rem;
    margin-bottom: 1.5rem;
    border-top: 1px solid #555;
    padding-top: 1rem;
    a {
      color: #222;
    }
    p {
      margin-bottom: 0.5rem;
    }
  }

  .news{
    .card .card-body{
      margin-left: 0 !important;
      padding: 5px 0 !important;
    }
  }

  @media(max-width:768px){
    .title-wrapper{
      flex-direction: column;
    }
    h1{
      /* justify-content: center; */
      font-size: 28px;
      .icon {
        width: 44px;
        height: 44px
      }
    }
    .graph{
      h2.price{
        font-size: 36px;
        padding-top: 10px;
      }
    }
    /* .info.row{
      padding: 0 1rem;
    } */
  }
  @media(max-width:440px){
    .graph {
      .d-flex.row{
        flex-direction: column;
        margin: 0;
      }
      .diff{
        margin-bottom: 5px;
        padding-left: 1rem;
      }
      h2.price {
        padding-left: 1rem;
      }
      .detail {
        padding-top: 0;
        /* padding-left: 34px; */
        padding-left: 1rem;
        text-align: left !important;
        flex-direction: row !important;
        flex-wrap: wrap;
      }
    }
  }
}

.highcharts-container {
    width:100% !important;
    height:100% !important;
}

</style>