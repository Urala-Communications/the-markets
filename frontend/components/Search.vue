<template>
  <ais-instant-search :search-client="searchClient" :index-name="indexName" >
    <ais-configure
      :hits-per-page.camel="4"      
      :analytics="false"
      :typoTolerance="false"
      :enable-personalization.camel="false"          
    />
    <div>

    <ais-search-box placeholder="Search here…" class="searchbox" />
    </div>
    
        <ais-hits  >
          <template v-slot:item="{ item}" >          
              
              <NuxtLink
              :to="item.url">
              {{item.title?item.title:item.name}}

              </NuxtLink>
                          
          </template>
        </ais-hits>
    
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
    console.log(
      "change conditional if any of the other facets are faked",
      requests
    );
    
    if (requests.every(({ params: { query } }) => Boolean(query) === false)) {
      return {
        results: requests.map(params => {
          // eslint-disable-next-line no-console
          console.log("fake something of the result if necessary", params);
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
      searchClient,
      indexName,     
      middlewares: [insightsMiddleware],
      
    };
  },
  
};
</script>
<style lang="scss"  >
body {
  font-family: sans-serif;
  padding: 1em;
}
.ais-InstantSearch {
  position: relative;
}
.ais-Hits-item {
  padding: 0;
  a {
    padding: 1rem;
    width: 100%;
  }
}
.ais-Hits {
  position: absolute;
  width: 100%;
}
</style>