<template>
  <div class="container content buffer pb-5">
    <div class="row m-0 index-list" id="personal-finance">
      <h2 class="col-12">Personal Finance</h2>
      <div class="col-12 col-lg-6 offset-lg-6">
        <div class="col-12 white-well pt-2">
          <Articles :articles="articles" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Articles from "./../../components/Articles";
import { getMetaTags } from "./../../utils/seo";
// import { getStrapiMedia } from "./../../utils/medias";

export default {
  components: {
    Articles,
  },
  async asyncData({ $strapi }) {
    return {
      articles: await $strapi.find("articles"),
      homepage: await $strapi.find("homepage"),
      global: await $strapi.find("global"),
    };
  },
  head() {
    const { seo } = this.homepage;
    const { defaultSeo, siteName } = this.global;

    // Merge default and article-specific SEO data
    const fullSeo = {
      ...defaultSeo,
      ...seo,
    };

    return {
      titleTemplate: `%s | ${siteName}`,
      title: fullSeo.metaTitle,
      meta: getMetaTags(fullSeo),
    };
  },
  mounted(){
    console.log(this.articles)
  }
};
</script>

<style lang="scss" scoped>
    p {
        font-size: 14px;
        margin-bottom: 0.3rem;
    }
    hr {
        border-top: 1px solid rgb(198 198 198 / 41%);
        display: block;
        width: 100%;
    }
    .posts {
      justify-content: space-around;
    }
    .article-link {
      display: inline-block;
      max-width: 18rem;
    }
    .card {
      flex-direction: column;
      .card-img-top {
        width: 100%;
        height: 15vw;
        object-fit: cover;
      }
      h4 {
        min-height: 32px;
      }
    }
    @media(max-width: 991px){
      .posts {
        flex-direction: column;
        align-items: center;
        .article-link {
          margin-bottom: 1rem;
          width: 100%;
          .card {
            .card-body{
              margin: 0;
              padding: 10px !important;
            }
            .card-img-top {
              height: 180px;
            }
            h4 {
              min-height: auto;
            }
          }
        }
      }
    }
</style>
