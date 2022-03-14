//import { Module } from '@nuxt/types'

import { cryptocurrency, stocks, currencies, indices, bonds, commodities} from "../market";
import axios from 'axios';

module.exports = function() {
  this.nuxt.hook('generate:done', async (context) => {
    const routesToExclude =    process.env.NUXT_ENV_EXCLUDE_ROUTES ? process.env.NUXT_ENV_EXCLUDE_ROUTES.split(',') : []
    const allRoutes = await Array.from(context.generatedRoutes)
    let routes = await allRoutes.filter((route) => !routesToExclude.includes(route))

   
    let coins = await axios.get(`https://api.finage.co.uk/list/cryptocurrency?apikey=${process.env.FINAGE_API_KEY}&limit=200`);
    
    if (coins.data.results.length) {
        coins.data.results.forEach(function(e){
            routes.push(`/cryptocurrency/${e.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`)
        })
    } 

    stocks.forEach(function(e){
        routes.push(`/stocks/${e.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`)
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

