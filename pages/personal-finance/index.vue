<template>
  <div class="container content buffer pb-5">
    <div class="row d-flex justify-content-center">
      <div class="col-11 white-well pb-3">
        <h2 class="mb-4 pt-3">Personal Finance</h2>
        <div class="posts d-flex">
          <NuxtLink
            v-for="post in posts"
            :key="post._id"
            :to="`/personal-finance/${post.slug.current}`"
            class="article-link"
          >
            <b-card
              :title="post.title"
              :imgSrc="$urlFor(post.mainImage.asset._ref).size(320)"
              :imgAlt="post.title"
              img-top
              tag="article"
              class="mb-2"
            >
              <!-- <b-card-text>
                <SanityContent
                  :blocks="[post.body[0]]"
                  v-bind:key="post.body[0]._id"
                  v-if="post.body.length"
                />
              </b-card-text> -->

              <b-button href="#" class="w-100 mt-3" variant="secondary">Read more</b-button>
            </b-card>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SanityContent } from '@nuxtjs/sanity/dist/components/sanity-content'
import { groq } from '@nuxtjs/sanity'

export default {
  components: { SanityContent },
  async asyncData({ $sanity }) {
    const query = groq`*[_type == "post"]`
    const posts = await $sanity.fetch(query)
    return { posts }
  },
}
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
