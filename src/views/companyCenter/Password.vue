<template>
    <section>
        <el-row>
            <el-col :span="9" style="min-width: 400px;">
                <el-form
                        v-if="!changePassword"
                        label-fontWeight="100"
                        label-position="right"
                        style="padding-top: 15px;box-sizing: border-box;"
                        :inline="true"
                        :rules="rules"
                        :model="passwords"
                        ref="form">
                    <el-form-item
                            label="手机号码：">
                        <span>{{phone}}</span>
                    </el-form-item>

                    <el-form-item
                            prop="code"
                            label="验证码：">
                        <el-input size="small"
                                  placeholder="请输入验证码"
                                  v-model="passwords.code"
                                  @keydown.native.enter.prevent="getCode" >
                            <el-button slot="append" size="small" style="float: right;" v-on:click.native.prevent="getCode">获取验证码</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item style="display: block;">
                        <el-button size="small" type="primary" @click="voidOldPhone1">确定</el-button>
                    </el-form-item>
                </el-form>
                <passwordOne
                        v-if="changePassword"
                        v-on:closePassword="closePassword"
                        :codes="codes"></passwordOne>
            </el-col>
            <el-col :span="12"></el-col>
        </el-row>

    </section>
</template>

<script>

    import passwordOne from './passwordOne';
    import {
        getNowPhone,//获取手机号
        sendCheckPwdCodes,//获取验证码
        checkPwdCodeSafe,//验证验证码
    } from '../../api/api';

    let isCode = false;//第一次帐户验证码
    let validCode=(rule, value,callback)=>{
        if (!value){
            isCode = false;
            callback(new Error('请输入验证码'))
        }else {
            isCode = true;
            callback()
        }
    };
    export default {
        name: "password",
        data(){
            return{
                //form规则
                rules: {
                    code: [
                        { required: true, validator: validCode, trigger: 'blur' },
                    ],
                },
                labelPosition:'center',
                changePassword:false,
                passwords:{
                    companyName:'',
                    address:'',
                    code:''
                },
                codes:'',//回传参数
                phone:'',//电话
            }
        },
        mounted(){
            this.queryPhone()
        },
        components:{
            passwordOne
        },
        methods:{
            //获取手机号
            queryPhone(){
                getNowPhone().then(res =>{
                    if(res.status === 200){
                        this.phone = res.data.cuUserPhone;
                    }
                },error=>{
                    this.$message({
                        type:'error',
                        message:'出错了，请稍后再试'
                    })
                })
            },
            //验证验证码
            voidOldPhone1(){
                if(this.passwords.code){
                    let para = {
                        code:this.passwords.code//验证码
                    };
                    checkPwdCodeSafe(para).then(res =>{
                        if(res.status === 200&& !!res.code){
                            this.changePassword=true;
                            this.codes = res.code;
                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            })
                        }
                    });
                }else{
                    this.$refs['form'].validateField('code');
                }


            },
            //关闭改变密码
            closePassword(){
                this.changePassword =false;
                this.passwords.code = '';
            },
            //获取短信验证码
            getCode(e) {
                if (this.pass) {
                    return false
                }
                if (e.target.innerText === '获取验证码') {
                    this.pass = true;
                    /*let para = {
                        account: 'yuanlinyan'
                    };*/
                    sendCheckPwdCodes().then((res) => {
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
                    });
                } else {
                    return false
                }

            },
        }
    }
</script>

<style scoped lang="scss">
    section{
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
