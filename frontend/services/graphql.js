/**
 * Performs a server-side GraphQL query
 *
 * @param {String} query GraphQL query string
 *
 * @returns {Promise} Axios promise
 */
export const gqlQuery =
  (axios) =>
  (query, variables = {}) => {
    return axios({
      url: "http://localhost:4000/",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        query,
        variables,
      },
    });
  };

export const queries = {
  fundamentals: {
    marketStatus: `
      query finageMarketStatus {
        finageMarketStatus {
          market
          country
          exchanges
          currencies
        }
      }
    `,

    news: `
      query finageNews($market: String!, $symbol: String) {
        finageNews(params: {market: $market, symbol: $symbol}) {
          news {
            title
            description
            url
          }
        }
      }
    `,
  },

  crypto: {
    detail: `
      query finageDetailCrypto($symbol: String!) {
        finageDetailCrypto(params: { symbol: $symbol }) {
          name
          symbol
          type
          isActive
          description
          developers {
            name
            position
          }
          opensource
          startedAt
          hashAlgorithm
          links {
            explorer
            facebook
            reddit
            source_code
            website
            youtube
          }
          thumbnail
          developmentStatus
          hardwareWallet
        }
      }
    `,

    lastPriceDetailed: `
      query finageLast($symbol: String!) {
        finageLast(params: { suffix: "crypto/detailed", symbol: $symbol }) {
          volume
          open
          high
          low
          close
          marketCap
          yearHigh
          yearLow
        }
      }
    `,

    aggregate: `
      query finageAgg(
        $symbol: String!, $period: String!, $multiplier: String!, $from: String!, $to: String!
        ) {
        finageAgg(params: { 
          suffix: "crypto", symbol: $symbol, period: $period, multiplier: $multiplier, from: $from, to: $to 
        }) {
          results {
            o
            h
            l
            c
          }
        }
      }
    `,
  },
};
