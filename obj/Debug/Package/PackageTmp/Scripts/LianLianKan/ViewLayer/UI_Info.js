//游戏界面

//显示信息


var Interface_UI_Info = MyInterface("ShowCenter", "ShowInfo", "ShowRightInfo", "ShowUpInfo", "ShowUpImg");

var UI_Info = MyClass({ Interface: Interface_UI_Info }, {
    Init: function () {
    },
    Public: {
        //显示中间图片和信息
        //路径、显示时间(秒)（time为-1表示一直显示）
        ShowCenter: function (src, info, time) {
            if (src) {
                $("#gameMsg").show();

                $("#index_showImg").attr("src", src);
                $("#index_imgInfo").html(info);
                if (time !== -1) {
                    window.setTimeout(function () {
                        $("#index_showImg").attr("src", "");
                        $("#index_imgInfo").html("");
                        $("#gameMsg").hide();   //要隐藏，否则被覆盖的方块点不起
                    }, time * 1000);
                }
                else {
                }
            }
        },
        //显示中间信息。
        ShowInfo: function (info, time) {
            if (info === undefined) {
                return;
            }
            else if (info === "") {
                $("#index_showScore").html("");
                $("#index_showScore").hide();   //要隐藏，否则被覆盖的方块点不起
                return;
            }
            else {
                $("#index_showScore").show();
                $("#index_showScore").html(info);

                if (time !== -1) {
                    window.setTimeout(function () {
                        $("#index_showScore").html("");
                        $("#index_showScore").hide();   //要隐藏，否则被覆盖的方块点不起
                    }, time * 1000);
                }
                else {
                }
            }
        },
        //显示右边的信息
        //信息、显示时间(秒)（time为-1表示一直显示）、是否清空
        ShowRightInfo: function (_info, time, clear) {
            //        var time = _time ? _time : -1;

            //        alert(info);
            //        console.log("info");
            var info = null;

            if (_info === undefined) {
                return;
            }
            else if (_info === "") {
                $("#right_info").html("");
                return;
            }
            else {
                if (clear) {
                    $("#right_info").html("");
                }

                //如：info为“所有道具加1”，则直接生成jquery节点
                if (operate.IsString(_info)) {
                    info = $("<ul><li>" + operate.EscapeJquery(_info) + "</li></ul>");  //要进行转义
                }
                else {
                    info = _info;
                }
                //        alert("a");
                $("#right_info").prepend(info);

                if (time !== -1) {
                    window.setTimeout(function () {
                        info && info.remove();
                    }, time * 1000);
                }
                else {
                }
            }
        },
        //显示右边的信息
        //信息、显示时间(秒)（time为-1表示一直显示）、是否清空
        ShowRightInfoFormat: function (_info, time, clear, _args) {
            //        var time = _time ? _time : -1;

            //        alert(info);
            //        console.log("info");
            var info = null,
                temp_info = "";
                args = null;


            if (operate.IsArray(_args) && arguments.length === 4 && _args.length > 1) {
                args = _args;
            }
            else {
                args = Array.prototype.slice.call(arguments, 3);
            }

            if (_info === undefined) {
                return;
            }
            else if (_info === "") {
                $("#right_info").html("");
                return;
            }
            else {
                if (clear) {
                    $("#right_info").html("");
                }

                //如：info为“所有道具加1”，则直接生成jquery节点
                if (operate.IsString(_info)) {
                    temp_info = MyGameEngine.Base.FormatDelegate(operate.EscapeJquery(_info), args);
//                    console.log(temp_info);
                    info = $("<ul><li>" + temp_info + "</li></ul>");  //要进行转义
                }
                else {
                    //                    info = _info;
                    throw new Error("info必须为字符串！");
                }
                //        alert("a");
                $("#right_info").prepend(info);

                if (time !== -1) {
                    window.setTimeout(function () {
                        info && info.remove();
                    }, time * 1000);
                }
                else {
                }
            }
        },
        //显示上边的boss信息
        //信息、显示时间(秒)（time为-1表示一直显示）、是否清空
        ShowUpInfo: function (_info, time, clear) {
            var info = null;

            if (_info === undefined) {
                return;
            }
            else if (_info === "") {
                $("#lianliankan_smallMap_info").html("");
                return;
            }
            else {
                //            $("#lianliankan_smallMap_img").hide();

                if (clear) {
                    $("#lianliankan_smallMap_info").html("");
                }

                //如：info为“所有道具加1”，则直接生成jquery节点
                if (operate.IsString(_info)) {
                    info = $("<ul><li>" + operate.EscapeJquery(_info) + "</li></ul>");  //要进行转义
                }
                else {
                    info = _info;
                }
                //        alert("a");
                $("#lianliankan_smallMap_info").prepend(info);

                if (time !== -1) {
                    window.setTimeout(function () {
                        info && info.remove();
                    }, time * 1000);
                }
                else {
                }
            }
        },
        //显示上边的图片/动画
        ShowUpImg: function (src, time) {
            if (src) {
                $("#lianliankan_smallMap_img").show();

                $("#lianliankan_smallMap_img").attr("src", src);
                //            $("#lianliankan_smallMap_info").html("");

                if (time !== -1) {
                    window.setTimeout(function () {
                        $("#lianliankan_smallMap_img").attr("src", "");
                        $("#lianliankan_smallMap_img").hide();
                    }, time * 1000);
                }
                else {
                }
            }
        }
    }
});