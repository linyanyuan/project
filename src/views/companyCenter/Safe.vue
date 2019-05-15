<template>
    <div class="box">
        <div class="tableList">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 20px;">
                <el-tab-pane label="修改密码" name="first" ></el-tab-pane>
                <el-tab-pane label="绑定管理" name="second" ></el-tab-pane>
            </el-tabs>
            <div class="safe_content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "safe",
        data(){
            return{
                //activeName:this.$route.path === '/home/Safe/binding'?'second':'first'
            }
        },
        mounted(){

        },
        computed:{
            activeName:function(){
                let name;
                if(this.$route.path.indexOf('binding') === -1){
                     name = 'first';
                }else{
                     name = 'second';
                }

                return name;
            }
        },
        methods:{
            handleClick(tab, event){
                let index = tab.index;
                if(index === '0'){
                    this.$router.push({path:'/home/Safe/password'})
                }else{
                    this.$router.push({path:'/home/Safe/binding'})
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .tableList{
        width: 100%;
        float: left;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        /*background: #f4f4f4;*/
        margin-bottom:10px ;
        background: #fff;
        box-sizing: border-box;
    }
</style>
