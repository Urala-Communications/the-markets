<template>
  <div class="article-container">
    <div v-if="post">
      <!-- <Comparison v-if="post.comparison" :post="post" /> -->
      <div class="article bg-white">
      <!-- <b-jumbotron class="text-center" text-variant="white" :style="{backgroundImage:`url(${require('(./../assets/'+slug+'.jpg')})`}">
        <p>Personal Finance</p>
        <h1>{{ article }}</h1>
        <p>By Rebecca Hey</p>
        <span class="credit">© GETTY IMAGES / VANNI BASSETT</span>
      </b-jumbotron> -->
        <div class="container content buffer pb-5">
          <div class="row d-flex justify-content-center">
            <div class="col-12 py-3">
              <h1 class="title" v-text="post.title" />
              <div class="content">
                <SanityContent
                  v-for="child in post.body"
                  :blocks="[child]"
                  v-bind:key="child._id"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Comparison from './../../components/Comparison.vue';
// import { SanityContent } from '@nuxtjs/sanity/dist/components/sanity-content'
// import { groq } from '@nuxtjs/sanity'
// export default {
//   // components: { SanityContent, Comparison },
//   async asyncData({ params, $sanity }) {
//     const query = groq`*[_type == "post" && slug.current == "${params.slug}"][0]`
//     const post = await $sanity.fetch(query)
//     // console.log(post)
//     return { post }
//   }
// }
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
    @include title-font();
    .credit{
      position: absolute;
      bottom: 5px;
      left: 5px;
      font-size: 12px;
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
</style>
