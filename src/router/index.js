import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'components/recommend'
import Singer from 'components/singer';
import SingerDetail from 'components/singer-detail'
import Rank from 'components/rank'
import Search from 'components/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    }, {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          name: 'singerDetail',
          path: ':mid',
          component: SingerDetail
        }
      ]
    }, {
      path: '/rank',
      name: 'rank',
      component: Rank
    }, {
      path: '/search',
      name: 'search',
      component: Search
    }, {
      path: '*',
      redirect: to => {
        console.log(to)
        // 方法接收 目标路由 作为参数
        // return 重定向的 字符串路径/路径对象
        return '/';
      }
    }
  ]
})
