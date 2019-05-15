<template>
    <div class="phone_item">
        <!--修改密码-->
        <el-form
                @submit.native.prevent
                :model="checkPas"
                :rules="rules"
                ref="formx">
            <el-form-item prop="newPassword">
                <el-input v-model="checkPas.newPassword" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item prop="oldPassword">
                <el-input  v-model="checkPas.oldPassword" placeholder="确认新密码"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;">
                <el-button type="primary" @click="submitChange">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        forgetModifyPwd
    } from '../../api/api'

    let isnew = false,newPassword='';//第一次帐户
    let validNewPassword=(rule, value,callback)=>{
        if (!value){
            isnew = false;
            callback(new Error('请输入新密码'))
        }else {
            isnew = true;
            newPassword = value;
            callback()
        }
    };
    let isold = false;//第一次帐户
    let validOldPassword=(rule, value,callback)=>{
        if (!value){
            isold = false;
            callback(new Error('请输入确认密码'))
        }else if(!isnew){
            isold = false;
            callback(new Error('请输入新密码'))

        }else if(newPassword !== value){
            isold = false;
            callback(new Error('密码不一致'))
        }else {
            isold = true;
            callback()
        }
    };
    export default {
        name: "set-password",
        props:{
            codes:{
                type:String,
                default:function(){
                    return ''
                }
            },
            cuUserPhone:{
                type:String,
                default:function(){
                    return ''
                }
            },
        },
        data(){
            return{
                //规则
                rules:{
                    newPassword: [
                        { required: true, validator: validNewPassword, trigger: 'blur' },
                    ],
                    oldPassword: [
                        { required: true, validator: validOldPassword, trigger: 'blur' },
                    ],
                },
                //验证重置密码参数
                checkPas:{
                    newPassword:'',
                    oldPassword:''
                }
            }
        },
        methods:{
            //修改密码
            submitChange(){
                if(isnew && isold){
                    let para = {
                        certificate:this.codes,
                        cuUserPhone:this.cuUserPhone,
                        cuLoginPwd:this.checkPas.newPassword
                    };
                    forgetModifyPwd(para).then(res =>{
                        if(res.status === 200){
                            this.$message.success(res.message);
                            this.$emit('setPasswordOk');
                        }
                    });
                }else{
                    this.$refs['formx'].validateField('newPassword');
                    this.$refs['formx'].validateField('oldPassword');
                }
            }
        }
    }
</script>

<style scoped>

</style>
