/***********************************************
来自：

DOTA.Menu v0.1
作者：黄健
日期：2009.09.20
ＱＱ：573704282
Email: freewind22@163.com


修改：

作者：YYC
日期：2012-10-30
电子邮箱：395976266@qq.com
QQ: 395976266
博客：http://www.cnblogs.com/chaogex/

************************************************/

if (typeof YYC == "undefined" || !YYC) {
    window.YYC = {};
}


YYC.MENU = {};


//    window.menu = new YYC.MENU.Menu({ id: "menuContainer", items: [
//		    {
//		        text: '文件(F)',
//		        menu: {
//		            items: [
//					    {
//					        text: '新建',
//					        //					    hotKey: 'Ctrl + D',
//					        handler: MyGameEngine.Event.BindEvent(window, onMenuClick, 'testArg'),
//					        menu: { items: [
//										      { text: '新建文本文件' },
//										      { text: '新建网页文件' },
//										      { text: '新建...',
//										          menu: { items: [{
//										              text: '三级菜单', menu: { items: [
//                                                    { text: '四级菜单' }
//                                                  ]
//										              }
//										          }
//                                                  ]
//										          }
//										      }
//                                              ]
//					        }
//					    }, {
//					        text: '打开　　　　Ctrl + O', handler: onMenuClick, checked: true
//					    }, '-', {
//					        text: '退出', handler: onMenuClick
//					    }
//				    ]
//		        }
//		    }, {
//		        text: '编辑(E)',
//		        menu: {
//		            items: [
//					    { text: '复制　　　　Ctrl + C', handler: onMenuClick },
//					    { text: '剪切', handler: removeHandler }
//				    ]
//		        }
//		    }
//		    ]
//    });
//this.menu.RenderTo("gameMenu");



//菜单项
YYC.MENU.MenuItem = function (text, handler, level, isChecked, isFolder) {
	this.text = text;
	this.handler = handler || function(){};
	this.level = level || 0;
	this.isChecked = !!isChecked;   //加上“√”
	this.isFolder = !!isFolder;     //加上“►”
	this.subMenu = null;
	this.element = null;
	this.check = null;
};

YYC.MENU.MenuItem.prototype = {
    //显示菜单项
    RenderTo: function (container) {
        var s, e = this.element = document.createElement("div");
        //            container = MyGameEngine.Base.$(container);

        e.className = "DOTA_MenuItem";

        if (this.text === "-") {
            e.className = "DOTA_MenuSeparator";
            e.innerHTML = "&nbsp;";
        } else if (this.level > 0) {
            s = this.check = document.createElement("span");
            s.innerHTML = this.isChecked ? "√" : "&nbsp;";
            s.className = "DOTA_MenuItem_Check";
            e.appendChild(s);

            s = this.menu = document.createElement("span");
            s.innerHTML = this.text;
            s.className = "DOTA_MenuItem_Text";
            e.appendChild(s);

            s = this.more = document.createElement("span");
            s.innerHTML = this.isFolder ? '►' : '&nbsp;';
            s.className = "DOTA_MenuItem_More";
            e.appendChild(s);

        } else {
            e.innerHTML = this.text;
        }

        container.appendChild(e);
    },
    SetText: function (text) {
        this.menu.innerHTML = text;
    },
    GetText: function () {
        return this.menu.innerHTML;
    },
    Dispose: function () {
        if (this.element) {
            this.element.innerHTML = "";
            this.element = null;
        }
    }
};


//此处之所以要分主菜单和子菜单，是因为主菜单与子菜单不同（如onclick事件处理不同等）
//主菜单是横起显示的项，子菜单是下拉框

//主菜单
YYC.MENU.MainMenu = function (menu) {
	this.menuID = "";
	this.menu = menu || {items : []};
	this.menus = [];
	this.events = [];
	this.isRender = false;  //有什么用？
	this.isClick = false;   //点击菜单标志
	this.element = null;
	this.subMenu = null;
	this.currentIndex = -1;     //当前事件发生的菜单项
	
	this.ondocumentclick = MyGameEngine.Event.BindEvent(this, this.OnDocumentClick);
};
YYC.MENU.MainMenu.prototype = {
    RenderTo: function (container) {
        var i, s, o = this.menu.items, e, evt = MyGameEngine.Event;
        e = this.element = document.createElement("div");
        e.className = "DOTA_MainMenu";
        container.appendChild(e);

        for (i = 0; i < o.length; i++) {
            //显示菜单项，只显示文字
            s = this.menus[i] = new YYC.MENU.MenuItem(o[i].text ? o[i].text : o[i]);
            s.RenderTo(e);

            //事件handler加入事件数组
            if (!this.events[i]) {
                this.events[i] = {};
                this.events[i].onmouseover = evt.BindEvent(this, this.OnMouseOver, i, s.element);
                this.events[i].onmouseout = evt.BindEvent(this, this.OnMouseOut, i, s.element);
                this.events[i].onclick = evt.BindEvent(this, this.OnClick, i, s.element);
            }
            //绑定事件
//            s.element.onclick = this.events[i].onclick;
            evt.AddEvent(s.element, "mouseover", this.events[i].onmouseover);
            evt.AddEvent(s.element, "mouseout", this.events[i].onmouseout);
            evt.AddEvent(s.element, "click", this.events[i].onclick);
            //如果有子菜单则加入
            if (o[i].menu) {
                s.subMenu = new YYC.MENU.SubMenu(o[i].menu);
                s.subMenu.RenderTo(container);
            }
        }
        evt.AddEvent(document, "click", this.ondocumentclick);

        this.isRender = true;
    },
    OnMouseOver: function (oEvent, index, el) {
        var i = this.currentIndex, o = this.menus;
        //同一菜单
        if (i == index) {
            return;
        }
        if (this.isClick) {
            el.className += " click";
            //隐藏前一个菜单
            if (i >= 0) {
                o[i].subMenu.Hide();
                o[i].element.className = o[i].element.className.replace(/(hover)|(click)/ig, "");
            }
            //显示当前菜单
            o[index].subMenu.Show(el, 0);
            this.currentIndex = index;
        } else {
            el.className += " hover";
        }
    },
    OnMouseOut: function (oEvent, index, el) {
        if (!this.isClick) {
            el.className = el.className.replace(/(hover)|(click)/ig, "");
        }
    },
    OnClick: function (oEvent, index, el) {
        this.isClick = true;

        el.className += " click";
        oEvent.stopBubble();   //阻止冒泡

        this.currentIndex = index;
        this.menus[index].subMenu.Show(el, 0);  //显示子菜单
    },
    //点击非菜单，则隐藏菜单
    OnDocumentClick: function () {
        var i = this.currentIndex, o = this.menus;
        if (this.isClick && o) {
            this.isClick = false;
            o[i].element.className = o[i].element.className.replace(/(hover)|(click)/ig, "");
            o[i].subMenu.Hide();
        }
        this.currentIndex = -1;
    },
    GetHeight: function () {
        return $(this.element).height();
    },
    Dispose: function () {
        var i, evt = MyGameEngine.Event, o = this.menus, e = this.events;
        if (this.subMenu) {
            this.subMenu.Dispose();
        }

        evt.RemoveEvent(document, "click", this.ondocumentclick);
        for (i = 0; i < e.length; i++) {
            evt.RemoveEvent(o[i].element, "mouseover", e[i].onmouseover);
            evt.RemoveEvent(o[i].element, "mouseout", e[i].onmouseout);
            evt.RemoveEvent(o[i].element, "click", e[i].onclick);
        }

        for (i = 0; i < o.length; i++) {
            o[i].subMenu && o[i].subMenu.Dispose();
            o[i].Dispose();
        }

        this.menu = this.menus = this.events = null;
        if (this.element) {
            this.element.innerHTML = "";
            this.element = null;
        }
    }
};

//子菜单
YYC.MENU.SubMenu = function (menu, container) {
	this.menu = menu || {items : []};
	this.menus = [];
	this.events = [];
	this.element = null;
	this.subMenu = null;
	this.isShow = false;
	this.isSet = false;
	this.currentIndex = -1;
};
YYC.MENU.SubMenu.prototype = {
    RenderTo: function (container) {
        var i, s, o = this.menu.items, e, evt = MyGameEngine.Event;

        e = this.element = document.createElement("div");
        e.className = "DOTA_SubMenu";
        container.appendChild(e);

        for (i = 0; i < o.length; i++) {
            s = this.menus[i] = new YYC.MENU.MenuItem(o[i].text ? o[i].text : o[i], o[i].handler, 1, o[i].checked, o[i].menu);
            s.RenderTo(e);
            if (!this.events[i]) {
                this.events[i] = {};
                this.events[i].onmouseover = evt.BindEvent(this, this.OnMouseOver, i, s.element);
                this.events[i].onmouseout = evt.BindEvent(this, this.OnMouseOut, i, s.element);
                this.events[i].onclick = evt.BindEvent(this, this.OnClick, i, s.element);
            }
            if (o[i].text) {
                evt.AddEvent(s.element, "mouseover", this.events[i].onmouseover);
                evt.AddEvent(s.element, "mouseout", this.events[i].onmouseout);
                evt.AddEvent(s.element, "click", this.events[i].onclick);
            }
            //如果有子菜单则递归加入子菜单
            if (o[i].menu) {
                s.subMenu = new YYC.MENU.SubMenu(o[i].menu);
                s.subMenu.RenderTo(container);
            }
        }
    },
    OnMouseOver: function (oEvent, index, el) {
        var i = this.currentIndex, o = this.menus;
        if (i >= 0) {
            o[i].element.className = o[i].element.className.replace(/hover/ig, "");
            if (o[i].subMenu) {
                o[i].subMenu.Hide();
            }
        }
        el.className += " hover";
        if (o[index].subMenu) {
            o[index].subMenu.Show(el);
        }
        this.currentIndex = index;
    },
    OnMouseOut: function (oEvent, index, el) {
        //el.parentNode.className = oEvent.target.parentNode.className.replace(/hover/ig, "");
    },
    //执行handler
    OnClick: function (oEvent, index, el) {
        //        console.log(oEvent);

        //        this.menus[index].handler();

        this.menus[index].handler(oEvent);

        //oEvent.stopPropagation();
    },
    //获得类名为“DOTA_Menu”的祖先元素
    GetParent: function (obj) {
        while (obj && obj.className != "DOTA_Menu") {
            obj = obj.parentNode;
        }
        return obj;
    },
    Show: function (parent, level) {
        var x, y, hei, wid, root, pos;
        if (!this.isSet) {
            this.isSet = true;
            root = this.GetParent(parent);
            if (level === 0) {
                x = parent.offsetLeft, y = parent.offsetTop, hei = parent.offsetHeight;
                this.element.style.left = x + "px";
                this.element.style.top = y + hei + 1 + "px";
            } else {
                //    				pos = DOTA.F.getOffset(parent, this.GetParent(parent)), wid = parent.offsetWidth;
                pos = MyGameEngine.Base.GetToParentOffset(parent, this.GetParent(parent)), wid = parent.offsetWidth;
                this.element.style.left = pos.left + wid + "px";
                this.element.style.top = pos.top + "px";
            }
        }
        this.element.style.display = "block";
        this.isShow = true;
    },
    Hide: function () {
        var i = this.currentIndex, o = this.menus;
        if (i >= 0) {
            o[i].element.className = o[i].element.className.replace(/hover/ig, "");
        }
        this.element.style.display = "none";

        this.isShow = false;

        for (i = 0; i < o.length; i++) {
            if (o[i].subMenu && o[i].subMenu.isShow) {
                o[i].subMenu.Hide();
            }
        }
    },
    Dispose: function () {
        var i, evt = MyGameEngine.Event, o = this.menus, e = this.events;
        if (this.subMenu) {
            this.subMenu.Dispose();
        }

        for (i = 0; i < e.length; i++) {
            evt.RemoveEvent(o[i].element, "mouseover", e[i].onmouseover);
            evt.RemoveEvent(o[i].element, "mouseout", e[i].onmouseout);
            evt.RemoveEvent(o[i].element, "click", e[i].onclick);
        }

        for (i = 0; i < o.length; i++) {
            o[i].subMenu && o[i].subMenu.Dispose();
            o[i].Dispose();
        }

        this.menu = this.menus = this.events = null;
        if (this.element) {
            this.element.innerHTML = "";
            this.element = null;
        }
    }
};


//菜单
YYC.MENU.Menu = function (menu) {
    menu = menu || {};
//    this.menuID = menu.id || "";
    this.mainMenu = new YYC.MENU.MainMenu(menu);

//    //此处修改为直接调用RenderTo
//    //menu.id即为外层（container）的id
//    this.RenderTo(menu.id);
};
YYC.MENU.Menu.prototype = {
    RenderTo: function (container) {
        //        var e = this.element = document.createElement("div");

        container = MyGameEngine.Base.GetDom(container);

        //        e.className = "DOTA_Menu";
        //        e.id = this.menuID;

        container.className = "DOTA_Menu";

        //        //加入菜单最外围的层
        //        container.appendChild(e);

        //        //加入菜单
        //        this.mainMenu.RenderTo(e);

        //加入菜单
        this.mainMenu.RenderTo(container);
    },
    SetPosition: function (x, y) {
        var el = this.element;
        el.style.left = x + "px";
        el.style.top = y + "px";
    },
    GetHeight: function () {
        return this.mainMenu.GetHeight();
    },
    /*  设置显示的文字。
        调用示例：
        this.menu.SetText([0, 1], "继续");    //设置主菜单第1项的一级子菜单第2项为“继续”
        this.menu.SetText([0, 1, 0], "继续"); //设置主菜单第1项的一级子菜单第2项的二级子菜单第1项为“继续”
    */
    SetText: function (where, text) {
        var main = where[0],
            temp = this.mainMenu.menus[main],
            i = 1;

        while (where[i] !== undefined) {
            temp = temp.subMenu.menus[where[i]];
            i += 1;
        }
        temp.SetText(text);
    },
    GetText: function () {
    },
    /*  设置该项的handler。
    调用示例：
    //设置主菜单第1项的一级子菜单第2项的handler为“function () {alert("new!");});”
    menu.SetHandle([0, 1], function () {
        alert("new!");
    });
    */
    SetHandle: function (where, new_handle) {
        var main = where[0],
            temp = this.mainMenu.menus[main],
            i = 1;

        while (where[i] !== undefined) {
            temp = temp.subMenu.menus[where[i]];
            i += 1;
        }
        temp.handler = new_handle;
    },
    GetHandle: function(){
    },
    Hide: function () {
        this.mainMenu.OnDocumentClick();
    },
    Dispose: function () {
        this.mainMenu.Dispose();

        if (this.element) {
            this.element.innerHTML = "";
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }
};