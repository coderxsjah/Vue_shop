import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login/Login'
// import Home from "../views/home/Home";
// import Welcome from "../views/welcome/Welcome";
// import Users from "../views/user/Users";
// import Roles from "../views/role/Roles";
// import Rights from "../views/right/Rights";
// import Goods from "../views/goods/Goods";
// import Category from "../views/category/Category";
// import Params from "../views/params/Params";
// import Orders from "../views/orders/Orders";
// import Reports from "../views/reports/Reports";
// import AddGoods from "../views/addGoods/AddGoods";


Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login",
  },
  {
    path: "/login",
    component: ()=>import('../views/login/Login')
  },
  {
    path: "/home",
    component: ()=>import('../views/home/Home'),
    redirect: "/welcome",
    children:[
      {
        path:"/welcome",
        component:()=>import('../views/welcome/Welcome'),
      },
      {
        path:"/users",
        component:()=>import("../views/user/Users"),
      },
      {
        path:"/params",
        component:()=>import('../views/params/Params'),
      },
      {
        path:"/rights",
        component:()=>import('../views/right/Rights')
      },
      {
        path:"/roles",
        component:()=>import('../views/role/Roles')
      },
      {
        path:"/goods",
        component:()=>import('../views/goods/Goods'),
      },
      {
        path:"/categories",
        component:()=>import('../views/category/Category'),
      },
      {
        path:"/orders",
        component:()=>import('../views/orders/Orders'),
      },
      {
        path:"/reports",
        component:()=>import('../views/reports/Reports'),
      },
      {
        path: "/goods/add",
        component: ()=>import('../views/addGoods/AddGoods'),
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
