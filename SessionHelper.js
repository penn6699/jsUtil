
//当前会话
var SessionHelper = {

    //登录
    logon: function (data) {
        //session:{"token":"","payload":{"sub":"userid","exp":0,"iat":0,"username":"","usertype":""}}}
        localStorage["session"] = JSON.stringify(data);

        if (!CookieHelper.get("MySessionID")) {
            CookieHelper.set("MySessionID", data.MySessionID, 1000 * 60 * 60 * 24);
        }
        var href = getQueryString("returnurl") || "/index.html";
        $('<a target="_parent" style="display:none;"><span>span</span>></a>').attr("href", href).appendTo("body").find("span").click();
    },
    //退出
    logout: function () {
        $.ajax({
            url: ApiHost + "/Users/Logout",
            type: "get",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    localStorage.removeItem("session");
                    var win = window.parent || window;
                    var location = win.location;
                    var returnurl = location.href.replace(location.protocol + "//" + location.host, "");
                    var _href = "/user/login.html?returnurl=" + encodeURI(returnurl);
                    $('<a target="_parent" style="display:none;"><span>span</span>></a>').attr("href", _href).appendTo("body").find("span").click();
                } else {
                    layer.alert(res.message);
                }
            }

        });

    },
    //在线否
    isOnline: function () {
        var session = localStorage["session"] || null;
        if (session) {
            session = typeof (session) == "string" ? (JSON.parse(session) || {}) : session;
            var exp = session["Expire"] || 0;
            return exp > Math.round(new Date().getTime() / 1000);
        } else {
            return false;
        }

    },
    //当前用户
    getUser: function () {
        var session = localStorage["session"];
        session = session ? JSON.parse(localStorage["session"]) || {} : {};
        return $.extend({
            userID: session["userid"] || null,
            userName: session["username"] || null,
            userType: session["usertype"] || null
        }, session);

    }
};
