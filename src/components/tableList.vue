<template>
    <el-table
        :data="data"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
        style="width:100%"
        :header-cell-style="headrStyle">
        <el-table-column
                v-if="tableData.xuhao"
                align="center"
                width="70"
                type="index"
                label="序号">
        </el-table-column>
        <el-table-column
                v-if="tableData.selected"
                type="selection"
                width="40">
        </el-table-column>
        <el-table-column
                v-if="tableData.message"
                label="内容"
                min-width="200">
            <template slot-scope="scope">
                <i class="iconfont icon-noread" :class="scope.row.readStatus === 0? 'icon_mes':'icon_mes1'"></i>
                <span style="margin-left: 10px">{{ scope.row.content }}</span>
            </template>
        </el-table-column>
        <el-table-column
                v-for="(column,index) in columns"
                :align="column.center?column.center:'center'"
                :min-width="column.width"
                :label="column.text"
                :fixed="column.fixed?column.fixed:false"
                :key="column.dataIndex">
            <template  slot-scope="scope">

                <span
                        v-if="column.text ==='结算单号' || column.dataIndex ==='ciiExpressNumber'"
                        style="text-decoration:underline;cursor: pointer;"
                        @click="eventClick('balanceRoute',scope.row)">
                    {{scope.row[column.dataIndex]}}
                </span>
                <span
                        v-if="column.text !=='结算单号'&& column.dataIndex !=='ciiExpressNumber'"
                    :style="column.color?'color:'+column.color:''">

                    {{scope.row[column.dataIndex]}}
                </span>
                <!-- <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        v-if="column.type == 'button'"
                        v-for="val in column.dataIndex">{{val.name}}</el-button>-->
            </template>
        </el-table-column>
        <!--//任务管理操作-->
        <el-table-column
                v-if="tableData.task"
                align="center"
                min-width="200"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        v-if="scope.row.checkStatus === 0"
                        size="mini"
                        type="text"
                        @click="eventClick('checkResult',scope.row)"
                        icon="el-icon-check">验收</el-button>
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('readResult',scope.row)"
                        icon="el-icon-view">预览</el-button>
                <a :href="downloadResult+'?id='+scope.row.id">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-download">下载</el-button>
                </a>

            </template>
        </el-table-column>
        <!--合同管理列表操作-->
        <el-table-column
                v-if="tableData.contract"
                align="center"
                fixed="right"
                min-width="100"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('readResult',scope.row)"
                        icon="el-icon-view">预览</el-button>
            </template>
        </el-table-column>
        <!--//结算管理删除-->
        <el-table-column
                v-if="tableData.balance"
                align="center"
                min-width="100"
                fixed="right"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    @click="eventClick('delete',scope.row)"
                    v-if="scope.row.coPayStatus === '待结算'"
                    icon="el-icon-delete">删除</el-button>
                <a :href="importOrderUrl+'?ordersId='+scope.row.coId">
                    <el-button
                            size="mini"
                            type="text"
                            v-if="scope.row.coPayStatus === '已结算'"
                            icon="el-icon-download">下载</el-button>
                </a>

            </template>
        </el-table-column>
        <!--发票管理列表操作-->
        <el-table-column
                v-if="tableData.invoice"
                align="center"
                fixed="right"
                min-width="100"
                label="相关详情">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('invoiceRoute',scope.row)"
                        icon="el-icon-view">关联结算单查看</el-button>
            </template>
        </el-table-column>
        <!--消息管理列表操作-->
        <el-table-column
                v-if="tableData.message"
                align="center"
                fixed="right"
                min-width="100"
                label="操作">
            <template  slot-scope="scope">
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('details',scope.row)"
                        icon="el-icon-info ">详情</el-button>
                <el-button
                        size="mini"
                        type="text"
                        @click="eventClick('delete',scope.row)"
                        icon="el-icon-delete">删除</el-button>
            </template>
        </el-table-column>

    </el-table>
</template>

<script>
    import {
        exportCompanyOrdersItems,
        downloadResultAppearFile
    } from '../api/api'
    export default {
        name: "table-list",
        data(){
            return{
                importOrderUrl:exportCompanyOrdersItems,
                downloadResult:downloadResultAppearFile
            }
        },
        props:{
            //listLoading
            loading:{
                type: Boolean,
                default: function () {
                    return false
                }
            },
            // 这是数据源
            dataSource: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 这是相应的字段展示
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            //这是控制器
            tableData:{
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            // 格式化数据源
            data: function () {
                return this.dataSource;

            }
        },
        methods:{
            //头部样式
            headrStyle(){
                return 'background:#f4f4f4';
            },
            /*选中列表 */
            handleSelectionChange(sels) {
             //   this.sels = sels;
                this.$emit('handleSelectionChange',sels);
            },
            btnClick(scope){
                console.log(scope)
            },
            eventClick(type,a){
                switch (type){
                    case 'balanceRoute':
                        this.$emit('balanceRoute',a);
                        return;
                    case 'invoiceRoute':
                        this.$emit('invoiceRoute',a);
                        return;
                    case 'delete':
                        this.$emit('delete',a);
                        return;
                    case 'details':
                        this.$emit('details',a);
                        return;
                    case 'checkResult':
                        this.$emit('checkResult',a);
                        return;
                    case 'readResult':
                        this.$emit('readResult',a);
                        return;
                    default:
                        return
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-button [class*=el-icon-]+span {
        margin-left: 0;
    }

    .icon_mes{

        font-size: 18px;
        line-height: 20px;
        color: #dcdc2e;
        font-weight: 700;
    }
    .icon_mes1{

        font-size: 18px;
        line-height: 20px;
        color: #cbd0db;
        font-weight: 700;
    }

</style>
