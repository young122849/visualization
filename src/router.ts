import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Chart from './views/Chart.vue'
import Register from './views/Register.vue'
import Project from './views/Project.vue'
import store from '@/store';
import Userservice from './services/user.service'
import { filter, pluck } from 'rxjs/operators';
let service = new Userservice()
Vue.use(Router)

const ImportLogin = () => import(/* webpackChunkName: "login" */'./views/Login.vue')
const ImportRegister = () => import(/* webpackChunkName: "register" */'./views/Register.vue')

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (to.matched.some(record => record.meta.requireAuth)) {
          // 如果需要进入的路由需要验证,则进行验证
          service.checkLogin('http://localhost:3000/session/')
            .pipe(pluck('data')).subscribe((res: any) => {
              if (res.success) {
                store.commit('operation/getUser', res)
                next()
              }
            })
        } else {
          next()
        }
      }
    },
    {
      path: '/projects',
      name: 'project',
      component: Project,
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (to.matched.some(record => record.meta.requireAuth)) {
          // 如果需要进入的路由需要验证,则进行验证
          service.checkLogin('http://localhost:3000/session/')
            .pipe(pluck('data')).subscribe((res: any) => {
              if (res.success) {
                store.commit('operation/getUser', res)
                next()
              }
            })
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: ImportLogin
    },
    {
      path: '/register',
      name: 'register',
      component: ImportRegister
    },
    {
      path: '/charts',
      name: 'chart',
      component: Chart,
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (to.matched.some(record => record.meta.requireAuth)) {
          // 如果需要进入的路由需要验证,则进行验证
          service.checkLogin('http://localhost:3000/session/')
            .pipe(pluck('data')).subscribe((res: any) => {
              if (res.success) {
                store.commit('operation/getUser', res)
                next()
              }
            })
        } else {
          next()
        }
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
