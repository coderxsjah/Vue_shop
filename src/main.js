import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入字体图标
import './assets/style/icon.css'

//导入全局样式
import './assets/style/golbal.css'

//导入axios
import axios from 'axios'

//导入vue-table-with-tree-grid
import TreeTable from "vue-table-with-tree-grid"

//导入vue-quill-editor,富文本编辑器
import VueQuillEditor from "vue-quill-editor/src";
//导入对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.component("TreeTable",TreeTable);

//自定义时间格式的全局过滤器
Vue.filter('dataFormat',function (originValue) {
  const dt = new Date(originValue)

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2,'0');

  const hh = (dt.getHours() + "").padStart(2,'0');
  const mm = (dt.getMinutes() + '').padStart(2,'0');
  const ss = (dt.getSeconds() + '').padStart(2,'0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//配置axios基本属性
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config=>{
  //挂载token
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
