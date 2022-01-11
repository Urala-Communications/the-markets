const finageApiKey = process.env.FINAGE_API_KEY;
const finageSocketKey = process.env.FINAGE_SOCKET_KEY;
const tradingEconKey = process.env.TRADING_ECON_API_KEY;
const liveApiUrl = process.env.LIVE_API_URL;
const cmcApiKey = process.env.CMC_KEY;
const ALGOLIA_APPID = process.env.ALGOLIA_APPID;
const ALGOLIA_APIKEY = process.env.ALGOLIA_APIKEY;
const ALGOLIA_INDEXNAME = process.env.ALGOLIA_INDEXNAME;


// const strapiBaseUri = process.env.STRAPI_URL || "http://localhost:1337";
// const strapiBaseUri = process.env.NODE_ENV === 'development' ? "http://localhost:1337" : "https://the-markets-cms.herokuapp.com";
const strapiBaseUri = "https://the-markets-cms.herokuapp.com";

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  env: {
    finageApiKey,
    finageSocketKey,
    cmcApiKey,
    tradingEconKey,
    strapiBaseUri,
    liveApiUrl,
    ALGOLIA_APPID,
    ALGOLIA_APIKEY,
    ALGOLIA_INDEXNAME
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'The Markets - Live Charts for Financial Markets & the Global Community of Traders. Bitcoin, Ethereum, Doge, Shiba, Memes, Crypto, Indices, Stocks, Forex, Bonds, CFDs and more.',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'title', name: 'title', content: 'The Markets' },
      { hid: 'description', name: 'description', content: 'Live Charts for Financial Markets & the Global Community of Traders. Bitcoin, Ethereum, Doge, Shiba, Memes, Crypto, Indices, Stocks, Forex, Bonds, CFDs and more.' },
      { hid: 'keywords', name: 'keywords', content: 'live market, cfds, indices, stocks, crypto, cryptocurrency, bitcoin, commodities, forex, currencies, bonds, market news, market insights' },
      { name: 'apple-mobile-web-app-title', content: 'The Markets - live charts for financial markets & the global community of traders' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon.png' },
      { rel: 'android-chrome', type: 'image/png', href: '/android-chrome-192x192.png' },
    ]
  },

  loading: false,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vue-directives',
    { src: "~/plugins/gtag.js", mode: 'client' },
    { src: "~/plugins/highcharts.js", ssr: true },
    { src: "~/plugins/vue-instantsearch.js", ssr: true },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // '@nuxtjs/dotenv',
    // '@nuxtjs/fontawesome'
    '@/modules/sitemapgenerator',
    '@/modules/algoliaindex'
  ],

  dev: process.env.NODE_ENV !== 'production',

  devServer: {
    clientLogLevel: "silent"
  },

  fontawesome: {
    icons: {
      solid: true
    }
  },

  'google-adsense': {
    id: 'ca-pub-7227085508439540'
  },

  serverMiddleware: ['~/api/index'],

  styleResources: {
    scss: [
      '~/assets/scss/variables.scss',
    ]
  },

  watchers: {
    webpack: {
      ignored: /node_modules/,
      poll: 3000
    }
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/google-adsense',
    "@nuxtjs/markdownit",
    "@nuxtjs/strapi",
    '@nuxtjs/firebase',
    '@nuxtjs/sitemap'
  ],

  firebase: {
    config: {
      apiKey: "AIzaSyAl9dhYaPSs-UscghS_Mgd3KdbxF1ezf-I",
      authDomain: "themarkets.firebaseapp.com",
      projectId: "themarkets",
      storageBucket: "themarkets.appspot.com",
      messagingSenderId: "523290113240",
      appId: "1:523290113240:web:842a2726513bdead0f93ad",
      measurementId: "G-C2H6JMSF7Z"
    },
    services: {
      firestore: true
    }
  },

  firestore: {
    memoryOnly: false, // default
    chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
    enablePersistence: true,
    emulatorPort: 8080,
    emulatorHost: 'localhost',
    settings: {
      // Firestore Settings - currently only works in SPA mode
    }
  },

  axios: {
    proxy: true
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },

  proxy: {
    '/cmcapi': {
      target: 'https://pro-api.coinmarketcap.com',
      changeOrigin: true,
      pathRewrite: { '^/cmcapi': '/' },
    },
    '/tecapi': {
      target: 'https://api.tradingeconomics.com',
      changeOrigin: true,
      pathRewrite: { '^/tecapi': '/' },
    },
  },

  strapi: {
    url: strapiBaseUri,
    entities: [
      {
        name: "articles",
        type: "collection",
      },
      {
        name: "categories",
        type: "collection",
      },
      {
        name: "homepage",
        type: "single",
      },
      {
        name: "global",
        type: "single",
      },
    ],
  },
  markdownit: {
    preset: "default",
    linkify: true,
    breaks: true,
    injected: true,
    html: true,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true,
    optimizeCSS: true,
    // splitChunks: {
    //   layouts: true
    // },
    quiet: true,
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true
      }
    },
    babel: {
      "sourceType": "unambiguous",
      compact: true,
      presets(env, [preset, options]) {
        return [["@babel/preset-env", {}]];
      },
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            regenerator: true
          }
        ]
      ]
    },
    // loaders:  {
    //   vue: {
    //     prettify: false
    //   }
    // },
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
  },
  sitemap: {
    hostname: 'https://themarkets.io',
    gzip: true,
    routes: [      
    ]
  },
  generate: {
    crawler: false // default - true
  }
  
}
