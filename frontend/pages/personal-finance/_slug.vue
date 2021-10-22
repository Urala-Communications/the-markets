<template>
  <div class="article-container">
    <div>
      <div class="article bg-white">
        <b-jumbotron class="text-center" text-variant="white">
          <div class="background" :style="{backgroundImage:`url(${getStrapiMedia(article.image.url)})`}"/>
          <p>Personal Finance</p>
          <h1>{{ article.title }}</h1>
          <!-- <p>By Rebecca Hey</p> -->
          <!-- <span class="credit">© GETTY IMAGES / VANNI BASSETT</span> -->
        </b-jumbotron>
        <div class="container content buffer pb-5">
          <div class="row d-flex justify-content-center">
            <div class="col-12 py-3">
              <div class="content">
                <div class="uk-container uk-container-small">
                  <!-- eslint-disable vue/no-v-html -->
                  <div
                    v-if="article.content"
                    id="editor"
                    v-html="$md.render(article.content.replaceAll('](/uploads/', `](${apiUrl}/uploads/`))"
                  />
                  <!-- eslint-enable vue/no-v-html -->
                  <!-- <p v-if="article.published_at">
                    {{ moment(article.published_at).format("MMM Do YY") }}
                  </p> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getStrapiMedia } from "./../../utils/medias";
import { getMetaTags } from "./../../utils/seo";

export default {
  async asyncData({ $strapi, params }) {
    const matchingArticles = await $strapi.find("articles", {
      slug: params.slug,
    });
    return {
      article: matchingArticles[0],
      global: await $strapi.find("global"),
    };
  },
  data() {
    return {
      apiUrl: process.env.strapiBaseUri,
    };
  },
  methods: {
    moment,
    getStrapiMedia,
  },
  head() {
    const { defaultSeo, siteName } = this.global;
    // console.log(this.article.content)
    // Merge default and article-specific SEO data
    const fullSeo = {
      ...defaultSeo,
      metaTitle: this.article.title,
      metaDescription: this.article.description,
      shareImage: this.article.image,
    };

    return {
      titleTemplate: `%s | ${siteName}`,
      title: fullSeo.metaTitle,
      meta: getMetaTags(fullSeo),
      // link: [
      //   {
      //     rel: "favicon",
      //     href: getStrapiMedia(favicon.url),
      //   },
      // ],
    };
  },
};
</script>

<style lang="scss">

.article-container {
  margin-top: -1rem;
  .container {
    min-height: 100vh;
  }

  .content {
    margin: 0 auto;
    /* max-width: 38rem; */
  }

  p { margin: 1rem 0; }
}

.jumbotron {
    margin-top: -1rem;
    margin-bottom: 0;
    max-height: 810px;
    height: 74vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    border-radius: 0;
    z-index: 1;
    .background {
      width: 100%;
      /* max-height: 810px; */
      height: 74vh;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      filter: blur(3px);
    }
    @include title-font();
    .credit{
      position: absolute;
      bottom: 5px;
      left: 5px;
      font-size: 12px;
    }
    &:after{
      content: '';
      position: absolute;
      width: 100%;
      height: 74vh;
      background: rgb(0 0 0 / 50%);
      left: 0;
      top: 0;
      z-index: -1;
    }
  }
  .article {
    h2 {
      font-size: 28px;
      margin-bottom: 0.5rem;
    }
    h3{
      font-size: 22px;
    }
    .container > .row {
      max-width: 1040px;
      margin: 0 auto;
    }
    .social {
      max-width: 120px;
      margin-bottom: 1.5rem;
      .social-icon img {
        width: 24px;
      }
    }
    button{
      width: 280px;
    }
    span.anchor {
      display: block;
      position: relative;
      top: -120px;
      visibility: hidden;
    }
    img {
        max-width: 270px;
    }
  }
  p {
      margin-bottom: 0.3rem;
  }
  hr {
      border-top: 1px solid rgb(0 0 0 / 100%);
      display: block;
      width: 100%;
      margin: 0.5rem 0;
  }
  em {
    font-size: 18px;
    color: #90a4be;
  }
  .content-anchor {
    display: block;
    position: relative;
    top: -110px;
    visibility: hidden;
  }
  .card {
    max-width: 500px;
  }
  @media (max-width: 768px){
    .article {
      img {
        margin: 0 auto;
        display: block;
      }
    }
  }
</style>
