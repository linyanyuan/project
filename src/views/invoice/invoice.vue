<template>
    <div class="box">
        <searchPanle
                v-on:normalDate = 'normalDate'
                v-on:search="search"
            :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
                    :columns="columns"
                    :tableData="tableData"
                    v-on:invoiceRoute="invoiceRoute"
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
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    import {invoiceList} from '../../api/api';
    import util from '../../utils/util';
    export default {
        name: "invoice",
        data(){
            return{
                //搜索
                searchData:{
                    selected:{
                        normalDate:true,
                        holder1:'开始时间',
                        holder2:'结束时间'
                    }
                },
                tableData:{
                    invoice:true
                },
                //参数
                startDate:'-1',
                endDate:'-1',
                /*存储器*/
                columns: [
                    {
                        text: '开票日期',
                        dataIndex: 'ciiDate',
                        type:'text',
                        width:'200'
                    },

                    {
                        text: '业务类型',
                        dataIndex: 'ciiProject',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '发票金额（元）',
                        dataIndex: 'ciiPrice',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '快递单号',
                        dataIndex: 'ciiExpressNumber',
                        type:'text',
                        width:'120'
                    }
                ],
                users: [],
                total:0,
                //分页
                currentPage: 1,
                pageSize: 20,
            }
        },
        components:{
            searchPanle,
            tableList
        },
        mounted(){
            this.getUsers();
        },
        methods:{
            //获取用户列表
            getUsers() {
                let para = {
                    page:this.currentPage,
                    pageSize:this.pageSize,
                    startDate:this.startDate,
                    endDate:this.endDate
                };
                this.listLoading = true;
                invoiceList(para).then((res) => {
                    this.total = res.data.total_count;
                    this.users = res.data.list?res.data.list:[];
                    this.listLoading = false;
                });
            },
            //发票结算单详情
            invoiceRoute(a){
                this.$router.push({
                    name:'关联结算单列表',
                    path:'/home/invoiceIndex/invoiceDetails',
                    params:{
                        numbers:a
                    }
                })
            },
            //物流详情
            balanceRoute(a){
                this.$router.push({
                    name:"物流信息",
                    path:'/home/invoiceIndex/logistics',
                    params:{
                        invoice:a
                    }
                })
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
            //搜索按钮
            search(obj){
                if(obj.valueTimeNormal){
                    this.startDate = util.dateToNormal(obj.valueTimeNormal[0]);
                    this.endDate = util.dateToNormal(obj.valueTimeNormal[1]);

                }else{
                    this.startDate = '-1';
                    this.startDate = '-1';
                }
                this.getUsers();
            },
            //改变时间
            normalDate(date){
                if(date){
                    this.startDate = util.dateToNormal(date[0]);
                    this.endDate = util.dateToNormal(date[1]);

                }else{
                    this.startDate = '-1';
                    this.endDate = '-1';
                }
                this.getUsers();
            }
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
