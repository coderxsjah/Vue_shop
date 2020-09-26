<!--用户列表-->
<template>
    <div class="users-container">
<!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图区-->
        <el-card >
<!--            搜索与添加-->

            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" @clear="getUsersList">
                        <el-button @click="getUsersList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                        <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-col>
            </el-row>
<!--                表格信息-->
            <el-table border stripe
                      :data="usersList"
                      highlight-current-row
                      style="width: 100%">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        property="username"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        property="email"
                        label="邮箱"
                        width="120">
                </el-table-column>
                <el-table-column
                        property="mobile"
                        label="电话"
                        width="120">
                </el-table-column>
                <el-table-column
                        property="role_name"
                        label="角色"
                        width="120">
                </el-table-column>
                <el-table-column
                        property="mg_state"
                        label="状态"
                        width="60">
                    <template slot-scope="scope">
                        <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
<!--                           修改按钮-->
                        <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
<!--                           删除按钮-->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)" size="mini"></el-button>
                        </el-tooltip>
<!--                           分配角色按钮-->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
<!--            添加用户的页面-->
            <el-dialog title="添加用户"
                    :visible.sync="addUserDialogVisible"
                    width="50%">
<!--                内容共主体-->
<!--                    添加用户的表单-->
                <el-form :model="addForm" :rules="addFormRules" @close="cancelAdd" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="addForm.phone"></el-input>
                    </el-form-item>
                </el-form>
<!--               添加用户底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" @click="sureAdd">确 定</el-button>
                </span>
            </el-dialog>
<!--            修改用户的页面-->
            <el-dialog title="修改用户信息"
                       :visible.sync="editUserDialogVisible"
                       width="50%">
                <!--                内容主体-->
                <!--                    修改用户的表单-->
                <el-form :model="editForm" :rules="editFormRules" @close="cancelEdit" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名" >
                        <el-input disabled v-model="editForm.username"></el-input>
                    </el-form-item>
<!--                    需要进行验证的才需要prop-->
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!--               底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">取 消</el-button>
                    <el-button type="primary" @click="sureEdit">确 定</el-button>
                </span>
            </el-dialog>
            <!--            f分配角色的页面-->
            <el-dialog title="分配角色"
                       :visible.sync="setRoleDialogVisible"
                       width="50%">
                <!--                内容主体-->
                <p>当前的用户：{{this.userInfo.username}}</p>
                <p>当前的角色：{{this.userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRole" placeholder="请选择">
                        <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </p>
                <!--               底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelSetRole">取 消</el-button>
                    <el-button type="primary" @click="sureSetRole">确 定</el-button>
                </span>
            </el-dialog>
<!--                分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: "Users",
    data(){
      //自定义校验规则
      //校验邮箱
      var checkEmail = (rule,value,callback)=>{
        const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(emailReg.test(value)){
          return callback()
        }
        else{
          callback(new Error("请输入合法的邮箱！"));
        }
      }
      //验证手机号
      var checkPhone = (rule,value,callback)=>{
        const phoneReg = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(phoneReg.test(value))
        {
          return callback()
        }
        else{
          callback(new Error("请输入合法的手机号"))
        }
      }
      return{
        usersList:[],//用户列表
        total:0,//总数据条数
        queryInfo:{
          query:'',//查询参数，
          pagenum:1,//当前页码
          pagesize:2,//每页数量
        },//查询参数
        addUserDialogVisible:false,//显示添加用户的dialog
        addForm:{//添加用户的表单数据
          username:'',//用户名
          password:'',
          email:'',
          phone:''
        },
        addFormRules:{//添加用户的规则
          username:[
            {required:true,message:"请输入用户名",trigger:'blur'},
            {min:3,max:10,message: "用户名在3到10个字符"}
          ],
          password:[
            {required:true,message:"请输入密码",trigger:'blur'},
            {min:6,max:15,message: "密码在6到15个字符"}
          ],
          email:[
            {required:true,message:"请输入邮箱",trigger:'blur'},
            {validator:checkEmail,trigger: 'blur'}
          ],
          phone:[
            {required:true,message:"请输入手机号",trigger:'blur'},
            {validator:checkPhone,trigger: 'blur'}
          ],
        },
        editUserDialogVisible:false,//显示修改用户dialog
        editForm:{},//编辑用户信息时的表单数据
        editFormRules: {
          username:{},
          mobile:[
            {required:true,message:"请输入手机号",trigger:'blur'},
            {validator:checkPhone,trigger: 'blur'}
          ],
          email:[
            {required:true,message:"请输入邮箱",trigger:'blur'},
            {validator:checkEmail,trigger: 'blur'}
            ]
        },
        setRoleDialogVisible:false,//展示分配角色的dialog
        userInfo:{},//当前的用户信息
        rolesList:[],//全部角色列表
        selectedRole:'',//被选中的角色
      }
    },
    created() {
      this.getUsersList();
    },
    methods:{
      async getUsersList(){
        const {data:res} =  await this.$http.get("users",{params:this.queryInfo})
        console.log(res);
        if(res.meta.status!==200){
          return this.$message({
            showClose:true,
            message:"请求参数有误",
            type:"error"
          })
        }
        else{
            this.usersList = res.data.users;
            this.total = res.data.total;
        }
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getUsersList();
      },
      //监听当前页码改变的事件
      handleCurrentChange(newpage){
        this.queryInfo.pagenum = newpage;
        this.getUsersList();
      },
      //监听用户状态的改变
      async userStateChange(userinfo){
        const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if(res.meta.status!==200){
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message({
            showClose:true,
            message:"状态设置失败！",
            type:"error",
          })
        }
        else{
          this.$message.success("更新成功！")
        }
      },
      //显示添加用户的页面
      addUser(){
        this.addUserDialogVisible = true;
      },
      //监听取消
      cancelAdd(){
        this.addUserDialogVisible = false
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮，添加新用户
      sureAdd(){
        this.$refs.addFormRef.validate(async (valid)=>{
          console.log(valid);
          if(!valid){
            return this.$message.error("请输入正确的用户信息")
          }
          const {data:res} = await this.$http.post("users",this.addForm)
          console.log(res);
          if(res.meta.status !== 201){
            this.$message.error("添加用户失败！")
          }
          else{
            this.$message.success("添加用户成功！");
            this.addUserDialogVisible = false;
            this.getUsersList();
          }
        })
      },
      //显示修改用户信息的dialog,并将用户的数据展示给用户
      async showEditDialog(id){
        this.editUserDialogVisible = true;
        const {data:res} = await this.$http.get(`users/`+id);
        if(res.meta.status !== 200){
          this.$message.error("获取用户信息失败，无法修改！")
        }
        this.editForm = res.data;
      },
      //取消修改
      cancelEdit(){
        this.$refs.editFormRef.resetFields();
        this.editUserDialogVisible = false;
      },
      //确认修改
      sureEdit(){
        this.$refs.editFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.error("请输入正确的修改信息！")
          }
          const {data:res} = await this.$http.put(`users/${this.editForm.id}`,this.editForm);
          if(res.meta.status !== 200){
            return this.$message.error("修改用户信息失败，请重试！");
          }
          this.getUsersList();
          this.$message.success("修改用户信息成功！")
        })
        this.editUserDialogVisible = false;
      },
      //删除用户信息
      deleteUser(id){
        //console.log(userinfo)
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`users/${id}`);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getUsersList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //展示分配角色按钮
      async showSetRoleDialog(userInfo){
        this.userInfo = userInfo;
        //获取全部的角色列表
        const {data:res} = await this.$http.get("roles");
        if(res.meta.status !== 200){
          return this.$message.error("获取权限列表失败！");
        }
        this.rolesList = res.data;
        //console.log(res.data);
        this.setRoleDialogVisible = true;
      },
      //取消分配juese
      cancelSetRole(){
        this.setRoleDialogVisible = false;
      },
      //确认分配角色
      async sureSetRole(){
        if(!this.selectedRole){
          return this.$message.warning("请选择角色");
        }
        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRole});
        if(res.meta.status !== 200){
          return this.$message.error("分配角色失败！");
        }
        this.$message.success("分配角色成功！")
        this.getUsersList();
        this.setRoleDialogVisible = false;
      }
    }
  }
</script>

<style scoped>
    .el-breadcrumb{
        margin-bottom: 15px;
    }
    .el-card{
        box-shadow: 0 1px 1px rgba(0,0,0,0.15)!important;
        margin-top: 15px;
    }
    .el-table{
        margin-top: 15px;
    }
    .el-pagination{
        margin-top: 15px;
    }
</style>