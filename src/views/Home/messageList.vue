<template>
    <section>
        <div class="mes_box">
            <div class="pannel_head">
                <div class="pannel-title">消息通知</div>
            </div>
            <div class="pannel_body">
                <div v-bar style="height: 100%">
                    <div>
                        <span class="noDatas" v-if="messageDatas.length === 0">暂无消息</span>
                        <ul class="timeline timeline-tag-left no-margin">
                            <li
                                v-for="(item,index) in messageDatas"
                                @click="handleClick(item)"
                                :key="inedx">
                                <div class="list_item">
                                    <i class="iconfont icon-noread" :class="item.readStatus === 0? 'icon_mes':'icon_mes1'"></i>
                                    <span class="timeline-text">
                                        {{item.title}}
                                    </span>
                                    <span class="time-tag">{{item.createDate}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    </section>
</template>

<script>
    import {
        findMessagePage
    } from '../../api/api';
    export default {
        name: "message-list",
        data(){
            return{
                total:'',//消息总条数
                messageDatas:[]
            }
        },
        mounted(){
            this.queryMessageList();
        },
        methods:{
            //获取消息列表
            queryMessageList(){
                let para = {
                    current_page:1,
                    page_size:6,
                    readStatus:null
                };
                findMessagePage(para).then((res) => {
                    this.messageDatas = res.list;
                    this.total = res.list.length;
                }/*,error =>{
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                }*/);
            },
            //进入消息详情
            handleClick(item){
                this.$router.push({
                    name:"消息详情",
                    path:'/home/messageIndex/messageDetails',
                    params:{
                        message:item
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    section{
        width: 100%;
        float: left;
    }

    .mes_box{
        height: 250px;
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin-bottom: 10px;
        background-color: #fff;
       /* border: 1px solid transparent;
        border-radius: 4px;*/
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
        box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
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
    .pannel_body{
        height: 400px;
        overflow: auto;
        ul{
            margin: 0;
           /* padding-left: 160px;*/
            padding-left: 190px;
        }
    }
    .noDatas{
        position: absolute;
        left: 50%;
        top: 40%;
        font-size: 20px;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        color: #909399;
    }
    .timeline>li {
        position: relative;
        list-style: none;
        cursor: pointer;
    }
    .timeline>li:before {
        top: 12px;
        left: -16px;
        z-index: 3;
        width: 7px;
        height: 7px;
        background-color: #cbd0db;
        border: 1px solid #cbd0db;
    }
    .timeline>li:before, .timeline>li>a:after, .timeline>li>div:after {
        position: absolute;
        left: -18px;
        top: 9px;
        display: block;
        width: 9px;
        height: 9px;
        content: ' ';
        border-radius: 50%;
    }
    .timeline>li>a:after, .timeline>li>div:after {
        top: 11px;
        left: -17px;
        z-index: 3;
        width: 9px;
        height: 9px;
        background-color: #006af1;
        border-radius: 50%;
        opacity: 0;
    }
    .time-tag {
        /*position: absolute;
        top: 5px;
        left: -110px;*/
        float: right;
        margin-right: 200px;
        font-size: 14px;
        line-height: 20px;
    }
    .list_item{
        padding: 6px 0;
        .icon_mes{
            position: absolute;
            top: 5px;
            left: -80px;
            font-size: 18px;
            line-height: 20px;
            color: #dcdc2e;
            font-weight: 700;
        }
        .icon_mes1{
            position: absolute;
            top: 5px;
            left: -80px;
            font-size: 18px;
            line-height: 20px;
            color: #cbd0db;
            font-weight: 700;
        }
    }
    .timeline-text {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
    }
    .timeline>li+li:after {
        position: absolute;
        top: -12px;
        bottom: 20px;
        left: -13px;
        z-index: 1;
        display: block;
        content: ' ';
       /* border-left: 1px solid #eee;*/
    }
    .vb > .vb-dragger {
        z-index: 5;
        width: 12px;
        right: 0;
    }
    .vb > .vb-dragger > .vb-dragger-styler {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: rotate3d(0,0,0,0);
        transform: rotate3d(0,0,0,0);
        -webkit-transition:
                background-color 100ms ease-out,
                margin 100ms ease-out,
                height 100ms ease-out;
        transition:
                background-color 100ms ease-out,
                margin 100ms ease-out,
                height 100ms ease-out;
        background-color: rgba(48, 121, 244,.1);
        margin: 5px 5px 5px 0;
        border-radius: 20px;
        height: calc(100% - 10px);
        display: block;
    }
    .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.3);
    }
    .vb > .vb-dragger:hover > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.5);
        margin: 0px;
        height: 100%;
    }
    .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.5);
        margin: 0px;
        height: 100%;
    }
    .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.5);
    }
</style>
