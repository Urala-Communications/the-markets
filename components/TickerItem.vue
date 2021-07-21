<template>
  <NuxtLink
    class="item"
    :class="item.change > 0 ? 'up' : 'down'"
    :to="`/${item.type}/${item.name.replace(/\s+|[' '\/]/g, '-').toLowerCase()}`"
  >
    <!-- <div class="icon"
      :class="item.icon"
    /> -->
    <div
      class="info"
      :class="{bitcoin}"
    >
      <h3 v-if="item.symbol === 'DGS10'">{{ item.abbreviated }}</h3>
      <h3 v-else>{{ item.name }}</h3>
      <strong>{{ item.price }}</strong>
      <span v-if="item.difference" class="diff">{{ item.difference }}</span>
      <span v-if="item.change" class="change">{{ item.change }}%</span>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  name: 'TickerItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    bitcoin: {
      type: Boolean,
      default: false
    },
  },
  // data() {
  //   return {
  //     flash: false
  //   }
  // },
  // watch: {
  //   price: {
  //     immediate: true,
  //     handler () {
  //       if (this.flash === false){
  //         this.flash = true;
  //         setTimeout(() => {
  //           this.flash = false;
  //         }, 1000)
  //       }
  //     }
  //   }
  // }
}
</script>