import Vue from 'vue'
import Router from 'vue-router'
import db from '@/utils/localstorage'
import request from '@/utils/request'
import store from '@/store/index'

Vue.use(Router)

let constRouter = [
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/views/login/Common')
  }
]

let router = new Router({
  routes: constRouter
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    let token = db.get('USER_TOKEN')
    let user = db.get('USER')
    let userRouter = get('USER_ROUTER')
    if (token.length && user) {
      if (!asyncRouter) {
        if (!userRouter) {
          request.get(`manage/sys/menu/${user.userName}`).then((res) => {
            if (res.data.code === 200) {
              asyncRouter = res.data.data
              save('USER_ROUTER', asyncRouter)
              store.commit('account/setRouter', asyncRouter)
              go(to, next)
            }
          })
        } else {
          request.get(`manage/sys/menu/${user.userName}`).then(() => {
          })
          asyncRouter = userRouter
          go(to, next)
        }
      } else {
        next()
      }
    } else {
      next('/login')
    }
  }
})

function go (to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}

function save (name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function get (name) {
  return JSON.parse(localStorage.getItem(name))
}
function filterAsyncRouter (routes) {
  return routes.filter((route) => {
    let component = route.component
    if (component) {
      switch (route.component) {
        case 'MenuView':
          route.component = () => import('@/views/common/MenuView')
          break
        case 'PageView':
          route.component = () => import('@/views/common/PageView')
          break
        case 'EmptyPageView':
          route.component = () => import('@/views/common/EmptyPageView')
          break
        case 'HomePageView':
          route.component = () => import('@/views/HomePage')
          break
        default:
          route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

function view (path) {
  return function (resolve) {
    // 当前数组为不走共用table组件的页面
    let filterArray = ['sys/menu/Menu', 'personal/Profile', 'error/404']
    if (filterArray.includes(path)) {
      import(`@/views/${path}.vue`).then(mod => {
        resolve(mod)
      })
    } else {
      import(`@/components/table/table.vue`).then(mod => {
        resolve(mod)
      })
    }
  }
}

export default router
