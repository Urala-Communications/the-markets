<template>
  <div class="bg-white">
    <b-jumbotron class="text-center" text-variant="white" :style="{backgroundImage:`url(${require('(./../../assets/'+slug+'.jpg')})`}">
      <p>Personal Finance</p>
      <h1>{{ article }}</h1>
      <p>By Rebecca Hey</p>
      <span class="credit">© GETTY IMAGES / VANNI BASSETT</span>
    </b-jumbotron>
    <div class="container content buffer pb-5">
      <div class="row d-flex justify-content-center">
        <div class="col-12 py-3">
          <em class="mb-3 d-block">We publish unbiased reviews; our opinions are our own and are not influenced by payments from advertisers. Learn about our independent review process and partners in our advertiser disclosure.</em>
          <strong>By Rebecca Hey</strong>
          <p>Published: January 23, 2021	Updated: March 2, 2021</p>
          <div class="social d-flex justify-content-between">
            <a href="" class="social-icon">
              <img src="./../../assets/twitter-black.svg" alt="">
            </a>
            <a href="" class="social-icon">
              <img src="./../../assets/fb-black.svg" alt="">
            </a>
            <a href="" class="social-icon">
              <img src="./../../assets/youtube-black.svg" alt="">
            </a>
            <a href="" class="social-icon">
              <img src="./../../assets/instagram-black.svg" alt="">
            </a>
          </div>
          <p>At The Markets, we name the best credit cards based on the features we think are the most valuable for different sets of needs. Whether you’re looking for travel rewards, cash back on everyday purchases, a way to build credit, or a better way to pay down costly debt, we’ve done the research and crunched numbers to find the very best option for you. These are the best credit cards you can get right now, and we highly recommend giving each offer a second look:</p>
        </div>
        <div class="col-12 py-3">
          <h4>Table of Contents</h4>
          <ul>
            <li>
              <a href="#first">HSBC Cash Rewards Mastercard®</a>
            </li>
            <li>
              <a href="#second">Business Advantage Travel Rewards Credit Card</a>
            </li>
            <li>
              <a href="#third">Wells Fargo Propel American Express® Card</a>
            </li>
            <li>
              <a href="#fourth">Discover It® Chrome For Students</a>
            </li>
            <li>
              <a href="#fifth">Chase Sapphire Reserve®</a>
            </li>
            <li>
              <a href="#sixth">Discover It® Secured</a>
            </li>
            <li>
              <a href="#seventh">The Platinum Card® From American Express</a>
            </li>
            <li>
              <a href="#eigth">Wells Fargo Platinum Card</a>
            </li>
            <li>
              <a href="#ninth">American Express Gold Card</a>
            </li>
            <li>
              <a href="#tenth">MBNA Platinum Card</a>
            </li>
          </ul>
        </div>
        <div class="col-12 py-3">
          <h2>Best Overall</h2>
          <h3>HSBC Cash Rewards Mastercard®</h3>
          <div class="d-flex">
            <div>
              <img src="./../../assets/card.jpg" alt="hsbc">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: 'The Markets - ' + this.article
      }
    },
    async asyncData({ params }) {
      const slug = params.article;
      const article = slug.replace(/-/g, ' ').split(' ').map(w => w[0].toUpperCase()+ w.substring(1)).join(' ');
      return { slug, article }
    },
  }
</script>

<style lang="scss" scoped>
  .jumbotron {
    margin-top: -1rem;
    max-height: 810px;
    height: 74vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    border-radius: 0;
    @include title-font();
    .credit{
      position: absolute;
      bottom: 5px;
      left: 5px;
      font-size: 12px;
    }
  }
  p {
      margin-bottom: 0.3rem;
  }
  hr {
      border-top: 1px solid rgb(198 198 198 / 41%);
      display: block;
      width: 100%;
  }
  h3{
    margin-top: 2rem;
  }
  @media(max-width: 768px){
    .jumbotron{
      height: 44vh;
    }
  }
</style>
