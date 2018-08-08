//Cookie助手
var CookieHelper = {
    //设置cookie
    "set": function (name, value, times) {
        this.delete(name);
        if (typeof (times) == "undefined") {
            times = 24 * 60 * 60 * 1000;
        }
        var exp = new Date();
        exp.setTime(exp.getTime() + times);
        document.cookie = name + "=" + escape(value) + ";path=/;domain=" + location.hostname + ";expires=" + exp.toGMTString();
    },

    //读取cookies 
    "get": function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },

    //删除cookies 
    "delete": function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 50);
        var value = this.get(name);
        if (value != null) {
            document.cookie = name + "=" + escape(value) + ";path=/;domain=" + location.hostname + ";expires=" + exp.toGMTString();
        }
    }
};
