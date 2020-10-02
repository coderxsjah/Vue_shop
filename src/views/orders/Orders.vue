<template>
    <div class="orders-container">
<!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
<!--            搜索框-->
            <el-row>
                <el-col :span="10">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
<!--            表格项-->
            <el-table :data="ordersList" border stripe>
                <el-table-column type="index"/>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="80px"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status" width="80px">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="80px"></el-table-column>
                <el-table-column label="创建时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditAddressDialog"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页区-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :total="total" :page-sizes="[3,5,10]" :page-size="queryInfo.pagesize"
                    layout="total,sizes,prev,next,pager,jumper"></el-pagination>
        </el-card>
<!--        修改地址dialog-->
        <el-dialog title="修改地址" :visible.sync="editAddressDialogVisible"
                   width="50%" @close="closeEditAddressDialog">
<!--            主体内容表格-->
            <el-form :model="editAddressForm" :rules="editAddressFormRules" label-position="left" label-width="20%" ref="editAddressFormRef">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" :props="addressProps"
                                 v-model="editAddressForm.address1" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="editAddressForm.address2"></el-input>
                </el-form-item>
            </el-form>
<!--            底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEditAddress">取 消</el-button>
                <el-button type="primary" @click="sureEditAddress">确 定</el-button>
            </span>
        </el-dialog>
<!--        物流对话框-->
        <el-dialog title="物流状态" :visible.sync="progressVisible" width="50%" @close="closeProgressDialog">
<!--            时间线组件-->
            <el-timeline >
                <el-timeline-item
                        v-for="(activity, index) in progressList"
                        :key="index"
                        :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import {cityData} from "../../assets/citydata";

    export default {
    name: "Orders",
    data(){
      return {
        ordersList:[],//订单列表数据
        queryInfo:{
          query:'',//查询关键字
          pagenum:1,//页码
          pagesize:10,//每页容量
        },
        total:0,//总订单条数
        editAddressDialogVisible:false,//修改地址dialog是否可见
        editAddressForm:{
          address1:[],//省市区
          address2:'',//详细地址
        },//编辑地址表单数据
        editAddressFormRules:{
          address1:[{required:true,message:'请选择省、市、区',trigger:'blur'}],
          address2:[{required:true,message:'请填写详细地址',trigger:'blur'}],
        },//编辑地址表单验证规则
        cityData,//省市区三级联动数源
        addressProps:{
          expandTrigger:'hover',
          label:'name',
          children:'sub',
          value:'id',
        },//地址级联配置对象
        progressVisible:false,//物流对话框的显示与否
        progressList:[],//物流信息的状态
      }
    },
    created() {
      this.getOrdersList();
    },
    methods:{
      //获取订单列表
      async getOrdersList(){
        const {data:res} = await this.$http.get("orders",{params:this.queryInfo});
        if(res.meta.status!==200){
          return this.$message.error("获取订单列表数据失败！");
        }
        this.ordersList = res.data.goods;
        this.total = res.data.total;
        console.log(res);
      },
      //pagesize发生变化
      handleSizeChange(newsize){
        this.queryInfo.pagesize = newsize;
        this.getOrdersList();
      },
      //current发生变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getOrdersList();
      },
      //关闭修改地址弹窗
      closeEditAddressDialog(){
        this.editAddressDialogVisible = false;
        this.$refs.editAddressFormRef.resetFields();
      },
      //取消修改地址
      cancelEditAddress(){
        this.closeEditAddressDialog();
      },
    //  确认修改地址
      sureEditAddress(){
        this.closeEditAddressDialog();
      },
      //显示编辑地址dialog
      showEditAddressDialog(){
        this.editAddressDialogVisible = true;
      },
      //显示物流进度框
      async showProgressBox(){
        this.progressVisible = true;
        const {data:res} = await this.$http.get(`/kuaidi/1106975712662`);
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error("获取物流信息失败！");
        }
        this.progressList = res.data;
      },
      //关闭物流状态框
      closeProgressDialog(){
        this.progressVisible = false;
      }
    }
  }
</script>

<style scoped>
    .el-table{
        margin-top:15px;
    }
    .el-pagination{
        margin-top: 15px;
    }
</style>