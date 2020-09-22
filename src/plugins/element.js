import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from "element-ui";
import { Input } from "element-ui";
//导入消息弹框提示
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)

Vue.prototype.$message = Message
