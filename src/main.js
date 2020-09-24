import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/style/icon.css'
//导入全局样式
import './assets/style/golbal.css'
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config=>{
  const token = window.sessionStorage.getItem("token");
  if(token){
    config.headers.Authorization = window.sessionStorage.getItem("token")
  }
  return config;
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
