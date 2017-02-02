/* 扩展Array，增加forEach和filter方法 */
(function () {
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, thisObj) {
            var scope = thisObj || window;
            for (var i = 0, j = this.length; i < j; ++i) {
                fn.call(scope, this[i], i, this);
            }
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fn, thisObj) {
            var scope = thisObj || window;
            var a = [];
            for (var i = 0, j = this.length; i < j; ++i) {
                if (!fn.call(scope, this[i], i, this)) {
                    continue;
                }
                a.push(this[i]);
            }
            return a;
        };
    }
})();



/*  
应用观察者模式，创建Observer类。

9-22

******************************************************************************************

调用方式：

var ob = new Observer();
var f1 = function (data) { console.log('Robbin: ' + data + ', 赶紧干活了！'); };
var f2 = function (data) { console.log('Randall: ' + data + ', 找他加点工资去！'); };

ob.Subscribe(f1);
ob.Subscribe(f2);
ob.PublishAll(null, "老板来了");
ob.UnSubscribe(f1);
ob.Publish(f2, null, "董事长来了");
ob.Dispose();

******************************************************************************************

*/

function Observer() {
    this.events = [];
}

Observer.prototype = (function () {
    //    var _context = null;
    return {
        /*
        订阅方法

        可以在订阅时指定context，如：
        subject.Subject_Setting_Name.Subscribe(LianLianKan.Operate_Single, LianLianKan.Operate_Single.SetName);
        */
        Subscribe: function (fn) {
            //            console.log(fn);
            if (arguments.length == 2) {
                //                _context = arguments[1];
                this.events.push({ context: arguments[0], fn: arguments[1] });
            }
            else {
                this.events.push(fn);
            }
        },
        //发布指定方法
        Publish: function (fn, context, args) {
            var args = Array.prototype.slice.call(arguments, 2);    //获得函数参数
            var _context = null;
            var _fn = null;

            //            if (context) {
            this.events.filter(function (el) {
                if (el.context) {
                    _context = el.context;
                    _fn = el.fn;
                }
                else {
                    _context = context;
                    _fn = el;
                }

                if (_fn === fn) {
                    return _fn;
                }
            }).forEach(function (el) {  //指定方法可能有多个
                el.apply(_context, args);       //执行每个指定的方法
            });
            //            }
            //            else {
            //                this.events.filter(function (el) {
            //                    if (el === fn) {
            //                        return el;
            //                    }
            //                }).forEach(function (el) {  //指定方法可能有多个
            //                    el.apply(args);       //执行每个指定的方法
            //                });
            //            }
        },
        UnSubscribe: function (fn) {
            var _fn = null;
            this.events = this.events.filter(function (el) {
                if (el.fn) {
                    _fn = el.fn;
                }
                else {
                    _fn = el;
                }

                if (_fn !== fn) {
                    return el;
                }
            });
        },
        //全部发布
        PublishAll: function (context, args) {
            var args = Array.prototype.slice.call(arguments, 1);    //获得函数参数
            var _context = null;
            var _fn = null;
            //            if (context) {


            this.events.forEach(function (el) {
                if (el.context) {
                    _context = el.context;
                    _fn = el.fn;
                }
                else {
                    _context = context;
                    _fn = el;
                }

                _fn.apply(_context, args);       //执行每个指定的方法
            });


            //            }
            //            else {
            //                this.events.forEach(function (el) {
            //                    el.apply(args);       //执行每个指定的方法
            //                });
            //            }
        },
        Dispose: function () {
            this.events = [];
        },
        /* 
        示例：
        var obsCheck1 = document.createElement('input');
        obsCheck1.type = 'checkbox';
        obsCheck1.id = 'Obs1';
        implement( obsCheck1,new Observer());
        */
        Make: function (o, observer) {
            //            //o为类。
            //            //使o继承Observer，使得o具有订阅、发布等方法
            //            if (operate.IsFunction(o)) {

            //                        o.prototype = new Observer();
            //            }
            for (var prop in observer) {
                o[prop] = observer[prop];
            }
        }
    }
})();


