import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login'
import Home from "../views/home/Home";
import Welcome from "../views/welcome/Welcome";
import Users from "../views/user/Users";
import Roles from "../views/role/Roles";
import Rights from "../views/right/Rights";
import Goods from "../views/goods/Goods";
import Category from "../views/category/Category";
import Params from "../views/params/Params";
import Orders from "../views/orders/Orders";
import Reports from "../views/reports/Reports";
import AddGoods from "../views/addGoods/AddGoods";


Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login",
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children:[
      {
        path:"/welcome",
        component:Welcome,
      },
      {
        path:"/users",
        component:Users,
      },
      {
        path:"/params",
        component:Params,
      },
      {
        path:"/rights",
        component:Rights,
      },
      {
        path:"/roles",
        component:Roles,
      },
      {
        path:"/goods",
        component:Goods,
      },
      {
        path:"/categories",
        component:Category,
      },
      {
        path:"/orders",
        component:Orders,
      },
      {
        path:"/reports",
        component:Reports,
      },
      {
        path: "/goods/add",
        component: AddGoods,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航
router.beforeEach((to, from, next) => {
  if(to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if(!token) return next("/login");
  next();
})

export default router
