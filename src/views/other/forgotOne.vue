<template>
    <div class="phone_item">
        <!--验证-->
        <el-form
                @submit.native.prevent
                :model="checkPas"
                label-width="90px"
                :rules="rules"
                label-position="right"
                ref="forms">
            <el-form-item
                    label="手机号码：">
                <span>{{phone}}</span>
                <el-button size="small" style="float: right;" v-on:click.native.prevent="getPhoneCode">获取验证码</el-button>
            </el-form-item>
            <el-form-item
                    prop="code"
                    label="验证码：">
                <el-input size="small"
                          v-model="checkPas.code"
                          @keydown.native.enter.prevent="voidOldPhone"
                          placeholder="请输入验证码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="voidOldPhone">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        sendCheckPwdCode,//手机获取验证码
        checkPwdCode
    } from '../../api/api'

    let iscode = false;//第一次帐户
    let validCode=(rule, value,callback)=>{
        console.log(value)
        if (!value){
            iscode = false;
            callback(new Error('请输入验证码'))
        }else {
            iscode = true;
            callback()
        }
    };
    export default {
        name: "forgot-one",
        props:{
            codes:{
                type:String,
                default:function(){
                    return ''
                }
            },
            phone:{
                type:String,
                default:function(){
                    return ''
                }
            }
        },
        data(){
            return{
                //规则
                rules:{
                    code: [
                        { required: true, validator: validCode, trigger: 'blur' },
                    ],
                },
                //验证重置密码参数
                checkPas:{
                    code:'',//手机i验证码
                }
            }
        },
        methods:{
            //获取手机号验证码
            getPhoneCode(e){
                if (!!this.pass) {
                    return false
                }
                if (e.target.innerText === '获取验证码') {
                    this.pass = true;
                    let para = {
                        phone:this.phone
                    };
                    sendCheckPwdCode(para).then((res) => {
                        if (res.code != 0) {
                            this.$message.error(res.message);
                            this.pass = false;
                            return false
                        }
                        if(res.status===200){
                            this.$message({
                                message: '发送成功',
                                type: 'success'
                            });
                            let time = 60;
                            e.target.innerHTML = time + 's后重试';
                            this.timer = setInterval(() => {
                                time--;
                                e.target.innerHTML = e.target.innerHTML = time + 's后重试';
                                if (time === 0) {
                                    clearInterval(this.timer);
                                    e.target.innerHTML = '获取验证码'
                                    this.pass = false;
                                }
                            }, 1000);
                        }

                    });
                } else {
                    return false
                }
            },
            //提交手机号和 手机号验证码
            voidOldPhone(){
                if(!!this.checkPas.code){
                    let para = {
                        phone:this.phone,
                        code:this.checkPas.code//验证码
                    };
                    checkPwdCode(para).then(res =>{
                        if(res.status === 200&& !!res.code){
                            /*this.codes = res.code;
                            this.active = 2;*/
                            this.$emit('setPassword',res,this.phone);
                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            })
                        }
                    });
                }else{
                    this.$refs['forms'].validateField('code');
                }

            },
        }
    }
</script>

<style scoped>
    .phone_item{
    }
</style>
