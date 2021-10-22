<template>
  <div class="articles">
    <ArticleCard
      v-for="article in articles"
      :key="article.id"
      :article="article"
    />
  </div>
</template>

<script>
import ArticleCard from "./ArticleCard";

export default {
  components: {
    ArticleCard,
  },
  props: {
    articles: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">

  .articles {
    .card {
      padding: 15px 0;
      margin: 0 auto;
      .card-body .card-title{font-size: 20px;}
      /* border-radius: 18px; */
      /* box-shadow: 0px 2.5px 9px 0 rgb(218 226 239 / 50%); */
    }
  }

</style>