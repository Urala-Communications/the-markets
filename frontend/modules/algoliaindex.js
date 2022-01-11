
import algoliasearch from 'algoliasearch';
import { cryptocurrency, stocks, currencies, indices, bonds, commodities} from "../market";
import axios from 'axios';
const client = algoliasearch(process.env.ALGOLIA_APPID, process.env.ALGOLIA_ADMINKEY);
const index = client.initIndex(process.env.ALGOLIA_INDEXNAME);

async function getCryptos(){
    
    const cryptos =  await Promise.all(cryptocurrency.map(async crypto => {
       
        try {
            
            const resp = await axios.get(`https://api.finage.co.uk/detail/cryptocurrency/${crypto.icon}?apikey=${process.env.FINAGE_API_KEY}`)
            const res = resp.data;
    
            return {...res, objectID: `crypto_${res.name.toLowerCase()}` , type: "cryptocurrency", url: `/cryptocurrency/${crypto.name.toLowerCase()}`};
        } catch (error) {
            return {...crypto, objectID: `crypto_${crypto.name.toLowerCase()}`, type: "cryptocurrency", url: `/cryptocurrency/${crypto.name.toLowerCase()}` }
        }
        
    }));
    
    return cryptos;
}

async function getStocks(){
    return stocks.map(res => ({...res, objectID: `stock_${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`, type: "stock", url: `/stocks/${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`}))
}
async function getCurrencies(){
    return currencies.map(res => ({...res, objectID: `currency_${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`, type: "currency", url: `/currencies/${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`}))
}
async function getBonds(){
    return bonds.map(res => ({...res, objectID: `bond_${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`, type: "bond", url: `/bonds/${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`}))
}
async function getCommodities(){
    return commodities.map(res => ({...res, objectID: `commodity_${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`, type: "commodity", url: `/commodities/${res.name.toLowerCase().replace(/\W+(?!$)/g,"-")}`}))    
}


async function getArticles(){
          
        const articles = await axios.get(`https://the-markets-cms.herokuapp.com/articles`); 
        return await articles.data.map(({
            title: name,
            ...rest
        }) => ({
            name,
            ...rest
        })).map(res => ({...res, objectID: `article_${res.id}`, type: "article", url: `/personal-finance/${res.slug}`}));
    
}

async function getMovers(){
    
        const risings = await axios.get(`https://api.finage.co.uk/market-information/us/most-gainers?apikey=${process.env.FINAGE_API_KEY}`);
        return await risings.data.filter(res => res !== null).map(res => ({...res, objectID: `mover_${res.name}`, type: "mover", url: "/movers"}));        
    
}

module.exports = function() {
    this.nuxt.hook('generate:done', async (context) => {

        // remove all index 
       // Primary indices only
        client.listIndices().then(({ items }) => {
            const ops = items
            .filter(({ name, primary }) => !primary)
            .map(({ name }) => {
                return {
                    indexName: name,
                    action: 'delete',
                };
            });
        
            return client.multipleBatch(ops).then(({ objectIDs }) => {
                console.log(objectIDs);
            });
        }); 


        // index data 
        const cryptos = await getCryptos();
        const articles = await getArticles();
        const stocks = await getStocks();
        const currencies = await getCurrencies();
        const bonds = await getBonds();
        const commodities = await getCommodities();

        const movers = await getMovers();
        let objects = stocks.concat(cryptos, currencies, bonds, commodities, movers, articles);
        console.log('start save objects')
                  
        index.saveObjects(objects, {
            autoGenerateObjectIDIfNotExist: true
        }).then(({ objectIDs }) => {
            console.log(objectIDs);
        });


    })
}