

//当前会话
(function () {

    //SessionKey 与 Key 转换 -----------------------------------start

    //随机4位16进制字符串
    function S4() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); }

    //全局唯一标识符GUID,类似.net中的NewID();
    function guid() { return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()); }

    //创建SessionID
    function createSessionID() { return S4() + S4(); }
    //获取Session ID
    function _getSessionID() {
        var SessionID = sessionStorage["SessionID"];
        if (!SessionID) {
            SessionID = createSessionID();// guid();
            sessionStorage["SessionID"] = SessionID;
        }
        return SessionID;
    }

    function _getSessionKey(key) {
        return key + "_" + _getSessionID();
    }

    function _getKey(SessionKey) {
        var _SessionKey = SessionKey + "",
            reg = new RegExp("_" + _getSessionID() + "$");
        return reg.test(_SessionKey) ? _SessionKey.replace(reg, "") : null;
    }

    //SessionKey 与 Key 转换 -----------------------------------end

    //设置数据
    function set(key, value) {
        sessionStorage[_getSessionKey(key)] = JSON.stringify({ "value": value });
    }

    //获取数据
    function get(key) {
        var _value = sessionStorage[_getSessionKey(key)];
        return _value ? (JSON.parse(_value)["value"] || null) : null;
    }

    //是否存在
    function exists(key) {
        return sessionStorage[_getSessionKey(key)] ? true : false;
    }

    //移除
    function remove(key) {
        sessionStorage.removeItem(_getSessionKey(key));
    }

    //清空
    function clear() {
        for (var ind = 0; ind < sessionStorage.length; ind++) {
            var _key = sessionStorage.key(ind),
                key = _getKey(_key);
            if (key) {
                sessionStorage.removeItem(_key);
            }
        }
    }

    //获取所有键
    function getKeys() {
        var _keys = [];        
        for (var ind = 0; ind < sessionStorage.length; ind++) {
            var _key = sessionStorage.key(ind),
                key = _getKey(_key);
            if (key) {
                _keys.push(key);
            }
        }
        return _keys;
    }

    //获取所有值
    function getValues() {
        var _values = [];
        for (var ind = 0; ind < sessionStorage.length; ind++) {
            var _key = sessionStorage.key(ind),
                key = _getKey(_key);
            if (key) {
                _values.push(get(key));
            }
        }
        return _values;
    }

    //获取所有数据
    function getDatas() {
        var _datas = {};
        for (var ind = 0; ind < sessionStorage.length; ind++) {
            var _key = sessionStorage.key(ind),
                key = _getKey(_key);
            if (key) {
                _datas[key] = get(key);
            }
        }
        return _datas;
    }

    //获取长度
    function getLength() {
        return getKeys().length; 
    }
	
	//当前会话
    window.session =  {
        getSessionID: _getSessionID
        , getLength: getLength
        , set: set
        , get: get
        , exists: exists
        , remove: remove
        , clear: clear
        , getKeys: getKeys
        , getValues: getValues
        , getDatas: getDatas
    };
}());




