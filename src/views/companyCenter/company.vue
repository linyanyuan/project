<template>
    <div class="box">
        <el-collapse v-model="activeNames" @change="handleChange" accordion style="background-color: #fff;">
            <el-collapse-item
                    v-for="(val,index) in companyList"
                    :title=val.cName
                    :key="val.cId"
                    :name="val.cId">
                <div class="company_item" v-if="val.companyMes">
                    <el-row>
                        <el-col :span="24">
                            <div class="title_head">基本信息</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="body_left">
                                <p>
                                    <span>公司名称：</span>
                                    <strong >{{val.companyMes[0].data.cName}}</strong>
                                </p>
                                <p>
                                    <span>公司地址：</span>
                                    <el-tooltip class="item" effect="dark" :content="val.companyMes[0].data.cAddress" placement="top">
                                        <strong>{{val.companyMes[0].data.cAddress}}</strong>
                                    </el-tooltip>
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="12" v-if="val.companyMes[4].ccBusinessLicenseUrl">
                            <div class="body_left"><img :src="'data:image/jpeg;base64,'+val.companyMes[4].ccBusinessLicenseUrl" alt="营业执照" width="128" height="128"></div>
                        </el-col>
                    </el-row>
                </div>
                <div class="company_item" v-if="val.companyMes">
                    <!--<div class="title_head">开票信息</div>-->
                    <el-row>
                        <el-col :span="24">
                            <div class="title_head">开票信息</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="body_left">
                                <p>
                                    <span>公司名称：</span>
                                    <strong>{{val.companyMes[1].data.ciCompanyName}}</strong>
                                </p>
                                <p>
                                    <span>税号：</span>
                                    <strong>{{val.companyMes[1].data.ciTaxpayer}}</strong>
                                </p>
                                <p>
                                    <span>注册地址：</span>
                                    <el-tooltip class="item" effect="dark" :content="val.companyMes[1].data.ciCompanyAddress" placement="top">
                                        <strong>{{val.companyMes[1].data.ciCompanyAddress}}</strong>
                                    </el-tooltip>
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="body_left">
                                <p>
                                    <span>电话：</span>
                                    <strong>{{val.companyMes[1].data.ciPhone}}</strong>
                                </p>
                                <p>
                                    <span>开户行：</span>
                                    <strong>{{val.companyMes[1].data.ciOpenBank}}</strong>
                                </p>
                                <p>
                                    <span>账号：</span>
                                    <strong>{{val.companyMes[1].data.ciBankCard}}</strong>
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="company_item" v-if="val.companyMes">
                    <el-row>
                        <el-col :span="24">
                            <div class="title_head">邮寄信息</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="body_left">
                                <p>
                                    <span>公司名称：</span>
                                    <strong>{{val.companyMes[1].data.ciCompanyName}}</strong>
                                </p>
                                <p>
                                    <span>收件人姓名：</span>
                                    <strong>{{val.companyMes[2].data[0].name}}</strong>
                                </p>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="body_left">
                                <p>
                                    <span>通讯地址：</span>
                                    <el-tooltip class="item" effect="dark" :content="val.companyMes[2].data[0].address" placement="top">
                                        <strong>{{val.companyMes[2].data[0].address}}</strong>
                                    </el-tooltip>
                                </p>
                                <p>
                                    <span>电话：</span>
                                    <strong>{{val.companyMes[2].data[0].phone}}</strong>
                                </p>
                            </div>
                        </el-col>
                        <div class="changeMes">
                            <el-button
                                    v-if="val.companyMes[2].data[0].auditStatus === 1"
                                size="small"
                                @click="updataAddress(val.companyMes)"
                                type="primary">修改信息</el-button>
                            <el-button
                                    v-if="val.companyMes[2].data[0].auditStatus === 2"
                                    size="small"
                                    type="primary">确认中</el-button>
                            <el-button
                                    v-if="val.companyMes[2].data[0].auditStatus === 0"
                                    size="small"
                                    type="primary">确认中</el-button>
                        </div>
                    </el-row>
                </div>
                <div class="company_item company_phone" v-if="val.companyMes">
                    <el-row>
                        <el-col :span="24">
                            <div class="title_head">对接人信息</div>
                        </el-col>
                    </el-row>
                    <el-row v-if="val.companyMes[3].outs.length>0">
                        <el-col :span="24">
                            <h4 v-if="val.companyMes[3].outs[0].companyName">{{val.companyMes[3].outs[0].companyName}}：</h4>
                        </el-col>
                    </el-row>
                    <el-row style="padding: 0 20px;">
                        <el-col :span="24" v-for="(item,index) in val.companyMes[3].outs" :key="index">
                            <el-col :span="8">
                                <p>
                                    <span>联系人姓名：</span>
                                    <strong>{{item.name}}</strong>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p>
                                    <span>联系方式：</span>
                                    <strong>{{item.phone}}</strong>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p>
                                    <span>邮箱：</span>
                                    <strong>{{item.email}}</strong>
                                </p>
                            </el-col>
                        </el-col>
                    </el-row>
                    <!--内部联系人-->
                    <el-row v-if="val.companyMes[3].sefs.length>0">
                        <el-col :span="24">
                            <h4 v-if="val.companyMes[3].sefs[0].companyName">{{val.companyMes[3].sefs[0].companyName}}：</h4>
                        </el-col>
                    </el-row>
                    <el-row style="padding: 0 20px;">
                        <el-col :span="24" v-for="(item,index) in val.companyMes[3].sefs" :key="index">
                            <el-col :span="8">
                                <p>
                                    <span>联系人姓名：</span>
                                    <strong>{{item.name}}</strong>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p>
                                    <span>联系方式：</span>
                                    <strong>{{item.phone}}</strong>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p>
                                    <span>邮箱：</span>
                                    <strong>{{item.email}}</strong>
                                </p>
                            </el-col>
                        </el-col>
                    </el-row>

                </div>
            </el-collapse-item>
        </el-collapse>

        <!--修改邮寄地址-->
        <el-dialog
                title="修改邮寄地址"
                :visible.sync="isShowUpdataMessage">
                <el-form
                        inline
                        ref="form"
                        :model="updata"
                        :rules="rules"
                        label-width="120px"
                        label-position="right"
                        >
                    <el-row>
                        <el-col :span="24" >
                            <el-form-item
                                prop="area"
                                label="所在地区：">
                                <div id="distpicker2" class="form-inline">
                                    <div class="form-group">
                                        <label class="sr-only" for="province5">Province</label>
                                        <select class="form-control" id="province5" v-model="updata.province"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="city5">City</label>
                                        <select class="form-control" id="city5" v-model="updata.city"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="district5">District</label>
                                        <select class="form-control" id="district5" v-model="updata.area"></select>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" >
                            <el-form-item
                                    prop="address"
                                    label="地址：">
                                <el-input
                                        style="width:520px;"
                                        v-model="updata.address"
                                        size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" >
                            <el-form-item
                                    prop="companyName"
                                    label="公司名称：">
                                <el-input
                                        style="width:520px;"
                                        v-model="updata.companyName"
                                        size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" >
                            <el-form-item
                                    prop="name"
                                    label="收件人姓名：">
                                <el-input
                                        v-model="updata.name"
                                        size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" >
                            <el-form-item
                                    prop="phone"
                                    label="联系方式：">
                                <el-input

                                        v-model="updata.phone"
                                        size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" style="text-align: center;">
                            <el-form-item>
                                <el-button
                                        type="primary"
                                        :loading="loading"
                                        @click="queryAddAndUpdate"
                                        size="small">提交申请</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {
        findChildCompanyList,
        findCompanyById,//基本信息
        findByCompanyId,//开票信息
        findCompanyAddressByCompanyId,//邮寄地址
        findListByCompanyName,//联系人
        findCompanyCetrifices,//营业执照信息
        addAndUpdate,//新增、修改邮寄地址
    } from '../../api/api';
    import util from '../../utils/util';
    //公司名称
    let comName = false;
    let validCompanyName=(rule, value,callback)=>{
        if(!value){
            comName = false;
            callback(new Error('公司名称必填'))
        }else{
            comName = true;
            callback()
        }
    };

    //公司地址
    let address = false;
    let validAddress=(rule, value,callback)=>{
        if(!value){
            address = false;
            callback(new Error('公司地址必填'))
        }else{
            address = true;
            callback()
        }
    };
    //收件人姓名
    let name = false;
    let validName=(rule, value,callback)=>{
        if(!value){
            name = false;
            callback(new Error('收件人姓名必填'))
        }else{
            name = true;
            callback()
        }
    };
    //联系方式
    let isPhone = false;
    let validPhone=(rule, value,callback)=>{
        if (!value){
            isPhone = true;
            callback(new Error('联系方式必填'));
        }else  if (!util.isvalidPhone(value)){
            isPhone = false;
            callback(new Error('请输入正确的11位手机号码'))
        }else {
            isPhone = true;
            callback()
        }
    };
    //
    let isProvince = true;
    let validProvince=(rule, value,callback)=>{
        if (!value){
            isProvince = false;
            callback(new Error('请您填写完整的地址信息'));
        }else {
            isProvince = true;
            callback()
        }
    };
    export default {
        name: "company",
        data(){
            return{
                /*规则*/
                rules:{
                    companyName:[
                        {  required: true,trigger: 'blur', validator: validCompanyName }//这里需要用到全局变量
                    ],
                    address: [
                        {  required: true,trigger: 'blur', validator: validAddress }//这里需要用到全局变量
                    ],
                    name:[
                        {  required: true,trigger: 'blur', validator: validName }//这里需要用到全局变量
                    ],
                    phone: [
                        {  required: true,trigger: 'blur', validator: validPhone}//这里需要用到全局变量
                    ],
                    area: [
                        {  required: true,trigger: 'blur', validator: validProvince}//这里需要用到全局变量
                    ],



                },
                loading:false,
                activeNames: ['1'],
                companyList:[],//公司列表
                isShowUpdataMessage:false,//是否显示修改邮件地址

                /*存储区*/
                selected:'',
                updata:{
                    companyId:'',
                    address:'',
                    companyName:'',//公司名称
                    name:'',//收件人姓名
                    phone:'',
                    id:'',
                    province:'',//省
                    city:'',//市
                    area:'',//区
                }
            }
        },
        mounted(){
            this.queryCompayList();

        },
        components: {

        },
        methods:{
            onSelected(data) {
               // alert(data.province + ' | ' + data.city + ' | ' + data.area)
                console.log(data)
            },
            //获取公司列表
            queryCompayList(){
                findChildCompanyList().then((res) => {
                    if(res.status === 200){
                        this.companyList = res.data;
                    }

                });
            },
            //修改邮寄地址
            updataAddress(datas){

                let obj = datas[2].data[0];
                let companyName = datas[1].data.ciCompanyName;
                this.updata.id = obj.id;
                this.updata.companyId = obj.companyId;
                this.updata.companyName = companyName;//公司名称
                this.updata.address = obj.address;
                this.updata.name = obj.name;
                this.updata.phone = obj.phone;
                this.updata.province = obj.province;//省
                this.updata.city = obj.city;//市
                this.updata.area = obj.area;//区
                this.isShowUpdataMessage = true;
                console.log(this.updata)
                setTimeout(function(){
                   /* $('#distpicker2').distpicker({
                        province: '---- 所在省 ----',
                        city: '---- 所在市 ----',
                        district: '---- 所在区 ----'
                    });*/
                    $('#distpicker2').distpicker({
                        province: obj.province,
                        city: obj.city,
                        district: obj.area,
                        autoSelect: false
                    });
                },200)

            },
            //提交更新邮寄地址
            queryAddAndUpdate(){
                if(comName && isProvince && address && name && isPhone){
                    let address = this.updata.province+this.updata.city+this.updata.area+this.updata.address;
                    let para = {
                        id:this.updata.id,
                        companyId:this.updata.companyId,
                        name:this.updata.name,
                        phone:this.updata.phone,
                        address:address,
                        province:this.updata.province,
                        city:this.updata.city,
                        area:this.updata.area,
                        type:1,
                        defaultAddress:0
                    };
                    this.$confirm('是否修改邮寄地址?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        this.loading = true;
                        addAndUpdate(para).then((res) =>{
                            $('#distpicker2').distpicker('destroy');
                            if(res.status === 200){
                                this.loading = false;
                                this.$message({
                                    type: 'success',
                                    message:res.message
                                });
                                this.isShowUpdataMessage = false;
                                this.queryCompanyDate(this.updata.companyId)
                                /* let that = this;
                               * findCompanyAddressByCompanyId(paras).then(res =>{
                                     for(let i = 0,l = that.companyList.length;i<l;i++){
                                         if(that.companyList[i].cId === cId){

                                             that.companyList[i].companyMes[2] = res;
                                         }
                                     }
                                     console.log(that.companyList)
                                 })*/

                            }else{
                                this.$message({
                                    type: 'success',
                                    message: res.message
                                });
                            }
                        });
                    }).catch(() => {
                        this.loading = false;
                        $('#distpicker2').distpicker('destroy');
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                    this.$refs['form'].validateField('companyName');
                    this.$refs['form'].validateField('address');
                    this.$refs['form'].validateField('name');
                    this.$refs['form'].validateField('phone');
                    this.$refs['form'].validateField('area');
                }
            },
            queryCompanyDate(cId){
                let that = this;
                Promise.all([new Promise(function(resolve){
                    let para = {
                        cId:cId
                    };
                    findCompanyById(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        ciCompanyId:cId
                    };
                    findByCompanyId(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        companyId:cId
                    };
                    findCompanyAddressByCompanyId(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        companyIds:cId,
                    };
                    findListByCompanyName(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        ccCId:cId,
                    };
                    findCompanyCetrifices(para).then(res =>{
                        resolve(res);
                    })
                })]).then(function(result){
                    //获取到公司的详细信息 进行处理  并存储
                    let results = result;
                    for(let i = 0,l = that.companyList.length;i<l;i++){
                        if(that.companyList[i].cId === cId){

                            that.companyList[i].companyMes = results;
                            that.companyList[i].cName = that.companyList[i].cName + ' ';
                        }
                    }
                   // console.log(that.companyList)
                },error =>{
                })
            },
            //获取公司详细信息
            handleChange(val) {
                //Promise同步加载所以信息
                let cId = val;
                let that = this;
                if(!val){
                    //如果cId不存在  不请求
                    return;
                }
                for(let i = 0,l = that.companyList.length;i<l;i++){
                    if(that.companyList[i].cId === cId){
                        if(!!that.companyList[i].companyMes&&that.companyList[i].companyMes.length>0){
                            //说明已经请求了数据了
                            return;
                        }
                    }
                }
                /*if(!isQuest){
                    return;
                }*/
                Promise.all([new Promise(function(resolve){
                    let para = {
                        cId:cId
                    };
                    findCompanyById(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        ciCompanyId:cId
                    };
                    findByCompanyId(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        companyId:cId
                    };
                    findCompanyAddressByCompanyId(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        companyIds:cId
                    };
                    findListByCompanyName(para).then(res =>{
                        resolve(res);
                    })
                }),new Promise(function(resolve){
                    let para = {
                        ccCId:cId,
                    };
                    findCompanyCetrifices(para).then(res =>{
                        resolve(res);
                    })
                })]).then(function(result){
                    //获取到公司的详细信息 进行处理  并存储
                    let results = result;
                    for(let i = 0,l = that.companyList.length;i<l;i++){
                        if(that.companyList[i].cId === cId){
                            //处理联系人信息
                            let peoples = results[3];
                            let companyDatas = {
                                sefs:[],
                                outs:[]
                            };
                            for(let k = 0,l = peoples.length;k<l;k++){
                                if(peoples[k].type === '1' || peoples[k].type === '2'){
                                    //小福联系人
                                    companyDatas.sefs.push(peoples[k]);
                                }else{
                                    companyDatas.outs.push(peoples[k]);
                                }
                            }
                            results[3] = companyDatas;
                            that.companyList[i].companyMes = results;
                            that.companyList[i].cName = that.companyList[i].cName + ' ';
                        }
                    }
                    console.log(results)
                   console.log(that.companyList)
                },error =>{
                })
            },
        }
    }
</script>

<style  lang="scss">
    .box .el-dialog{
        min-width: 750px;
    }
    .box .el-collapse-item__header{
        margin: 0 30px;
        font-size: 14px;
        font-weight: normal;
    }
    .box .el-collapse-item__content{
        font-size: 14px;
    }
    .box .el-collapse-item__wrap{
        padding: 0 40px;
        border-bottom: none;
    }
    .title_head{
        font-size: 14px;
    }
    .company_phone{
        p{
            margin: 10px 0;

        }
        h4{
            margin: 10px 0;
            padding: 0 20px;
            font-weight: normal;
        }
        strong{
            color: #000;
        }
    }
    .body_left{
        float: left;
        padding: 0 20px;
        margin-right: 100px;
        /*width: 300px;*/
        width: 340px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        p{
            margin: 30px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        strong{
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .item_one{
        float: left;
        padding-left: 20px;
        box-sizing: border-box;
        .company_name{
            margin-top: 10px;
        }
    }
    .changeMes{
        /*float: right;*/
        position: absolute;
        right: 0;
        margin-top: 20px;
    }
    .company_item{
        float: left;
        width: 100%;
        border-bottom: 1px solid #dcd4d4;
        padding: 10px 0;
    }
    .body_right{
        float: left;
        p{
            margin: 30px 0;
        }
        strong{
            color: #000;
        }
    }
    @media (min-width: 768px){
        .form-inline .form-group {
            display: inline-block;
            margin-bottom: 0;
            vertical-align: middle;
        }
    }
    @media (min-width: 768px){
        .form-inline .form-control {
            display: inline-block;
            /*width: auto;*/
            width:180px;
            vertical-align: middle;
        }
    }
    .form-control {
        display: block;
        width: 100%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    label {
        display: inline-block;
        max-width: 100%;
        margin-bottom: 5px;
        font-weight: bold;
    }
</style>
