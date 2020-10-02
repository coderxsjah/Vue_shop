import Vue from 'vue'
import { Button, Form, FormItem, Input,Menu,Submenu,MenuItem,MenuItemGroup,
Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Tag,Icon,
Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,CheckboxGroup,Upload} from "element-ui";
//导入布局容器
import {Container,Header,Aside,Main} from "element-ui";
//导入消息弹框提示
import { Message ,MessageBox} from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
