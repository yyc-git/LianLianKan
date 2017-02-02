/***********************************************
来自：

DOTA.Window v0.1
作者：黄健
日期：2009.09.28
ＱＱ：573704282
Email: freewind22@163.com


修改：

作者：YYC
日期：2012-10-31
电子邮箱：395976266@qq.com
QQ: 395976266
博客：http://www.cnblogs.com/chaogex/

************************************************/

/*
    窗口控件，用于弹出子窗口（默认居中）。
*/

if (typeof YYC == "undefined" || !YYC) {
    window.YYC = {};
}


YYC.WindowMgr = {
	activeWindow : null,
	maxzIndex : 0,
	Register : function(pWin, zIndex){
		this.maxzIndex = Math.max(this.maxzIndex, zIndex);
	},
	GetzIndex : function(pWin){
		if(pWin !== this.activeWindow){
			this.maxzIndex++;
		}
		return this.maxzIndex;
	}
};


//    window.menu = new YYC.MENU.Menu({ id: "menuContainer", items: [
//		    。。。。。。
//    });

//        var dlg = new YYC.Window({
//            title: "标题",
//            isShow: false,
//            isClear: false,
//            opacity: 0.4,
//            id: "iframe_window"
//        });
//        dlg.SetTitle("用户信息设置");
//        dlg.LoadUrl("Scripts/SelectMap.html");    //加载页面成功后，会触发页面的js
//        dlg.ResizeTo(300, 200);

//        dlg.AddToolBar({ menu: menu });


YYC.Window = function (config) {
    //	var width = DOTA.F.getOffsetWidth();    //获得总宽度
    //	var height = DOTA.F.getOffsetHeight();  //获得总高度
    var width = $(document).width();
    var height = $(document).height();

//    //必须设置框架iframe的id值
//    if (!config.id) {
//        throw new Error("The id of iframe must be set!");
//    }

    this.config = MyGameEngine.Base.Extend({
        parent: document.body,
        title: "窗口标题",
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        zIndex: 1000,
        //		animate : (DOTA.Browser.ie ? false : true) && DOTA.Animation,   //动画
        animate: null,
        content: "窗口内容",
        isShow: true,     //是否显示
        isClear: true,      //点击关闭时，是否清除控件（如果为false，则不清除控件而隐藏）
        isShowMask: true,  //是否显示遮罩层
        opacity: 0.5,
        contentPadding: 2,
        url: "",
        id: "",     //iframe的id
        onLoad: function () { },    //加载控件时
        onUnLoad: function () { },   //点击关闭，清除控件时
        onClose: function(){}   //点击关闭时
    }, config || {});

    this.config.onLoad();   //调用onLoad
    //初始化
    this.Init();
};

YYC.Window.prototype = {
    frame: null,

    Init: function () {

        this.InitHtml();
        this.InitPosition();
        this.Resize();
        this.InitEvent();

        //工具条，可以加入菜单项
        this.toolBar = YYC.ToolBar ? new YYC.ToolBar(this._toolBar) : null;
        //        console.log(YYC.ToolBar);
        //        console.log(this.toolBar);
        //动画
        //		this.animate = DOTA.Animation ? new DOTA.Animation({element: this._window, css: "DOTA_Window_MoveBG"}) : null;
        this.animate = null;    //不用动画


        if (this.config.isShow) {
            this.Show();
        } else {
            this._window.style.display = "none";
        }

        YYC.WindowMgr.Register(this, this.config.zIndex); 	//??
        //        console.log(this.drag);
    },
    //插入dom元素
    InitHtml: function () {
        var o = this.config;

        var v = this.Window = this._window = document.createElement("div");
        v.className = "DOTA_Window";
        v.style.zIndex = o.zIndex;

        var tc = this._titleContainer = document.createElement("div");
        tc.className = "titleContainer";

        var t = this._title = document.createElement("div");
        t.className = "title";
        t.innerHTML = o.title;

        //关闭按钮
        var c = this._closeButton = document.createElement("div");
        c.className = "button";
        c.innerHTML = "&nbsp;";

        var tool = this._toolBar = document.createElement("div");
        //        $(this._toolBar).css("height", "30");
        //        $(this._toolBar).css("width", "200px");
        //                $(this._toolBar).css("border", "1px solid red");
        //                        tool.style.display = "none";

        var b = this._content = document.createElement("div");
        b.className = "content";
        //        b.style.padding = 0 + "px";

        if (o.url) {
            this.LoadUrl(o.url);
        } else {
            b.innerHTML = o.content;
        }

        //先插父元素，再插子元素。这样不会引起ie内存泄露
        document.body.appendChild(v);

        v.appendChild(tc);
        v.appendChild(tool);
        tc.appendChild(t);
        tc.appendChild(c);
        v.appendChild(b);

        //		document.body.appendChild(v);
    },
    //设置this._window的坐标
    InitPosition: function () {
        var o = this.config, v = this._window, c = this._content, t = this._titleContainer;
        v.style.left = o.left + "px";
        v.style.top = o.top + "px";

        v.style.width = o.width + "px";
        v.style.height = o.height + "px";

        //        v.style.left = (o.left - o.width) / 2;
        //        v.style.top = (o.top - o.height) / 2;

    },
    //设置content及iframe的高度
    Resize: function () {
        var o = this.config, v = this._window, c = this._content,
        t = this._titleContainer;
        var th = this.toolBar ? this.toolBar.GetHeight() : 0;

        var sh = this.statusBar ? this.statusBar.GetHeight() : 0;



        //        var th = 30;
        //DOTA.F.currentStyle(t).height可以改为“$(t).css("height")”
        //        var hei = o.height - parseInt(DOTA.F.currentStyle(t).height) - th - sh - o.contentPadding * 2;
        //                var hei = o.height - parseInt($(t).height()) - th - sh - o.contentPadding * 2;

        //        console.log(th);

        var hei = o.height - parseInt($(t).height());

        c.style.height = hei + "px"; //设置正文（content）的高度
        if (o.url) {
            //            console.log(hei);
            //            if (MyGameEngine.Base.Browser.ie) {
            hei -= 4;
            //            }
            c.getElementsByTagName("iframe")[0].style.height = hei + "px";  //设置正文里内联框架(iframe)的高度
        }
    },
    //窗体显示在显示器中间
    ResizeTo: function (width, height) {
        var isMove = arguments.length > 2 ? arguments[2] : true;    //是否能够拖动
        var o = this.config,
            scrollTop = 0;
        o.width = width, o.height = height;
        //如果能拖动，则重定位this._window（居中）。
        //因为拖动后可能不居中，所以需要重定位。
        if (isMove) {
            if (navigator.userAgent.indexOf("Chrome") >= 0) {
                scrollTop = document.body.scrollTop;
            }
            else {
                scrollTop = document.documentElement.scrollTop;
            }
            //            o.left = (DOTA.F.getOffsetWidth() - width) / 2;
            //            o.top = (DOTA.F.getOffsetHeight() - height) / 2;

            //            o.left = ($(document).width() - width) / 2;
            //            o.top = ($(document).height() - height) / 2;

            o.left = ($(window).width() - width) / 2;
//            console.log($(window).width(), $(window).height(), height);
            o.top = ($(window).height() - height) / 2 + scrollTop;     //加上页面滚动条的距离
//            console.log(document.body.scrollTop, document.documentElement.scrollTop);
            this.InitPosition();
        }
        this.Resize();  //设置content及iframe的高度
    },

    InitEvent: function () {
        var evt = MyGameEngine.Event, v = this._window, btn = this._closeButton, tc = this._title;

        this._onCloseMouseOver = evt.BindEvent(this, this.OnCloseMouseOver);
        this._onCloseMouseOut = evt.BindEvent(this, this.OnCloseMouseOut);
        this._onCloseClick = evt.BindEvent(this, this.OnCloseClick)
        this._onMouseDown = evt.BindEvent(this, this.OnMouseDown);

        //绑定关闭按钮的事件
        evt.AddEvent(btn, "mouseover", this._onCloseMouseOver);
        evt.AddEvent(btn, "mouseout", this._onCloseMouseOut);
        evt.AddEvent(btn, "click", this._onCloseClick);
        //绑定this._window窗体的事件
        evt.AddEvent(v, "mousedown", this._onMouseDown);

        //加载拖动控件，this._title（标题层）绑定拖动
        this.drag = new YYC.Drag(v, { handler: tc, cancelBubble: false });
        //        console.log(this.drag);
    },
    //创建遮罩层
    ShowOverLayer: function () {
        var l = this._overLayer, o = this.config;
        //创建遮罩层
        if (o.isShowMask) {
            if (!this._overLayer) {
                l = this._overLayer = document.createElement("div");
                l.className = "DOTA_OverLayer";
                l.style.zIndex = o.zIndex - 1;
                //                DOTA.F.SetOpacity(l, o.opacity);    //设置透明度
                //                console.log(o.opacity);
                $(l).css({ opacity: o.opacity });

                document.body.appendChild(l);
            }
            //网页正文全文宽： document.body.scrollWidth;
            //网页正文全文高： document.body.scrollHeight
            //            l.style.width = DOTA.F.getScrollWidth() + "px";
            //            l.style.height = DOTA.F.getScrollHeight() + "px";

            l.style.width = $(document).width() + "px";
            l.style.height = $(document).height() + "px";

            l.style.display = "block";
        }
    },
    //加入工具条。
    //获得工具条的高度，并修改窗体的高度。
    AddToolBar: function (o) {
        var height = 0;

        this.toolBar.Add(o);

        height = o.menu.GetHeight();

        //        console.log(o.menu.GetHeight());

        this.config.height += height;

        //        console.log(this.config.height);

        $(this._window).css("height", this.config.height);

        //        var t = this._toolBar;

        //        var self = this;

        //        console.log(this._toolBar.tagName);
        //        console.log(this._toolBar.offsetHeight);
        //        console.log(this._toolBar.style.height);
        //        console.log($(this._toolBar).height());

        //        this.toolBar.GetHeight();

        //        setTimeout(function () {
        //            self.toolBar.Add(o);
        //        }, 0);
        //        setTimeout(function () {
        //            alert($(self._toolBar).height());
        //        }, 0);

        //        var self = this;

        //        setTimeout(function () {
        //            var height = 0;

        //            height = $(self._toolBar).height();

        //            console.log(height);

        //        }, 0);

        //        console.log(height);
        //        this.config.height += 20;
        //        this.config.width += 20;
        //                this.Resize();
    },
    OnMouseDown: function () {
        this._window.style.zIndex = YYC.WindowMgr.GetzIndex(this);
    },
    OnCloseMouseOver: function () {
        this._closeButton.className = "hover";
    },
    OnCloseMouseOut: function () {
        this._closeButton.className = "button";
    },
    OnCloseClick: function () {
        if (this.config.isClear) {
            this.config.onUnLoad();     //调用onUnLoad
            this.Dispose();
        } else {
            this.Hide();
            //            var self = this;
            //            setTimeout(function () {
            //                self.Show();
            //            }, 2000);
        }
        this.config.onClose();     //调用onClose
    },
    SetOpacity: function (n) {
        //        DOTA.F.SetOpacity(this._window, n);
        $(this._window).css({ opacity: n });
    },
    SetTitle: function (title) {
        this._title.innerHTML = title;
    },
    //加载并显示
    LoadUrl: function (url) {
        //        console.log("LoadUrl", url);
        var self = this;

        this.config.url = url;
        //        console.log($("#iframe_window").length);
        //        //如果框架已经加载，则直接改变url
        //        if ($("#" + this.config.id).length > 0) {
        //            $("#" + this.config.id).attr("src", url);
        //        }
        //        else {
        this.frame = $("<iframe src='" + url + "' style='background-color:#FFFFFF; margin:0px; padding:0px;' width = '100%' frameborder='0' border='0'></iframe>");
        //        }
        $(this._content).append(this.frame);
        //显示
        //使用setTimeout 0 的技巧，跳出队列（因为此时iframe还没有加入）
        setTimeout(function () { self._Show(); }, 0);

        //        console.log($("#iframe_window").length);
    },
    SetContent: function (content) {
        this._content.innerHTML = content;
    },
    SetContentColor: function (foreColor, bgColor) {
        if (foreColor) {
            this._content.style.color = foreColor;
        }
        if (bgColor) {
            this._content.style.backgroundColor = bgColor;
        }
    },
    //    AppendChild: function (element) {
    //        this._content.appendChild(element);
    //    },
    Hide: function () {
        if (this.config.isShowMask && this._overLayer) {
            this._overLayer.style.display = "none";
        }
        if (this.config.animate) {
            this.animate.Hide();
        } else {
            this._window.style.display = "none";
        }
    },
    _Show: function () {
        var self = this;

        var iframe = this.frame;


        //        console.log(this.config.id, iframe.length);

        //框架iframe加载完成后才显示iframe
        if (iframe[0].attachEvent) {
            iframe[0].attachEvent("onload", function () {
                self.ShowOverLayer();   //创建并显示罩层
                if (self.config.animate) {    //使用动画效果
                    self.animate.Show();
                } else {
                    self._window.style.display = "block";
                }
            });
        }
        else {
            iframe[0].onload = function () {
                self.ShowOverLayer();   //创建并显示罩层
                if (self.config.animate) {    //使用动画效果
                    self.animate.Show();
                } else {
                    self._window.style.display = "block";
                }
            };
        }
    },
    Show: function () {
        if (this.config.isShowMask && this._overLayer) {
            this._overLayer.style.display = "block";
        }
        if (this.config.animate) {
            //            this.animate.Hide();
        } else {
            this._window.style.display = "block";
        }

        //        this._window.style.display = "block";
    },
    Close: function () {
        this.Dispose();
    },
    Dispose: function () {
        /* 需要Dispose的内容：
        调用所用插件的Dispose()、
        移除事件绑定、
        插入的元素移除。


        这里调用Dispose方法的目的是为了避免ie内存泄露。

        以下情况会造成ie内存泄露：

        1、给DOM对象添加的属性是一个对象的引用。范例：

        var MyObject = {};

        document.getElementById('myDiv').myProp = MyObject;

        解决方法：

        在window.onunload事件中写上: document.getElementById('myDiv').myProp = null;

        2、DOM对象与JS对象相互引用。范例：

        function Encapsulator(element) {

        this.elementReference = element;

        element.myProp = this;

        }

        new  Encapsulator(document.getElementById('myDiv'));

        解决方法：

        在onunload事件中写上: document.getElementById('myDiv').myProp = null;

        3、给DOM对象用attachEvent绑定事件。范例：

        function doClick() {}

        element.attachEvent("onclick", doClick);

        解决方法：

        在onunload事件中写上: element.detachEvent('onclick', doClick);

        4、从内到外执行appendChild。这时即使调用removeChild也无法释放。范例：

        var parentDiv =  document.createElement("div");

        var childDiv = document.createElement("div");

        parentDiv.appendChild(childDiv);

        document.body.appendChild(parentDiv);


        解决方法：

        从外到内执行appendChild:

        var parentDiv =  document.createElement("div");

        var childDiv = document.createElement("div");

        document.body.appendChild(parentDiv);

        parentDiv.appendChild(childDiv);

        5、反复重写同一个属性会造成内存大量占用(但关闭IE后内存会被释放)。范例：

        for(i = 0; i < 5000; i++) {

        hostElement.text = "asdfasdfasdf";

        }

        这种方式相当于定义了5000个属性！

        */
        var evt = MyGameEngine.Event, btn = this._closeButton, v = this._window;
        if (arguments.length == 0 && this.config.animate) {
            this.animate.Hide(null, MyGameEngine.Event.BindEvent(this, this.Dispose, true));
            return;
        }
        this.drag.Dispose();
        this.drag = null;
        //        this.animate.Dispose();

        evt.RemoveEvent(btn, "mouseover", this._onCloseMouseOver);
        evt.RemoveEvent(btn, "mouseout", this._onCloseMouseOut);
        evt.RemoveEvent(btn, "click", this._onCloseClick);

        if (this.toolBar) {
            this.toolBar.Dispose();
        }

        v.innerHTML = "";
        document.body.removeChild(v);
        if (this._overLayer) {
            document.body.removeChild(this._overLayer);
            this._overLayer = null;
        }

        this._window = this.Window = null;
        this._titleContainer = null;
        this._title = null;
        this._closeButton = null;
        this._content = null;
    }
};

//DOTA.Dialog = function(config){	
//	config.width = config.width || 200;
//	config.height = config.height || 170;
//	config.type = 1;
//	config.contentPadding = config.contentPadding || 10;
//	config.zIndex = config.zIndex || 2000;
//	DOTA.Window.call(this, config);
//	
//	this.Init();
//};
//DOTA.Extend(DOTA.Dialog.prototype, DOTA.Window.prototype);
//DOTA.Extend(DOTA.Dialog.prototype, {
//	Init : function(){
//		this.InitHtml();
//		this.initButton();
//		this.InitPosition();
//		this.Resize();
//		this.InitEvent();
//		this.config.onLoad();

//		this.animate = DOTA.Animation ? new DOTA.Animation({element: this._window, css: "DOTA_Window_MoveBG", speed: 160}) : null;
//	},
//	initButton : function(){
//		var v = this._window, evt = MyGameEngine.Event;
//		v.className += " DOTA_Dialog";
//		
//		this._onOKClick = evt.BindEvent(this, this.onOKClick);
//		this._onYESClick = evt.BindEvent(this, this.onYESClick);
//		this._onNOClick = evt.BindEvent(this, this.onNOClick);
//		
//		var b = this._buttonContainer = document.createElement("div");
//		b.className = "buttonContainer";
//		
//		var o = this._btnOK = new DOTA.Button({text: "确定", position: "absolute", onClick: this._onOKClick});
//		o.RenderTo(b);
//		o.Hide();
//		
//		var y = this._btnYES = new DOTA.Button({text: "确认", position: "absolute", onClick: this._onYESClick});
//		y.RenderTo(b);
//		y.Hide();
//		
//		var n = this._btnNO = new DOTA.Button({text: "取消", position: "absolute", onClick: this._onNOClick});
//		n.RenderTo(b);
//		n.Hide();
//		
//		v.appendChild(b);
//	},
//	Resize : function(){
//		var o = this.config, v = this._window, c = this._content, t = this._titleContainer, b = this._buttonContainer;
//		var ok = this._btnOK, yes = this._btnYES, no = this._btnNO, style = DOTA.F.currentStyle(b);
//		var bh = parseInt(style.height), bw = parseInt(style.width) || o.width - 2, spc = 50, top = (bh - ok.GetHeight()) / 2;
//		var hei = o.height - parseInt(DOTA.F.currentStyle(t).height) - bh - o.contentPadding;
//		c.style.height = hei + "px";
//		c.style.paddingBottom = "0px";

//		ok.setPosition((bw - ok.getWidth()) / 2, top);
//		var left = (bw - (yes.getWidth() + spc + no.getWidth())) / 2;
//		yes.setPosition(left, top);
//		no.setPosition(left + spc + yes.getWidth(), top);
//	},
//	onOKClick : function(){
//		this.Hide();
//		this.config.onUnLoad(1);
//	},
//	onYESClick : function(){
//		this.Hide();
//		this.config.onUnLoad(1);
//	},
//	onNOClick : function(){
//		this.Hide();
//		this.config.onUnLoad(0);
//	},
//	OnMouseDown : function(){
//		return false;
//	},
//	OnCloseClick : function(){
//		this.onNOClick();
//	},
//	setPosition : function(){
//		var cfg = this.config;
//		if(cfg.parent){
//			var wid = cfg.parent.clientWidth;
//			var hei = cfg.parent.clientHeight;
//			var offset = DOTA.F.getOffset(cfg.parent);
//			this._window.style.left = offset.x + (wid - cfg.width) / 2 + "px";
//			this._window.style.top = offset.y + (hei - cfg.height) / 2 + "px";
//		}
//	},
//	Show : function(msg){
//		this.SetContent(msg);
//		this.setPosition();
//		this.ShowOverLayer();
//		if( this.config.type == 1 ){
//			this._btnOK.Show();
//			this._btnYES.Hide();
//			this._btnNO.Hide();
//		}else{
//			this._btnOK.Hide();
//			this._btnYES.Show();
//			this._btnNO.Show();
//		}
//		if(this.config.animate){
//			this.animate.Show();
//		}else{
//			this._window.style.display = "block";
//		}
//	},
//	alert : function(msg){
//		this.config.type = 1;
//		this.Show(msg);
//	},
//	confirm : function(msg){
//		this.config.type = 2;
//		this.Show(msg);
//	},
//	Dispose : function(){
//		var evt = MyGameEngine.Event, btn = this._closeButton, v = this._window;
//		if(arguments.length == 0 && this.config.animate){
//			this.animate.Hide(null, MyGameEngine.Event.BindEvent(this, this.Dispose, true));
//			return;
//		}
//		this.drag.Dispose();
//		this.drag = null;
//		
//		this._btnOK.Dispose();
//		this._btnYES.Dispose();
//		this._btnNO.Dispose();
//		
//		evt.RemoveEvent(btn, "mouseover", this._onCloseMouseOver);
//		evt.RemoveEvent(btn, "mouseout", this._onCloseMouseOut);
//		evt.RemoveEvent(btn, "click", this._onCloseClick);
//		
//		v.innerHTML = "";
//		document.body.removeChild(v);
//		if(this._overLayer){
//			document.body.removeChild(this._overLayer);
//			this._overLayer = null;
//		}
//		
//		this._window = this.Window = null;
//		this._titleContainer = null;
//		this._title = null;
//		this._closeButton = null;
//		this._content = null;	
//		this._buttonContainer = null;
//	}
//});
