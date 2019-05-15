<template>
    <div class="box">
        <searchPanle
                v-on:search="search"
                v-on:ordersCompanyChange="ordersCompanyChange"
                v-on:timeChange="timeChange"
                :searchData="searchData"></searchPanle>
        <div class="tableList">
            <tableList
                    v-on:checkResult="checkResult"
                    v-on:readResult="readResult"
                    :columns="columns"
                    :loading="listLoading"
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
        <!--<div class="readResult" v-if="showReadResult">
            <pdf :src="pdf_path"></pdf>
        </div>-->
        <el-dialog
                @close="handleClose"
                :loading="isLoading"
                :visible.sync="showReadResult">
            <pdf :src="pdf_path" @error="pdfError"
                 @num-pages="pageCount = $event"
                 @page-loaded="currentPage = $event" :page="page"></pdf>
            <div v-if="pageCount > 1" class="leftBtn el-icon-arrow-left" @click="pervPage"></div>
            <div v-if="pageCount > 1" class="rightBtn el-icon-arrow-right" @click="nextPage"></div>

            <div class="tool" v-if="isCheck">
                <el-button type="primary" @click="btnClick(2)" style="width: 80px;">不通过</el-button>
                <el-button type="primary" @click="btnClick(1)" style="width: 80px;">通过</el-button>
            </div>
            <div class="checkSuccess_box" v-if="isCheckSuccess">
                <div class="checkSuccess" >
                    <div class="check_hd">验收成功</div>
                    <div class="check_bd">{{checktimes}}秒之后自动关闭</div>
                    <el-button type="primary" size="small" style="margin-top: 20px;" @click="checkSuccess">确定</el-button>
                </div>
            </div>
            <!--验证不通过-->
            <div class="checkSuccess_box" v-if="noCheckSuccess">
                <div class="checkSuccess" >
                    <div class="check_hd">请填写未通过验收原因</div>
                    <el-input
                            style="width: 95%;"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入内容"
                            v-model="remark">
                    </el-input>
                    <div class="check_tools">
                        <el-button type="primary" size="small" @click="sunmitRemrk">提交</el-button>
                        <el-button type="primary" size="small"  @click="closeRemark">关闭</el-button>
                    </div>

                </div>
            </div>
            <div class="checkSuccess_box" v-if="noCheck">
                <div class="checkSuccess" >
                    <div class="check_hd">提交成功</div>
                    <div>工作人员将会未通过内容进行处理，请耐心等待</div>
                    <el-button type="primary" size="small" style="margin-top: 20px;" @click="checkSuccess">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const searchPanle = r => require.ensure([], () => r(require('../../components/search.vue')), 'searchPanle');//搜索组件
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    const pdf  = r => require.ensure([], () => r(require('vue-pdf')), 'pdf');//pdf组件
    import {
        findTaskPage,//任务列表
        checkResultAppear,//验收
        getResultAppearFileById,//预览
    } from '../../api/api'

    export default {
        name: "index",
        data(){
            return{
                searchData:{
                    selected:{
                        company:true,
                        date:true,
                        month1:'任务周期开始月份',
                        month2:'任务周期结束月份'
                    }
                },
                tableData:{
                    task:true,
                    xuhao:true
                },
                /*控制器*/
                listLoading:false,
                isLoading:false,
                showReadResult:false,//预览
                isCheck:false,//打开验证
                isCheckSuccess:false,//是否验证成功
                noCheckSuccess:false,//验证不通过
                noCheck:false,//提交不通过 成功
                checktimes:3,//读秒
                /*存储器*/
                columns: [
                    {
                        text: '上传时间',
                        dataIndex: 'createDateStr',
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
                        text: '标题',
                        dataIndex: 'title',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '任务周期',
                        dataIndex: 'taskTime',
                        type:'text',
                        width:'200'
                    },
                    {
                        text: '验收时间',
                        dataIndex: 'checkDate',
                        type:'text',
                        width:'95',
                        center:'left'
                    },
                    {
                        text: '状态',
                        dataIndex: 'check',
                        type:'text',
                        width:'120'
                    },
                ],
                users: [],
                total:0,
                pdf_path:'',
                /*PDF*/
                show: true,
                currentPages:1,
                pageCount: 0,

                loadedRatio: 0,
                page: 1,
                numPages: 0,
                rotate: 0,
                datas:{},
                //分页
                currentPage: 1,
                pageSize: 20,
                //参数
                defaultCompany:'',
                shouldStartDate:'',
                shouldEndDate:'',
                checkStatus:1,//验收状态：1通过，2不通过
                remark:'',//备注
            }
        },
        components:{
            searchPanle,
            tableList,
            pdf
        },
        mounted(){
            this.getUsers();
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
            //获取任务列表
            getUsers() {
                let para = {
                    companyId:this.defaultCompany,//公司编号
                    startDate:this.shouldStartDate,//开始时间
                    endDate:this.shouldEndDate,//结束时间
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                };
                this.listLoading = true;
                findTaskPage(para).then((res) => {
                    if(res){
                        this.total = res.total_count;
                        let datas = res.list?res.list:[];
                        for(let i = 0,l = datas.length;i<l;i++){
                            datas[i].taskTime = datas[i].startDate + ' 至 ' +datas[i].endDate;
                            if(datas[i].checkStatus === 0){
                                datas[i].check = '待验收';
                            }else if(datas[i].checkStatus === 1){
                                datas[i].check = '验收通过';
                            }else if(datas[i].checkStatus === 2){
                                datas[i].check = '验收未通过';
                            }
                        }
                        this.users = datas;
                        this.listLoading = false;
                    }

                },error =>{
                    this.listLoading = false;
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                });
            },
            //公司改变
            ordersCompanyChange(a){
                this.defaultCompany = a;
                this.getUsers();
            },
            //时间 改变
            timeChange(searchDate){
                if(searchDate.valueMonth1){
                    this.shouldStartDate = searchDate.valueMonth1
                }else{
                    this.shouldStartDate = searchDate.valueMonth1
                }
                if(searchDate.valueMonth2){
                    this.shouldEndDate = searchDate.valueMonth2
                }else{
                    this.shouldEndDate = searchDate.valueMonth2
                }

                //this.getUsers();
            },
            //关闭遮罩层
            handleClose(done) {
                if(this.isCheck){
                    this.isCheck = false;
                }
            },
            //验证通过 确定
            checkSuccess(){
                this.noCheck = false;//关闭验证成功遮罩
                this.showReadResult = false;//关闭PDF遮罩
                this.noCheckSuccess = false;
                this.getUsers();//重新获取列表
            },
            //是否通过
            btnClick(type){
                if(type === 1){
                    //通过
                    let para = {
                        ids:this.datas.id,//公司编号
                        checkStatus:type,//验收状态：1通过，2不通过
                        remark:this.remark//备注：当checkStat=2时必填
                    };
                    checkResultAppear(para).then(res =>{
                        if(res.data){
                            this.isCheckSuccess = true;
                            let that =this;
                            this.timer = setInterval(function(){
                                that.checktimes--;
                                if (that.checktimes === 0) {
                                    clearInterval(that.timer);//清除定时器
                                    that.isCheckSuccess = false;//关闭验证成功遮罩
                                    that.showReadResult = false;//关闭PDF遮罩
                                    that.getUsers();//重新获取列表
                                    that.checktimes = 3;//重新赋值
                                    that = null;//清楚闭包内存
                                }
                            },1000);
                        }
                    })

                }else if(type === 2){
                    //验证不通过   填写remark
                    this.checkStatus = type;
                    this.noCheckSuccess = true;
                }


            },
            //提交不通过原因
            closeRemark(){
                //关闭不通过
                this.noCheckSuccess = false;//关闭验证成功遮罩
            },
            sunmitRemrk(){
                //不通过
                let para = {
                    ids:this.datas.id,//公司编号
                    checkStatus:this.checkStatus,//验收状态：1通过，2不通过
                    remark:this.remark//备注：当checkStat=2时必填
                };
                checkResultAppear(para).then(res =>{
                    if(res.data){
                        this.noCheck = true;//验证成功遮罩

                    }
                })
            },
            pdfError(obj){
                if(obj){
                    this.$message({
                        type:'error',
                        message:'文件加载出错'
                    })
                }
            },
            //验收
            checkResult(datas){

                this.datas = datas;
                    //预览PDF地址不存在
                let paras = {
                    id:datas.id
                };
                getResultAppearFileById(paras).then(res =>{
                    if(res){
                        this.showReadResult = true;
                        this.pdf_path = res.path;
                        this.isCheck = true;
                    }
                },error=>{
                    this.isCheck = false;
                })

            },
            //预览
            readResult(datas){
                //预览PDF地址不存在
                let para = {
                    id:datas.id
                };
                this.isLoading = true;
                getResultAppearFileById(para).then(res =>{
                    if(res.data){
                        this.isLoading = true;
                        this.showReadResult = true;
                        this.pdf_path = res.path;
                    }else{
                        this.$message({
                            type:'error',
                            message:res.message
                        })
                    }
                },error =>{
                    this.isLoading = false;
                })
            },
            //查询
            search(datas){
                this.defaultCompany = datas.slsect_company;//公司编号
                this.getUsers();
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

<style  lang="scss">
    .annotationLayer{
        display: none;
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
    /*.readResult{
        width: 900px;
        height: 600px;
        position: fixed;
        top: 60px;
        left: 50%;
        border: 1px solid #000;
        margin-left: -450px;
        overflow-x: hidden;
        overflow-y: scroll;
    }*/
    .tool{
        text-align: center;
        height: 40px;
        padding-top: 20px;
        width: 100%;
    }
    .check_tools{
        text-align: center;
        height: 40px;
        padding-top: 20px;
        width: 100%;
        position: absolute;
        bottom: 5px;
    }
    .checkSuccess_box{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        .checkSuccess{
            position: relative;
            margin: 0 auto 50px;
            background: #fff;
            border-radius: 2px;
            -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
            box-shadow: 0 1px 3px rgba(0,0,0,.3);
            box-sizing: border-box;
            width: 300px;
            height: 200px;
            text-align: center;
            padding-top: 2px;
            margin-top: 30vh;
            .check_hd{
                font-size: 20px;
                margin: 15px 0 15px 0;
            }
            .check_bd{
                margin: 10px 0;
                margin-top: 30px;
            }
        }
    }
</style>
