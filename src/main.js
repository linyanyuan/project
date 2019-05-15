import App from './App';
import store from './vuex/store';
import Vuex from 'vuex';
import routes from './router';
Vue.use(Vuex);
import { findCompanyList ,getCookies} from './api/api'
const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {

    const value = to.query.src ? to.query.src : to.path;
   // console.log(to);
    const label = to.query.titleName ? to.query.titleName : to.name;
    if (to.path === '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('order');
    }
    /*设置active*/
    if(to.path.indexOf('invoiceIndex') !== -1){
       // this.actives = '/home/invoiceIndex/invoice';
        store.commit('ACTIVE', '/home/invoiceIndex/invoice')
    }else if(to.path.indexOf('balanceIndex') !== -1){
       // this.actives = '/home/Safe'
        store.commit('ACTIVE', '/home/balanceIndex/balance')
    }else if(to.path.indexOf('Safe') !== -1){
        // this.actives = '/home/Safe'
        store.commit('ACTIVE', '/home/Safe')
    }else{
        store.commit('ACTIVE', to.path)
    }
    if(to.path !== '/login' && to.path !== '/forgetPwd' ){
        getCookies();
        let companyList = JSON.parse(sessionStorage.getItem('companyList'));//获取公司列表 是否存在
        if(companyList && companyList.length && companyList.length>0){

        }else{
            findCompanyList().then((res)=>{
                if(res){
                    sessionStorage.setItem('companyList', JSON.stringify(res));
                }
            });
        }
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    let order = JSON.parse(sessionStorage.getItem('order'));
    let jump;
    if(!configAll.control.jump){
        jump = user || order;
    }else{
        jump = true;
    }

    if (!jump && to.path !== '/login' && to.path !== '/forgetPwd') {
        next({ path: '/login' })
    }else if(!jump  && to.path === '/forgetPwd'){
        next()
    }else {
        next()
    }
});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    render: h => h(App),
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }
}).$mount('#app');
