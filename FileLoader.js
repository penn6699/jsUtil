/*
 *加载器
 *created by zhiping.lin
*/

//文件加载器
var FileLoader = (function () {

    //加载css文件
    function _loadCSS(url, callback) {
        //<link href="static/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
        var link = document.createElement("link");
        link.className = "file-loader";
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url + "?d=" + new Date().getTime();

        var head = document.getElementsByTagName('head')[0];
        if (head.childNodes.length > 0) {
            head.insertBefore(link, head.childNodes[document.querySelectorAll(".file-loader").length]);
        }
        else {
            head.appendChild(link);
        }

        if (callback) {
            callback.call(this);
        }

    }

    //加载js文件
    function _loadJS(url, callback) {
        var _this = this;

        var script = document.createElement("script");
        script.className = "file-loader";
        script.type = "text/javascript";
        script.src = url+"?d="+new Date().getTime();
        
        var head = document.getElementsByTagName('head')[0];
        if (head.childNodes.length > 0) {
            head.insertBefore(script, head.childNodes[document.querySelectorAll(".file-loader").length]);
        }
        else {
            head.appendChild(script);
        }
        
        //js加载完成执行方法
        script.onload = script.onreadystatechange = function () {
            if (callback && (!this.readyState //is onload
                || this.readyState == 'loaded' || this.readyState == 'complete'   // IE的onreadystatechange
            )) {
                callback.call(_this);
            }
            //console.log(this, this.readyState);
        };

    }

    //加载js文件
    function loadJS(url, callback) {
        var urls = !Array.isArray(url) ? [url] : url;

        var _url = urls.shift();
        _loadJS(_url, function () {
            if (urls.length > 0) {
                loadJS(urls, callback)
            } else {
                if (callback) {
                    callback.call(this);
                }
            }
        });

    }

    //加载css文件
    function loadCSS(url, callback) {
        var urls = !Array.isArray(url) ? [url] : url;

        var _url = urls.shift();
        _loadCSS(_url, function () {
            if (urls.length > 0) {
                loadCSS(urls, callback)
            } else {
                if (callback) {
                    callback.call(this);
                }
            }
        });

    }

    //加载 css或js 文件
    function load(url, callback) {
        var urls = !Array.isArray(url) ? [url] : url;

        var _url = urls.shift().replace(/\s+$/, '').toLowerCase();

        if (/([.]{1}css)$/.test(_url)) {
            _loadCSS(_url, function () {
                if (urls.length > 0) {
                    load(urls, callback)
                } else {
                    if (callback) {
                        callback.call(this);
                    }
                }
            });
        }
        else if (/([.]{1}js)$/.test(_url)) {
            _loadJS(_url, function () {
                if (urls.length > 0) {
                    load(urls, callback)
                } else {
                    if (callback) {
                        callback.call(this);
                    }
                }
            });
        }

    }

    return {
        loadJS: loadJS
        , loadCSS: loadCSS
        , load: load
    };

}());












