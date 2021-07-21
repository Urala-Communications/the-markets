export { default as Ad } from '../../components/Ad.vue'
export { default as Chart } from '../../components/Chart.vue'
export { default as Footer } from '../../components/Footer.vue'
export { default as Header } from '../../components/Header.vue'
export { default as IndexList } from '../../components/IndexList.vue'
export { default as Item } from '../../components/Item.vue'
export { default as News } from '../../components/News.vue'
export { default as Price } from '../../components/Price.vue'
export { default as Ticker } from '../../components/Ticker.vue'
export { default as TickerItem } from '../../components/TickerItem.vue'

export const LazyAd = import('../../components/Ad.vue' /* webpackChunkName: "components/Ad" */).then(c => c.default || c)
export const LazyChart = import('../../components/Chart.vue' /* webpackChunkName: "components/Chart" */).then(c => c.default || c)
export const LazyFooter = import('../../components/Footer.vue' /* webpackChunkName: "components/Footer" */).then(c => c.default || c)
export const LazyHeader = import('../../components/Header.vue' /* webpackChunkName: "components/Header" */).then(c => c.default || c)
export const LazyIndexList = import('../../components/IndexList.vue' /* webpackChunkName: "components/IndexList" */).then(c => c.default || c)
export const LazyItem = import('../../components/Item.vue' /* webpackChunkName: "components/Item" */).then(c => c.default || c)
export const LazyNews = import('../../components/News.vue' /* webpackChunkName: "components/News" */).then(c => c.default || c)
export const LazyPrice = import('../../components/Price.vue' /* webpackChunkName: "components/Price" */).then(c => c.default || c)
export const LazyTicker = import('../../components/Ticker.vue' /* webpackChunkName: "components/Ticker" */).then(c => c.default || c)
export const LazyTickerItem = import('../../components/TickerItem.vue' /* webpackChunkName: "components/TickerItem" */).then(c => c.default || c)
