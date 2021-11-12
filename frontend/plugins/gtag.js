import Vue from 'vue';
import VueGtag from 'vue-gtag'

const getGDPR = localStorage.getItem('GDPR:accepted');

export default ({ app }) => {
  Vue.use(VueGtag, {
    config: { id: 'G-2K1382J0CJ' },
    appName: 'themarkets',
    bootstrap: getGDPR === 'true',
    enabled: getGDPR === 'true',
  }, app.router);
}