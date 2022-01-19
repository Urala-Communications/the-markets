<template>
  <nuxt-link
    :key="article.id"
    :to="`${article.category.slug}/${article.slug}`"
    class="article-card"
  >
    <b-card no-body>
      <b-row>
        <b-col class="d-flex align-items-center col-12 col-md-7">
          <b-card-body class="pr-0 pb-0 pt-0">
            <b-card-text>
              <h5 id="title" class="card-title">{{ article.title }}</h5>
              <p>{{ article.author.name }}</p>
              <p class="date my-1 ">{{ getDate(article.updated_at) }}</p>
              <div v-snip="4" id="editor" v-html="$md.render(article.content.replaceAll('](/uploads/', `](${apiUrl}/uploads/`))"/>
              <!-- <div>
                <img
                  v-if="article.author.picture"
                  class="avatar"
                  :src="getStrapiMedia(article.author.picture.url)"
                  style="position: static; border-radius: 50%; object-fit: cover"
                  width="40px"
                  height="40px"
                  :alt="article.title"
                />
              </div> -->
            </b-card-text>
          </b-card-body>
        </b-col>
        <b-col class="pl-lg-0 col-12 col-md-5 mt-1 mt-lg-3 mb-2 mb-lg-3">
          <b-card-img v-if="article.image.url" :src="getStrapiMedia(article.image.url)" alt="image"></b-card-img>
        </b-col>
      </b-row>
    </b-card>
  </nuxt-link>
</template>

<script>
import { getStrapiMedia } from "../utils/medias";

export default {
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      apiUrl: process.env.strapiBaseUri,
    };
  },
  methods: {
    getStrapiMedia,
    getDate(d){
      let dt = new Date(d).toLocaleString('en-GB',{month:'long', year:'numeric', day:'numeric'});
      return dt;
    }
  },
  mounted(){
    // console.log(this.article)
  }
};
</script>
