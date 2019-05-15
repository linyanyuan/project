<template>
    <section>
        <i class="iconfont icon-xiazai18"></i>
        <span style="margin-left: 10px;line-height: 36px;"></span>
        <el-breadcrumb
                style="line-height: 36px;"
                separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
                    v-for="(val,index) in tabData.matched"
                    :key="val.path"
                     v-if="index !== 0"
                    :to="{ path: val.path }">{{val.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </section>
</template>

<script>
    export default {
        name: "tab-panel",
        props:{
            tabData:{
                type:Object,
                default:function () {
                    return {}
                }
            }
        },
        computed:{
            datas:function(){
                if(this.tabData.matched.length>0){
                     this.tabData.matched.splice(0,1);
                }
                console.log(this.tabData)
                return this.tabData.matched;
            }
        },
        mounted(){
        }
    }
</script>

<style scoped lang="scss">
    section{
        background: #fff;
        line-height: 35px;
        height: 35px;
        margin: 5px 0;
        padding-left: 23px;
        display: flex;
        border-bottom: 1px solid #d9d9d9;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
