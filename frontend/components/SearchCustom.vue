
<template>
    <div class="ais-Hits">
        <ol class="ais-Hits-list">
            <li v-for="item in coins" :key="item.name" class="ais-Hits-item" >
                <NuxtLink
                    :to="`/cryptocurrency/${item.id}`"
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
            coins: []
        }
    },
    methods: {
        async coinGeckoCryptoSearch(symbol){
            this.$axios.get(`https://api.coingecko.com/api/v3/search?query=${symbol}`).then((response) => {
                if (response.data) {
                    this.coins = response.data.coins.filter(a => a.market_cap_rank!=null ).slice(0, 12);
                }
            }).catch((error) => {})
        },
        resetSearch() {
            // clear the search input
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