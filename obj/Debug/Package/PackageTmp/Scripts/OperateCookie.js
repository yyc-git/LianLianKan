/* cookie操作封装
*  2012-11-16
*/
var cookie = (function () {

    /*判断是否为function（是否为类）*/
    var IsFunction = function (func) {
        return typeof func == "function";
    };

    //去掉两边空白
    var trim = function (info) {

        //replace(/&nbsp;/g, "")：消去&nbsp;（&nbsp;用于解决在360下如果没有内容时不显示单元格的问题）
        return info.replace(/^\s*/, "").replace(/\s*$/, "").replace(/&nbsp;/g, "");
    };

    /*解码*/
    var decode = function (str) {
        var _str = decodeURIComponent(str);
        _str = _str.replace(/\+/g, " "); //将+号替换为空格
        return _str;
    };


    return {
        /*封装SetCookie（处理异常）*/
        TrySetCookie: function (objName, objValue, objHours, func) {
            try {
                //            alert("cookie=" + document.cookie);
                this.SetCookie(objName, objValue, objHours);   //要设置expires，否则会出现错误！！！
                //            alert("after write   cookie="+document.cookie);
            }
            catch (e) {
                alert("写入Cookie操作失败！您可能禁用了Cookie");
            }
            finally {
                if (IsFunction(func)) {
                    func();
                }
                else {  //func为url
                    if (func) {
                        //                    window.open(func); //打开新页面，跳转到对应模块
                        window.location.href = func;    //跳转到对应模块
                    }
                }
            }
        },



        //    /*设置cookie。要设置expires，否则会出现错误！*/
        SetCookie: function (objName, objValue, objHours) {
            //    if (this.GetCookie(objName) != "no"){
            //        alert("Exist!");
            //        this.ClearCookie(objName);
            //        alert("delete cookie="+document.cookie);
            //    }
            //        try {
            var str = objName + "=" + escape(objValue);
            var date = new Date();
            var ms = null;
            if (objHours > 0) {                               //为时不设定过期时间，浏览器关闭时cookie自动消失
                ms = objHours * 3600 * 1000;
            }
            else {
                ms = 1 * 3600 * 1000;   //默认为1小时。此处要设置过期时间！否则会出现错误！！！详见“6-27备忘:cookie的问题”
            }
            date.setTime(date.getTime() + ms);
            str += ";expires=" + date.toGMTString() + ";path=/";   //要设置相同的path，防止删除不掉
            document.cookie = str;
            //            alert("cookie=" + document.cookie);
            if (document.cookie == "") {
                throw new Error("写入Cookie操作失败！您可能禁用了Cookie");  //如果写cookie失败，则抛出异常
                //                alert("写入Cookie操作失败！您可能禁用了Cookie");
                //                return;
            }
            //        }
            //        catch (e) {
            //        }
        },
        //SetCookie: function (name, value, option) {
        //    //用于存储赋值给document.cookie的cookie格式字符串
        //    var str = name + "=" + escape(value);
        //    if (option) {
        //        //如果设置了过期时间
        //        if (option.expireDays) {
        //            var date = new Date();
        //            var ms = option.expireDays * 24 * 3600 * 1000;
        //            date.setTime(date.getTime() + ms);
        //            str += "; expires=" + date.toGMTString()+";path=/";
        //        }
        //        if (option.path) str += "; path=" + path;   //设置访问路径
        //        if (option.domain) str += "; domain" + domain; //设置访问主机
        //        if (option.secure) str += "; true";    //设置安全性
        //    }
        //    document.cookie = str;
        //},
        ////删除cookie
        //ClearCookie: function (name) {
        //    this.SetCookie(name, "", { expireDays: -1 }); //将过期时间设置为过去来删除一个cookie
        //},
        /*获得cookie
        成功返回value
        失败返回"no"*/
        GetCookie: function (name) {
            //     alert(document.cookie);
            //        if (document.cookie == "") {
            //            alert("获取Cookie操作失败！您可能禁用了Cookie");
            //            return;
            //        }
            var arrStr = document.cookie.split(";");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                if (trim(temp[0]) == name) {
                    //        alert("get="+document.cookie);
                    return decode(temp[1]);
                }
            }
            return "no";
        },
        /*删除cookie
        */
        ClearCookie: function (name) {
            //     alert("clear!");
            //alert("before delete = "+ document.cookie);
            var exp = new Date();
            exp.setTime(exp.getTime() - 10000);
            document.cookie = name + "=;expires=" + exp.toGMTString() + ";path=/";
            //        alert("after delete = "+ document.cookie);
        }
    }
})();