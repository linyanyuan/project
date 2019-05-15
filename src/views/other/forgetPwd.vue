<template>
    <section class="forgot">
        <header class="conpany_name">小福科技</header>
        <div class="title">找回登陆密码</div>
        <div class="steps" >
            <el-steps
                    :space="400"
                    :active="active"
                    align-center
                    finish-status="success">
                <el-step title="输入帐户"></el-step>
                <el-step title="验证"></el-step>
                <el-step title="重置密码"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </div>
        <div class="middle">
            <el-form  v-if="active===0" :rules="rules" ref="form"  :model="checkPas" @submit.native.prevent>
                <el-form-item prop="cuLoginName">
                    <el-input type="text" placeholder="帐户名" v-model="checkPas.cuLoginName"></el-input>
                    <el-tooltip class="item" effect="light" content="忘记用户名" placement="right">
                        <i  v-if="active===0"
                            class="el-icon-question forgotCount"
                            @click="findPeople"></i>
                    </el-tooltip>

                </el-form-item>
                <el-form-item class="codeBox" prop="checkCode">
                    <el-input placeholder="验证码" v-model="checkPas.checkCode"  @keydown.native.enter="handleSubmit">
                        <template slot="append">
                            <img alt="验证码" :src="imgCode" style="height: 40px" @click="getCodeImage" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item style="text-align: center;">
                    <el-button type="primary" style="width:80px;" @click="handleSubmit">下一步</el-button>
                    <el-button type="primary" style="width:80px;" @click="back">返回</el-button>
                </el-form-item>
            </el-form>
            <forgotOne
                    v-if="active===1"
                    :codes="checkPas.code"
                    :phone="phone"
                    v-on:setPassword="setPassword"></forgotOne>

            <setPassword
                    v-if="active===2"
                    :codes="codes"
                    :cuUserPhone="cuUserPhone"
                    v-on:setPasswordOk="setPasswordOk"
                ></setPassword>
            <div v-if="active===3" class="setOk">
                <h3>修改密码成功</h3>
                <el-button type="primary" size="small" @click="backToLogin">确定</el-button>
            </div>

        </div>
        <!--对接人信息窗口-->
        <el-dialog class="Contacts" title="相关对接人信息"
                   :visible.sync="isForgotCount">
                <el-form label-position="right" label-width="90px">
                    <el-form-item label="姓名：">
                        <span>{{usersPeople.cuUserName}}</span>
                    </el-form-item>
                    <el-form-item label="联系方式：">
                        <span>{{usersPeople.cuUserPhone}}</span>
                    </el-form-item>
                </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import {
        defaultKaptcha,
        findLoginName,//登录账户和验证码校验

        findDockingPeople,//获取对接人信息
        checkPwdCode,//验证验证码
        modifyPwd
    } from '../../api/api'
    import forgotOne from './forgotOne';
    import setPassword from './setPassword';

    let isCheckCode = false;//第一次帐户验证码
    let validCheckCode=(rule, value,callback)=>{
        if (!value){
            isCheckCode = false;
            callback(new Error('请输入验证码'))
        }else {
            isCheckCode = true;
            callback()
        }
    };
    let iscuLoginName = false;//第一次帐户
    let validCuLoginName=(rule, value,callback)=>{
        if (!value){
            iscuLoginName = false;
            callback(new Error('请输入登陆帐户'))
        }else {
            iscuLoginName = true;
            callback()
        }
    };



    export default {
        name: "forget-pwd",
        data(){
            return{
                //form规则
                rules: {
                    checkCode: [
                        { required: true, validator: validCheckCode, trigger: 'blur' },
                    ],
                    cuLoginName: [
                        { required: true, validator: validCuLoginName, trigger: 'blur' },
                    ],


                },
                active: 0,//第几步骤
                phone:'',//手机号
                imgCode:defaultKaptcha,
                isForgotCount:false,//忘记帐户名
                //验证重置密码参数
                checkPas:{
                    checkCode:'',//第一步验证码
                    cuLoginName:'',//登陆帐户
                    code:'',//手机i验证码

                },
                cuUserPhone:'',
                codes:'',//修改密码时需要传过去的 codes
                usersPeople:{}
            }
        },
        components:{
            forgotOne,
            setPassword
        },
        methods:{
            //返回登陆
            back(){
                this.$router.push({ path: '/login' });
            },
            //获取对接人信息
            findPeople(){
                findDockingPeople().then(res =>{
                    this.isForgotCount = true;
                    this.usersPeople = res.data;
                })

            },
            //点击获取验证码
            getCodeImage(){
                this.imgCode = defaultKaptcha + '?d='+new Date()*1;
            },
            //输入帐户验证
            handleSubmit(){
                if(this.checkPas.cuLoginName && this.checkPas.checkCode){
                    let para = {
                        cuLoginName:this.checkPas.cuLoginName,
                        vrifyCode:this.checkPas.checkCode
                    };
                    findLoginName(para).then(res =>{
                        if(res.code === '200'){
                            //验证成功
                            this.active = 1;
                            this.phone = res.data.cuUserPhone;//手机号

                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            })
                        }
                    })
                }else{
                    this.$refs['form'].validateField('checkCode');
                    this.$refs['form'].validateField('cuLoginName');
                }
            },
            //手机号验证成功
            setPassword(res,phone){
                console.log(phone)
                this.cuUserPhone = phone;
                this.codes = res.code;
                this.active = 2;
            },
            //修改密码成功
            setPasswordOk(){
                this.active = 3;
            },
            //返回至登陆
            backToLogin(){
                this.active = 0;
                this.$router.push({ path: '/login' });
            }


        }
    }
</script>

<style  lang="scss">
    section{
        color: #515151;
    }
    header{
        height: 30px;
        margin: 0 auto;
        position: relative;
        padding-top: 45px;
        /* width: 1000px; */
        max-width: 1200px;
        font-size: 25px;
        color: #000;
    }
    .forgot .title{
        margin: 0px auto;
        height: 35px;
        margin-top: 55px;
        overflow: hidden;
        text-align: center;
        font-size: 26px;
    }
    .steps{
        margin: 0px auto;
        height: 70px;
        width: 840px;
        margin-top: 100px;
        margin-bottom: 60px;
        overflow: hidden;
    }
    .middle{
        width: 320px;
        margin: 0px auto;
        .setOk{
            text-align: center;
        }
    }
    .codeBox{
        .el-input-group__append{
            padding: 0;
            font-size: 0;
            border: 0;
            img{
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }
    }
   /* .el-dialog{
        width:423px;
    }*/
    .forgotCount{
        color: #bc2828;
        font-size: 20px;
        position: absolute;
        right: -30px;
        top: 10px;
        cursor: pointer;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
    }
    .forgotCount:focus{
        outline: none;
    }
</style>
