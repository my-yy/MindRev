import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/today',
    component: () => import(/* webpackChunkName: "about" */ '../views/Today.vue')
  },
  {
    path: '/setting',
    component: () => import(/* webpackChunkName: "about" */ '../views/Setting.vue')
  },
  {
    path: '/node_list',
    component: () => import(/* webpackChunkName: "about" */ '../views/subpage/NodeList.vue')
  },
  {
    path: '/learn',
    component: () => import(/* webpackChunkName: "about" */ '../views/subpage/LearnNew.vue')
  },
  {
    path: '/review',
    component: () => import(/* webpackChunkName: "about" */ '../views/subpage/Review.vue')
  },

]

const router = new VueRouter({
  routes
})

export default router
