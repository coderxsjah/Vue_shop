<template>
    <div class="category-container">
<!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

<!--        主体内容，卡片区-->
        <el-card>
<!--            添加分类按钮-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

<!--            表格-->
            <TreeTable :data="cateList" :columns="columns" :show-index="true" :border="true"
                       :selection-type="false" :expand-type="false">
<!--                是否有效-->
                <template slot="isok" slot-scope="scope">
                    <el-icon v-if="!scope.row.cat_deleted" style="color: lightgreen" class="el-icon-success"></el-icon>
                    <el-icon v-else class="el-icon-error" style="color: lightgreen"></el-icon>
                </template>
<!--                排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
                </template>
<!--                操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </TreeTable>
            <!--        分页-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum" :page-sizes="[3,5,10]" :page-size="queryInfo.pagesize"
                           :total = "total" layout="total,sizes,prev,next,pager,jumper"></el-pagination>
        </el-card>

        <!--            添加分类的页面-->
        <el-dialog title="添加分类"  @close="closeAddCateDialog"
                   :visible.sync="addCateDialogVisible"
                   width="50%">
            <!--                内容主体-->
<!--            添加分类表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
<!--                    options指定数据源-->
<!--                    props指定配置对象-->
                    <el-cascader
                            :options="parentCateList"
                            :props="cascaderProps"
                            v-model="selectedOptions"
                            clearable
                            @change="parentCateChange"></el-cascader>
                </el-form-item>
            </el-form>
            <!--               底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCate">取 消</el-button>
                <el-button type="primary" @click="sureAddCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
  export default {
    name: "Category",
    data(){
      return {
        cateList:[],//商品分类数组
        columns:[
          {label:"分类名称",prop:"cat_name"},
          {label:"是否有效",type:"template",template:"isok"},//type和template分别表明本列使用自定义模板，以及模板名称
          {label: "排序",type:"template",template: "order"},
          {label: "操作",type: "template",template: "opt"}
        ],//treetable的列属性配置
        queryInfo:{//查询参数
          type:3,
          pagenum:1,
          pagesize:5,
        },
        total:0,//总数据条数
        addCateDialogVisible:false,//显示添加分类
        addCateForm:{//添加分类的表单
            cat_name:'',//分类名称
            cat_pid:0,//父级分类
            cat_level:0,//默认分类级别
        },
        addCateFormRules:{//添加分类表单的规则
            cat_name:[{required:true,message:"请填写合适的分类名称",trigger:'blur'},
              {min:1,max:10,message:"分类名称应在1-10个字符"}]
        },
        parentCateList:[],//父级列表
        cascaderProps:{//级联选择器配置对象
            value:'cat_id',//选择的属性
            label:"cat_name",//看到的属性
            children:'children',//子选择
            expandTrigger:'hover',//选择方式
           checkStrictly:true,//是否可以只选择一级
        },
        selectedOptions:[],//级联选择器的选择结果
      }
    },
    created() {
      this.getCateList();
    },
    methods:{
      //获取商品分类数组
      async getCateList(){
        const {data:res} = await this.$http.get("categories",{params:this.queryInfo})
        if(res.meta.status !== 200){
          return this.$message.error("获取商品参数列表失败！");
        }
        this.cateList = res.data.result;
        //console.log(res.data);
        this.total = res.data.total;
      },
      //监听pagesize的改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getCateList();
      },
    //  监听当前页面的改变
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getCateList();
      },
      //展示添加分类页面
      showAddCateDialog(){
        this.getParentCateList()
        this.addCateDialogVisible = true;
      },
      //关闭dialog
      closeAddCateDialog(){
        this.$refs.addCateFormRef.resetFields();
        this.selectedOptions = [];
        this.addCateForm.cat_name = '';
        this.addCateForm.cat_pid=0;
        this.addCateForm.cat_level =0;
        this.addCateDialogVisible = false;
      },
      //取消添加分类
      cancelAddCate(){
       this.closeAddCateDialog();
      },
      //确认添加分类
      sureAddCate(){
        console.log(this.addCateForm);
        this.$refs.addCateFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.warning("请完成表单的填写！")
          }
          const {data:res} = await this.$http.post("categories",this.addCateForm);
          if(res.meta.status !== 201){
            return this.$message.error("添加分类失败！")
          }
          this.$message.success("添加分类成功！")
          this.getCateList();
         // console.log(res);
        })
        this.closeAddCateDialog();
      },
      //获取父级分类
      async getParentCateList(){
       const {data:res} = await this.$http.get("categories",{params:{type:2}});
        if(res.meta.status !== 200){
          return this.$message.error("获取父级列表失败！");
        }
       this.parentCateList = res.data;
      },
      //选择项发生变化
      parentCateChange(){
        console.log(this.selectedOptions);
        if(this.selectedOptions.length > 0){
          this.addCateForm.cat_pid = this.selectedOptions[this.selectedOptions.length - 1];
          this.addCateForm.cat_level = this.selectedOptions.length;
        }
        else{
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      }
    }
  }
</script>

<style scoped>
    .el-card{
        margin-top: 15px;
    }
    .el-row{
        margin-bottom: 15px;
    }

</style>