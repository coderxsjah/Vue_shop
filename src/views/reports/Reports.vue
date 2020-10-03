<template>
    <div class="reports-container">
<!--       面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
<!--            echarts的容器 2.为echarts准备容器-->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    //1.导入echarts
  import echarts from "echarts";
  //用于合并对象
  import _ from "lodash";

  export default {
    name: "Reports",
    data(){
      return {
        //待合并的数据对象
        option : {
          title: {
            text: '用户来源'
          },
          tooltip: {},
          legend: {
            data:[]
          },
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },
    //页面元素渲染完毕
    async mounted() {
      //3.初始化页面图表
      var myChart = echarts.init(document.getElementById('main'));
      //获取折现图数据
      const {data:res} = await this.$http.get("reports/type/1")
      //console.log(res.data);
      // 4.指定图表的配置项和数据
      //合并数对象
      const result = _.merge(res.data,this.option)

      // 5.使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    }
  }
</script>

<style scoped>

</style>