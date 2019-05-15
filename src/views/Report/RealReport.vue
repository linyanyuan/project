<template>
    <div class="box">
        <topTool
                :toolData="toolData"
                v-on:updataRoute="updataRoute"></topTool>
        <div class="tableList">
            <LineCharts></LineCharts>
        </div>
    </div>
</template>

<script>
    const topTool = r => require.ensure([], () => r(require('../../components/topTool.vue')), 'topTool');//工具按钮组件
    const LineCharts = r => require.ensure([], () => r(require('../Home/LineCharts')), 'LineCharts');//折线图
    export default {
        name: "real-report",
        data(){
            return{
                //按钮
                toolData:{
                    tools:{
                        realReport:true
                    }
                },
            }
        },
        components:{
            topTool,
            LineCharts
        },
    }
</script>

<style scoped lang="scss">
    .tableList{
        width: 100%;
        float: left;
        box-sizing: border-box;
    }
</style>
