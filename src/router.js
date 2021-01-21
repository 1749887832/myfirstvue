import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    /*
    * mode: 'history',
    * */
    routes: [
        //路由重定向
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./components/login')
        },
        {
            path: '/home',
            name: 'home',
            redirect: '/welcome',
            component: () => import('./components/home'),
            // 子路由
            children: [
                {
                    path: '/welcome',
                    name: 'welcome',
                    component: () => import('./components/welcome'),
                },
                {
                    path: '/server',
                    name: 'server',
                    component: () => import('./components/server_model/server')
                },
                {
                    path:'/case',
                    name:'case',
                    component:() => import('./components/test_model/case')
                },
                {
                    path:'/test',
                    name:'test',
                    component:() => import('./components/test_model/test')
                },
                {
                    path:'/variate',
                    name:'variate',
                    component:() => import('./components/test_model/variate')
                },
                {
                    path:'/global',
                    name:'global',
                    component:() => import('./components/server_model/global')
                },
                {
                    path:'/model',
                    name:'model',
                    component:() => import('./components/server_model/model')
                },
                {
                    path:'/headers',
                    name:'headers',
                    component:() => import('./components/server_model/headers')
                },
                {
                    path:'/step',
                    name:'step',
                    component:()=>import('./components/test_model/step')
                }
            ]
        },

    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    // next() 放行 next('/login') 强制跳转
    if (to.path === '/login') {
        return next()
    } else {
        // 清除token
        const tokenStr = window.sessionStorage.getItem('token')
        if (!tokenStr) {
            return next('/login')
        } else {
            next()
        }
    }
})

export default router