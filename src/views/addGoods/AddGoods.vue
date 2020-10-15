<template>
    <div class="addGoods-container">
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
<!--            提示信息-->
            <el-alert type="info" title="添加商品信息" :closable="false" center show-icon/>
<!--            步骤条-->
            <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
<!--                    add表单区域，tabs区域-->
            <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClick">
<!--                    基本信息-->
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader :options="cateList" :props="cateProps"
                                         v-model="addGoodsForm.goods_cat" clearable
                                        @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
<!--                    商品动态参数-->
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData" :key="index">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="val" v-for="val in item.attr_vals" :key="val" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
<!--                    商品静态属性-->
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyTableData" :label="item.attr_name" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
<!--                    商品图片上传-->
                    <el-tab-pane label="商品图片" name="3">
<!--                        action：上传图片的后台地址-->
<!--                        on-preview：处理图片预览效果
                            on-remove:处理移除图片的效果
                            list-type：图片展示效果
                            headers:请求头对象
                            on-success:上传图片成功的回调函数function(response,file，fileList)-->
                        <el-upload :action="uploadURL"
                                :on-preview="handlePreview"
                                :on-remove="handlePictureRemove"
                                list-type="picture"
                                :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
<!--                        富文本编辑器-->
                        <quill-editor v-model="addGoodsForm.goods_introduce">
                        </quill-editor>
                        <el-button type="primary" @click="addGoods">完成添加</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
<!--        预览图片-->
        <el-dialog title="图片预览" :visible.sync="picturePreviewDialogVisible" width="50%">
            <img :src="previewPath" alt="#"/>
        </el-dialog>
    </div>
</template>

<script>
    import _ from "lodash"//lodash可以用于深拷贝

  export default {
    name: "AddGoods",
    data(){
      return {
        activeIndex:'0',//激活的步骤
        addGoodsForm:{
          goods_name:'',//商品名称
          goods_price:0,//商品价格
          goods_weight:0,//商品重量
          goods_number:0,//商品数量
          goods_cat:[],//商品分类
          pics:[],//图片列表数组
          goods_introduce:'',//富文本编辑器内容，商品的详情描述
          attrs:[],//属性列表
        },//添加商品表单数据项
        addGoodsFormRules:{
          goods_name:[{required:true,message:"请填写商品名称",trigger:'blur'}],
          goods_price:[{required: true,message:"请输入商品价格",trigger: 'blur'}],
          goods_weight:[{required:true,message:"请填写商品重量",trigger:'blur'}],
          goods_number:[{required: true,message:"请输入商品数量",trigger: 'blur'}],
          goods_cat:[{required:true,message:"请选择商品分类",trigger:'blur'}],
        },//添加商品表单数据规则
        cateList:[],//商品分类数据
        cateProps:{
          expandTrigger:'hover',
          children:"children",
          value:'cat_id',
          label:"cat_name",
        },//商品分类级联选择器的配置对象
        manyTableData:[],//动态参数列表
        onlyTableData:[],//静态属性列表
        uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',//上传图片的URl地址
        headerObj:{
          Authorization:window.sessionStorage.getItem("token"),
        },//图片上传请求头
        previewPath:'',//预览图片路径
        picturePreviewDialogVisible:false,//图片预览框

      }
    },
    created() {
      this.getCateList();
    },
    methods:{
      //获取商品分类数据
      async getCateList(){
        const {data:res} = await this.$http.get("categories");
        if(res.meta.status !== 200){
          return this.$message.error("获取商品分类失败！");
        }
        this.cateList = res.data;
        //console.log(res.data);
      },
      //级联选择器变化
      handleChange(){
        if(this.addGoodsForm.goods_cat.length !== 3){
          this.addGoodsForm.goods_cat = [];
        }
      },
      //未完成上一步操作时，阻止标签页的切换
      beforeTabLeave(activeName,oldActiveName){
        // console.log("leave" + OldActiveName);
        // console.log("enter" + activeName);
        if(oldActiveName==='0'&&this.addGoodsForm.goods_cat.length!==3){
          this.$message.warning("请先选择商品分类！")
          return false;
        }
      },
      //点击tab item
      async tabClick(){
        //访问动态参数面板
        if(this.activeIndex==='1'){
          const {data:res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`,{params:{sel:"many"}});
          if(res.meta.status !== 200){
            return this.$message.error("获取动态参数失败！");
          }
          //console.log(res.data);
          res.data.forEach(item =>{
            item.attr_vals = item.attr_vals.length===0? [] : item.attr_vals.split(/[ ]+/);
          })
          this.manyTableData = res.data;
        }
        //访问静态属性面板
        else if(this.activeIndex==='2'){
          const {data:res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`,{params:{sel:"only"}});
          if(res.meta.status !== 200){
            return this.$message.error("获取动静态属性失败！");
          }
          console.log(res.data);
          // res.data.forEach(item =>{
          //   item.attr_vals = item.attr_vals.length===0? [] : item.attr_vals.split(/[ ]+/);
          // })
          this.onlyTableData = res.data;
        }
      },
      //图片预览效果
      handlePreview(file){
        this.previewPath = file.response.data.url;
        this.picturePreviewDialogVisible = true;
      },
      //图片移除效果
      handlePictureRemove(file){
        //获取移除文件的路径
        const filepath = file.response.data.tmp_path;
        //获取其索引
        const index = this.addGoodsForm.pics.findIndex(x =>{ return x.pic===filepath});
        this.addGoodsForm.pics.splice(index,1);
      },
      //图片上传成功的回调函数
      handleSuccess(response){
        //console.log(response)
        const picInfo = { pic:response.data.tmp_path};
        this.addGoodsForm.pics.push(picInfo);
        //console.log(this.addGoodsForm);
      },
      //点击按钮，完成添加
      addGoods(){
        //console.log(this.addGoodsForm);
        this.$refs.addGoodsFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.warning("请填写必要的表单项目！");
          }
          //处理动态参数
          this.manyTableData.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')};
            this.addGoodsForm.attrs.push(newInfo);
          })
          //处理静态属性
          this.onlyTableData.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals};
            this.addGoodsForm.attrs.push(newInfo);
          })
          //将goods_cat变成字符串
          let form = _.cloneDeep(this.addGoodsForm);
          form.goods_cat = form.goods_cat.join(',');
          console.log(form);
          //发起添加商品请求
          //商品名称必须是唯一的
          const {data:res} = await this.$http.post("goods",form);
          if(res.meta.status !== 201){
            return this.$message.error("添加商品失败！");
          }
          this.$message.success("添加商品成功！");
          this.$router.push("/goods");
        })
      }
    }
  }
</script>

<style scoped>
.el-steps{
    margin:15px;
}
    .el-checkbox{
        margin:0 10px
    }
    img{
        width: 100%;
    }
    .el-button{
        margin-top: 15px;
    }
</style>