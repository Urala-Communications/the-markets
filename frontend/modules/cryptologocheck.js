import axios from 'axios';
const fs = require('fs');
const https = require('https');
const sass = require('sass');


async function getTopCoins(){
    try {
        const topcoins = await axios.get(`https://api.finage.co.uk/list/cryptocurrency?apikey=${process.env.FINAGE_API_KEY}&limit=200`);
        return await topcoins.data.results;
    } catch (error) {
        console.log(error)
    }

}
async function getSingleCoin(symbol){
    try {
        const coinData = await  axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${symbol.toLowerCase()}`, {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_KEY
            },
            json: true,
            gzip: true
        });
        if (!coinData.data.status.error_code) {
            return new Promise((resolve, reject) => {
                const file = fs.createWriteStream(`./assets/${symbol.toLowerCase()}.png`);
                let fileInfo = null;
                const request = https.get(`${coinData.data.data[symbol][0].logo}`, function(response) {
                    if (response.statusCode !== 200) {
                        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                        return;
                    }
                    fileInfo = {
                        mime: response.headers['content-type'],
                        size: parseInt(response.headers['content-length'], 10),
                    };
                    response.pipe(file);
                    console.log('saved file')
                });
                // The destination stream is ended by the time it's called
                file.on('finish', () => resolve(fileInfo));

                request.on('error', err => {
                    fs.unlink(filePath, () => reject(err));
                });

                file.on('error', err => {
                    fs.unlink(filePath, () => reject(err));
                });

                request.end();
            })
        }
    } catch (error) {

    }
}

async function modifyCSS(symbol){
    const cssString = (`
        .icon  {
            &.s-${symbol} {
                background-image: url('~@/assets/${symbol}.png');
            }
        }`);

    if (!(fs.existsSync(`./assets//scss/coinlogos.scss`))){
        fs.writeFileSync(`./assets/scss/coinlogos.scss`, cssString);
    } else {
        fs.appendFileSync(`./assets/scss/coinlogos.scss`, cssString);
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms))

module.exports = function() {
    this.nuxt.hook('generate:before', async (generator, options) => {

        let topcoins = await getTopCoins();

        if (topcoins){
            for (let index = 0; index < topcoins.length; index++) {
                const e = topcoins[index];

                if (!(fs.existsSync(`./assets/${e.symbol.toLowerCase()}.svg`) || fs.existsSync(`./assets/${e.symbol.toLowerCase()}.png`) || fs.existsSync(`./assets/${e.symbol.toLowerCase()}.gif`))) {
                    console.log('no_file_exist', e);
                    /// add coin logo if not exist
                    await getSingleCoin(e.symbol.toUpperCase());
                    // add css
                    await modifyCSS(e.symbol.toLowerCase());
                    await timer(3000);
                }
            }
        }
    })
}