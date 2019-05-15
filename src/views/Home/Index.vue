<template>
    <div class="box">
        <div class="Notice" v-if="noticeDatas.length > 0">
            <div class="iconfont icon-gonggao notice_bg"></div>
            <div class="notice_bd">
                <ul class="scrollTop" id="scrollTop">
                    <li class="item_li"  v-for="(val,index) in noticeDatas" :key="index"  v-text="val"></li>
                </ul>
            </div>
        </div>
        <messageList></messageList>
        <div class="dataAll">
            <div class="pannel_head">
                <div class="pannel-title">数据统计</div>
            </div>
            <el-row style="width: 100%;height: 100%;" class="row_pan">
                <el-col :span="6" >
                    <div class="items_data">
                        <i class="iconfont icon-leijishouyi iconImg"></i>
                        <div class="list_money">
                            <div class="item_title">累计金额（元）</div>
                            <h5>{{totalSum}}</h5>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" >
                    <div class="items_data">
                        <i class="iconfont icon-zhinengyouhua iconImg"></i>
                        <div class="list_money">
                            <div class="item_title">优化效果（元）</div>
                            <h5>{{optimizeSum}}</h5>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" >
                    <div class="items_data">
                        <i class="iconfont icon-renshutongji iconImg"></i>
                        <div class="list_money">
                            <div class="item_title">累计人数（人）</div>
                            <h5>{{totalPersonNum}}</h5>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" >
                    <div class="items_data" style="border-right: none;">
                        <i class="iconfont icon-pinci iconImg"></i>
                        <div class="list_money">
                            <div class="item_title">累计次数（次）</div>
                            <h5>{{totalOrderNum}}</h5>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <LineCharts></LineCharts>
    </div>
</template>

<script>
    const messageList = r => require.ensure([], () => r(require('./messageList')), 'messageList');//消息模块
    const LineCharts = r => require.ensure([], () => r(require('./LineCharts')), 'LineCharts');//折线图
    import {
        getNoCheckCount,//获取未验收结算单的数量
        getStatisticsCount,//首页数据统计数据
        findAnnouncement
    } from '../../api/api'
    export default {
        name: "index",
        data(){
            return{
                optimizeSum:0,
                totalOrderNum:0,
                totalPersonNum:0,
                totalSum:0,
                timer:null,
                scrollIndex:0,
                timeOut:null,
                noticeDatas:[
                ]
            }
        },
        components:{
            messageList,
            LineCharts
        },
        mounted(){
            this.findGetNoCheckCount();
            this.findGetStatisticsCount();
            this.getFindAnnouncement();
        },
        methods:{
            scrollTop(){
                clearInterval(this.timer);
               // let ul=$(".notice_bd>.scrollTop");
               //  let ul = document.getElementById('scrollTop')
                let ul=$("#scrollTop");
                let li = document.getElementsByClassName('item_li');
                //let li=ul.children("li");
                let h=50;
                let index= 0;
                ul.css("height",h*li.length*2);
                let that = this;
                this.timer=setInterval(function(){
                    if(that.scrollIndex>=that.noticeDatas.length-1){
                        // ul.style.top = 0;
                        ul.css({top:0});
                        that.scrollIndex=0;
                        // ul.style.top = -that.scrollIndex*h+'px'
                       ul.animate({top:-that.scrollIndex*h+'px'},200);
                    }else{
                        that.scrollIndex++;
                      ul.animate({top:-that.scrollIndex*h+'px'},200);
                      //   ul.style.top = -that.scrollIndex*h+'px'
                    }
                },3000);
            },
            //请求未签收结果呈现的数量
            findGetNoCheckCount(){
                getNoCheckCount().then(res =>{
                    if(res&&res.data>0){
                        let str = '您有'+res.data+'条待验收成果需要确认，是否现在确认?';
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

                      /*  this.$alert('您有一条待验收成果需要确认，是否现在确认?', {
                            confirmButtonText: '是',
                            center: true,
                            callback: action => {
                                this.$router.push({
                                    name:'任务管理',
                                    path: '/home/task'
                                })
                            }
                        });*/
                    }
                },error =>{

                })
            },
            //获取首页数据统计
            findGetStatisticsCount(){
                getStatisticsCount().then(res =>{
                    if(res.status === 200){
                        this.optimizeSum = res.optimizeSum;
                        this.totalOrderNum = res.totalOrderNum;
                        this.totalPersonNum = res.totalPersonNum;
                        this.totalSum = res.totalSum;
                    }
                })
            },
            //获取公告信息
            getFindAnnouncement(){
                findAnnouncement().then(res =>{
                    if(res){
                        this.noticeDatas = res;
                        let that = this;
                        that.timeOut = setTimeout(function(){
                            that.scrollTop();
                        },200);
                        that.timeOut = null;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .Notice{
        overflow: hidden;
        width: 100%;
        float: left;
        height: 50px;
        margin-bottom: 5px;
        background-color: #fff;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), 0 2px 6px 0 rgba(0, 0, 0, 0.045);
        box-sizing: border-box;
        .notice_bg{
            width: 65px;
            float: left;
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            color: #ff2612;
        }
        .notice_bd{
            height: 50px;
            max-width: 1000px;
            overflow: hidden;
            position: relative;
            ul{
                padding-left: 0;
                margin: 0;
                font-size: 14px;
                line-height: 50px;
                width:100%;
                position:absolute;
                left:0;
                top:0;
                li{
                    height: 50px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    /*@keyframes scrollTop {
        from{
            transform: translateY(0);
        }
        to{
            transform: translateY(-50px);
        }
    }
    .scrollTop{
        animation-duration: 3s;
        animation-fill-mode: both;
        animation-name: scrollTop;
        animation-iteration-count:infinite

    }*/
    .dataAll{
        /*height: 170px;*/
        width: 100%;
        float: left;
        /*padding: 0 15px;*/
        box-sizing: border-box;
        margin-bottom: 10px;
        background-color: #fff;
        /*border: 1px solid transparent;
        border-radius: 4px;*/
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
        box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
    }
    .iconImg{
        font-size: 30px;
        color: #cac2c2;
        float: left;
        padding: 20px;
    }
    .items_data{
       /* flex: 1;*/
        border-right: 1px solid #d4d4d4;
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        h5{
            margin: 0;
            font-size: 18px;
            font-weight: 200;
            line-height: 38px;
            color: #f60;
            margin-right: 20px;
        }
    }

    .list_money{
        float: left;
        text-align: center;
        padding: 10px;
    }

    .row_pan{
        box-sizing: border-box;
        width: 970px;
        margin: 0 auto;
        /*overflow: hidden;
        white-space: normal;*/
    }
    /*消息样式*/
    .pannel_head{
        padding: 12px 48px 12px 20px;
        border-bottom: 1px solid transparent;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        .pannel-title{
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }
    }
    .item_title{
        font-size: 18px;
        line-height: 20px;
        margin-bottom: 5px;
    }
    @media only screen and (min-width: 1170px){

        .row_pan>.el-col{
            height: 100px;
        }
    }
    @media only screen and (max-width: 1170px) and (min-width: 768px){
         .row_pan>[class*="el-col"].el-col-6 {
             width: 50% !important;
         }
        .items_data{
            padding: 0;
            margin: 0 auto;
            border-right: none;
        }
        .row_pan>.el-col{
            height: 90px;
        }
    }
    @media only screen and (max-width: 810px){
        .row_pan>[class*="el-col"].el-col-6 {
            width: 100% !important;
        }
        .items_data{
            padding: 0;
            margin: 0 auto;
            border-right: none;
            justify-content: space-around;
        }
        .row_pan>.el-col{
            height: 90px;
        }
    }
</style>
