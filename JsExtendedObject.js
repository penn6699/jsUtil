
// String start---------------------------------------------------------------------------------------

//字符串的format 调用方法如："第一名是{0}, 第二名是{1}".format("张三", "王五")); 'name={name},sex={sex}'.format({name:'xxx',sex:1});
String.prototype.format = function () {
    var args = arguments;
    //如果第一个参数是对象
    var isObject = typeof (args[0]) === 'object';
    var re = isObject ? /\{(\w+)\}/g : /\{(\d+)\}/g;
    var isNull = function (value) {
        if (typeof (value) === 'object') {
            return JSON.stringify(value) || "";
        }
        return value == null ? "" : value;
    };
    return this.replace(re, function (m, key) {
        if ((isObject && args[0][key] == undefined) || (!isObject && args[key] == undefined)) {
            return "{" + key + "}";
        }
        return isObject ? isNull(args[0][key]) : isNull(args[key]);
    });
};

//去除字符串两端的空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

//字符串是否包含一个子串
if(typeof(String.prototype.contains)==="undefined"){
	//字符串是否包含一个子串
	String.prototype.contains = function (str) {
		if (typeof (str) !== "string" || str === "") {
			return false;
		}
		var reg = new RegExp(str);
		return reg.test(this);
	};
}
// String end----------------------------------------------------------------------------------------

// Array start----------------------------------------------------------------------------------------

//获取数组元素的位置。使用实例：var b=[{name:"2"},{name:"3"},{name:"28"}];b.indexOf("name","3");var a=[1, 2, 3];a.indexOf(2);
Array.prototype.indexOf = function () {

    for (var i = 0; i < this.length; i++) {
        var val = this[i];
        if (typeof (val) === "object") {
            var key = arguments[0];
            var value = arguments[1] || null;
            if (val[key] == value) {
                return i;
            }
        }
        else if (arguments[0] == val) {
            return i;
        }
    }
    return -1;
};

//移除数组元素。使用实例：var b=[{name:"2"},{name:"3"},{name:"28"}];b.remove("name","3");var a=[1, 2, 3];a.remove(2);
Array.prototype.remove = function () {
    var index = -1;
    if (arguments.length == 1) {
        index = this.indexOf(arguments[0]);
    }
    else if (arguments.length == 2) {
        index = this.indexOf(arguments[0], arguments[1]);
    }

    if (index > -1) {
        this.splice(index, 1);
    }
};

//移除数组元素。使用实例：var a=[1, 2, 3];a.removeByIndex(2);
Array.prototype.removeByIndex = function (index) {
    var _index = typeof (index) !== "number" ? -1 : index;
    if (_index > -1) {
        this.splice(_index, 1);
    }
};

//对象数组 sort 工具 firstBy js
if (typeof (firstBy) === 'undefined') {
    /*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
    !function (n, t) { "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : n.firstBy = t() }(this, function () { var n = function () { function n(n) { return n } function t(n) { return "string" == typeof n ? n.toLowerCase() : n } function r(r, e) { if (e = "number" == typeof e ? { direction: e } : e || {}, "function" != typeof r) { var i = r; r = function (n) { return n[i] ? n[i] : "" } } if (1 === r.length) { var o = r, f = e.ignoreCase ? t : n, u = e.cmp || function (n, t) { return n < t ? -1 : n > t ? 1 : 0 }; r = function (n, t) { return u(f(o(n)), f(o(t))) } } return e.direction === -1 ? function (n, t) { return -r(n, t) } : r } function e(n, t) { var i = "function" == typeof this && !this.firstBy && this, o = r(n, t), f = i ? function (n, t) { return i(n, t) || o(n, t) } : o; return f.thenBy = e, f } return e.firstBy = e, e }(); return n });
}

//对象数组，根据字段排序。例如 [{ id: 43, population: 60 },{ id: 5, population: 30 },{ id: 44, population: 60 }].orderbyField("population desc,id")
Array.prototype.orderbyField = function (orderbystr) {
    var _this = [].concat(this);
    var _orderbyObj = null;
    var _orderbys = (orderbystr + '').split(',');
    for (var i = 0; i < _orderbys.length; i++) {
        var _orderby = _orderbys[i].replace(/(^\s*)|(\s*$)/g, '').split(' ')//去除字符串两端的空格后，再分割
            , _field = _orderby[0] || ""
            , _descending = !_orderby[1] ? undefined : _orderby[1].toLowerCase() == 'desc' ? -1 : undefined;

        if (_field) {
            if (_orderbyObj == null) {
                _orderbyObj = firstBy(_field, _descending)
            }
            else {
                _orderbyObj = _orderbyObj.thenBy(_field, _descending);
            }
        }
    }
    if (_orderbyObj) {
        return _this.sort(_orderbyObj);
    }
    return _this;

};

// Array end------------------------------------------------------------------------------------------


// Date start----------------------------------------------------------------------------------------

/*     
* 对Date的扩展，将 Date 转化为指定格式的String       
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
* eg:       
* (new Date()).toFormatString("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
* (new Date()).toFormatString("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
* (new Date()).toFormatString("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
* (new Date()).toFormatString("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
* (new Date()).toFormatString("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
*/
//日期字符串格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}
//window.alert((new Date()).format("yyyy 年 MM 月 dd 日 hh 时 mm 分 ss 秒")); 


// Date end----------------------------------------------------------------------------------------


// Number start--------------------------------------------------------------------------------------

//数字的四舍五入
Number.prototype.round = function (number) {
    return Math.round(this * Math.pow(10, number)) / Math.pow(10, number);
};



// Number end----------------------------------------------------------------------------------------













