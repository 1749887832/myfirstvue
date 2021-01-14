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
                    path: '/users',
                    name: 'user',
                    component: () => import('./components/user/Users')
                },
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