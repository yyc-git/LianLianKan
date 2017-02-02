/***********************************************
来自：

DOTA.Button v0.1
作者：黄健
日期：2009.09.26
ＱＱ：573704282
Email: freewind22@163.com


修改：

作者：YYC
日期：2012-10-31
电子邮箱：395976266@qq.com
QQ: 395976266
博客：http://www.cnblogs.com/chaogex/

************************************************/


//        //按钮
//        new YYC.Button({ text: "", className: ["btnClose", "btnCloseHover", "btnCloseDown"],
//            onClick: function (e) {
//                console.log(e.target);
//                self.exit();
//            }
//        }).RenderTo("closeButton");

if (typeof YYC === "undefined" || !YYC) {
    window.YYC = {};
}


YYC.Button = function (config) {
    this.config = MyGameEngine.Base.Extend({
        id: "",     //按钮的id
        text: "按钮",
//        value: [],  //传递给onClick的参数
        position: "",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        className: ["DOTA_Button1", "DOTA_Button_Hover1", "DOTA_Button_Down1"],    //正常状态  鼠标移动到按钮上面  鼠标按下按钮
        addClass: null,   //增加的css类，用于用户增加按钮样式
        buttonStyle: 1, //使用第几套默认的Button样式（现在有两套默认样式）；-1表示使用自定义的样式（从className中传入）
        onMouseOver: function (e) { },
        onMouseOut: function (e) { },
        onClick: function (e) { }
    }, config || {});

    //初始化
    this.Init();
//    //直接调用RenderTo
//    this.RenderTo(this.config.id);
};
YYC.Button.prototype = {
    Init: function () {
        var b = this.button = document.createElement("div"), c = this.config, evt = MyGameEngine.Event;

        if (c.buttonStyle !== -1) {
            c.className = ["DOTA_Button" + c.buttonStyle.toString(), "DOTA_Button_Hover" + c.buttonStyle.toString(), "DOTA_Button_Down" + c.buttonStyle.toString()];
        }

        b.className = c.className[0];
        b.innerHTML = c.text;
        b.hideFocus = "hideFocus";  //?
        //如果配置中传入了id,则设置按钮id
        c.id && b.setAttribute("id", c.id);

        //        b.style.display = "inline-block";
        //增加样式
        this.AddClass(b, c.addClass);
        //        $(b).addClass("inline_block");

        if (c.position) {
            b.style.position = c.position;
            b.style.left = c.left + "px";
            b.style.top = c.top + "px";
        }
        if (c.width > 0) {
            b.style.width = c.width + "px";
            b.style.height = c.height + "px";
            b.style.lineHeight = c.height + "px";
        }

        //绑定事件
        this._onMouseOver = evt.BindEvent(this, this.onMouseOver);
        this._onMouseOut = evt.BindEvent(this, this.onMouseOut);
        //        this._onClick = evt.BindEvent(this, this.onClick, c.value);     //传递参数
        this._onClick = evt.BindEvent(this, this.onClick);     //传递参数
        this._onMouseDown = evt.BindEvent(this, this.OnMouseDown);
        this._onMouseUp = evt.BindEvent(this, this.OnMouseUp);

        evt.AddEvent(b, "mouseover", this._onMouseOver);
        evt.AddEvent(b, "mouseout", this._onMouseOut);
        evt.AddEvent(b, "click", this._onClick);
        evt.AddEvent(b, "mousedown", this._onMouseDown);
        evt.AddEvent(b, "mouseup", this._onMouseUp);
    },
    AddClass: function (ob, className) {
        if (className) {
            if (!$(ob).hasClass(className)) {
                $(ob).addClass(className);
            }
        }
    },
    GetWidth: function () {
        return parseInt($(this.button).width());
    },
    GetHeight: function () {
        return parseInt($(this.button).height());
    },
    SetText: function (text) {
        this.button.innerHTML = text;
    },
    SetPosition: function (x, y) {
        this.button.style.left = x + "px";
        this.button.style.top = y + "px";
    },
    Show: function () {
        this.button.style.display = "";
    },
    Hide: function () {
        this.button.style.display = "none";
    },
    //加入到container中
    //    RenderTo: function (container) {
    //        container.appendChild(this.button);
    //    },
    RenderTo: function (container) {
        MyGameEngine.Base.$(container).append(this.button);
        //        console.log();
        //        $(container).append(this.button);
        //        document.getElementById(container).appendChild(this.button);
    },
    onMouseOver: function (e) {
        this.button.className = this.config.className[1];

        this.AddClass(this.button, this.config.addClass);
        //        $(this.button).addClass("inline_block");

        this.config.onMouseOver(e);
    },
    onMouseOut: function (e) {
        this.button.className = this.config.className[0];
        //        $(this.button).addClass("inline_block");
        this.AddClass(this.button, this.config.addClass);

        this.config.onMouseOut(e);
    },
    //    onClick: function () {
    //        this.config.onClick();
    //    },
    //    onClick: function (e, value) {
    //        //        console.log(this.config.onClick);
    //        this.config.onClick(e, value);
    //    },
    onClick: function (e) {
        //        console.log(this.config.onClick);
        this.config.onClick(e);
    },
    OnMouseDown: function () {
        this.button.className += " " + this.config.className[2];

        this.AddClass(this.button, this.config.addClass);

    },
    OnMouseUp: function () {
        //消去className[2]
        this.button.className = this.button.className.replace(new RegExp(" " + this.config.className[2], "ig"), "");

        this.AddClass(this.button, this.config.addClass);
    },
    Dispose: function () {
        var b = this.button, evt = MyGameEngine.Event;

        evt.RemoveEvent(b, "mouseover", this._onMouseOver);
        evt.RemoveEvent(b, "mouseout", this._onMouseOut);
        evt.RemoveEvent(b, "click", this._onClick);
        evt.RemoveEvent(b, "mousedown", this._onMouseDown);
        evt.RemoveEvent(b, "mouseup", this._onMouseUp);

        b.innerHTML = "";
        b.parentNode && b.parentNode.removeChild(b);
    }
};
