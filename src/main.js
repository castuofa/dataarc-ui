// Import scss styles
import 'vue-select/src/scss/vue-select.scss';
import '@/scss/style.scss';

// Base Vue Imports
import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faFont,
  faCompass,
  faSitemap,
  faPlay,
  faSearchPlus,
  faSearchMinus,
  faRedo,
  faPause,
  faExclamationCircle,
  faSearch,
  faDotCircle,
  faFilter,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import vSelect from 'vue-select';

// GraphQL Imports
import VueApollo from 'vue-apollo';
import apolloClient from '@/api/apollo-vue';

// App imports
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import Multiselect from 'vue-multiselect';

// Plugins
import VueFormGenerator from 'vue-form-generator';
import AsyncComputed from 'vue-async-computed';
import Debug from '@/components/partials/Debug.vue';
import MyPlugin from './plugins/my-plugin';
import fieldQuery from './views/Collections/templates/fieldQuery.vue';
import fieldWrap from './views/Collections/templates/fieldWrap.vue';
import fieldMulti from './views/Collections/templates/fieldMulti.vue';
import fieldMultitag from './views/Collections/templates/fieldMultitag.vue';

import VueCytoscape from 'vue-cytoscape';

library.add([
  faFont,
  faCompass,
  faSitemap,
  faPlay,
  faSearchPlus,
  faSearchMinus,
  faRedo,
  faPause,
  faExclamationCircle,
  faSearch,
  faDotCircle,
  faFilter,
  faInfoCircle
]);
library.add(faClock);
Vue.component('fa-icon', FontAwesomeIcon);

// Globals
window.axios = require('axios');

// Apply imported libraries
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueApollo);
Vue.component('multiselect', Multiselect);
Vue.component('v-select', vSelect);
Vue.use(AsyncComputed);
Vue.component('Debug', Debug);
Vue.component('fieldQuery', fieldQuery);
Vue.component('fieldWrap', fieldWrap);
Vue.component('fieldMulti', fieldMulti);
Vue.component('fieldMultitag', fieldMultitag);

// Apply plugins
Vue.use(VueFormGenerator);
Vue.use(MyPlugin);
Vue.use(VueCytoscape);

// Log as components are created
Vue.mixin({
  created() {
    // console.log(`[created] ${this.$options.name}`)
  }
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

// base url for mongodb
Vue.prototype.$apiUrl = process.env.VUE_APP_API_URL;
Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_URL;
Vue.config.productionTip = false;
Vue.prototype.$log = console.log;
Vue.prototype.$DEBUG = process.env;

const app = new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
