<template>
    <section>
        <div class="charts_box">
            <div class="pannel_head">
                <div class="pannel-title">数据分析</div>
            </div>
            <div class="lineCharts_body" >
                <el-row style="height:100%;">
                   <!-- <el-col :span="18" style="height:100%;">
                        <div id="line_chart"></div>
                    </el-col>
                    <el-col :span="6" style="height:100%;display: flex;align-items: center">
                        <el-card
                                style="border: none"
                                :body-style="carObj"
                                shadow="never">
                            注：本数据根据一般企业数据测试效果统计，如需真实数据<a class="importData">点此导入</a>精确数据进行估算。
                        </el-card>
                    </el-col>-->
                    <!--<div class="line_box">
                        <div id="line_chart"></div>
                    </div>-->
                    <el-row style="width: 100%;height: 270px;">
                        <el-col :span="20" offset="2" style="height: 270px;">
                            <div id="line_chart"></div>
                        </el-col>
                    </el-row>
                    <div class="title_box">
                        <!--<el-card
                                v-if="isTrue === 1"
                                style="border: none"
                                :body-style="carObj"
                                shadow="never">
                            注：本数据根据一般企业数据测算效果统计，如需真实数据<a class="importData" @click="routerGo">点此导入</a>精确数据进行估算。
                        </el-card>-->
                        <el-card
                                v-if="isTrue === 1"
                                style="border: none"
                                :body-style="carObj"
                                shadow="never">
                            注：本数据根据一般企业数据测算效果统计，为近六个月内数据，如需获取更多数据<a class="importData" @click="routerGo">点此查询</a>
                        </el-card>
                        <el-card
                                v-if="isTrue === 2"
                                style="border: none"
                                :body-style="carObj"
                                shadow="never">
                            注：本数据根据一般企业数据测算效果统计。
                        </el-card>
                    </div>
                </el-row>
            </div>
        </div>
    </section>
</template>

<script>
    import {
        getStatisticsStatement,//查询统计报表数据
    } from '../../api/api'
    export default {
        name: "line-charts",
        props:{
            isTrue:{
                type:Number,
                default:function () {
                    return 1
                }
            },
        },
        data(){
            return{
                carObj:{
                    padding:'10px',
                    textAlign:'center'
                },
                count:6,
                startTime:null,
                endTime:null,
                /*存储区*/
                xAxisDatas:[],//X轴
                beforeCosting:[],//优化之前
                laterCosting:[],//优化之后
                economizeCosting:[],//节省成本
            }
        },
        mounted(){
            this.findGetStatisticsStatement();

        },
        methods:{
            //获取数据
            findGetStatisticsStatement(res){
                this.xAxisDatas = [];
                this.beforeCosting = [];
                this.laterCosting = [];
                this.economizeCosting = [];
                if(!!res){
                    let temps = res;
                    for(let i = 0,l = temps.length;i<l;i++){
                        this.xAxisDatas.unshift(temps[i].yearMonth);
                        this.beforeCosting.unshift(temps[i].beforeCosting);
                        this.laterCosting.unshift(temps[i].laterCosting);
                        this.economizeCosting.unshift(temps[i].economizeCosting);
                    }
                    this.initLineCharts();
                }else{
                    let para ={
                        count:this.count,//查询数量  比如近6个月的数据
                        startTime:this.startTime,//开始查询月份
                        endTime:this.endTime,//结束查询月份
                    };
                    getStatisticsStatement(para).then(res =>{
                        let temps = res;
                        for(let i = 0,l = temps.length;i<l;i++){
                            this.xAxisDatas.unshift(temps[i].yearMonth);
                            this.beforeCosting.unshift(temps[i].beforeCosting);
                            this.laterCosting.unshift(temps[i].laterCosting);
                            this.economizeCosting.unshift(temps[i].economizeCosting);
                        }
                        this.initLineCharts();
                    });

                }
            },
            //实例化echarts
            initLineCharts(){
                let mychart = echarts.init(document.getElementById('line_chart'));
                let option = {
                    legend:{
                        itemGap:20,
                        data:[
                            {
                                name:'优化前',
                                textStyle:{
                                    color:'#343a40',
                                    fontSize:14
                                }
                            },
                            {
                                name:'优化后',
                                textStyle:{
                                    color:'#343a40',
                                    fontSize:14
                                }
                            },
                            {
                                name:'节省成本',
                                textStyle:{
                                    color:'#343a40',
                                    fontSize:14
                                }
                            }
                        ]
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type:'shadow'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            show:false
                        },
                        minInterval:10,
                        splitNumber:3,
                        splitLine:'false',
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            fontWight:'bold',
                            color:'#343a40',
                            fontSize:13
                        }
                    },
                    grid: {
                       /* left: '0px',
                        right: '0px',
                        top: '10px',
                        bottom: '10px',*/
                        left: '3%',
                        right: '3%',
                        bottom: '3%',
                        containLabel: true,

                    },
                    xAxis:  {
                        type: 'category',
                        splitLine:'false',
                        axisLine:{
                            lineStyle:{
                                color:'#dee2e6'
                            }
                        },
                        data:this.xAxisDatas,
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            fontWight:'bold',
                            color:'#343a40',
                            fontSize:15
                        }
                    },
                    series:[

                        {
                            name:'优化前',
                            type:'bar',
                            barWidth:30,
                            itemStyle:{
                                normal:{
                                    color:'rgba(255, 159, 64, 0.8)'
                                }
                            },
                            data:this.beforeCosting,
                        },
                        {
                            name:'优化后',
                            type:'bar',
                            barWidth:30,
                            itemStyle:{
                                normal:{
                                    color:'rgba(54, 162, 235, 0.8)'
                                }
                            },
                            data:this.laterCosting,
                        },
                        {
                            name:'节省成本',
                            type:'bar',
                            barWidth:30,
                            itemStyle:{
                                normal:{
                                    color:'rgba(75, 192, 192, 0.8)'
                                }
                            },
                            data:this.economizeCosting
                        }
                    ]
                };
                mychart.setOption(option);
                window.addEventListener("resize", function () {
                    mychart.resize();
                });
            },
            //路由
            routerGo(){
                this.$router.push({ path: '/home/Report' });
            }
        }
    }
</script>

<style scoped lang="scss">
    section{
        width: 100%;
        float: left;
    }
    .line_box{
        width: 980px;
        height: 270px;
        margin: 0 auto;
    }
    .title_box{
        margin: 0 auto;
        font-size: 14px;
    }
    .importData{
        cursor: pointer;
        color: red;
    }
    .charts_box{
        height: 370px;
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      /*  margin-bottom: 10px;*/
        /*margin-bottom: 20px;*/
        background-color: #fff;
        /* border: 1px solid transparent;
         border-radius: 4px;*/
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
        box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
    }
    .lineCharts_body{
       flex: 1;
    }
    #line_chart{
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        margin-left: 10px;
    }
    @media only screen and (max-width: 1170px) and (min-width: 768px){
        .lineCharts_body  .el-col-18,.el-col-6 {
             width: 100% !important;
         }
        /*.lineCharts_body>.el-col{
            height: 90px;
        }*/
    }
    /*消息样式*/
    .pannel_head{
        padding: 12px 48px 12px 20px;
        border-bottom: 1px solid transparent;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        .pannel-title{
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }
    }
</style>
