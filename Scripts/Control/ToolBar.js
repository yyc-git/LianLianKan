/***********************************************
来自：

DOTA.ToolBar v0.1
作者：黄健
ＱＱ：573704282
Email: freewind22@163.com


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


YYC.ToolBarItem = function (config) {
	this.config = MyGameEngine.Base.Extend({
		icon : '',
		text : '',
		menu : null,    //菜单控件对象
		field : null    //field是什么？
	}, config || {});
	
	this.Init();
};
YYC.ToolBarItem.prototype = {
    Init: function () {
        var cfg = this.config, e = this.element = document.createElement("div");
//        $(this.element).css({"border": "1px solid red"});
        if (cfg.menu) {
            cfg.menu.RenderTo(e);
        }
        if (cfg.field) {
            cfg.field.RenderTo(e);
        }
    },
    RenderTo: function (container) {
        container.appendChild(this.element);
    },
    Dispose: function () {
        var cfg = this.config;
        if (cfg.menu) {
            cfg.menu.Dispose();
        }
        if (cfg.field) {
            cfg.field.Dispose();
        }
        this.element.innerHTML = "";
        this.element = null;
    }
};

YYC.ToolBar = function (container) {
    this.container = MyGameEngine.Base.GetDom(container);
    this.Init();
    this.items = [];
};
YYC.ToolBar.prototype = {
	Init : function(){
		var e = this.element = document.createElement("div");
		e.cssText = "position:relative;"
		this.container.appendChild(e);
},
    //加入一个工具条
	Add : function(o){
		if(typeof o == "object"){
			var i = new YYC.ToolBarItem(o);    
			this.items.push(i);
			i.RenderTo(this.element);
		}
	},
	Render : function(){
		this.container.style.display = "block";
		this.container.appendChild(this.element);
	},
	GetHeight : function(){
		var i, o = this.items, h = 0, e;
		for( i = 0; i < o.length; i++ ){
			e = o[i].element;
			h += parseInt(e.style.height || e.offsetHeight);
		}
		return h;
	},
	Dispose : function(){
		var i, o = this.items;
		for( i = 0; i < o.length; i++ ){
			o[i].Dispose();
		}
		
		this.element.innerHTML = "";
		this.container.removeChild(this.element);
		this.items = this.element = null;
	}
};