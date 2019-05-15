const Login = () => import('./views/Login/Login.vue');//登陆
const NotFound = r => require.ensure([], () => r(require('./views/other/404.vue')), 'NotFound');//404
const forgetPwd = r => require.ensure([], () => r(require('./views/other/forgetPwd.vue')), 'forgetPwd');//忘记密码

/*首页部分*/
const Home = r => require.ensure([], () => r(require('./views/Home.vue')), 'Home');//主路由
const Index = r => require.ensure([], () => r(require('./views/Home/Index.vue')), 'Index');
/*任务管理*/
const Task = r => require.ensure([], () => r(require('./views/Task/Task.vue')), 'Task');
/*结算管理*/
const BalanceIndex = r => require.ensure([], () => r(require('./views/Balance/BalanceIndex.vue')), 'BalanceIndex');
const Balance = r => require.ensure([], () => r(require('./views/Balance/Balance.vue')), 'Balance');
//结算表单上传
const BalanceUpdata = r => require.ensure([], () => r(require('./views/Balance/BalanceUpdata.vue')), 'BalanceUpdata');
//结算单详情
const BalanceDetails = r => require.ensure([], () => r(require('./views/Balance/BalanceDetails.vue')), 'BalanceDetails');
/*账户管理*/
const Account = r => require.ensure([], () => r(require('./views/Account/Account.vue')), 'Account');
/*消息中心*/
const Message = r => require.ensure([], () => r(require('./views/Message/Message.vue')), 'Message');
const messageIndex = r => require.ensure([], () => r(require('./views/Message/messageIndex.vue')), 'messageIndex');
const MessageDetails = r => require.ensure([], () => r(require('./views/Message/MessageDetails.vue')), 'MessageDetails');//消息详情
/*发票管理*/
const invoiceIndex = r => require.ensure([], () => r(require('./views/invoice/invoiceIndex.vue')), 'invoiceIndex');
const invoice = r => require.ensure([], () => r(require('./views/invoice/invoice.vue')), 'invoice');
const logistics = r => require.ensure([], () => r(require('./views/invoice/logistics.vue')), 'logistics');//物流详情
const invoiceDetails = r => require.ensure([], () => r(require('./views/invoice/invoiceDetails.vue')), 'invoiceDetails');//发票结算单详情
/*报表统计*/
const Report = r => require.ensure([], () => r(require('./views/Report/Report.vue')), 'Report');
const RealReport = r => require.ensure([], () => r(require('./views/Report/RealReport.vue')), 'RealReport');
/*企业中心*/
const company = r => require.ensure([], () => r(require('./views/companyCenter/company.vue')), 'company');
const Safe = r => require.ensure([], () => r(require('./views/companyCenter/Safe.vue')), 'Safe');//安全设置
const Password = r => require.ensure([], () => r(require('./views/companyCenter/Password.vue')), 'Password');//修改密码
const Binding = r => require.ensure([], () => r(require('./views/companyCenter/Binding.vue')), 'Binding');//绑定管理
const contract = r => require.ensure([], () => r(require('./views/companyCenter/contract.vue')), 'contract');//合同管理
/*let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
   /!* {
        path:'/home',
        component:Home,
        name: '首页',
        order:true,
        iconCls: 'fa fa-credit-card-alt',
        children:[
            { path: '/home/index', component: Index, name: '首页'}
        ]
    },*!/
    {
        path: '/home',
        component: Home,
        name: '首页',
        redirect: { path: '/home/index' },
        iconCls: 'fa fa-home fa-lg',
    },
    {
        path: '/',
        component: Home,
        redirect: { path: '/home/index' }
    },
    {
        path: '/home/index',
        component: Home,
        name: '首页',
        child:false,
        iconCls: 'fa fa-home fa-lg',
        order:true,
        children: [
            { path: '/home/index', component: Index, name: '主页'}
        ]
    },
    {
        path: '/home/task',
        component: Home,
        name: '任务管理',
        child:false,
        iconCls: 'fa fa-tasks',
        order:true,
        children: [
            { path: '/home/task', component: Task, name: '任务'}
        ]
    },
    {
        path: '/home/balance',
        component: Home,
        name: '结算管理',
        child:false,
        iconCls: 'fa fa-calendar-minus-o',
        order:true,
        children: [
            { path: '/home/balance', component: Balance, name: '结算'}
        ]
    },
    {
        path: '/home/balance',
        component: Home,
        name: '结算管理',
        iconCls: 'fa fa-calendar-minus-o',
        children: [
            { path: '/home/balanceUpdata', component: BalanceUpdata, name: '上传结算单'}
        ]
    },
    {
        path: '/home/balance',
        component: Home,
        name: '结算管理',
        iconCls: 'fa fa-calendar-minus-o',
        children: [
            { path: '/home/balanceDetails', component: BalanceDetails, name: '结算单详情'}
        ]
    },
    {
        path: '/home/Account',
        component: Account,
        name: '账户管理',
        iconCls: 'fa fa-money',
        order:true,
        child:false,
        children: [
            { path: '/home/Account', component: Account, name: '账户详情'},
        ]
    },
    {
        path: '/home/invoice',
        component: Home,
        name: '发票管理',
        iconCls: 'fa fa-list-ul',
        order:true,
        children: [
            { path: '/home/invoice', component: invoice, name: '发票列表'}
        ]
    },
    {
        path: '/home/invoice',
        component: Home,
        name: '发票管理',
        iconCls: 'fa fa-calendar-minus-o',
        children: [
            { path: '/home/invoiceDetails', component: invoiceDetails, name: '关联结算单列表'}
        ]
    },
    {
        path: '/home/Report',
        component: Home,
        name: '报表统计',
        iconCls: 'fa fa-database',
        order:true,
        child:false,
        children: [
            { path: '/home/Report', component: Report, name: '报表统计'},
            { path: '/home/RealReport', component: RealReport, name: '精确统计'}
        ]
    },
    {
        path: '/home/company',
        component: Home,
        name: '企业中心',
        iconCls: 'fa fa-building',
        order:true,
        child:true,
        children: [
            { path: '/home/company', component: company, name: '企业信息'},
            {
                path: '/home/Safe',
                component: Safe,
                name: '安全设置',
                redirect: { path: '/home/Safe/password' },
                children: [
                    {
                        path: '/home/Safe/password',
                        component: Password,
                        name: '修改密码'
                    },
                    {
                        path: '/home/Safe/binding',
                        component: Binding,
                        name: '绑定管理'
                    },
                ]
            },
            { path: '/home/contract', component: contract, name: '合同管理'}
        ]
    },
    {
        path: '/home/message',
        component: Home,
        name: '消息通知',
        children: [
            { path: '/home/message', component: Message, name: '消息'}
        ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];*/
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/forgetPwd',
        component: forgetPwd,
        name: '忘记密码',
        hidden: true
    },
    {
        path: '/home',
        component: Home,
        name: '首页',
        redirect: { path: '/home/index' },
        children: [
            { path: '/home/index', component: Index, name: '主页'},
            { path: '/home/task', component: Task, name: '任务管理'},
            {
                path: '/home/balanceIndex',
                component: BalanceIndex,
                name: '结算管理',
                redirect: { path: '/home/balanceIndex/balance' },
                children: [
                    {
                        path: '/home/balanceIndex/balance',
                        component: Balance,
                        name: '结算列表'
                    },
                    {
                        path: '/home/balanceIndex/balanceUpdata',
                        component: BalanceUpdata,
                        name: '上传结算单'
                    },
                    {
                        path: '/home/balanceIndex/balanceDetails',
                        component: BalanceDetails,
                        name: '结算单详情'
                    },
                ]
            },
           /* { path: '/home/balance', component: Balance, name: '结算管理'},
            { path: '/home/balanceUpdata', component: BalanceUpdata, name: '上传结算单'},
            { path: '/home/balanceDetails', component: BalanceDetails, name: '结算单详情'},*/
            { path: '/home/Account', component: Account, name: '账户详情'},
            {
                path: '/home/invoiceIndex',
                component: invoiceIndex,
                name: '发票管理',
                redirect: { path: '/home/invoiceIndex/invoice' },
                children: [
                    {
                        path: '/home/invoiceIndex/invoice',
                        component: invoice,
                        name: '发票列表'
                    },
                    {
                        path: '/home/invoiceIndex/logistics',
                        component: logistics,
                        name: '物流信息'
                    },
                    {
                        path: '/home/invoiceIndex/invoiceDetails',
                        component: invoiceDetails,
                        name: '关联结算单列表'
                    },
                ]
            },
            /*{ path: '/home/invoice', component: invoice, name: '发票列表'},
            { path: '/home/logistics', component: logistics, name: '物流信息'},
            { path: '/home/invoiceDetails', component: invoiceDetails, name: '关联结算单列表'},*/
            { path: '/home/Report', component: Report, name: '报表统计'},
            { path: '/home/RealReport', component: RealReport, name: '精确统计'},
            { path: '/home/company', component: company, name: '企业信息'},
            {
                path: '/home/Safe',
                component: Safe,
                name: '安全设置',
                redirect: { path: '/home/Safe/password' },
                children: [
                    {
                        path: '/home/Safe/password',
                        component: Password,
                        name: '修改密码'
                    },
                    {
                        path: '/home/Safe/binding',
                        component: Binding,
                        name: '绑定管理'
                    },
                ]
            },
            { path: '/home/contract', component: contract, name: '合同管理'},
            {
                path: '/home/messageIndex',
                component: messageIndex,
                name: '消息管理',
                redirect: { path: '/home/messageIndex/message' },
                children: [
                    {
                        path: '/home/messageIndex/message',
                        component: Message,
                        name: '消息通知'
                    },
                    {
                        path: '/home/messageIndex/messageDetails',
                        component: MessageDetails,
                        name: '消息详情'
                    }
                ]
            }

        ]
    },
    {
        path: '/',
        component: Home,
        redirect: { path: '/login' }
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    /*{
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }*/
];
export default routes;
