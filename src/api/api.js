let jq = $;
const base = configAll.serviceUrl.base;
const base1 = configAll.serviceUrl.base1;//暂时无用
const base2 = configAll.serviceUrl.base2;//暂时无用
const base3 = configAll.serviceUrl.base;//
const base4 = configAll.serviceUrl.base;//ceshi

let cookie = jq.cookie('CsrfRandomToken');
function getCookie() {
    console.log('准备发cookie');
    if(!cookie){
        console.log('准备发cookie');
        jq.ajax({
            type:'get',
            url:`${base}/payroll-enterprise/cookieCon/addCookies`,
            async:false,
            success:function (res) {
                console.log(res);
                cookie = jq.cookie('CsrfRandomToken');
                console.log(cookie,'设置Token成功!')
                return cookie
                //alert('获取到cookie了');
            }
        });
        //alert('cookie是否获取到了');
        return false
    }else{
        //alert('有cookie');
    }
}
getCookie();

//设置header加密
jq.ajaxSetup({
    beforeSend: getHeaderInfo,
    global: true,
    timeout:10000,
    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
       // console.log(XMLHttpRequest,status)
        if(status==='timeout'){//超时,status还有success,error等值的情况
            Vue.prototype.$message({
               type:'error',
               message:'请求超时'
           })
        }else if(status === 'error'){
            Vue.prototype.$message({
                type:'error',
                message:'出错了，请稍后再试'
            })
        }
    }
});

let key = true;
//header加密方法
function getHeaderInfo(XMLHttpRequest) {
    let sessionid = "CsrfRandomToken";
    cookie = jq.cookie('CsrfRandomToken');
    if(!cookie){
        if(!key){
            return false
        }
        key = false;
        jq.ajax({
            type:'get',
            url:`${base}/payroll-enterprise/cookieCon/addCookies`,
            async:false,
            beforeSend:function () {
                XMLHttpRequest.setRequestHeader(sessionid, '');
            },
            success:function (res) {
                cookie = jq.cookie('CsrfRandomToken');
                key = true;
            },
            complete:function () {
                key = true;
            }
        });
        //alert('cookie是否获取到了');
    }
    XMLHttpRequest.setRequestHeader(sessionid, cookie);
    cookie = '';
}

//在获取到未登录退出
jq( document ).ajaxSuccess(function( event, request, settings ) {
    let code;
    if(request.responseJSON && request.responseJSON.code){
        code = request.responseJSON.code;
    }
    if(code === '00000'){
        console.log(request.responseJSON);
        location.hash = "#/login";
        return false
    }
});
//全局监测返回状态
jq( document ).ajaxError(function( event, request, settings ) {
    console.log(request);
    if (request.status !== 200) {
        // alert("服务异常,请稍后重试");
        console.error("服务异常,请稍后重试",request)
    }
    if(request.status === 403){
        console.log('403');
        getCookie()
    }
});

//路由跳转  发送cookie
export const getCookies = () =>{
    jq.ajax({
        type:'get',
        url:`${base}/payroll-enterprise/cookieCon/addCookies`,
        beforeSend:function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("CsrfRandomToken", '');
        },
        async:false,
        success:function (res) {
            cookie = jq.cookie('CsrfRandomToken');
            return cookie
        }
    });
};
export const findChildCompanyLists = (callback) =>{

    jq.ajax({
        type:'get',
        //url:`${base}/payroll-enterprise/companyCon/findCompanyList`,
        url:`${base4}/payroll-enterprise/companyCon/findCompanyList`,
        success:function (res) {
            let temp = res;
            callback(temp);
        }
    });
};
/*
* 查询公司名称
* */
export const findCompanyList = params => {return jq.get(`${base}/payroll-enterprise/companyCon/findCompanyList`, params)};

export const getCompany = params => {return jq.get(`${base}/companyCon/findList`, params)};
export const loginOut = params => { return jq.get(`${base}/payroll-enterprise/user/logout`, params).then(res => res); };//登出
//获取订单请求
export const getOrder = params => { return jq.get(`${base}/orders/findCompanyOrders`, params)};//获取操作记录
/*
登陆模块
* */
//图片验证码接口
export const defaultKaptcha = `${base}/payroll-enterprise/kaptchaCon/defaultKaptcha`;
//发送短信验证码
export const sendLoginCode = params => {return jq.get(`${base}/payroll-enterprise/companyUser/sendLoginCode`, params)};
//登录
export const requestLogin = params => { return jq.post(`${base}/payroll-enterprise/user/login`, params).then(res => res); };
/*忘记密码*/
export const sendCheckPwdCode = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/sendForgetCode`, params)};//获取手机验证码
export const checkPwdCode = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/checkSForgetCode`, params)};//验证验证码
//登录账户和验证码校验
export const findLoginName = params => { return jq.post(`${base}/payroll-enterprise/companyUser/findLoginName`, params)};
//获取对接人信息
export const findDockingPeople = params => {return jq.get(`${base}/payroll-enterprise/companyCon/findDockingPeople`, params)};
export const forgetModifyPwd = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/forgetModifyPwd`, params)};//修改密码
//首页
export const getNoCheckCount = params => { return jq.get(`${base}/baseservice/resultAppearCon/getNoCheckCount`, params)};//查询未签收结果呈现的数量
//查询首页统计数量  累计金额、优化效果、累计人数和累计次数
export const getStatisticsCount = params => { return jq.get(`${base}/payroll-enterprise/cossCon/getStatisticsCount`, params)};
//查询统计报表数据
export const getStatisticsStatement = params => { return jq.get(`${base}/payroll-enterprise/cossCon/getStatisticsStatement`, params)};
export const findAnnouncement = params => { return jq.get(`${base}/baseservice/announcementCon/findAnnouncement`, params)};
//任务管理
export const findTaskPage = params => { return jq.post(`${base}/baseservice/resultAppearCon/findPage`, params)};//任务列表
export const checkResultAppear = params => { return jq.post(`${base}/baseservice/resultAppearCon/checkResultAppear`, params)};//验收
export const getResultAppearFileById = params => { return jq.get(`${base}/payroll-enterprise/resultAppearCon/getResultAppearFileById`, params)};//预览
export const downloadResultAppearFile = `${base}/payroll-enterprise/resultAppearCon/downloadResultAppearFile`;//下载


/*发票管理*/
export const invoiceList = params => { return jq.get(`${base3}/payroll-enterprise/companyInvoiceItems/companyInvoicItemsFindPager`, params)};//发票列表
export const kuaidiCon = params => { return jq.post(`${base}/baseservice/kuaidiCon/getLogisticsMessageByNumber`, params)};//物流详情
export const findByInvoiceId = params => { return jq.get(`${base3}/payroll-enterprise/companyOrderCon/findByInvoiceId`, params)};//发票单号查询关联结算单
/*企业管理*/
export const findChildCompanyList = params => { return jq.get(`${base3}/payroll-enterprise/companyCon/findChildCompanyList`, params)};//查询子公司列表


export const findCompanyById = params => { return jq.get(`${base3}/payroll-enterprise/companyCon/findCompanyById`, params)};//基本信息
export const findByCompanyId = params => { return jq.get(`${base3}/payroll-enterprise/companyCon/findByCompanyId`, params)};//开票信息
export const findCompanyAddressByCompanyId = params => { return jq.get(`${base3}/payroll-enterprise/companyAddressCon/findCompanyAddressByCompanyId`, params)};//邮寄地址
export const findListByCompanyName = params => { return jq.get(`${base3}/payroll-enterprise/companyContactsCon/findListByCompanyName`, params)};//联系人
export const findCompanyCetrifices = params => { return jq.get(`${base3}/payroll-enterprise/companyCon/findCompanyCetrifices`, params)};//营业执照信息
export const addAndUpdate = params => { return jq.post(`${base3}/payroll-enterprise/companyAddressCon/addAndUpdate`, params)};//修改、新增 邮寄地址
export const findContractConFindPage = params => { return jq.get(`${base}/baseservice/companyContractCon/findPage`, params)};//查询合同列表

/*安全管理*/
export const getNowPhone = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/getNowPhone`, params)};//获取手机号
export const sendCheckPwdCodes = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/sendCheckPwdCode`, params)};//获取手机验证码

export const checkPwdCodeSafe = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/checkPwdCode`, params)};//验证验证码
export const modifyPwd = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/modifyPwd`, params)};//修改密码
export const sendUpdatePhoneCode = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/sendUpdatePhoneCode`, params)};//企业换绑手机号获取验证码
export const checkUpdatePhoneCode = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/checkUpdatePhoneCode`, params)};//企业换绑手机号验证验证码
//企业换绑手机号获取验证码(新手机号)
export const sendUpdateNewPhoneCode = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/sendUpdateNewPhoneCode`, params)};
export const bindingPhone = params => { return jq.post(`${base3}/payroll-enterprise/companyUser/bindingPhone`, params)};//企业换绑手机号
/*消息管理*/
export const findMessagePage = params => { return jq.get(`${base3}/payroll-enterprise/systemMessageCon/findPage`, params)};//任务列表
export const readMessage = params => { return jq.post(`${base3}/payroll-enterprise/systemMessageCon/readMessage`, params)};//批量已读
export const deleteMessage = params => { return jq.post(`${base3}/payroll-enterprise/systemMessageCon/delete`, params)};//批量删除
export const findNoRead = params => { return jq.get(`${base3}/payroll-enterprise/systemMessageCon/findNoRead`, params)};//未读消息

/*
* 结算管理
* */
export const downloadModuleFile = `${base4}/payroll-enterprise/orders/downloadModuleFile`;//结算表单模板下载
export const exportCompanyOrdersItems = `${base4}/payroll-enterprise/orders/exportCompanyOrdersItems`;//结算表单单条下载
export const importSalaryOrdersView = `${base4}/payroll-enterprise/orders/importSalaryOrdersView`;//上传结算单
export const submitOrderData = params => { return jq.post(`${base4}/payroll-enterprise/orders/submitOrderData`, params)};//提交
export const delCompanyOrdes = params => { return jq.post(`${base4}/payroll-enterprise/companyOrderCon/delCompanyOrdes`, params)};//删除
export const findCompanyOrdersItems = params => { return jq.get(`${base4}/payroll-enterprise/companyOrderCon/findCompanyOrdersItems`, params)};//获取子订单明细信息
export const findCompanyOrdersDetail = params => { return jq.get(`${base4}/payroll-enterprise/companyOrderCon/findCompanyOrdersDetail`, params)};//获取主订单明细信息
export const findCompanyOrders = params => { return jq.get(`${base4}/payroll-enterprise/companyOrderCon/findCompanyOrders`, params)};//结算单列表
export const importOrder = `${base}/payroll-enterprise/orders/importSalaryOrders`;//导入订单
/*
* 账户管理
* */
export const findCompanyAccount = params => { return jq.get(`${base}/payroll-enterprise/companyFinanceCon/findCompanyAccount`, params)};//显示某公司账户余额
export const findCompanyFinance = params => { return jq.get(`${base}/payroll-enterprise/companyFinanceCon/findCompanyFinance`, params)};//公司账户明细


//上传明细
export const findUpdataAll = params => { return jq.get(`static/datas.json`, params)};//上传明细
