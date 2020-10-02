<!--商品列表-->
<template>
    <div class="goods-container">
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图-->
        <el-card>
<!--            第一行内容，搜索框和添加按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入商品名称" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goToAddGoods">添加商品</el-button>
                </el-col>
            </el-row>
<!--            商品列表-->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"/>
                <el-table-column label="商品名称" prop="goods_name"/>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"/>
                <el-table-column label="商品重量" prop="goods_weight" width="95px"/>
                <el-table-column label="创建时间" prop="add_time" width="230px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoodsById(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: "Goods",
    data(){
      return {
        queryInfo:{
          query:"",//查询关键字
          pagenum:1,//页码
          pagesize:10,//每页数据量
        },//查询参数
        goodsList:[],//商品列表参数
        total:0,//总条数
      }
    },
    created() {
      this.getGoodsList();
    },
    methods:{
      //获取商品列表参数
      async getGoodsList(){
        const {data:res} = await this.$http.get("goods",{params:this.queryInfo});
        if(res.meta.status !== 200){
          return this.$message.error("获取商品列表数据失败！");
        }
        this.goodsList = res.data.goods;
        this.total = res.data.total;
        //console.log(res);
      },
      //分页组件的页面容量变化
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      //当前页码发生变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      //通过id删除商品
      async removeGoodsById(goods_id){
        this.$confirm('是否永久删除此商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`goods/${goods_id}`);
          if(res.meta.status !== 200){
            return this.$message.error("删除商品失败！");
          }
          this.$message.success("删除商品成功！");
          this.getGoodsList();
        }).catch(() => {
          this.$message.error("已取消删除")
        })
      },
      //跳转到添加商品页面
      goToAddGoods(){
        this.$router.push("goods/add");
      }
    }
  }
</script>

<style scoped>

</style>