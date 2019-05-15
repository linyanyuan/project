import * as types from "./types";

/*export const getCompanyList= state => {
    //console.log(state.companyList)
    if(state.companyList.length>0){
        return state.companyList
    }else{
      /!*  findChildCompanyList().then(res=>{
            state.companyList = res.data;
            return state.companyList;
        });*!/
        let datas = findChildCompanyLists(function(temp){
            /!*let all = {
                cId:'',
                name:'全部'
            };
            temp.unshift(all);*!/
            state.companyList = temp;
            return state.companyList;
        });
        return datas;
    }
};*/

//active
export const getActive = state =>{
    return state.active;
};
//获取 totle 总未读条数
export const getTotle = state =>{
    return state.totle;
};



