<template>
<!--        <el-button type="info" @click="logout">退出</el-button>-->
    <el-container>
<!--        头部-->
        <el-header>
            <div class="left-header">
                <img src="../../assets/icons/logo.jpeg" alt="logo"/>
                <span>电商管理系统</span>
            </div>
            <el-button class="logout-btn" type="info" @click="logout">退出</el-button>
        </el-header>
<!--        主体-->
        <el-container>
<!--            左侧-->
            <el-aside :width="isClose ? '64px':'200px'">
<!--                展开折叠按钮-->
                <div class="toggle-btn" @click="toggleCollapse">|||</div>
<!--                侧边栏菜单-->
                <el-menu background-color="#333744"
                         text-color="#fff"
                         active-text-color="#409EFF"
                         :unique-opened="true"
                         :collapse="isClose"
                         :collapse-transition="false"
                         :router="true"
                         :default-active="activePath">
<!--                    一级菜单-->
                    <el-submenu v-for="item1 in menuList" :index="item1.id + ''" :key="item1.id">
<!--                        一级菜单模板区-->
                        <template slot="title">
<!--                            图标-->
                            <i class="el-icon-location"></i>
<!--                            文本-->
                            <span >{{item1.authName}}</span>
                        </template>
<!--                        二级菜单选项-->
                        <el-menu-item  v-for="item2 in item1.children"
                                       :index="'/' + item2.path"
                                       :key="item2.id"
                                        @click="saveNavState('/' + item2.path)">
                            <template slot="title">
                                <!--                            图标-->
                                <i class="el-icon-menu"></i>
                                <!--                            文本-->
                                <span >{{item2.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
<!--            主要内容-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return {
        menuList:[],
        isClose:false,//是否展开
        activePath:'',//被激活的链接
      }
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem("activePath");
    },
    methods:{
      logout(){
        window.sessionStorage.clear();
        this.$router.push("/login");
      },
      //获取左侧菜单栏数据
      async getMenuList(){
         const {data:res} = await this.$http.get("menus");
         //console.log(res.data[1].authName);
         this.menuList = res.data;
         //console.log(this.menuList)
      },
      //菜单栏收起与展开
      toggleCollapse(){
        this.isClose = !this.isClose;
      },
      //保存激活状态
      saveNavState(path){
        window.sessionStorage.setItem("activePath",path);
      }
    }
  }
</script>

<style lang="less" scoped>
    .el-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        color: #fff;
        font-size: 20px;
        .left-header{
            display: flex;
            align-items: center;
            height: 100%;
            img {
                height: 100%;
                border-radius: 50%;
                margin-right: 15px;
            }
        }
        .logout-btn{
            height: 60%;
        }
    }
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
    }
    .el-main{
        background-color: #fdfdfd;
    }
    .toggle-btn{
        background-color: #333744;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>