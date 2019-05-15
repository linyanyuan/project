<template>
    <div class="box">
        <topTool
            :toolData="toolData"
            v-on:updataRoute="updataRoute"></topTool>
        <searchPanle
                v-on:ordersCompanyChange="ordersCompanyChange"
                v-on:ordersStatusChange="ordersStatusChange"
                v-on:timeChange="timeChange"
                v-on:search="search"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
                    :loading="listLoading"
                    :columns="columns"
                    :tableData="tableData"
                    v-on:delete="deleteRow"
                    v-on:balanceRoute="balanceRoute"
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
    const topTool = r => require.ensure([], () => r(require('../../components/topTool.vue')), 'topTool');//工具按钮组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    import {
        findCompanyOrders,
        delCompanyOrdes,
        getNoCheckCount,//获取未验收结算单的数量
        findChildCompanyLists,
        findCompanyList
    } from '../../api/api';
    export default {
        name: "balance",
        data(){
            return{
                //搜索
                searchData:{
                    selected:{
                        company:true,
                       order:true,
                        date:true,
                        month1:'结算开始月份',
                        month2:'结算结束月份'
                    }
                },
                //按钮
                toolData:{
                    tools:{
                        updateForm:true
                    }
                },
                tableData:{
                    balance:true,
                    details:true
                },
                listLoading:false,
                /*存储器*/
                columns: [
                    {
                        text: '结算单号',
                        dataIndex: 'coBusNo',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '上传日期',
                        dataIndex: 'createTime',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '结算日期',
                        dataIndex: 'grantTime',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '公司名称',
                        dataIndex: 'companyName',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '结算月',
                        dataIndex: 'coShouldGrantDate',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '应发金额（元）',
                        dataIndex: 'coTotalPrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '转账金额（元）',
                        dataIndex: 'coTransAccount',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '发薪人数（人）',
                        dataIndex: 'coTotalCount',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '服务费（元）',
                        dataIndex: 'coServicePrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '状态',
                        dataIndex: 'coPayStatus',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '备注',
                        dataIndex: 'remark',
                        type:'text',
                        width:'100'
                    }
                ],
                users: [],
                total:0,
                //分页
                currentPage: 1,
                pageSize: 20,
                payStatus:null,//订单状态
                shouldEndDate:'',//结束时间
                shouldStartDate:'',//开始时间
                defaultCompany:'',//默认公司
                companyIdStr:'',//多个编号
                companyList:[]
            }
        },
        components:{
            searchPanle,
            tableList,
            topTool
        },
        computed:{

        },
        mounted(){
            let companyList =  JSON.parse(sessionStorage.getItem('companyList'));
            if(!companyList){
                //不存在的情况
                findCompanyList().then((res)=>{
                    if(res){
                        //不存在的时候 重新保存一下
                        sessionStorage.setItem('companyList', JSON.stringify(res));
                        companyList =  JSON.parse(sessionStorage.getItem('companyList'));
                        this.companyList = companyList;
                    }
                });

            }else{
                //存在
                this.companyList = companyList;
            }
            this.getUsers();
        },
        methods:{
            //获取结算单列表
            getUsers() {
                if(!this.defaultCompany){
                    let that = this;
                    if(this.companyIdStr){
                        //已经获取过一次全部公司cid了
                        this.getLists();
                    }else{
                        findChildCompanyLists(function(temp){
                            let datas = temp,str='';
                            for(let i = 0,l = datas.length;i<l;i++){
                                str += ','+datas[i].cId;
                            }
                            str = str.substring(1);
                            that.defaultCompany = '';
                            that.companyIdStr = str;
                            that.getLists();
                        },error =>{
                        })
                    }


                }else{
                    this.companyIdStr = '';
                    this.getLists();
                }

            },
            getLists(){
                let para = {
                    companyId:this.defaultCompany,//单个公司编号
                    companyIdStr:this.companyIdStr,//多个编号
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                    payStatusStr:this.payStatus,
                    shouldStartDate:this.shouldStartDate,//开始时间
                    shouldEndDate:this.shouldEndDate//结束时间
                };
                this.listLoading = true;
                findCompanyOrders(para).then((res) => {
                    this.total = res.total_count;
                    let temps = res.list?res.list:[],status,k,p,companyId='',companyList = this.companyList;
                    for(let i = 0,l = temps.length;i<l;i++){
                        status = temps[i].coPayStatus;
                        companyId = temps[i].coCompanyId;//公司ID
                        /*if(status === 1 || status === 2 || status === 3){
                            temps[i].coPayStatus = '待结算';
                        }else if(status === 4){
                            temps[i].coPayStatus = '结算中';
                        }else if(status === 5|| status === 11|| status === 12){
                            temps[i].coPayStatus= '已结算';
                        }else if(status=== 7){
                            temps[i].coPayStatus= '订单删除';
                        }*/
                        if(status === 1  || status === 3){
                            temps[i].coPayStatus = '待结算';
                        }else if(status === 4 || status === 2){
                            temps[i].coPayStatus = '结算中';
                        }else if(status === 5|| status === 11|| status === 12){
                            temps[i].coPayStatus= '已结算';
                        }else if(status=== 7){
                            temps[i].coPayStatus= '订单删除';
                        }
                        if(status === 1){
                            temps[i].remark = '余额不足';
                        }
                        /*循环加上公司名称*/
                        //  companyList = this.companyList;
                        for(k = 0,p = companyList.length;k<p;k++){
                            if(companyId === companyList[k].cId){
                                temps[i].companyName = companyList[k].cName;
                            }
                        }
                    }
                    this.users = temps;
                    this.listLoading = false;
                }).catch(res =>{
                    this.listLoading = false;
                });
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getUsers();
            },
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
            },
            //结算单 改变
            timeChange(searchDate){
                if(searchDate.valueMonth1){
                    this.shouldStartDate = searchDate.valueMonth1+'-01';
                }else{
                    this.shouldStartDate = searchDate.valueMonth1
                }
                if(searchDate.valueMonth2){
                    this.shouldEndDate = searchDate.valueMonth2+'-01';
                }else{
                    this.shouldEndDate = searchDate.valueMonth2
                }

                //this.getUsers();
            },
            //订单状态改变
            ordersStatusChange(a){
                if(a === 0){
                    this.payStatus = null;
                }else if(a === 1){
                    this.payStatus = '1,2,3';
                }else if(a===2){
                    this.payStatus = '4';
                }else if(a === 3){
                    this.payStatus = '5';
                }else if(a === 4){
                    this.payStatus = null;
                }
                this.getUsers();
            },
            //跳转至结算详情
            balanceRoute(row){
                let status;
                if(row.coPayStatus === '已结算'){
                    status = 1;
                }else{
                    status = 0;
                }
                row.status = status;
                this.$router.push({
                    name:'结算单详情',
                    path: '/home/balanceIndex/balanceDetails',
                    params:{
                        coBusNo:row,
                       // status:status
                    }
                });
            },
            //删除
            deleteRow(row){
                 this.$confirm('确定删除此结算单?', '提示', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                   type: 'warning'
               }).then(() => {
                     let para = {
                         coBusNo:row.coBusNo,//业务订单号
                         coOpStatus:0
                     };
                     delCompanyOrdes(para).then(res =>{
                         if(res.status === 200){
                             this.$message({
                                 type: 'success',
                                 message: res.message
                             });
                             this.getUsers();
                         }
                     });

               }).catch(() => {
                   this.$message({
                       type: 'info',
                       message: '已取消删除'
                   });
               });

            },
            //跳转上传结算单
            updataRoute(){
                getNoCheckCount().then(res =>{
                    if(res && res.data>0){
                        let str = "您有"+  res.data  +`条待验收任务成果，无法上传结算单，`+`请先验收任务成果`;
                        this.$confirm(str, '', {
                            confirmButtonText: '是',
                            showCancelButton:false,
                            center: true
                        }).then(() => {
                            this.$router.push({
                                name:'任务管理',
                                path: '/home/task'
                            })
                        }).catch(() => {

                        });
                    }else if(res && res.data === 0){
                        this.$router.push({ path: '/home/balanceIndex/balanceUpdata' });
                    }
                },error =>{
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
        background: #f4f4f4;
        margin: 10px 0;
        box-sizing: border-box;
    }
</style>
