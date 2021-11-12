<template>
  <div>
    <!-- <template v-if="isDev">
      <div class="ad">[ADSENSE PLACEHOLDER]</div>
    </template> -->
    <!-- <template v-else-if="headerAd">
      <ins class="ad"
      style="display:block"
      data-ad-client="ca-pub-7227085508439540"
      data-ad-slot="1830600921"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    </template> -->
    <template v-if="headerAd">
      <div class="banners container">
        <b-carousel id="carousel-fade" fade img-width="1200" img-height="90" :interval="8000">
          <b-carousel-slide>
            <template #img>
              <NuxtLink to="/personal-finance/best-us-credit-cards-september-2021">
                <img class="img-fluid w-100 desktop" width="1200" height="90" src="./../assets/banners/credit-us-desktop.png" alt="best-us-credit-cards">
                <img class="img-fluid w-100 tablet" width="1000" height="90" src="./../assets/banners/credit-us-tablet.png" alt="best-us-credit-cards">
                <img class="img-fluid w-100 mobile" width="767" height="50" src="./../assets/banners/credit-us-mobile.png" alt="best-us-credit-cards">
              </NuxtLink>
             </template>
          </b-carousel-slide>
          <b-carousel-slide>
            <template #img>
              <NuxtLink to="/personal-finance/best-trading-apps-for-the-uk-2021">
                <img class="img-fluid w-100 desktop" width="1200" height="90" src="./../assets/banners/trading-uk-desktop.png" alt="best-trading-apps-for-the-uk">
                <img class="img-fluid w-100 tablet" width="1000" height="90" src="./../assets/banners/trading-uk-tablet.png" alt="best-trading-apps-for-the-uk">
                <img class="img-fluid w-100 mobile" width="767" height="50" src="./../assets/banners/trading-uk-mobile.png" alt="best-trading-apps-for-the-uk">
              </NuxtLink>
            </template>
          </b-carousel-slide>
          <b-carousel-slide>
            <template #img>
              <NuxtLink to="/personal-finance/best-uk-credit-cards-september-2021">
                <img class="img-fluid w-100 desktop" width="1200" height="90" src="./../assets/banners/credit-uk-desktop.png" alt="best-uk-credit-cards">
                <img class="img-fluid w-100 tablet" width="1000" height="90" src="./../assets/banners/credit-uk-tablet.png" alt="best-uk-credit-cards">
                <img class="img-fluid w-100 mobile" width="767" height="50" src="./../assets/banners/credit-uk-mobile.png" alt="best-uk-credit-cards">
              </NuxtLink>
            </template>
          </b-carousel-slide>
          <b-carousel-slide>
            <template #img>
              <NuxtLink to="/personal-finance/best-trading-apps-for-the-usa-2021">
                <img class="img-fluid w-100 desktop" width="1200" height="90" src="./../assets/banners/trading-us-desktop.png" alt="best-trading-apps-for-the-usa">
                <img class="img-fluid w-100 tablet" width="1000" height="90" src="./../assets/banners/trading-us-tablet.png" alt="best-trading-apps-for-the-usa">
                <img class="img-fluid w-100 mobile" width="767" height="50" src="./../assets/banners/trading-us-mobile.png" alt="best-trading-apps-for-the-usa">
              </NuxtLink>
            </template>
          </b-carousel-slide>
        </b-carousel>
      </div>
    </template>
    <template v-else-if="feedAd">
      <ins class="ad"
      style="display:block"
      data-ad-format="fluid"
      data-ad-layout-key="-fb+5w+4e-db+86"
      data-ad-client="ca-pub-7227085508439540"
      data-ad-slot="5888980029"></ins>
    </template>
    <template v-else>
      <ins class="ad"
        style="display:block"
        data-ad-client="ca-pub-7227085508439540"
        data-ad-slot="4995820314"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    headerAd: {
      type: Boolean,
      default: false
    },
    feedAd: {
      type: Boolean,
      default: false
    }
  },
  head() {
    let productionScripts = []
    if (!this.isDev) {
      return {
        scripts: [
          { hid: 'adsense', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', defer: true, 'data-ad-client': 'ca-pub-7227085508439540' },
        ]
      }
    }
    return { }
  },
  data() {
    return {
       isDev: process.env.NODE_ENV !== 'production'
    }
  },
  mounted() {
    if (!this.isDev) {
      this.$nextTick(() => {
        try {
          // this is required for each ad slot (calling this once will only load 1 ad)
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          console.error(error)
        }
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.ad{
  min-height: 70px;
  background: #f9f9f9;
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banners {
  position: relative;
  .carousel{
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 2.5px 9px 0 rgb(218 226 239 / 50%);
  }
  img {
    width: 100%;
    &.tablet, &.mobile{
      display: none;
    }
  }
}

@media(max-width: 991px){
  .banners {
    img{
      &.desktop, &.mobile{
        display: none;
      }
      &.tablet{
        display: block;
      }
    }
  }
}

@media(max-width: 767px){
  .banners {
    padding: 0;
    img{
      &.desktop, &.tablet{
        display: none;
      }
      &.mobile{
        display: block;
      }
    }
  }
}
</style>