<template>
  <div
    class="price"
    :class="{ flash }"
  >
    <!-- <chart
      :data="chartData"
      :options="chartOptions"
      :width="300"
      :height="120"
    /> -->
    <div v-if="index.change_percentage">
      <strong><span class="small">+{{ index.change }}&nbsp;${{ index.price }}</span></strong>
    </div>
    <span v-else-if="change" class="change">{{ change }}</span>
    <span v-else-if="difference" class="difference">{{ difference }}</span>
    <!-- <div v-else-if="index.quote">
      <strong>{{ index.quote["USD"].price.toFixed(2) }}</strong>
      <p><span>{{ index.quote["USD"].percent_change_24h.toFixed(2) }}%</span></p>
    </div> -->
    <div v-else-if="index.ask || index.price">
      <strong v-if="index.ask">{{ index.ask }}</strong>
      <strong v-if="price">{{ price }}</strong>
      <p v-if="index.change"><span>{{ index.difference }}</span> {{ index.change }}%</p>
    </div>
    <!-- <strong v-else class="loading"/> -->
  </div>
</template>

<script>
export default {
  name: 'Price',
  props: {
    index: {
      type: Object,
      default: () => {}
    },
    price: {
      type: [ String, Number ]
    },
    change: {
      type: [ String, Number ]
    },
    difference: {
      type: [ String, Number ]
    }
  },
  data() {
    return {
      flash: false
    }
  },
  methods: {
    showFlash(){
      if (this.flash === false){
        this.flash = true;
        setTimeout(() => {
          this.flash = false;
        }, 1000)
      }
    }
  },
  watch: {
    price: {
      immediate: true,
      handler () {
        this.showFlash()
      }
    },
    change: {
      immediate: true,
      handler () {
        this.showFlash()
      }
    },
    difference: {
      immediate: true,
      handler () {
        this.showFlash()
      }
    }
  }
}
</script>
