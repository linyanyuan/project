var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
//编码方法
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
//解码的方法
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    while(i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if(c1 == -1)
            break;
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if(c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if(c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if(c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    i = 0;
    out = "";
    return out;
}
//
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
        c = str.charCodeAt(i++);
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += str.charAt(i-1);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
//设置cookie
function setCookie(name,value,expires,path,domain,secure) {
    var cookieText = name + "=" + value;
    if(expires){
        var date=new Date();
        date.setDate(date.getDate() +expires);
        cookieText += ";expires=" + date;
    }
    if(path){
        cookieText += ";path=" + path;
    }
    if(domain){
        cookieText += ";domain=" + domain;
    }
    if(secure){
        cookieText += ";srcure";
    }
    document.cookie = cookieText;
}
//读取cookie
function getCookie(name) {
    var cookieName = name;
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if(cookieStart > -1){
        var cookieEnd = document.cookie.indexOf(";",cookieStart);
        if(cookieEnd == -1){
            cookieEnd = document.cookie.length;
        }
        cookieValue = document.cookie.substring((cookieStart + cookieName.length + 1),cookieEnd);
    }

    return cookieValue
}
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    /***
     * 获得当前时间
     */
    getCurrentDate() {
        return new Date();
    },
    /**
     * 获得上一月的起止日期
     * ***/
    getPreviousMonth () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //获得上一个月的第一天
        var priorMonthFirstDay = this.getPriorMonthFirstDay(currentYear, currentMonth);
        //获得上一月的最后一天
        var priorMonthLastDay = new Date(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth(), this.getMonthDays(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth()));
        //添加至数组
        startStop.push(priorMonthFirstDay);
        startStop.push(priorMonthLastDay);
        //返回
        return startStop;
    },
    /**
     * 获得该月的天数
     * @param year年份
     * @param month月份
     * */
    getMonthDays(year, month) {
        //本月第一天 1-31
        var relativeDate = new Date(year, month, 1);
        //获得当前月份0-11
        var relativeMonth = relativeDate.getMonth();
        //获得当前年份4位年
        var relativeYear = relativeDate.getFullYear();

        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if (relativeMonth == 11) {
            relativeYear++;
            relativeMonth = 0;
        } else {
            //否则只是月份增加,以便求的下一月的第一天
            relativeMonth++;
        }
        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //下月的第一天
        var nextMonthDayOne = new Date(relativeYear, relativeMonth, 1);
        //返回得到上月的最后一天,也就是本月总天数
        return new Date(nextMonthDayOne.getTime() - millisecond).getDate();
    },
    /**
     * 获得本月的起止日期
     * ***/
    getPreviousNowMonth () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获取当前日
        var day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //获得本月的第一天
        var priorMonthFirstDay = new Date(currentYear,currentMonth,1);
        //获得上一月的最后一天
        var priorMonthLastDay = new Date(currentYear,currentMonth,day);
        //添加至数组
        startStop.push(priorMonthFirstDay);
        startStop.push(priorMonthLastDay);
        //返回
        return startStop;
    },
    /**
     * 获得上月的月份   Y-M
     * ***/
    getPreMonth () {
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth()+1;
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        var preMonth;
        //获得本月的第一天
        if(currentMonth - 1 === 0){
            //说明是上一年的
            currentMonth = 12;
            currentYear--;
        }
        currentMonth--;
        if(currentMonth<10){
            currentMonth = '0'+currentMonth;
        }
        preMonth = currentYear+'-'+currentMonth;
        //返回
        return preMonth;
    },
    getPriorMonthFirstDay(year, month) {
        //年份为0代表,是本年的第一月,所以不能减
        if (month == 0) {
            month = 11; //月份为上年的最后月份
            year--; //年份减1
            return new Date(year, month, 1);
        }
        //否则,只减去月份
        month--;
        return new Date(year, month, 1);
    },
    getNowMonthFirstDay(year, month) {
        //年份为0代表,是本年的第一月,所以不能减
        if (month == 0) {
            month = 11; //月份为上年的最后月份
            year--; //年份减1
            return new Date(year, month, 1);
        }
        //否则,只减去月份
        month--;
        return new Date(year, month, 1);
    },
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatDate: {


        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }

    },
    base64encode:base64encode,
    base64decode:base64decode,
    utf16to8:utf16to8,
    utf8to16:utf8to16,
    setCookie:setCookie,
    getCookie:getCookie,
    loadFile:function (url) {
        window.open(url);
    },
    //日期转换
    dateToNormal:function(d){
        var day = d.getDate()<10? '0'+d.getDate() : d.getDate();
        var month = (d.getMonth() + 1) <10? '0'+(d.getMonth() + 1) : (d.getMonth() + 1);
        const dates = d.getFullYear() + '-' + month + '-' + day;
        return dates;
    },
    //6-20位 数字字母密码验证
    isvalidPassword:function(str){
        //const reg = /^[0-9A-Za-z]{6,20}$/;
        const reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
        //const reg1 =/[0-9a-z]/i;
        return reg.test(str);
    },
    // 手机号验证
    isvalidPhone:function(str) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        return reg.test(str)
    },
    isvalidCard:function(str){
        const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;//身份证号的正则表达式
        return reg.test(str)
    },
    //邮箱验证
    isvalidEmail:function(str) {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return reg.test(str)
    },
    //是否为整型 验证
    isInteger(str) {
        // const reg = /^\+?[1-9][1-9]*$/;
        const reg = /^([1-9]\d*|[0]{1,1})$/;
        return reg.test(str)
    },
    //判断登陆用户  数字 字母 下划线 且 长度大于2
    isvalidUser(str){
        const  reg = /^[0-9a-zA-z_]{2,}$/;
        return reg.test(str)
    },
    //过滤任务名称 特殊字符
    isvalidTaskName(str){
        const pattern = /^[\w\u4e00-\u9fa5]+$/gi;
        return pattern.test(str)
    },
    isvalidTaskPort(str){
        const reg = /^[A-Za-z]+$/;
        return reg.test(str)
    }
};
