<template>
    <section>
        <div class="box-tools pull-right">
            <el-row style="width: 100%;">
                <el-col :span="1">
                    <i class="iconfont icon-sousuo" style="padding: 0 15px;color: #b9a7a7;font-size: 20px;"></i>
                </el-col>
                <el-col :span="23">
                    <el-col :span="24">
                        <el-form
                                @submit.native.prevent
                                style="overflow: hidden;white-space: nowrap;"
                                class="demo-form-inline"
                                :inline="true">
                            <!--这是选择公司-->
                            <el-form-item
                                    v-if="searchData.selected.company"
                                    >
                                <el-select
                                        style="margin-top: 1px;"
                                        v-model="searchDate.slsect_company"
                                        size="small"
                                        clearable
                                        @visible-change="visChange"
                                        @change="itemSelect1"
                                        placeholder="公司名称(可搜索)"
                                        filterable
                                        class="smSreen">
                                    <el-option
                                            v-for="item in companyList"
                                            :key="item.cId"
                                            :label="item.name"
                                            :value="item.cId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <!--这是选择订单状态-->
                            <el-form-item
                                    v-if="searchData.selected.order"
                                    >
                                <el-select
                                        v-model="searchDate.slsect_order"
                                        placeholder="订单状态"
                                        style="margin-top: 1px;"
                                        size="small"
                                        @visible-change="visChange1"
                                        @change="itemSelect2"
                                        filterable
                                        class="smSreen">
                                    <el-option
                                            v-for="item in orderList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!--这是日期选择-->
                            <el-form-item
                                v-if="searchData.selected.date">
                               <!-- <el-date-picker
                                        style="margin-top: 5px;"
                                        v-model="valueTime"
                                        size="small"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>-->
                                <el-date-picker
                                        style="margin-top: 1px;width:170px;"
                                        v-model="searchDate.valueMonth1"
                                        :placeholder="searchData.selected.month1"
                                        size="small"
                                        value-format="yyyy-MM"
                                        @change="timeChange1"
                                        type="month">
                                </el-date-picker>
                                —
                                <el-date-picker
                                        style="margin-top: 1px;width:170px;"
                                        v-model="searchDate.valueMonth2"
                                        @change="timeChange2"
                                        :placeholder="searchData.selected.month2"
                                        size="small"
                                        value-format="yyyy-MM"
                                        type="month">
                                </el-date-picker>
                            </el-form-item>
                            <!--这是日期 日月选择(有本周本月 上月 最近半年一年的)-->
                            <el-form-item
                                    v-if="searchData.selected.dateDay">
                                 <el-date-picker
                                         style="margin-top: 5px;"
                                         v-model="searchDate.valueTime"
                                         size="small"
                                         unlink-panels
                                         @change="eventClick('otherDate')"
                                         type="daterange"
                                         range-separator="至"
                                         start-placeholder="开始时间"
                                         end-placeholder="结束时间"
                                         :picker-options="pickerOptions">
                                 </el-date-picker>
                            </el-form-item>
                            <!--这是日期 日月选择(正常的)-->
                            <el-form-item
                                    v-if="searchData.selected.normalDate">
                                <el-date-picker
                                        style="margin-top: 5px;"
                                        v-model="searchDate.valueTimeNormal"
                                        size="small"
                                        unlink-panels
                                        @change="eventClick('normalDate')"
                                        type="daterange"
                                        range-separator="至"
                                        :start-placeholder="searchData.selected.holder1"
                                        :end-placeholder="searchData.selected.holder2">
                                </el-date-picker>
                            </el-form-item>
                            <!--这是输入框搜索-->
                            <el-form-item
                                    v-if="searchData.selected.balanceDetail">
                                <el-input
                                    placeholder="收款人姓名、身份证或手机号"
                                    v-model="searchDate.balanceDetail"
                                    style="margin-top: 1px;"
                                    @keydown.native.enter="eventClick('search')"
                                    size="small"></el-input>
                            </el-form-item>
                            <!--按钮部分-->
                            <el-form-item>
                                <el-button
                                        type="primary"
                                        size="small"
                                        @click="eventClick('search')"
                                        plain>查询</el-button>
                            </el-form-item>
                            <!---->
                            <el-form-item
                                    v-if="searchData.selected.updateForm"
                                    style="float: right;">
                                <el-button
                                        icon="el-icon-upload2"
                                        type="warning"
                                        size="small"
                                        plain>上传结算表单</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-col>
            </el-row>



        </div>
    </section>
</template>

<script>
    import {
        findCompanyList
    } from '../api/api'
    import util from '../utils/util';
    export default {
        name: "search",
        props:{
            searchData:{
                type:Object,
                default:function () {
                    return {
                        selected:{
                            holder1:'请选择开始时间',
                            holder2:'请选择结束时间'
                        }
                    }
                }
            },
            defaultCompany:{
                type:String,
                default:function(){
                    return '';
                }
            }
        },
        data(){
            return{
                pickerOptions: {
                    shortcuts: [
                        {
                        text: '本月',
                        onClick(picker) {
                            /*const end = new Date();
                            const start = new Date();
                            start.setTime(start.getMonth() - 3600 * 1000 * 24 * 30);*/
                            const arr = util.getPreviousNowMonth()
                            console.log([arr[0],arr[1]])
                            picker.$emit('pick', [arr[0],arr[1]]);
                        }
                        },
                        {
                        text: '上月',
                        onClick(picker) {
                            const arr = util.getPreviousMonth();
                            picker.$emit('pick', arr);
                        }
                        },
                        {
                        text: '最近半年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
                            picker.$emit('pick', [start, end]);
                        }
                        },
                        {
                        text: '最近一年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12);
                            console.log([start, end])
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

                //搜索对象
                searchDate:{
                    slsect_company:this.searchData.selected.defaultCompany?JSON.parse(sessionStorage.getItem('companyList'))[0].cId:'',//选择公司
                    slsect_order:0,//订单状态
                    valueMonth1:'',//开始月份
                    valueMonth2:'',//结束月份
                    valueTime:'',//年月日
                    valueTimeNormal:'',//常规日期范围选择
                    balanceDetail:''
                },

                /*存储器*/
                companyList:[],
                orderList:[
                    {
                        name:'全部',
                        value:0
                    },
                    {
                        name:'待结算',
                        value:1
                    },
                    {
                        name:'结算中',
                        value:2
                    },
                    {
                        name:'已结算',
                        value:3
                    },
                   /* {
                        name:'应开票',
                        value:4
                    }*/
                ]
            }
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
        },
        computed:{

        },
        methods:{
            /*
             * 选择不同公司
             * */
            visChange(status,types){
                if(status){
                    this.searchDate.slsect_company = '';
                }
            },
            //不同订单
            visChange1(status,types){
                if(status){
                    this.searchDate.slsect_order = '';
                }
            },
            //选择公司
            itemSelect1:function (data) {
                this.searchDate.slsect_company = data;
                this.eventClick('ordersCompanyChange');
            },
            //选择订单
            itemSelect2:function (data) {

                this.searchDate.slsect_order = data;
                this.eventClick('ordersStatusChange');
            },
            //时间改变
            timeChange1(a){
                this.searchDate.valueMonth1 = a;
                this.eventClick('timeChange');
            },
            //时间改变
            timeChange2(a){
                this.searchDate.valueMonth2 = a;
                this.eventClick('timeChange');
            },
            eventClick(type){
                switch (type){
                    //正常时间选择的时候
                    case 'normalDate':
                        this.$emit('normalDate',this.searchDate.valueTimeNormal);
                        return;
                    case 'otherDate':
                        this.$emit('otherDate',this.searchDate);
                        return;
                    case 'search':
                        this.$emit('search',this.searchDate);
                        return;
                    case 'timeChange':
                        this.$emit('timeChange',this.searchDate);
                        return;
                    //选择不同公司
                    case 'ordersCompanyChange':
                        this.$emit('ordersCompanyChange',this.searchDate.slsect_company);
                        return;
                    //订单状态
                    case 'ordersStatusChange':
                        this.$emit('ordersStatusChange',this.searchDate.slsect_order);
                        return;
                    default:
                        return
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    /*此组件为 搜索公共组件*/

    section{
        width: 100%;
        float: left;
    }
    .box-tools{
        width: 100%;
        height: 43px;
        line-height: 43px;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        /*background: #f4f4f4;*/
        background: #fff;
        /*padding: 0 15px;*/
        box-sizing: border-box;
        display: flex;
    }
    /*媒体查询*/
    @media screen and (max-width: 1320px) {
        .smSreen{
            width: 150px;
        }
    }
</style>
