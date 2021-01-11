import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import axios from "axios";
//导入全局样式表
import './assets/css/global.css'
import './plugins/element.js'
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8000'
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
