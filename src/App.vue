<template>
    <div id="app">
        <transition
                name="fade"
                mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "app"
    }
</script>

<style lang="scss">
    body {
        margin: 0;
        padding: 0;
        /*background: url(assets/bg1.jpg) center !important;
            background-size: cover;*/
        // background: #1F2D3D;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
    }
    .el-progress-bar{
        vertical-align: bottom!important;
    }
    #app {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }
    .toolbar {
        border: 1px solid #d4d4d4;
        border-radius: 3px;
       /* background: #f4f4f4;*/
        background: #fff;
        padding: 5px;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .box-tools .el-form--inline .el-form-item {
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
    }
    .box-tools.el-form--inline .el-form-item__content {
        display: inline-block;
        vertical-align: middle;
    }
    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }
    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: all .2s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>
