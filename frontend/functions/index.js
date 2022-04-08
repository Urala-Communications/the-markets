const functions = require("firebase-functions");
const axios = require("axios");
require("dotenv").config();
const cmc_api_key = process.env.CMC_KEY;
const finage_api_key = process.env.FINAGE_API_KEY;

exports.coins =  functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', process.env.SITE_URL);
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    let topcoins = await getTopCoins();
    if (topcoins.length) {
      let allCoinsData = await getCoinsData(topcoins.map(coin => coin.symbol.toUpperCase()).join());
      res.status(200).send(allCoinsData);
    }
  }
});

exports.search =  functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', process.env.SITE_URL);
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    const coin = await searchCoin(req.query.slug??null, req.query.symbol??null);
    res.status(200).send(coin);
  }
});

async function searchCoin(slug=null, symbol=null) {
  try {
    const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?${slug?("slug="+slug+"&"):""}${symbol?("symbol="+symbol):""}`, {
      headers: {
        "X-CMC_PRO_API_KEY": cmc_api_key
      },
      json: true,
      gzip: true
    });
    if (!coinData.data.status.error_code) {
      return await coinData.data.data[Object.keys(coinData.data.data)];
    } else {
      return await coinData.data;
    }
  } catch (error) {
    if (error.response){
      //do something   
      console.log( "response: ",error.response)
      return await error.response.data; 
    } else if(error.request){ 
    //do something else    
    console.log(error.request)
    } else if(error.message){
    //do something other than the other two    
    console.log(error.message)
    }
  }
}

async function getTopCoins() {
  try {
    const topcoins = await axios.get(`https://api.finage.co.uk/list/cryptocurrency?apikey=${finage_api_key}&limit=200`);
    return await topcoins.data.results;
  } catch (error) {
    console.log(error)
  }
}
async function getCoinsData(symbols) {
  try {
    const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${symbols}`, {
      headers: {
        "X-CMC_PRO_API_KEY": cmc_api_key
      },
      json: true,
      gzip: true
    });
    if (!coinData.data.status.error_code) {
      return await coinData.data.data;
    }
  } catch (error) {
    console.log(error)
  }
}

