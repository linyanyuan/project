<template>
    <div class="box">
        <searchPanle
                v-on:search="search"
                v-on:timeChange="timeChange"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <LineCharts ref="lineCharts" :isTrue="isTrue"></LineCharts>
        </div>

    </div>
</template>

<script>
    import {
        getStatisticsStatement,//查询统计报表数据
    } from '../../api/api'
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const LineCharts = r => require.ensure([], () => r(require('../Home/LineCharts')), 'LineCharts');//折线图
    export default {
        name: "report",
        data(){
            return{
                searchData:{
                    selected:{
                        date:true,
                        month1:'开始月份',
                        month2:'结束月份'
                    }
                },
                isTrue:2,
                startDate:'',
                endDate:''
            }
        },
        components:{
            searchPanle,
            LineCharts
        },
        methods:{
            //查询
            search(datas){
                this.getUser();
            },
            //时间 改变
            timeChange(searchDate){
                if(searchDate.valueMonth1){
                    this.startDate = searchDate.valueMonth1+'-01';
                }else{
                    this.startDate = searchDate.valueMonth1
                }
                if(searchDate.valueMonth2){
                    this.endDate = searchDate.valueMonth2+'-01';
                }else{
                    this.endDate = searchDate.valueMonth2
                }
               // this.getUser();
            },
            getUser(){
                let para ={
                   // count:null,//查询数量  比如近6个月的数据
                    startTime:this.startDate,//开始查询月份
                    endTime:this.endDate,//结束查询月份
                };
                getStatisticsStatement(para).then(res =>{
                    let temps = res;
                    this.$refs['lineCharts'].findGetStatisticsStatement(temps);
                }/*,error=>{
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                }*/)
            }
        }
    }
</script>

<style scoped lang="scss">
    .tableList{
        width: 100%;
        float: left;
        margin: 10px 0;
        box-sizing: border-box;
    }
</style>
