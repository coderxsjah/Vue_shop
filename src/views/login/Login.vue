<!--登录页面-->
<template>
    <div class="login-container">
        <div class="login-box">
            <!--            头像区域-->
            <div class="head-box">
                <img src="../../assets/logo.png"/>
            </div>
            <!--            表单区域-->
            <el-form class="form" ref="loginFormRef" :model="loginForm" :rules="loginRules">
<!--                用户名-->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
<!--                密码-->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
<!--                按钮-->
                <el-form-item  class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {request} from "../../network/request/request";

    export default {
    name: "Login",
    data(){
      return {
        //表单数据
        loginForm:{
          username:"admin",
          password:"123456",
        },
        //验证规则
        loginRules:{
          //需要注意，规则名与表单中共的数据项名称必须保持一致
          username:[
            { required:true, message:"请输入用户名", trigger:"blur"},
            { min: 0, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required:true, message:"请输入密码",trigger:"blur"},
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //重置登录表单
      resetLoginForm(){
        this.$refs.loginFormRef.resetFields();
      },
      //登录
      login(){
        this.$refs.loginFormRef.validate( async valid =>{
          //参数valid为表单验证结果
          console.log(valid);
          if(!valid){
            //valid is false
            return
          }
          //使用自己封装的request方法
          // request({url:"login",method:"post",params:this.loginForm}).then(
          //   res=>{
          //     console.log(res)
          //   }
          // )
          //使用axios
          const {data:res} = await this.$http.post("login",this.loginForm)
          if(res.meta.status !== 200){
            //提示登录失败
            this.$message({
              showClose: true,
              message: '登录失败，请检查用户名和密码！',
              type: 'error'
            });
          }
          else{
            //提示登录成功
            this.$message({
              showClose: true,
              message: '登录成功！',
              type: 'success'
            });
            //保存token
            window.sessionStorage.setItem("token",res.data.token);
            //跳转
            await this.$router.push("/home");
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .login-container{
        height: 100%;
        background-color: #2d4d6d;
    }
    .login-box{
        height: 350px;
        width: 450px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .head-box{
        height: 130px;
        width: 130px;
        padding: 10px;
        border-radius: 50%;
        border: 1px solid #eee;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        box-shadow: 0 0 10px #eee;
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            background-color: #ddd;
            border-radius: 50%;
        }
    }
    .form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>