import Vue from 'vue'
import router from 'vue-router'

Vue.use(router)

export default new router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import('./components/home')
        },
        {
            path:'/list',
            name:'list',
            component:() => import('./components/list')
        },
        {
            path:'*',
            redirect:'/home'
        }]
})