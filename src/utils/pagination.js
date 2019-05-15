/*
* 分页插件
* */

/*
* @params  datas源数据   pageSize每页条数   currentPage页数
* */
export default {
    Pagination(datas,pageSize,currentPage){
        this.paginationDatas = datas;//存储 总数据
        this.pageSize = pageSize;//每页条数
        this.currentPage = currentPage;// 需要获取的页数
        this.tablesDatas = [];//处理好的总数据
        // 根据初始页数 处理源数据
         this.initDatas = function(datas){
             if(datas){
                 this.paginationDatas = datas;
             }
            this.tablesDatas = [];
            let length = this.paginationDatas.length;//源数据的 总条数
            //源数据 需要划分 num 个 数据  每个pageSize条
            let num = length % this.pageSize ? parseInt(length / this.pageSize) +1 : length / this.pageSize;
            let arr = [],a = 0;//存放数据
            for(let i = 0,l = length;i<l;i++){
                arr.push(this.paginationDatas[i]);
                a++;
                if(a === this.pageSize){
                    //存够 pageSize条了
                    this.tablesDatas.push(arr);
                    arr = [];
                    a = 0;
                }
            }
            //剩下的arr是余下的几条
             this.tablesDatas.push(arr);
        };
        //获取总条数
        this.getTotalNum = function(){
            return this.paginationDatas.length;
        };
        //获取 currentPages 页的数据
        this.getCurrentDatas = function(currentPage){
            this.currentPage = currentPage;
            return this.tablesDatas[currentPage]
        };
        //改变 pageSize  改变每页条数
        this.changePageSize = function(pageSize){
            this.pageSize = pageSize;
            this.initDatas();//重新初始化数据
        };
        this.initDatas();
    }
}
