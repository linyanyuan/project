<template>
    <div class="box">
        <topTool
                :toolData="toolData"
                v-on:updatas="updatas"
                ></topTool>
        <div class="totle_all">
               <div class="totle_item">
                   <span>应发总额：</span>
                   <strong>{{tablesData.totalAccount}}元</strong>
               </div>
               <div class="totle_item">
                   <span>发薪总人数：</span>
                   <strong>{{tablesData.totalNum}}人</strong>
               </div>
               <div class="totle_item">
                   <span>应转账总金额：</span>
                   <strong>{{tablesData.transAccount}}元</strong>
               </div>
            <div class="totle_item">
                <span>校验成功总人数：</span>
                <strong>{{tablesData.insertNum}}人</strong>
            </div>
            <div class="totle_item">
                <span>校验失败总人数：</span>
                <strong>{{tablesData.failNum}}人</strong>
            </div>
        </div>
        <div class="tableList">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 20px;">
                <el-tab-pane
                        v-for="(val,index) in tablesData.sheetDataList"
                        :key="index"
                        :label="val.sheetName"
                        :name="index" ></el-tab-pane>
               <!-- <el-tab-pane label="小福北京科技有限公司" name="first" ></el-tab-pane>
                <el-tab-pane label="小福天津科技有限公司" name="second" ></el-tab-pane>
                <el-tab-pane label="小福河南科技有限公司" name="third" ></el-tab-pane>-->
            </el-tabs>
            <div class="totle">
                <div class="totle_item">
                    <span>应发额：</span>
                    <strong>{{users.totalAccount}}元</strong>
                </div>
                <div class="totle_item">
                    <span>应转账金额：</span>
                    <strong>{{users.transAccount}}元</strong>
                </div>
                <div class="totle_item">
                    <span>发薪人数：</span>
                    <strong>{{users.totalNum}}人</strong>
                </div>
                <div class="totle_item">
                    <span>校验成功人数：</span>
                    <strong>{{users.insertNum}}人</strong>
                </div>
                <div class="totle_item">
                    <span>校验失败人数：</span>
                    <strong>{{users.failNum}}人</strong>
                </div>
            </div>
            <tableList
                    :columns="columns"
                    :tableData="tableData"
                    :data-source="tableProps"></tableList>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button
                    size="small"
                    @click="submitOrder"
                    :loading="loading"
                    :disabled="this.tableProps.length===0 || !isDis"
                    type="primary">提交</el-button>
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
    const topTool = r => require.ensure([], () => r(require('../../components/topTool.vue')), 'topTool');//工具按钮组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    import {
        findUpdataAll,
        submitOrderData
    } from '../../api/api'
    import pagination from '../../utils/pagination'
    export default {
        name: "balance-updata",
        data(){
            return{
                //按钮
                toolData:{
                    tools:{
                        update:true
                    }
                },
                tableData:{
                    xuhao:true
                },
                //控制器
                activeName: 0,
                loading:false,
                isDis:false,
                /*存储器*/
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
                        width:'170'
                    },
                    {
                        text: '收款人手机号',
                        dataIndex: 'coiUserPhone',
                        type:'text',
                        width:'150'
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
                        width:'200'
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
                        text: '个税（元）',
                        dataIndex: 'coiPersonTaxTemp',
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
                        text: '错误提示',
                        dataIndex: 'message',
                        type:'text',
                        fixed:'right',
                        color:'red',
                        width:'170'
                    }
                ],
                users: [],
                tableProps:[],
                tablesData:{},//上传明细数据
                total:0,
                updataMounth:'',//上传结算月
                //分页
                currentPage: 1,
                pageSize: 20,
            }
        },
        components:{
            topTool,
            tableList
        },
        mounted(){
           // this.queryUpdataAll();
        },
        methods:{
            //预览结算表单
            updatas(response,datas){
                //保存上传结算月
                this.updataMounth = datas.shouldGrantDate;
                if(response.status === 200){
                    this.$message({
                        type:'success',
                        message:response.message
                    });
                    this.isDis = true;
                }else{
                    this.isDis = false;
                    this.$message({
                        type:'error',
                        message:response.message
                    });

                }
                console.log(this.isDis)
                this.tablesData = response.data;
                this.users = this.tablesData.sheetDataList[0];
                //this.tableProps = this.tablesData.sheetDataList[0].totalList;
                this.pagination = new pagination.Pagination(this.tablesData.sheetDataList[0].totalList,this.pageSize,this.currentPage);//实例分页工具
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);

                this.total = this.pagination.getTotalNum();
            },
            //sheet  Tab键切换
            handleClick(tab, event) {
                let a = tab.name;
                this.currentPage = 1;
                this.pageSize = 20;
                this.users = this.tablesData.sheetDataList[a];
               // this.tableProps = this.tablesData.sheetDataList[a].totalList;
                //改变sheet了  重新初始化数据
                this.pagination.initDatas(this.tablesData.sheetDataList[a].totalList);
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);
                this.total =this.pagination.getTotalNum();
            },
            //提交
            submitOrder(){
                if(this.tablesData.failNum > 0){
                    this.$message({
                        message: '提交表单失败，请查看错误提示！',
                        type: 'error',
                        duration:5000
                    });
                    return;
                }
                let DataList = '';
                for(let i = 0,l = this.tablesData.sheetDataList.length;i<l;i++){
                    DataList += '#'+JSON.stringify(this.tablesData.sheetDataList[i].totalList)
                }

                DataList = DataList.substring(1);
                let para = {
                    DataList:DataList,
                    shouldGrantDate:this.updataMounth
                };
                this.loading = true;
                submitOrderData(para).then(res =>{
                    this.loading = false;
                    if(res.status === 200){
                        this.$message({
                            message: res.message,
                            type: 'success'
                        });
                        this.$router.push({ path: '/home/balanceIndex/balance' });
                    }
                }, error =>{
                    this.loading = false;
                })
            },
            //分页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);
               // this.getUsers();
            },
            //每页多少条
            handleSizeChange(val){
                this.pageSize = val;
                this.pagination.changePageSize(this.pageSize);
                this.tableProps = this.pagination.getCurrentDatas(this.currentPage-1);
               // this.getUsers();
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
        /*background: #f4f4f4;*/
        margin-bottom:10px ;
        background: #fff;
        box-sizing: border-box;
    }
    .totle_all{
        float: left;
        width: 100%;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        background: #fff;
        box-sizing: border-box;
        margin-bottom: 10px;
        padding: 0 30px;
        .totle_item{
            float: left;
            height: 40px;
            line-height: 40px;
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
    .totle{
        width: 100%;
        padding: 0 30px;
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
