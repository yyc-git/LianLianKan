
//界面操作
var Abstract_Operate_UI = MyAbstract({
    Abstract: {
        //暂停
        Pause: function () {
        },
        //保存信息
        SaveInfo: function(){
        },
        //退出
        Exit: function () {
        },
//        //设置游戏难度
//        SetDifficulity: function(){
//        },


//        //提交游戏设置
//        GameSetting_Submit: function () {
        //        },

        //关闭游戏设置窗体
        CloseGameSetting: function () {
        },
        //关闭选择地图页面
        CloseSelectMap: function () {
        },
        //关闭自定义地图页面
        CloseMapEditor: function () {
        },
        //关闭挑战Boss页面
        CloseBoss: function () {
        },

        //重置玩家信息
        ResetPlayInfo: function () {
        },
        //开始单人游戏
        Start_Single: function () {
        },
                //开始挑战boss
        Start_Boss: function () {
                },
        //选择玩家
        SelectPlayer: function(){
        },
        //选择Boss
        SelectBoss: function () {
        },
        //获得mapIndex
        GetMapIndex: function () {
        },
        //设置mapIndex
        SetMapIndex: function () {
        },


        //显示玩家信息
        ShowInfo_Player: function(){
        },
        //显示Boss信息
        ShowInfo_Boss: function(){
        },
        //显示地图信息
        ShowMapInfo: function(){
        },
        //结束正在进行的游戏
        EndGame: function(){
        },
        //重置boss
        ResetBoss: function () {
        }
    }
});

var Operate_UI = MyClass(Abstract_Operate_UI, {
    Init: function (operate_single, operate_boss, menu) {
        this._operate_single = operate_single;
        this._operate_boss = operate_boss;

        //当前操作类默认为operate_single
        this._operate = operate_single;
        //        this._menu = menu;
    },
    Private: {
        _operate_single: null,
        _operate_boss: null,
        //当前操作类
        _operate: null,
        //        //菜单栏
        //        _menu: null,
        //暂停
        _Pause: function () {
            //            this._operate.Pause();
            var self = this;

            if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
                LianLianKan.gameStatus = LianLianKan.Status.Pause;
                //菜单栏显示为“继续”
                LianLianKan.UI_Page.menu.SetText([0, 1], "继续");
                LianLianKan.UI_Page.menu.SetHandle([0, 1], function () {
                    self._Continue();
                });
                //页面暂停
                LianLianKan.UI_Info.ShowInfo("暂停", -1);
                return false;
            }
        },
        //继续
        _Continue: function () {
            //            this._operate.Continue();
            var self = this;

            if (LianLianKan.gameStatus === LianLianKan.Status.Pause) {
                LianLianKan.gameStatus = LianLianKan.Status.Gaming;
                //菜单栏显示为“暂停”
                LianLianKan.UI_Page.menu.SetText([0, 1], "暂停");
                LianLianKan.UI_Page.menu.SetHandle([0, 1], function () {
                    self._Pause();
                });
                //页面恢复
                LianLianKan.UI_Info.ShowInfo("", -1);
                return false;
            }
        },
        _MapHide: function () {
        }
    },
    Public: {
        //暂停
        Pause: function (event) {
            //            //根据状态选择对应的handler
            //            if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
            this._Pause();
            //            }
            //            else if (LianLianKan.gameStatus === LianLianKan.Status.Pause) {
            //                this._Continue();
            //            }
        },
        //继续
        Continue: function (event) {
            this._Continue();
        },
        SaveInfo: function (event) {
            //            console.log(LianLianKan.playerName);
            try {
                //                                var t = document.cookie;

                //                                console.log(document.cookie);

                //                if (LianLianKan.pattern === LianLianKan.Pattern.Single) {
                //                    this._operate_single.SaveInfo();
                //                }
                //                else if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                //                    this._operate_boss.SaveInfo();
                //                }

                this._operate.SaveInfo();

                //                                console.log(document.cookie);
                //                var m = document.cookie;

                alert("保存成功");
            }
            catch (e) {
                alert("保存失败：" + e.message);
            }
        },
        //退出系统
        Exit: function (event) {
            if (confirm("您是否要保存游戏？")) {
                //                this.SaveInfo(null, this._operate_single, this._operate_boss);
                this.SaveInfo(null);
            }
            //调用Dispose()
            App.Dispose();
            //退出主界面
            $("body").html("");
        },
        //        SetName: function (name) {
        //            LianLianKan.playerName = name;
        //        },
        //        //设置游戏难度
        //        SetDifficulity: function (dif) {
        //            LianLianKan.difficulity = dif;
        //        },
        //结束正在进行的游戏
        EndGame: function () {
            //            if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
            //                if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
            //                    this._operate_boss.GameOver("win");
            //                }
            //                else {
            //                    this._operate_single.Reset();
            //                }
            //            }
            if (LianLianKan.gameStatus === LianLianKan.Status.Gaming || LianLianKan.gameStatus === LianLianKan.Status.Pause) {
                this._operate.EndGame();
            }
        },
        //        //提交游戏设置
        //        GameSetting_Submit: function (setting) {
        //            //            this._Pause(this._operate_single);

        //            ////            LianLianKan.UI_Page.


        //            //            this._Continue(this._operate_single);
        //        },


        //关闭游戏设置窗体
        CloseGameSetting: function () {
            LianLianKan.UI_Page.GetWindow().setting.Hide();
        },
        //关闭选择地图页面
        CloseSelectMap: function () {
            LianLianKan.UI_Page.GetWindow().selectMap.Dispose();
        },
        //关闭自定义地图页面
        CloseMapEditor: function () {
            LianLianKan.UI_Page.GetWindow().mapEditor.Dispose();
        },
        //关闭挑战Boss页面
        CloseBoss: function () {
            LianLianKan.UI_Page.GetWindow().boss.Dispose();
        },

        //重置玩家信息
        ResetPlayInfo: function () {
            if (confirm("确定要重置玩家信息吗？您的姓名、得分、等级、挑战boss情况将会被重置，但是您的自定义地图不会重置。如果您希望重置自定义地图，"
            + "请打开自定义地图页面，选择“地图”->“重置自定义地图”")) {
                Data_Player.SetName("player", "player");
                Data_Player.SetScore("player", 0);
                Data_Player.SetLevel("player", "");
                Data_Player.SetBossIndex("player", "");

                LianLianKan.boss_index = "";
                LianLianKan.score = 0;
                LianLianKan.playerName = "player";
                //                //刷新信息
                //                this._operate_single.SelectPlayer(this._operate_single.GetPlayer());
                //                //显示最新信息
                //                this._operate_single.ShowInfo();
                //刷新页面
                window.location.reload();
            }
        },
        //开始单人游戏
        Start_Single: function () {
            //            console.log(document.cookie);

            //            LianLianKan.Sound.RepeatPlay("start", 2);

            var self = this;

            if (LianLianKan.gameStatus !== LianLianKan.Status.None && LianLianKan.gameStatus !== LianLianKan.Status.Stop) {
                if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                    if (confirm("要先退出挑战才能进行单人游戏！确定退出挑战吗？（您会直接输掉比赛）")) {
                        //                    this._operate_boss.GameOver("win");
                        this.EndGame();
                        return;
                    }
                    else {
                        return;
                    }
                }
            }
            //绑定道具事件
            if (LianLianKan.pattern === LianLianKan.Pattern.Boss || LianLianKan.pattern === LianLianKan.Pattern.None) {     //模式切换
                this._operate.RemoveEvent_Prop();   //解除boss操作类的道具事件绑定
                this._operate_single.BindEvent_Prop();  //绑定玩家操作类的道具事件
            }
            //            else if (LianLianKan.pattern === LianLianKan.Pattern.None) {    //第一次开始游戏并且开始的是单人游戏
            //                this._operate.RemoveEvent_Prop();
            //                this._operate_single.BindEvent_Prop();  //绑定玩家操作类的道具事件
            //            }
            //            else {  //重复开始单人游戏，不再绑定
            //            }

            //重置boss操作类
            this._operate_boss.Reset();

            //设置模式为单人游戏
            LianLianKan.pattern = LianLianKan.Pattern.Single;
            //选择当前操作类
            this._operate = LianLianKan.Operate = this._operate_single;

            //隐藏boss地图和信息
            $("#boss_area").hide();

            //*重置菜单栏

            //重置暂停
            LianLianKan.UI_Page.menu.SetHandle([0, 1], function () {
                self.Pause();
            });

            //            //第一次启动时
            //            if (LianLianKan.gameStatus === LianLianKan.Status.None) {
            //                //初始化
            //                _operate.Init_Start();
            //            }

            //刷新玩家信息
            this._operate.ShowInfo();

            this._operate.Reset();
            this._operate.Start();

            //跳转到锚记
            window.location.href = "#game_area";
        },
        //开始挑战boss
        Start_Boss: function () {
            //            console.log(document.cookie);

            //            console.log(LianLianKan.score);

            //            console.log(this._propNum.prop_findPath);
            var self = this;

            if (LianLianKan.gameStatus !== LianLianKan.Status.None && LianLianKan.gameStatus !== LianLianKan.Status.Stop) {
                if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                    if (confirm("要先退出才能进行新的挑战！确定退出挑战吗？（您会直接输掉比赛）")) {
                        //                    this._operate_boss.GameOver("win");
                        this.EndGame();
                        return;
                    }
                    else {
                        return;
                    }
                }
            }

            //绑定道具事件
            if (LianLianKan.pattern === LianLianKan.Pattern.Single || LianLianKan.pattern === LianLianKan.Pattern.None) {
                this._operate.RemoveEvent_Prop();   //解除玩家操作类的道具事件绑定
                this._operate_boss.BindEvent_Prop();    //绑定boss操作类的道具事件
            }
            //            else if (LianLianKan.pattern === LianLianKan.Pattern.None) {    //第一次开始游戏并且开始的是挑战boss游戏
            //                this._operate.RemoveEvent_Prop();
            //                this._operate_boss.BindEvent_Prop();  //绑定boss操作类的道具事件
            //            }
            //            else {  //重复开始boss游戏，不再绑定
            //            }

            //重置玩家操作类
            this._operate_single.Reset();

            //设置模式为挑战boss
            LianLianKan.pattern = LianLianKan.Pattern.Boss;
            //选择当前操作类
            this._operate = LianLianKan.Operate = this._operate_boss;

            //显示boss地图和信息
            $("#boss_area").show();

            //*重置菜单栏

            //重置暂停
            LianLianKan.UI_Page.menu.SetHandle([0, 1], function () {
                self.Pause();
            });

            //            //第一次启动时
            //            if (LianLianKan.gameStatus === LianLianKan.Status.None) {
            //                //初始化
            //                _operate.Init_Start();
            //            }

            //刷新信息
            this._operate.ShowInfo();
            //            console.log(LianLianKan.score);
            this._operate.Reset();
            //            console.log(LianLianKan.score);
            //            var m = 0;

            this._operate.Start();

            //跳转到父窗口的锚记（#game_area）
            parent.location.hash = "game_area";
        },

        //显示玩家信息
        ShowInfo_Player: function () {
            this._operate_single.ShowInfo();
        },
        //显示Boss信息
        ShowInfo_Boss: function () {
            this._operate_boss.ShowInfo();
        },
        //显示地图信息
        ShowMapInfo: function () {
            this._operate.ShowMapInfo();
        },
        //选择玩家
        SelectPlayer: function (player) {
            this._operate_single.SelectPlayer(player);
        },
        //选择boss
        SelectBoss: function (index) {
            return this._operate_boss.SelectPlayer(index);
        },
        //获得mapIndex
        GetMapIndex: function () {
            return this._operate.GetMapIndex();
        },
        //设置mapIndex
        SetMapIndex: function (mapIndex) {
            this._operate_single.SetMapIndex(mapIndex);
            this._operate_boss.SetMapIndex(mapIndex);
        },



        //重置boss
        ResetBoss: function () {
            var i = 0,
                len = 0,
                name = "";

            if (confirm("确定要重置Boss信息吗？所有Boss的经验值和等级将会被重置。")) {
                len = SingleBoss.GetNum();

                //重置所有boss的经验值和等级
                for (i = 0; i < len; i++) {
                    name = SingleBoss.GetInstance(i).name;

                    Data_Boss.SetExperience(name, 0);
                    Data_Boss.SetLevel(name, 1);
                }
                //                //刷新信息
                //                this._operate_single.SelectPlayer(this._operate_single.GetPlayer());
                //                //显示最新信息
                //                this._operate_single.ShowInfo();

                //刷新页面
                window.location.reload();
            }
        }
    }
});
