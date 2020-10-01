<template>
    <div class="params-container">
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品参数</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
<!--            警告消息-->
            <el-alert show-icon :closable="false"
                    title="注意！只允许为三级商品设置相关参数！"
                    type="warning">
            </el-alert>
<!--            提示框-->
            <el-row>
                选择商品分类：
                <el-cascader :options="cateList" clearable
                             :props="cateProps" v-model="selectedCate"
                             @change="changeSelected"
                ></el-cascader>
            </el-row>
<!--            Tab标签-->
            <el-tabs v-model="activeName" @tab-click="tabClick">
<!--                动态参数面板-->
                <el-tab-pane label="动态参数" name="many">
<!--                   添加参数-->
                    <el-button :disabled="isBtnDisable" type="primary" size="mini" @click="showAddManyDialog">添加参数</el-button>
<!--                    动态参数表格-->
                    <el-table :data="manyAttrList" border stripe>
<!--                        展开列-->
                        <el-table-column type="expand">
<!--                            在每个展开行里使用tag展示属性的vals-->
                            <template slot-scope="scope">
<!--                                循环展示已经存在的attr_vals-->
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleTagClose(index,scope.row)">{{item}}</el-tag>
<!--                                添加新tag的input与button交替显示-->
                                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue" class="input-new-tag"
                                        ref="saveTagInput" size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"/>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
<!--                        索引列-->
                        <el-table-column type="index"/>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
<!--                静态属性面板-->
                <el-tab-pane label="静态参数" name="only">
                    <!--                   添加属性-->
                    <el-button :disabled="isBtnDisable" type="primary" size="mini" @click="showAddOnlyDialog">添加属性</el-button>
<!--                    静态属性列表-->
                    <el-table :data="onlyAttrList" border stripe>
                        <!--                        展开列-->
                        <el-table-column type="expand">
                            <!--                            在每个展开行里使用tag展示属性的vals-->
                            <template slot-scope="scope">
                                <!--                                循环展示已经存在的attr_vals-->
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleTagClose(index,scope.row)">{{item}}</el-tag>
                                <!--                                添加新tag的input与button交替显示-->
                                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue" class="input-new-tag"
                                          ref="saveTagInput" size="small"
                                          @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"/>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
<!--                        索引列-->
                        <el-table-column type="index"/>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
<!--        添加静态属性的dialog-->
        <el-dialog title="添加静态属性" :visible.sync="addOnlyDialogVisible"
                    width="50%" @close="closeAddOnlyDialog">
<!--            主体表格-->
            <el-form :model="addOnlyForm" :rules="addOnlyFormRules" ref="addOnlyFormRef" label-width="20%">
                <el-form-item label="参数名：" prop="attr_name">
                    <el-input v-model="addOnlyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!--               底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddOnly">取 消</el-button>
                <el-button type="primary" @click="sureAddOnly">确 定</el-button>
            </span>
        </el-dialog>
        <!--        添加动态属性的dialog-->
        <el-dialog title="添加动态属性" :visible.sync="addManyDialogVisible"
                   width="50%" @close="closeAddManyDialog">
            <!--            主体表格-->
            <el-form :model="addManyForm" :rules="addManyFormRules" ref="addManyFormRef" label-width="20%">
                <el-form-item label="属性名：" prop="attr_name">
                    <el-input v-model="addManyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!--               底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddMany">取 消</el-button>
                <el-button type="primary" @click="sureAddMany">确 定</el-button>
            </span>
        </el-dialog>
<!--        修改属性的dialog-->
        <el-dialog :title="'修改'+editDialogTitle" :visible.sync="editDialogVisible"
                    width="50%" @close="closeEditDialog">
            <!--            主体表格-->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="20%">
                <el-form-item label="属性名：" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!--               底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="sureEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "Params",
    data(){
      return{
        cateList:[],//分类列表
        cateProps:{//cateList级联选择器配置
          label:"cat_name",
          children:"children",
          value:'cat_id',
          expandTrigger:'hover',
        },
        selectedCate:[],//选择到的cate数组
        activeName:'many',//活跃的tab item
        //cateId:null,当前分类id,使用计算属性获取，就不需要在data定义,
        manyAttrList:[],//当前分类的动态参数列表
        onlyAttrList:[],//静态参数列表
        addOnlyDialogVisible:false,//添加静态属性面板是否可见
        addManyDialogVisible:false,//添加动态参数dialog可见
        addOnlyForm:{
          attr_name:'',
        },//添加静态属性表格数据
        addOnlyFormRules:{
          attr_name:[{required:true,message:"请输入合适的属性名",trigger:'blur'}],
        },//添加静态属性表格规则
        addManyForm:{
          attr_name:'',
        },//添加动态属性表格数据
        addManyFormRules:{
          attr_name:[{required:true,message:"请输入合适的属性名",trigger:'blur'}],
        },//添加静态属性表格规则
        editDialogVisible:false,//修改属性dialog是否可见
        editForm:{
          attr_name:'',
        },//编辑dialog的表格数据
        editFormRules: {
          attr_name:[{required:true,message:"请输入新的属性名",trigger:'blur'}],
        },//编辑表格规则
        currentAttrId:-1,//当前属性id
      }
    },
    created() {
      this.getCateList();
    },
    methods:{
      //获取分类列表
      async getCateList(){
        const {data:res} = await this.$http.get("categories");
        if(res.meta.status !== 200) {
          return this.$message.error("获取分类列表失败！");
        }
        this.cateList = res.data;
        console.log(res.data);
      },
      //级联选择器选择变化
      changeSelected(){
        if(this.selectedCate.length !== 3){
          this.selectedCate = [];
          this.manyAttrList = [];
          this.onlyAttrList = [];
          return
        }
        this.getAttrList();
        //console.log(this.selectedCate);
      },
      //tab点击
      tabClick(){
        this.getAttrList();
        console.log(this.activeName);
      },
      //获取参数列表
      async getAttrList(){
        //获取对应的参数
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
        if(res.meta.status !== 200){
          return this.$message.error("获取参数列表失败！");
        }
        //将res.data.attr_vals使用空格进行分割，变成一个数组
        res.data.forEach(item =>{
          item.attr_vals = item.attr_vals? item.attr_vals.split(/[ ,]+/):[];
          //控制input的显示与隐藏
          item.inputVisible = false;
          //控制input的输入内容
          item.inputValue = '';
        })
        if(this.activeName === "many") {
          this.manyAttrList = res.data;
        }
        else if(this.activeName === "only"){
          this.onlyAttrList = res.data;
        }
        console.log(res.data);
      },
      //显示添加动态参数dialog
      showAddManyDialog(){
        this.addManyDialogVisible = true;
      },
      //显示添加静态属性dialog
      showAddOnlyDialog(){
        this.addOnlyDialogVisible = true;
      },
      //关闭静态dialog
      closeAddOnlyDialog(){
        this.$refs.addOnlyFormRef.resetFields();
        this.addOnlyDialogVisible = false;
      },
      //关闭动态dialog
      closeAddManyDialog(){
        this.$refs.addManyFormRef.resetFields();
        this.addManyDialogVisible = false;
      },
      cancelAddOnly(){
        this.closeAddOnlyDialog();
      },
      cancelAddMany(){
        this.closeAddManyDialog();
      },
      //确认添加动态属性
      sureAddMany(){
        this.$refs.addManyFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.warning("请检查输入是否合法！");
          }
          console.log(valid);
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
            {attr_name:this.addManyForm.attr_name, attr_sel:this.activeName})
          if(res.meta.status !== 201){
            return this.$message.error("添加动态属性失败！");
          }
          this.$message.success("添加动态属性成功！");
          this.getAttrList();
        })
        this.closeAddManyDialog();
      },
      sureAddOnly(){
        this.$refs.addOnlyFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.warning("请检查输入是否合法！");
          }
          console.log(valid);
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
            {attr_name:this.addOnlyForm.attr_name,attr_sel:this.activeName})
          if(res.meta.status !== 201){
            return this.$message.error("添加静态属性失败！");
          }
          this.$message.success("添加静态属性成功!");
          this.getAttrList();
        })
        this.closeAddOnlyDialog();

      },
      //显示editDialog
      showEditDialog(row){
        this.currentAttrId = row.attr_id;
        this.editForm.attr_name = row.attr_name;
        this.editDialogVisible = true;
      },
      //关闭edit dialog
      closeEditDialog(){
        this.$refs.editFormRef.resetFields();
        this.currentAttrId = -1;
        this.editDialogVisible = false;
      },
      //取消编辑
      cancelEdit(){
        this.closeEditDialog();
      },
      //确认编辑
      sureEdit(){
        this.$refs.editFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.warning("请检查输入是否合法！")
          }
          if(this.currentId === -1){
            this.$message.error("属性id错误，为-1，未赋值");
          }
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.currentAttrId}`,
            {attr_name:this.editForm.attr_name,attr_sel:this.activeName});
          if(res.meta.status !==200){
            return this.$message.error("更新属性失败！");
          }
          this.$message.success("更新属性成功！");
          this.getAttrList();
        })
        this.closeEditDialog();
      },
      //删除属性
      deleteAttr(attr_id){
        this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
          if(res.meta.status !== 200){
            return this.$message.error("删除属性失败！");
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getAttrList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //关闭el-tag
      handleClose(tag) {
        //this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      //添加el-tag时显示input
      showInput(row) {
        row.inputVisible = true;
        //是文本框自动获得焦点
        //$nextTick当页面重新渲染的时候调用回调函数
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //input失去焦点或者，按下了enter键
      async handleInputConfirm(row) {
        let inputValue = row.inputValue.trim();
        if (inputValue.length === 0) {
          row.inputValue = '';
          return this.$message.warning("请输入合法的内容！");
        }
        row.attr_vals.push(inputValue);
        //提交到后台保存
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
          {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')});
        if(res.meta.status !== 200){
          return this.$message.error("保存新属性失败！");
        }
        this.$message.success("保存新属性成功！");
        row.inputVisible = false;
        row.inputValue = '';
      },
      //关闭tag，删除属性
      async handleTagClose(index,row){
        row.attr_vals.splice(index,1);
        //提交到后台保存
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
          {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')});
        if(res.meta.status !== 200){
          return this.$message.error("移除失败！");
        }
        this.$message.success("移除成功！");
      }

    },
    computed:{
      //按钮是否被禁用，是则禁用，否则可用
      isBtnDisable(){
        if(this.selectedCate.length !== 3){
          return true;
        }
        return false;
      },
      //计算当前分类id
      cateId(){
        if(this.selectedCate.length === 3){
          return this.selectedCate[2];
        }
        return null;
      },
      editDialogTitle(){
        return this.activeName === "only"? "静态属性":"动态参数";
      }
    }
  }
</script>

<style scoped>
    .el-card{
        margin-top: 15px;
    }
    .el-row{
        margin-top: 15px;
    }
    .el-button{
        margin-bottom: 15px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>