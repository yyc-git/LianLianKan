//游戏主模块
var App = (function () {
    var wait = 0;
    var sM2 = true;   //声音是否出错的标志，true为没有出错

    //    var menu = null;

    //    var windows = [];

    //    var ui = null;

    //预加载图片
    var LoadImage = function () {
        var i, urls = [],
            temp_arr = [];

        //*加载图片

        //进度条
        //先加载进度条图片
        urls.push("progress/images/progressBar.png");
        urls.push("progress/images/progressBar_blue.png");


        //box
        for (i = 1; i <= LianLianKan.config.IMGAGECOUNT; i++) {
            urls.push("Image/box/img" + ("00" + i).slice(-3) + ".bmp");
        }

        //Ability
        temp_arr = ["Escape.gif", "Protect.gif", "RuneAttack.gif", "Thunder.gif", "Fast.gif", "Resume.gif", "StrengthAttack.gif", "FireDance.gif",
        "BeatBack.gif", "Crit.gif", "Kill.gif", "Rage.gif"];
        for (i = 0; i < temp_arr.length; i++) {
            urls.push("Image/Ability/" + temp_arr[i]);
        }

        //BossHead
        temp_arr = ["小矮人.jpg", "小矮人_gray.jpg", "花仙女.jpg", "花仙女_gray.jpg", "战神.jpg", "战神_gray.jpg"];
        for (i = 0; i < temp_arr.length; i++) {
            urls.push("Image/BossHead/" + temp_arr[i]);
        }

        //DOTA
        temp_arr = ["button1.png", "button2.png", "switch.png", "checkbox_off.png",
                "checkbox_on.png", "close.bmp", "menubg.gif", "menubg_h.gif", "radio_off.png", "radio_on.png", "win_title_bg.gif"];
        for (i = 0; i < temp_arr.length; i++) {
            urls.push("Image/Dota/" + temp_arr[i]);
        }

        //Map
        //        temp_arr = [];
        //        for (i = 0; i <= 18; i++) {
        //            urls.push("Image/Map/Map" + i + ".gif");
        //        }
        //        urls.push("Image/Map/null.gif");


        //Prop
        for (i = 0; i <= 9; i++) {
            urls.push("Image/Prop/bomb" + i + ".jpg");
            urls.push("Image/Prop/findPath" + i + ".jpg");
            urls.push("Image/Prop/mirror" + i + ".jpg");
            urls.push("Image/Prop/rearrangement" + i + ".jpg");
            urls.push("Image/Prop/roadBlock" + i + ".jpg");
            urls.push("Image/Prop/stop" + i + ".jpg");
        }

        //Other
        temp_arr = ["boom.gif", "bomb_boom.gif", "col.gif", "row.gif", "boxbg.gif", "Line.png", "LineTime.png",
        "lose.gif", "win.gif", "cursor.png"];

        for (i = 0; i < temp_arr.length; i++) {
            urls.push("Image/" + temp_arr[i]);
        }


        LianLianKan.ImgLoader = new YYC.PreLoadImg(urls, function (currentLoad, imgCount) {
            $("#progressBar_img_show").progressBar(parseInt(currentLoad * 100 / imgCount, 10));     //调用进度条插件
        }, function () {
            window.setTimeout(function () {
                LoadSound();
            }, 300);    //延迟300ms，用于chrome中，进度条显示出来（100%）后，再显示加载音效的进度
        });
    };

    //预加载音效
    var LoadSound = function () {
        var i = 0,
            len = 0,
            temp = null;

        $("#progressBar_sound").show();
        $("#imgLoadMsg").text("图片加载完成");

        //等待soundManager加载完成
        //最多等待1.5s
        if (!soundManagerIsLoad && wait < 50) {
            wait++;
            setTimeout(LoadSound, 30);
            return;
        }
        //                    console.log("soundManagerIsLoad = " + soundManagerIsLoad);
        //                window.progress2 = new DOTA.Progress('progressBar2');
        if (operate.Browser.ie && sM2) {
            if (LianLianKan.Sound) LianLianKan.Sound.dispose();
            //                    if (LianLianKan.BGSound) LianLianKan.BGSound.dispose();
            LianLianKan.Sound = null;
            //                    LianLianKan.BGSound = null;
        }

        //        console.log("LianLianKan.sM2 = " + LianLianKan.sM2);


        //*?初始化LianLianKan.MUSIC（加入boss音效）

        //        加入boss音效
        for (i = 0, len = SingleBoss.GetNum(); i < len; i++) {
            temp = SingleBoss.GetInstance(i);
            //加入技能音效
            temp.config.ability.each(function (ob) {
                if (ob.music && ob.music.length > 0) {
                    //重复项不加入
                    LianLianKan.config.MUSIC.pushNoRepeat(ob.music);
                }
            });
            if (temp.background_music && temp.background_music.length > 0) {
                //重复项不加入
                //加入boss背景音乐
                LianLianKan.config.MUSIC.pushNoRepeat(temp.background_music);
            }
        }
        //解决ie下会短暂播放最后一个声音的问题
        LianLianKan.config.MUSIC.push(["", ""]);



        if (sM2) {  //如soundManager加载出错就跳过
            LianLianKan.Sound = new YYC.SoundLoader(LianLianKan.config.MUSIC,
        			function (currentLoad, imgCount) {
        			    $("#progressBar_sound_show").progressBar(parseInt(currentLoad * 100 / imgCount, 10));    //调用进度条插件
        			}, function () {
        			    $("#soundLoadMsg").text("声音加载完成");
        			    $("#progressBar").hide();
        			    $("#game_body").show();
        			    //进入游戏
        			    Set();
        			});
            //                    LianLianKan.BGSound = new DOTA.SoundLoader({ sounds: LianLianKan.BGMusic, preLoad: false });
        } else {
            $("#soundLoadMsg").html("声音加载失败");
            $("#progressBar").hide();
            $("#game_body").show();
            //进入游戏
            Set();
        }

    };

    //    var onMenuClick = function () {
    //        //        var dlg = new YYC.Window({
    //        //            title: "标题",
    //        //            isShow: false,
    //        //            isClear: false,
    //        //            opacity: 0.4,
    //        //            id: "iframe_window"
    //        //        });
    //        //        dlg.SetTitle("用户信息设置");
    //        //        dlg.LoadUrl("Scripts/SelectMap.html");    //加载页面成功后，会触发页面的js
    //        //        dlg.ResizeTo(300, 200);

    //        //        dlg.AddToolBar({ menu: menu }) ;
    //    };




    //    var Wait = function () {

    //    }



    //初始化
    var Set = function () {
        var data = "",
            i = 0,
            arr_data = [];


        //获得第一个计时器序号，用于在ie下暴力清除所有的计时器
        LianLianKan.timer_firstIndex = window.setTimeout(function () { }, 100);


        //创建玩家类

        //此处玩家类都用单例模式。这样是为了能共享同一实例的数据。
        //        SingleGamePlayer.GetInstance(Game_Player);
        Data_Player.GetPlayer();


        //*创建全局实例

        //            LianLianKan.Game_Player = new Game_Player();


        LianLianKan.UI_CommonMap = new UI_CommonMap();

        LianLianKan.UI_SmallMap = new UI_SmallMap();






        //玩家操作类
        LianLianKan.Operate_Single = new Operate_Single(LianLianKan.UI_CommonMap);
        //Boss操作类
        //注入玩家类
        LianLianKan.Operate_Boss = new Operate_Boss(LianLianKan.UI_SmallMap, LianLianKan.UI_CommonMap, SingleGamePlayer.GetInstance(Game_Player));


        //当前操作类默认为玩家操作类
        LianLianKan.Operate = LianLianKan.Operate_Single;


        //创建UI_Info实例
        LianLianKan.UI_Info = new UI_Info();


        //界面操作类
        LianLianKan.Operate_UI = new Operate_UI(LianLianKan.Operate_Single, LianLianKan.Operate_Boss);


        //        LianLianKan.Operate_Single.SetOperate(LianLianKan.Operate_Boss);
        //        LianLianKan.Operate_Boss.SetOperate(LianLianKan.Operate_Single);


        //            LianLianKan.Algorithm = new Algorithm();


        //创建UI_Page实例
        LianLianKan.UI_Page = new UI_Page(LianLianKan.Operate_UI);



        //*初始化全局属性

        //**初始化状态
        LianLianKan.gameStatus = LianLianKan.Status.None;
        LianLianKan.pattern = LianLianKan.Pattern.None;
        //                LianLianKan.abilityStatus = LianLianKan.AbilityStatus.None;
        //        LianLianKan.propStatus = LianLianKan.PropStatus.None;
        //        LianLianKan.playerStatus = LianLianKan.PlayerStatus.None;
        //        LianLianKan.bossStatus = LianLianKan.BossStatus.None;


        //**初始化标志
        //玩家禁手标志
        LianLianKan.player_stop_flag = false;

        //玩家增加方块标志
        LianLianKan.player_addBlock_flag = false;

        //boss禁手标志
        LianLianKan.boss_stop_flag = false;

        //boss增加方块标志
        LianLianKan.boss_addBlock_flag = false;


        //持续时间大于0的增加玩家属性标志
        LianLianKan.player_addAttribute_flag = false;

        //持续时间大于0的减少玩家属性标志
        LianLianKan.player_substractAttribute_flag = false;

        //持续时间大于0的增加boss属性标志
        LianLianKan.boss_addAttribute_flag = false;

        //持续时间大于0的减少boss属性标志
        LianLianKan.boss_substractAttribute_flag = false;


        //初始化游戏难度
        LianLianKan.difficulity = LianLianKan.Difficulity.Normal;
        //        //绑定地图
        //        LianLianKan.Operate_Single.SetMap();
        //        LianLianKan.Operate_Boss.SetMap(LianLianKan.UI_SmallMap, );

        //        //初始化地图
        //        LianLianKan.Operate_Single.Init_Start();
        //        LianLianKan.Operate_Boss.Init_Start();

        //        //读取boss_index
        //        LianLianKan.boss_index = Number(Data_Player.GetBossIndex("player"));



        //*选择玩家
        LianLianKan.Operate_UI.SelectPlayer(SingleGamePlayer.GetInstance(Game_Player));

        //        //*用于测试
        //        LianLianKan.Operate_UI.SelectBoss(2);




        //*设置

        //        LianLianKan.UI_CommonMap.InitGameArea();
        //        //刷新剩余方块数
        //        LianLianKan.Operate_Single.GetPlayer().remain_num = LianLianKan.UI_CommonMap.InitMap();

        //        LianLianKan.UI_SmallMap.InitGameArea();
        //        //刷新剩余方块数
        //        LianLianKan.Operate_Boss.GetPlayer().remain_num = LianLianKan.UI_SmallMap.InitMap();




        //*初始化地图数据

        //地图数据加入自定义地图
        data = operate.GetCookie("YYC_LianLianKan1");
        i = 2;
        while (data !== "no") {
            common.AddCustomMap(data, false);
            data = operate.GetCookie("YYC_LianLianKan" + i.toString());
            i += 1;
        }

        //地图信息默认为随机
        $("#mapInfo_img").attr("src", "Image/Map/Map0.gif");
        $("#mapInfo_name").text("?");
        $("#mapInfo_author").text("?");
        $("#mapInfo_num").text("?");


        //*初始化页面

        LianLianKan.UI_Page.InitMenu();

        LianLianKan.UI_Page.InitButton();

        //设置小地图宽度、高度
        $("#lianliankan_smallMap").css({ "width": LianLianKan.config.COL * LianLianKan.config.SMALLWIDTH,
            "height": LianLianKan.config.ROW * LianLianKan.config.SMALLHEIGHT
        });

        //设置大地图宽度、高度
        $("#lianliankan_map").css({ "width": LianLianKan.config.COL * LianLianKan.config.BIGWIDTH,
            "height": LianLianKan.config.ROW * LianLianKan.config.BIGHEIGH
        });

        //道具图片
        $("#index_prop_findPath").attr("src", "Image/Prop/findPath0.jpg");
        $("#index_prop_rearrangement").attr("src", "Image/Prop/rearrangement0.jpg");
        $("#index_prop_bomb").attr("src", "Image/Prop/bomb0.jpg");
        $("#index_prop_stop").attr("src", "Image/Prop/stop0.jpg");
        $("#index_prop_roadBlock").attr("src", "Image/Prop/roadBlock0.jpg");
        $("#index_prop_mirror").attr("src", "Image/Prop/mirror0.jpg");

        //显示玩家信息
        LianLianKan.Operate_UI.ShowInfo_Player();






        //*应用观察者模式，订阅观察者

        //游戏设置的观察者对象
        //一对二
        subject.Subject_Setting_Name.Subscribe(LianLianKan.Operate_Single, LianLianKan.Operate_Single.SetName);
        subject.Subject_Setting_Name.Subscribe(LianLianKan.Operate_Boss, LianLianKan.Operate_Boss.SetName);

        //一对二
        subject.Subject_Setting_Config.Subscribe(LianLianKan.Operate_Single, LianLianKan.Operate_Single.SetByDifficulity);
        subject.Subject_Setting_Config.Subscribe(LianLianKan.Operate_Boss, LianLianKan.Operate_Boss.SetByDifficulity);






        //                Reset();

        //        LianLianKan.Operate_Single.Reset();

        //开始游戏
        //                LianLianKan.Operate_Single.Start();

        //        LianLianKan.Operate_Boss.Reset();

        //        LianLianKan.Operate_Boss.Start(); //Boss开始


        //不用这种形式，因为这样的话，在Mousedown函数内的this指针就指向触发该事件的td了，而不是指向类Operate_Single！
        //            $(LianLianKan.UI_CommonMap.Map.table).find("td").mousedown(LianLianKan.Operate_Single.Mousedown);



        //        //绑定事件
        //        $(LianLianKan.UI_CommonMap.Map.table).find("td").mousedown(function () {
        //            LianLianKan.Operate_Single.Mousedown($(this));
        //        });
        //        $(LianLianKan.UI_CommonMap.line).find("div.clue").mousedown(function () {
        //            console.log("clueLine click");
        //            //                common.HideDiv(LianLianKan.UI_CommonMap.line.children("div"));
        //            //                //置标志为1
        //            //                LianLianKan.Operate_Single.clueLine_click_flag = 1;

        //            var x = $(this).attr("x");
        //            var y = $(this).attr("y");

        //            //显示当前选中效果层
        //            LianLianKan.UI_CommonMap.select_div.css({ "left": x + "px", "top": y + "px" });

        //            //                console.log("x = " + x);
        //            //                console.log("y = " + y);
        //            //                    console.log($(LianLianKan.UI_CommonMap.Map.table).find("td[x=403][y=35]").length);
        //            //                console.log($(LianLianKan.UI_CommonMap.Map.table).find("td[x=" + Math.round(x / LianLianKan.config.BIGWIDTH).toString() + "][y=" + Math.round(y / LianLianKan.config.BIGHEIGHT).toString() + "]").length);
        //            //此处要保证x / LianLianKan.config.BIGWIDTH为整数！否则会触发多个td的mousedown事件
        //            $(LianLianKan.UI_CommonMap.Map.table).find("td[x=" + Math.round(x / LianLianKan.config.BIGWIDTH).toString() + "][y=" + Math.round(y / LianLianKan.config.BIGHEIGHT).toString() + "]").mousedown();
        //        });




        //                        $(".line").find("td").click(LianLianKan.Operate_Single.Mousedown);

    };

    var Dispose = function () {
        //        console.log("dispose");
        LianLianKan.ImgLoader && LianLianKan.ImgLoader.Dispose();
        LianLianKan.Sound && LianLianKan.Sound.Dispose();


        LianLianKan.Operate_Single && LianLianKan.Operate_Single.Dispose();
        LianLianKan.Operate_Boss && LianLianKan.Operate_Boss.Dispose();

        //?待补充

    };

    return {
        //        menu: menu,
        LoadImage: LoadImage,
        Set: Set,
        Dispose: Dispose,
        SetsM2: function (value) {
            sM2 = value;
        }
    };

} ());



