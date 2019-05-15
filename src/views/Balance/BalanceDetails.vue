<template>
    <div class="box">
        <searchPanle
                v-on:search="search"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <div class="totle" v-if="balanceDatas.status===0">
                <div class="totle_item">
                    <span>结算单号：</span>
                    <strong>{{temps.coBusNo}}</strong>
                </div>
                <div class="totle_item">
                    <span>公司名称：</span>
                    <strong>{{balanceDatas.companyName}}</strong>
                </div>
                <div class="totle_item">
                    <span>结算月：</span>
                    <strong>{{temps.coShouldGrantDate}}</strong>
                </div>
                <div class="totle_item">
                    <span>发薪总额：</span>
                    <strong>{{temps.coTotalPrice}}元</strong>
                </div>
                <div class="totle_item">
                    <span>发薪人数：</span>
                    <strong>{{temps.coTotalCount}}人</strong>
                </div>
            </div>
            <div class="totle" v-if="balanceDatas.status===1">
                <div class="totle_item">
                    <span>结算单号：</span>
                    <strong>{{temps.coBusNo}}</strong>
                </div>
                <div class="totle_item">
                    <span>公司名称：</span>
                    <strong>{{balanceDatas.companyName}}</strong>
                </div>
                <div class="totle_item">
                    <span>结算月：</span>
                    <strong>{{temps.coShouldGrantDate}}</strong>
                </div>
                <div class="totle_item">
                    <span>实发总额：</span>
                    <strong>{{temps.coTotalPrice}}元</strong>
                </div>
                <div class="totle_item">
                    <span>成功人数：</span>
                    <strong>{{temps.coPaySuccessCount}}人</strong>
                </div>
                <div class="totle_item">
                    <span>失败人数：</span>
                    <strong>{{temps.coPayFailCount}}人</strong>
                </div>
            </div>
            <tableList
                    v-if="balanceDatas.status===0"
                    :loading="listLoading"
                    :columns="columns"
                    :tableData="tableData"
                    :data-source="users"></tableList>
            <tableList
                    v-if="balanceDatas.status===1"
                    :loading="listLoading"
                    :columns="columns1"
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
    import {
        findCompanyOrdersItems,
        findCompanyOrdersDetail
    } from '../../api/api';
    import { mapState} from "vuex";
    export default {
        name: "balance-details",
        data(){
            return{
                searchData:{
                    selected:{
                        balanceDetail:true
                    }
                },
                tableData:{
                    xuhao:true
                },
                /*存储器*/
                balanceDatas:{},//结算单列表数据 params值
                listLoading:false,
                columns: [

                    {
                        text: '收款人姓名',
                        dataIndex: 'coiUserName',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '收款人身份证号',
                        dataIndex: 'coiIdCard',
                        type:'text',
                        width:'180'
                    },
                    {
                        text: '收款人手机号 ',
                        dataIndex: 'coiUserPhone',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '收款人银行卡账号',
                        dataIndex: 'coiBankCard',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '收款账号开户行名称',
                        dataIndex: 'coiOpenBankName',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '收款账号开户行名称分行（支行）',
                        dataIndex: 'coiBankName',
                        type:'text',
                        width:'240'
                    },
                    {
                        text: '应发额（元）',
                        dataIndex: 'coiGrantPrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '实发额（元）',
                        dataIndex: 'coiSalary',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '个税（元）',
                        dataIndex: 'coiPersonTax',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '状态',
                        dataIndex: 'coiGrantStatus',
                        type:'text',
                        width:'100'
                    }
                ],
                //已结算的
                columns1: [

                    {
                        text: '收款人姓名',
                        dataIndex: 'coiUserName',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '收款人身份证号',
                        dataIndex: 'coiIdCard',
                        type:'text',
                        width:'180'
                    },
                    {
                        text: '收款人手机号 ',
                        dataIndex: 'coiUserPhone',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '收款人银行卡账号',
                        dataIndex: 'coiBankCard',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '收款账号开户行名称',
                        dataIndex: 'coiOpenBankName',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '收款账号开户行名称分行（支行）',
                        dataIndex: 'coiBankName',
                        type:'text',
                        width:'240'
                    },
                    {
                        text: '应发额（元）',
                        dataIndex: 'coiGrantPrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '实发额（元）',
                        dataIndex: 'coiSalary',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '个税（元）',
                        dataIndex: 'coiPersonTaxTemp',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '状态',
                        dataIndex: 'coiGrantStatus',
                        type:'text',
                        width:'100'
                    },
                    {
                        text: '备注',
                        dataIndex: 'coiRemark',
                        type:'text',
                        width:'100'
                    }
                ],
                users: [],

                temps:{},//主订单数据
                total:0,
                status:1,
                companyName:'',
                //分页
                currentPage: 1,
                pageSize: 20,
                searchCondition:'',

            }
        },
        components:{
            searchPanle,
            tableList
        },
        computed:{
            //映射State
            ...mapState({
                companyList: state => state.companyList,
            }),
        },
        mounted(){
            //保存结算单详情到cookie
            let balance =  JSON.parse(sessionStorage.getItem('balance'));
            if(!balance){
                //第一次 进入
                sessionStorage.setItem('balance', JSON.stringify(this.$route.params.coBusNo));
                this.balanceDatas = this.$route.params.coBusNo;
            }else{
                if(this.$route.params&&!this.$route.params.coBusNo){
                    //$route不存在 说明为刷新
                    this.balanceDatas = balance;
                }else{
                    //不是刷新  是父进来的
                    this.balanceDatas = this.$route.params.coBusNo;
                    sessionStorage.setItem('balance', JSON.stringify(this.$route.params.coBusNo));
                }
            }
            this.getUsers();
            this.getCompanyOrdersDetail();
        },
        methods:{
            //搜索
            search(datas){
                this.searchCondition = datas.balanceDetail;//收款人姓名
                this.getUsers();
            },
            //获取主订单数据
            getCompanyOrdersDetail(){
               // this.companyName = this.$route.params.coBusNo.companyName;
                let para = {
                    coId:this.balanceDatas.coId
                    //coId:this.$route.params.coBusNo.coId
                };
                let companyList = this.companyList,k,p,companyId = '';
                findCompanyOrdersDetail(para).then((res) => {
                    if(res.status === 200){
                        /*let datas = res.data;
                        console.log(datas,companyList)
                        /!*循环加上公司名称*!/
                        for(let i = 0 ,l = datas.length;i<l;i++){
                            companyId = datas[i].coCompanyId;//公司ID
                            for(k = 0,p = companyList.length;k<p;k++){
                                if(companyId === companyList[k].cId){
                                    datas[i].companyName = companyList[k].cName;
                                }
                            }
                        }
                        console.log(datas)*/
                        this.temps = res.data;
                    }
                }, error=>{
                });
            },
            //获取子订单列表
            getUsers() {
                let para = {
                    ordersId:this.balanceDatas.coId,
                    //ordersId:this.$route.params.coBusNo.coId,
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                    searchCondition:this.searchCondition,//收款人姓名、身份证号、手机号
                };
                this.listLoading = true;
                findCompanyOrdersItems(para).then((res) => {
                        this.total = res.total_count;
                        let temps = res.list?res.list:[],status;
                        for(let i = 0,l = temps.length;i<l;i++){
                            status = temps[i].coiGrantStatus;
                            if(status === 0){
                                temps[i].coiGrantStatus = '未结算';
                            }else if(status === 1){
                                temps[i].coiGrantStatus = '成功';
                            }else if(status === 2){
                                temps[i].coiGrantStatus= '失败';
                            }
                        }
                        this.users = temps;
                        this.listLoading = false;
                }, error=>{
                    this.listLoading = false;
                });
            },
            headrStyle(){
                return 'background:#f4f4f4'
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
       /* background: #f4f4f4;*/
        background: #fff;
        margin: 10px 0;
        box-sizing: border-box;
    }
    .totle{
        width: 100%;
        padding:10px 30px 0 30px;
        box-sizing: border-box;
        float: left;
        margin-bottom: 10px;
        .totle_item{
            float: left;
            height: 30px;
            line-height: 30px;
            padding-right: 20px;
            margin-right: 20px;
            span{
                font-size: 15px;
                font-weight: 600;
            }
            strong{
                color:#f60;
            }
        }
    }
</style>
