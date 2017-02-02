//    /* 代理模式 */

/* 观察者模式 */



//单人操纵类
var Operate_Single = MyClass(Abstract_Operate_Game, {
    Init: function (map) {
        //        console.log("Operate_Single");

        //绑定地图
        this._SetMap(map);

        this._Init_Start();

        //        //显示信息
        //        this._ShowInfo();

        //                this._ai_operate = new Operate_Boss();

    },
    Private: {
        //地图对象
        _map: null,

        //游戏玩家对象
        _game_player: null,
        //玩家剩余方块数
        _remain_num: 0,
        //        //姓名
        //        _name: "",
        //        //得分
        //        _score: 0,
        //        //挑战boss的情况（挑战到第几个boss了）
        //        _boss_index: 0,
        //等级
        _level: "",
        //参数设置
        _config: {
            //玩家计时器速度
            time_speed: 1,
            //消去方块时，玩家计时器加的时间
            addTime: 10
        },
        //        //游戏信息
        //        _gameInfo: {
        //            timeLine: 0,
        //            time: 0
        //        },
        //已经选中的方块
        _selected: {},

        //上次消方块时间，用于判断是否为连击
        _last_time: null,
        //连击数
        _doubleHit: 0,
        //最高连击数
        _highestDoubleHit: 0,



        //        //Boss操作对象
        //        _ai_operate: null,
        //算法对象
        _algorithm: null,
        //计时器和时间
        _timer_timeLine: 0,
        _timer_time: 0,

        _time: 0,
        _timeLine: 0,

        //游戏难度

        //        //当前游戏难度（默认为正常）
        //        _difficulity: 2,
        //游戏开始时的游戏难度
        _difficulity_current: 2,

        //游戏难度对应的设置
        _configByDifficulity: {
            time_speed: 0,
            addTime: 0
        },

        //道具数量
        _propNum: {
            prop_findPath: 0,
            prop_rearrangement: 0,
            prop_bomb: 0,
            prop_stop: 0,
            prop_roadBlock: 0,
            prop_mirror: 0
        },
        //禁手时间计时器
        _timer_prop_stop: 0,
        //增加属性计时器
        _timer_addAttribute: 0,
        //减少属性计时器
        _timer_subtractAttribute: 0,


        //        //禁手标志
        //        _stop_flag: false,
        //        //重列标志
        //        _rearrangement_flag: false,

        _Init_Start: function () {
            //地图初始化
            this._map.InitGameArea();

            //            //道具绑定click事件
            //            this._OnClickProp = MyGameEngine.Event.BindEvent(this, function (event, args) {
            //                //开始游戏后才能使用道具
            //                if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
            //                    switch ($(event.target).attr("id")) {
            //                        case "index_prop_findPath":
            //                            if (this._propNum.prop_findPath > 0) {
            //                                //                                SingleProp.GetInstance(FindPath, this._algorithm, this._map).Do();
            //                                ////                                console.log(this._propNum.prop_findPath);
            //                                //                                if (this.P_subClass_flag) {
            //                                this._FindPath();
            //                                //                                }
            //                                //道具数减1
            //                                this._propNum.prop_findPath -= 1;
            //                            }
            //                            //                            console.log(this._propNum.prop_findPath);
            //                            break;
            //                        case "index_prop_rearrangement":
            //                            if (this._propNum.prop_rearrangement > 0) {
            //                                //                                SingleProp.GetInstance(Rearrangement, this._algorithm, this._map).Do();
            //                                //                                console.log(this._propNum.prop_rearrangement);
            //                                this._Rearrangement();
            //                                //道具数减1
            //                                this._propNum.prop_rearrangement -= 1;
            //                            }
            //                            //                            console.log(this._propNum.prop_rearrangement);
            //                            break;
            //                        case "index_prop_bomb":
            //                            if (this._propNum.prop_bomb > 0) {
            //                                //                                SingleProp.GetInstance(Bomb, this._algorithm, this._map).Do();
            //                                this._Bomb();
            //                                //道具数减1
            //                                this._propNum.prop_bomb -= 1;
            //                            }
            //                            break;
            //                        case "index_prop_stop":
            //                            if (this._propNum.prop_stop > 0) {
            //                                //                                SingleProp.GetInstance(FindPath, this._algorithm).Do();
            //                                //                                console.log(this._propNum.prop_findPath);
            //                                this._Stop(5);
            //                                //道具数减1
            //                                this._propNum.prop_stop -= 1;
            //                            } _Mirrot
            //                            //                            console.log(this._propNum.prop_findPath);
            //                            break;
            //                        case "index_prop_roadBlock":
            //                            if (this._propNum.prop_roadBlock > 0) {
            //                                //                                SingleProp.GetInstance(FindPath, this._algorithm).Do();
            //                                this._RoadBlock();
            //                                //                                console.log(this._propNum.prop_findPath);
            //                                //道具数减1
            //                                this._propNum.prop_roadBlock -= 1;
            //                            }
            //                            //                            console.log(this._propNum.prop_findPath);
            //                            break;
            //                        default:
            //                            throw new Error("道具超出范围");
            //                            break;
            //                    }
            //                }
            //            });
            //            MyGameEngine.Event.AddEvent($("ul.index_prop li"), "click", this._OnClickProp);
            //            //选择玩家
            //            this._SelectPlayer(player);
        },
        _OnClickProp: function () {
        },
        //依赖注入_map对象
        _SetMap: function (map) {
            this._map = map;

            this._algorithm = new Game_Algorithm(map);
        },
        _SelectPlayer: function (player) {

            /*目前不支持切换玩家

            //            //如果不是第一次选择玩家
            //            if (this._game_player) {
            //                //更新当前玩家类数据
            //                this._RefreshCurrentPlayer();
            //                //保存当前玩家数据
            //                this._SaveInfo();
            //            }
            */

            this._game_player = player;

            //设置玩家类的信息
            this._SetPlayer(this._game_player);

            //把player的属性拷贝到私有属性中
            this._Clone(this._game_player);

            //            //根据游戏难度设置属性
            //            this._SetByDifficulity(LianLianKan.difficulity, true);
        },
        _SetPlayer: function (player) {
            //调用数据层的玩家数据类的方法，获得玩家信息
            //此处传递的name固定为"player"。以后可以动态传递name，实现多玩家切换。
            player.score = Number(Data_Player.GetScore("player"));
            player.boss_index = Data_Player.GetBossIndex("player").toString();
            player.level = Data_Player.GetLevel("player").toString();
            player.name = Data_Player.GetName("player").toString();
        },
        //把player的属性拷贝到私有属性中
        _Clone: function (player) {
            LianLianKan.playerName = player.name;
            MyGameEngine.Base.Extend(this._config, player.config);
            //            //剩余方块数
            //            this.__remain_num = player._remain_num;
            LianLianKan.score = player.score;
            //            this._boss_index = player.boss_index;
            this._level = player.level;
            LianLianKan.boss_index = player.boss_index;
            //            this._SetByDifficulity(LianLianKan.difficulity, true);
            //            //最高连击数
            //            this._highestDoubleHit = player.hightestDoubleHit;
        },
        //        //更新当前的游戏玩家类数据（Player.js）（目前不支持切换玩家，故只有一个玩家类）
        _RefreshCurrentPlayer: function () {
            var player = this._game_player;

            player.name = LianLianKan.playerName;

            /* 参数不更新
            //MyGameEngine.Base.Extend(player.config, this._config);
            */

            //            //剩余方块数
            //            this.__remain_num = player._remain_num;
            player.score = LianLianKan.score;
            player.boss_index = LianLianKan.boss_index;
            player.level = this._level;
        },
        _SaveInfo: function () {
            Data_Player.SetScore("player", this._game_player.score);
            //            Data_Player.SetBossIndex("player", this._boss_index);
            Data_Player.SetBossIndex("player", this._game_player.boss_index);
            Data_Player.SetLevel("player", this._game_player.level);
            Data_Player.SetName("player", this._game_player.name);
        },
        _SetByDifficulity: function (dif, reset) {

            var old = MyGameEngine.Base.Extend({}, this._configByDifficulity),
                time_speed = 0,
                addTime = 0;

            //            switch (dif) {
            //                case LianLianKan.Difficulity.Easy:
            //                    this._configByDifficulity.time_speed = LianLianKan.config.easy.time_speed;
            //                    this._configByDifficulity.addTime = LianLianKan.config.easy.addTime;
            //                    break;
            //                case LianLianKan.Difficulity.Normal:
            //                    this._configByDifficulity.time_speed = LianLianKan.config.normal.time_speed;
            //                    this._configByDifficulity.addTime = LianLianKan.config.normal.addTime;
            //                    break;
            //                case LianLianKan.Difficulity.Hard:
            //                    this._configByDifficulity.time_speed = LianLianKan.config.hard.time_speed;
            //                    this._configByDifficulity.addTime = LianLianKan.config.hard.addTime;
            //                    break;
            //                default:
            //                    break;
            //            }

            switch (dif) {
                case LianLianKan.Difficulity.Easy:
                    this._configByDifficulity.time_speed = -4;
                    this._configByDifficulity.addTime = 4;
                    break;
                case LianLianKan.Difficulity.Normal:
                    this._configByDifficulity.time_speed = 0;
                    this._configByDifficulity.addTime = 0;
                    break;
                case LianLianKan.Difficulity.Hard:
                    this._configByDifficulity.time_speed = 4;
                    this._configByDifficulity.addTime = -4;
                    break;
                default:
                    break;
            }

            //改变属性
            if (reset) {
                time_speed = this._config.time_speed + this._configByDifficulity.time_speed;
                addTime = this._config.addTime + this._configByDifficulity.addTime;
            }
            else {
                time_speed = this._config.time_speed - old.time_speed + this._configByDifficulity.time_speed;
                addTime = this._config.addTime - old.addTime + this._configByDifficulity.addTime;
            }

            //最小为1

            this._config.time_speed = time_speed > 1 ? time_speed : 1;
            this._config.addTime = addTime > 1 ? addTime : 1;

            //            this._difficulity = dif;
            //            LianLianKan.difficulity = dif;
        },
        //显示已用时间，格式为"00:00"
        _ShowTime: function () {
            var time = "", minute = "", second = "";
            //                console.log(this);
            if (this._time < 60) {
                time = "00:" + ("0" + this._time.toString()).slice(-2);
            }
            else {
                minute = (parseInt(this._time / 60)).toString();
                second = ("0" + (this._time % 60).toString()).slice(-2);

                time = minute < 60 ? ("0" + minute).slice(-2) + ":" + second : "59:59";   //如果大于等于60分钟，显示为"59:59"
            }
            $("#info_time").text(time);
        },


        //已用时间自增
        _AddUseTime: function () {
            //                console.log(LianLianKan.gameStatus);
            this._time += 1;
            this._ShowTime();
        },
        _RemoveEvent: function () {
            var evt = MyGameEngine.Event;

            this._map.Map.table && evt.RemoveEvent($(this._map.Map.table).find("td"), "mousedown", this._OnMouseDown_Td);
            this._map.line && evt.RemoveEvent($(this._map.line).find("div.clue"), "mousedown", this._OnMouseDown_ClueLine);
        },
        //增加连击数
        _AddDoubleHit: function () {
            var now = (new Date()).getTime();
            //            //消去方块的时间间隔
            //            var interval = null;

            //            //如果为第一次消去方块，则记录消去的时间
            //            if (!this._last_time) {
            //                this._doubleHit = this._highestDoubleHit = 1;
            //            }
            //            else {
            //                interval = now - this._last_time;

            //                //如果间隔小于等于2s，则判断为连击
            //                if (interval <= 2000) {
            this._doubleHit += 1;

            //与最高连击数比较，若高于最高连击数，则更新最高连击数
            if (this._doubleHit > this._highestDoubleHit) {
                this._highestDoubleHit = this._doubleHit;
            }
            //                }
            //                else {
            //                    this._doubleHit = 1;
            //                }
            //            }
            //更新时间
            this._last_time = now;
        },
        //重置连击数
        _ResetDoubleHit: function () {
            var now = (new Date()).getTime();

            this._highestDoubleHit = this._doubleHit = 1;
            //更新时间
            this._last_time = now;
        },
        //更新信息
        _RefreshMapInfo: function () {
            //更新剩余方块数
            $("#remainNum").text(this._remain_num);
            //更新连击数
            $("#info_doubleHit").text(this._doubleHit);
            $("#info_highestDoubleHit").text(this._highestDoubleHit);
        },
        //单人游戏，游戏结束
        _GameOver: function (type) {
            //            var score = 0;
            //            var msg = $("#gameMsg"), score = 0;
            //            msg.style.display = "block";
            //                this.base(type);

            //            //反向，玩家赢即是电脑输。
            //            var ai_type = type === "win" ? "lose" : type;
            //            //            console.log("ai_type = " + ai_type);

            //            //发布OnEnd事件
            //            //            this._ai_operate.onEnd.PublishAll(ai_type);
            //            this._ai_operate.onEnd.PublishAll(null, ai_type);

            //            //清空
            //            this._ai_operate.onEnd.Dispose();

            //                this.__ai_player.OnEnd();

            //隐藏效果层
            //                common.HideDiv(this._map.clueLine.children("div"));
            common.HideDiv(this._map.line.children("div"));

            this._ClearTimer();


            //            //Boss停止  待修改
            //            this._ai_operate.ClearTimer();

            //移除事件绑定
            this._RemoveEvent();

            //            console.log("_GameOver");


            //?玩家得分计算，显示胜利/失败图片等，保存最高连击数、得分，计算level（_game_player）

            //计算得分
            this.P_currentScore += this.P_Result_Score(type);
            //            console.log("score = ", score);
            LianLianKan.score += this.P_currentScore;
            //            console.log("LianLianKan.score = ", LianLianKan.score);
            //计算等级
            this._level = this._Result_Level(LianLianKan.score);

            //显示数据
            //            if (!this.P_subClass_flag) {    //如果为单人游戏（子类没有调用），先显示得分

            //            if (LianLianKan.pattern === LianLianKan.Pattern.Single) {

            //            if (type === "lose") {
            //                this._Show_Data({ score: Math.abs(this.P_currentScore) }, "-");
            //            }
            //            else {
            //                this._Show_Data({ score: this.P_currentScore }, "+");
            //            }

            this._Show_Data({ score: this.P_currentScore });

            //            this._RefreshCurrentPlayer();

            //            }
            //            }
            //            alert("您获得了" + score + "分");





            //            LianLianKan.score += 100;



            //此处如果为子类调用，则this是指向子类的，所以要想调用父类（Operate_Single）的父类的成员，就要用this.baseClass.baseClass调用
            //父类的父类的原型。
            if (this.P_subClass_flag) {
                this.baseClass.baseClass.GameOver.apply(this, [type, { score: Math.abs(this.P_currentScore)}]);
            }
            else {
                this.baseClass.GameOver.apply(this, [type, { score: Math.abs(this.P_currentScore)}]);
            }


            //更新玩家类的数据
            this._RefreshCurrentPlayer();

            //            this._Clone(this._game_player);
            //            //根据游戏难度修正操作类属性
            //            this._SetByDifficulity(LianLianKan.difficulity, true);

            //            if (LianLianKan.pattern === LianLianKan.Pattern.Single) {    //如果为单人游戏
            //刷新玩家信息
            this._ShowInfo();
            //            }


            //            userInfo.addScore(score);
            //            DOTA.$("score").innerHTML = (score > 0 ? "+" : "") + score + "分";
            //            self.showUserInfo();
            //            self.playSound("end");
        },
        _InitCenter: function (obj, target, width, height) {
            //            var left = 0,
            //            top = 0,
            //            width = 0,
            //            height = 0;

            //            width = $("#lianliankan_map").width();
            //            height = $("#lianliankan_map").height();

            //            //设置gameMsg的位置
            //            left = $("#lianliankan_map").offset().left + width / 2 - 100 / 2;
            //            top = $("#lianliankan_map").offset().top + height / 2 - 50 / 2;

            //            $("#gameMsg").css({ "top": top, "left": left });


            operate.PositionCenter(obj, target, width, height);

            operate.PositionCenter($("#index_showScore"), target, width, 35);

            //            LianLianKan.UI_Info.ShowInfo("aaa", -1);
        },
        //清除计时器
        _ClearTimer: function () {
            //                console.log("clear!");
            //            window.clearInterval(this._timer_timeLine);
            //            window.clearInterval(this._timer_time);
            //            if (this._timer_timeLine) {
            //                console.log("this._timer_timeLine = " + this._timer_timeLine);
            //            }

            this.P_ClearInterval(this._timer_timeLine);
            this.P_ClearInterval(this._timer_time);

            this.P_ClearTimeout(this._timer_addAttribute);
            this.P_ClearTimeout(this._timer_subtractAttribute);
            this.P_ClearTimeout(this._timer_prop_stop);

            //            window.clearTimeout(this._timer_addAttribute);
            //            window.clearTimeout(this._timer_subtractAttribute);

            //            window.clearTimeout(this._timer_prop_stop);

            //            this._timer_timeLine = 0;
            //            this._timer_time = 0;
            //            this._timer_addAttribute = 0;
            //            this._timer_subtractAttribute = 0;

            //            this._timer_prop_stop = 0;
        },
        //        //点击方块
        //        _Mousedown: function (_this) {
        //          
        //        },
        _MouseDown_Td: function (event) {
            //                        console.log(event.target, event.target.tagName);
            //            if (event.target.tagName == "TD") {

            //停止冒泡
            event.stopBubble();

            //此处直接调用公有方法Mousedown，而不是使用纯虚原则先写成私有方法，再调用私有方法_Mousedown。
            //因为我希望它能够调用子类的同名Mousedown方法。
            this.Mousedown($(event.target).closest("td"));

            return false;
            //            }

            //                this._Mousedown(arguments[0]);
        },
        _MouseDown_ClueLine: function (event) {
            //event.target并不是div.clue，而是发生事件的元素：
            //“<img onmousedown="operate.PreventDefault();" src="Image/boom.gif"> ”
            var div = $(event.target).closest("div.clue");

            var t = event.target;

            if ($(event.target).attr("src") && $(event.target).attr("src").contain("boom")) {
                return false;
            }

            //            console.log(event.target, event.target.tagName);
            //            console.log("_MouseDown_ClueLine");
            //                common.HideDiv(this._map.line.children("div"));
            //                //置标志为1
            //                LianLianKan.Operate_Single.clueLine_click_flag = 1;

            var x = div.attr("x");
            var y = div.attr("y");

            //            console.log(x, y);

            //停止冒泡
            event.stopBubble();

            //显示当前选中效果层
            this._map.select_div.css({ "left": x + "px", "top": y + "px" });

            //                console.log("x = " + x);
            //                console.log("y = " + y);
            //                    console.log($(this._map.Map.table).find("td[x=403][y=35]").length);
            //                console.log($(this._map.Map.table).find("td[x=" + Math.round(x / LianLianKan.config.BIGWIDTH).toString() + "][y=" + Math.round(y / LianLianKan.config.BIGHEIGHT).toString() + "]").length);
            //此处要保证x / LianLianKan.config.BIGWIDTH为整数！否则会触发多个td的mousedown事件
            //            $(this._map.Map.table).find("td[x=" + Math.round(x / LianLianKan.config.BIGWIDTH).toString() + "][y=" + Math.round(y / LianLianKan.config.BIGHEIGHT).toString() + "]")[0].fireEvent("onmousedown");

            //            var fireOnThis = $(this._map.Map.table).find("td[x=" + Math.round(x / LianLianKan.config.BIGWIDTH).toString() + "][y=" + Math.round(y / LianLianKan.config.BIGHEIGHT).toString() + "]")[0];
            ////            var evObj = document.createEvent('MouseEvents');
            ////            evObj.initMouseEvent('mousedown', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null);
            ////            fireOnThis.dispatchEvent(evObj);

            //            fireOnThis.fireEvent('onmousedown');
            MyGameEngine.Event.TriggerEvent($(this._map.Map.table).find("td[x=" + Math.round(x / LianLianKan.config.BIGWIDTH).toString() + "][y=" + Math.round(y / LianLianKan.config.BIGHEIGHT).toString() + "]"), "mousedown");


            return false;
        },
        _OnMouseDown_Td: function () {
        },
        _OnMouseDown_ClueLine: function () {
        },
        //初始化地图
        _InitMap: function (index) {
            var mapIndex = 0;

            //挑战boss
            if (index !== undefined) {
                mapIndex = index;
            }
            else {
                //单人游戏

                //随机地图
                if (this._map.Map.mapIndex == -1) {
                    //生成随机地图序号
                    mapIndex = MyGameEngine.Random._NToM(0, DataSource_MapData.length - 1);
                }
                else {
                    mapIndex = this._map.Map.mapIndex;
                }
            }

            //刷新剩余方块数
            this._remain_num = this._map.InitMap(mapIndex);

            //如果是随机地图，则显示地图信息
            if (this._map.Map.mapIndex === -1) {
                this._ShowMapInfo(mapIndex);
            }

            //更新信息
            this._RefreshMapInfo();
        },
        //绑定mousedown事件
        _InitMapEvent: function () {
            this._OnMouseDown_Td = MyGameEngine.Event.BindEvent(this, this._MouseDown_Td);
            this._OnMouseDown_ClueLine = MyGameEngine.Event.BindEvent(this, this._MouseDown_ClueLine);

            //            var self = this;

            //            $(this._map.Map.table).find("td").mousedown(function (e) {
            //                self._OnMouseDown_Td(e);
            //            });

            MyGameEngine.Event.AddEvent($(this._map.Map.table).find("td"), "mousedown", this._OnMouseDown_Td);
            MyGameEngine.Event.AddEvent($(this._map.line).find("div.clue"), "mousedown", this._OnMouseDown_ClueLine);
        },
        _ShowInfo: function () {
            //            $("#player_name").text(LianLianKan.playerName);
            //            $("#player_score").text(LianLianKan.score);
            //            $("#player_level").text(this._level);
            //            //            $("#player_boss_index").text(this._boss_index);
            //            //                        console.log(LianLianKan.boss_index);

            //            //LianLianKan.boss_index的值如：",1,2"
            //            //如果LianLianKan.boss_index为空字符串""，则LianLianKan.boss_index.split(",").length为1
            //            $("#player_boss_index").text(LianLianKan.boss_index.split(",").length - 1);


            var level = "";
            //获得对应的等级
            level = this._Result_Level(this._game_player.score);

            $("#player_name").text(this._game_player.name);
            $("#player_score").text(this._game_player.score);
            $("#player_level").text(level);
            //            $("#player_boss_index").text(this._boss_index);
            //                        console.log(LianLianKan.boss_index);

            //LianLianKan.boss_index的值如：",1,2"
            //如果LianLianKan.boss_index为空字符串""，则LianLianKan.boss_index.split(",").length为1
            $("#player_boss_index").text(this._game_player.boss_index.split(",").length - 1);

        },
        _Result_Level: function (score) {
            if (score < 0) {
                return "菜鸟";
            }
            else if (score < 1000) {
                return "新手";
            }
            else if (score < 3000) {
                return "大杀特杀";
            }
            else if (score < 8000) {
                return "主宰比赛";
            }
            else if (score < 20000) {
                return "妖怪般的杀戮";
            }
            else {
                return "Hole Shit";
            }
            //            var i = 0,
            //                        len = 0;
            //            //                        level = "";


            //            for (i = 0, len = LianLianKan.config.score_level.length; i < len; i++) {
            //                //最后一个称号
            //                if (i === len - 1) {
            //                    return LianLianKan.config.score_level[i];
            //                }
            //                else if (score < LianLianKan.config.score_level[i][0]) {
            //                    return LianLianKan.config.score_level[i][1];
            //                }
            //            }
        },
        //游戏结束，显示数据
        _Show_Data: function (result) {
            var str = "";

            if (result.score >= 0) {
                //                if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                //                    str = "<ul><li>挑战成功！</li></ul>";
                //                }
                str += MyGameEngine.Base.FormatDelegate("<p><h2>玩家统计</h2><ul><li>{0}获得{1}分</li></ul></p>", LianLianKan.playerName, result.score);
                //                LianLianKan.UI_Info.ShowInfo("+" + result.score + "分", -1);
            }
            else {
                //                if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                //                    str = "<ul><li>挑战失败！</li></ul>";
                //                }
                str += MyGameEngine.Base.FormatDelegate("<p><h2>玩家统计</h2><ul><li>{0}失去{1}分</li></ul></p>", LianLianKan.playerName, Math.abs(result.score));
                //                LianLianKan.UI_Info.ShowInfo("-" + result.score + "分", -1);
            }
            //            console.log(str);
            if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                LianLianKan.UI_Info.ShowRightInfo($(str), -1);
            }
            else {
                LianLianKan.UI_Info.ShowRightInfo($(str), -1, false);
            }

            //            alert("经验值为" + this.__experience);
            //            alert("等级为" + this.__level);
        },
        //显示地图信息
        _ShowMapInfo: function (mapIndex) {
            var map = null,
                index = 0;
            //                console.log(mapIndex, mapIndex === undefined, this._map.Map.mapIndex);
            index = mapIndex === undefined ? this._map.Map.mapIndex : mapIndex;

            //                console.log(index);

            //随机地图信息
            if (index === -1) {
                $("#mapInfo_img").attr("src", "Image/Map/Map0.gif");
                $("#mapInfo_name").text("?");
                $("#mapInfo_author").text("?");
                $("#mapInfo_num").text("?");
            }
            else {
                map = DataSource_MapData[index];

                //自定义地图
                if (map.index === -1) {
                    $("#mapInfo_img").attr("src", "Image/Map/null.gif");
                }
                else {
                    $("#mapInfo_img").attr("src", "Image/Map/Map" + (index + 1).toString() + ".gif");  //序号要加1，Map0为随机地图
                }
                $("#mapInfo_name").text(map.name);
                $("#mapInfo_author").text(map.author);
                $("#mapInfo_num").text(map.num);
            }
        },
        //判断增加道具
        _AddPropByDoubleHit: function () {
            switch (this._doubleHit) {
                case 4:
                    this.P_AddProp("findPath", 1);
                    this.P_AddProp("rearrangement", 1);
                    this.P_AddProp("bomb", 1);
                    LianLianKan.UI_Info.ShowRightInfo("指南针、重列、炸弹道具加1！继续连击可获得更多的道具", -1);
                    break;
                case 6:
                    //                    this.P_AddProp("findPath", 1);
                    //                    this.P_AddProp("rearrangement", 1);
                    //                    this.P_AddProp("bomb", 1);
                    this.P_AddProp("stop", 1);
                    this.P_AddProp("roadBlock", 1);
                    this.P_AddProp("mirror", 1);
                    LianLianKan.UI_Info.ShowRightInfo("禁手、路障、镜子道具加1！继续连击可获得更多的道具", -1);
                    break;
                case 10:
                    this.P_AddProp("findPath", 1);
                    this.P_AddProp("rearrangement", 1);
                    this.P_AddProp("bomb", 1);
                    this.P_AddProp("stop", 1);
                    this.P_AddProp("roadBlock", 1);
                    this.P_AddProp("mirror", 1);
                    LianLianKan.UI_Info.ShowRightInfo("所有道具加1！继续连击可获得更多的道具", -1);
                    break;
                case 15:
                    this.P_AddProp("findPath", 1);
                    this.P_AddProp("rearrangement", 1);
                    this.P_AddProp("bomb", 1);
                    this.P_AddProp("stop", 1);
                    this.P_AddProp("roadBlock", 1);
                    this.P_AddProp("mirror", 1);
                    LianLianKan.UI_Info.ShowRightInfo("所有道具加1！继续连击可获得更多的道具", -1);
                    break;
                case 20:
                    this.P_AddProp("findPath", 1);
                    this.P_AddProp("rearrangement", 1);
                    this.P_AddProp("bomb", 1);
                    this.P_AddProp("stop", 1);
                    this.P_AddProp("roadBlock", 1);
                    this.P_AddProp("mirror", 1);
                    LianLianKan.UI_Info.ShowRightInfo("所有道具加1！继续连击可获得更多的道具", -1);
                    break;
                default:
                    break;
            }

            //            console.log(this._doubleHit);

            //            var i = 0,
            //                len = 0,
            //                temp = null;

            //            //读取配置
            //            for (i = 0, len = LianLianKan.config.addPropByDoubleHit.length; i < len; i++) {
            //                if (this._doubleHit === LianLianKan.config.addPropByDoubleHit[i][0]) {
            //                    if (LianLianKan.config.addPropByDoubleHit[i][2] === "all") {
            //                        temp = LianLianKan.config.addPropByDoubleHit[i][1];
            //                        this.P_AddProp("findPath", temp);
            //                        this.P_AddProp("rearrangement", temp);
            //                        this.P_AddProp("bomb", temp);
            //                        this.P_AddProp("stop", temp);
            //                        this.P_AddProp("roadBlock", temp);
            //                        this.P_AddProp("mirror", temp);
            //                        LianLianKan.UI_Info.ShowRightInfo("所有道具加" + temp.toString() + "！继续连击可获得更多的道具", -1);
            //                        break;
            //                    }
            //                    else if (LianLianKan.config.addPropByDoubleHit[i][2] === "player") {
            //                        temp = LianLianKan.config.addPropByDoubleHit[i][1];
            //                        this.P_AddProp("findPath", temp);
            //                        this.P_AddProp("rearrangement", temp);
            //                        this.P_AddProp("bomb", temp);
            //                        LianLianKan.UI_Info.ShowRightInfo("指南针、重列、炸弹道具加" + temp.toString() + "！继续连击可获得更多的道具", -1);
            //                        break;
            //                    }
            //                    else if (LianLianKan.config.addPropByDoubleHit[i][2] === "boss") {
            //                        temp = LianLianKan.config.addPropByDoubleHit[i][1];
            //                        this.P_AddProp("stop", temp);
            //                        this.P_AddProp("roadBlock", temp);
            //                        this.P_AddProp("mirror", temp);
            //                        LianLianKan.UI_Info.ShowRightInfo("禁手、路障、镜子道具加" + temp.toString() + "！继续连击可获得更多的道具", -1);
            //                        break;
            //                    }
            //                }
            //            }
            //            return;
        },
        //初始化道具
        _InitProp: function () {

            //单人游戏，设置道具数量
            if (LianLianKan.pattern === LianLianKan.Pattern.Single) {
                this._EditPropNum();
            }

            //加入对应数量的道具图片

            $("#index_prop_findPath").attr("src", "Image/Prop/findPath" + this._propNum.prop_findPath.toString() + ".jpg");
            $("#index_prop_rearrangement").attr("src", "Image/Prop/rearrangement" + this._propNum.prop_rearrangement.toString() + ".jpg");
            $("#index_prop_bomb").attr("src", "Image/Prop/bomb" + this._propNum.prop_bomb.toString() + ".jpg");
            $("#index_prop_stop").attr("src", "Image/Prop/stop" + this._propNum.prop_stop.toString() + ".jpg");
            $("#index_prop_roadBlock").attr("src", "Image/Prop/roadBlock" + this._propNum.prop_roadBlock.toString() + ".jpg");
            $("#index_prop_mirror").attr("src", "Image/Prop/mirror" + this._propNum.prop_mirror.toString() + ".jpg");
        },
        //单人游戏设置道具数量
        _EditPropNum: function () {
            this._propNum.prop_findPath = this._game_player.prop_findPath;
            this._propNum.prop_rearrangement = this._game_player.prop_rearrangement;
            this._propNum.prop_bomb = this._game_player.prop_bomb;
            this._propNum.prop_roadBlock = this._game_player.prop_roadBlock;
            this._propNum.prop_stop = this._game_player.prop_stop;
            this._propNum.prop_mirror = this._game_player.prop_mirror;
        },
        //移除道具事件
        _RemoveEvent_Prop: function () {
            //移除事件
            MyGameEngine.Event.RemoveEvent($("ul.index_prop li"), "click", this._OnClickProp);
        },

        //*道具/技能对玩家的影响

        //增加方块num_pair对
        _Single_AddBlock: function (num_pair) {
            var already_add = 0;
            var temp = 0, i = 0, j = 0, len = 0, double = 0;
            var M = this._map.Map.map;
            var imgs = [];
            var num = num_pair * 2;
            //            if (num % 2 !== 0) {
            //                throw new Error("num要为偶数！");
            //            }

            //如果空格数小于num，则不能增加
            if ((this._remain_num + num) > this._map.Map.col * this._map.Map.row) {
                //                console.log("空格数小于" + num.toString() + "，不能增加了！");
                LianLianKan.UI_Info.ShowRightInfo("空格数小于" + num.toString() + "，不能增加了！", -1);
                return;
            }

            //置标志位
            this.player_addBlock_flag = true;

            //生成增加的方块序号数组
            for (i = 0, len = num_pair; i < num; i += 2) {
                temp = operate.Random._NToM(1, LianLianKan.config.IMGAGECOUNT);     //序号是从1开始的！

                imgs[i] = temp;
                imgs[i + 1] = temp;
            }

            //打乱数组（num次）
            for (i = 0; i < num; i++) {
                j = parseInt(Math.random() * num);
                temp = imgs[i];
                imgs[i] = imgs[j];
                imgs[j] = temp;
            }


            temp = 0;

            while (temp < num) {
                //在随机位置处增加方块
                i = operate.Random._NToM(0, this._map.Map.row - 1);
                j = operate.Random._NToM(0, this._map.Map.col - 1);

                if (M[i][j].img === 0) {

                    M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp' width=" + LianLianKan.config.BIGWIDTH.toString()
                    + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px onmousedown='operate.PreventDefault();'/>");
                    M[i][j].img = imgs[temp];

                    //                            double = double === 0 ? 1 : 0;  //是否

                    //                            already_add += 1;

                    //                            if (already_add == num) {
                    //                                break outer;
                    //                            }

                    temp += 1;
                }
            }

            //                for (i = 0; i < this._map.Map.row; i++) {
            //                    for (j = 0; j < this._map.Map.col; j++) {
            //                        if (M[i][j].img === 0) {
            //                            M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp'/>");
            //                            M[i][j].img = temp;

            //                            //                            double = double === 0 ? 1 : 0;  //是否

            //                            //                            already_add += 1;

            //                            //                            if (already_add == num) {
            //                            //                                break outer;
            //                            //                            }

            //                            temp += 1;


            //                        }



            //                        //                        if (double === 0) {
            //                        //                            temp = operate.Random._NToM(0, LianLianKan.IMGAGECOUNT);
            //                        //                        }
            //                    }
            //                }

            //剩余方块数增加already_add（实际增加的方块数）
            this._remain_num += num;

            this._RefreshMapInfo();
        },
        //消去方块num_pair对（消去相同的方块，不判断是否可连接）
        _Single_Elimination: function (num_pair) {
            if (this._remain_num > 0) {
                while (num_pair > 0) {
                    //                //如果重列，则要重新寻路
                    //                if (this._rearrangement_flag) {
                    //                    this._algorithm.clue_block_arr = [];
                    //                    this._rearrangement_flag = false;   //还原标志
                    //                }
                    //                this._algorithm.FindPath();

                    //找到相同的一对方块
                    this._algorithm.FindBlock();
                    //                this._algorithm.ShowLine(this._algorithm.clue_block_arr[0], this._algorithm.clue_block_arr[1]);
                    //显示爆炸
                    this._algorithm.ShowBoom(this._algorithm.common_block_arr[0], this._algorithm.common_block_arr[1]);
                    this._algorithm.Elimination(this._algorithm.common_block_arr[0], this._algorithm.common_block_arr[1]);

                    //刷新剩余方块数
                    this._remain_num -= 2;

                    //                //隐藏当前选中效果层
                    //                common.HideDiv(this._map.select_div);

                    //计时器加时间
                    if (this._config.addTime > 0) {
                        this._timeLine -= this._config.addTime;
                    }

                    //                //判断是否为连击
                    //                if (this.JudgeDoubleHit()) {
                    //                    this._AddDoubleHit();
                    //                }

                    //更新信息
                    this._RefreshMapInfo();

                    //                //*发布所有事件

                    //判断是否胜利
                    if (this._remain_num === 0) {
                        //P_subClass_flag在子类中重写，表示子类是否调用该方法。
                        //如果P_subClass_flag为true，表示子类调用该方法（Mousedown），选择要调用的子类成员。
                        //子类调用此Mousedown时，此处调用的GameOver为子类的同名方法；
                        //父类调用此Mousedown时，此处调用的GameOver为父类的GameOver。
                        if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                            this.GameOver("lose");
                        }
                        else {
                            this.GameOver("win");
                        }
                        return;
                    }
                    //                //判断是否无解并提示。
                    //                //消去一对方块后判断。
                    //                if (num_pair === 1) {
                    //                    if (this._algorithm.IsNoPath(this._remain_num)) {
                    //                        LianLianKan.UI_Info.ShowInfo("无解！请使用重列或者炸弹道具");
                    //                        return;
                    //                    }
                    //                }
                    //                else {  //消去多对方块（>1）的话，要循环判断，直到找到路径
                    //                    while (this._algorithm.IsNoPath(this._remain_num)) {
                    //                        //                        LianLianKan.UI_Info.ShowRightInfo("使用重列道具");
                    //                        this._Single_Rearrangement();
                    //                    }
                    //                }

                    num_pair -= 1;
                }
            }
            return false;
        },
        //加属性。
        //time秒后还原，如果time为-1，则不还原。
        //time单位为秒。
        _Single_AddAttribute: function (attribute) {
            var name = "",
                property = "",
                temp = [],
                    temp_name = "",
                i = 0,
                len = 0,
                self = this;
            //                args = _args ? _args : [];  //此处args不能为undefined或null。因为apply的第二个参数如果为undefined或null，ie下会报错！

            //            //置标志位
            //            LianLianKan.player_addAttribute_flag = true;

            for (name in attribute) {
                if (attribute.hasOwnProperty(name)) {
                    temp_name = "_" + name;

                    if (operate.IsNotObject(attribute[name])) {
                        //                        //增加新属性用来备份原始值，如果备份存在，则不修改备份，防止原始值被修改。
                        //                        if (!this[temp_name + "_copy_add"]) {
                        //                            this[temp_name + "_copy_add"] = this[temp_name];
                        //                        }
                        //                        temp.push([temp_name, this[temp_name + "_copy_add"]]);    //保存属性名和原始值，用于还原

                        this[temp_name] += attribute[name]; //加上
                    }
                    else {
                        //                        //增加新属性用来备份原始值，如果备份存在，则不修改备份，防止原始值被修改。
                        //                        if (!this[temp_name + "_copy_add"]) {
                        //                            this[temp_name + "_copy_add"] = MyGameEngine.Base.Extend({}, this[temp_name]);
                        //                        }
                        //                        temp.push([temp_name, this[temp_name + "_copy_add"]]);    //保存属性名和原始值，用于还原
                        //                        temp.push([temp_name, MyGameEngine.Base.Extend({}, this[temp_name])]);

                        //                        MyGameEngine.Base.Extend(this[temp_name], attribute[name]);
                        for (property in attribute[name]) {
                            //attribute[name][property]类型为number
                            this[temp_name][property] += attribute[name][property]; //加上
                        }
                    }
                }
            }
            //            //不还原属性
            //            if (time === -1) {
            //                //                console.log("temp =", temp);
            //                return;
            //            }
            //            else {  //到时间后，还原属性
            //                //                                console.log("temp =", temp);
            //                //                (function (temp, func, self) {
            //                this._timer_addAttribute = window.setTimeout(function () {
            //                    for (i = 0, len = temp.length; i < len; i++) {
            //                        //                                                console.log("temp[i][0] =", temp[i][0], "config =", self._config, "temp =", temp[i][1]);
            //                        self[temp[i][0]] = temp[i][1];
            //                        //置备份为空
            //                        self[temp[i][0] + "_copy_add"] = null;

            //                        //复位标志
            //                        LianLianKan.player_addAttribute_flag = false;
            //                        //                        console.log(func, self);

            //                        //调用委托
            //                        if (func) {
            //                            func.call(self, undefined);
            //                        }
            //                        //                        console.log(this._config, temp);
            //                        //                        console.log(self._config, self[temp[i][0]]);
            //                    }
            //                }, time * 1000);
            //                //                                        } (temp, func, self));
            //            }
        },
        //减属性
        //time秒后还原，如果time为-1，则不还原。
        //time单位为秒。
        _Single_SubtractAttribute: function (attribute) {
            var name = "",
                property = "",
                temp = [],
                    temp_name = "",
                i = 0,
                len = 0,
                self = this;
            //                args = _args ? _args : [];  //此处args不能为undefined或null。因为apply的第二个参数如果为undefined或null，ie下会报错！

//            //置标志位
//            LianLianKan.player_substractAttribute_flag = true;

            for (name in attribute) {
                if (attribute.hasOwnProperty(name)) {
                    temp_name = "_" + name;

                    if (operate.IsNotObject(attribute[name])) {
//                        //增加新属性用来备份原始值，如果备份存在，则不修改备份，防止原始值被修改。
//                        if (!this[temp_name + "_copy_subtract"]) {
//                            this[temp_name + "_copy_subtract"] = this[temp_name];
//                        }
//                        temp.push([temp_name, this[temp_name + "_copy_subtract"]]);    //保存属性名和原始值，用于还原

                        //要大于0
                        this[temp_name] = this[temp_name] > attribute[name] ? this[temp_name] - attribute[name] : this[temp_name];
                        //                        this[temp_name] -= attribute[name]; //加上
                    }
                    else {
//                        //增加新属性用来备份原始值，如果备份存在，则不修改备份，防止原始值被修改。
//                        if (!this[temp_name + "_copy_subtract"]) {
//                            this[temp_name + "_copy_subtract"] = MyGameEngine.Base.Extend({}, this[temp_name]);
//                        }
//                        temp.push([temp_name, this[temp_name + "_copy_subtract"]]);    //保存属性名和原始值，用于还原
                        //                        temp.push([temp_name, MyGameEngine.Base.Extend({}, this[temp_name])]);

                        //                        MyGameEngine.Base.Extend(this[temp_name], attribute[name]);
                        for (property in attribute[name]) {
                            //attribute[name][property]类型为number
                            this[temp_name][property] = this[temp_name][property] > attribute[name][property] ? this[temp_name][property] - attribute[name][property] : this[temp_name][property];
                        }
                    }
                }
            }
//            //不还原属性
//            if (time === -1) {
//                return;
//            }
//            else {  //到时间后，还原属性
//                //                                console.log("temp =", temp);
//                //                  (function (temp) {
//                this._timer_subtractAttribute = window.setTimeout(function () {
//                    for (i = 0, len = temp.length; i < len; i++) {
//                        //                                                console.log("temp[i][0] =", temp[i][0], "config =", self._config, "temp =", temp[i][1]);
//                        self[temp[i][0]] = temp[i][1];
//                        //置备份为空
//                        self[temp[i][0] + "_copy_subtract"] = null;

//                        //复位标志
//                        LianLianKan.player_substractAttribute_flag = false;

//                        //调用委托
//                        if (func) {
//                            func.call(self, undefined);
//                        }
//                        //                        console.log(this._config, temp);
//                        //                        console.log(self._config, self[temp[i][0]]);
//                    }
//                }, time * 1000);
//                //            } (temp));
//            }
        },
        //禁手
        _Single_Stop: function (time) {
            var second = time ? time : 5,   //默认为5秒
                self = this;

            //重复使用禁手道具，会刷新禁手时间
            if (this._timer_prop_stop) {
                this.P_ClearTimeout(this._timer_prop_stop);
                //                window.clearTimeout(this._timer_prop_stop);
                //                this._timer_prop_stop = 0;
            }

            //禁手状态
            //            LianLianKan.PlayerStatus = LianLianKan.PlayerStatus.Stop;
            LianLianKan.player_stop_flag = true;
            //            this._stop_flag = true;

//            LianLianKan.UI_Info.ShowRightInfo("玩家被禁手" + second + "秒", -1);

            this._RemoveEvent();

            //            $(this._map.Map.table).find("td").unbind("mousedown");

            this._timer_prop_stop = window.setTimeout(function () {
                //                $(this._map.Map.table).find("td").bind("mousedown", function () {
                //                    LianLianKan.Operate_Single.Mousedown($(this));
                //                });

                self._InitMapEvent();
                //                LianLianKan.UI_Info.ShowInfo("解除禁手");
                LianLianKan.UI_Info.ShowRightInfo("玩家禁手状态解除", -1);
                //恢复状态
                //                LianLianKan.PlayerStatus = LianLianKan.PlayerStatus.None;
                LianLianKan.player_stop_flag = false;
                //                this._stop_flag = false;
            }, second * 1000);
        },
        //反向
        _Single_Reverse: function () {
            var row = this._map.Map.row;

            //遍历前一半的列。如果this._map.Map.col为奇数，则中间的列不用对调
            var col = Math.floor(this._map.Map.col / 2);
            var i = 0, j = 0,
                    temp_img = "",
                    temp_number = 0,
                    M = this._map.Map.map;
            //相反位置的方块
            var opposite = null;

            //此处要隐藏效果层，否则会出现问题
            common.HideDiv(this._map.line.children("div"));

            for (i = 0; i < row; i++) {
                for (j = 0; j < col; j++) {
                    /*  这个有问题！
                    M[i][j]改变后，temp也改变了！所以达不到预期的效果！

                    temp = M[i][j];
                    opposite = M[i][this._map.Map.col - j - 1];
                    M[i][j].html(opposite.html());
                    M[i][j].img = opposite.img;

                    opposite.html(temp.html());
                    opposite.img = temp.img;
                    */

                    //与相反位置的方块对调
                    temp_img = M[i][j].html();
                    temp_number = M[i][j].img;

                    opposite = M[i][this._map.Map.col - j - 1];
                    M[i][j].html(opposite.html());
                    M[i][j].img = opposite.img;

                    opposite.html(temp_img);
                    opposite.img = temp_number;
                }
            }
        },
        //重列
        _Single_Rearrangement: function () {
            var i = 0, j = 0,
                    M = this._map.Map.map,
                    imgs = [],
                    temp = null,
                    len = 0;

            //获得当前剩余方块的序号
            for (var i = 0; i < this._map.Map.row; i++) {
                for (var j = 0; j < this._map.Map.col; j++) {
                    if (M[i][j].img === 0) {
                        continue;
                    }

                    imgs.push(M[i][j].img);
                }
            }

            len = this._remain_num;
            //打乱数组（_remain_num次）
            for (i = 0; i < len; i++) {
                j = parseInt(Math.random() * len);
                temp = imgs[i];
                imgs[i] = imgs[j];
                imgs[j] = temp;
            }

            temp = 0;

            //重置方块
            for (var i = 0; i < this._map.Map.row; i++) {
                for (var j = 0; j < this._map.Map.col; j++) {
                    if (M[i][j].img === 0) {
                        continue;
                    }

                    M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp' width=" + LianLianKan.config.BIGWIDTH.toString()
                    + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px onmousedown='operate.PreventDefault();'/>");
                    M[i][j].img = imgs[temp];

                    temp += 1;
                }
            }
            //            //设标志为true
            //            this._rearrangement_flag = true;

            //重新寻路
            this._algorithm.clue_block_arr = [];
        }

        //        //*道具

        //        //?待修改（ //?播放声音 等）

        //        //指南针
        //        _FindPath: function () {
        //            this._algorithm.FindPath();
        //            this._algorithm.ShowLine(this._algorithm.clue_block_arr[0], this._algorithm.clue_block_arr[1], "ShowClueLine");
        //        },
        //        //重列
        //        _Rearrangement: function () {
        //            this._Single_Rearrangement();
        //        },
        //        //炸弹
        //        _Bomb: function () {
        //            this._Single_Elimination(1);
        //        },
        //        //路障
        //        _RoadBlock: function () {
        //                        this._Single_AddBlock(10);  //增加10对方块
        //        },
        //        //镜子（对电脑使用镜子无意义，所以此处未加入镜子道具）
        //        _Mirror: function () {
        //        },
        //        //禁手
        //        _Stop: function (time) {
        //                        this._Single_Stop(time);
        //        }
        //            //获得Boss玩家对象
        //            _GetBossPlayer: function (player) {
        //                this.__ai_player = player; GetPlayer
        //            }

    },
    //    Protected: {
    //        P_StartBySelf: function () {
    //           

    //        }
    //    },
    Protected: {
        //*模版成员（子类要覆盖的成员）

        //**抽象成员
        Abstract: {
            //子类调用父类方法的标志
            P_subClass_flag: false,
            //Boss发动大招标志
            P_bigAbility: false,



            //        //当前挑战的boss序号
            //        P_boss_index_current: 0,

            //玩家消去方块时判断发动
            P_OnPlayerElimination: function () {
            },
            //玩家连击时判断发动
            P_OnPlayerDoubleHit: function () {
            }
            //            //Boss剩余方块大于玩家剩余方块一定值时判断发动
            //            P_OnPlayerFast: function () {
            //            }
        },

        //**虚成员
        Virtual: {
            //计算单人游戏得分。挑战boss的得分计算调用子类覆写的P_Result_Score 。
            //计算规则为：
            //得分（加） = （计时器剩余时间 + 最高连击是否大于20（大于20加100分）） * （游戏设置的速度/2），
            //得分（减） 略
            P_Result_Score: function (type) {
                var score = 0;

                //?待修改
                //判断游戏难度时，根据this._difficulity_current判断

                //                if (LianLianKan.config.speed === 0) {
                //                    throw new Error("游戏速度不能为0！");
                //                }


                if (type == "win") {
                    //计时器时间
                    score += LianLianKan.config.MAXTIME - this._timeLine;
                    //                    console.log(score);


                    //最高连击数
                    score += this._highestDoubleHit >= 20 ? 100 : 0;

                    //当前游戏难度
                    switch (this._difficulity_current) {
                        case LianLianKan.Difficulity.Easy:
                            score = Math.ceil(score / 2);
                            break;
                        case LianLianKan.Difficulity.Normal:
                            score = score;
                            break;
                        case LianLianKan.Difficulity.Hard:
                            score = Math.ceil(score * 1.5);
                            break;
                        default:
                            break;
                    }

                    //                    console.log(score);
                    //                    score = Math.ceil(score * LianLianKan.config.speed / 2);
                    //                    console.log(score, LianLianKan.config.speed, LianLianKan.config.speed / 2, score * LianLianKan.config.speed / 2);
                }
                else {
                    score = -100;

                    //计时器时间
                    score += (LianLianKan.config.MAXTIME - this._timeLine) * 0.5;

                    //最高连击数
                    score += this._highestDoubleHit >= 20 ? 100 : 0;

                    //当前游戏难度
                    switch (this._difficulity_current) {
                        case LianLianKan.Difficulity.Easy:
                            score = score - 50;
                            break;
                        case LianLianKan.Difficulity.Normal:
                            score = score;
                            break;
                        case LianLianKan.Difficulity.Hard:
                            score = score + 50;
                            break;
                        default:
                            break;
                    }


                    //                    score = score < 0 ? Math.ceil(score / (LianLianKan.config.speed / 2)) : Math.ceil(score * LianLianKan.config.speed / 2);
                }

                return Math.ceil(score);
            }
        },


        //子类不能操作父类的私有成员，因此只能通过保护方法来操作父类的私有成员。

        //*子类访问（父类不用），用于修改父类的私有成员

        P_SetConfig: function (config) {
            MyGameEngine.Base.Extend(this._config, config);
        },
        P_SetMap: function (map) {
            this._SetMap(map);
        },
        //设置道具数量
        P_SetPropNum: function (propNum) {
            MyGameEngine.Base.Extend(this._propNum, propNum);
        },


        //*子类访问（父类不用），用于访问父类的私有成员

        P_GetRemainNum: function () {
            return this._remain_num;
        },
        //        P_GetScore: function () {
        //            return LianLianKan.score;
        //        },
        P_GetLevel: function () {
            return this._level;
        },
        P_GetTimeLine: function () {
            return this._timeLine;
        },
        P_GetDoubleHit: function () {
            return this._doubleHit;
        },
        P_GetHighestDoubleHit: function () {
            return this._highestDoubleHit;
        },
        //获得道具数量
        P_GetPropNum: function () {
            return this._propNum;
        },
        //更新计时器
        P_RefreshTimeLine: function () {
            var self = this;

            this.P_ClearTimeout(this._timer_timeLine);

            //此处AddTimeLine不用使用纯虚原则写成私有方法，因为我希望它能够调用子类的同名AddTimeLine方法。
            this._timer_timeLine = setInterval(function () {
                //判断状态
                if (LianLianKan.gameStatus == LianLianKan.Status.Gaming) {
                    self.AddTimeLine(2);
                }
            }, Math.floor(3000 / this._config.time_speed));
        },
        //*父类、子类都要用到的成员

        //**共享的变量（可读、写）

        //本局获得的得分
        P_currentScore: 0,

        //        //道具数量
        //        P_propNum: {
        //            prop_findPath: 0,
        //            prop_rearrangement: 0,
        //            prop_bomb: 0,
        //            prop_stop: 0,
        //            prop_roadBlock: 0,
        //            prop_mirror: 0
        //        },

        //**共享的方法（可读）

        //增加num个type类型的道具
        P_AddProp: function (type, num) {
            //不能超过9个
            switch (type) {
                case "findPath":
                    this._propNum.prop_findPath = this._propNum.prop_findPath + num > 9 ? 9 : this._propNum.prop_findPath + num;
                    //更新图片
                    $("#index_prop_findPath").attr("src", "Image/Prop/findPath" + this._propNum.prop_findPath.toString() + ".jpg");
                    break;
                case "rearrangement":
                    this._propNum.prop_rearrangement = this._propNum.prop_rearrangement + num > 9 ? 9 : this._propNum.prop_rearrangement + num;
                    $("#index_prop_rearrangement").attr("src", "Image/Prop/rearrangement" + this._propNum.prop_rearrangement.toString() + ".jpg");
                    break;
                case "bomb":
                    this._propNum.prop_bomb = this._propNum.prop_bomb + num > 9 ? 9 : this._propNum.prop_bomb + num;
                    $("#index_prop_bomb").attr("src", "Image/Prop/bomb" + this._propNum.prop_bomb.toString() + ".jpg");
                    break;
                case "stop":
                    this._propNum.prop_stop = this._propNum.prop_stop + num > 9 ? 9 : this._propNum.prop_stop + num;
                    $("#index_prop_stop").attr("src", "Image/Prop/stop" + this._propNum.prop_stop.toString() + ".jpg");
                    break;
                case "roadBlock":
                    this._propNum.prop_roadBlock = this._propNum.prop_roadBlock + num > 9 ? 9 : this._propNum.prop_roadBlock + num;
                    $("#index_prop_roadBlock").attr("src", "Image/Prop/roadBlock" + this._propNum.prop_roadBlock.toString() + ".jpg");
                    break;
                case "mirror":
                    this._propNum.prop_mirror = this._propNum.prop_mirror + num > 9 ? 9 : this._propNum.prop_mirror + num;
                    $("#index_prop_mirror").attr("src", "Image/Prop/mirror" + this._propNum.prop_mirror.toString() + ".jpg");
                    break;
                default:
                    throw new Error("道具超出范围！");
                    break;
            }
        },
        //减少num个type类型的道具
        P_SubtractProp: function (type, num) {


            //不能小于0个
            switch (type) {
                case "findPath":
                    this._propNum.prop_findPath = this._propNum.prop_findPath - num < 0 ? 0 : this._propNum.prop_findPath - num;
                    //更新图片
                    $("#index_prop_findPath").attr("src", "Image/Prop/findPath" + this._propNum.prop_findPath.toString() + ".jpg");
                    break;
                case "rearrangement":
                    this._propNum.prop_rearrangement = this._propNum.prop_rearrangement - num < 0 ? 0 : this._propNum.prop_rearrangement - num;
                    $("#index_prop_rearrangement").attr("src", "Image/Prop/rearrangement" + this._propNum.prop_rearrangement.toString() + ".jpg");
                    break;
                case "bomb":
                    this._propNum.prop_bomb = this._propNum.prop_bomb - num < 0 ? 0 : this._propNum.prop_bomb - num;
                    $("#index_prop_bomb").attr("src", "Image/Prop/bomb" + this._propNum.prop_bomb.toString() + ".jpg");
                    break;
                case "stop":
                    this._propNum.prop_stop = this._propNum.prop_stop - num < 0 ? 0 : this._propNum.prop_stop - num;
                    //更新图片
                    $("#index_prop_stop").attr("src", "Image/Prop/stop" + this._propNum.prop_stop.toString() + ".jpg");
                    break;
                case "roadBlock":
                    this._propNum.prop_roadBlock = this._propNum.prop_roadBlock - num < 0 ? 0 : this._propNum.prop_roadBlock - num;
                    $("#index_prop_roadBlock").attr("src", "Image/Prop/roadBlock" + this._propNum.prop_roadBlock.toString() + ".jpg");
                    break;
                case "mirror":
                    this._propNum.prop_mirror = this._propNum.prop_findPath - num < 0 ? 0 : this._propNum.prop_mirror - num;
                    $("#index_prop_mirror").attr("src", "Image/Prop/mirror" + this._propNum.prop_mirror.toString() + ".jpg");
                    break;
                default:
                    throw new Error("道具超出范围！");
                    break;
            }
        },


        //增加方块num_pair对
        P_Single_AddBlock: function (num_pair) {
            this._Single_AddBlock(num_pair);
        },
        //消去方块num_pair对
        P_Single_Elimination: function (num_pair) {
            this._Single_Elimination(num_pair);
        },
        //加属性
        P_Single_AddAttribute: function (attribute) {
            this._Single_AddAttribute(attribute);
        },
        //减属性
        P_Single_SubtractAttribute: function (attribute) {
            this._Single_SubtractAttribute(attribute);
        },
        //禁手
        P_Single_Stop: function (time) {
            this._Single_Stop(time);
        },
        //反向
        P_Single_Reverse: function () {
            this._Single_Reverse();
        },
        //重列
        P_Single_Rearrangement: function () {
            this._Single_Rearrangement();
        },

        //道具

        //指南针
        P_FindPath: function () {
            this._algorithm.FindPath();
            this._algorithm.ShowLine(this._algorithm.clue_block_arr[0], this._algorithm.clue_block_arr[1], "ShowClueLine");
        },
        //重列
        P_Rearrangement: function () {
            this._Single_Rearrangement();
        },
        //炸弹
        P_Bomb: function () {
            this._Single_Elimination(1);
        }
    },
    Public: {
        //        //玩家剩余方块数
        //        remain_num: 0,

        //约定不能重写
        Sealed: {
            //判断是否为连击
            JudgeDoubleHit: function () {
                var now = (new Date()).getTime();
                //消去方块的时间间隔
                var interval = null;

                //如果为第一次消去方块，则判断为不是连击
                if (!this._last_time) {
                    return false;
                }
                else {
                    interval = now - this._last_time;

                    //如果间隔小于等于2s，则判断为连击
                    if (interval <= 2000) {
                        return true;
                    }
                    else if (this.P_bigAbility) {   //如果Boss放大招，则间隔时间减去大招暂停时间（5s），再进行判断
                        //重置大招标志
                        this.P_bigAbility = false;

                        if (interval - 5000 <= 2000) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                return false;
            }
        },
        //        //此处表示公开私有成员_config和_name（相当于c#中的public属性），外界可修改这两个私有成员
        ////        config: null,
        ////        name: "",

        //        //获得已挑战boss成功的boss序号
        //        GetIndex: function () {
        //            return this._boss_index;
        //        },
        GetName: function () {
            return LianLianKan.playerName;
        },
        //观察者
        SetName: function (name) {
            this._game_player.name = LianLianKan.playerName = name;

            //            console.log("SetName:", window.LianLianKan.playerName);
            //刷新
            this._ShowInfo();
        },
        //        GetConfig: function () {
        //            //返回副本
        //            return MyGameEngine.Base.Extend({}, this._config);
        //        },
        //        SetConfig: function (config_, config_player) {
        //            MyGameEngine.Base.Extend(this._config, config);
        //        },

        //观察者
        //根据游戏难度改变属性
        SetByDifficulity: function (dif) {
            this._SetByDifficulity(dif);

            LianLianKan.difficulity = dif;
        },
        //选择玩家
        SelectPlayer: function (player) {
            //            var self = this;

            //            operate.Wait(this, 3);
            //            this.NextStep = function () {
            //                alert("Next!");
            //                alert(this._remain_num);
            //            };

            this._SelectPlayer(player);
        },
        //获得mapIndex
        GetMapIndex: function () {
            return this._map.Map.mapIndex;
        },
        //选择地图
        SetMapIndex: function (mapIndex) {
            this._map.Map.mapIndex = mapIndex;
            //            var t = this._map.Map.mapIndex;
            //            console.log("SetMapIndex", this._map.Map.mapIndex);
        },
        //显示玩家信息
        //纯虚原则
        ShowInfo: function () {
            this._ShowInfo();
        },
        //重置
        Reset: function () {
            //            console.log("Reset", this._map.Map.mapIndex);

            //*重置游戏属性
            //            this._timer_timeLine = 0;
            //            this._timer_time = 0;

            this._remain_num = 0;
            //已经选中的方块
            this._selected = {};
            //上次消方块时间，用于判断是否为连击
            this._last_time = null;
            //连击数
            this._doubleHit = 0;
            this._highestDoubleHit = 0;

            this._time = 0;
            this._timeLine = 0;

            //重置timer
            this._ClearTimer();


            //            this.P_boss_index_current = 0;

            //            this._difficulity_current = 0;

            //难度为当前设置的难度
            this._difficulity_current = LianLianKan.difficulity;

            this.P_currentScore = 0;
            //            MyGameEngine.Base.Extend(this._propNum, {
            //                prop_findPath: 0,
            //                prop_rearrangement: 0,
            //                prop_bomb: 0,
            //                prop_stop: 0,
            //                prop_roadBlock: 0
            //            });



            //            //*重置玩家属性（只重置配置config，其它的如level等不重置）
            //            //            this._Clone(this._game_player);
            //            MyGameEngine.Base.Extend(this._config, this._game_player.config);


            //*重置状态
            //            LianLianKan.propStatus = LianLianKan.PropStatus.None;
            LianLianKan.gameStatus = LianLianKan.Status.None;
            //            LianLianKan.playerStatus = LianLianKan.PlayerStatus.None;

            //*重置标志

            this.P_subClass_flag = false;
            this.P_bigAbility = false;

            //            LianLianKan.boss_beginAbility = false;

            //玩家禁手标志
            LianLianKan.player_stop_flag = false;

            //玩家增加方块标志
            LianLianKan.player_addBlock_flag = false;

            //boss禁手标志
            LianLianKan.boss_stop_flag = false;

            //boss增加方块标志
            LianLianKan.boss_addBlock_flag = false;


            //            //持续时间大于0的增加玩家属性标志
            //            LianLianKan.player_addAttribute_flag = false;

            //            //持续时间大于0的减少玩家属性标志
            //            LianLianKan.player_substractAttribute_flag = false;

            //            //持续时间大于0的增加boss属性标志
            //            LianLianKan.boss_addAttribute_flag = false;

            //            //持续时间大于0的减少boss属性标志
            //            LianLianKan.boss_substractAttribute_flag = false;

            //            this._stop_flag = false;

            //*重置算法
            this._algorithm.Dispose();
            //重新注入map对象
            this._algorithm.SetMap(this._map);

            //*移除事件绑定
            this._RemoveEvent();

            //*重置地图

            //隐藏效果层
            //            console.log(this._map.clueLine.children("div").length);
            //                common.HideDiv(this._map.clueLine.children("div"));


            this._map.line && common.HideDiv(this._map.line.children("div"));
            common.HideDiv(this._map.select_div);

            //            this._map.Dispose();
            //            this._map = null;

            //            this._map.Map.map = [];
            //            this._map.Map.mapIndex = 0;


            this._RefreshMapInfo();


            //*停止所有音效、音乐
            LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.StopAll();

            //清空系统信息
            $("#right_info").empty();

            //清空中间信息
            $("#index_showImg").attr("src", "");
            $("#index_imgInfo").html("");
            $("#index_showScore").html("");
            $("#gameMsg").hide();
            $("#index_showScore").hide();




            this._game_player && this._Clone(this._game_player);

            //            //根据游戏难度修正操作类属性
            //            this._SetByDifficulity(LianLianKan.difficulity, true);


            //            console.log(this._timeLine);


        },
        //单人游戏，开始游戏
        Start: function (mapIndex) {
            var self = this;
            //            console.log("single", this._propNum.prop_findPath);
            //            LianLianKan.UI_Info.ShowRightInfo("所有道具加1！继续连击可获得更多的道具", -1);

            LianLianKan.gameStatus = LianLianKan.Status.Gaming;

            //根据游戏难度修正操作类属性
            this._SetByDifficulity(LianLianKan.difficulity, true);

            //此处AddTimeLine不用使用纯虚原则写成私有方法，因为我希望它能够调用子类的同名AddTimeLine方法。
            self._timer_timeLine = setInterval(function () {
                //判断状态
                if (LianLianKan.gameStatus == LianLianKan.Status.Gaming) {
                    self.AddTimeLine(2);
                }
            }, Math.floor(3000 / self._config.time_speed));
            //            //把不用子类覆盖的部分写到保护的函数中，子类可以服用这部分
            //            this.P_StartBySelf();

            //                console.log("start");
            //                console.log(this.gameInfo.time);
            //                //重置游戏，进行设置
            //                self.Reset();

            //            //单人模式
            //            LianLianKan.pattern = LianLianKan.Pattern.Single;
            //                console.log(LianLianKan.gameStatus);



            self._timer_time = setInterval(function () {
                if (LianLianKan.gameStatus == LianLianKan.Status.Gaming) {
                    self._AddUseTime();
                }
                //                LianLianKan.UI_Info.ShowRightInfo("所有道具加1！继续连击可获得更多的道具", -1);
            }, 1000);
            //                window.setTimeout(function () {
            //                    LianLianKan.gameStatus = self._Status.Wait;
            //                }, 4000);


            //            //?显示玩家信息（得分、挑战boss情况、等级）
            //            this._ShowInfo();

            //            console.log(this._map.Map.mapIndex);

            //初始化道具
            this._InitProp();
            //            console.log("single", this._propNum.prop_findPath);
            //初始化地图
            this._InitMap(mapIndex);

            //定位中间信息gameMsg和index_showScore
            this._InitCenter($("#gameMsg"), "#lianliankan_map", $("#gameMsg").width(), $("#gameMsg").width());


            //绑定事件
            this._InitMapEvent();

            //菜单栏显示复位
            LianLianKan.UI_Page.menu.SetText([0, 1], "暂停");

            //?选图

            //保存当前难度
            this._difficulity_current = LianLianKan.difficulity;

            //循环播放背景音乐
            if (LianLianKan.pattern === LianLianKan.Pattern.Single) {
                LianLianKan.Sound && LianLianKan.config.music && LianLianKan.Sound.RepeatPlay("single_background", -1);
            }



            //            //根据设置的游戏速度，修正_config
            //            this._SetConfig();

            //                //获得Boss玩家对象   待修改
            //                this._GetBossPlayer(new Boss_Player());


        },
        //保存玩家信息
        SaveInfo: function () {
            this._SaveInfo();
        },
        //        GetInfo: function () {

        //        },

        //使用道具
        //            Use: function (prop) {
        //                prop.Do();
        //            },

        //            //显示玩家信息
        //            ShowInfo: function (info) {
        //                alert(info);
        //            },


        //因为本类其它虚方法要调用RefreshMapInfo、ClearTimer和GameOver，因此使用纯虚原则，
        //增加私有方法_RefreshMapInfo、_ClearTimer和_GameOver，其它虚方法调用这几个私有方法！

        //更新地图信息
        RefreshMapInfo: function () {
            this._RefreshMapInfo();
        },
        //单人游戏，游戏结束
        GameOver: function (type) {
            //            console.log("GameOver");
            this._GameOver(type);
        },
        //清除计时器
        ClearTimer: function () {
            //                        console.log("clear");
            this._ClearTimer();
        },

        //点击方块
        Mousedown: function (_this) {
            //            this._Mousedown(_this);

            //                console.log("选中了一个方块！");
            //                console.log(this);
            //                console.log(this.clueLine_click_flag);
            var current = _this, M = this._map.Map.map;
            var position = current.position();    //使用position()，获得相对于“lianliankan_map”层的坐标
            //取出坐标
            var x = current.attr("x"),
                                                                    y = current.attr("y");
            //当前方块
            var current_block = M[y][x];

            var _selected;

            //消去方块标志
            var flag = false;
            //            LianLianKan.pathLine_arr = [];  //清空路径
            //            LianLianKan.clueLine_arr = [];  //清空路径


            //            LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound = new DOTA.SoundLoader(LianLianKan.MUSIC, null, null);

            //            LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.play("start");

            //            M[5][5].html("");
            //                flag = false;
            //            console.log(current.attr("width"));
            //            console.log(current.attr("height"));
            //                        console.log("y = " + current.offset().top);
            //                        console.log("x = " + current.offset().left);

            //                        console.log("y = " + offset.top);
            //                        console.log("x = " + offset.left);

            //                console.log(LianLianKan.gameStatus);

            if (current_block.img === 0 || LianLianKan.gameStatus != LianLianKan.Status.Gaming) {
                //                console.log("return");
                return;
            }


            //隐藏爆炸、连线效果层
            common.HideDiv(this._map.line.children("div"));
            //            common.HideDiv($(this._map.line).find("div.clue"));
            //不使用MyClass.self！因为该属性为静态属性，如果创建了该类后，又创建了类A，则MyClass.self会指向类A！
            //                _selected = MyClass.self.selected;
            _selected = this._selected;

            //重置选中的方块
            this._selected = {};

            //                this.Use(Bomb);
            //                Prop.AddBlock(10);
            //            Prop.Stop();
            //                SingleProp.GetInstance(Rearrangement).Do();
            //                                                SingleProp.GetInstance(Mirror).Do();
            //            SingleProp.GetInstance(Bomb, Game_Algorithm).Do();
            //                SingleProp.GetInstance(Stop).Do();
            //                setTimeout(function () { SingleProp.GetInstance(FindPath).Do(); }, 1000);
            //            SingleProp.GetInstance(FindPath, Game_Algorithm).Do();

            //            console.log("重列！");
            //            Prop.Rearrangement();

            //            flag = false;

            //如果已经有选中的方块
            if (_selected.block) {
                //如果方块相同
                if (this._algorithm.IsEqual(_selected.block, current_block)) {
                    //                    console.log("common!");

                    //                    //清空路径。
                    //                    //放到调用IsLink方法前！
                    //                    LianLianKan.pathLine_arr = [];

                    //如果方块可连接
                    if (this._algorithm.IsLink(_selected.block, current)) {


                        //                            //路径数组赋值
                        //                            LianLianKan.pathLine_arr = operate.Clone(LianLianKan.path_arr);

                        //                        console.log("link!");
                        //                        console.log(LianLianKan.pathLine_arr.length);
                        //消去方块
                        this._algorithm.Elimination(_selected.block, current_block);


                        //播放音效
                        LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("elec");
                        flag = true;


                        //刷新剩余方块数
                        this._remain_num -= 2;

                        //如果消去提示框的方块，则隐藏提示框
                        //                                                        if (this.clueLine_click_flag == 1) {
                        //                                                            common.HideDiv(this._map.line.children("div"));

                        //                                                            this.clueLine_click_flag = 0;
                        //                                                        }

                        //显示连线
                        this._algorithm.ShowLine(_selected.block, current_block);
                        //显示爆炸
                        this._algorithm.ShowBoom(_selected.block, current_block);

                        //隐藏当前选中效果层
                        common.HideDiv(this._map.select_div);


                        //                        //隐藏爆炸、连线效果层
                        //                        common.HideDiv(this._map.line.children("div"));

                        //                            var t = this.gameInfo.timeLine;
                        //                            console.log(this._timeLine);
                        //计时器加时间
                        this._timeLine -= this._config.addTime;
                        //                            var m = this.gameInfo.timeLine;
                        //                            console.log(this._timeLine);

                        //判断是否为连击
                        if (this.JudgeDoubleHit()) {
                            this._AddDoubleHit();


                            //挑战boss模式
                            if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                                //判断增加道具
                                this._AddPropByDoubleHit();
                                //判断是否发动技能（玩家连击时判断发动），可同时发动不同类型的技能
                                this.P_OnPlayerDoubleHit();
                            }
                        }
                        else {
                            this._ResetDoubleHit();
                        }

                        //更新信息
                        this._RefreshMapInfo();




                        //*发布所有事件

                        //判断是否胜利
                        if (this._remain_num === 0) {
                            //                            if (LianLianKan.pattern == LianLianKan.Pattern.Single) {
                            //                                this.GameOver("win");
                            //                            }
                            //                            else if (LianLianKan.pattern == LianLianKan.Pattern.Boss) {
                            //                                this._ai_operate.GameOver("lose");
                            //                            }


                            ///*  此处直接用GameOver，因为希望在子类中调用_Mousedown时，可以调用子类覆盖了的GameOver方法。
                            //this._GameOver("win");
                            //*/


                            //P_subClass_flag在子类中重写，表示子类是否调用该方法。
                            //如果P_subClass_flag为true，表示子类调用该方法（Mousedown），选择要调用的子类成员。
                            //子类调用此Mousedown时，此处调用的GameOver为子类的同名方法；
                            //父类调用此Mousedown时，此处调用的GameOver为父类的GameOver。
                            if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                                this.GameOver("lose");
                            }
                            else {
                                this.GameOver("win");
                            }
                            return;
                        }

                        //判断是否发动技能（玩家消去方块时判断发动、boss剩余方块大于玩家剩余方块一定值时判断发动），可同时发动不同类型的技能
                        if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                            this.P_OnPlayerElimination();
                            //                            this.P_OnPlayerFast();
                        }


                        //判断是否无解并提示。
                        //消去一对方块后判断。
                        if (this._algorithm.IsNoPath(this._remain_num)) {
                            LianLianKan.UI_Info.ShowInfo("无解！请使用重列或者炸弹道具", 2);

                            return false;
                        }


                        return false;
                    }
                    //                    else {
                    //                        flag = false;
                    //                    }
                }
                //                else {
                //                    flag = false;
                //                }
            }
            //            console.log(LianLianKan.pathLine_arr.length);
            //            //            else {
            //            //                flag = false;
            //            //            }

            //            //            //            if (!flag) {

            //            if (IsNoPath()) {     //判断是否无解并提示
            //                //                alert("无解！请使用重列或者炸弹道具");
            //                Show.ShowInfo("无解！请使用重列或者炸弹道具");
            //            }


            //播放音效
            if (!flag) {
                LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("sel");
            }

            //保存当前选中方块
            this._selected.block = current_block;
            this._selected.x = x;
            this._selected.y = y;

            //显示当前选中效果层
            this._map.select_div.css({ "left": position.left + "px", "top": position.top + "px" });

            //            console.log(current.offset().left + "px");
            //            console.log(this._map.select_div.css("left"));
            //            console.log(this._map.select_div.css("top"));
            //            current.children("img").attr("class", "selected");
            //*播放音效
            //            //            }
            return false;
        },
        //计时器
        AddTimeLine: function (val) {
            //                console.log("addtimeline");
            //                console.log(this.gameInfo.time);
            //                console.log(this._remain_num);
            //            console.log(this._timeLine);

            this._timeLine += val;
            //                console.log(this.gameInfo.timeLine);
            this._timeLine = this._timeLine < 0 ? 0 : this._timeLine;
            //                    console.log(this._timeLine);
            $("#timeLineImg").css("width", this._timeLine + "px");
            //                console.log($("#timeLineImg").css("width"));
            if (this._timeLine >= LianLianKan.config.MAXTIME) {
                //                    if (LianLianKan.pattern == LianLianKan.Pattern.Single) {

                //P_subClass_flag在子类中重写，表示子类是否调用该方法
                if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                    this.GameOver("win");
                }
                else {
                    this.GameOver("lose");
                }
                //                    this._GameOver("lose");


                //                    }
                //                    else if (LianLianKan.pattern == LianLianKan.Pattern.Boss) {
                //                        this._ai_operate.GameOver("win");
                //                    }
                //                    alert("游戏结束");
            }
            //                    console.log(this.gameInfo.timeLine);
        },
        //        //使用道具，参数为道具类名
        //        Use: function (prop) {
        //            var prop_instance = null;

        //            if (operate.IsString(prop)) {
        //                throw new Error("The type of Class name can't be string!");
        //            }

        //            prop_instance = SingleProp.GetInstance(prop, new Game_Algorithm(this._map));

        //            //            prop_instance.Do();
        //            this._game_player.Use(prop_instance);

        //            //?播放声音
        //        },
        GetPlayer: function (type) {
            return this._game_player;
        },
        //显示地图信息
        ShowMapInfo: function () {
            this._ShowMapInfo();
        },
        //绑定道具事件
        BindEvent_Prop: function () {
            //道具绑定click事件
            this._OnClickProp = MyGameEngine.Event.BindEvent(this, function (event, args) {
                //开始游戏后才能使用道具
                if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
                    switch ($(event.target).attr("id")) {
                        case "index_prop_findPath":
                            if (this._propNum.prop_findPath > 0) {
                                //                                SingleProp.GetInstance(FindPath, this._algorithm, this._map).Do();
                                ////                                console.log(this._propNum.prop_findPath);
                                //                                if (this.P_subClass_flag) {
                                this.P_FindPath();
                                LianLianKan.UI_Info.ShowRightInfo("玩家使用指南针道具", -1);
                                //播放音效
                                LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("findPath");
                                //                                }
                                //                                //道具数减1
                                //                                this._propNum.prop_findPath -= 1;
                                //                                //?图片更改，下同
                                this.P_SubtractProp("findPath", 1);
                            }
                            //                            console.log(this._propNum.prop_findPath);
                            break;
                        case "index_prop_rearrangement":
                            if (this._propNum.prop_rearrangement > 0) {
                                //                                SingleProp.GetInstance(Rearrangement, this._algorithm, this._map).Do();
                                //                                console.log(this._propNum.prop_rearrangement);
                                this.P_Rearrangement();
                                LianLianKan.UI_Info.ShowRightInfo("玩家使用重列道具", -1);
                                //播放音效
                                LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("rearrangement");
                                //                                //道具数减1
                                //                                this._propNum.prop_rearrangement -= 1;
                                this.P_SubtractProp("rearrangement", -1);
                            }
                            //                            console.log(this._propNum.prop_rearrangement);
                            break;
                        case "index_prop_bomb":
                            if (this._propNum.prop_bomb > 0) {
                                //                                SingleProp.GetInstance(Bomb, this._algorithm, this._map).Do();
                                this.P_Bomb();
                                LianLianKan.UI_Info.ShowRightInfo("玩家使用炸弹道具", -1);
                                //播放音效
                                LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("bomb");
                                //道具数减1
                                this.P_SubtractProp("bomb", 1);
                            }
                            break;
                        case "index_prop_stop":
                            //                            if (this._propNum.prop_stop > 0) {
                            //                                //                                SingleProp.GetInstance(FindPath, this._algorithm).Do();
                            //                                //                                console.log(this._propNum.prop_findPath);
                            //                                this._Stop(5);
                            //                                //道具数减1
                            //                                this._propNum.prop_stop -= 1;
                            //                            }
                            //                            //                            console.log(this._propNum.prop_findPath);
                            //                            break;
                        case "index_prop_roadBlock":
                            //                            if (this._propNum.prop_roadBlock > 0) {
                            //                                //                                SingleProp.GetInstance(FindPath, this._algorithm).Do();
                            //                                this._RoadBlock();
                            //                                //                                console.log(this._propNum.prop_findPath);
                            //                                //道具数减1
                            //                                this._propNum.prop_roadBlock -= 1;
                            //                            }
                            //                            //                            console.log(this._propNum.prop_findPath);
                        case "index_prop_mirror":
                            break;

                        default:
                            throw new Error("道具超出范围");
                            break;
                    }
                }
            });
            MyGameEngine.Event.AddEvent($("ul.index_prop li"), "click", this._OnClickProp);
        },
        //移除道具事件
        RemoveEvent_Prop: function () {
            this._RemoveEvent_Prop();
        },

        //        //根据设置的游戏速度，修正_config
        //        SetConfig: function (config) {
        //            MyGameEngine.Base.Extend(this._config, config);
        //        },
        //        //游戏设置改变姓名后，调用该方法，改变Operate_Single的_name。
        //        SetName: function (name) {
        //            LianLianKan.playerName = name;
        //        },

        //结束当前游戏
        EndGame: function () {
            //            if (this._game_player) {
            ////                //更新当前player的数据
            ////                this._RefreshCurrentPlayer();
            //                //保存当前player的数据
            //                this._SaveInfo();
            //            }
            this.Reset();
        },
        Dispose: function () {
            this._algorithm.Dispose();
            this._map.Dispose();

            //移除事件
            this._RemoveEvent_Prop();
        }
    }
});


