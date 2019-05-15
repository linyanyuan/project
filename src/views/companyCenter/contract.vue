<template>
    <div class="box">
        <searchPanle
                v-on:search="search"
                v-on:normalDate = 'normalDate'
                v-on:ordersCompanyChange="ordersCompanyChange"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
           <!-- <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item
                        title="小福北京科技有限公司"
                        name="1">
                    <tableList
                            :columns="columns"
                            :tableData="tableData"
                            :data-source="users"></tableList>
                </el-collapse-item>

            </el-collapse>-->
            <tableList
                    v-on:readResult="readResult"
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
        <el-dialog @close="handleClose"
                   :visible.sync="showReadResult">
            <pdf :src="pdf_path" @error="pdfError"
                 @num-pages="pageCount = $event"
                 @page-loaded="currentPage = $event" :page="page"></pdf>
            <div class="leftBtn el-icon-arrow-left" @click="pervPage"></div>
            <div class="rightBtn el-icon-arrow-right" @click="nextPage"></div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        findContractConFindPage,//合同列表
        getResultAppearFileById,//预览
    } from '../../api/api';
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const pdf  = r => require.ensure([], () => r(require('vue-pdf')), 'pdf');//pdf组件
    import util from '../../utils/util';
    export default {
        name: "contract",
        data(){
            return{
                activeNames: ['1'],
                tableData:{
                    contract:true
                },
                searchData:{
                    selected:{
                        company:true,
                        normalDate:true,
                        holder1:'开始时间',
                        holder2:'结束时间'
                    }
                },
                listLoading:false,
                showReadResult:false,//预览
                /*存储器*/
                columns: [
                    {
                        text: '合同编号',
                        dataIndex: 'ccContractNumber',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '甲方公司',
                        dataIndex: 'ccFirstParty',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '乙方公司',
                        dataIndex: 'ccSecondParty',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '有效期',
                        dataIndex: 'times',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '服务费率',
                        dataIndex: 'ccTotalServiceRate',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '状态',
                        dataIndex: 'ccStatusMark',
                        type:'text',
                        width:'170'
                    }
                ],
                users: [],

                /*PDF*/
                show: true,
                pdf_path:'',
                currentPages:1,
                pageCount: 0,

                loadedRatio: 0,
                page: 1,
                numPages: 0,
                rotate: 0,

                //参数
                defaultCompany:'',
                startDate:'',
                endDate:'',
                name:'',
                //分页
                currentPage: 1,
                pageSize: 20,
                total:0,
            }
        },
        components:{
            tableList,
            searchPanle,
            pdf
        },
        mounted(){

            this.getfindContractConFindPage();

        },
        methods:{
            nextPage(){
                if(this.page === this.pageCount){
                    this.$message({
                        type:'warning',
                        message:'当前为最后一页'
                    });
                    return false
                }else{
                    this.page++;
                }

            },
            pervPage(){
                if(this.page === 1){
                    this.$message({
                        type:'warning',
                        message:'当前为第一页'
                    });
                    return false;
                }else{
                    this.page--;
                }

            },
            //获取合同数据
            getfindContractConFindPage(){
                let para = {
                    companId:this.defaultCompany,//不传查询所有的
                    name:this.name,//模糊查询合同名称、甲方、乙方
                    startDate:this.startDate,//合同有效开始时间
                    endDate:this.endDate,//合同到期时间、
                    page:this.currentPage,
                    pageSize:this.pageSize,
                };
                this.listLoading = true;
                findContractConFindPage(para).then(res =>{
                    if(res && res.list){
                        let temps = res.list?res.list:[],status;
                        this.total = res.total_count;
                        for(let i = 0,l = temps.length;i<l;i++){
                            status = temps[i].termOfValidity;
                            if(status){
                                temps[i].ccStatusMark = '生效';
                            }else if(!status){
                                temps[i].ccStatusMark = '失效';
                            }
                            temps[i].times = temps[i].ccStartDate +' 至 '+temps[i].ccEndDate;
                            temps[i].ccTotalServiceRate = temps[i].ccTotalServiceRate*100+'%';
                        }
                        this.listLoading = false;
                        this.users = temps;
                    }
                },error =>{
                    this.listLoading = false;
                })
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getfindContractConFindPage();
            },
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getfindContractConFindPage();
            },
            //改变时间
            normalDate(date){
                if(date){
                    this.startDate = util.dateToNormal(date[0]);
                    this.endDate = util.dateToNormal(date[1]);

                }else{
                    this.startDate = '-1';
                    this.startDate = '-1';
                }
                this.getfindContractConFindPage();
            },
            pdfError(obj){
                if(obj){
                    this.$message({
                        type:'error',
                        message:'文件加载出错'
                    })
                }
            },
            //预览
            readResult(datas){
                //预览PDF地址不存在
                let para = {
                    id:datas.ccId
                };
                getResultAppearFileById(para).then(res =>{
                    if(res.data){
                        this.showReadResult = true;
                        this.pdf_path = res.path;
                    }else{
                        this.$message({
                            type:'error',
                            message:res.message
                        })
                    }
                })
            },
            //分页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getfindContractConFindPage();
            },
            //每页多少条
            handleSizeChange(val){
                this.pageSize = val;
                this.getfindContractConFindPage();
            },
        }
    }
</script>

<style  lang="scss" >
    .tableList .el-collapse-item__header{
        padding: 0 30px;
        font-size: 18px;
    }
    .box .el-collapse-item__wrap{
        padding: 0 40px;
    }
    .leftBtn{
        font-size: 50px;position: absolute;left:10px;top: 50%;cursor: pointer;
        &:hover{
            background-color: #1f2d3d;
            opacity: .5;
            color: #fff;
        }
    }
    .rightBtn{
        font-size: 50px;position: absolute;right:10px;top: 50%;cursor: pointer;
        &:hover{
            background-color: #1f2d3d;
            opacity: .5;
            color: #fff;
        }
    }
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
