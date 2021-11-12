<template>
  <div v-if="indexPage && !mobileScreen" class="row mx-0 justify-content-between w-100">
    <div class="grid">
      <div class="pb-3"><strong>Symbol</strong></div>
      <div class="pb-3"><strong>Name</strong></div>
      <div class="pb-3"><strong>Price</strong></div>
      <div class="pb-3 justify-content-center"><strong>% Change</strong></div>
      <div class="pb-3 justify-content-center"><strong>$ Change</strong></div>
    </div>
    <div
      v-for="index in data"
      :key="index.name"
      class="w-100 grid-wrapper"
    >
      <div v-if="type === 'rising'" class="movers-grid grid">
        <span>{{ index.symbol }}</span>
        <span>{{ index.company_name }}</span>
        <span :class="index.change > 0 ? 'up' : 'down'"><span v-if="type !== 'indices'">$</span>{{ index.price }}</span>
        <span class="justify-content-center green font-weight-bold">{{ index.change_percentage }}</span>
        <span class="justify-content-center">{{ index.change }}</span>
      </div>
      <div v-else class="grid" :class="priceStatus(index.change)">
        <div>{{ index.symbol }}</div>
        <div>
          <NuxtLink
            class="instrument index d-flex icon-wrapper"
            :to="`/${type}/${index.name.replace(/\s+|[' '\/]/g, '-').toLowerCase()}`"
          >
            <i class="icon" :class="index.icon" />
            <!-- :style="{backgroundImage:`url(./_nuxt/assets/${index.icon}.png)`}" would be nice if all imgs were same type png/svg-->
            {{ index.name }}
            <span v-if="index.marketOpen" class="indicator"/>
          </NuxtLink>
        </div>
        <div class="price ask number-font"><span v-if="type !== 'indices'">$</span>{{ index.price }}</div>
        <div class="justify-content-center number-font">
          <Price v-if="index.change" :index="index" :difference="index.change" />
        </div>
        <div class="justify-content-center number-font">
          <Price v-if="index.difference" :index="index" :difference="index.difference" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="type === 'rising'" class="movers-list row mx-0 justify-content-between w-100">
    <div
      v-for="index in data"
      :key="index.symbol"
      class="mover index"
    >
      <h4>{{ index.company_name }}&nbsp;<span class="green">{{index.change_percentage}}</span></h4>
      <Price :index="index" :price="index.price" class="mover-price"/>
    </div>
  </div>
  <div v-else class="row mx-0 justify-content-between w-100">
    <NuxtLink
      v-for="index in data"
      :key="index.name"
      class="instrument index"
      :class="index.change > 0 ? 'up' : 'down'"
      :to="`/${type}/${index.name.replace(/\s+|[' '\/]/g, '-').toLowerCase()}`"
    >
      <div class="d-flex icon-wrapper">
        <div class="icon" :class="index.icon"/>
        <h4>{{ index.name }}<span v-if="index.marketOpen" class="indicator"/></h4>
      </div>
      <Price :index="index" :price="index.price" />
    </NuxtLink>
  </div>
</template>

<script>
import Price from '../components/Price.vue'

export default {
  name: 'IndexList',
  components: {
    Price
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    indexPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mobileScreen: false
    }
  },
  methods: {
    priceStatus(change){
      if(typeof change === 'undefined'){
        return ''
      } else if (change > 0){
        return 'up'
      } else {
        return 'down'
      }
    }
  },
  created() {
    if(window.innerWidth < 768){
      this.mobileScreen = true
    }
  }
  // mounted(){console.log(this.data)}
}
</script>

<style lang="scss">

.movers-list {
  .index {
    padding: 0.5rem 0 0;
    /* border-bottom: none; */
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    h4{
      display: flex;
      justify-content: space-between;
      line-height: 16px;
      width: 100%;
      /* span{@include number-font();} */
    }
    .mover-price{
      width: 100%;
      strong{padding: 0;}
    }
  }
}

.home {
  .index {
    &:first-of-type{padding-top: 0;}
    /* &:last-of-type, &:nth-of-type(6){border-bottom: none;} */
  }
  .indices .index {
    /* &:nth-of-type(6){border-bottom: 1px solid #e3e3e3;} */
    /* &:nth-of-type(10){border-bottom: none;} */
  }
}

/* .list-page {
  h2{
    font-size: 24px;
  }
} */

.grid {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
  width: 100%;
  font-size: 14px;
  > div, > span {
    padding: 4px;
    border-bottom: 1px solid #e3e3e3;
    display: flex;
    align-items: center;
    .index{
      border-bottom: none;
      justify-content: flex-start;
    }
  }
  .difference, .change{
    padding: 4px 7px;
    border-radius: 4px;
    min-width: 70%;
    text-align: center;
  }
  &.up{
    .ask.price {
      color: $green;
    }
  }
  &.up .flash {
    span {
      animation: flashGreen 0.5s ease-in;
    }
  }
  &.down {
    .ask.price {
      color: $red;
    }
  }
  &.down .flash {
    span {
      animation: flashRed 0.5s ease-in;
    }
  }
}

.grid-wrapper:last-of-type .grid{
  > div, > span{
    border-bottom: none;
  }
}

.indicator {
  position: relative;
  background: $red;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  left: 8px;
  animation: blink 0.6s ease-in infinite alternate;
}

.index {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  /* border-bottom: 1px solid #e3e3e3; */
  transition: 0.2s ease-in-out;
  h4 {
    display: inline-flex;
    font-size: 14px;
    margin-top: 0;
    align-items: center;
    margin-bottom: 0;
    position: relative;
    font-weight: 600;
    line-height: 24px;
  }
  .price {
    text-align: right;
    @include number-font;
  }
  p{
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    vertical-align: top;
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 0;
    /* @include number-font; */
    padding-right: 6px;
    span{
      margin-right: 10px;
    }
  }
  strong:not(.loading) {
    /* font-size: 16px; */
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 4px;
    /* @include number-font; */
    animation: none;
    color: rgba(1, 3, 78, 0.9);
  }
  .icon{
    display: inline-block;
    min-width: 28px;
    height: 28px;
  }
  .figures {
    display: inline-flex;
    justify-content: space-between;
    width: 80%;
    div {
      padding: 1px 5px;
      width: calc(100% / 4);
      &.percent {
        font-weight: 700;
      }
    }
  }
  &.up{
    .percent {
      color: $green;
      background: rgb(24 187 92 / 0.2);
    }
  }
  &.up .flash {
    strong, .difference, .change {
      animation: flashGreen 0.5s ease-in;
    }
  }
  &.down {
    .percent {
      color: $red;
      background: rgb(254 67 61 / 0.2);
    }
  }
  &.down .flash {
    strong, .difference, .change {
      animation: flashRed 0.5s ease-in;
    }
  }
}

@keyframes flashGreen{
  0%, 100%{
    background: none;
  }
  50%, 70% {
    background: #e7e7fc;
    color: $green;
  }
}

@keyframes flashRed{
  0%, 100%{
    background: none;
  }
  50%, 70% {
    background: #fff3ef;
    color: $red;
  }
}

.loading {
  width: 28px;
  height: 28px;
  background: linear-gradient(to right, $blue, $green) !important;
  border-radius: 50%;
  display: block;
  position: relative;
  animation: spin 1s infinite linear;
  box-shadow: rgb(51 51 51 / 30%) 1px 1px 3px 0px;
  &:after{
    content: '';
    background: #fff;
    position: absolute;
    width: 14px;
    height: 14px;
    top: 7px;
    left: 7px;
    border-radius: 50%;
  }
}

@keyframes spin {
  from {
    transform: rotate3d(0,0,1,0deg);
  }
  to {
    transform: rotate3d(0,0,1,360deg);
  }
}

.content.container.grid{
  .col-lg-6{
    width: 100%;
    flex: 100%;
    max-width: 100%;
    display: block;
    .row {
      justify-content: space-between;
    }
  }
  .icon-wrapper{
    flex-direction: column;
  }
  .index {
    flex-direction: column;
    width: calc(100% / 2 - 12px);
    max-width: 166px;
    box-shadow: 0px 2px 4px 1px rgb(128 128 128 / 40%);
    border: none;
    border-radius: 12px;
    margin-bottom: 20px;
    padding: 0.5rem 0 0;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    .icon{
      display: block;
      margin: 0 auto 10px;
    }
    p {
      font-size: 12px;
      font-weight: 700;
      justify-content: center;
    }
    .price {
      margin-top: 1.5rem;
      padding: 1rem 0;
      width: 100%;
      position: relative;
      height: 105px;
      text-align: center;
      strong{
        color: #fff;
        font-size: 16px;
        z-index: 2;
        position: absolute;
        bottom: 0;
        padding: 1rem 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      canvas{
        display: block !important;
        position: absolute;
        transform: scaleX(1.2);
        bottom: 1.4rem;
        animation: none;
      }
    }
    &.down {
      p {
        span {
          color: $red;
        }
      }
      .price strong:not(.loading){
        background: $red;
      }
      .loading{
        bottom: 1rem;
      }
    }
    &.up {
      p {
        span {
          color: $green;
        }
      }
      .price strong{
        background: $green;
      }
    }
  }
}

.news-section {
  padding-right: 20px;
}

@media(max-width:768px){
  .content.container{
    .col-lg-6, .col-lg-12:not(.white-well){
      padding: 0;
    }
    .index{
      width: 100vw;
      h5 {
        font-size: 12px;
      }
    }
    .index-list{
      background-position: 100% 20% !important;
      background-size: 70% !important;
    }
    h2{
      font-size: 28px;
      &:after{bottom: 0;}
    }
    .news-section {
      padding: 0 15px;
      .white-well {
        padding: 0 8px;
      }
      h2 {
        padding: 20px 26px 0;
      }
    }
  }
  .content.container.grid{
    .index{
      width: calc(100% / 2 - 10px);
    }
  }
  .grid{
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  }
}

@media(max-width: 400px){
  /* .content.container{
    h2{
      font-size: 22px;
      margin-bottom: 0.5rem;
    }
  } */
}
</style>
