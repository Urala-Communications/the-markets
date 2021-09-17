<template>
  <div>
    <template v-if="isDev">
      <div class="ad">[ADSENSE PLACEHOLDER]</div>
    </template>
    <template v-else-if="headerAd">
      <ins class="ad"
      style="display:block"
      data-ad-client="ca-pub-1293135381149415"
      data-ad-slot="1830600921"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    </template>
    <template v-else-if="feedAd">
      <ins class="ad"
      style="display:block"
      data-ad-format="fluid"
      data-ad-layout-key="-fb+5w+4e-db+86"
      data-ad-client="ca-pub-1293135381149415"
      data-ad-slot="5888980029"></ins>
    </template>
    <template v-else>
      <ins class="ad"
        style="display:block"
        data-ad-client="ca-pub-1293135381149415"
        data-ad-slot="4995820314"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    headerAd: {
      type: Boolean,
      default: false
    },
    feedAd: {
      type: Boolean,
      default: false
    }
  },
  head() {
    let productionScripts = []
    if (!this.isDev) {
      return {
        scripts: [
          { hid: 'adsense', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', defer: true, 'data-ad-client': 'ca-pub-1293135381149415' },
        ]
      }
    }
    return { }
  },
  data() {
    return {
       isDev: process.env.NODE_ENV !== 'production'
    }
  },
  mounted() {
    if (!this.isDev) {
      this.$nextTick(() => {
        try {
          // this is required for each ad slot (calling this once will only load 1 ad)
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          console.error(error)
        }
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.ad{
  min-height: 70px;
  background: #f9f9f9;
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>