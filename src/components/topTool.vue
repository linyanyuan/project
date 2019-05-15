<template>
    <section>
        <div class="box-tools pull-right">
            <el-row style="width: 100%;">
                <el-col :span="1">
                    <i class="iconfont icon-gongju" style="padding: 0 15px;color: #b9a7a7;font-size: 20px;"></i>
                </el-col>
                <el-col :span="23">
                    <el-col :span="24">
                        <el-form
                                style="overflow: hidden;white-space: nowrap;"
                                class="demo-form-inline"
                                :inline="true">
                            <!---->
                            <!--上传表单路由跳转-->
                            <el-form-item
                                    v-if="toolData.tools.updateForm">
                                <el-button
                                        icon="el-icon-upload2"
                                        type="warning"
                                        size="small"
                                        @click="eventClick('updataRoute')"
                                        plain>上传结算表单</el-button>
                            </el-form-item>
                            <el-form-item
                                    v-if="toolData.tools.updateForm">
                                <a :href="importOrderUrl">
                                    <el-button
                                            icon="el-icon-download"
                                            type="warning"
                                            size="small"
                                            plain>模板下载
                                    </el-button>
                                </a>
                            </el-form-item>
                            <!--上传表单-->
                            <el-form-item
                                    v-if="toolData.tools.update">
                                <el-button
                                        icon="el-icon-upload2"
                                        type="warning"
                                        size="small"
                                        @click="dialogFormVisible = true"
                                        plain>上传</el-button>
                            </el-form-item>
                            <!--导入精确报表数据-->
                            <el-form-item
                                    v-if="toolData.tools.realReport">
                                <el-button
                                        icon="el-icon-upload2"
                                        type="primary"
                                        size="small"
                                        @click="dialogFormVisible1 = true"
                                        plain>导入数据</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-col>
            </el-row>
            <!--精确数据导入-->
            <el-dialog
                    title="精确数据导入"
                    :visible.sync="dialogFormVisible1">
                <el-upload
                        :headers="headers"
                        style="width: 370px;margin: 0 auto"
                        class="upload-demo"
                        drag
                        :action="importOrderUrl"
                        :data="data"
                        :before-upload="beforeUpload"
                        :on-success="success"
                        :limit="12"
                        :file-list="fileList"
                        :multiple=true
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">
                        只能上传exacl文件
                        <a :href="downLoadFile" style="float: right"><el-button type="primary" size="mini">点击下载模板文件</el-button></a>
                    </div>
                </el-upload>
                <div style="width: 370px;margin: 0 auto" v-show="uploading">
                    <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="upload">数据处理中...</div>
                </div>
            </el-dialog>
            <!--结算单导入-->
            <el-dialog
                    @close="closeEdited"
                    title="结算单导入"
                    :visible.sync="dialogFormVisible">
                    <div style="text-align: center;">
                        <el-form :inline="true" >
                            <el-form-item label="结算月：">
                                <el-date-picker
                                        v-model="data.shouldGrantDate"
                                        type="month"
                                        @change="timeChange2"
                                        value-format="yyyy-MM"
                                        placeholder="选择月">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-upload
                        style="width: 370px;margin: 0 auto"
                        class="upload-demo"
                        drag
                        name="file"
                        :action="importSalaryOrdersViews"
                        :data="data"
                        :headers="headers"
                        :before-upload="beforeUpload"
                        :on-remove="handleRemove"
                        :on-success="success"
                        :on-change="handleChange"
                        :file-list="fileList"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">
                            只能上传excel文件
                            <a :href="importOrderUrl" style="float: right"><el-button type="primary" size="mini">点击下载模板文件</el-button></a>
                        </div>
                    </el-upload>
                    <div style="width: 370px;margin: 0 auto" v-show="uploading">
                        <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="upload">数据处理中...</div>
                       <!-- <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="!upload">上传完成，成功 <span style="color: #0f0;font-size: 26px">{{succeeNum}}</span>人，失败 <span style="color: #f00;font-size: 26px">{{faileNum}}</span>人</div>-->
                        <div data-v-fbc4c2ec="" class="el-upload__tip" v-if="error"><a :href="errorUrl">点击下载错误文件</a></div>
                    </div>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    import {
        getCookies,
        importSalaryOrdersView,
        downloadModuleFile,
        base
    } from '../api/api'
    import util from '../utils/util';
    export default {
        name: "top-tool",
        props:{
            toolData:{
                type:Object,
                default:function () {
                    return {
                        tools:{
                        }
                    }
                }
            }
        },
        data(){
            let preMonth = util.getPreMonth();
            return{
                /*控制区*/
                uploading:true,
                upload:false,
                dialogFormVisible:false,//结算单
                dialogFormVisible1:false,//精确数据
                /*存储区*/
                headers:{
                    CsrfRandomToken:''
                },
                //导入接口
                importOrderUrl:downloadModuleFile,
                //上传结算单
                importSalaryOrdersViews:importSalaryOrdersView,
                fileList:[],//上传的文件列表
                //上传的额外参数
                data:{
                    shouldGrantDate:preMonth+'-01',
                    grantType:0
                },
                //monthDate:preMonth,//上传结算表单 选择月
            }
        },
        methods:{
            //时间改变
            timeChange2(a){
                this.data.shouldGrantDate = a + '-01';
            },
            eventClick(type){
                switch (type){
                    case 'updataRoute':
                        this.$emit('updataRoute',this.roleUser);
                        return;
                    default:
                        return
                }
            },
            handleRemove(file, fileList) {
                this.upload = false;
            },
            handleChange(file, fileList){
                //console.log(this.fileList)
            },
            //初始化数据
            closeEdited(data) {
                //关闭dialog框
                this.fileList = [];
            },
            success(response, file, fileList){
                this.fileList = fileList;
                this.uploading = false;
                this.upload = false;
                this.$emit('updatas',response,this.data);
                this.dialogFormVisible = false;
            },
            //获取cookie
            getCookie() {
                let cookie = $.cookie('CsrfRandomToken'), _this = this;
                if(!cookie){
                    $.ajax({
                        type:'get',
                        url:configAll.serviceUrl.base+'/payroll-enterprise/cookieCon/addCookies',
                        beforeSend:function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("CsrfRandomToken", '');
                        },
                        async:false,
                        success:function (res) {
                            _this.cookie = $.cookie('CsrfRandomToken');
                        }
                    });
                }else{
                    _this.cookie = cookie;
                }
            },
            beforeUpload(file){
                const isExcel = (
                    file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel'  || file.name.indexOf(".xls") > 0 || file.name.indexOf(".xlsx") > 0);

                if (!isExcel) {
                    this.$message.error('只能上传excel文件!');
                    return false;
                }
                this.getCookie();
               this.headers.CsrfRandomToken =  this.cookie;
                this.uploading = true;
                this.upload = true;
                this.error = false;
            },
        }
    }
</script>

<style scoped lang="scss">
    /*此组件为 工具公共组件*/

    section{
        width: 100%;
        float: left;
        margin-bottom: 10px;
    }
    .box-tools{
        width: 100%;
        height: 45px;
        line-height: 43px;
        border: 1px solid #d4d4d4;
        border-radius: 3px;
        /*background: #f4f4f4;*/
        background: #fff;
        /*padding: 0 15px;*/
        box-sizing: border-box;
        display: flex;
    }
</style>
