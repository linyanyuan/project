
//用户 页数  条数
import * as types from './types';
/*export const actions = {
    setCompanyList({commit}, status){
        commit(types.COMPANYLIST, status)
    }
};*/
export const setCompanyList = ({commit}, status) =>{
    commit(types.COMPANYLIST, status)
};
export const setActive = ({commit}, status) =>{
    commit(types.ACTIVE, status)
};
//更新未读条数
export const upDataTotle = ({commit}, status) =>{
    commit(types.TOTLE, status)
};
