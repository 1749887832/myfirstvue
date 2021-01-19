import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import axios from "axios";
import qs from 'qs'
import jsonViewer from 'vue-json-viewer'
//导入全局样式表
import './assets/css/global.css'
import './plugins/element.js'
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
Vue.use(jsonViewer)
// 配置请求的根路径
Vue.config.productionTip = false
axios.interceptors.request.use(config =>{
  console.log(config)
  // 在最后必须return 这个config
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers['Content_Type'] = 'text/plain'
  return config
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
