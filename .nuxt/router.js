import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0a723382 = () => interopDefault(import('../pages/analysis/index.vue' /* webpackChunkName: "pages/analysis/index" */))
const _496c86e3 = () => interopDefault(import('../pages/bonds/index.vue' /* webpackChunkName: "pages/bonds/index" */))
const _a96f1cc4 = () => interopDefault(import('../pages/commodities/index.vue' /* webpackChunkName: "pages/commodities/index" */))
const _df091c96 = () => interopDefault(import('../pages/cryptocurrency/index.vue' /* webpackChunkName: "pages/cryptocurrency/index" */))
const _3aa333dc = () => interopDefault(import('../pages/currencies/index.vue' /* webpackChunkName: "pages/currencies/index" */))
const _0c7bd5ba = () => interopDefault(import('../pages/indices/index.vue' /* webpackChunkName: "pages/indices/index" */))
const _18b0d8f7 = () => interopDefault(import('../pages/magazine/index.vue' /* webpackChunkName: "pages/magazine/index" */))
const _de70ea9c = () => interopDefault(import('../pages/movers.vue' /* webpackChunkName: "pages/movers" */))
const _ab892920 = () => interopDefault(import('../pages/personal-finance/index.vue' /* webpackChunkName: "pages/personal-finance/index" */))
const _93593d12 = () => interopDefault(import('../pages/privacy-policy.vue' /* webpackChunkName: "pages/privacy-policy" */))
const _621bf440 = () => interopDefault(import('../pages/stocks/index.vue' /* webpackChunkName: "pages/stocks/index" */))
const _6e10b958 = () => interopDefault(import('../pages/terms-and-conditions.vue' /* webpackChunkName: "pages/terms-and-conditions" */))
const _174fb299 = () => interopDefault(import('../pages/trading-101/index.vue' /* webpackChunkName: "pages/trading-101/index" */))
const _2b0ca2da = () => interopDefault(import('../pages/analysis/_article.vue' /* webpackChunkName: "pages/analysis/_article" */))
const _3ffbc7f0 = () => interopDefault(import('../pages/bonds/_symbol.vue' /* webpackChunkName: "pages/bonds/_symbol" */))
const _3a8e4403 = () => interopDefault(import('../pages/commodities/_symbol.vue' /* webpackChunkName: "pages/commodities/_symbol" */))
const _c1fccb4c = () => interopDefault(import('../pages/cryptocurrency/_symbol.vue' /* webpackChunkName: "pages/cryptocurrency/_symbol" */))
const _3048eb77 = () => interopDefault(import('../pages/currencies/_symbol.vue' /* webpackChunkName: "pages/currencies/_symbol" */))
const _1c79111f = () => interopDefault(import('../pages/indices/_symbol.vue' /* webpackChunkName: "pages/indices/_symbol" */))
const _46d91522 = () => interopDefault(import('../pages/magazine/_article.vue' /* webpackChunkName: "pages/magazine/_article" */))
const _13a44409 = () => interopDefault(import('../pages/personal-finance/_article.vue' /* webpackChunkName: "pages/personal-finance/_article" */))
const _eae8b3b6 = () => interopDefault(import('../pages/stocks/_symbol.vue' /* webpackChunkName: "pages/stocks/_symbol" */))
const _832d7f80 = () => interopDefault(import('../pages/trading-101/_article.vue' /* webpackChunkName: "pages/trading-101/_article" */))
const _f98abbbc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/analysis",
    component: _0a723382,
    name: "analysis"
  }, {
    path: "/bonds",
    component: _496c86e3,
    name: "bonds"
  }, {
    path: "/commodities",
    component: _a96f1cc4,
    name: "commodities"
  }, {
    path: "/cryptocurrency",
    component: _df091c96,
    name: "cryptocurrency"
  }, {
    path: "/currencies",
    component: _3aa333dc,
    name: "currencies"
  }, {
    path: "/indices",
    component: _0c7bd5ba,
    name: "indices"
  }, {
    path: "/magazine",
    component: _18b0d8f7,
    name: "magazine"
  }, {
    path: "/movers",
    component: _de70ea9c,
    name: "movers"
  }, {
    path: "/personal-finance",
    component: _ab892920,
    name: "personal-finance"
  }, {
    path: "/privacy-policy",
    component: _93593d12,
    name: "privacy-policy"
  }, {
    path: "/stocks",
    component: _621bf440,
    name: "stocks"
  }, {
    path: "/terms-and-conditions",
    component: _6e10b958,
    name: "terms-and-conditions"
  }, {
    path: "/trading-101",
    component: _174fb299,
    name: "trading-101"
  }, {
    path: "/analysis/:article",
    component: _2b0ca2da,
    name: "analysis-article"
  }, {
    path: "/bonds/:symbol",
    component: _3ffbc7f0,
    name: "bonds-symbol"
  }, {
    path: "/commodities/:symbol",
    component: _3a8e4403,
    name: "commodities-symbol"
  }, {
    path: "/cryptocurrency/:symbol",
    component: _c1fccb4c,
    name: "cryptocurrency-symbol"
  }, {
    path: "/currencies/:symbol",
    component: _3048eb77,
    name: "currencies-symbol"
  }, {
    path: "/indices/:symbol",
    component: _1c79111f,
    name: "indices-symbol"
  }, {
    path: "/magazine/:article",
    component: _46d91522,
    name: "magazine-article"
  }, {
    path: "/personal-finance/:article?",
    component: _13a44409,
    name: "personal-finance-article"
  }, {
    path: "/stocks/:symbol",
    component: _eae8b3b6,
    name: "stocks-symbol"
  }, {
    path: "/trading-101/:article?",
    component: _832d7f80,
    name: "trading-101-article"
  }, {
    path: "/",
    component: _f98abbbc,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  const router = new Router(routerOptions)
  const resolve = router.resolve.bind(router)

  // encodeURI(decodeURI()) ~> support both encoded and non-encoded urls
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = encodeURI(decodeURI(to))
    }
    return resolve(to, current, append)
  }

  return router
}
