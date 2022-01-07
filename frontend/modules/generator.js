//import { Module } from '@nuxt/types'

import { cryptocurrency, stocks, currencies, indices, bonds, commodities} from "../market";

module.exports = function() {
  this.nuxt.hook('generate:done', async (context) => {
    const routesToExclude =    process.env.NUXT_ENV_EXCLUDE_ROUTES ? process.env.NUXT_ENV_EXCLUDE_ROUTES.split(',') : []
    const allRoutes = await Array.from(context.generatedRoutes)
    let routes = await allRoutes.filter((route) => !routesToExclude.includes(route))

    cryptocurrency.forEach(function(e){
        routes.push(`/cryptocurrency/${e.name.toLowerCase()}`)
    })
    stocks.forEach(function(e){
        routes.push(`/stocks/${e.icon}`)
    })
    currencies.forEach(function(e){
        routes.push(`/currencies/${e.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`)
    })
    bonds.forEach(function(e){
        routes.push(`/bonds/${e.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`)
    })
    commodities.forEach(function(e){
        routes.push(`/commodities/${e.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`)
    })

    this.nuxt.options.sitemap.routes = await [...routes]
  })
}

