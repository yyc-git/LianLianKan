
var operate = (function () {
    //    var operate = operate || {};
    var Start = 0;  //存储ff下光标位置
    var textarea_find_value = null; //存储ff下剩余文本(FindTextInFF方法)
    var code = null;
    var i1 = 0;

    /* 遍历数组 */
    var each = function (iterator) {
        var index = 0;
        try {
            for (var i = 0, _length = this.length; i < _length; i++) {
                iterator.call(this, this[i], index++);
            }
        }
        catch (e) {
            if (e != $break) {  //通过“throw $break;”可跳出each循环
                throw e;
            }
        }
        return this;
    }

    //            var escapes = { // Escapement translation table  
    //    '\\' : '\\',  
    //    '"' : '"',  
    //    '/' : '/',  
    //    't' : '\t',  
    //    'n' : '\n',  
    //    'r' : '\r',  
    //    'f' : '\f',  
    //   'b' : '\b'  
    //};  

    return {
        /*************************** 修改的函数 ***************************/

        //OOP框架改写了部分内容


        //修改了MyGameEngine.js 的Event部分

        //修改了MyGameEngine.js 的Base -> FormatDelegate


        /*判断是否为function（是否为类）*/
        IsFunction: function (func) {
            //            return typeof func == "function";
            return Object.prototype.toString.call(func) === "[object Function]";
        },

        //IsArray

        //IsString


        //判断浏览器类型
        Browser: {
            ie: ! -[1, ],
            //不能用===，因为navigator.appVersion.match(/MSIE\s\d/i)为object类型，不是string类型
            ie7: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 7",
            ie8: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 8",
            ie9: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 9",
            ff: navigator.userAgent.indexOf("Firefox") >= 0 && true,
            opera: navigator.userAgent.indexOf("Opera") >= 0 && true,
            chrome: navigator.userAgent.indexOf("Chrome") >= 0 && true
        },
        WrapEvent: function () {
        },
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
                if (func) {
                    if (this.IsFunction(func)) {
                        func();
                    }
                    else {  //func为url
                        if (this.IsString(func)) {
                            //                    window.open(func); //打开新页面，跳转到对应模块
                            window.location.href = func;    //跳转到对应模块
                        }
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
            //            alert("cookie=" + document.cookie);

            //            var str = objName + "=" + escape(objValue);
            /*
            最多利用的应为encodeURIComponent，它是将中文、韩文等特殊字符转换成utf-8格式的url编码，
            以是假定给背景转达参数必要利用encodeURIComponent时必要背景解码对utf-8撑持（form中的编码体例和当前页面编码体例不异）

            此处用encodeURIComponent而不用escape，因为objValue如果包含中文的话，escape编码的字符串在解码时会出问题！
            */
            //            var str = objName + "=" + encodeURIComponent(objValue);
            var str = encodeURIComponent(objName) + "=" + encodeURIComponent(objValue);
            var date = new Date();
            var ms = null;
            if (objHours > 0) {                               //如果不设定过期时间，浏览器关闭时cookie自动消失
                ms = objHours * 3600 * 1000;
            }
            else {
                ms = 1 * 3600 * 1000;   //默认为1小时。此处要设置过期时间！否则会出现错误！！！详见“6-27备忘:cookie的问题”
            }
            date.setTime(date.getTime() + ms);
            str += ";expires=" + date.toGMTString() + ";path=/";   //要设置相同的path，防止删除不掉
            document.cookie = str;
            if (document.cookie == "") {
                throw new Error("写入Cookie操作失败！您可能禁用了Cookie");  //如果写cookie失败，则抛出异常
                //                alert("写入Cookie操作失败！您可能禁用了Cookie");
                //                return;
            }
            //        }
            //        catch (e) {
            //        }
        },

        GetCookie: function (name) {
            //     alert(document.cookie);
            //        if (document.cookie == "") {
            //            alert("获取Cookie操作失败！您可能禁用了Cookie");
            //            return;
            //        }


            var arrStr = document.cookie.split(";");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                var t = this.decode(temp[0]);
                if (this.trim(this.decode(temp[0])) === name) {
                    //        alert("get="+document.cookie);
                    return this.decode(temp[1]);
                }
            }
            return "no";
        },




        //复制source到destination中(不包括source的原型链)
        //浅拷贝
        ExtendNoPrototype: function (destination, source) {
            //            var temp = {};
            for (var property in source) {
                if (source.hasOwnProperty(property)) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        /****************************************************************/



        /*************************** 新增函数 ***************************/


        /*
            任何对象，如果其语义在ECMAScript规范中被定义过，那么它被称为原生对象；
            环境所提供的，而在ECMAScript规范中没有被描述的对象，我们称之为宿主对象。

            该方法用于特性检测，判断对象是否可用。用法如下：

            MyEngine AddEvent():
            if (operate.IsHostMethod(dom, "addEventListener")) {    //判断dom是否具有addEventListener方法
                        dom.addEventListener(sEventType, fnHandler, false);
            }
        */
        //检查宿主对象是否可调用
        IsHostMethod: (function () {
        function IsHostMethod(object, property) {
        var type = typeof object[property];

        return type === "function" ||
        (type === "object" && !!object[property]) ||
        type === "unknown";
        };

        return IsHostMethod;
        } ()),




        //*以下方法用于框架iframe

        //跳转到父窗口的锚记，用于在子窗口中调用（iframe）
        //name:锚记名
        //如果在父窗口调用，也能跳转到父窗口的锚记！
        JumpToParentPosition: function (name) {
        parent.location.hash = name;
        },



        //获得页面滚动条距离
        //测试环境：ie7、9、ff、chrome
        CurrentScrollTop: function () {
        if (navigator.userAgent.indexOf("Chrome") >= 0) {
        return document.body.scrollTop;
        }
        else {
        return document.documentElement.scrollTop;
        }
        },

        //将obj绝对定位到target中中间。
        //被定位对象 定位目标 被定为对象宽度 被定为对象高度
        PositionCenter: function (obj, target, width, height) {
        var left = 0,
        top = 0,
        //            target = null,
        //            obj = null,
        target_width = 0,
        target_height = 0;
        //            100w,50h

        target = $(target);
        obj = $(obj);

        target_width = target.width();
        target_height = target.height();
        //            console.log(target_width);
        if (width > target_width || height > target_height) {
        throw new Error("被定位对象宽度或高度超过目标对象！");
        }

        //定位
        left = target.offset().left + target_width / 2 - width / 2;
        top = target.offset().top + target_height / 2 - height / 2;

        obj.css({ "top": top, "left": left, "position": "absolute" });
        },



        /*
        等待second秒后，执行NextStep。
        可指定NextStep指向obj。

        例如：
        operate.Wait(window, 3); //暂停3秒，此处指定NextStep中的this指向window
        this.NextStep = function () {   //3秒后执行的函数，里面的this已指向window
        alert("Next!");
        alert(this);
        };
        */
        Wait: function (obj, second) {
            var ind = -1,
        self = this;

            //内部函数GoOn
            //该函数把要暂停的函数放到数组window.eventList里，同时通过setTimeout来调用继续函数(NextStep)。 
            function GoOn(ind) {
                var obj = window.eventList[ind];
                window.eventList[ind] = null;
                if (obj.NextStep) obj.NextStep.call(obj, null); //这里调用后续方法
                else obj();
            };

            if (window.eventList == null) {
                window.eventList = new Array();
            }

            for (var i = 0; window.eventList.length; i++) {
                if (window.eventList[i] == null) {
                    window.eventList[i] = obj;
                    ind = i;
                    break;
                }
            }
            if (ind == -1) {
                ind = window.eventList.length;
                window.eventList[ind] = obj;
            }
            setTimeout(function () {
                GoOn(ind);  //调用内部函数GoOn
            }, second * 1000);
        },

        IsOdd: function (num) {
            return num % 2 !== 0;
        },
        //阻止默认行为
        PreventDefault: function (_e) {
            var e = _e ? _e : window.event; //兼容ie和其它浏览器
            if (operate.Browser.ie) {
                e.returnValue = false;
            }
            else {
                e && e.preventDefault();
                //                e.preventDefault();
            }
            return false;
        },
        //获得jquery集合中Dom元素最大的width和height
        GetMaxWidthHeight: function (list) {
            var maxWidth = 0,
            maxHeight = 0,
            width = 0,
            height = 0;

            list.each(function () {
                width = $(this).width();
                height = $(this).height();

                if (width > maxWidth) {
                    maxWidth = width;
                }
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });

            return { width: maxWidth, height: maxHeight };
        },
        //       MyGameEngine.Event     TriggerEvent()

        //判断是否不是对象
        IsNotObject: function (obj) {
            var result = false;

            switch (Object.prototype.toString.call(obj)) {
                case "[object String]":
                case "[object Number]":
                case "[object Boolean]":
                    result = true;
                    break
                default:
                    result = false;
                    break;
            }
            return result;
        },
        //判断是否为对象字面量（{}）
        IsObject: function (obj) {
            var result = false;

            if (Object.prototype.toString.call(obj) === "[object Object]") {
                result = true;
            }
            else {
                result = false;
            }

            return result;
        },
        IsNumber: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Number]";
        },

        /****************************************************************/













        $: function (id) {
            return $("#" + id);
        },
        /* 转义字符串str
        失败！！！ “\”被转义了！！因此取不到str中的"\"
        Escape: function (str) {
        return String(str).replace(/\\/g, "\\\\");
        },
        */

        /*  对Jquery中的特殊字符转义。
        用于选择器中的字符（OperateSelect.js）。
        */
        EscapeJquery: function (str) {
            return String(str).replace(/(#|\.|@|\[|\])/g, "\\$1");
        },
        /* 去除开头和结尾的指定字符串（如果有的话） */
        TrimStr: function (source, str) {
            var temp = "";
            var new_str = "^" + str;
            //            alert("new_str = "+ new_str);
            var reg = new RegExp(new_str);
            temp = source.replace(reg, "");
            new_str = str + "$";
            //            alert("new_str = " + new_str);
            reg = new RegExp(new_str);
            return temp.replace(reg, "");
        },
        /************************************ 数组操作 ***************************************/
        /*  对每个数组元素调用iterator，返回调用iterator返回false的元素索引的数组 
        如 source_arr = ["", "a", "b", ""];
        result = operate.Judge(arr, function (value, index) {
        if (value === "") {
        return false;
        }
        else {
        return true;
        }
        });
        //result = [0, 3];
        */
        Judge: function (source_arr, iterator) {
            var result = [];
            var source_clone = operate.Clone(source_arr);  //拷贝副本
            //            alert("source_clone = ");
            //            for (var i = 0, _length = source_clone.length; i < _length; i++) {
            //                alert(source_clone[i]);
            //            }
            source_clone.each(function (value, index) {
                //                alert(iterator.call(source_clone, value, index));
                //                alert("index = "+ index);
                if (!iterator.call(source_clone, value, index)) {
                    //                    alert("index = " + index);
                    result.push(index);
                }
                //                alert("value = " + value);
            });
            return result;
        },
        /*
        判断数组中是否有重复项，有即返回true，否则返回false
        发送给多人时，判断是否重复发给同一人
        如收件人：yang11,yang11,111111
        此处yang11重复！
        */
        Repeat: function (array) {
            var new_array = array;
            /*
            如果为第一次调用（即不是递归调用的），
            就赋值原数组array，并使new_array指向新数组。
            这样可防止修改原数组array（如删除元素）
            */
            if (!arguments[1]) {
                new_array = this.Clone(array);
            }

            //        new_array = array;
            if (new_array.length == 0) {
                return false;
            }
            //        alert("array.length=" + array.length);
            var first = new_array[0];
            //        alert("first = " + first);
            //        for (var item in array) {
            //            if (item == 0) {
            //                temp = item;
            //                continue;
            //            }
            //        }
            /*判断数组是否有重复的第一个元素*/
            for (var i = 1; i < new_array.length; i++) {
                //            alert("start cycle");
                //            alert("first=" + first);
                //            alert("array[i]=" + array[i]);
                //            alert("first == array[i]?"+(first == array[i]));
                if (first == new_array[i]) {
                    return true;    //退出for循环，返回函数返回值true
                    //                alert("return!");
                }

                else {
                    continue;
                }
            }
            //        alert("delete first");
            new_array.shift();  //删除数组第一个元素
            //        alert("enter next");
            /*
            递归，判断数组其他元素是否重复
            注意：此处要用return！
            */
            return this.Repeat(new_array, "next");
        },
        /************************************************************************************/



        /************************************ 生成随机数 ***************************************/
        Random: {
            //0到1随机小数，如0.4581578007260767
            _0To1: function () {
                return Math.random();
            },
            //over到under的任意整数
            _NToM: function (over, _under) {
                //                alert("under = " + under);
                //                alert("over = " + over);
                if (over && _under < over) {
                    throw new Error("参数错误");
                    return;
                }

                under = _under + 1;     //此处要加1。因为_NToM函数只会产生over到_under-1的数。
                switch (arguments.length) {
                    case 1:
                        return Math.floor(Math.random() * under + 1); //没设下限的话，默认为1
                    case 2:
                        return Math.floor(Math.random() * (under - over) + over);
                    default:
                        return 0;
                }
            },
            //生成制定位数的随机整数
            //如生成4位的随机整数：RndNum(4);
            RndNum: function (n) {
                var rnd = "";
                for (var i = 0; i < n; i++)
                    rnd += Math.floor(Math.random() * 10);
                return rnd;
            },

            //over到under的任意整数，且是num的倍数
            _NToMByT: function (num, over, under) {
                var a = 0,
                    b = 0,
                    c = 0;

                switch (arguments.length) {
                    case 2:
                        a = Math.floor(under / num),
                        b = 0;  //没设下限的话，默认从0开始

                        c = this._NToM(a, b);
                        return c * num;
                        //                        return Math.round(Math.random() * (under) / num) * num;   //没设下限的话，默认从0开始
                    case 3:
                        a = Math.floor(under / num),
                        b = Math.ceil(over / num);
                        //                        console.log("under = " + under);
                        //                        console.log("a = " + a + "b=" + b);
                        if (a < b) {
                            throw new Error("不存over到under且是num的倍数的整数");
                            return;
                        }

                        c = this._NToM(b, a);
                        return c * num;

                        //                        return Math.round((Math.random() * (under - over) + over) / num) * num;
                    default:
                        throw new Error("_NToMByT 形参不能超过3个");
                }
            }
        },

        /*********************************************************************************/




        /************************************ 特效 ***************************************/
        //向上滚动
        RollUp: function (outerID, innerID) {
            var stopscroll = false;

            var scrollElem = document.getElementById(outerID);
            var leftElem = document.getElementById(innerID);


            /* 此处outerHeight为180px，innerHeight为720px，
            所以marqueesHeight为540px。
            又因为td的高度为180px，即显示的一行产品的高度为180px，
            所以总共可显示540/180 + 1 = 4行，即4* 5 = 20个产品
            */
            var outerHeight = scrollElem.style.height.slice(0, 3);     //外层的高度，也是页面显示层的高度
            var innerHeight = leftElem.style.height.slice(0, 3);   //内层的高度

            var marqueesHeight = innerHeight - outerHeight;    //滚动最大高度（即为scrollTop的最大高度）为内层高度 - 外层高度
            //     alert(marqueesHeight.slice(0, 3));

            //为scrollElem绑定鼠标事件
            scrollElem.onmouseover = new Function('stopscroll = true');
            scrollElem.onmouseout = new Function('stopscroll = false');


            var preTop = 0;
            var currentTop = 0;
            var stoptime = 0;


            //     preTop = scrollElem.scrollTop;
            //     scrollElem.scrollTop += 1;
            //     alert(scrollElem.scrollTop);
            ////     preTop = scrollElem.scrollTop;
            //     scrollElem.scrollTop += 1;
            //     alert(scrollElem.scrollTop);
            //     scrollElem.scrollTop += 100;
            //     alert(scrollElem.scrollTop);
            //     scrollElem.scrollTop += 100;
            //     alert(scrollElem.scrollTop);
            //     scrollElem.scrollTop += 100;
            //     alert(scrollElem.scrollTop);
            //     scrollElem.scrollTop += 100;
            //     alert(scrollElem.scrollTop);
            function init_srolltext() {
                scrollElem.scrollTop = 0;
                setInterval('scrollUp()', 10);     //值越小，滚动速度越快
            }
            function scrollUp() {
                if (stopscroll) return;
                currentTop += 1;
                if (currentTop == outerHeight) {
                    stoptime += 1;
                    currentTop -= 1;
                    if (stoptime == 300) { //滚到到marqueesHeight后，停止3秒
                        currentTop = 0;
                        stoptime = 0;
                    }
                } else {
                    //             preTop = scrollElem.scrollTop;
                    scrollElem.scrollTop += 1;
                    if (scrollElem.scrollTop == marqueesHeight) {  //scrollElem.scrollTop的最大值为marqueesHeight
                        scrollElem.scrollTop = 0;
                        scrollElem.scrollTop += 1;
                    }
                }

            }


            scrollElem.appendChild(leftElem.cloneNode(true));

            init_srolltext();
        },
        /*********************************************************************************/

        /********************************************** 继承 **************************************/

        //复制source到destination中(包括source的原型链和Object的原型链)
        //不用中间对象， 貌似有问题！
        //浅拷贝
        Extend: function (destination, source) {
            //            var temp = {};
            for (var property in source) {
                //                temp[property] = source[property];  //用中间对象来保存source
                destination[property] = source[property];
            }
            return destination;
        },
        //复制source到destination中(不包括source的原型链)
        //浅拷贝
        ExtendNoPrototype: function (destination, source) {
            //            var temp = {};
            for (var property in source) {
                if (source.hasOwnProperty(i)) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        /* 深拷贝

        来自汤姆大叔
        9-24

        使用例子：
        var dad = {    
        counts: [1, 2, 3],   
        reads: { paper: true }
        };
        var kid = extendDeep(dad);
        kid.counts.push(4);
        console.log(kid.counts.toString()); // "1,2,3,4"
        console.log(dad.counts.toString()); // "1,2,3"
        console.log(dad.reads === kid.reads); // false
        kid.reads.paper = false;

        */
        ExtendDeep: function (parent, child) {
            var i,
                toStr = Object.prototype.toString,
                astr = "[object Array]";
            child = child || {};
            for (i in parent) {
                if (parent.hasOwnProperty(i)) {
                    if (typeof parent[i] === 'object') {
                        child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                        operate.ExtendDeep(parent[i], child[i]);
                    } else {
                        child[i] = parent[i];
                    }
                }
            }
            return child;
        },
        /* 继承 

        来自汤姆大叔
        9-24


        注意，我们在b实例上创建了自己的x属性，通过B.base.constructor调用父构造函数来引用新创建对象的上下文。


        function M() {
        alert("M!");
        this.ppp = "aaa";
        };
        function F() {
        alert("F!");
        };
        operate.Inherit(F, M);
        //通过base.constructor()调用M的构造函数
        F.base.constructor();      //弹出“M!”


        我们也修复了父构造函数在创建子原型的时候不需要的调用，此时，消息"A.[[Call]] activated"在需要的时候才会显示。


        例一：

        function Pa() {
        alert("Parent!");
        }

        function Ch() {
        alert("Children!");
        }
        Ch.prototype = new Pa();	//Parent! 

        “Ch.prototype = new Pa()”会调用Pa的构造函数中的代码！


        例二：

        function Pa() {
        alert("Parent!");
        }

        function Ch() {
        alert("Children!");
        }
        function Te() { };
        Te.prototype = Pa.prototype;
        Ch.prototype = new Te();

        “Ch.prototype = new Te()”不会调用Pa的构造函数中的代码！

        */

        Inherit: function (child, parent) {
            var F = function () { };
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
            //此处为super的话，360下要出错！！！
            //child.super = parent.prototype;
            child.base = parent.prototype;
            return child;
        },

        /**************************************************************************************/

        /* Dom对象转换为JQeury对象 */
        ConvertToJQuery: function (dom) {
            return $(dom);
        },
        /* JQuery对象转换为Dom对象 */
        ConvertToDom: function (jquery) {
            return $(jquery)[0];   //return jquery.get(0);     也行！！
        },
        /*  9-4
        释放闭包
        */
        Release: function (resource) {
            $(window).unload(function () {
                //                alert("resource = " + resource);
                if (resource) {
                    resource = null;
                }
                try {
                    if (operate.Browser.ie) {
                        CollectGarbage();   //强制回收,ie才有
                    }
                }
                catch (e) { //不处理异常
                }
            });
        },
        /*操作是否完成标志*/
        IsComplete: false,
        /*返回当前元素*/
        Current: function () {
            /*  已修改！这样谷歌浏览器下也可以正常返回！ 
            9-28

            return (this.Browser.ff && arguments[0].target) || (this.Browser.ie && arguments[0].srcElement);
            */
            return (this.Browser.ie && arguments[0].srcElement) || arguments[0].target;
        },
        /*设置menu为当前选中的模块*/
        SetCurrent: function (currentSelected) {
            var targetFind = "span:contains('" + currentSelected + "')";
            //        var targetFind = "span:contains('其他信息')";
            $(".menu .current").attr("class", "");  //取消之前选中的模块
            $(".menu").find(targetFind).parent().attr("class", "current"); //设置当前模块为选中模块
            //        alert($(".menu").find(targetFind).length);
        },
        /*获得select的文本值
        * 兼容360、ff、ie9
        *页面上option中不要select属性（如：<option value="请选择" Selected>请选择</option>）
        */
        GetSelectText: function (id) {    //id为select的id值
            var _this = this.$(id).children("option:checked");
            return this.$(id).children("option:checked").text() == "" ? this.$(id).children("option[selected]").text() : this.$(id).children("option:checked").text();
        },
        /*7-16 - 7-17
        * 替换指定的匹配。
        *即替换第number个匹配项
        *source为要处理的字符串，matchStr为匹配的正则表达式(没有两边的“/“，即本来应该为“/\d*as/g“，则match为“\d*as“)，
        *replaceMent为替换项，number指明要替换第几个匹配项

        例如：
        var body = "<br/><span/><br/>";
        operate.Replace(body, "<br\/>", "<br/>*\r", "last");   //最后的br后加*，作为评论内容开始的标记

        //body = "<br/><span/><br/>*\r"
        */
        Replace: function (source, matchStr, replaceMent, number) {
            var _source = "";
            var _number = null;
            var temp = null;
            var remain = null;
            var index = null;
            var result = null;
            var str = null;
            var reg = null;
            var replace_reg = null;
            var i = 1;
            var arr_m = null;

            if (this.IsString(source)) {
                _source = source;
            }
            else {
                try {
                    _source = source.toString();
                }
                catch (e) {
                    alert("source需要为string类型");
                    return;
                }
            }
            //        alert("number=" + number);
            switch (number) {
                case "last":    //替换最后一个匹配项
                    //                alert("last!");
                    str = matchStr + "([^" + matchStr + "]*)$";
                    //                alert("str=" + str);
                    reg = new RegExp(str);  //使用RegExp对象来构造动态匹配
                    //                    alert("replace");
                    //                                        alert("reg= " + reg);
                    result = _source.replace(reg, function (_match, first) { //_match为匹配项，first为第一个子匹配项
                        return replaceMent + first;
                    });
                    //                                        alert("result=" + result);
                    break;
                case "first":   //替换第一个匹配项  
                    //                            var str = "^[^" + match + "]*" + match;  
                    str = matchStr;
                    //                alert("str=" + str);
                    reg = new RegExp(str);  //使用RegExp对象来构造动态匹配  
                    //                    alert("reg= " + reg);
                    result = _source.replace(reg, replaceMent);
                    //                    alert("result=" + result);
                    break;
                default:    //替换指定位置的匹配项
                    reg = new RegExp(matchStr, "g");
                    replace_reg = new RegExp(matchStr);
                    //                alert("reg= " + reg);
                    //                var t = reg.exec(_source);
                    //                alert("position:" + reg.lastIndex);
                    //                alert("_source=" + _source);
                    //                alert("after slice   _source=" + _source.slice(reg.lastIndex));
                    while ((arr_m = reg.exec(_source)) != null) {

                        //                    alert("index position:" + index);
                        //                    alert("_source=" + _source);
                        //                    alert("after slice   _source=" + _source.slice(index));
                        if (i++ == number) {    //先判等，再自加
                            index = reg.lastIndex - arr_m[0].length;    //lastIndex为下一次匹配开始的位置，即为匹配的字符串的最后一个字符的后一位的位置
                            temp = _source.slice(0, index);
                            //                        alert("temp=" + temp);
                            remain = _source.slice(index).replace(replace_reg, replaceMent);
                            //                        alert("remain=" + remain);
                            result = temp + remain;
                            //                        alert("result=" + result);
                            break;
                        }
                    }
                    if (!reg.lastIndex) {
                        result = _source;
                    }
                    break;
            }
            return result;
        },
        /*获得鼠标位置(代码来自于网上)
        兼容ie和ff和chrome
        //360下y坐标有问题！！
    
        */
        MousePosition: function (ev) {
            /*
            这段代码不兼容360

            if (ev.pageX || ev.pageY) { //ff
            return { x: ev.pageX, y: ev.pageY };
            }
            return {    //ie
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
            */
            /*新加的这段代码兼容360*/
            var point = {
                x: 0,
                y: 0
            };

            // 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
            if (typeof window.pageYOffset != 'undefined') {
                point.x = window.pageXOffset;
                point.y = window.pageYOffset;
            }
            // 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
            // IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
            else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
                point.x = document.documentElement.scrollLeft;
                point.y = document.documentElement.scrollTop;
            }
            // 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
            else if (typeof document.body != 'undefined') {
                point.x = document.body.scrollLeft;
                point.y = document.body.scrollTop;
            }

            // 加上鼠标在视窗中的位置
            point.x += ev.clientX;
            point.y += ev.clientY;

            // 返回鼠标在视窗中的位置
            return point;

        },
        /*在当前鼠标位置的右边显示层*/
        ShowDivInRightPosition: function (e, id) {
            var top = this.MousePosition(e).y;   //e为event对象
            var left = this.MousePosition(e).x;
            //                alert("top=" + top);
            this.$(id).css("top", top);     //id为层的Id
            this.$(id).css("left", left);
        },


        //没得必要使用此函数，因为js自带的setTimeout函数已经能完成该函数的功能！
        //    /*
        //    setTimeout函数(代码来自于网上)

        //    调用方法：
        //    function aaaa(a)
        // 　　{
        // 　　alert(a);
        // 　　}
        // 　　function aaaaa(a,b,c)
        // 　　{
        // 　　alert(a + b + c);
        // 　　}
        // 　　var a = new Object();
        // 　　window.setTimeout(aaaa,1000,a);
        // 　　window.setTimeout(aaaaa,2000,a,6,7);
        //    */
        //    MySetTimeOut: function (funcName, timeOut, param) {
        //        var _set = window.setTimeout;
        //        var args = Array.prototype.slice.call(arguments, 2);    //取出funcName函数的参数（数组）
        //        var time = timeOut * 1000;  //以秒为单位
        //        var _cb = function () {
        //            funcName.apply(null, args);
        //        }
        //        _set(_cb, time);
        //    },
        //    Test: function (a) {
        //        //        var array = [1, 2];
        //        //        alert(array.slice(1)[0]);
        //        //        alert(arguments[0]);
        //        alert("arguments=" + arguments);
        //        alert("a[0]=" + a[0]);
        //        alert("a[1]=" + a[1]);
        //        alert("type a = " + typeof a);
        //        var args = Array.prototype.slice.call(arguments, 0);
        //        alert("args=" + args);
        //        alert("type args=" + typeof args);
        //        alert("args[0]=" + args[0]);
        //        alert("args[1]=" + args[1]);
        //        alert(args.length);
        //        alert("edit args!");
        //        args[0] = 100;
        //        alert("after edit! args[0] = " + args[0]);
        //    },
        /*返回一个新的数组，元素与array相同（地址不同）*/
        Clone: function (array) {
            var new_array = new Array(array.length);
            //            for (var item in array) {   //此处会遍历到Array的扩展方法（如getElement()）
            //                new_array[item] = array[item];
            //            }
            //            return new_array;
            for (var i = 0, _length = array.length; i < _length; i++) {
                new_array[i] = array[i];
            }
            return new_array;
        },
        /*显示arguments[0]，其余隐藏*/
        Show: function () {
            this.$(arguments[0]).css("display", "");
            var length = arguments.length;
            for (var i = 1; i < length; i++) {
                this.$(arguments[i]).css("display", "none");
            }
        },
        /*用户中心 右边导航栏显示（如前台页面的点击“发送信息”，直接跳转到用户中心的“添加信息”模块）*/
        ShowItem: function () {
            //重载 参数为event
            if (arguments.length == 1 && !this.IsString(arguments[0])) {
                var _this = $(this.Current(arguments[0]));
                _this.parents("ul").find("li").filter(".titbg3,.titbg4").each(function () {
                    $(this).find("span").attr("class", "on2");
                });
                _this.attr("class", "on1");
            }
            else {
                //            alert("aaa");
                /*显示arguments[1],隐藏arguments[2]及其后面的元素*/
                this.$(arguments[1]).css("display", "");
                var length = arguments.length;
                for (var i = 2; i < length; i++) {
                    this.$(arguments[i]).css("display", "none");
                }
                //            alert(this.IsString(arguments[0]));


                /*选中event(arguments[0])*/
                var _this = this.IsString(arguments[0]) ? this.$(arguments[0]) : $(this.Current(arguments[0]));
                _this.parents("ul").find("li").filter(".titbg3,.titbg4").each(function () {
                    $(this).find("span").attr("class", "on2");
                });
                _this.attr("class", "on1");
                //            alert("bbb");
            }
        },
        err_msg: function (str, id) {
            document.getElementById("d" + id).innerHTML = '<img src="/ContentImage/Shared/check_' + (str ? 'error' : 'right') + '.gif" align="absmiddle"/> ' + str.toString();
        },
        trim: function (info) {

            //replace(/&nbsp;/g, "")：消去&nbsp;（&nbsp;用于解决在360下如果没有内容时不显示单元格的问题）
            return info.replace(/^\s*/, "").replace(/\s*$/, "").replace(/&nbsp;/g, "");
        },


        /*cookie操作*/




        //        //    /*设置cookie。要设置expires，否则会出现错误！*/
        //        SetCookie: function (objName, objValue, objHours) {
        //            //    if (this.GetCookie(objName) != "no"){
        //            //        alert("Exist!");
        //            //        this.ClearCookie(objName);
        //            //        alert("delete cookie="+document.cookie);
        //            //    }
        //            //        try {
        //            //            alert("cookie=" + document.cookie);

        //            //            var str = objName + "=" + escape(objValue);
        //            /*
        //                最多利用的应为encodeURIComponent，它是将中文、韩文等特殊字符转换成utf-8格式的url编码，
        //                以是假定给背景转达参数必要利用encodeURIComponent时必要背景解码对utf-8撑持（form中的编码体例和当前页面编码体例不异）

        //                此处用encodeURIComponent而不用escape，因为objValue如果包含中文的话，escape编码的字符串在解码时会出问题！
        //            */
        //            var str = objName + "=" + encodeURIComponent(objValue);
        //            var date = new Date();
        //            var ms = null;
        //            if (objHours > 0) {                               //为时不设定过期时间，浏览器关闭时cookie自动消失
        //                ms = objHours * 3600 * 1000;
        //            }
        //            else {
        //                ms = 1 * 3600 * 1000;   //默认为1小时。此处要设置过期时间！否则会出现错误！！！详见“6-27备忘:cookie的问题”
        //            }
        //            date.setTime(date.getTime() + ms);
        //            str += ";expires=" + date.toGMTString() + ";path=/";   //要设置相同的path，防止删除不掉
        //            document.cookie = str;
        ////                        alert("cookie=" + document.cookie);
        //            if (document.cookie == "") {
        //                throw new Error("写入Cookie操作失败！您可能禁用了Cookie");  //如果写cookie失败，则抛出异常
        //                //                alert("写入Cookie操作失败！您可能禁用了Cookie");
        //                //                return;
        //            }
        //            //        }
        //            //        catch (e) {
        //            //        }
        //        },
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
        //        /*获得cookie
        //        成功返回value
        //        失败返回"no"*/
        //        GetCookie: function (name) {
        //            //     alert(document.cookie);
        //            //        if (document.cookie == "") {
        //            //            alert("获取Cookie操作失败！您可能禁用了Cookie");
        //            //            return;
        //            //        }
        //            var arrStr = document.cookie.split(";");
        //            for (var i = 0; i < arrStr.length; i++) {
        //                var temp = arrStr[i].split("=");
        //                if (this.trim(temp[0]) == this.decode(name)) {
        //                    //        alert("get="+document.cookie);
        //                    return this.decode(temp[1]);
        //                }
        //            }
        //            return "no";
        //        },
        /*删除cookie
        */
        ClearCookie: function (name) {
            //     alert("clear!");
            //alert("before delete = "+ document.cookie);
            var exp = new Date();
            exp.setTime(exp.getTime() - 10000);
            document.cookie = name + "=;expires=" + exp.toGMTString() + ";path=/";
            //        alert("after delete = "+ document.cookie);
        },

        /*cookie操作结束*/


        /*解码*/
        decode: function (str) {
            var _str = decodeURIComponent(str);
            _str = _str.replace(/\+/g, " "); //将+号替换为空格
            return _str;
        },
        /*判断浏览器类型*/
        Browser: {
            ie: window.ActiveXObject && true,
            ff: navigator.userAgent.indexOf("Firefox") >= 0 && true,
            opera: navigator.userAgent.indexOf("Opera") >= 0 && true
        },
        //    /*判断浏览器类型*/
        //    Browser: function () {
        //        var browser = {};
        //        this.Browser.ie = "ie";
        ////                    alert(this.Browser.ie);
        ////        alert("ttttttttt");
        //        return;
        ////        if (window.ActiveXObject) {

        ////            //            browser.ie = "ie";
        ////            //            return browser;
        ////        }
        ////        else if (navigator.userAgent.indexOf("Firefox") >= 0) {
        ////            browser.ff = "ff";
        ////            return browser;
        ////        }
        ////        else if (navigator.userAgent.indexOf("Opera") >= 0) {
        ////            browser.opera = "opera";
        ////            return browser;
        ////        }
        //    },
        /* csdn */
        Format: function (s, pars) {
            if (!s) return "";  //如果s为空，则s=""
            if (pars == null) return s;

            var i = 0, j = 1;
            while (j < arguments.length) {
                var arg = arguments[j];
                if (!arg) arg = '';
                if (this.IsArray(arg)) {
                    for (var k = 0; k < arg.length; k++) {
                        s = s.replace(new RegExp("\\\{" + (i++) + "\\\}", "g"), arg[k]);
                    }
                } else {
                    s = s.replace(new RegExp("\\\{" + (i++) + "\\\}", "g"), arg.toString());
                }
                j++;
            }
            return s;
        },
        /************************************** 判断类型 *****************************************/
        IsArray: function (val) {
            //            return !!(val &&    //"!!"表示转化为bool型
            //        typeof val == "object" &&
            //        typeof val.length == 'number' &&
            //        typeof val.splice == 'function' &&
            //        !(val.propertyIsEnumerable('length'))   //val.propertyIsEnumerable('length')：返回 Boolean 值，指出val是否具有该length属性且该属性是否是可列举的。
            //        );
            return Object.prototype.toString.call(val) === "[object Array]";
        },
        /*判断是否为string型*/
        IsString: function (str) {
            //            return typeof str == "string";
            return Object.prototype.toString.call(str) === "[object String]";
        },
        /*判断是否为function（是否为类）*/
        IsFunction: function (func) {
            return typeof func == "function";
        },
        /* 
        * 检测对象是否是空对象(不包含任何可读属性)。 //如你上面的那个对象就是不含任何可读属性
        * 方法只既检测对象本身的属性，不检测从原型继承的属性。 
        */
        IsOwnEmptyObject: function (obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;
                }
            }
            return true;
        },
        /* 
        * 检测对象是否是空对象(不包含任何可读属性)。 
        * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。 
        */

        IsEmptyObject: function (obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },

        /************************************** 判断类型 *****************************************/
        /* csdn结束*/
        /*验证码*/
        createCode: function () {
            //        alert("aaa");
            code = "";
            var codeLength = 6; //验证码的长度   
            var checkCode = document.getElementById("checkCode");
            //        alert("aaa");
            var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的      
            for (var i = 0; i < codeLength; i++) {
                var charIndex = Math.floor(Math.random() * 36);
                code += selectChar[charIndex];
            }
            //        alert("code=" + code);
            if (checkCode) {
                checkCode.className = "code";
                checkCode.value = code;
                checkCode.blur();
                //            alert("checkCode=" + checkCode);
            }
            //        alert("checkCode=" + checkCode.value);
        }
        //    Solve360ckfinder: function () {
        //        alert($("li.new input").first().length);
        //        $("li.new input").first().focus();
        //    }
        /*重置*/
    }
})();

///*离开后台时(刷新页面，关闭页面等)，回收资源（闭包）*/
//$(function () {
//    $(window).unload(function () {
//        var ie = operate.Browser.ie;
//        operate = null;
//        try {
//            if (ie) {
//                CollectGarbage();   //强制回收,ie才有
//            }
//        }
//        catch (e) {
//        }
//    });
//});





/*扩展String类
注意！要放到自执行匿名函数中
*/
(function () {
    String.prototype.contain = function (str) {
        //    alert("str="+str);

        /* 使用RegExp对象来构造动态匹配。
        注意！str是字符串，因此需要转义！

        由于JavaScript字符串中的“\”是一个转义字符，因此，使用显式构造函数创建RegExp实例对象时，应将原始正则表达式中的“\”用“\\”替换。例如，在代码1.2中的两条语句是等价的。

        代码1.2   转义字符中的“\”：1.2.htm

        <script language="javascript">

        var re1 = new RegExp("\\d{5}");

        var re2 = /\d{5}/;

        alert("re1="+re1+"\nre2="+re2);

        </script>

         

        由于正则表达式模式文本中的转义字符也是“\”，如果正则表达式中要匹配原义字符“\”，在正则表达式模式文本中要以“\\”来表示，当使用显式构造函数的方式创建RegExp实例对象的时候，就需要使用“\\\\”来表示原义字符“\”。

        var re = new RegExp(\\\\)。

        */
        var reg = new RegExp(str);
        if (this.match(reg)) {  //用this指针指代本体
            return true;
        }
        else {
            return false;
        }
    }
    String.prototype.containIgnoreCase = function (str) {   //不分大小写
        //    alert("str="+str);
        var reg = new RegExp(str, "i");  //使用RegExp对象来构造动态匹配
        if (this.match(reg)) {  //用this指针指代本体
            return true;
        }
        else {
            return false;
        }
    }
    String.prototype.trim = function () {
        var source = this;
        return source.replace(/^\s*/g, "").replace(/\s*$/g, "");
    }
})();




/*仿prototype.js库 扩展Array类

Array类需要扩展的方法（形参未给出）：

contain()
indexof()
get()
modify()

*/

//为Object类加入_extend静态方法
(function () {
    Object._extend = function (destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }
})();


$break = {};

/*
indexOf方法名要加_（否则1817行会报错！）(因为String类有同名方法indexOf？？？？？)，
否则在ff下ckfinder不能删除（点击没反应）！上传文件个数到达指定的上限时不会提示（点击没反应）
*/
var _Enumerable = (function () {     //集合类，该类为抽象类，需要子类实现_each方法
    function each(iterator, context) {
        var index = 0;
        try {
            this._each(function (value) {
                iterator.call(context, value, index++);
            });
        } catch (e) {
            if (e != $break) throw e;
        }
        return this;
    }

    /*
    判断数组是否包含元素。

    示例：
    var result = ["a", "b", 1];
    var t = result.contain(function (value, index) {
    if (value == "c") {
    return true;
    }
    else {
    }
    });

    alert(t);   //  -> true
    */
    function contain(iterator) {
        var result = false;
        //        var source = this;
        this.each(function (value, index) {
            if (!!iterator.call(null, value, index)) {
                result = true;
                throw $break;   //如果包含，则置返回值为true,跳出循环
            }
        });
        return result;
    }

    /*
    修改数组的元素。

    此处的context为待修改的数组。

    示例：
    var result = [{ type: "a", num: 1 }, { type: "b", num: 2}];
    result.modify(function (value, index) {
    if (value.type == "a") {
    this.num = 10;
    return true;
    }
    }, result); //注意此处要传入待修改的数组(此处为result)

    alert(result[0].num);   //  -> 10
    */
    function modify(iterator, context) {
        //        var source = this;
        this.each(function (value, index) {
            if (iterator.call(context[index], value, index)) {  //context[index]为数组第index个元素
                throw $break;   //修改成功后即退出循环
            }
        });
        return;
    }

    /*
    返回满足条件的元素的位置。

    示例：
    var result = [{ type: "a", num: 1 }, { type: "b", num: 2}];
    var index = result.indexOf(function (value, index) {
    if (value.type == "b") {
    return index;
    }
    else {
    return false;
    }
    });
    alert(index);   //  -> 1
    */
    function indexOf(iterator) {
        var result = -1;
        var t = null;
        this.each(function (value, index) {
            t = iterator.call(null, value, index);
            //            alert("t=" + t);
            /*如果返回了index，则退出循环
            用"==="来判断，因为如果用"=="的话，false也 == 0！即t=false时，也会退出循环！
            */
            if (t || t === 0) {
                throw $break;
            }
        });
        //        alert("end each   t=" + t);
        //        if (t === false) {  //用"==="来判断，因为如果用"=="的话，0也为false！即t=0时，result也为-1！
        //            result = -1;
        //        }
        //        else {  //包括t=0的情况
        //            result = t;
        //        }
        //        result = t ? t : -1;     //t如果为false，则result为-1；否则result为返回的index     //t=0时有问题！
        result = t === false ? -1 : t;  //用"==="来判断，因为如果用"=="的话，0也为false！即t=0时，result也为-1！
        return result;
    }

    return {
        each: each,
        contain: contain,
        modify: modify,
        _indexOf: indexOf   //区别于String的indexOf方法
    }
})();


Object._extend(Array.prototype, (function () {   //自执行闭包，返回的Object对象拷贝给Array的原型
    Object._extend(Array.prototype, _Enumerable); //继承Enumerable类
    function _each(iterator) {  //实现_each方法
        for (var i = 0, length = this.length; i < length; i++) {
            iterator(this[i]);
        }
    }

    function indexOf(key) {    //如何调用父类同名方法？？？
        //        alert("aaa");
        //        if (operate.IsFunction(key)) {
        //            alert("bbb");
        //            this.indexOf(key);
        //        }
    }

    /*获得指定位置的元素*/
    function getElement(index) {
        return this[index];
    }

    /*简化index.js*/

    function array_indexOf(type) {
        return this._indexOf(function (value, index) {
            if (value.type == type) {
                return index;
            }
            else {
                return false;
            }
        });
    }
    function array_contain(type) {
        return this.contain(function (value, index) {
            if (value.type == type) {
                return true;
            }
            else {
            }
        });
    }
    function array_modify(type, num, context) {
        this.modify(function (value, index) {
            if (value.type == type) {
                this.num = num;
                return true;
            }
        }, context);
    }



    return {
        _each: _each,
        //        indexOfByKey: indexOf
        getElement: getElement,
        array_indexOf: array_indexOf,
        array_contain: array_contain,
        array_modify: array_modify
    }
})());

//先测试下contain方法！     //测试通过！









