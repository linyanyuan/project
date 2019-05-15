<template>
    <div class="box">
        <div class="totle_all">
            <div class="totle_item">
                <span>关联结算单数：</span>
                <strong>{{num}}</strong>
            </div>
            <div class="totle_item">
                <span>开票金额：</span>
                <strong>{{moneys}}元</strong>
            </div>
        </div>
        <div class="tableList">
            <tableList
                    :loading="listLoading"
                    :columns="columns"
                    :tableData="tableData"
                    v-on:balanceRoute="balanceRoute"
                    :data-source="users"></tableList>
        </div>
    </div>
</template>

<script>
    const tableList = r => require.ensure([], () => r(require('../../components/tableList.vue')), 'tableList');//列表组件
    import {findByInvoiceId} from '../../api/api'
    export default {
        name: "invoice-details",
        data(){
            return{
                tableData:{
                },
                /*存储器*/
                columns: [

                    {
                        text: '结算单号',
                        dataIndex: 'coBusNo',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '上传日期',
                        dataIndex: 'createTime',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '结算日期',
                        dataIndex: 'grantTime',
                        type:'text',
                        width:'150'
                    },
                    {
                        text: '转账金额（元）',
                        dataIndex: 'coTransAccount',
                        type:'text',
                        width:'120'
                    },
                    {
                        text: '发票抬头 ',
                        dataIndex: 'coInvoiceTitle',
                        type:'text',
                        width:'170'
                    },
                    {
                        text: '结算月',
                        dataIndex: 'coShouldGrantDate',
                        type:'text',
                        width:'150'
                    }
                ],
                users: [],
                status:1,
                listLoading:false,
                ciiId:'',//物流单号
                num:0,//关联结算单 单数
                moneys:0,//开票金额
            }
        },
        components:{
            tableList
        },
        mounted(){
            //第一次进入结算系统 保存订单号
          /*  let ciiId =  sessionStorage.getItem('ciiId');
            if(!ciiId){
                //第一次进入 ciiId
                sessionStorage.setItem('ciiId', this.$route.params.numbers.ciiId);
                this.ciiId = this.$route.params.numbers.ciiId;
            }else{
                //ciiId  判断是否为刷新
                if(this.$route.params&&!this.$route.params.numbers){
                    //$route不存在 说明为刷新
                    this.ciiId = ciiId;
                }else{
                    //不是刷新  是父进来的
                    this.ciiId = this.$route.params.numbers.ciiId;
                    sessionStorage.setItem('ciiId', this.$route.params.numbers.ciiId);
                }
            }*/
            console.log(this.$route.params.numbers);
            let ciiId =  JSON.parse(sessionStorage.getItem('ciiId'));
            console.log(ciiId);
            if(!ciiId){
                //第一次进入 关联结算单列表
                sessionStorage.setItem('ciiId', JSON.stringify(this.$route.params.numbers));
                this.ciiId = this.$route.params.numbers.ciiId;
                this.moneys = this.$route.params.numbers.ciiPrice
            }else{
                //ciiId  判断是否为刷新
                if(this.$route.params&&!this.$route.params.numbers){
                    //$route不存在 说明为刷新
                    this.ciiId = ciiId.ciiId;
                    this.moneys = ciiId.ciiPrice
                }else{
                    //不是刷新  是父进来的
                    this.ciiId = this.$route.params.numbers.ciiId;
                    this.moneys = this.$route.params.numbers.ciiPrice;
                    sessionStorage.setItem('ciiId', JSON.stringify(this.$route.params.numbers));
                }
            }
            this.getUsers();
        },
        methods:{
            //获取用户列表
            getUsers() {
                let para = {
                    ciiId:this.ciiId//发票单号
                };
                this.listLoading = true;
                findByInvoiceId(para).then((res) => {
                    if(res.status === 200){
                        this.users = res.data?res.data:[];
                        this.num = res.data.length;
                        this.listLoading = false;
                    }

                },error=>{
                    this.listLoading = false;
                });
            },
            balanceRoute(row){
                console.log(row)
                let coBusNo = row.coBusNo;//结算单号
                let status;
                if(row.coPayStatus === 5){
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
                        //status:status
                    }
                })
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
</style>
