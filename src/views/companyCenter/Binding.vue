<template>
    <section>
        <el-row v-if="!changePhone">
            <el-col :span="24">
                <el-form
                        ref="form"
                        :inline="true">
                    <el-form-item
                        label="手机号码：">
                        <span>{{phone}}</span>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="changePhone = true">更换手机号</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="steps" v-if="changePhone">
            <el-steps
                    :space="400"
                    :active="active"
                    align-center
                    finish-status="success">
                <el-step title="身份验证"></el-step>
                <el-step title="绑定手机"></el-step>
                <el-step title="成功"></el-step>
            </el-steps>
        </div>
        <el-row v-if="changePhone&&active===0" style="margin: 20px;">

            <div class="phone_item">
                <el-form
                        label-width="90px"
                        label-position="right"
                        ref="form">
                    <el-form-item
                            label="手机号码：">
                        <span>{{phone}}</span>

                    </el-form-item>
                    <el-form-item
                        label="验证码：">
                        <el-input size="small"
                                  v-model="passwords.code"
                                  @keydown.native.enter.prevent="voidOldPhone"
                                  placeholder="请输入验证码">
                            <el-button slot="append" size="small" style="float: right;" v-on:click.native.prevent="getCode">获取验证码</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="voidOldPhone">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-row>
        <el-row v-if="changePhone&&active===1" style="margin: 20px;">
            <bindingOne :codes="codes" v-on:closePassword="closePassword"></bindingOne>
        </el-row>
        <el-row v-if="changePhone&&active===3" style="margin: 20px;">
            <div class="phone_item" style="text-align: center;">
                <el-button type="primary"  @click="bindSuccess">确定</el-button>
            </div>
        </el-row>
    </section>
</template>

<script>
    import {
        getNowPhone,//获取手机号
        sendUpdatePhoneCode,//获取验证码
        checkUpdatePhoneCode,//验证验证码
    } from '../../api/api';
    import bindingOne from './bindingOne'
    export default {
        name: "binding",
        data(){
            return{
                phone:'',//电话
                active: 0,//第几步骤
                changePhone:false,//是否更换手机号
                pass:false,
                timer:null,
                passwords:{
                    code:''
                },
                codes:''
            }
        },
        components:{
            bindingOne
        },
        mounted(){
            this.queryPhone()
        },
        methods:{
            //获取手机号
            queryPhone(){
                getNowPhone().then(res =>{
                    if(res.status === 200){
                        this.phone = res.data.cuUserPhone;
                    }
                })
            },
            //获取短信验证码
            getCode(e) {
                if (this.pass) {
                    return false
                }
                console.log(e)
                if (e.target.innerText === '获取验证码') {
                    this.pass = true;
                    sendUpdatePhoneCode().then((res) => {
                        if (res.code != 0) {
                            this.$message.error(res.message);
                            this.pass = false;
                            return false
                        }
                        this.$message({
                            message: '发送成功',
                            type: 'success'
                        });
                        let time = 60;
                        e.target.innerHTML = time + 's后重试';
                        let that = this;
                        this.timer = setInterval(() => {
                            time--;
                            e.target.innerHTML = e.target.innerHTML = time + 's后重试';
                            if (time === 0) {
                                clearInterval(that.timer);
                                e.target.innerHTML = '获取验证码';
                                that.pass = false;
                            }
                        }, 1000);
                    },error =>{
                        this.$message({
                            type:'error',
                            message:res.message
                        })
                    });
                } else {
                    return false
                }

            },
            //校验就旧手机号
            voidOldPhone(){
                if(!this.passwords.code){
                    this.$message({
                        type:'error',
                        message:'请输入验证码'
                    });
                    return
                }
                let para = {
                    code:this.passwords.code//验证码
                };
                checkUpdatePhoneCode(para).then(res =>{
                    if(res.status === 200&& !!res.code){
                        this.changePassword=true;
                        this.codes = res.code;
                        this.$message({
                            type:'success',
                            message:res.message
                        });
                        this.active++;
                        //this.active=3;
                    }else{
                        this.$message({
                            type:'error',
                            message:res.message
                        })
                    }
                });
            },
            //绑定成功
            bindSuccess(){
                this.queryPhone();
                this.changePhone=false;
                this.active=0;
            },
            //关闭改变绑定
            closePassword(){
                this.active =3;
            },
        }
    }
</script>

<style scoped lang="scss">
    section{
        padding: 0 20px;
        box-sizing: border-box;
    }
    .steps{
        margin: 20px;
    }
    .phone_item{
        max-width:450px;
        margin: 0 auto;
    }
</style>
