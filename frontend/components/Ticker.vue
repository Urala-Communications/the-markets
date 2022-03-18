<template>
  <div class="ticker">
    <div class="d-flex ticker-wrap">
      <TickerItem
        v-for="item in tickerItems"
        :key="item.name"
        :item="item"
        :bitcoin="item.name === 'Bitcoin' ? true : false"
      />
    </div>
  </div>
</template>

<script>
import TickerItem from "./TickerItem.vue";

export default {
  name: 'Ticker',
  components: {
    TickerItem
  },
  props: {
    tickerItems: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">

.ticker{
  width: 100%;
  margin-top: 1rem;
  /* border-top: 1px solid rgb(0 0 0 / 20%); */
  padding: 10px 30px;
  background-color: #f3f3ff;
  justify-content: space-between;
  @include main-font();
  .ticker-wrap{
    justify-content: space-between;
    /* max-width: 1620px; */
    margin: 0 auto;
  }
  .item {
    display: inline-flex;
    /* width: calc(100% / 8); */
    padding: 0 0.25rem;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    color:#1c1e53;
    &:first-of-type{
      border-left: none;
    }
    h3{
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 0;
      display: inline-block;
    }

    .info {
      line-height: 1.1;
      strong, p {
        @include number-font;
        font-size: 11px;
      }
      .diff, .change{
        @include number-font;
        font-size: 11px;
      }
      /* &.bitcoin {
        strong{width: 56px;}
        p{
          width: 105px;
        }
      } */
    }
    p, strong{
      font-size: 12px;
      font-weight: 800;
      display: inline-block;
      /* @include number-font; */
    }
    p{
      margin-bottom: 0;
      margin-top: 3px;
      /* font-size: 12px; */
    }
    &.up {
      .diff, .change {
        color: $green;
      }
    }
    &.down {
      .diff, .change {
        color: $red
      }
    }
  }
}

.icon {
  min-width: 34px;
  height: 34px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  margin-right: 10px;
  &.usa {
    background-image: url('./../assets/usa.svg');
  }
  &.uk {
    background-image: url('./../assets/uk.svg');
  }
  &.jp {
    background-image: url('./../assets/japan.svg');
  }
  &.cn {
    background-image: url('./../assets/china.svg');
  }
  &.hk {
    background-image: url('./../assets/hk.svg');
  }
  &.ko {
    background-image: url('./../assets/korea.svg');
  }
  &.germany {
    background-image: url('./../assets/germany.svg');
  }
  &.spain {
    background-image: url('./../assets/spain.svg');
  }
  &.turkey {
    background-image: url('./../assets/turkey.svg');
  }
  &.usd {
    background-image: url('./../assets/usa.svg');
  }
  &.usdjpy {
    background-image: url('./../assets/usdjpy.svg');
    background-size: 90%;
  }
  &.usdkrw {
    background-image: url('./../assets/usdkrw.svg');
    background-size: 90%;
  }
  &.usdcny {
    background-image: url('./../assets/usdcny.svg');
    background-size: 90%;
  }
  &.usdtry {
    background-image: url('./../assets/usdtry.svg');
    background-size: 90%;
  }
  &.usdbrl {
    background-image: url('./../assets/usdbrl.svg');
    background-size: 90%;
  }
  &.usdils {
    background-image: url('./../assets/usdils.svg');
    background-size: 90%;
  }
  &.usdrub {
    background-image: url('./../assets/usdrub.svg');
    background-size: 90%;
  }
  &.eurusd {
    background-image: url('./../assets/eurusd.svg');
    background-size: 90%;
  }
  &.gbpusd {
    background-image: url('./../assets/gbpusd.svg');
    background-size: 90%;
  }
  &.gauusd {
    background-image: url('./../assets/gauusd.svg');
    background-size: 90%;
  }
  &.eu {
    background-image: url('./../assets/eu.svg');
  }
  &.gbp {
    background-image: url('./../assets/uk.svg');
  }

  &.s-btc, &.s-btcb {background-image: url('./../assets/btc.svg');}
  &.s-eth {background-image: url('./../assets/eth.svg');}
  &.s-doge {background-image: url('./../assets/dogecoin.svg');}
  &.s-xrp {background-image: url('./../assets/xrp.svg');}
  &.s-miota {background-image: url('./../assets/iota.svg');}
  &.s-ada {background-image: url('./../assets/cardano.svg');}
  &.s-dot {background-image: url('./../assets/polkadot.svg');}
  &.s-oneinch {background-image: url('./../assets/oneinch.png')}
  &.s-aave  {background-image: url('./../assets/aave.png')}
  &.s-algo  {background-image: url('./../assets/algo.png')}
  &.s-atom  {background-image: url('./../assets/atom.png')}
  &.s-avax  {background-image: url('./../assets/avax.png')}
  &.s-axs  {background-image: url('./../assets/axie.png')}
  &.s-bat  {background-image: url('./../assets/bat.png')}
  &.s-bnb  {background-image: url('./../assets/bnb.png')}
  &.s-bch  {background-image: url('./../assets/bch.png')}
  &.s-busd  {background-image: url('./../assets/busd.png')}
  &.s-cake  {background-image: url('./../assets/cake.png');}
  &.s-comp  {background-image: url('./../assets/comp.png')}
  &.s-crv  {background-image: url('./../assets/crv.png')}
  &.s-cro  {background-image: url('./../assets/cro.png')}
  &.s-dash  {background-image: url('./../assets/dash.png')}
  &.s-enj  {background-image: url('./../assets/enj.png')}
  &.s-etc  {background-image: url('./../assets/etc.png')}
  &.s-fil {background-image: url('./../assets/file.png')}
  &.s-flow {background-image: url('./../assets/flow.png')}
  &.s-grt  {background-image: url('./../assets/grt.png')}
  &.s-gala  {background-image: url('./../assets/gala.png')}
  &.s-icp  {background-image: url('./../assets/icp.png')}
  &.s-link  {background-image: url('./../assets/link.png')}
  &.s-ltc  {background-image: url('./../assets/ltc.png')}
  &.s-luna  {background-image: url('./../assets/luna.png')}
  &.s-mana  {background-image: url('./../assets/mana.png'); }
  &.s-matic  {background-image: url('./../assets/matic.png')}
  &.s-mkr  {background-image: url('./../assets/mkr.png')}
  &.s-neo  {background-image: url('./../assets/neo.png'); }
  &.s-shib  {background-image: url('./../assets/shiba.png')}
  &.s-sol  {background-image: url('./../assets/sol.png')}
  &.s-sand  {background-image: url('./../assets/sand.png')}
  &.s-sushi  {background-image: url('./../assets/sushi.png')}
  &.s-trx  {background-image: url('./../assets/tron.png')}
  &.s-uni  {background-image: url('./../assets/uni.png')}
  &.s-yfi  {background-image: url('./../assets/yfi.png')}
  &.s-vet  {background-image: url('./../assets/vet.png')}
  &.s-xlm  {background-image: url('./../assets/xlm.png')}
  &.s-zil  {background-image: url('./../assets/zil.png')}
  &.s-theta  {background-image: url('./../assets/theta.png')}
  &.s-ftt  {background-image: url('./../assets/ftt.png')}
  &.s-ftm  {background-image: url('./../assets/ftm.png')}
  &.s-hbar  {background-image: url('./../assets/hbar.png')}
  &.s-dai  {background-image: url('./../assets/dai.png')}
  &.s-egld  {background-image: url('./../assets/egld.png')}
  &.s-near  {background-image: url('./../assets/near.png')}
  &.s-xtz  {background-image: url('./../assets/tezos.gif')}
  &.s-xmr  {background-image: url('./../assets/xmr.png')}
  &.s-eos  {background-image: url('./../assets/eos.png')}
  &.s-hnt  {background-image: url('./../assets/hnt.png')}
  &.s-lrc  {background-image: url('./../assets/lrc.png')}
  &.s-usdt  {background-image: url('./../assets/usdt.png')}
  &.s-ust  {background-image: url('./../assets/ust.png')}
  &.s-usdc  {background-image: url('./../assets/usdc.png')}
  &.s-wbtc  {background-image: url('./../assets/wbtc.png')}
  &.s-ceth {background-image: url('./../assets/ceth.png');}
  &.s-lido, &.s-steth {background-image: url('./../assets/lido.png');}
  &.s-cdai {background-image: url('./../assets/cdai.png');}
  &.s-frax {background-image: url('./../assets/frax.png');}
  &.s-klay {background-image: url('./../assets/klay.png');}
  &.s-leo {background-image: url('./../assets/leo.png');}
  &.s-omi {background-image: url('./../assets/ecomi.png');}
  &.s-mim {background-image: url('./../assets/mim.png');}
  &.s-okb {background-image: url('./../assets/okb.png');}
  // commodities
  &.gold {
    background-image: url('./../assets/gold.svg');
  }
  &.silver {
    background-image: url('./../assets/silver.svg');
  }
  &.natgas {
    background-image: url('./../assets/natgas.svg');
  }
  &.carbon {
    background-image: url('./../assets/carbon.svg');
  }
  &.crude-oil {
    background-image: url('./../assets/oil.svg');
  }
  &.brent-oil {
    background-image: url('./../assets/brent.svg');
  }
  &.coffee {
    background-image: url('./../assets/coffee.svg');
  }
  &.tesla {
    background-image: url('./../assets/tesla.svg');
    background-size: 80%;
  }
  &.blackberry {
    background-image: url('./../assets/blackberry.svg');
  }
  &.gme {
    background-image: url('./../assets/gamestop.svg');
  }
  &.amc {
    background-image: url('./../assets/amc.svg');
  }
  &.amazon {
    background-image: url('./../assets/amazon.svg');
    background-size: 80%;
  }
  &.apple {
    background-image: url('./../assets/apple.svg');
    background-size: 70%;
  }
  &.moderna {
    background-image: url('./../assets/moderna.svg');
  }
  &.nvidia {
    background-image: url('./../assets/nvidia.svg');
  }
  &.nio {
    background-image: url('./../assets/nio.svg');
  }
  &.nio {
    background-image: url('./../assets/nio.svg');
  }
  &.facebook {
    background-image: url('./../assets/facebook.svg');
  }
  &.pfizer {
    background-image: url('./../assets/pfizer.svg');
  }
  &.xpeng {
    background-image: url('./../assets/xpeng.svg');
  }
  &.palantir {
    background-image: url('./../assets/palantir.svg');
    background-size: 90%;
    background-position-x: 3px;
  }
  &.boeing {
    background-image: url('./../assets/boeing.svg');
    background-size: 80%;
  }
  &.santander {
    background-image: url('./../assets/santander.svg');
    background-size: 80%;
  }
  &.alibaba {
    background-image: url('./../assets/alibaba.svg');
  }
  /* &.google {
    background-image: url('./../assets/google.png');
  } */
  &.microsoft {
    background-image: url('./../assets/microsoft.svg');
    background-size: 60%;
  }
}
/* #crypto .index .fire .icon{
  margin-top: -10px;
  margin-bottom: -10px;
} */
.index .fire{
  position: relative;
  z-index: 1;
  &:after, &:before{
    position: absolute;
    content: '';
    background-image: url('./../assets/fire.gif');
    background-repeat: no-repeat;
    background-size: cover;
    left: -8px;
    top: -24px;
    width: 43px;
    height: 57px;
    z-index: -1;
  }
  &:before {
    background-image: url('./../assets/fire-front.gif');
    z-index: 2;
  }
}

/* .home .index .fire{
  position: relative;
  .icon {
    position: absolute;
    min-width: 38px;
    top: -22px;
    left: -5px;
  }
} */

@media(max-width:1430px){
  .ticker{
    .item{
      &:nth-of-type(n+7){
        display: none;
      }
    }
  }
}

@media(max-width:1280px){
  .ticker{
    .item{
      /* width: calc(100% / 6); */
      &:nth-of-type(n+6){
        display: none;
      }
    }
  }
}

@media(max-width:991px){
  .ticker{
    .item{
      /* width: calc(100% / 4); */
      &:nth-of-type(n+5){
        display: none;
      }
    }
  }
}

@media(max-width: 768px){
  .ticker{
    display: none;
  }
}

</style>
