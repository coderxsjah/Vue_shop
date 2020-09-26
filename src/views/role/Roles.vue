<template>
    <div class="roles-container">
<!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
<!--            按钮：添加角色-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
                </el-col>
            </el-row>
<!--            主体区域-->
            <el-table :data="rolesList" border stripe>
<!--                展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bd-bottom','vcenter',index1===0? 'bd-top':'']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
<!--                            一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <el-icon class="el-icon-caret-right"></el-icon>
                            </el-col>
<!--                            二级权限-->
                            <el-col :span="19">
<!--                                渲染二级权限-->
                                <el-row :class="['vcenter',index2===0?'':'bd-top']" v-for="(item2,index2) in item1.children" :key="item2.id">
<!--                                    二级权限内容-->
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row,item2.id)" type="primary">{{item2.authName}}</el-tag>
                                        <el-icon class="el-icon-caret-right"></el-icon>
                                    </el-col>
<!--                                    三级权限-->
                                    <el-col :span="18">
                                        <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="item3 in item2.children" :key="item3.id">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
<!--                索引列-->
                <el-table-column type="index"/>
                <el-table-column label="角色名称" prop="roleName"/>
                <el-table-column label="角色描述" prop="roleDesc"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
<!--                        修改按钮-->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        </el-tooltip>
                        <!--                           删除按钮-->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)" size="mini">删除</el-button>
                        </el-tooltip>
                        <!--                           分配角色按钮-->
                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--            添加角色的页面-->
            <el-dialog title="添加角色" @close="cancelAddRole"
                       :visible.sync="addRoleDialogVisible"
                       width="50%">
                <!--                内容共主体-->
                <!--                    添加用户的表单-->
                <el-form :model="addRoleForm" :rules="addRoleFormRules" @close="cancelAddRole" ref="addRoleFormRef" label-width="100px">
                    <el-form-item label="角色名" prop="roleName">
                        <el-input v-model="addRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!--               添加用户底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddRole">取 消</el-button>
                    <el-button type="primary" @click="sureAddRole">确 定</el-button>
                </span>
            </el-dialog>

            <!--            分配权限dialog的页面-->
            <el-dialog title="分配权限"
                       :visible.sync="setRightDialogVisible"
                       width="50%"
                        @close="cancelSetRights">
                <!--                内容共主体-->
                <!--                    添加权限的表单-->
                <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defChecked"></el-tree>
                <!--               添加用户底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelSetRights">取 消</el-button>
                    <el-button type="primary" @click="sureSetRights" >确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: "Roles",
    data(){
      return {
        rolesList:[],
        addRoleDialogVisible:false,//显示添加角色的dialog
        addRoleForm:{
          roleName:"",
          roleDesc:"",
        },
        addRoleFormRules:{
          roleName:[
            {required:true,message:"请填写合适的角色名",trigger:'blur'},
            {min:3,max:10,message: "角色名应在3-10个字符",trigger: 'blur'}
          ],
          roleDesc:[
            {required:true,message:"请填写合适的角色描述",trigger:'blur'},
            {min:5,max:15,message: "角色描述应在5-15个字符",trigger: 'blur'}
          ]
        },
        setRightDialogVisible:false,//显示分配权限的的dialog
        rightsList:[],//所有权限数据
        treeProps:{//树形控件绑定对象
          label:"authName",//看到的属性
          children:'children',//嵌套的属性
        },
        defChecked:[],//默认的选中的id节点数组
        currentId:-1,//当前角色id
      }
    },
    created() {
      this.getRolesList();
    },
    methods:{
      //获取角色列表
      async getRolesList(){
        const {data:res} = await this.$http.get("roles")
        if(res.meta.status !== 200){
          return this.$message.error("获取权限列表失败，请重试！")
        }
        this.rolesList = res.data;
        console.log(res.data);
      },
      //显示添加角色dialog
      showAddRoleDialog(){
        this.addRoleDialogVisible = true;
      },
      //取消添加角色
      cancelAddRole(){
        this.$refs.addRoleFormRef.resetFields();
        this.addRoleDialogVisible = false;
      },
      //确认添加角色
      sureAddRole(){
        this.$refs.addRoleFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.warning("请填写合适的角色名与角色描述");
          }
          const {data:res} = await this.$http.post("roles",this.addRoleForm);
          if(res.meta.status !== 201){
            return this.$message.error("添加角色失败");
          }
          this.$message.success("添加角色成功！");
          this.getRolesList();
        })
        this.addRoleDialogVisible = false;
      },
    //  根据id删除权限
      async removeRightById(role,rightId){
        const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {return err})
        if(res === 'confirm'){
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
          role.children = res.data
          if(res.meta.status !== 200 ){
            return this.$message.error("删除权限失败，请重试！");
          }
          this.$message({
            type: 'success',
            message: '删除权限成功!'
          });
        }
        else{
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }
      },
      //分配权限的展示
      async showSetRightDialog(role){
        //获取所有权限列表
        console.log(role)
        const {data:res} = await this.$http.get("rights/tree");
        if(res.meta.status !== 200){
          return this.$message.error("获取权限列表失败，请重试！");
        }
        this.rightsList = res.data;
        this.getRightsId(role,this.defChecked)
        //console.log(res.data);
        this.setRightDialogVisible = true;
        this.currentId = role.id;
      },
      //通过递归获取三级节点的权限id
      getRightsId(node,arr){
        if(!node.children){
          return arr.push(node.id);
        }
        else{
          node.children.forEach(item => {
            this.getRightsId(item,arr);
          })
        }
      },
      //取消分配权限
      cancelSetRights(){
        this.defChecked = [];
        this.setRightDialogVisible = false;
        this.currentId = -1;//初始值
      },
    //  确认分配权限
      async sureSetRights(){
        const rightsKey=[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ];
        const idStr = rightsKey.join(',');
        const {data:res} = await this.$http.post(`roles/${this.currentId}/rights`,{rids:idStr});
        if(res.meta.status !== 200){
          this.$message.error("分配权限失败！");
        }
        this.$message.success("分配权限成功！");
        this.getRolesList();
        this.setRightDialogVisible = false;
      }
    }
  }
</script>

<style scoped>
    .el-card{
        margin-top: 15px;
    }
    .el-tag{
        margin: 7px;
    }
    .bd-bottom{
        border-bottom: 1px solid #eee;
    }
    .bd-top{
        border-top: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>