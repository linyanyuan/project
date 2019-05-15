<template>
    <div class="phone_item">
        <el-form
                label-width="150px"
                label-position="right"
                :model="passwords"
                :rules="rules"
                ref="form">
            <el-form-item
                    prop="phone"
                    label="请输入新手机号：">
                <el-input size="small" v-model="passwords.phone" placeholder="请输入绑定手机号码"></el-input>
            </el-form-item>

            <el-form-item
                    prop="code"
                    label="验证码：">
                <el-input size="small"
                          v-model="passwords.code"
                          @keydown.native.enter.prevent="voidOldPhone1"
                          placeholder="请输入验证码">
                    <el-button slot="append" size="small" style="float: right;" v-on:click.native.prevent="getCode">获取验证码</el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="voidOldPhone1">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import util from '../../utils/util';
    import {
        sendUpdateNewPhoneCode,//企业换绑手机号获取验证码(新手机号)
        bindingPhone,//企业换绑手机号
    } from '../../api/api';
    let isPhone = false;//手机号
    let validPhone=(rule, value,callback)=>{
        if (!value){
            isPhone = false;
            callback(new Error('手机号码必填'))
        }else  if (!util.isvalidPhone(value)){
            isPhone = false;
            callback(new Error('请输入正确的11位手机号码'))
        }else {
            isPhone = true;
            callback()
        }
    };
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
        name: "binding-one",
        props:{
            codes:{
                type:String,
                default:function(){
                    return ''
                }
            }
        },
        data(){
            return{
                /*规则*/
                rules:{
                    phone: [
                        {  required: true,trigger: 'blur', validator: validPhone }//这里需要用到全局变量
                    ],
                    code: [
                        { required: true, validator: validCode, trigger: 'blur' },
                    ],

                },
                passwords:{
                    phone:'',
                    code:'',//验证码
                },
            }
        },
        methods:{
            //获取新手机号的验证码
            //获取短信验证码
            getCode(e) {
                if (this.pass) {
                    return false
                }
                if (e.target.innerText === '获取验证码') {
                    this.pass = true;
                    let para = {
                        phone:this.passwords.phone,
                        certificate:this.codes
                    };
                    sendUpdateNewPhoneCode(para).then((res) => {
                        if (res.code != 0) {
                            this.$message({
                                type:'error',
                                message:res.message
                            });
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
            voidOldPhone1(){
                if(isPhone && isCode){
                    let para = {
                        cuUserPhone:this.passwords.phone,
                        certificate:this.codes,
                        code:this.passwords.code
                    };
                    bindingPhone(para).then(res =>{
                        if(res.status === 200){
                            this.$message.success(res.message);
                            this.$emit('closePassword');
                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            });
                        }
                    });
                }else{
                    this.$refs['form'].validateField('phone');
                    this.$refs['form'].validateField('code');
                }
            },
        }
    }
</script>

<style scoped>
    .phone_item{
        max-width:450px;
        margin: 0 auto;
    }
</style>
