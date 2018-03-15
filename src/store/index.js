import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
// vuex的一个工具 一旦state修改就会打印日志
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

// 区分开发模式和生产模式
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})