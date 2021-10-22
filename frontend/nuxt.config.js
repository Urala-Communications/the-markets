const finageApiKey = process.env.FINAGE_API_KEY;
const finageSocketKey = process.env.FINAGE_SOCKET_KEY;
// const strapiBaseUri = process.env.STRAPI_URL || "http://localhost:1337";
// const strapiBaseUri = process.env.NODE_ENV === 'development' ? "http://localhost:1337" : "https://the-markets-cms.herokuapp.com";
const strapiBaseUri = "https://the-markets-cms.herokuapp.com";

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  env: {
    finageApiKey,
    finageSocketKey,
    strapiBaseUri,
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'The Markets',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  loading: false,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vue-directives',
    { src: "~/plugins/highcharts.js", ssr: true },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/google-analytics'
    // '@nuxtjs/dotenv',
    // '@nuxtjs/fontawesome'
  ],

  googleAnalytics: {
    id: 'G-2K1382J0CJ', // Use as fallback if no runtime config is provided
  },
  publicRuntimeConfig: {
    googleAnalytics: {
      id: 'G-2K1382J0CJ'
    }
  },

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

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/google-adsense',
    "@nuxtjs/markdownit",
    "@nuxtjs/strapi"
  ],

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
    html:{
      minify:{
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
  },
}
