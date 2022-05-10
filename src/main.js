import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
import router from './router'
import axios from 'axios'
Vue.prototype.$axios = axios.create({
  baseURL: 'http://localhost:3000'
})

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) },
}).$mount('#app')
