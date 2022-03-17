/**
 * Performs a server-side GraphQL query
 *
 * @param {Object} axios Axios object
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

/**
 * GraphQL query hook with error handling.
 *
 * @param {Object} options
 *
 * @returns {Object | undefined} Response object, if successful
 */
export const useQuery = async ({ query, axios, variables = {} }) => {
  try {
    const [service, endpoint] = query.split(".");

    const res = await gqlQuery(axios)(queries[service][endpoint], variables);

    if (res.status !== 200 || !res?.data?.data) {
      throw new Error(`Trouble fetching data ${`:${res?.data?.error}` ?? ""}`);
    }

    return res.data.data[
      `${service}${endpoint.charAt(0).toUpperCase()}${endpoint.slice(1)}`
    ];
  } catch (error) {
    console.log(error);
  }
};

/**
 * GraphQL Queries
 */
export const queries = {
  finage: {
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

    detailCrypto: `
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

    last: `
      query finageLast($suffix: String!, $symbol: String!) {
        finageLast(params: { suffix: $suffix, symbol: $symbol }) {
          symbol
          price
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

    agg: `
      query finageAgg(
        $suffix: String!, $symbol: String!, $period: String!, $multiplier: String!, $from: String!, $to: String!
        ) {
        finageAgg(params: { 
          suffix: $suffix, symbol: $symbol, period: $period, multiplier: $multiplier, from: $from, to: $to 
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
