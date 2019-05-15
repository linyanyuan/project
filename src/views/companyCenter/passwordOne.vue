<template>
    <el-form
            ref="forms"
            :model="passwords"
            :rules="rules"
            label-width="150px"
            :label-position="labelPosition">
        <el-form-item label="输入新密码" prop="companyName">
            <el-input
                    size="small"
                    :maxlength="20"
                    type="password"
                    v-model="passwords.companyName"
                    placeholder="6-20位字符，包含字母和数字"></el-input>
        </el-form-item>
        <el-form-item label="再次确认新密码" prop="address">
            <el-input
                    size="small"
                    :maxlength="20"
                    type="password"
                    v-model="passwords.address"
                    placeholder="6-20位字符，包含字母和数字"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button
                    size="small"
                    @click="updataModifyPwd"
                    type="primary">
                提交
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import util from '../../utils/util';
    import {
        modifyPwd,//修改密码
    } from '../../api/api';
    let again = false;
    let newPass = false;
    let newPassword = '';
    //新密码
    let validNew=(rule, value,callback)=>{
        console.log(value)
        if(!value){
            newPass = false;
            callback(new Error('新密码必填'))
        }else if(!util.isvalidPassword(value)){
            newPass = false;
            callback(new Error('6-20位字符，包含字母和数字'))
        }else{
            newPass = true;
            newPassword = value;
            callback()
        }
    };
    //再次新密码
    let validAgain=(rule, value,callback)=>{
        if(!value){
            again = false;
            callback(new Error('请输入确认密码'))
        }else if(!newPass){
            again = false;
            callback(new Error('6-20位字符，包含字母和数字'))

        }else if(newPassword !== value){
            again = false;
            callback(new Error('密码不一致'))
        }else{
            again = true;
            callback()
        }
    };
    export default {
        name: "password-one",
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
                    companyName:[
                        {  required: true,trigger: 'blur', validator: validNew }//这里需要用到全局变量
                    ],
                    address: [
                        {  required: true,trigger: 'blur', validator: validAgain }//这里需要用到全局变量
                    ],

                },
                passwords:{
                    companyName:'',
                    address:'',
                    code:''
                },
            }
        },
        methods:{
            //修改密码
            updataModifyPwd(){
                if(newPass && again){
                    let para = {
                        certificate:this.codes,
                        cuLoginPwd:this.passwords.companyName
                    };
                    modifyPwd(para).then(res =>{
                        if(res.status === 200){
                            this.$message.success(res.message);
                            this.$emit('closePassword');
                        }
                    });
                }else{
                    this.$refs['forms'].validateField('companyName');
                    this.$refs['forms'].validateField('address');
                }

            },
        }
    }
</script>

<style scoped>

</style>
