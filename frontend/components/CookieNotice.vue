<template>
  <div v-if="isOpen" class="cookie-notice">
    <div class="d-flex wrapper">
      <p>This site uses cookies to enhance your experience. Please see <nuxt-link class="text-link" to="/privacy-policy">our privacy policy</nuxt-link> for more information. By clicking 'Accept', you agree to our use of cookies.</p>
      <div class="button accept" @click="accept">Accept</div>
    </div>
    <div class="button close-button" @click="deny">X</div>
</div>
</template>

<script>
import {bootstrap} from 'vue-gtag';
export default {
  data() {
    return {
      isOpen: true
    }
  },
  methods: {
    accept() {
      if (process.browser) {
        bootstrap().then(gtag => {
          this.isOpen = false;
          localStorage.setItem('GDPR:accepted', true);
          // location.reload();
        })
      }
    },
    deny() {
      if (process.browser) {
        this.isOpen = false;
        localStorage.setItem('GDPR:accepted', false);
      }
    }
  }
}
</script>

<style scoped lang="scss">

.cookie-notice {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: #4647ff;
  color: #fff;
  padding: 1.5rem 4rem;
  z-index: 999;
  .wrapper{
    margin: 0 auto;
    max-width: 1220px;
  }
  p {
    margin: 0;
    padding-right: 1rem;
  }
  a{color: $red;}
  .button {
    cursor: pointer;
    &.accept {
      text-align: center;
      border-radius: 12px;
      border: 2px solid #fff;
      padding: 0.5rem 2rem;
      font-family: "Nunito", serif;
      font-weight: 800;
      font-size: 18px;
      min-width: 20%;
    }
    &.close-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 26px;
      height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      border: 1px solid #fff;
      color: #fff;
      border-radius: 50%;
      font-family: "Nunito", serif;
      font-weight: 800;
    }
  }
  @media (max-width: 900px){
    padding: 1.5rem 1rem;
    .wrapper {
      flex-direction: column !important;
      padding-right: 0;
      padding-top: 1rem;
      p {padding: 0;}
      .accept {
        margin-top: 1rem;
      }
    }
  }
}

</style>