<template>
  <div class="container content buffer pb-5">
    <div class="row d-flex justify-content-center">
      <div class="col-11 white-well py-3">
        <h2 class="mb-4">{{ this.article }}</h2>
        <p>Lorem ipsum</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    head() {
        return {
            title: 'The Markets - ' + this.article
        }
    },
    async asyncData({ params }) {
        const article = params.article.replace(/-/g, ' ').split(' ').map(w => w[0].toUpperCase()+ w.substring(1)).join(' ');
        return { article }
    },
  }
</script>

<style lang="scss" scoped>
    p {
        margin-bottom: 0.3rem;
    }
    hr {
        border-top: 1px solid rgb(198 198 198 / 41%);
        display: block;
        width: 100%;
    }
    h3{
      margin-top: 2rem;
    }
</style>
