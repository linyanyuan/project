<template>
    <div class="box">
        <div class="tableList">
            <div class="table_head">
                <span :class="{'tabColor':initIndex === 0}" @click="initIndex = 0,readStatusChange(initIndex)">全部</span>
                <span :class="{'tabColor':initIndex === 2}" @click="initIndex = 2,readStatusChange(initIndex)">未读</span>
                <span :class="{'tabColor':initIndex === 1}" @click="initIndex = 1,readStatusChange(initIndex)">已读</span>

            </div>
            <tableList
                    v-on:handleSelectionChange="handleSelectionChange"
                    v-on:delete="deleteMes"
                    v-on:details="details"
                    :loading="loading"
                    :columns="columns"
                    :tableData="tableData"
                    :data-source="users"></tableList>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button
                    size="small"
                    :disabled="this.sels.length===0"
                    @click="readMessages(0)"
                    type="primary">批量删除</el-button>
            <el-button
                    size="small"
                    type="primary"
                    :disabled="this.sels.length===0||this.initIndex === 1"
                    @click="readMessages(1)">批量已读</el-button>
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
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    import {
        findMessagePage,//消息列表
        readMessage,//批量已读
        deleteMessage,//批量删除
    } from '../../api/api'
    export default {
        name: "message",
        data(){
            return{
                tableData:{
                    selected:true,
                    message:true
                },
                /*控制器*/
                initIndex:2,
                loading:false,
                /*存储器*/
                columns: [
                    {
                        text: '日期',
                        dataIndex: 'createDate',
                        type:'text',
                        width:'170'
                    }
                ],
                users: [],
                total:0,
                //分页
                currentPage: 1,
                pageSize:20,
                page: 1,
                readStatus:0,//0未读1已读  不传为全部
                sels: [],//列表选中列
            }
        },
        components:{
            tableList
        },
        mounted(){
            this.queryMessageList();
        },
        methods:{
            handleSelectionChange(sels){
                this.sels = sels;
            },
            //阅读状态改变
            readStatusChange(status){
                if(status === 0){
                    this.readStatus = null;
                    this.queryMessageList();
                }else if(status === 1){
                    this.readStatus = 1;
                    this.queryMessageList();
                }else{
                    this.readStatus = 0;
                    this.queryMessageList();
                }
            },
            //批量已读
            readMessages(a){
                let arr = [];
                this.sels.map(function (item) {
                    arr.push(item.id);
                });
                arr = arr.join(',');
                let para = {
                    ids:arr
                };

                if(a === 0){
                    //批量删除消息
                    this.$confirm('是否删除已选择的消息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        //批量删除消息
                        deleteMessage(para).then((res) => {
                            if(res.code === '0'){
                                this.queryMessageList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                        },error =>{
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                   //批量已读
                    readMessage(para).then((res) => {
                        if(res.code === '0'){
                            this.queryMessageList();
                        }
                    },error =>{
                    });
                }

            },
            //删除单条数据
            deleteMes(row){
                this.$confirm('是否删除此条消息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    let para = {
                        ids:row.id
                    };
                    //批量删除消息
                    deleteMessage(para).then((res) => {
                        if(res.code === '0'){
                            this.queryMessageList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    },error =>{
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //消息详细信息
            details(row){
                this.$router.push({
                    name:"消息详情",
                    path:'/home/messageIndex/messageDetails',
                    params:{
                        message:row
                    }
                })
            },
            //获取消息列表
            queryMessageList(){
                let para = {
                    current_page:this.currentPage,
                    page_size:this.pageSize,
                    readStatus:this.readStatus
                };
                this.loading = true;
                findMessagePage(para).then(res => {
                    this.loading = false;
                    this.total = res.total_count;
                    let datas = res.list?res.list:[];
                    /*for(let i = 0,l = datas.length;i<l;i++){
                        if(datas[i].readStatus === 0){
                            //未读
                            datas[i].content = "<i class=\"iconfont icon-noread\"></i>"+datas[i].content;
                        }else{
                            datas[i].content = "<i class=\"iconfont icon-noread\"></i>"+datas[i].content;
                        }
                    }*/
                    this.users = datas;
                },error =>{
                    this.loading = false;
                });
            },
            //分页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.queryMessageList();
            },
            //每页多少条
            handleSizeChange(val){
                this.pageSize = val;
                this.queryMessageList();
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
    .table_head{
        padding: 10px 20px;
        box-sizing: border-box;
        .tabColor{
            color: #409EFF;
        }
        span{
            padding: 0 10px;
            cursor: pointer;
        }
    }
</style>
