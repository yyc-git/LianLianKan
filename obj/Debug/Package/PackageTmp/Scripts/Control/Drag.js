/***********************************************
来自：

 Dota.Drag.js v0.1
 日期：2009.09.15
 修改自cloudgamer的Drag.js


修改：

作者：YYC
电子邮箱：395976266@qq.com
QQ: 395976266
日期：2012-10-31
博客：http://www.cnblogs.com/chaogex/

************************************************/

if (typeof YYC == "undefined" || !YYC) {
    window.YYC = {};
}

//加载拖动控件，this._title（标题层）绑定拖动
//handler是dom对象！
//this.drag = new YYC.Drag(v, { handler: tc, cancelBubble: false });

YYC.Drag = function (dragElement, config) {
    this.drag = MyGameEngine.Base.GetDom(dragElement);
    //    this.drag = dragElement;

    this._x = this._y = 0;
    this._martinLeft = this._marginTop = 0;
    this.config = MyGameEngine.Base.Extend({
        handler: null, //设置触发对象（不设置则使用拖放对象）
        limit: false, //是否设置范围限制(为true时下面参数有用,可以是负数)
        mxLeft: 0, //左边限制
        mxRight: 9999, //右边限制
        mxTop: 0, //上边限制
        mxBottom: 9999, //下边限制
        mxContainer: "", //指定限制在容器内
        lockX: false, //是否锁定水平方向拖放
        lockY: false, //是否锁定垂直方向拖放
        lock: false, //是否锁定
        transparent: true, //拖动时是否半透明
        cancelBubble: true, //取消冒泡
        OnStart: function () { }, //开始移动时执行
        OnMove: function () { }, //移动时执行
        OnStop: function () { } //结束移动时执行
    }, config || {});

    //如果this.config.handler为jquery对象，则转化为dom对象
//    this.config.handler = (MyGameEngine.Base.IsjQuery(this.config.handler) ? this.config.handler[0] : this.config.handler) || this.drag;
    this.config.handler = MyGameEngine.Base.GetDom(this.config.handler) || this.drag;

    this.config.mxContainer = MyGameEngine.Base.GetDom(this.config.mxContainer) || null;

    this.drag.style.position = "absolute";
    //如果有容器必须设置position为relative或absolute来相对或绝对定位，并在获取offset之前设置
    //    !this.config.mxContainer || MyGameEngine.Base.GetCurrentStyle(this.config.mxContainer).position == "relative" || MyGameEngine.Base.GetCurrentStyle(this.config.mxContainer).position == "absolute" || (this.config.mxContainer.style.position = "relative");

    !this.config.mxContainer || $(this.config.mxContainer).css("position") == "relative" || $(this.config.mxContainer).css("position") == "absolute" || ($(this.config.mxContainer).css("position", "relative"));


    this._startHandler = MyGameEngine.Event.BindEvent(this, this.Start);
    this._moveHandler = MyGameEngine.Event.BindEvent(this, this.Move);
    this._stopHandler = MyGameEngine.Event.BindEvent(this, this.Stop);
    this._clickHandler = MyGameEngine.Event.BindEvent(this, this.OnClick);

    MyGameEngine.Event.AddEvent(this.config.handler, "mousedown", this._startHandler);
    MyGameEngine.Event.AddEvent(this.config.handler, "click", this._clickHandler);

//    this.Start();
};
YYC.Drag.prototype = {
    isopacity: false,

    SetOpacity: function (opacity) {
        //        DOTA.F.SetOpacity(this.drag, opacity);
        $(this.drag).css("opacity", opacity);
    },
    OnClick: function (oEvent) {
        if (this.config.cancelBubble) {
            //            oEvent.stopPropagation();
            oEvent.stopBubble();
        }
    },
    Start: function (oEvent) {
        //        console.log("start");
        //        console.log(oEvent.target);
        var cfg = this.config;
        if (cfg.lock) {
            return;
        }
        //        var evt = MyGameEngine.Event.GetEvent();
        var evt = oEvent;
        this._x = evt.pageX - evt.offsetLeft;
        this._y = evt.pageY - evt.offsetTop;

        //        console.log(this._x, this._y);

        //半透明
        if (cfg.transparent) {
            //            DOTA.F.getOpacity(this.drag);

            //            this.oldOpacity = $(this.drag).css("opacity");

            this.oldOpacity = 1;


            //            this.SetOpacity(50);
            this.SetOpacity(0.5);
        }

        MyGameEngine.Event.AddEvent(document, "mousemove", this._moveHandler);
        MyGameEngine.Event.AddEvent(document, "mouseup", this._stopHandler);

//        console.log(window.frames[0].length);

//        MyGameEngine.Event.AddEvent(window.frames[0].document, "mousemove", function () {
//            alert("iframe");
//        });
//        MyGameEngine.Event.AddEvent(cfg.iframe, "mousemove", function () {
//            alert("iframe");
//        });

//        MyGameEngine.Event.AddEvent(window.frames[0].document, "mousemove", this._moveHandler);

//        MyGameEngine.Event.AddEvent(cfg.iframe[0].document, "mousemove", this._moveHandler);

//        MyGameEngine.Event.AddEvent(cfg.iframe.find("iframe").document, "mousemove", function () {
//            alert("iframe");
//        });

        if (cfg.cancelBubble) {
            //			oEvent.stopPropagation();
            oEvent.stopBubble();
        }
        cfg.OnStart(evt);
    },

    Move: function (oEvent) {
        //        console.log("move");
        //        console.log(arguments[0].pageX);
        var cfg = this.config,
        //			evt = MyGameEngine.Event.GetEvent();
evt = oEvent;
        //        console.log(evt);
        //        var x = evt.pageX, y = evt.pageY, o, c;

        var x = evt.pageX - this._x, y = evt.pageY - this._y, o, c;

        //                console.log("this._x = ", this._x, "x = " + x);
        //        console.log("this._y = ", this._y, "y = " + y);

        //        var s = MyGameEngine.Base.GetCurrentStyle(this.drag);
        //        x += parseInt(s.left, 10), y += parseInt(s.top, 10);
        //        x = isNaN(x) ? this.drag.offsetLeft : x, y = isNaN(y) ? this.drag.offsetTop : y;

        //清除选择
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

        //限制范围
        if (cfg.limit || cfg.mxContainer) {
            o = MyGameEngine.Base.Extend({}, cfg);
            if (cfg.mxContainer) {
                if (!this.limit) {
                    o.mxLeft = 0, o.mxTop = 0, o.mxBottom = 9999, o.mxRight = 9999;
                }
                c = MyGameEngine.Base.GetCurrentStyle(cfg.mxContainer);

                o.mxLeft = Math.max(o.mxLeft, (isNaN(parseInt(c.left, 10)) ? 0 : parseInt(c.left, 10)));
                o.mxTop = Math.max(o.mxTop, (isNaN(parseInt(c.top, 10)) ? 0 : parseInt(c.top, 10)));
                o.mxRight = Math.min(o.mxRight, cfg.mxContainer.offsetWidth);
                o.mxBottom = Math.min(o.mxBottom, cfg.mxContainer.offsetHeight);
            }
            x = Math.min(Math.max(x, o.mxLeft), o.mxRight - this.drag.offsetWidth);
            y = Math.min(Math.max(y, o.mxTop), o.mxBottom - this.drag.offsetHeight);
        }
        cfg.lockX || (this.drag.style.left = x + "px");
        cfg.lockY || (this.drag.style.top = y + "px");


        //        console.log(evt.pageX);
        //        console.log(evt.offsetLeft);
        //        this._x = evt.pageX, this._y = evt.pageY;

        cfg.OnMove(evt);
    },

    Stop: function () {
        var cfg = this.config;

        //取消半透明
        if (cfg.transparent) {
            this.SetOpacity(this.oldOpacity);
        }

        MyGameEngine.Event.RemoveEvent(document, "mousemove", this._moveHandler);

//        console.log(window.frames[0].length);

//        MyGameEngine.Event.RemoveEvent(window.frames[0], "mousemove", function () {
//            alert("iframe");
//        });


        MyGameEngine.Event.RemoveEvent(document, "mouseup", this._stopHandler);

        //回调事件
        cfg.OnStop();
    },

    Dispose: function () {
        MyGameEngine.Event.RemoveEvent(this.config.handler, "mousedown", this._startHandler);
        MyGameEngine.Event.RemoveEvent(this.config.handler, "click", this._clickHandler);

        this.drag = this.config.handler = null;
        this._moveHandler = null;
        this._stopHandler = null;
        this._startHandler = null;
        this._clickHandler = null;
    }
};