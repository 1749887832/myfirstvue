import Vue from 'vue'
import router from 'vue-router'

Vue.use(router)

export default new router({
    routes: [
        //路由重定向
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/login',
            name:'login',
            component:() => import('./components/login')
        }
        ]
})