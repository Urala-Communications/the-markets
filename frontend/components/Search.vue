<template>
  <ais-instant-search :search-client="algoliaClient" :index-name="indexName" :stalled-search-delay="100"   >
    <ais-configure
      :hits-per-page.camel="8"
    />
    <div>
      <ais-search-box class="searchbox" show-loading-indicator placeholder="Search..." />
    </div>
    <ais-state-results>
      <template slot-scope="{ query, hits }">
        <!-- First condition -->
        <div v-if="!hits.length"></div>
        <ais-hits ref="searchHits" v-else-if="query.length > 0">
          <template v-slot:item="{item}" >
            <NuxtLink
              :to="item.url"
              @click.native="resetSearch"
            >
              <span v-if="item.icon || item.symbol" class="icon" :class="item.icon ? (item.type==='cryptocurrency' ? ('s-' + item.icon) : item.icon): (item.type==='cryptocurrency' ? ('s-' + item.symbol.toLowerCase()) : item.symbol.toLowerCase())"/>
              {{item.title ? item.title : item.name ? item.name : item.symbol}}
              <span>{{item.symbol}}</span>
            </NuxtLink>
          </template>
        </ais-hits>
        <div v-else />
      </template>
    </ais-state-results>
  </ais-instant-search>
</template>
<script>

import algoliasearch from 'algoliasearch/lite';
//import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import 'instantsearch.css/themes/satellite-min.css';
import aa from 'search-insights';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares'

const insightsMiddleware = createInsightsMiddleware({
  insightsClient: aa,
})

const indexName = process.env.ALGOLIA_INDEXNAME;

const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APPID,
  process.env.ALGOLIA_APIKEY
);

const searchClient = {
  async search(requests) {
    // eslint-disable-next-line no-console
    if (requests.every(({ params: { query } }) => Boolean(query) === false)) {
      return {
        results: requests.map(params => {
          // eslint-disable-next-line no-console
          // console.log("fake something of the result if necessary", params);
          return {
            processingTimeMS: 0,
            nbHits: 0,
            hits: [],
            facets: {},
          };
        })
      };
    }
    return algoliaClient.search(requests);
  },
  async searchForFacetValues(requests) {
    return algoliaClient.searchForFacetValues(requests);
  }
};

export default {
  data() {
    return {
      algoliaClient,
      indexName,
      middlewares: [insightsMiddleware],
    };
  },
  methods: {
    resetSearch() {
      // clear the search input
      document
        .querySelectorAll('.ais-SearchBox-input')
        .forEach((e) => (e.value = ''))
      document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
      // also clear the hits from the component, otherwise subsequent searches throw exceptions
      this.$refs.searchHits.state.hits = []
    },
  },
};
</script>

<style lang="scss">
.ais-InstantSearch {
  position: relative;
  &.mobile{
    position: absolute;
    right: 16px;
    top: 2px;
  }
}
.ais-SearchBox-form{
  line-height: 1;
}
.ais-Hits-item {
  padding: 0;
  overflow: hidden;
  a {
    padding: 1rem;
    width: 100%;
    color: #000;
    display: flex;
    align-items: center;
    span{
      font-size: 12px;
      color: #3335cf;
      margin-left: 5px;
      &.icon{
        display: inline-block;
        min-width: 24px;
        height: 24px;
        margin-right: 5px;
        margin-left: 0;
      }
    }
  }
  :hover{
    background-color: rgb(243 243 255);
  }
}
.ais-Hits {
  position: absolute;
  width: 100%;
}

@media(max-width:768px){
  .ais-InstantSearch.mobile{
    position: relative;
    right: initial;
    top: initial;
    margin-top: 8px;
  }
}
</style>