
<template>
    <div class="ais-Hits">
        <ol class="ais-Hits-list">
            <li v-if="coins.length === 0 && query.length && !noresult" class="ais-Hits-item">
                <a href="">
                    <span></span>
                    Searching ...
                    <span></span>
                </a>
            </li>
            <li v-if="coins.length === 0 && query.length && noresult" class="ais-Hits-item">
                <a href="">
                    <span></span>
                    No Results
                    <span></span>
                </a>
            </li>
            
            <li v-for="item in coins" :key="item.name" class="ais-Hits-item" >
                <NuxtLink
                    :to="`/cryptocurrency/${item.symbol}`"
                    @click.native="resetSearch"
                >
                    <span v-if="item.icon || item.symbol" :id="item.symbol"  class="icon s-icon" :class="item.icon ? item.icon: 's-' + item.symbol.toLowerCase()"
                    :style="`background-image: url('${item.thumb}')`"
                    />
                    {{item.title ? item.title : item.name ? item.name : item.symbol}}
                    <span>{{item.symbol}}</span>
                </NuxtLink>
            </li>
        </ol>
    </div>
</template>


<script>import { setTimeout } from "timers";

export default {
    props: {
        query: {
            type: String,
        }
    },
    data() {
        return {
            coins: [],
            noresult: 0
        }
    },
    methods: {
        async coinGeckoCryptoSearch(symbol){
            this.$axios.get(`https://api.coingecko.com/api/v3/search?query=${symbol}`).then((response) => {
                if (response.data) {
                    if (response.data.coins) {
                        this.coins = response.data.coins.filter(a => a.market_cap_rank!=null ).slice(0, 12);
                        this.noresult = 0;
                        if (!this.coins.length) {
                            this.noresult = 1
                        }
                    } else 
                        this.noresult = 1
                }
            }).catch((error) => {})
        },
        resetSearch() {
            // clear the search input
            this.query = "";
            document
                .querySelectorAll('.ais-SearchBox-input')
                .forEach((e) => (e.value = ''))
            document.querySelectorAll('.ais-Hits-item').forEach((e) => e.remove())
            this.coins = [];
        }
    },
    mounted(){
        const self = this;
        setTimeout(function(){
            self.coinGeckoCryptoSearch(self.query)
        }, 1000)
    }
}
</script>