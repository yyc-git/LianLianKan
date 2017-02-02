/***********************************************
// DOTA.Window v0.1
// 作者：黄健
// 日期：2009.09.28
// ＱＱ：573704282
// Email: freewind22@163.com
// 转载请保留此信息.
************************************************/

DOTA.WindowMgr = {
	activeWindow : null,
	maxzIndex : 0,
	register : function(pWin, zIndex){
		this.maxzIndex = Math.max(this.maxzIndex, zIndex);
	},
	getzIndex : function(pWin){
		if(pWin !== this.activeWindow){
			this.maxzIndex++;
		}
		return this.maxzIndex;
	}
};


//        this.dlg = new DOTA.Window({
//                title: "标题",
//                isShow: false,
//                isClear: false,
//                opacity: 40
//            });

//        showDialog: function (type) {
//            var dlg = this.dlg;
//            switch (type.toLowerCase()) {
//                case "userinfo":
//                    dlg.setTitle("用户信息设置");
//                    dlg.loadUrl("member/user.html");
//                    dlg.resizeTo(300, 200);
//                    dlg.show();
//                    break;

DOTA.Window = function(config){	
	var width = DOTA.F.getOffsetWidth();    //获得总宽度
	var height = DOTA.F.getOffsetHeight();  //获得总高度

	this.config = DOTA.Extend({
		parent	: document.body,
		title 	: "窗口标题",
		left 	: (width - 400) / 2,
		top 	: (height - 300) / 2,
		width 	: 400,
		height 	: 300,
		zIndex 	: 1000,
		animate : (DOTA.Browser.ie ? false : true) && DOTA.Animation,   //?
		content : "窗口内容",
		isShow	: true,     //是否显示
		isClear	: true,
		isShowMask : true,  //是否显示遮罩层
		opacity : 50,
		contentPadding : 2,
		url 	: "",
		onLoad 	: function(){},
		onUnLoad : function(){}
	}, config || {});
	
    //初始化
	this.init();
};

DOTA.Window.prototype = {
	init : function(){
		this.initHtml();
		this.initPosition();
		this.resize();
		this.initEvent();

		this.toolBar = DOTA.ToolBar ? new DOTA.ToolBar(this._toolBar) : null;   //有什么用？？？
        //动画
		this.animate = DOTA.Animation ? new DOTA.Animation({element: this._window, css: "DOTA_Window_MoveBG"}) : null;
		this.config.onLoad();   //调用onLoad
		
		if(this.config.isShow){
			this.show();
		}else{
			this._window.style.display = "none";
		}
		
		DOTA.WindowMgr.register(this, this.config.zIndex);		//??
},
    //插入dom元素
	initHtml : function(){
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
		tool.style.display = "none";
		
		var b = this._content = document.createElement("div");
		b.className = "content";
		b.style.padding = o.contentPadding + "px";
		if( o.url ){
			this.loadUrl(o.url);
		}else{
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
	initPosition : function(){
		var o = this.config, v = this._window, c = this._content, t = this._titleContainer;
		v.style.left = o.left + "px";
		v.style.top = o.top + "px";
		v.style.width = o.width + "px";
		v.style.height = o.height + "px";
},
    //设置content及iframe的高度
	resize : function(){
		var o = this.config, v = this._window, c = this._content, t = this._titleContainer;
		var th = this.toolBar ? this.toolBar.getHeight() : 0;
		var sh = this.statusBar ? this.statusBar.getHeight() : 0;
		//DOTA.F.currentStyle(t).height可以改为“$(t).css("height")”
		var hei = o.height - parseInt(DOTA.F.currentStyle(t).height) - th - sh - o.contentPadding * 2;
		c.style.height = hei + "px";	//设置正文（content）的高度
		if( o.url ){
			if( !DOTA.Browser.ie ){
				hei -= 4;
			}
			c.getElementsByTagName("iframe")[0].style.height = hei + "px";  //设置正文里内联框架(iframe)的高度
		}
},
    //
	resizeTo : function(width, height){
		var isMove = arguments.length > 2 ? arguments[2] : true;    //是否能够拖动
		var o = this.config;
		o.width = width, o.height = height;
		//如果能拖动，则重定位this._window（居中）。
        //因为拖动后可能不居中，所以需要重定位。
		if(isMove){
			o.left = (DOTA.F.getOffsetWidth() - width) / 2; 
			o.top = (DOTA.F.getOffsetHeight() - height) / 2;
			this.initPosition();
		}

this.resize();  //设置content及iframe的高度
},
    
	initEvent : function(){
		var evt = DOTA.Event, v = this._window, btn = this._closeButton, tc = this._title;
		
		this._onCloseMouseOver = evt.bindEvent(this, this.onCloseMouseOver);
		this._onCloseMouseOut = evt.bindEvent(this, this.onCloseMouseOut);
		this._onCloseClick = evt.bindEvent(this, this.onCloseClick)
		this._onMouseDown = evt.bindEvent(this, this.onMouseDown);
		
        //绑定关闭按钮的事件
		evt.addEvent(btn, "mouseover", this._onCloseMouseOver);
		evt.addEvent(btn, "mouseout", this._onCloseMouseOut);
		evt.addEvent(btn, "click", this._onCloseClick);
		//绑定this._window窗体的事件
		evt.addEvent(v, "mousedown", this._onMouseDown);

		//加载拖动插件，this._title（标题层）绑定拖动
		this.drag = new DOTA.Drag(v, {handler : tc, cancelBubble: false });
},
//创建遮罩层
	showOverLayer : function(){
	    var l = this._overLayer, o = this.config;
	    //创建遮罩层
		if( o.isShowMask ){
			if( !this._overLayer ){
				l = this._overLayer = document.createElement("div");
				l.className = "DOTA_OverLayer";
				l.style.zIndex = o.zIndex - 1;
				DOTA.F.setOpacity(l, o.opacity);    //设置透明度
				
				document.body.appendChild(l);
}
            //网页正文全文宽： document.body.scrollWidth;
//网页正文全文高： document.body.scrollHeight
			l.style.width = DOTA.F.getScrollWidth()+ "px";
			l.style.height = DOTA.F.getScrollHeight()+ "px";
			l.style.display = "block";
		}
	},
	onMouseDown : function(){
		this._window.style.zIndex = DOTA.WindowMgr.getzIndex(this);
	},
	onCloseMouseOver : function(){
		this._closeButton.className = "hover";
	},
	onCloseMouseOut : function(){
		this._closeButton.className = "button";
	},
	onCloseClick : function(){
		if(this.config.isClear){
			this.config.onUnLoad();
			this.dispose();
		}else{
			this.hide();
		}
	},
	setOpacity : function(n){
		DOTA.F.setOpacity(this._window, n);
	},
	setTitle : function(title){
		this._title.innerHTML = title;
	},
	loadUrl : function(url){
		this.config.url = url;
		this._content.innerHTML = "<iframe src='" + url + "' style='background-color:#FFFFFF; margin:0px; padding:0px;' width = '100%' frameborder='0' border='0'></iframe>"
	},
	setContent : function(content){
		this._content.innerHTML = content;
	},
	setContentColor : function(foreColor, bgColor){
		if(foreColor){
			this._content.style.color = foreColor;
		}
		if(bgColor){
			this._content.style.backgroundColor = bgColor;
		}
	},
	appendChild : function(element){
		this._content.appendChild(element);
	},
	hide : function(){
		if( this.config.isShowMask && this._overLayer ){
			this._overLayer.style.display = "none";
		}
		if(this.config.animate){
			this.animate.hide();
		}else{
			this._window.style.display = "none";
		}
	},
	show : function(){
		this.showOverLayer();
		if(this.config.animate){    //使用动画效果
			this.animate.show();
		}else{
			this._window.style.display = "block";
		}
	},
	close : function(){
		this.dispose();
	},
	dispose : function(){
		var evt = DOTA.Event, btn = this._closeButton, v = this._window;
		if(arguments.length == 0 && this.config.animate){
			this.animate.hide(null, DOTA.Event.bindEvent(this, this.dispose, true));
			return;
		}
		this.drag.dispose();
		this.drag = null;
		this.animate.dispose();
		
		evt.removeEvent(btn, "mouseover", this._onCloseMouseOver);
		evt.removeEvent(btn, "mouseout", this._onCloseMouseOut);
		evt.removeEvent(btn, "click", this._onCloseClick);
		
		if( this.toolBar ){
			this.toolBar.dispose();
		}
		
		v.innerHTML = "";
		document.body.removeChild(v);
		if(this._overLayer){
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

DOTA.Dialog = function(config){	
	config.width = config.width || 200;
	config.height = config.height || 170;
	config.type = 1;
	config.contentPadding = config.contentPadding || 10;
	config.zIndex = config.zIndex || 2000;
	DOTA.Window.call(this, config);
	
	this.init();
};
DOTA.Extend(DOTA.Dialog.prototype, DOTA.Window.prototype);
DOTA.Extend(DOTA.Dialog.prototype, {
	init : function(){
		this.initHtml();
		this.initButton();
		this.initPosition();
		this.resize();
		this.initEvent();
		this.config.onLoad();

		this.animate = DOTA.Animation ? new DOTA.Animation({element: this._window, css: "DOTA_Window_MoveBG", speed: 160}) : null;
	},
	initButton : function(){
		var v = this._window, evt = DOTA.Event;
		v.className += " DOTA_Dialog";
		
		this._onOKClick = evt.bindEvent(this, this.onOKClick);
		this._onYESClick = evt.bindEvent(this, this.onYESClick);
		this._onNOClick = evt.bindEvent(this, this.onNOClick);
		
		var b = this._buttonContainer = document.createElement("div");
		b.className = "buttonContainer";
		
		var o = this._btnOK = new DOTA.Button({text: "确定", position: "absolute", onClick: this._onOKClick});
		o.renderTo(b);
		o.hide();
		
		var y = this._btnYES = new DOTA.Button({text: "确认", position: "absolute", onClick: this._onYESClick});
		y.renderTo(b);
		y.hide();
		
		var n = this._btnNO = new DOTA.Button({text: "取消", position: "absolute", onClick: this._onNOClick});
		n.renderTo(b);
		n.hide();
		
		v.appendChild(b);
	},
	resize : function(){
		var o = this.config, v = this._window, c = this._content, t = this._titleContainer, b = this._buttonContainer;
		var ok = this._btnOK, yes = this._btnYES, no = this._btnNO, style = DOTA.F.currentStyle(b);
		var bh = parseInt(style.height), bw = parseInt(style.width) || o.width - 2, spc = 50, top = (bh - ok.getHeight()) / 2;
		var hei = o.height - parseInt(DOTA.F.currentStyle(t).height) - bh - o.contentPadding;
		c.style.height = hei + "px";
		c.style.paddingBottom = "0px";

		ok.setPosition((bw - ok.getWidth()) / 2, top);
		var left = (bw - (yes.getWidth() + spc + no.getWidth())) / 2;
		yes.setPosition(left, top);
		no.setPosition(left + spc + yes.getWidth(), top);
	},
	onOKClick : function(){
		this.hide();
		this.config.onUnLoad(1);
	},
	onYESClick : function(){
		this.hide();
		this.config.onUnLoad(1);
	},
	onNOClick : function(){
		this.hide();
		this.config.onUnLoad(0);
	},
	onMouseDown : function(){
		return false;
	},
	onCloseClick : function(){
		this.onNOClick();
	},
	setPosition : function(){
		var cfg = this.config;
		if(cfg.parent){
			var wid = cfg.parent.clientWidth;
			var hei = cfg.parent.clientHeight;
			var offset = DOTA.F.getOffset(cfg.parent);
			this._window.style.left = offset.x + (wid - cfg.width) / 2 + "px";
			this._window.style.top = offset.y + (hei - cfg.height) / 2 + "px";
		}
	},
	show : function(msg){
		this.setContent(msg);
		this.setPosition();
		this.showOverLayer();
		if( this.config.type == 1 ){
			this._btnOK.show();
			this._btnYES.hide();
			this._btnNO.hide();
		}else{
			this._btnOK.hide();
			this._btnYES.show();
			this._btnNO.show();
		}
		if(this.config.animate){
			this.animate.show();
		}else{
			this._window.style.display = "block";
		}
	},
	alert : function(msg){
		this.config.type = 1;
		this.show(msg);
	},
	confirm : function(msg){
		this.config.type = 2;
		this.show(msg);
	},
	dispose : function(){
		var evt = DOTA.Event, btn = this._closeButton, v = this._window;
		if(arguments.length == 0 && this.config.animate){
			this.animate.hide(null, DOTA.Event.bindEvent(this, this.dispose, true));
			return;
		}
		this.drag.dispose();
		this.drag = null;
		
		this._btnOK.dispose();
		this._btnYES.dispose();
		this._btnNO.dispose();
		
		evt.removeEvent(btn, "mouseover", this._onCloseMouseOver);
		evt.removeEvent(btn, "mouseout", this._onCloseMouseOut);
		evt.removeEvent(btn, "click", this._onCloseClick);
		
		v.innerHTML = "";
		document.body.removeChild(v);
		if(this._overLayer){
			document.body.removeChild(this._overLayer);
			this._overLayer = null;
		}
		
		this._window = this.Window = null;
		this._titleContainer = null;
		this._title = null;
		this._closeButton = null;
		this._content = null;	
		this._buttonContainer = null;
	}
});
