<template>
    <div class="box">
        <searchPanle
                v-on:ordersCompanyChange="ordersCompanyChange"
                v-on:otherDate="otherDate"
                v-on:search="search"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <div class="account_balance">
                <div class="acc_item">
                    <div class="item_title">账户余额(元)</div>
                    <div class="real_item">
                        <!--<span>￥</span>-->
                        <strong>{{totleMoney}}</strong>
                    </div>
                </div>
            </div>
        </div>
        <div class="tableList" style="margin-top: 0;">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 20px;">
                <el-tab-pane label="全部" name="first" ></el-tab-pane>
                <el-tab-pane label="收入" name="second" ></el-tab-pane>
                <el-tab-pane label="支出" name="third" ></el-tab-pane>
            </el-tabs>
            <tableList
                    :loading="listLoading"
                    :columns="columns"
                    :tableData="tableData"
                    :data-source="users"></tableList>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :current-page="currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="20"
                    layout="total, sizes,prev, pager, next, jumper"
                    :total="total"
                    style="float:right;">
            </el-pagination>
        </el-col>
    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    import util from '../../utils/util';
    import {
        findCompanyAccount,//帐户余额
        findCompanyFinance,//帐户明细
    } from '../../api/api'
    export default {
        name: "account",
        data(){
            return{
                //搜索
                searchData:{
                    selected:{
                        company:true,
                        dateDay:true,
                        defaultCompany:true,
                    }
                },

                tableData:{
                },
                defaultCompany:'',
                //控制器
                activeName: 'first',
                /*存储器*/
                columns: [
                    {
                        text: '入账时间',
                        dataIndex: 'createDate',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '交易流水号',
                        dataIndex: 'serialNumber',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '对方信息',
                        dataIndex: 'message',
                        type:'text',
                        width:'250'
                    },
                    {
                        text: '账务类型',
                        dataIndex: 'businessType',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '收支金额（元）',
                        dataIndex: 'moneys',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '帐户余额（元）',
                        dataIndex: 'caFinalBalance',
                        type:'text',
                        width:'120'
                    }
                ],
                totleMoney:0,//总余额
                users: [],
                total:0,
                listLoading:false,
                //分页
                currentPage: 1,
                pageSize: 20,
                startDate:'',
                endDate:'',
                type:null,

            }
        },
        components:{
            searchPanle,
            tableList
        },
        computed:{

        },
        mounted(){
            this.defaultCompany = JSON.parse(sessionStorage.getItem('companyList'))[0].cId;
            this.getFindCompanyAccount();//余额
            this.getFindCompanyFinance();//账户明细
        },
        methods:{
            //获取帐户余额
            getFindCompanyAccount(){
                let para = {
                    companyId:this.defaultCompany
                };
                findCompanyAccount(para).then(res =>{
                    if(res.status === 200){
                        this.totleMoney = res.data;
                    }
                },error =>{
                    /*this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })*/
                })
            },
            //查询订单明细
            getFindCompanyFinance(){
                let para = {
                    companyId:this.defaultCompany,//公司ID
                    type:this.type,
                    startTime:this.startDate,
                    endTime:this.endDate
                };
                findCompanyFinance(para).then(res =>{
                    if(res && res.list){
                        let temps = res.list?res.list:[],status,accountType;
                        this.total = res.total_count;
                        for(let i = 0,l = temps.length;i<l;i++){
                            status = temps[i].type;
                            accountType = temps[i].businessType;
                            if(status === 1){
                                temps[i].ccStatusMark = '收入';
                            }else if(status === 3){
                                temps[i].ccStatusMark = '支出';
                            }
                            if(accountType == '充值'){
                                temps[i].moneys = '+'+temps[i].money;
                            }else{
                                temps[i].moneys = '-'+temps[i].money;
                            }
                          //  temps[i].times = temps[i].ccStartDate +' 至 '+temps[i].ccEndDate
                        }
                        this.listLoading = false;
                        this.users = temps;
                    }
                },error =>{
                    this.listLoading = false;
                })
            },
            //日期改变
            otherDate(searchDatas){
                if(searchDatas.valueTime){
                    this.startDate = util.dateToNormal(searchDatas.valueTime[0]);
                    this.endDate = util.dateToNormal(searchDatas.valueTime[1]);

                }else{
                    this.startDate = '-1';
                    this.startDate = '-1';
                }
                this.getFindCompanyFinance();
            },
            //搜索按钮
            search(obj){
              /*  if(searchDatas.valueTime){
                    this.startDate = util.dateToNormal(searchDatas.valueTime[0]);
                    this.endDate = util.dateToNormal(searchDatas.valueTime[1]);

                }else{
                    this.startDate = '-1';
                    this.startDate = '-1';
                }*/
                this.getFindCompanyFinance();
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getFindCompanyFinance();
                this.getFindCompanyAccount()
            },
            handleClick(tab, event) {
                this.active = tab.name;
                if(tab.name === 'first'){
                    this.type = null;
                }else if(tab.name === 'second'){
                    this.type = 1;
                }else if(tab.name === 'third'){
                    this.type = 3;
                }
                this.getFindCompanyFinance();
            },
            //分页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getUsers();
            },
            //每页多少条
            handleSizeChange(val){
                this.pageSize = val;
                this.getUsers();
            },
        }
    }
</script>

<style scoped lang="scss">
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #fff;
        margin: 10px 0;
        box-sizing: border-box;
    }
    .account_balance{
        background: #fff;
    }
    .acc_item{
        width: 400px;
        height: 60px;
        line-height: 60px;
        margin: 0 auto;
        display: flex;
        padding: 20px 0;
        box-sizing: border-box;
        justify-content: center;
        .item_title{
            font-size: 18px;
            line-height: 20px;
        }
        .real_item{
            line-height: 20px;
            margin-left: 20px;
            span{
                font-size: 25px;
                line-height: 20px;
            }
            strong{
                color: #f60;
                font-size: 25px;
                line-height: 20px;
            }
        }
    }
</style>
