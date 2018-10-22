import 'babel-polyfill'
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'animate.css'

import 'assets/less/index.less'

Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('assets/image/default.png'),
  preLoad: 1.3,
  attempt: 2,
  listenEvents: ['scroll'],
  filter: {
    progressive(listener, options) {
      // console.log(listener, options);
    },
    webp(listener, options) {
      // console.log(listener, options);
    }
  },
  // set observer to true
  observer: true,
  // optional
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.2
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

