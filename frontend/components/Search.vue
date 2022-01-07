<template>
  <ais-instant-search :search-client="searchClient" :index-name="indexName"  >
    <ais-search-box     
      submit-title="Submit the query"
      reset-title="Remove the query"
      show-loading-indicator
     />       
         
    <ais-hits  >
      <template v-slot:item="{ item }">
        <p>
          <ais-highlight attribute="name" :hit="item"    />
          <a :href="item.url">
          {{item.title}}
          </a>
        </p>  
        <span></span>
      </template>
    </ais-hits>
  </ais-instant-search>
</template>

<script>

import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import 'instantsearch.css/themes/satellite-min.css';


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
    console.log(requests);
    requests.hitsPerPage = 10;
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
.ais-Hits {
  position: absolute;
  width: 100%;
}
</style>