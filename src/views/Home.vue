<template>
    <section>
        <el-row class="container">
            <el-col :span="24" class="header">
                <el-col
                        :span="3"
                        :class="collapsed?'logo-collapse-width':'logo-width'"
                        class="logo">
                   <!-- {{collapsed?'':'薪动力'}}-->
                    <img src="../assets/img/logo_beat2.png" alt="logo" v-show="!collapsed">
                    <img src="../assets/img/logo_beat2.png" alt="logo" v-show="collapsed" style="margin-left: -10px">
                </el-col>
                <div class="header-title">
                    <el-col :span="1">
                        <div class="tools item" @click.prevent="collapse">
                            <i class="fa fa-align-justify themeColor" ></i>
                            <transition name="el-fade-in-linear">
                                <div v-show="true" class="transition-box"></div>
                            </transition>
                        </div>
                    </el-col>

                    <el-col :span="8" class="userinfo">

                        <span :span="1"  class="userName" >{{userName}}</span>
                        <el-dropdown trigger="hover">
                         <span class="el-dropdown-link userinfo-inner">
                           <!-- <img :src="this.sysUserAvatar" alt="头像"/>-->
                             <i class="iconfont icon-touxiang"></i>
                         </span>
                        <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!--<el-dropdown trigger="hover" @command="handleCommand">
                         <span class="el-dropdown-link userinfo-inner">
                             <i class="iconfont icon-zhuti-"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="default" :class="{'selectBg':themes == 'default'}">默认灰</el-dropdown-item>
                                <el-dropdown-item command="blue" :class="{'selectBg':themes == 'blue'}">天空蓝</el-dropdown-item>
                                <el-dropdown-item command="green" :class="{'selectBg':themes == 'green'}">典雅绿</el-dropdown-item>
                                <el-dropdown-item command="blackberry" :class="{'selectBg':themes == 'blackberry'}">经典蓝</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>-->
                        <el-tooltip class="item" effect="dark" content="消息" placement="bottom-start">
                            <el-badge :hidden="getTotle===0" :value="getTotle" class="item" >
                                <i class="iconfont icon-xiaoxi mesaage" @click="toMessage"></i>
                            </el-badge>
                        </el-tooltip>
                    </el-col>
                </div>
            </el-col>
            <el-col :span="24" class="main homeContent">
                <!--导航菜单-->
                    <el-scrollbar style="height: 100%">
                        <el-menu
                                :default-active="actives"
                                class="el-menu-vertical-demo"
                                :background-color='bgColor(themes)'
                                active-text-color="#fff"
                                text-color="#fff"
                                unique-opened
                                default-openeds
                                router
                                :collapse="isCollapse">
                            <el-menu-item index="/home/index">
                                <i class="fa fa-home fa-lg"></i>
                                <span slot="title">主页</span>
                            </el-menu-item>
                            <el-menu-item index="/home/task">
                                <i class="fa fa-tasks"></i>
                                <span slot="title">任务管理</span>
                            </el-menu-item>
                            <el-menu-item index="/home/balanceIndex/balance">
                                <i class="fa fa-calendar-minus-o"></i>
                                <span slot="title">结算管理</span>
                            </el-menu-item>
                            <el-menu-item index="/home/Account">
                                <i class="fa fa-money"></i>
                                <span slot="title">账户管理</span>
                            </el-menu-item>
                            <el-menu-item index="/home/invoiceIndex/invoice">
                                <i class="fa fa-list-ul"></i>
                                <span slot="title">发票管理</span>
                            </el-menu-item>
                            <el-menu-item index="/home/Report">
                                <i class="fa fa-database"></i>
                                <span slot="title">报表统计</span>
                            </el-menu-item>
                            <el-submenu index="6" >
                                <template slot="title">
                                    <i class="fa fa-building"></i>
                                    <span>企业中心</span>
                                </template>
                                <el-menu-item index="/home/company">企业信息</el-menu-item>
                                <el-menu-item index="/home/Safe">安全设置</el-menu-item>
                                <el-menu-item index="/home/contract">合同管理</el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </el-scrollbar>
                <div class="router-box">
                    <tabPanel :tabData="$route"></tabPanel>
                    <router-view></router-view>
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import logo from '../assets/img/enid.png';
    import {
        loginOut,
        findNoRead
    } from '../api/api';
    import util from '../utils/util';
    const tabPanel = r => require.ensure([], () => r(require('../components/tabPanel')), 'tabPanel');//tab标签
    import { mapState,mapGetters,mapActions} from "vuex";
    export default {
        name: "home",
        data(){
            return{
                /*存储器*/
                isCollapse:false,//是否关闭
                sysUserAvatar: '',//头像
                userName:JSON.parse(sessionStorage.getItem('name')),
                themes:''
            }
        },
        components:{
            tabPanel
        },
        computed:{
            //映射State
            ...mapState({
                actives: state => state.active,
            }),
            ...mapGetters(["getTotle"])
        },
        mounted(){
            this.sysUserAvatar = logo;
         // console.log(this.$route)
            this.queryMessageList();
        },
        created(){
            //主题
            let themes = JSON.parse(util.getCookie('themes'));
            if(!themes){
                //如果不存在 说明 第一次进入 或者 清除缓存
                util.setCookie('themes', JSON.stringify('default'),7);// 默认保存  默认风格
                this.themes = 'default';
            }else{
                //如果存在 有主题
                this.themes = themes;
            }
        },
        methods:{
            ...mapActions(["upDataTotle"]),
            //获取 未读消息列表
            queryMessageList(){
              /*  let para = {
                    readStatus:0
                };*/
                findNoRead().then((res) => {
                    //this.total = res.list.length;
                    if(res.data){
                        this.upDataTotle(Number(res.data))
                    }else{
                        this.upDataTotle(0)
                    }
                },error =>{

                });
            },
            //折叠导航栏
            collapse:function(){
                this.isCollapse=!this.isCollapse;
            },
            toMessage(){
                //点击未读消息
                //this.total = 0;
               // sessionStorage.setItem('isFirst', 'false');
                this.$router.push({path:'/home/messageIndex/message'})
            },
            logout(){
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    /*sessionStorage.removeItem('order');
                    sessionStorage.removeItem('isFirst');*/
                    sessionStorage.clear();
                    loginOut();
                    _this.$router.push('/login');
                }).catch(() => {

                });
            },
            handleCommand(command) {
                util.setCookie('themes', JSON.stringify(command),7);// 默认保存  默认风格
                this.themes = command;
            },
            bgColor(type){
                switch (type){
                    case 'default':
                        return '#767676';
                    case 'blue':
                        return '#2185d0';
                    case 'green':
                        return '#00b791';
                    case 'blackberry':
                        return '#3D5894';
                    default:
                        return '#767676';
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .el-badge {
      float: right;
        display: inline-block;

    }
    .selectBg{
        background-color: #ecf5ff;
        color: #66b1ff;
    }
    .mesaage{
        /*width: 40px;
        height: 40px;
        color: #000;
        font-size: 25px;
        line-height: 40px;
        display: inline-block;
        margin: 10px;
        text-align: center;*/
        /*8/1修改缩小之间间距*/
        width: 30px;
        height: 40px;
        color: #000;
        font-size: 25px;
        line-height: 40px;
        display: inline-block;
        margin: 10px;
        text-align: center;
    }

    .header-title{
        height: 60px;
        margin-left: 200px;
      /*  background: #1c8de0;
        color: #fff;*/
    }

    .box .el-table__body-wrapper {
        overflow: hidden;
    }
    .el-badge__content{
        height: 12px;
        line-height: 12px;
        padding: 0 3px;
        top: 10px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        /*min-height: 400px;*/
        min-height: 560px;
    }
    .router-box{
        flex:1;
        overflow-y: auto;
       /* padding: 0 20px 20px 20px;*/
        /*background: #f8f8f8;*/
        background: #efefef;
        display: flex;
        flex-direction: column;
    }
    .logo-width{
        width:230px;
    }
    .logo-collapse-width{
        width:60px;
    }
    .menu-collapsed{
        flex:0 0 60px;
        width: 60px;
    }
    .menu-expanded{
        flex:0 0 230px;
        width: 230px;
        box-shadow: 0 0 20px rgba(34, 36, 38, 0.15);
    }
    .themeColor{
        color: #000;
    }
    .item:hover{
        cursor: pointer;
        background: rgba(0,0,0,.03);
        color: rgba(0,0,0,.95);
    }
    .el-menu{
        height: 100%;
        i{
            color: #fff;
        }

    }
    /*.is-active{
        !*background-color: #1e74b5 !important;*!
        background-color: rgb(94,94,94) !important;
    }*/
    .is-active{
        /*background-color: #1e74b5 !important;*/
        // opacity:0.5 ;
        // background-color: rgb(94,94,94) !important;
        background: rgba(0,0,0,.2)!important;
    }
    .dropDown{
        background: 0 0;
        padding: .92857143em 1.14285714em;
        font-weight: 400;
        img{
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
        }
    }
    .el-popper{
        margin-top: 0;
    }
    .el-dropdown{
        float: right;
    }
    .el-dropdown:hover{
        cursor: pointer;
        background: rgba(0,0,0,.03);
        color: rgba(0,0,0,.95);

    }
    /*样式*/

    .content-container {
        // background: #f1f2f7;
        flex:1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
            margin-bottom: 15px;
            .title {
                width: 200px;
                float: left;
                color: #475669;
            }
            .breadcrumb-inner {
                float: right;
            }
        }
        .content-wrapper {
            background-color: #fff;
            box-sizing: border-box;
        }
    }
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;

        .header {
            height: 60px;
            line-height: 60px;
            color:#fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                height: 60px;
                line-height: 60px;
                .userName{
                    color: black;
                    height: 30px;
                    border-radius: 20px;
                    margin: 15px 0 15px 0;
                    float: right;
                    line-height: 30px;
                    cursor: pointer;

                }
                .userinfo-inner {
                    cursor: pointer;
                    color:#fff;
                    img {
                         /* width: 40px;
                          height: 40px;
                          border-radius: 20px;
                          margin: 10px 10px 10px 10px;
                          float: right;*/
                         width: 30px;
                         height: 30px;
                         border-radius: 20px;
                         margin: 15px;
                         float: right;
                     }
                    i {
                      /*  width: 30px;
                        height: 30px;
                        border-radius: 20px;
                        margin: 15px;
                        float: right;
                        color: #9d9b9b;
                        font-size: 30px;
                        line-height: 31px;*/
                        /*8/1修改缩小之间距离*/
                        width: 30px;
                        height: 30px;
                        border-radius: 20px;
                        margin: 15px 10px;
                        float: right;
                        color: #9d9b9b;
                        font-size: 30px;
                        line-height: 31px;
                    }
                }
            }
            .logo {
                //width:230px;
                height:60px;
                font-size: 22px;
                padding-left:10px;
                padding-right:20px;
                border-color: rgba(238,241,146,0.3);
                border-right-width: 1px;
                border-right-style: solid;
                color: #000;
                box-shadow: 0 0 20px rgba(34,36,38,.15);
                img {
                /*    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;*/
                    margin-top: 10px;
                }
                .txt {
                    color:#fff;
                }
            }
            .logo-width{
                width:200px;
            }
            .logo-collapse-width{
                width:60px;
                /*background: ;*/
            }
            .tools{
                padding: 0px 23px;
                width:14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
                .transition-box {
                    display: inline;
                    margin-bottom: 10px;
                    width: 200px;
                    border-radius: 4px;
                    text-align: center;
                    color: #fff;
                    padding: 0 20px;
                    box-sizing: border-box;
                    margin-right: 20px;
                }
            }
        }
        .userinfo {
            text-align: right;
            padding-right: 35px;
            float: right;
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    margin: 10px 0px 10px 10px;
                    float: right;
                }
            }
        }
        .tools{
            padding: 0 23px;
            /*width:14px;*/
            height: 60px;
            line-height: 60px;
            cursor: pointer;
            .transition-box {
                display: inline;
                margin-bottom: 10px;
                width: 200px;
                border-radius: 4px;
               /* background-color: #20A0FF;*/
                text-align: center;
                color: #fff;
                padding: 0 20px;
                box-sizing: border-box;
                margin-right: 20px;
            }
        }
    }
    .main{
        display: flex;
        position: absolute;
        top: 60px;
        bottom: 0px;
        overflow: hidden;
    }
</style>
