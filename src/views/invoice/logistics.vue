<template>
    <div class="box">
        <div class="tableList" style="margin-bottom: 10px;">
            <div class="totle_all1">
                <div class="title_mes">邮寄信息</div>
                <div class="invoive_bd">
                    <p>收件地址：</p>
                    <div class="invoice_fd">{{getPeople}}</div>
                </div>
                <div class="invoive_bd">
                    <p>发件地址：</p>
                    <div class="invoice_fd">{{sendPeople}}</div>
                </div>
            </div>

        </div>
        <div class="tableList">
            <div class="totle_all">
                <div class="totle_item">
                    <span>物流公司：</span>
                    <strong v-text="arrList.logistics"></strong>
                </div>
                <div class="totle_item">
                    <span>客服电话：</span>
                    <strong v-text="arrList.logisticsPhone"></strong>
                </div>
                <div class="totle_item">
                    <span>货运单号：</span>
                    <strong v-text="arrList.logisticsNum"></strong>
                </div>
            </div>
            <h3>已签收</h3>
            <div class="table_body">
                <ul>
                    <li
                            v-for="(val,index) in logisticsData"
                            :class="{'first':index ===0,'latest':index ===logisticsData.length-1}">
                        <span class="date" v-text="val.date" :class="{'hidden':!val.week}"></span>
                        <span class="week" v-text="val.week" :class="{'hidden':!val.week}"></span>
                        <span class="time" v-text="val.times"></span>
                        <span class="txt" v-text="val.context"></span>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import {kuaidiCon} from '../../api/api';
    export default {
        name: "logistics",
        data(){
            return{
                arrList:{},
                logisticsData:[],
                invoiceDatas:{},//物流信息数据
                getPeople:'',//收件人信息
                sendPeople:'',//发件人信息
            }
        },
        mounted(){
            //保存物流信息到cookie
            let invoiceDatas =  JSON.parse(sessionStorage.getItem('invoiceDatas'));
            if(!invoiceDatas){
                //第一次 进入
                sessionStorage.setItem('invoiceDatas', JSON.stringify(this.$route.params.invoice));
                this.invoiceDatas = this.$route.params.invoice;
            }else{
                if(this.$route.params&&!this.$route.params.invoice){
                    //$route不存在 说明为刷新
                    this.invoiceDatas = invoiceDatas;
                }else{
                    //不是刷新  是父进来的
                    this.invoiceDatas = this.$route.params.invoice;
                    sessionStorage.setItem('invoiceDatas', JSON.stringify(this.$route.params.invoice));
                }
            }
            //收件人信息
            this.getPeople = this.invoiceDatas.ciiContacts+' ， '+this.invoiceDatas.ciiContactsPhone+' ， '+
                this.invoiceDatas.ciiMailAddress+' ， '+this.invoiceDatas.ciiMailZipcode;
            this.sendPeople = this.invoiceDatas.ciiOriginator+' ， '+this.invoiceDatas.ciiOriginatorPhone+' ， '+
                this.invoiceDatas.ciiConsigneeAddress+' ， '+this.invoiceDatas.ciiConsigneeZipcode;
            this.queryKuaidiCon();

        },
        methods:{
            //获取物流详情
            queryKuaidiCon(){
                let para = {
                   number:this.invoiceDatas.ciiExpressNumber
                    //number:this.$route.params.numbers
                };
                kuaidiCon(para).then((res) => {
                    if(res.status === 200){
                        let temp = res.logisticsData;
                        this.arrList = res;
                        let date1,date2,week,l = temp.length;
                        let dateDay1,dateDay2,num = 0;
                        for(let i = 1;i<l;i++){
                            date1 = temp[i].ftime;//这是i+1日期
                            dateDay1 = date1.split(" ")[0];
                            num  = i-1;
                            date2 = temp[num].ftime;//这是i-1的日期
                            dateDay2 = date2.split(" ")[0];
                            temp[i].date = dateDay1;
                            temp[i].times =date1.split(" ")[1];
                             if(dateDay1 !== dateDay2){
                                //需要加上周
                                 let dateArray = dateDay1.split("-");
                                 let dates = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
                                 week = "周"+"日一二三四五六 ".charAt(dates.getDay());
                                 temp[i].week =week;
                            }
                        }
                        //需要结束周
                        let dateArray = temp[0].ftime.split(" ")[0].split("-");
                        let dates = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
                        week = "周"+"日一二三四五六 ".charAt(dates.getDay());
                        temp[0].week =week;
                        temp[0].date = temp[0].ftime.split(" ")[0];
                        temp[0].times =temp[0].ftime.split(" ")[1];
                        this.logisticsData = temp;
                    }
                },err =>{

                });
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
        /* background: #f4f4f4;*/
        background: #fff;
        box-sizing: border-box;
        h3{
            font-weight: 400;
            font-family: "Microsoft Yahei";
            font-size: 16px;
            background: #f3f3f3;
            margin: 0;
            padding: 14px 0 14px 50px;
            float: left;
            width: 100%;
            box-sizing: border-box;
            border-bottom: 1px solid #e7e7e7;
        }
    }
    .totle_all1{
        float: left;
        width: 100%;
        box-sizing: border-box;
        .title_mes{
            float: left;
            height: 40px;
            line-height: 40px;
            width: 100%;
            padding: 0 30px;
            box-sizing: border-box;
            border-bottom: 1px solid #e3e3e3;
        }
        .invoive_bd{
            float: left;
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px 10px 50px;
        }

    }
    .invoice_fd{
        float: left;
        font-size: 13px;
    }
    .totle_all{
        float: left;
        width: 100%;
        box-sizing: border-box;
        padding: 0 50px;

        .totle_item{
            float: left;
            height: 40px;
            line-height: 40px;
            padding-right: 20px;
            margin-right: 20px;
            span{
                font-size: 14px;
                font-weight: normal;
            }
            strong{
                color:#000;
            }
        }
    }
    .table_body li.first{
        padding-top: 0;
    }
    .table_body .first .time, .table_body .first .txt{
        font-weight: bold;
    }
    .table_body li.latest{
        border: none;
    }
    .table_body li .hidden{
        visibility: hidden;
    }
    .table_body .first:before {
        background-color: #fe4300;
        border-color: #f8e9e4;
    }
    .table_body li:before {
        content: '';
        border: 3px solid #f3f3f3;
        background-color: #d9d9d9;
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 5px;
        margin-left: -6px;
        margin-right: 10px;
    }
    .table_body{
        float: left;
        width: 100%;
        box-sizing: border-box;
        padding: 30px 30px 0 30px;
        ul{
            margin: 0;
            padding: 0;
            margin-left: 12px;
            margin-top: -9px;
            padding-left: 10px;
            list-style: none;
            font-size: 12px;
        }
        li{

            margin-bottom: -2px;
            height: auto;
            min-height: 30px;
            border-left: 1px solid #d9d9d9;
            .date{
                width: 78px;
                display: inline-block;
                font-weight: 700;
                margin-right: 8px;
                font-family: Arial;
            }
            .week{
                width: 32px;
                font-weight: 700;
                margin-right: 8px;
                font-family: Arial;
                display: inline-block;
            }
            .time{
                display: inline-block;
                width: 48px;
                margin-right: 28px;
                margin-left: 5px;

            }
            .txt{
                display: inline-block;
                width: 635px;
                vertical-align: text-top;
                line-height: 1.3em;
            }
        }
    }
</style>
