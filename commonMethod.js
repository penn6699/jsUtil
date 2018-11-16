
//url是否带有参数
function IsUrlHasArgument(url) {
    return /[\?\&]\w+=([^&]*)/.test(url + "");
}

//获取来自地址栏（URL）中的一个参数值
function getQueryString(key) {
    /// <summary>获取来自地址栏（URL）中的某个参数值</summary>
    /// <param name="key" type="String">参数名称</param>
    /// <returns type="String" />
    var regExp = new RegExp("[\?|\&]" + key + "=([^&]+)"); //  new RegExp("[\?\&]" + key + "=([^\&]+)(&|$)");
    var matchStrings = window.location.search.match(regExp);
    return matchStrings && decodeURIComponent(matchStrings[1]);
}

//获取来自地址栏（URL）中的所有参数值
function getQueryStrings() {
    /// <summary>获取来自地址栏（URL）中的所有参数值</summary>
    /// <returns type="Json" />

    var matchStrings = window.location.search.match(/[\?\&]\w+=([^&]*)/g);
    var retJson = {}
    for (var i = 0; i < matchStrings.length; i++) {
        retJson[matchStrings[i].match(/\w+/)[0]] = decodeURIComponent(matchStrings[i].split('=')[1]);
    }
    return retJson;
}

//获取文件扩展名
function getFileExtension(fileName) {
    //自定义扩展名
    var StaticExt = [
		".fastq.gz",
		".fq.gz",
		".clean.fastq.gz",
		".clean.fq.gz"
    ];
    //按长度大到小排序
    StaticExt = StaticExt.sort(function (a, b) { return a.length < b.length; });

    fileName = fileName.toLowerCase();
    var rExt = "";
    for (var i = 0; i < StaticExt.length; i++) {
        if (new RegExp(StaticExt[i] + "$").test(fileName)) {
            rExt = StaticExt[i];
            break;
        }
    }
    if (rExt == "") {
        var m = fileName.match(/([.]{1}\w+)$/g);
        rExt = m ? m[0] : "";
    }
    return rExt;
}

//获取文件名（没有扩展名）
function GetFileNameWithoutExtension(fileName) {
    var ext = "";
    if (typeof (getFileExtension) !== "undefined") {
        ext = getFileExtension(fileName);
    } else {
        var m = fileName.match(/([.]{1}\w+)$/g);
        ext = m ? m[0] : "";
    }
    return fileName.replace(new RegExp(ext + "$"), "");
}

//获取当前js文件的目录路径，以“/”结尾【只在js文件中使用】
function CurrentJsFileDir() {
    var jsPath = document.currentScript ? document.currentScript.src : function () {
        var js = document.scripts
        , last = js.length - 1
        , src;
        for (var i = last; i > 0; i--) {
            if (js[i].readyState === 'interactive') {
                src = js[i].src;
                break;
            }
        }
        return src || js[last].src;
    }();
    return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
}


//跳转页面，带有回跳地址
function Redirect(url, isreturn, target) {
    var _isreturn = isreturn == undefined ? true : isreturn,
        _target = target || "_parent",
        _returnurl = location.href.replace(location.protocol + "//" + location.host, ""),
        _flag = /\?/.test(url) ? "&" : "?",
        _href = url + (_isreturn ? _flag + "returnurl=" + encodeURI(_returnurl) : "");

    $('<a target="' + _target + '" style="display:none;"><span>redirect</span>></a>').attr("href", _href).appendTo("body").find("span").click();
}

//全局唯一标识符GUID,类似.net中的NewID();
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//全局唯一标识符（UUID）。使用uuid()或uuid(len, radix) len 为长度, radix为进制基数2,10,16,...。
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//获取 Constructor 的名称
function getConstructorName(obj) {
    var _getFunctionName = function (callee) {
        var _callee = callee.toString().replace(/[\s\?]*/g, ""),
        comb = _callee.length >= 50 ? 50 : _callee.length;
        _callee = _callee.substring(0, comb);
        var name = _callee.match(/^function([^\(]+?)\(/);
        if (name && name[1]) {
            return name[1];
        }
        var caller = callee.caller,
        _caller = caller.toString().replace(/[\s\?]*/g, "");
        var last = _caller.indexOf(_callee),
        str = _caller.substring(last - 30, last);
        name = str.match(/var([^\=]+?)\=/);
        if (name && name[1]) {
            return name[1];
        }
        return "anonymous"
    }
    return _getFunctionName(obj.constructor);
}

//是否Json对象
function isJsonObject(obj) {
	try{
		return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	}
	catch (err) {
		return false;
	}
}



