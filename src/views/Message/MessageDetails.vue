<template>
    <div class="container">
        <div class="headers">
            <h2>{{messagedatas.title}}</h2>
            <div class="time_title">{{messagedatas.createDate}}</div>
        </div>
        <div class="box_body">
            <p>尊敬的用户：</p>
            <div class="content">
                {{messagedatas.content}}
            </div>
        </div>
    </div>
</template>

<script>
    import {
        readMessage,
        findNoRead
    } from '../../api/api';
    import { mapActions} from "vuex";
    export default {
        name: "message-details",
        data(){
            return{
                messagedatas:{}
            }
        },
        mounted(){
           // console.log(this.$route)
            //保存传过来的信息
            let message =  JSON.parse(sessionStorage.getItem('message'));
            if(!message){
                //第一次 点击主页消息进入
                sessionStorage.setItem('message', JSON.stringify(this.$route.params.message));
                this.messagedatas = this.$route.params.message;
            }else{
                if(this.$route.params&&!this.$route.params.message){
                    //$route不存在 说明为刷新
                    this.messagedatas = message;
                }else{
                    //不是刷新  是父进来的
                    this.messagedatas = this.$route.params.message;
                    sessionStorage.setItem('message', JSON.stringify(this.$route.params.message));
                }
            }
            this.messageRead();
        },
        methods:{
            ...mapActions(["upDataTotle"]),
            //标记已读
            messageRead(){
                if(this.messagedatas.readStatus ===  0){
                    //状态为0时  说明此消息未读
                    let para = {
                        ids:this.messagedatas.id
                    };
                    readMessage(para).then(res =>{
                        if(res.code === '0'){
                            findNoRead().then((res) => {
                                if(res.data){
                                    this.upDataTotle(Number(res.data))
                                }else{
                                    this.upDataTotle(0)
                                }
                            },error =>{

                            });
                        }
                    })
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .container{
        width: 900px;
        margin: 0 auto;
        background-color: #fff;
        height: 95%;
        padding: 20px 10px;
        box-sizing: border-box;
    }
    .headers{
        text-align: center;
        padding: 10px 0px;
        margin: 0 70px;
        border-bottom: 1px solid #bebaba;
        box-sizing: border-box;
        h2{
            padding: 10px 0;
        }
    }
    .box_body{
        text-indent: 70px;
        p{
            font-size: 17px;
        }
        .content{
            text-indent: 70px;
            padding: 0 70px;
            box-sizing: border-box;
            line-height: 25px;
        }
    }
</style>
