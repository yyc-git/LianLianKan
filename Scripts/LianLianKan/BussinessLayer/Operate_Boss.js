////挑战boss操作类新增加的成员
//var Interface_Operate_Boss = MyInterface(["GetIndex"]);

//挑战boss操作类     玩家的属性在挑战相应boss时要调整！
var Operate_Boss = MyClass({ Class: Operate_Single }, {
    Init: function (map, map_parent, player) {
        //覆写标志
        this.P_subClass_flag = true;


        //绑定地图
        this.__SetMap(map, map_parent);

        this.__Init_Start();

        //注入玩家类（目前只有一个玩家，不需要切换玩家。以后如果要增加切换玩家功能，则此处可传入新的玩家类）
        this.baseClass.SelectPlayer.call(this, player);

        //        //显示信息
        //        this.ShowInfo();


        //                //调用父类构造函数，注入g向子类(Operate_Boss)
        //                this.baseClass.Init.call(this);

        //        //依赖注入单人操作类，复用它的方法
        //        this._operate_single = operate;

        //                thihm = new Algorithm(LianLianKan.UI_SmallMap.Map);
        //                this.map = LianLianKan.UI_SmallMap.Map;
    },
    Private: {
        //地图
        __map: null,
        //Boss玩家对象
        __ai_player: null,
        //当前挑战的boss序号
        __index: "",
        //Boss经验值
        __experience: 0,
        //Boss等级
        __level: 1,
        //剩余方块数
        __remain_num: 0,
        //Boss姓名
        __name: "",
        __img: "",    //未挑战成功的boss的头像
        __img_gray: "",   //已挑战成功的boss的头像（灰色）
        __minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
        __minScore: 0,     //玩家需要获得该得分才可以挑战
        __text: "",
        __background_music: "",    //背景音乐名
        //参数设置
        __config: {
            //可以使用的技能  { 技能类名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)  什么时候判断}
            ability: [],

            //boss小技能施法时间（boss放小技能时，暂停消方块的时间）
            boss_smallAbility_time: 2,
            //Boss消方块速度
            ai_speed: 0,
            //玩家计时器速度
            time_speed: 0,
            //消去方块时，玩家计时器加的时间
            addTime: 0,
            //玩家初始的道具数
            prop_findPath: 0,
            prop_rearrangement: 0,
            prop_bomb: 0,
            prop_stop: 0,
            prop_roadBlock: 0,
            prop_mirror: 0
        },



        //        //单人操作类对象
        //        _operate_single: null,
        //算法对象
        __algorithm: null,

        //        __timer_timeLine_player: null,



        //        //计时器和时间
        //        _timer_timeLine: 0,

        //        //当前游戏难度（默认为正常）
        //        __difficulity: 2,

        //游戏开始时的游戏难度
        __difficulity_current: 2,

        //        //保存本次设置的难度，用于判断是否与上次设置的难度相同。
        //        __difficulity: 0,


        //游戏难度对应的设置
        __configByDifficulity: {
            ai_speed: 0     //默认值为0
        },


        //*计时器

        //Boss消方块计时器
        __timer_timeLine: null,
        //禁手计时器
        __timer_prop_stop: 0,
        //增加属性计时器
        __timer_addAttribute: 0,
        //减少属性计时器
        __timer_subtractAttribute: 0,


        //以下五个计时器动态生成（后缀加上序号）

        //小技能施法计时器
        //大招施法计时器
        //产生效果-小技能计时器
        //产生效果-大招计时器
        //技能计时器（如有持续时间的技能，持续时间到后，需要恢复状态）


        //*技能计时器序号（有些技能需要用到）（动态增加）


        //**__PrepareAbility

        //大招计时器序号
        __init_bigAbility_index: 0,

        //小技能计时器序号
        __init_smallAbility_index: 0,


        //**__UseAbility

        //产生技能效果-大招计时器序号
        __use_bigAbility_index: 0,

        //产生技能效果-小技能计时器序号
        __use_smallAbility_index: 0,


        //**Boss技能

        //技能计时器序号
        __bossAbility_index: 0,





        //        //禁手标志
        //        __stop_flag: false,


        //*标志

        //boss施放技能标志
        __boss_beginAbility: false,

        //boss不受玩家道具攻击
        __boss_protectedByNoProp: false,

        //玩家禁止使用道具
        __player_noProp: false,

        //        //boss是否有施放时间标志
        //        __boss_abilityTime_flag: true,



        //boss大技能暂停时间
        __boss_bigAbility_time: 5,


        __Init_Start: function () {
            //地图初始化
            this.__map.InitGameArea();

            //            //*重置Boss属性（只重置配置config，其它的如level等不重置）
            //            //            this.__Clone(this.__ai_player);
            //            MyGameEngine.Base.Extend(this.__config, this.__ai_player.config);

            //            this.SelectPlayer(player);
        },
        //依赖注入__map对象
        __SetMap: function (map, map_parent) {
            this.__map = map;

            this.__algorithm = new Boss_Algorithm(map);

            //父类注入
            this.P_SetMap(map_parent);

            //            //父类注入
            //            this.baseToSubClass(map_parent);
        },
        //设置Boss Player的属性
        __SetPlayer: function (player) {
            //调用数据层的数据类的方法，获得boss信息
            //此处传递的name固定。Boss名字固定为Boss类中预定义的名字。
            player.experience = Number(Data_Boss.GetExperience(player.name));
            player.level = Number(Data_Boss.GetLevel(player.name));
            //            player.index = Data_Boss.GetIndex(player.name);

            //            player.name = Data_Player.GetName("player");
        },
        __SetByDifficulity: function (dif, reset) {
            //?待修改
            var old = MyGameEngine.Base.Extend({}, this.__configByDifficulity),
                ai_speed = 0,
                self = this;

            //            switch (dif) {
            //                case LianLianKan.Difficulity.Easy:
            //                    this.__configByDifficulity.ai_speed = LianLianKan.config.easy.ai_speed;
            //                    break;
            //                case LianLianKan.Difficulity.Normal:
            //                    this.__configByDifficulity.ai_speed = LianLianKan.config.normal.ai_speed;
            //                    break;
            //                case LianLianKan.Difficulity.Hard:
            //                    this.__configByDifficulity.ai_speed = LianLianKan.config.hard.ai_speed;
            //                    break;
            //                default:
            //                    break;
            //            }


            switch (dif) {
                case LianLianKan.Difficulity.Easy:
                    this.__configByDifficulity.ai_speed = -1;
                    break;
                case LianLianKan.Difficulity.Normal:
                    this.__configByDifficulity.ai_speed = 0;
                    break;
                case LianLianKan.Difficulity.Hard:
                    this.__configByDifficulity.ai_speed = 1;
                    break;
                default:
                    break;
            }


            //            //保存难度
            //            this.__difficulity = dif;

            //改变属性
            //判断是否与上次设置的难度一样
            //            if (dif !== this.__difficulity) {
            if (reset) {
                ai_speed = this.__config.ai_speed + this.__configByDifficulity.ai_speed;
            }
            else {
                ai_speed = this.__config.ai_speed - old.ai_speed + this.__configByDifficulity.ai_speed;
            }

            this.__config.ai_speed = ai_speed > 1 ? ai_speed : 1;   //最低为1

            //            }

            //            //保存难度
            //            LianLianKan.difficulity = dif;
        },
        //保存boss信息
        __SaveInfo: function () {
            //                        console.log(document.cookie);
            //            Data_Boss.SetExperience(this.__name, this.__experience);
            //                        Data_Boss.SetLevel(this.__name, this.__level);

            Data_Boss.SetExperience(this.__ai_player.name, this.__ai_player.experience);
            Data_Boss.SetLevel(this.__ai_player.name, this.__ai_player.level);
        },
        //把player的属性拷贝到私有属性中
        __Clone: function (player) {
            //            var speed = this.__config.ai_speed;
            //            console.log("Clone", speed);

            MyGameEngine.Base.Extend(this.__config, player.config);

            //如果设置了游戏难度，则使用游戏难度对应的ai_speed
            //            if (this.__config.ai_speed !== 0) {
            //                                        this.__config.ai_speed += speed;
            //                        }

            //            //根据当前难度修正
            //            this.__config.ai_speed += this.__configByDifficulity.ai_speed;


            //            console.log("Clone", this.__config.ai_speed);
            //            //剩余方块数
            //            this.__remain_num = player.__remain_num;



            this.__name = player.name;
            //Boss经验值
            this.__experience = player.experience;
            //Boss等级
            this.__level = player.level;


            this.__img = player.img;    //未挑战成功的boss的头像
            this.__img_gray = player.img_gray;   //已挑战成功的boss的头像（灰色）
            this.__minNum = player.minNum;     //地图最小要求的方块数，如果为0则不限制地图
            this.__minScore = player.minScore;  //玩家需要获得该得分才可以挑战
            this.__text = player.text;    //boss说明
            this.__background_music = player.background_music.length !== 0 ? player.background_music[1] : null;  //背景音乐名
            //序号
            this.__index = player.index;

        },
        //开始计时消方块
        __StartElimination: function () {
            var self = this;

            this.__timer_timeLine = setInterval(function () {
                //要判断状态
                if (LianLianKan.gameStatus === LianLianKan.Status.Gaming && !LianLianKan.boss_stop_flag && !self.__boss_beginAbility) {
                    if (!self.__AutoElimination()) {
                        return;
                    }

                    //触发onBossElimination事件
                    //                    self.onBossElimination.PublishAll(self);
                    self.__OnBossElimination();
                    //                    self.__Boss_Elimination(1);
                }

                //                console.log("self.__config.ai_speed = ", self.__config.ai_speed);

            }, Math.floor(3000 / this.__config.ai_speed));
        },
        //刷新boss消方块速度
        __RefreshSpeed: function () {
            var self = this;
            if (this.__timer_timeLine) {
                //                window.clearInterval(this.__timer_timeLine);
                //                this.__timer_timeLine = 0;
                this.P_ClearInterval(this.__timer_timeLine);

                this.__StartElimination();
            }
        },
        //自动消去一对方块
        __AutoElimination: function () {

            //判断是否胜利
            if (this.__remain_num <= 0) {
                this.GameOver("win");
                return false;
            }

            this.__algorithm.FindPath();

            //如果无解
            while (!this.__algorithm.FindPath()) {
                LianLianKan.UI_Info.ShowRightInfo("Boss使用重列道具", -1);
                this.__Boss_Rearrangement();
                //                    return;
            }


            //            this.__algorithm.Elimination(this.__algorithm.clue_block_arr[0], this.__algorithm.clue_block_arr[1]);
            this.__algorithm.Elimination();


            //刷新剩余方块数
            this.__remain_num -= 2;

            //                //隐藏当前选中效果层
            //                common.HideDiv(this.__map.select_div);


            //                //                //如果消去提示框的方块，则隐藏提示框
            //                //                if (LianLianKan.Operate_Single.clueLine_click_flag == 1) {
            //                //                    common.HideDiv(LianLianKan.UI_CommonMap.clueLine.children("div"));

            //                //                    LianLianKan.Operate_Single.clueLine_click_flag = 0;
            //                //                }

            //                //计时器加时间
            //                LianLianKan.Operate_Single.GetPlayer().gameInfo.timeLine -= LianLianKan.config.addTime;

            //                //判断是否为连击
            //                LianLianKan.Operate_Single.JudgeDoubleHit();

            //刷新boss地图信息
            this.__RefreshBossMapInfo();


            //判断是否胜利
            if (this.__remain_num <= 0) {
                this.GameOver("win");
                return false;
            }
            //消去方块后，判断是否无解，如果无解，自动重列
            //                if (this.__algorithm.IsNoPath(this.__remain_num)) {
            //                    LianLianKan.UI_Info.ShowRightInfo("使用重列道具");
            //                    this.__Boss_Rearrangement();
            ////                    return;
            //                }
            //

            //此处改用循环，直到找到路径才继续
            while (this.__algorithm.IsNoPath(this.__remain_num)) {
                LianLianKan.UI_Info.ShowRightInfo("Boss使用重列道具", -1);
                this.__Boss_Rearrangement();
                //                    return;
            }
            return true;

        },
        //        //自动重列
        //        __Rearrangement: function () {
        //            var i = 0, j = 0,
        //                                    M = this.__map.Map.map,
        //                    imgs = [],
        //                    temp = null;

        //            //获得当前剩余方块的序号
        //            for (var i = 0; i < this.__map.Map.row; i++) {
        //                for (var j = 0; j < this.__map.Map.col; j++) {
        //                    if (M[i][j].img === 0) {
        //                        continue;
        //                    }

        //                    imgs.push(M[i][j].img);
        //                }
        //            }

        //            //打乱数组（LianLianKan.Operate_Single.GetPlayer().__remain_num次）
        //            for (i = 0; i < this.__remain_num; i++) {
        //                j = parseInt(Math.random() * this.__remain_num);
        //                temp = imgs[i];
        //                imgs[i] = imgs[j];
        //                imgs[j] = temp;
        //            }

        //            temp = 0;

        //            //重置方块
        //            for (var i = 0; i < this.__map.Map.row; i++) {
        //                for (var j = 0; j < this.__map.Map.col; j++) {
        //                    if (M[i][j].img === 0) {
        //                        continue;
        //                    }

        //                    M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp' width=" + LianLianKan.config.SMALLWIDTH + "px height=" + LianLianKan.config.SMALLHEIGHT + "px onmousedown='operate.PreventDefault();'/>");

        //                    M[i][j].img = imgs[temp];

        //                    temp += 1;
        //                }
        //            }
        //        },

        //准备技能
        //boss小技能动画显示在boss消息框，音效都统一用一个。
        //boss大招动画显示在中间，boss和玩家都暂停，音效用专门的大招音效。
        __PrepareAbility: function (ob) {
            var time = 0;   //暂停时间1
            var self = this;
            //            var time_2 = 0; //暂停时间2



            //大招
            if (ob.big) {
                //                time = 5;

                //大招标志为true
                this.P_bigAbility = true;



                //玩家和Boss都暂停
                LianLianKan.gameStatus = LianLianKan.Status.Pause;

                //显示技能图片和技能信息this.__boss_bigAbility_time秒
                LianLianKan.UI_Info.ShowCenter(ob.img, ob.imgInfo, this.__boss_bigAbility_time);

                //                            LianLianKan.UI_Info.ShowInfo("aaaa", 3);
                //LianLianKan.UI_Info.ShowInfo("无解！请使用重列或者炸弹道具", 2);

                //Boss说话
                LianLianKan.UI_Info.ShowUpInfo(ob.say, this.__boss_bigAbility_time, true);


                //显示系统信息
                //                LianLianKan.UI_Info.ShowRightInfo(this.__name + "开始施放" + ob.name + "技能。" + ob.systemInfo, -1, false);
                LianLianKan.UI_Info.ShowRightInfo(this.__name + "开始施放" + ob.name + "技能。", -1, false);

                //播放音效this.__boss_bigAbility_time秒（循环）
                LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.PlayInTimeByLoop(ob.music[1], this.__boss_bigAbility_time);
                //                LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("start");

                //                //this.__boss_bigAbility_time时间后继续
                //                window.setTimeout(function () {
                //                    if (LianLianKan.gameStatus === LianLianKan.Status.Pause) {
                //                        LianLianKan.gameStatus = LianLianKan.Status.Gaming;
                //                    }
                //                }, this.__boss_bigAbility_time * 1000);


                //this.__boss_bigAbility_time时间后继续
                (function (i) {
                    self["__timer_init_bigAbility" + i.toString()] = window.setTimeout(function () {
                        if (LianLianKan.gameStatus === LianLianKan.Status.Pause) {
                            LianLianKan.gameStatus = LianLianKan.Status.Gaming;
                        }

                        //重置大招标志
                        self.P_bigAbility = false;


                        LianLianKan.UI_Info.ShowRightInfo(ob.name + "技能施放完毕", -1, false);
                        //                        //显示info
                        //                        info !== undefined && LianLianKan.UI_Info.ShowRightInfo(info, -1, false);


                        //                        //调用委托
                        //                        func && func();
                    }, self.__boss_bigAbility_time * 1000);

                    self.__init_bigAbility_index += 1;

                } (this.__init_bigAbility_index));




            }
            else {      //小技能
                //                time = 2;

                //boss停止消方块（技能有施法时间）
                //                if (this.__boss_abilityTime_flag) {    //如果boss技能有施法时间
                //                    this.__boss_beginAbility = true;

                //                    //显示系统信息
                //                    LianLianKan.UI_Info.ShowRightInfo(this.__name + "开始施放" + ob.name + "技能", -1, false);

                //                }
                //                else {
                //                    this.__boss_beginAbility = false;
                //                }

                //                //清除小技能施法计时器
                //                this.P_ClearTimeout(this.__timer_init_smallAbility);

                //显示系统信息
                //                LianLianKan.UI_Info.ShowRightInfo(this.__name + "开始施放" + ob.name + "技能。" + ob.systemInfo, -1, false);
                LianLianKan.UI_Info.ShowRightInfo(this.__name + "开始施放" + ob.name + "技能。", -1, false);

                //boss停止消方块（技能有施法时间）
                //施法时间为<=0表示没有施法时间
                if (this.__config.boss_smallAbility_time > 0) {
                    //boss暂停消方块
                    this.__boss_beginAbility = true;
                }
                else {
                    this.__boss_beginAbility = false;
                }


                //                //显示系统信息
                //                LianLianKan.UI_Info.ShowRightInfo(ob.systemInfo, -1, false);

                //                console.log(this.__config.boss_smallAbility_time);
                //                console.log("this.__boss_beginAbility = ", this.__boss_beginAbility);

                if (this.__config.boss_smallAbility_time > 0) {
                    //显示技能图片this.__config.boss_smallAbility_time秒
                    LianLianKan.UI_Info.ShowUpImg(ob.img, this.__config.boss_smallAbility_time);
                    //播放音效this.__config.boss_smallAbility_time秒（不循环）
                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.PlayInTime(ob.music[1], this.__config.boss_smallAbility_time);
                }
                else {
                    //显示技能图片2秒
                    LianLianKan.UI_Info.ShowUpImg(ob.img, 2);
                    //播放音效2s（不循环）
                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.PlayInTime(ob.music[1], 2);
                }

                //Boss说话(5秒)
                LianLianKan.UI_Info.ShowUpInfo(ob.say, 5, true);





                if (this.__config.boss_smallAbility_time > 0) {
                    //this.__config.boss_smallAbility_time时间后继续
                    (function (i) {
                        self["__timer_init_smallAbility" + i.toString()] = window.setTimeout(function () {
                            //boss恢复消方块
                            self.__boss_beginAbility = false;

                            //                        if (self.__boss_abilityTime_flag) {
                            LianLianKan.UI_Info.ShowRightInfo(ob.name + "技能施放完毕", -1, false);
                            //                            //显示info
                            //                            info !== undefined && LianLianKan.UI_Info.ShowRightInfo(info, -1, false);

                            //                        }
                            //                            //Boss说话（显示5s）
                            //                            LianLianKan.UI_Info.ShowUpInfo(ob.say, 5, true);


                            //                            //调用委托
                            //                            func && func();

                        }, self.__config.boss_smallAbility_time * 1000);

                        self.__init_smallAbility_index += 1;  //此处要让self.__init_smallAbility_index加1，而不是让i加1！


                    } (this.__init_smallAbility_index));
                }
                else {
                    LianLianKan.UI_Info.ShowRightInfo(ob.name + "技能施放完毕", -1, false);
                }
            }
        },
        //初始化技能
        __InitAbility: function (ob) {
            var self = this,
                temp = null;

            //前置判断
            temp = this.__PreJudgmentAbility(ob);

            if (temp === "break") {
                //?系统信息提示

                return "break";
            }
            //有技能动画、音效，不产生技能效果
            else if (temp === "initAbility") {
                //准备技能
                //                this.__PrepareAbility(MyGameEngine.Event.BindWithArguments(this, this.__TimeOut_InitAbility, ob), ob);
                this.__PrepareAbility(ob);

                //提示技能无效
                if (ob.big) {
                    window.setTimeout(function () {
                        LianLianKan.UI_Info.ShowRightInfo(ob.name + "技能无效！", -1, false);
                    }, self.__boss_bigAbility_time * 1000 + 200);   //技能施放完毕后显示
                }
                else {
                    if (self.__config.boss_smallAbility_time > 0) {
                        window.setTimeout(function () {
                            LianLianKan.UI_Info.ShowRightInfo(ob.name + "技能无效！", -1, false);
                        }, self.__config.boss_smallAbility_time * 1000 + 200);  //技能施放完毕后显示
                    }
                    else {
                        LianLianKan.UI_Info.ShowRightInfo(ob.name + "技能无效！", -1, false);
                    }
                }

                return "break";
            }
            //有技能动画、音效，产生技能效果
            else {
                //                //准备技能
                //                this.__PrepareAbility(null, ob);

                //准备技能
                this.__PrepareAbility(ob);

                return "continue";
            }
            return "continue";
        },

        //*从制定的技能范围中，按概率发动ai消去方块时的可能发动的技能

        //boss消去方块时判断发动
        __OnBossElimination: function () {
            //获得该事件可能会触发的技能
            var ability = this.__config.ability.filter(function (ob) {
                if (ob.when === "onBossElimination") {
                    return ob;
                }
            });

            var self = this;
            //                time = 5;   //暂停时间

            //等级越高，技能越强
            var add = this.__level - 1;

            //            console.log(ability.length);

            ////同一次判断，只能触发一个技能
            ability.each(function (ob) {

                //                if (MyGameEngine.Random.Probability(0.99)) {
                //                    console.log("chufa!");

                //                    self.Use(ob.className); //触发技能

                //?待补充

                //触发对应的技能
                switch (ob.name) {
                    //                    case "Harvest":                                                                                                                                                                                                                                                                            
                    //                        if (MyGameEngine.Random.Probability(ob.probability)) {                                                                                                                                                                                                                                                                            
                    //                            //准备技能                                                                                                                                                                                                                                                                            
                    //                            self.__PrepareAbility(ob);                                                                                                                                                                                                                                                                            
                    //                            //产生技能效果                                                                                                                                                                                                                                                                            
                    //                            self.__Harvest(ob.value[0]);                                                                                                                                                                                                                                                                            
                    //                        }                                                                                                                                                                                                                                                                            
                    //                        break;                                                                                                                                                                                                                                                                            
                    case "暴击":
                        if (MyGameEngine.Random.Probability(ob.probability)) {
                            //初始化技能
                            if (self.__InitAbility(ob) === "break") {
                                break;
                            }
                            //使用技能，产生技能效果
                            self.__UseAbility(ob, self.__Crit, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[0] + add);

                            //提示技能效果，技能施放完毕后显示
                            self.__ShowAbilityEffectInfo(ob, ob.value[0] + add);
                        }
                        break;
                    case "迅捷":
                        if (MyGameEngine.Random.Probability(ob.probability)) {
                            //初始化技能
                            if (self.__InitAbility(ob) === "break") {
                                break;
                            }
                            //使用技能，产生技能效果
                            //Boss消方块速度增加值、持续时间按等级提升效果减半
                            self.__UseAbility(ob, self.__Fast, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[0] + add / 2, ob.value[1] + add, ob.value[2] + add / 2);

                            //提示技能效果，技能施放完毕后显示
                            self.__ShowAbilityEffectInfo(ob, ob.value[0] + add / 2, ob.value[1] + add, ob.value[2] + add / 2);
                        }
                        break;
                    case "蓄力一击":
                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0]) {
                            if (MyGameEngine.Random.Probability(ob.probability)) {
                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }
                                //使用技能，产生技能效果
                                self.__UseAbility(ob, self.__StrengthAttack, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[1] + add, ob.value[2] + add);

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob, ob.value[1] + add, ob.value[2] + add);
                            }
                        }
                        break;
                    case "火舞":
                        if (self.P_GetRemainNum() <= ob.value[0] && self.__remain_num - self.P_GetRemainNum() >= ob.value[1]) {
                            //根据玩家得分计算技能发动概率    
                            //参数为：玩家得分基数 初始概率 最低概率 每次减的概率
                            probability = self.__ComputeProbabilityByScore(1000, ob.probability, 0.1, 0.01);

                            if (MyGameEngine.Random.Probability(probability)) {
                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }
                                //使用技能，产生技能效果
                                //Boss消方块速度增加值、持续时间按等级提升效果减半
                                self.__UseAbility(ob, self.__FireDance, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[2] + add, ob.value[3] + add, ob.value[4] + add / 2, ob.value[5] + add / 2);

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob, ob.value[2] + add, ob.value[3] + add, ob.value[4] + add / 2, ob.value[5] + add / 2);
                            }
                        }
                        break;
                    default:
                        throw new Error("超出范围！");
                        break;
                }


                //                throw $break;   //退出循环
            });
        },
        //        //玩家消去方块时判断发动
        //        __OnPlayerElimination: function () {
        //        },
        //        //玩家连击时判断发动
        //        __OnPlayerDoubleHit: function () {
        //        },
        //        //玩家剩余方块大于boss剩余方块一定值时判断发动
        //        __OnPlayerFast: function () {
        //            //获得该事件可能会触发的技能
        //            var ability = this.__config.ability.filter(function (ob) {
        //                if (ob.When === "onPlayerFast") {
        //                    return ob;
        //                }
        //            });

        //            var self = this;

        //            //            console.log(ability.length);

        //            //同一次判断，只能触发一个技能
        //            ability.each(function (ob) {
        //                if (MyGameEngine.Random.Probability(ob.probability)) {
        //                    //?待补充

        //                    //触发对应的技能
        //                    switch (ob.name) {
        //                        case "Snipe":
        //                            self.__Snipe();
        //                            break;
        //                        default:
        //                            throw new Error("超出范围！");
        //                            break;
        //                    }


        //                    throw $break;   //退出循环
        //                }
        //            });
        //        },

        //        //玩家剩余方块大于boss剩余方块一定值时判断发动
        //        __OnBossFast: function () {
        //        },


        //        //初始化自定义事件
        //        __InitCustomEvent: function () {
        //            //            this.onStart = new Observer();
        //            //            this.onEnd = new Observer();
        //            //            this.onBossElimination = new Observer();
        //            //            this.onGameElimination = new Observer();
        //            //            this.onDoubleHit = new Observer();
        //            //            this.onStop = new Observer();
        //            //            var self = this;
        //            //?订阅事件     待补充
        //            //            this.onStart.Subscribe(this.__ai_player.OnStart);
        //            //            this.onEnd.Subscribe(this.__ai_player.OnEnd);
        //            //            this.onBossElimination.Subscribe(this.__OnBossElimination);

        //        },
        //刷新boss地图信息
        __RefreshBossMapInfo: function () {
            //更新剩余方块数
            $("#ai_remainNum").text(this.__remain_num);
        },
        //提示技能效果，技能施放完毕后显示
        __ShowAbilityEffectInfo: function (ob, _args) {
            var self = this;

            var args = null;

            if (operate.IsArray(_args) && arguments.length === 2 && _args.length > 1) {
                args = _args;
            }
            else {
                args = Array.prototype.slice.call(arguments, 1);
            }

            if (ob.big) {
                window.setTimeout(function () {
                    LianLianKan.UI_Info.ShowRightInfoFormat(ob.name + "技能产生效果：" + ob.systemInfo, -1, false, args);
                }, self.__boss_bigAbility_time * 1000 + 200);   //技能施放完毕后显示
            }
            else {
                if (self.__config.boss_smallAbility_time > 0) {
                    window.setTimeout(function () {
                        LianLianKan.UI_Info.ShowRightInfoFormat(ob.name + "技能产生效果：" + ob.systemInfo, -1, false, args);
                    }, self.__config.boss_smallAbility_time * 1000 + 200);  //技能施放完毕后显示
                }
                else {
                    LianLianKan.UI_Info.ShowRightInfoFormat(ob.name + "技能产生效果：" + ob.systemInfo, -1, false, args);
                }
            }
        },
        __ClearTimer: function () {
            //            window.clearInterval(this.__timer_timeLine);
            //            //            window.clearInterval(this.__timer_timeLine_player);
            //            window.clearTimeout(this.__timer_prop_stop);

            //            this.__timer_timeLine = 0;
            //            this.__timer_prop_stop = 0;

            var i = 0;

            //            this.P_ClearTimeout(this.__timer_prop_stop);
            //            this.P_ClearInterval(this.__timer_timeLine);

            //            this.P_ClearTimeout(this.__timer_addAttribute);
            //            this.P_ClearTimeout(this.__timer_subtractAttribute);

            //            //            this.P_ClearTimeout(this.__timer_init_smallAbility);

            //            //清除所有的大招计时器
            //            for (i = 0; i <= this.__init_bigAbility_index; i++) {
            //                this.P_ClearTimeout(this["__timer_init_bigAbility" + i.toString()]);
            //            }
            //            //清除所有的小技能施法计时器
            //            for (i = 0; i <= this.__init_smallAbility_index; i++) {
            //                this.P_ClearTimeout(this["__timer_init_smallAbility" + i.toString()]);
            //            }
            //            //清除所有的产生技能效果-大招计时器
            //            for (i = 0; i <= this.__use_bigAbility_index; i++) {
            //                this.P_ClearTimeout(this["__timer_use_bigAbility" + i.toString()]);
            //            }
            //            //清除所有的产生技能效果-小技能计时器
            //            for (i = 0; i <= this.__use_smallAbility_index; i++) {
            //                this.P_ClearTimeout(this["__timer_use_smallAbility" + i.toString()]);
            //            }
            //            //清除所有的技能计时器
            //            for (i = 0; i <= this.__bossAbility_index; i++) {
            //                this.P_ClearTimeout(this["__timer_bossAbility" + i.toString()]);
            //                this.P_ClearInterval(this["__interval_bossAbility" + i.toString()]);
            //            }


            //            console.log(LianLianKan.timer_firstIndex);
            //            console.log(this.__timer_timeLine);

            // 清空"所有"的定时器 
            //以第一个计时器序号为起始值（计时器的序号会递加，但是ie下每次刷新浏览器后计时器序号会叠加，
            //且最初的序号也不一定从1开始（可能比1大），也就是说ie下计时器序号的起始值可能很大；chrome和firefox计时器每次从1开始）
            for (i = LianLianKan.timer_firstIndex; i < LianLianKan.timer_firstIndex + 500; i++) {
                window.clearTimeout(i);
            }
            for (i = LianLianKan.timer_firstIndex; i < LianLianKan.timer_firstIndex + 500; i++) {
                window.clearInterval(i);
            }
        },
        //计算boss获得的经验值
        __Result_Experience: function (type) {

            //type:boss是否胜利
            //判断游戏难度时，根据this._difficulity_current判断

            var ex = 0;

            if (type === "win") {
                ex = -5;
            }
            else {
                ex = 10;
            }

            //当前游戏难度
            switch (this._difficulity_current) {
                case LianLianKan.Difficulity.Easy:
                    ex = ex - 5;
                    break;
                case LianLianKan.Difficulity.Normal:
                    ex = ex;
                    break;
                case LianLianKan.Difficulity.Hard:
                    ex = ex + 5;
                    break;
                default:
                    break;
            }

            return ex;
        },
        //计算等级
        __Result_Level: function () {
            var experience = this.__experience,
                level = 1;

            //?待修改
            if (experience < 10) {
                level = 1;
            }
            else if (experience < 30) {
                level = 2;
            }
            else if (experience < 60) {
                level = 3;
            }
            else if (experience < 100) {
                level = 4;
            }
            else {
                level = 5;
            }

            return level;
        },
        //游戏结束，显示数据
        __Show_Data: function (result) {
            var str = "";

            if (result.experience >= 0) {
                //                str = MyGameEngine.Base.FormatDelegate("<h2>Boss统计</h2><ul><li>{0}获得{1}经验值</li><li>{0}现在等级为{2}</li></ul>", this.__name, result.experience, result.level);
                str = MyGameEngine.Base.FormatDelegate("<p><h2>Boss统计</h2><ul><li>{0}获得{1}经验值</li><li>{0}现在等级为{2}</li></ul></p>", this.__name, result.experience, result.level);
            }
            else {
                str = MyGameEngine.Base.FormatDelegate("<p><h2>Boss统计</h2><ul><li>{0}扣除{1}经验值</li><li>{0}现在等级为{2}</li></ul></p>", this.__name, Math.abs(result.experience), result.level);
            }

            LianLianKan.UI_Info.ShowRightInfo($(str), -1, false);
            //            alert("经验值为" + this.__experience);
            //            alert("等级为" + this.__level);
        },
        //        //根据Boss的level，修正player的Boss类的config和__config

        //        //根据Boss的level，修正player的Boss类的config

        //根据Boss的level，修正__config
        __SetBossByLevel: function (reset) {
            //重新设置
            if (reset === true) {
                MyGameEngine.Base.Extend(this.__config, this.__ai_player.config);
            }

            switch (this.__level) {
                case 1:
                    break;
                case 2:
                case 3:
                case 4:
                    this.__config.time_speed += this.__level;
                    this.__config.ai_speed += this.__level / 10;
                    if (this.__config.addTime - 0.5 * (this.__level - 1) > 0) {
                        this.__config.addTime -= 0.5 * (this.__level - 1);
                    }
                    //小技能施放时间最小为LianLianKan.config.min_smallAbility_time秒
                    if (this.__config.boss_smallAbility_time - 0.1 * (this.__level - 1) > LianLianKan.config.min_smallAbility_time)
                        this.__config.boss_smallAbility_time -= 0.1 * (this.__level - 1)
                    break
                    //Boss达到5级时，属性大幅提升
                case 5:
                    this.__config.time_speed += 20;
                    this.__config.ai_speed += 1;
                    if (this.__config.addTime - 6 > 0) {
                        this.__config.addTime -= 6;
                    }
                    //小技能施放时间最小为LianLianKan.config.min_smallAbility_time秒
                    if (this.__config.boss_smallAbility_time - 1 > LianLianKan.config.min_smallAbility_time)
                        this.__config.boss_smallAbility_time -= 1
                    break
                default:
                    break;
            }
            //            MyGameEngine.Base.Extend(this.__config, this.__ai_player.config);
        },
        //更新当前Boss类数据（Player.js）
        /*
        不全部更新Boss类数据，因为有些数据不准确（如__config中的小技能施法时间等是动态变换的）。

        Boss类需要更新的数据有：
        experience
        level
        根据Boss的level，修正player的Boss类的config（这项在__SetBossByLevel中更新）
        */
        __RefreshCurrentBossPlayer: function () {
            //            //            var speed = this.__config.ai_speed;
            //            var player = this.__ai_player;
            //            //            console.log("Clone", speed);

            //            MyGameEngine.Base.Extend(player.config, this.__config);

            //            //如果设置了游戏难度，则使用游戏难度对应的ai_speed
            //            //            if (this.__difficulity) {
            //            //                this.__config.ai_speed = speed;
            //            //            }
            //            //            console.log("Clone", this.__config.ai_speed);
            //            //            //剩余方块数
            //            //            this.__remain_num = player.__remain_num;

            //            player.name = this.__name;
            //            //Boss经验值
            //            player.experience = this.__experience;
            //            //Boss等级
            //            player.level = this.__level;
            //            player.img = this.__img;    //未挑战成功的boss的头像
            //            player.img_gray = this.__img_gray;   //已挑战成功的boss的头像（灰色）
            //            player.minNum = this.__minNum;     //地图最小要求的方块数，如果为0则不限制地图
            //            player.minScore = this.__minScore;  //玩家需要获得该得分才可以挑战
            //            player.text = this.__text;    //boss说明
            //            //背景音乐就不更新了，因为背景音乐不会变

            //            player.index = this.__index;

            //只更新这两项
            this.__ai_player.experience = this.__experience;
            this.__ai_player.level = this.__level;

        },

        //设置玩家的属性
        __SetPlayerConfig: function () {
            //调用父类的保护方法，修改私有属性_config
            this.P_SetConfig({
                time_speed: this.__config.time_speed,
                addTime: this.__config.addTime
            });

            //            console.log(game_player.config.time_speed, this.__ai_player, this.__ai_player.config.time_speed);

            //            config.time_speed = this.__config.time_speed;
            //            config.addTime = this.__config.addTime;

            //            console.log(game_player.config.time_speed);
        },
        __JudgeMap: function () {
            var num = 0,
                mapIndex = 0,
                temp = null,
                temp_num = 0;

            //*判断当前地图是否符合要求（方块数是否符合要求）

            //地图要求的最低方块数
            num = this.__minNum;
            //            console.log(this.__index - 1, num);
            //num = 0表示不限制地图
            if (num !== 0) {
                if (this.__map.Map.mapIndex !== -1) {
                    //判断
                    if (DataSource_MapData[this.__map.Map.mapIndex].num < num) {
                        alert("您选择的地图不符合挑战该boss的条件！请选择方块数大于等于" + num + "的地图");
                        return "break";
                    }
                    mapIndex = this.__map.Map.mapIndex;
                }
                else {
                    //随机地图
                    //随机选择的地图要大于等于num

                    //获得方块数大于等于num的所有地图
                    temp = DataSource_MapData.filterWithIndex(function (el) {
                        //                        console.log(el.num);
                        if (el.num >= num) {
                            return el;
                        }
                    });
                    if (temp.length === 0) {
                        throw new Error("没有符合挑战该Boss条件的地图！");
                    }
                    //                    console.log(temp.length, temp);

                    //从中随机选一个地图
                    temp_num = MyGameEngine.Random._NToM(0, temp.length - 1);
                    //获得地图序号
                    mapIndex = temp[temp_num][0];
                }
            }
            else {
                if (this.__map.Map.mapIndex === -1) {
                    mapIndex = MyGameEngine.Random._NToM(0, DataSource_MapData.length - 1);
                }
                else {
                    mapIndex = this.__map.Map.mapIndex;
                }
            }
            return mapIndex;
        },
        //根据当前boss序号，修改对应的道具数量
        __EditPropNum: function () {
            //                _prop_findPath: 0,
            //        _prop_rearrangement: 0,
            //        _prop_bomb: 0,
            //        _prop_stop: 0,
            //        _prop_roadBlock: 0,
            var prop = {};

            //读取boss类的数据
            prop.prop_findPath = this.__config.prop_findPath;
            prop.prop_rearrangement = this.__config.prop_rearrangement;
            prop.prop_bomb = this.__config.prop_bomb;
            prop.prop_stop = this.__config.prop_stop;
            prop.prop_roadBlock = this.__config.prop_roadBlock;
            prop.prop_mirror = this.__config.prop_mirror;

            //调用保护方法
            this.P_SetPropNum(prop);

            //            console.log(this._propNum.prop_findPath);

            //            switch (this.__index) {
            //                case 1:
            //                    this._propNum._prop_findPath = 3;
            //                    this._propNum._prop_rearrangement = 3;
            //                    this._propNum._prop_bomb = 9;   //用于测试，待修改
            //                    this._propNum._prop_stop = 9;
            //                    this._propNum._prop_roadBlock = 9;
            //                    this._propNum._prop_mirror = 9;
            //                    break;
            //                case 2:
            //                    this._propNum._prop_findPath = 3;
            //                    this._propNum._prop_rearrangement = 3;
            //                    this._propNum._prop_bomb = 200;
            //                    this._propNum._prop_stop = 10;
            //                    this._propNum._prop_roadBlock = 10;
            //                    this._propNum._prop_mirror = 10;
            //                    break;
            //                case 3:
            //                    this._propNum._prop_findPath = 3;
            //                    this._propNum._prop_rearrangement = 3;
            //                    this._propNum._prop_bomb = 200;
            //                    this._propNum._prop_stop = 10;
            //                    this._propNum._prop_roadBlock = 10;
            //                    this._propNum._prop_mirror = 10;
            //                    break;
            //                case 4:
            //                    this._propNum._prop_findPath = 3;
            //                    this._propNum._prop_rearrangement = 3;
            //                    this._propNum._prop_bomb = 200;
            //                    this._propNum._prop_stop = 10;
            //                    this._propNum._prop_roadBlock = 10;
            //                    this._propNum._prop_mirror = 10;
            //                    break;
            //                case 5:
            //                    this._propNum._prop_findPath = 3;
            //                    this._propNum._prop_rearrangement = 3;
            //                    this._propNum._prop_bomb = 200;
            //                    this._propNum._prop_stop = 10;
            //                    this._propNum._prop_roadBlock = 10;
            //                    this._propNum._prop_mirror = 10;
            //                    break;
            //                case 6:
            //                    this._propNum._prop_findPath = 3;
            //                    this._propNum._prop_rearrangement = 3;
            //                    this._propNum._prop_bomb = 200;
            //                    this._propNum._prop_stop = 10;
            //                    this._propNum._prop_roadBlock = 10;
            //                    this._propNum._prop_mirror = 10;
            //                    break;
            //                default:
            //                    throw new Error("boss序号超出范围！");
            //                    break;
            //            }
            //            //调用保护方法
            //            this.P_SetPropNum(prop);
        },
        //技能前置判断
        __PreJudgmentAbility: function (ob) {
            //            console.log("__PreJudgmentAbility ", "this.__boss_beginAbility = ", this.__boss_beginAbility);
            //            console.log("__PreJudgmentAbility ", "this.P_bigAbility = ", this.P_bigAbility);
            //            console.log("ob.flag = ", ob.flag);



            //如果已经在施放技能了，则不能同时施放另外一个技能
            if (this.__boss_beginAbility === true || this.P_bigAbility === true) {
                return "break";
            }
            else {
                //效果不叠加
                //判断正处于技能持续时间中的标志
                if (ob.flag === true) {
                    return "break";
                }
                else if (ob.flag === false) {
                    ob.flag = true;
                    return "continue";
                }
            }
        },
        //技能持续时间结束后调用的委托
        __TimeOut_UseAbility: function (ob, info) {
            var name = ob.name;


            //此处直接修改this.__config.ability中对应技能的flag！
            //如果修改传入的ob的flag，则实际上this.__config.ability中对应技能的flag并没有被修改到！

            var ability = this.__config.ability.filter(function (el) {
                if (el.name === name) {
                    return el;
                }
            });


            if (ability[0].flag !== undefined) {
                //                ob.flag = false;
                ability[0].flag = false;
            }
            if (info === undefined) {
                LianLianKan.UI_Info.ShowRightInfo(ob.name + "效果结束。", -1, false);
            }
            else {
                LianLianKan.UI_Info.ShowRightInfo(info, -1, false);
            }

            //            console.log("__TimeOut_UseAbility    ability[0].flag =", ability[0].flag);
        },
        //        //施放完毕时调用的委托
        //        __TimeOut_InitAbility: function (ob) {
        //            LianLianKan.UI_Info.ShowRightInfo(ob.name + "效果不能叠加！", -1, false);
        //        },
        __OnClickProp: function () {
        },
        /*根据玩家得分计算技能发动概率    
        参数为：玩家得分基数 初始概率 最低概率 每次减的概率
        例如：
        玩家得分为23000分，
        则调用__ComputeProbabilityByScore(10000, 1, 0.5, 0.1)的结果为
        0.8(1 - 0.1 - 0.1)
        */

        //origin:原始概率
        //min:最小概率
        //minus:每次减少的概率
        __ComputeProbabilityByScore: function (scoreBase, origin, min, minus) {
            var score = 0,
                probability = 0;

            //如果原始概率小于最小概率，则报错
            if (origin < min) {
                throw new Error("原始概率不能小于最小概率！");
            }

            //获得玩家得分
            score = LianLianKan.score;
            probability = origin;

            score -= scoreBase;
            while (score >= 0) {
                probability = probability - minus < min ? min : probability - minus;
                score -= scoreBase;
            }

            return probability;
        },
        //使用技能(小技能在施法结束后产生技能效果；大招在__boss_bigAbility_time * 1000秒后产生效果)
        __UseAbility: function (ob, func, _val) {
            //获得参数
            var value = Array.prototype.slice.call(arguments, 2);

            var self = this;

            var val = _val ? _val : [];

            if (ob.big) {
                (function (i) {
                    self["__timer_use_bigAbility" + i.toString()] = window.setTimeout(function () {
                        //产生技能效果
                        func && func.apply(self, value);
                    }, self.__boss_bigAbility_time * 1000);
                    self.__use_bigAbility_index += 1;

                } (this.__use_bigAbility_index));
            }
            else {
                //                console.log("__UseAbility this.__config.boss_smallAbility_time = ", this.__config.boss_smallAbility_time);
                if (this.__config.boss_smallAbility_time > 0) {
                    (function (i) {
                        self["__timer_use_smallAbility" + i.toString()] = window.setTimeout(function () {
                            //产生技能效果
                            func && func.apply(self, value);
                        }, self.__config.boss_smallAbility_time * 1000);

                        self.__use_smallAbility_index += 1;

                    } (this.__use_smallAbility_index));
                }
                else {
                    //产生技能效果
                    func && func.apply(self, value);
                }
            }
        },
        //*道具/技能对boss的影响

        //增加方块num_pair对
        __Boss_AddBlock: function (num_pair) {
            var already_add = 0;
            var temp = 0, i = 0, j = 0, len = 0, double = 0;
            var M = this.__map.Map.map;
            var imgs = [];
            var num = num_pair * 2;
            //            if (num % 2 !== 0) {
            //                throw new Error("num要为偶数！");
            //            }

            //如果空格数小于num，则不能增加
            if ((this.__remain_num + num) > this.__map.Map.col * this.__map.Map.row) {
                //                console.log("空格数小于" + num.toString() + "，不能增加了！");
                LianLianKan.UI_Info.ShowRightInfo("空格数小于" + num.toString() + "，不能增加了！", -1);
                return;
            }

            //置标志位
            LianLianKan.boss_addBlock_flag = true;


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
                i = operate.Random._NToM(0, this.__map.Map.row - 1);
                j = operate.Random._NToM(0, this.__map.Map.col - 1);

                if (M[i][j].img === 0) {
                    M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp' width=" + LianLianKan.config.SMALLWIDTH.toString()
                    + "px height=" + LianLianKan.config.SMALLHEIGHT.toString() + "px onmousedown='operate.PreventDefault();'/>");
                    M[i][j].img = imgs[temp];

                    //                            double = double === 0 ? 1 : 0;  //是否

                    //                            already_add += 1;

                    //                            if (already_add == num) {
                    //                                break outer;
                    //                            }

                    temp += 1;
                }
            }
            //剩余方块数增加already_add（实际增加的方块数）
            this.__remain_num += num;

            this.__RefreshBossMapInfo();
        },
        //        //消去方块num_pair对
        //        __Boss_Elimination: function (num_pair) {
        //            while (num_pair > 0) {
        //                this.__algorithm.FindPath();
        //                //            this.__algorithm.Elimination(this.__algorithm.clue_block_arr[0], this.__algorithm.clue_block_arr[1]);
        //                this.__algorithm.Elimination();


        //                //刷新剩余方块数
        //                this.__remain_num -= 2;

        //                //                //隐藏当前选中效果层
        //                //                common.HideDiv(this.__map.select_div);


        //                //                //                //如果消去提示框的方块，则隐藏提示框
        //                //                //                if (LianLianKan.Operate_Single.clueLine_click_flag == 1) {
        //                //                //                    common.HideDiv(LianLianKan.UI_CommonMap.clueLine.children("div"));

        //                //                //                    LianLianKan.Operate_Single.clueLine_click_flag = 0;
        //                //                //                }

        //                //                //计时器加时间
        //                //                LianLianKan.Operate_Single.GetPlayer().gameInfo.timeLine -= LianLianKan.config.addTime;

        //                //                //判断是否为连击
        //                //                LianLianKan.Operate_Single.JudgeDoubleHit();

        //                //刷新boss地图信息
        //                this.__RefreshBossMapInfo();


        //                //判断是否胜利
        //                if (this.__remain_num <= 0) {
        //                    this.GameOver("win");
        //                    return;
        //                }
        //                //消去方块后，判断是否无解，如果无解，自动重列
        //                //                if (this.__algorithm.IsNoPath(this.__remain_num)) {
        //                //                    LianLianKan.UI_Info.ShowRightInfo("使用重列道具");
        //                //                    this.__Boss_Rearrangement();
        //                ////                    return;
        //                //                }
        //                //

        //                //此处改用循环，直到找到路径才继续
        //                while (this.__algorithm.IsNoPath(this.__remain_num)) {
        //                    LianLianKan.UI_Info.ShowRightInfo("使用重列道具");
        //                    this.__Boss_Rearrangement();
        //                    //                    return;
        //                }

        //                num_pair -= 1;
        //            }
        //            return false;
        //        },

        //消去方块num_pair对（消去相同的方块，不判断是否可连接）
        __Boss_Elimination: function (num_pair) {
            if (this.__remain_num > 0) {
                while (num_pair > 0) {
                    //                //如果重列，则要重新寻路
                    //                if (this._rearrangement_flag) {
                    //                    this.__algorithm.clue_block_arr = [];
                    //                    this._rearrangement_flag = false;   //还原标志
                    //                }
                    //                this.__algorithm.FindPath();

                    //找到相同的一对方块
                    this.__algorithm.FindBlock();
                    //                this.__algorithm.ShowLine(this.__algorithm.clue_block_arr[0], this.__algorithm.clue_block_arr[1]);
                    //                //显示爆炸
                    //                this.__algorithm.ShowBoom(this.__algorithm.common_block_arr[0], this.__algorithm.common_block_arr[1]);
                    this.__algorithm.Elimination(this.__algorithm.common_block_arr[0], this.__algorithm.common_block_arr[1]);

                    //刷新剩余方块数
                    this.__remain_num -= 2;

                    //                //隐藏当前选中效果层
                    //                common.HideDiv(this._map.select_div);

                    //                //计时器加时间
                    //                this.__timeLine -= this.__config.addTime;

                    //                //判断是否为连击
                    //                if (this.JudgeDoubleHit()) {
                    //                    this._AddDoubleHit();
                    //                }

                    //刷新boss地图信息
                    this.__RefreshBossMapInfo();

                    //                //*发布所有事件

                    //判断是否胜利
                    if (this.__remain_num <= 0) {
                        //                    this.GameOver("win");
                        return;
                    }
                    //                //判断是否无解并提示。
                    //                //消去一对方块后判断。
                    //                if (num_pair === 1) {
                    //                    if (this.__algorithm.IsNoPath(this.__remain_num)) {
                    //                        LianLianKan.UI_Info.ShowInfo("无解！请使用重列或者炸弹道具");
                    //                        return;
                    //                    }
                    //                }
                    //                else {  //消去多对方块（>1）的话，要循环判断，直到找到路径
                    //                    while (this.__algorithm.IsNoPath(this.__remain_num)) {
                    //                        //                        LianLianKan.UI_Info.ShowRightInfo("使用重列道具");
                    //                        this._Single_Rearrangement();
                    //                    }
                    //                }

                    num_pair -= 1;
                }
            }
            return false;
        },
        /* 备忘录模式！ */

        //*发起人放到这里

        __CreateMemento: function (attribute) {
            return new Memento(attribute);
        },
        __RestoreMemento: function (memento) {
            var attribute = memento.GetAttribute();
            var name = "",
                temp_name = "";

            for (name in attribute) {
                if (attribute.hasOwnProperty(name)) {
                    temp_name = "__" + name;

                    if (!operate.IsObject(attribute[name])) {
                        this[temp_name] = attribute[name];
                    }
                    else {
                        this[temp_name] = MyGameEngine.Base.Extend({}, attribute[name]);
                    }
                }
            }

            //删除备忘录引用，等待cg回收
            memento = null;
        },


        //备忘录管理员容器
        //因为Boss的每个需要备份还原（持续时间）的技能使用一个单例的备份管理员。
        __arr_caretaker: [],
        //获得备忘录管理员
        //name:技能名
        __GetCaretaker: function (name) {
            //技能名前面加上当前Boss姓名作为前缀
            var name = this.__name + "_" + name;

            //如果不存在，则创建
            if (!this[name]) {
                this[name] = new Caretaker(name);
                this.__arr_caretaker.push(this[name]);  //加入数组中，用于在GameOver中清除备忘录管理员和备忘录(调用__Dispose_Caretaker())
            }
            return this[name];
        },
        //清除备忘录管理员和备忘录
        __Dispose_Caretaker: function () {
            var i = 0,
                len = 0;

            for (i = 0, len = this.__arr_caretaker.length; i < len; i++) {
                this.__arr_caretaker[i].Dispose();
            }
        },

        //*备份封装
        __Backup: function (attribute, name) {
            //创建备忘录管理员
            var caretaker = this.__GetCaretaker(name);

            //创建一个备忘录
            caretaker.SetMemento(this.__CreateMemento(attribute));

            return caretaker;
        },





        //加属性
        __Boss_AddAttribute: function (attribute) {
            var name = "",
                property = "",
                temp = [],
                    temp_name = "",
                i = 0,
                len = 0,
                self = this;
            //                args = _args ? _args : [];

            //            //置标志位
            //            LianLianKan.boss_addAttribute_flag = true;



            for (name in attribute) {
                if (attribute.hasOwnProperty(name)) {
                    temp_name = "__" + name;

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
                        //                        //                        temp.push([temp_name, MyGameEngine.Base.Extend({}, this[temp_name])]);

                        //                        //                        MyGameEngine.Base.Extend(this[temp_name], attribute[name]);
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
            //                //                  (function (temp) {
            //                this.__timer_addAttribute = window.setTimeout(function () {
            //                    for (i = 0, len = temp.length; i < len; i++) {
            //                        //                                                console.log("temp[i][0] =", temp[i][0], "config =", self._config, "temp =", temp[i][1]);
            //                        self[temp[i][0]] = temp[i][1];
            //                        //置备份为空
            //                        self[temp[i][0] + "_copy_add"] = null;

            //                        //复位标志
            //                        LianLianKan.boss_addAttribute_flag = false;

            //                        //                        if (args === undefined){
            //                        //                            args = [];
            //                        //                        }


            //                        //                        console.log(this._config, temp);
            //                        //                        console.log(self._config, self[temp[i][0]]);
            //                    }

            //                    //调用委托
            //                    func && func.apply(self, args);
            //                }, time * 1000);
            //                //            } (temp));
            //            }
        },
        //减属性
        __Boss_SubtractAttribute: function (attribute) {
            var name = "",
                property = "",
                temp = [],
                    temp_name = "",
                i = 0,
                len = 0,
                self = this;
            //            args = _args ? _args : [];

            //            //置标志位
            //            LianLianKan.boss_substractAttribute_flag = true;

            for (name in attribute) {
                if (attribute.hasOwnProperty(name)) {
                    temp_name = "__" + name;

                    if (operate.IsNotObject(attribute[name])) {
                        //                        //增加新属性用来备份原始值，如果备份存在，则不修改备份，防止原始值被修改。
                        //                        if (!this[temp_name + "_copy_subtract"]) {
                        //                            this[temp_name + "_copy_subtract"] = this[temp_name];
                        //                        }
                        //                        temp.push([temp_name, this[temp_name + "_copy_subtract"]]);    //保存属性名和原始值，用于还原

                        //要大于0
                        this[temp_name] = this[temp_name] > attribute[name] ? this[temp_name] - attribute[name] : this[temp_name];
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
            //                this.__timer_subtractAttribute = window.setTimeout(function () {
            //                    for (i = 0, len = temp.length; i < len; i++) {
            //                        //                                                console.log("temp[i][0] =", temp[i][0], "config =", self._config, "temp =", temp[i][1]);
            //                        self[temp[i][0]] = temp[i][1];
            //                        //置备份为空
            //                        self[temp[i][0] + "_copy_subtract"] = null;

            //                        //复位标志
            //                        LianLianKan.boss_substractAttribute_flag = false;

            //                        //                        console.log(this._config, temp);
            //                        //                        console.log(self._config, self[temp[i][0]]);
            //                    }

            //                    //调用委托
            //                    func && func.apply(self, args);
            //                }, time * 1000);
            //                //            } (temp));
            //            }
        },
        //禁手
        __Boss_Stop: function (time) {
            var second = time ? time : 5,   //默认为5秒
                self = this;

            //重复使用禁手道具，会刷新禁手时间
            if (this.__timer_prop_stop) {
                //                window.clearTimeout(this.__timer_prop_stop);
                //                this.__timer_prop_stop = 0;
                this.P_ClearTimeout(this.__timer_prop_stop);
            }

            //            //boss状态为禁手
            //            LianLianKan.bossStatus = LianLianKan.BossStatus.Stop;
            //            this.__stop_flag = true;

            //            LianLianKan.bossStatus = LianLianKan.BossStatus.Stop;
            LianLianKan.boss_stop_flag = true;

            LianLianKan.UI_Info.ShowRightInfo("Boss被禁手" + second + "秒", -1);
            //            this.RemoveEvent();

            //            $(this.__map.Map.table).find("td").unbind("mousedown");

            this.__timer_prop_stop = window.setTimeout(function () {
                //                $(this.__map.Map.table).find("td").bind("mousedown", function () {
                //                    LianLianKan.Operate__Operate.Mousedown($(this));
                //                });

                //                self._InitMapEvent();
                LianLianKan.UI_Info.ShowRightInfo("Boss禁手状态解除", -1);

                //恢复boss状态
                //                LianLianKan.bossStatus = LianLianKan.BossStatus.None;
                LianLianKan.boss_stop_flag = false;
                //                this.__stop_flag = false;
            }, second * 1000);
        },
        //反向
        __Boss_Reverse: function () {
            var row = this.__map.Map.row;

            //遍历前一半的列。如果this.__map.Map.col为奇数，则中间的列不用对调
            var col = Math.floor(this.__map.Map.col / 2);
            var i = 0, j = 0,
                    temp_img = "",
                    temp_number = 0,
                    M = this.__map.Map.map;
            //相反位置的方块
            var opposite = null;

            //            //此处要隐藏效果层，否则会出现问题
            //            common.HideDiv(this.__map.line.children("div"));

            for (i = 0; i < row; i++) {
                for (j = 0; j < col; j++) {
                    /*  这个有问题！
                    M[i][j]改变后，temp也改变了！所以达不到预期的效果！

                    temp = M[i][j];
                    opposite = M[i][this.__map.Map.col - j - 1];
                    M[i][j].html(opposite.html());
                    M[i][j].img = opposite.img;

                    opposite.html(temp.html());
                    opposite.img = temp.img;
                    */

                    //与相反位置的方块对调
                    temp_img = M[i][j].html();
                    temp_number = M[i][j].img;

                    opposite = M[i][this.__map.Map.col - j - 1];
                    M[i][j].html(opposite.html());
                    M[i][j].img = opposite.img;

                    opposite.html(temp_img);
                    opposite.img = temp_number;
                }
            }
        },
        //重列
        __Boss_Rearrangement: function () {
            var i = 0, j = 0,
                    M = this.__map.Map.map,
                    imgs = [],
                    temp = null,
                    len = 0;

            //获得当前剩余方块的序号
            for (var i = 0; i < this.__map.Map.row; i++) {
                for (var j = 0; j < this.__map.Map.col; j++) {
                    if (M[i][j].img === 0) {
                        continue;
                    }

                    imgs.push(M[i][j].img);
                }
            }

            len = this.__remain_num;
            //打乱数组（__remain_num次）
            for (i = 0; i < len; i++) {
                j = parseInt(Math.random() * len);
                temp = imgs[i];
                imgs[i] = imgs[j];
                imgs[j] = temp;
            }

            temp = 0;

            //重置方块
            for (var i = 0; i < this.__map.Map.row; i++) {
                for (var j = 0; j < this.__map.Map.col; j++) {
                    if (M[i][j].img === 0) {
                        continue;
                    }

                    M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp' width=" + LianLianKan.config.SMALLWIDTH.toString()
                    + "px height=" + LianLianKan.config.SMALLHEIGHT.toString() + "px onmousedown='operate.PreventDefault();'/>");
                    M[i][j].img = imgs[temp];

                    temp += 1;
                }
            }

            //重新寻路
            this.__algorithm.clue_block_arr = [];
        },

        //*道具

        //?待补充（加声音等）

        //路障
        __RoadBlock: function (num_pair) {
            this.__Boss_AddBlock(num_pair);  //增加10对方块
        },
        //镜子
        __Mirror: function () {
            this.__Boss_Reverse();
        },
        //禁手
        __Stop: function (time) {
            this.__Boss_Stop(time);
        },


        //*技能
        //根据boss等级，提升技能威力


        //        //**农民伯伯技能

        //        //丰收
        //        __Harvest: function (val) {
        //            //            this.P_Single_AddAttribute({ score: val }, -1);
        //            //玩家获得的得分加val
        //            this.P_currentScore += val;
        //            //显示技能图片

        //            //Boss说话

        //            //显示系统信息


        //            //            this.P_Single_SubtractAttribute({ score: 200 }, 0);
        //            //                        this.P_Single_AddAttribute({ config: { time_speed: 2, addTime: 2} }, 3);
        //            //                        this.P_Single_SubtractAttribute({ config: { time_speed: 1, addTime: 1} }, 5);
        //            //?待补充

        //            //大招暂停

        //            //判断是否为大招（播放声音、显示信息/图片）

        //            //如果不是大招，则播放普通声音，显示信息/图片

        //            //如果技能有限制逻辑，此处添加（如“技能效果持续10s 效果不能叠加 只有效果消失后，才可能再使用该技能”）

        //            //大招恢复
        //        },


        //        //**火枪狙击手技能

        //        //狙击
        //        __Snipe: function (num_pair) {
        //            this.P_Single_AddBlock(num_pair);
        //        },

        //        //**屠夫技能

        //        //肢解
        //        __Dismember: function (time) {
        //            //禁手
        //            this.P_Single_Stop(time);
        //            //?大招
        //        },

        //        //**复仇之魂技能

        //        //吼叫
        //        __Roar: function (value, time) {
        //            //           console.log("__Roar");
        //            //不重复加属性
        //            if (!LianLianKan.boss_addAttribute_flag) {
        //                //               console.log(this.__config.ai_speed);
        //                //加boss消方块速度
        //                this.__Boss_AddAttribute({ config: { ai_speed: value} }, time, function () {
        //                    //刷新速度
        //                    this.__RefreshSpeed();
        //                });
        //                //刷新速度
        //                this.__RefreshSpeed();
        //                //            console.log(this.__config.ai_speed);
        //            }
        //        },
        //        //干扰
        //        __Distorb: function () {
        //            //玩家重列方块
        //            this.P_Single_Rearrangement();
        //            //?大招
        //        },


        //**小矮人技能

        //逃跑
        //玩家获胜，但是挑战不成功
        __Escape: function (func) {
            var experience = 0,
                level = 0;



            //            //效果不叠加
            //            //判断正处于技能持续时间中的标志
            //            if (ob.flag === true) {
            //                LianLianKan.UI_Info.ShowRightInfo(ob.name + "效果不能叠加", -1, false);
            //                return;
            //            }
            //            else {
            //                if (ob.flag !== undefined) {
            //                    ob.flag = true;
            //                }

            //发布OnEnd事件
            this.__ai_player.OnEnd("好汉不吃眼前亏！我闪~");
            //清除ai消方块的计时器
            this.ClearTimer();
            //            //type反向，因为电脑赢，即是玩家输。
            //            type = _type === "win" ? "lose" : "win";

            //boss获得的经验值
            //            experience = this.__Result_Experience("win");
            //            experience = 10;
            this.__experience += 10;

            //判断boss等级
            level = this.__Result_Level();
            this.__level = level;

            //            //根据Boss的level，修正player的Boss类的config和__config
            //            this.__SetBossByLevel();

            //            //判断是否挑战成功且该boss之前没有被挑战成功，则改变boss_index
            //            if (type === "win" && this.__index > LianLianKan.boss_index) {
            //                LianLianKan.boss_index += 1;
            //            }

            LianLianKan.UI_Info.ShowRightInfo("挑战失败", -1);
            this.__Show_Data({ experience: experience, level: level });

            //更新Boss类的数据
            this.__RefreshCurrentBossPlayer();

            //            //根据Boss的level，修正player的Boss类的config
            //            this.__SetBossByLevel();


            //            this.__Clone(this.__ai_player);
            //            //根据游戏难度修正boss属性
            //            this.__SetByDifficulity(LianLianKan.difficulity, true);


            //            console.log("LianLianKan.score = ", LianLianKan.score);
            //                        this.base(type);
            /* 
            此处不用“this.base(type);”！
            因为上面调用“this.ClearTimer();”时，ClearTimer中调用了“this.base()”，已经将base指向了ClearTimer
            （即“return parentClass.prototype[name].apply(parentClass.prototype, arguments);”中的name为“ClearTimer”而不是“GameOver”）
            。
            所以如果此处用“this.base(type);”，实际上是调用父类（Operate_Single）中的ClearTimer方法！
            */

            //            var t = this.prototype;
            //            var m = this;

            //刷新boss信息
            this.ShowInfo();

            //玩家胜利
            this.baseClass.GameOver.call(this, "win");


            //                //如果标志存在，则重置
            //                if (ob.flag !== undefined) {
            //                    ob.flag = false;
            //                }

            //            }

        },

        //防护
        __Protect: function (func, time) {
            var self = this;

            //            //效果不叠加
            //            //判断正处于技能持续时间中的标志
            //            if (ob.flag === true) {
            //                LianLianKan.UI_Info.ShowRightInfo(ob.name + "效果不能叠加", -1, false);
            //                return;
            //            }
            //            else {
            //                if (ob.flag !== undefined) {
            //                    ob.flag = true;
            //                }

            this.__boss_protectedByNoProp = true;

            if (time > 0) {
                (function (i) {

                    self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
                        self.__boss_protectedByNoProp = false;

                        //                            //如果标志存在，则重置
                        //                            if (ob.flag !== undefined) {
                        //                                ob.flag = false;
                        //                            }

                        //调用委托
                        func && func();

                        //                        LianLianKan.UI_Info.ShowRightInfo("防护效果结束。现在玩家可以使用道具攻击Boss了", -1, false);
                    }, time * 1000);

                    self.__bossAbility_index += 1;

                } (this.__bossAbility_index));
            }
            else {
                this.__boss_protectedByNoProp = false;
            }
            //            }
        },

        //符文攻击
        __RuneAttack: function (func, time_speed, addTime, time) {
            var self = this,
            caretaker = null;



            //            //效果不叠加
            //            //判断正处于技能持续时间中的标志
            //            if (ob.flag === true) {
            //                LianLianKan.UI_Info.ShowRightInfo("符文攻击效果不能叠加", -1, false);
            //                return;
            //            }
            //            else {
            //                //正处于技能持续时间中
            //                ob.flag = true;

            //玩家禁止使用道具
            this.__player_noProp = true;

            //*备份
            caretaker = this.__Backup({ config: this.__config }, "RuneAttack");

            //            //玩家计时器加速，消去方块加的时间减少
            //            this.P_Single_AddAttribute({ config: { time_speed: time_speed, addTime: addTime} });

            //玩家计时器加速，消去方块加的时间减少
            this.__Boss_AddAttribute({ config: { time_speed: time_speed, addTime: addTime} });
            //改变玩家操作类属性
            this.__SetPlayerConfig();
            //刷新玩家计时器速度
            this.P_RefreshTimeLine();

            if (time > 0) {
                //技能有效期到后，重置并显示提示信息
                (function (i, caretaker) {
                    self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
                        self.__player_noProp = false;

                        //恢复上一个备忘录
                        self.__RestoreMemento(caretaker.GetMemento());

                        //恢复玩家操作类属性
                        self.__SetPlayerConfig();

                        //刷新玩家计时器
                        self.P_RefreshTimeLine();

                        //调用委托
                        func && func();

                    }, time * 1000);

                    self.__bossAbility_index += 1;

                } (this.__bossAbility_index, caretaker));
            }
            else {
                this.__player_noProp = false;
            }
            //            }
        },

        //群雷轰击
        //效果可叠加
        __Thunder: function (func, prompt_num_pair, interval__num_pair, interval, time) {
            var self = this;

            //间隔时间最小为1s
            interval = interval >= 1 ? interval : 1;

            //立刻消去prompt_num_pair对方块
            this.__Boss_Elimination(prompt_num_pair);
            //            LianLianKan.UI_Info.ShowRightInfo("Boss消去了" + prompt_num_pair + "对方块", -1, false);

            //每隔interval消去interval__num_pair对方块，持续time
            (function (time, interval, i) {

                self["__interval_bossAbility" + i.toString()] = window.setInterval(function () {
                    //                    console.log("time = " + time);


                    self.__Boss_Elimination(interval__num_pair);

                    LianLianKan.UI_Info.ShowRightInfo("Boss消去了" + interval__num_pair + "对方块", -1, false);

                    time -= interval;

                    if (time <= 0) {
                        //                        window.clearInterval(self.__timer_init_bigAbility1);
                        //                        self.__timer_init_bigAbility1 = 0;
                        self.P_ClearInterval(self["__interval_bossAbility" + i.toString()]);    //清除本次大招的效果

                        //                        LianLianKan.UI_Info.ShowRightInfo("群雷轰击效果结束", -1, false);

                        //调用委托
                        func && func();

                        return;
                    }
                }, interval * 1000);

                //                this.__bossAbility_index += 1;


                //                //因为效果可叠加，所以大招计时器会有多个
                //                self["__timer_init_bigAbility" + i.toString()] = window.setInterval(function () {
                //                    //                    console.log("time = " + time);
                //                    if (time <= 0) {
                //                        //                        window.clearInterval(self.__timer_init_bigAbility1);
                //                        //                        self.__timer_init_bigAbility1 = 0;
                //                        self.P_ClearInterval(self["__timer_init_bigAbility" + i.toString()]);    //清除本次大招的效果

                //                        LianLianKan.UI_Info.ShowRightInfo("群雷轰击技能效果结束", -1, false);
                //                    }

                //                    self.__Boss_Elimination(interval__num_pair);

                //                    LianLianKan.UI_Info.ShowRightInfo("Boss消去了" + interval__num_pair + "对方块", -1, false);

                //                    time -= interval;
                //                }, interval * 1000);

                self.__bossAbility_index += 1;  //此处要让this.__init_bigAbility_index加1，而不是让i加1！

            } (time, interval, this.__bossAbility_index));
        },



        //**花仙女技能

        //回春
        //        __Resume: function (func, value, time) {
        //            var self = this;

        //            //            console.log("__Resume");

        //            //            //效果不叠加
        //            //            //判断正处于技能持续时间中的标志
        //            //            if (ob.flag === true) {
        //            //                LianLianKan.UI_Info.ShowRightInfo("回春效果不能叠加", -1, false);
        //            //                return;
        //            //            }
        //            //            else {
        //            //                ob.flag = true;

        //            //            //不重复加属性
        //            //            if (!LianLianKan.boss_addAttribute_flag) {
        //            //解除禁手状态
        //            LianLianKan.boss_stop_flag = false;
        //            //玩家不能使用攻击道具
        //            this.__boss_protectedByNoProp = true;

        //            //加boss消方块速度
        //            this.__Boss_AddAttribute({ config: { ai_speed: value} }, time, function () {
        //                //刷新速度
        //                this.__RefreshSpeed();
        //            });
        //            //刷新速度
        //            this.__RefreshSpeed();


        //            //                //技能有效期到后，显示提示信息
        //            //                window.setTimeout(function () {
        //            //                    LianLianKan.UI_Info.ShowRightInfo("回春效果结束", -1, false);
        //            //                }, time * 1000);

        //            //技能有效期到后，重置并显示提示信息
        //            (function (i) {
        //                self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
        //                    self.__boss_protectedByNoProp = false;

        //                    //                        if (ob.flag !== undefined)

        //                    //                    LianLianKan.UI_Info.ShowRightInfo("回春效果结束。", -1, false);
        //                    //调用委托
        //                    func && func();
        //                }, time * 1000);

        //                self.__bossAbility_index += 1;

        //            } (this.__bossAbility_index));
        //            //            }
        //            //            else {
        //            //                LianLianKan.UI_Info.ShowRightInfo("回春效果不能叠加", -1, false);
        //            //            }
        //            //            }
        //        },


        //回春
        __Resume: function (func, value, time) {
            var self = this,
            //                attribute = null,
                caretaker = null;

            //解除禁手状态
            LianLianKan.boss_stop_flag = false;
            //玩家不能使用攻击道具
            this.__boss_protectedByNoProp = true;


            //*备份

            //            attribute = { config: this.__config };
            //            //创建备忘录管理员
            //            caretaker = this.__GetCaretaker("Resume");
            //            //创建一个备忘录
            //            caretaker.SetMemento(this.__CreateMemento(attribute));

            caretaker = this.__Backup({ config: this.__config }, "Resume");


            //加boss消方块速度
            this.__Boss_AddAttribute({ config: { ai_speed: value} });

            //            console.log("增加后　ai_speed = " + self.__config.ai_speed);


            //            this.__Boss_AddAttribute({ config: { ai_speed: value} }, time, function () {
            //                //刷新速度
            //                this.__RefreshSpeed();
            //            });
            //刷新速度
            this.__RefreshSpeed();

            //技能有效期到后，重置并显示提示信息
            (function (i, caretaker) {
                self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
                    self.__boss_protectedByNoProp = false;

                    //                    //复位标志
                    //                    LianLianKan.boss_addAttribute_flag = false;

                    //恢复上一个备忘录
                    self.__RestoreMemento(caretaker.GetMemento());
                    //                    console.log("恢复后 ai_speed = " + self.__config.ai_speed);
                    //刷新速度
                    self.__RefreshSpeed();

                    //调用委托
                    func && func();
                }, time * 1000);

                self.__bossAbility_index += 1;

            } (this.__bossAbility_index, caretaker));
        },



        //迅捷
        __Fast: function (func, value, abilityTime, time) {
            var self = this,
                caretaker = null;

            //            console.log(this.__config.ai_speed);

            //*备份
            caretaker = this.__Backup({ config: this.__config }, "Fast");

            //加boss消方块速度
            this.__Boss_AddAttribute({ config: { ai_speed: value} });
            //刷新速度
            this.__RefreshSpeed();

            //小技能最小施法时间为LianLianKan.config.min_smallAbility_time秒
            if (this.__config.boss_smallAbility_time - abilityTime >= LianLianKan.config.min_smallAbility_time) {
                this.__config.boss_smallAbility_time -= abilityTime;
            }


            //技能有效期到后，重置并显示提示信息
            (function (i, caretaker) {
                self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
                    self.__config.boss_smallAbility_time = self.__ai_player.config.boss_smallAbility_time;

                    //恢复上一个备忘录
                    self.__RestoreMemento(caretaker.GetMemento());
                    //刷新速度
                    self.__RefreshSpeed();
                    //调用委托
                    func && func();
                }, time * 1000);

                self.__bossAbility_index += 1;

            } (this.__bossAbility_index, caretaker));

        },

        //蓄力一击
        __StrengthAttack: function (func, value, stop_time) {
            //Boss消去value对方块
            this.__Boss_Elimination(value);
            //玩家禁手stop_time秒
            this.P_Single_Stop(stop_time);
        },

        //火舞
        __FireDance: function (func, boss_substract, player_add, boss_speed, time) {
            var caretaker = null,
                self = this;

            //Boss消去boss_substract对方块
            this.__Boss_Elimination(boss_substract);
            //玩家增加player_add对方块
            this.P_Single_AddBlock(player_add);

            //            //不重复加属性
            //            if (!LianLianKan.boss_addAttribute_flag) {


            //*备份
            caretaker = this.__Backup({ config: this.__config }, "FireDance");

            //加boss消方块速度
            this.__Boss_AddAttribute({ config: { ai_speed: boss_speed} });

            //刷新速度
            this.__RefreshSpeed();


            //技能有效期到后，重置并显示提示信息
            (function (i, caretaker) {
                self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
                    //恢复上一个备忘录
                    self.__RestoreMemento(caretaker.GetMemento());
                    //刷新速度
                    self.__RefreshSpeed();
                    //调用委托
                    func && func();

                    ////                    console.log("调用委托后 ", ob);

                    //                    self.__TimeOut_UseAbility(ob);

                    //                    ob.flag = false;

                    //                    console.log("after ", ob);
                }, time * 1000);

                self.__bossAbility_index += 1;

            } (this.__bossAbility_index, caretaker));

            //            }
            //            else {
            //                LianLianKan.UI_Info.ShowRightInfo("火舞效果不能叠加", -1, false);
            //            }
        },



        //**战神技能

        //狂暴
        __Rage: function (func, value, level, time) {
            var add_level = 0;
            var self = this,
                caretaker = null;

            //            //不重复加属性
            //            if (!LianLianKan.boss_addAttribute_flag) {
            //计算增加的level(level最大值为5)
            add_level = this.__level + level <= 5 ? level : 5 - this.__level;

            //*备份
            caretaker = this.__Backup({ config: this.__config, level: this.__level }, "Rage");

            //加boss消方块速度和等级
            this.__Boss_AddAttribute({ config: { ai_speed: value }, level: add_level });






            //刷新速度
            this.__RefreshSpeed();
            //            console.log("this.__ai_speed = " + this.__config.ai_speed);
            //根据等级更新Boss设置
            this.__SetBossByLevel();
            //更新玩家设置
            this.__SetPlayerConfig();
            //刷新玩家计时器速度
            this.P_RefreshTimeLine();
            //            console.log("this.__ai_speed = " + this.__config.ai_speed);
            //            console.log("this.__level = " + this.__level);
            //施放其它小技能没有施法时间
            //                this.__boss_abilityTime_flag = false;
            this.__config.boss_smallAbility_time = -1;



            //技能有效期到后，重置并显示提示信息
            (function (i, caretaker) {
                self["__timer_bossAbility" + i.toString()] = window.setTimeout(function () {
                    self.__config.boss_smallAbility_time = self.__ai_player.config.boss_smallAbility_time;

                    //恢复上一个备忘录
                    self.__RestoreMemento(caretaker.GetMemento());

                    //刷新速度
                    self.__RefreshSpeed();
                    //恢复Boss设置
                    self.__SetBossByLevel(true);
                    //更新玩家设置
                    self.__SetPlayerConfig();
                    //恢复玩家计时器速度
                    self.P_RefreshTimeLine();
                    //调用委托
                    func && func();
                }, time * 1000);

                self.__bossAbility_index += 1;

            } (this.__bossAbility_index, caretaker));


            //                //增加等级
            //                this.__level
            //                this.__level = this.__level + level <= 5 ? this.__level + level : 5;
            //            }
            //            else {
            //                LianLianKan.UI_Info.ShowRightInfo("狂暴效果不能叠加", -1, false);
            //            }
        },
        //秒杀
        __Kill: function (func) {
            this.__Boss_Elimination(Math.ceil(this.__remain_num / 2));

            //            this.GameOver("win");
        },
        //反击
        __BeatBack: function (func, type, val) {
            switch (type) {
                case "stop":
                    this.P_Single_Stop(val);
                    break;
                case "roadBlock":
                    this.P_Single_AddBlock(val);
                    break;
                case "mirror":
                    this.P_Single_Reverse();
                    break;
                default:
                    this.P_Single_Stop(5);
                    //                    throw new Error("道具超出范围");
                    break;
            }
        },
        //暴击
        __Crit: function (func, val) {
            this.__Boss_Elimination(val);
        },






        //*重构后增加的内容


        //**重构BindEvent_Prop后，将重复代码提炼成的函数。

        __NoAttackPropDuringAbility: function () {

            //如果Boss已经在施放技能了，则玩家不能对Boss使用技能
            if (this.__boss_beginAbility === true || this.P_bigAbility === true) {
                LianLianKan.UI_Info.ShowRightInfo("Boss施法期间，玩家不能攻击Boss", -1);
                return true;
            }
        },
        __UseAttackProp: function (num, info, sound, name, handler, type, value) {
            if (this.__NoAttackPropDuringAbility()) {
                return;
            }
            if (num > 0) {
                if (this.__player_noProp) {
                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
                    return;
                }
                else {
                    LianLianKan.UI_Info.ShowRightInfo(info, -1);
                    //播放音效
                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play(sound);
                    //道具数减1
                    this.P_SubtractProp(name, 1);
                    //如果boss没有被保护
                    if (!this.__boss_protectedByNoProp) {
                        handler();
                        //判断是否发动技能（玩家对boss使用道具时判断发动），可同时发动不同类型的技能
                        this.P_OnPlayerAttackByProp(type, value);
                    }
                    else {
                        LianLianKan.UI_Info.ShowRightInfo("Boss处于被保护状态，玩家道具攻击无效", -1);
                    }
                }
            }
        },
        __UseNoAttackProp: function (num, info, sound, name, handler) {
            if (num > 0) {
                //                                SingleProp.GetInstance(Bomb, prop._algorithm, prop.map).Do();
                if (this.__player_noProp) {
                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
                    return;
                }
                else {
                    LianLianKan.UI_Info.ShowRightInfo(info, -1);
                    //播放音效
                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play(sound);
                    //道具数减1
                    this.P_SubtractProp(name, 1);
                    handler();
                }
            }
        }




    },
    Protected: {
        //*实现模版成员

        //覆写父类的计算得分方法

        //计算单人游戏得分。挑战boss的得分计算调用子类覆写的P_Result_Score 。
        //计算规则为：
        //得分（加） = （计时器剩余时间 + 最高连击是否大于20（大于20加100分）） * （游戏设置的速度/2），
        //得分（减） 略
        P_Result_Score: function (type) {
            //判断游戏难度时，根据this._difficulity_current判断


            var score = 0,
                timeLine = this.P_GetTimeLine(),
                level = this.P_GetLevel(),
                highestDoubleHit = this.P_GetHighestDoubleHit();

            //            if (LianLianKan.config.speed === 0) {
            //                throw new Error("游戏速度不能为0！");
            //            }


            if (type == "win") {
                score += LianLianKan.config.MAXTIME - timeLine;
                //                    console.log(score);
                score += highestDoubleHit >= 20 ? 100 : 0;
                //                    console.log(score);
                //                score = Math.ceil(score * LianLianKan.config.speed / 2);

                //挑战boss胜利，多加200分
                score += 200;

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

                //                    console.log(score, LianLianKan.config.speed, LianLianKan.config.speed / 2, score * LianLianKan.config.speed / 2);
            }
            else {
                score = -100;
                score += (LianLianKan.config.MAXTIME - timeLine) * 0.5;
                score += highestDoubleHit >= 20 ? 100 : 0;

                //挑战boss失败，多扣200分
                score -= 200;

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

                //                score = score < 0 ? Math.ceil(score / (LianLianKan.config.speed / 2)) : Math.ceil(score * LianLianKan.config.speed / 2);
            }


            return Math.ceil(score);
        },

        //子类调用父类方法的标志
        P_subClass_flag: false,

        //玩家消去方块时判断发动
        P_OnPlayerElimination: function () {
            //获得该事件可能会触发的技能
            var ability = this.__config.ability.filter(function (ob) {
                if (ob.when === "onPlayerElimination") {
                    return ob;
                }
            });

            var self = this;

            //等级越高，技能越强
            var add = this.__level - 1;

            var probability = 0;
            var temp = null;

            ////同一次判断
            ability.each(function (ob) {
                //                console.log(ob.name);
                //?待补充

                //触发对应的技能
                switch (ob.name) {
                    //                    case "Disturb":                                                                                                                                                                                                                                                                           
                    //                        //                        console.log("dismember");                                                                                                                                                                                                                                                                           
                    //                        //                            console.log(self.P_GetDoubleHit());                                                                                                                                                                                                                                                                           
                    //                        if (MyGameEngine.Random.Probability(ob.probability)) {                                                                                                                                                                                                                                                                           
                    //                            //准备技能                                                                                                                                                                                                                                                                           
                    //                            self.__PrepareAbility(ob);                                                                                                                                                                                                                                                                           
                    //                            //产生技能效果                                                                                                                                                                                                                                                                           
                    //                            self.__Distorb();                                                                                                                                                                                                                                                                           
                    //                        }                                                                                                                                                                                                                                                                           
                    //                        break;                                                                                                                                                                                                                                                                           
                    case "秒杀":
                        if (self.P_GetRemainNum() <= ob.value[0]) {
                            //根据玩家得分计算技能发动概率    
                            //参数为：玩家得分基数 初始概率 最低概率 每次减的概率
                            probability = self.__ComputeProbabilityByScore(1000, ob.probability, 0.02, 0.01);
                            //                            console.log(probability);

                            if (MyGameEngine.Random.Probability(probability)) {
                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }
                                //使用技能，产生技能效果
                                self.__UseAbility(ob, self.__Kill, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob));

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob);
                            }
                        }
                        break;
                    case "狂暴":
                        //如果boss剩余方块数大于玩家剩余方块数ob.value[0]个，则判断是否发动技能
                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0]) {
                            if (MyGameEngine.Random.Probability(ob.probability)) {
                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }
                                //使用技能，产生技能效果
                                //持续时间按等级加强效果减半
                                self.__UseAbility(ob, self.__Rage, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[1] + add, ob.value[2], ob.value[3] + add / 2);
                                //                                //产生技能效果
                                //                                self.__Rage(ob.value[1], ob.value[2], ob.value[3]);

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob, ob.value[1] + add, ob.value[2], ob.value[3] + add / 2);
                            }
                        }
                        break;
                    case "逃跑":
                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0] && self.P_GetRemainNum() <= ob.value[1]) {
                            //根据玩家得分计算技能发动概率    
                            //参数为：玩家得分基数 初始概率 最低概率 每次减的概率
                            probability = self.__ComputeProbabilityByScore(500, ob.probability, 0.05, 0.01);

                            //                            console.log(probability);

                            if (MyGameEngine.Random.Probability(probability)) {
                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }
                                //使用技能，产生技能效果
                                self.__UseAbility(ob, self.__Escape, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob));

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob);
                            }
                        }
                        break;
                    case "符文攻击":
                        //                        console.log("符文攻击");
                        if (MyGameEngine.Random.Probability(ob.probability)) {
                            //初始化技能
                            if (self.__InitAbility(ob) === "break") {
                                break;
                            }
                            //使用技能，产生技能效果
                            //持续时间按等级加强效果减半
                            self.__UseAbility(ob, self.__RuneAttack, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[0] + add, ob.value[1] + add, ob.value[2] + add / 2);

                            //提示技能效果，技能施放完毕后显示
                            self.__ShowAbilityEffectInfo(ob, ob.value[0] + add, ob.value[1] + add, ob.value[2] + add / 2);
                        }
                        break;
                    case "回春":
                        //                        console.log("符文攻击");
                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0]) {
                            if (MyGameEngine.Random.Probability(ob.probability)) {
                                //                                console.log(ob.flag);

                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }

                                //使用技能，产生技能效果
                                //Boss消方块速度增加值、持续时间按等级提升效果减半
                                self.__UseAbility(ob, self.__Resume, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[1] + add / 2, ob.value[2] + add / 2);

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob, ob.value[1] + add / 2, ob.value[2] + add / 2);
                            }
                        }
                        break;
                    default:
                        throw new Error("超出范围！");
                        break;
                }

                //                throw $break;   //退出循环
            });
        },
        //玩家连击时判断发动
        P_OnPlayerDoubleHit: function () {
            //            console.log("P_OnPlayerDoubleHit");
            //获得该事件可能会触发的技能
            var ability = this.__config.ability.filter(function (ob) {
                if (ob.when === "onPlayerDoubleHit") {
                    return ob;
                }
            });

            var self = this;
            //等级越高，技能越强
            var add = this.__level - 1;

            ////同一次判断，只能触发一个技能
            ability.each(function (ob) {
                //?待补充

                //触发对应的技能
                switch (ob.name) {
                    //                    case "Dismember":                                                                                                                                                                                                                                                                           
                    //                        //                        console.log("dismember");                                                                                                                                                                                                                                                                           
                    //                        if (self.P_GetDoubleHit() >= ob.value[0]) {                                                                                                                                                                                                                                                                           
                    //                            //                            console.log(self.P_GetDoubleHit());                                                                                                                                                                                                                                                                           
                    //                            if (MyGameEngine.Random.Probability(ob.probability)) {                                                                                                                                                                                                                                                                           
                    //                                //准备技能                                                                                                                                                                                                                                                                           
                    //                                self.__PrepareAbility(ob);                                                                                                                                                                                                                                                                           
                    //                                //产生技能效果                                                                                                                                                                                                                                                                           
                    //                                self.__Dismember(ob.value[1]);                                                                                                                                                                                                                                                                           
                    //                            }                                                                                                                                                                                                                                                                           
                    //                        }                                                                                                                                                                                                                                                                           
                    //                        break;                                                                                                                                                                                                   
                    case "群雷轰击":
                        if (self.P_GetDoubleHit() >= ob.value[0] && self.__remain_num - self.P_GetRemainNum() >= ob.value[1]) {
                            if (MyGameEngine.Random.Probability(ob.probability)) {
                                //初始化技能
                                if (self.__InitAbility(ob) === "break") {
                                    break;
                                }
                                //使用技能，产生技能效果
                                //持续时间、间隔时间按等级加强效果减半
                                self.__UseAbility(ob, self.__Thunder, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[2] + add, ob.value[3] + add, ob.value[4] - add / 2, ob.value[5] + add / 2);

                                //提示技能效果，技能施放完毕后显示
                                self.__ShowAbilityEffectInfo(ob, ob.value[2] + add, ob.value[3] + add, ob.value[4] - add / 2, ob.value[5] + add / 2);
                            }
                        }
                        break;
                    default:
                        throw new Error("超出范围！");
                        break;
                }

                //                throw $break;   //退出循环
            });
        },
        //玩家对Boss使用道具时判断发动
        P_OnPlayerAttackByProp: function (type, val) {
            //获得该事件可能会触发的技能
            var ability = this.__config.ability.filter(function (ob) {
                if (ob.when === "onPlayerAttackByProp") {
                    return ob;
                }
            });

            var self = this;
            //等级越高，技能越强
            var add = this.__level - 1;

            ////同一次判断，只能触发一个技能
            ability.each(function (ob) {

                //?待补充

                //触发对应的技能
                switch (ob.name) {
                    case "反击":
                        if (MyGameEngine.Random.Probability(ob.probability)) {
                            //准备技能
                            if (self.__InitAbility(ob) === "break") {
                                break;
                            }
                            //使用技能，产生技能效果
                            self.__UseAbility(ob, self.__BeatBack, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), type, val + add);

                            //提示技能效果，技能施放完毕后显示
                            self.__ShowAbilityEffectInfo(ob, add);
                        }
                        break;
                    case "防护":
                        if (MyGameEngine.Random.Probability(ob.probability)) {
                            //                            //该技能效果不叠加
                            //                            if (ob.flag !== undefined && ob.flag === true) {
                            //                                break;
                            //                            }
                            //                            else {
                            //初始化技能
                            if (self.__InitAbility(ob) === "break") {
                                break;
                            }
                            //使用技能，产生技能效果
                            //持续时间按等级加强效果减半
                            self.__UseAbility(ob, self.__Protect, MyGameEngine.Event.BindWithArguments(self, self.__TimeOut_UseAbility, ob), ob.value[0] + add / 2);
                            //                            }

                            //提示技能效果，技能施放完毕后显示
                            self.__ShowAbilityEffectInfo(ob, ob.value[0] + add / 2);
                        }
                        break;
                    default:
                        throw new Error("超出范围！");
                        break;
                }

                //                throw $break;   //退出循环
            });
        }
        //        //boss剩余方块大于玩家剩余方块一定值时判断发动
        //        P_OnPlayerFast: function () {
        //            //获得该事件可能会触发的技能
        //            var ability = this.__config.ability.filter(function (ob) {
        //                if (ob.when === "onPlayerFast") {
        //                    return ob;
        //                }
        //            });

        //            var self = this;
        //            //等级越高，技能越强
        //            var add = this.__level - 1;

        //            //            console.log(ability.length);

        //            ////同一次判断，只能触发一个技能
        //            ability.each(function (ob) {

        //                //?待补充

        //                //触发对应的技能
        //                switch (ob.name) {
        //                    //                    case "Snipe":                  
        //                    //                        //如果boss剩余方块数大于玩家剩余方块数ob.value[0]个，则判断是否发动技能                  
        //                    //                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0]) {                  
        //                    //                            if (MyGameEngine.Random.Probability(ob.probability)) {                  
        //                    //                                //准备技能                  
        //                    //                                self.__PrepareAbility(ob);                  
        //                    //                                //产生技能效果                  
        //                    //                                self.__Snipe(ob.value[1]);    //增加ob.value[1]对方块                  
        //                    //                            }                  
        //                    //                        }                  
        //                    //                        break;                  
        //                    //                    case "Roar":                  
        //                    //                        //                                           console.log("Roar");                  
        //                    //                        //                                           console.log(self.__remain_num - self.P_GetRemainNum());                  
        //                    //                        //如果boss剩余方块数大于玩家剩余方块数ob.value[0]个，则判断是否发动技能                  
        //                    //                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0]) {                  
        //                    //                            if (MyGameEngine.Random.Probability(ob.probability)) {                  
        //                    //                                //准备技能                  
        //                    //                                self.__PrepareAbility(ob);                  
        //                    //                                //产生技能效果                  
        //                    //                                self.__Roar(ob.value[1], ob.value[2]);    //增加boss速度                  
        //                    //                            }                  
        //                    //                        }                  
        //                    //                        break;                  
        //                    case "狂暴":
        //                        //如果boss剩余方块数大于玩家剩余方块数ob.value[0]个，则判断是否发动技能
        //                        if (self.__remain_num - self.P_GetRemainNum() >= ob.value[0]) {
        //                            if (MyGameEngine.Random.Probability(ob.probability)) {
        //                                //准备技能
        //                                self.__PrepareAbility(ob);
        //                                //产生技能效果
        //                                self.__Rage(ob.value[1], ob.value[2], ob.value[3]);
        //                            }
        //                        }
        //                        break;
        //                    default:
        //                        throw new Error("超出范围！");
        //                        break;
        //                }

        //        //                throw $break;   //退出循环
        //            });
        //        }
        //玩家对boss使用道具时判断发动
    },
    Public: {
        //        //剩余方块数
        //        remain_num: 0,

        //观察者对象（自定义事件）

        //        onStart: null,
        //        onEnd: null,
        //        onBossElimination: null,
        //        onGameElimination: null,
        //        onDoubleHit: null,
        //        onStop: null,

        //        SetOperate: function (operate) {
        //            this._operate_single = operate;
        //        },


        //        //此处表示公开私有成员__config（相当于c#中的public属性），外界可修改这个私有成员
        //        config: null,

        //        //获得boss序号
        //        GetIndex: function () {
        //            return this.__index;
        //        },
        GetName: function () {
            return this.baseToSubClass();
        },
        //观察者
        SetName: function (name) {
            //            throw new Error("禁止调用！");

            this.baseToSubClass(name);
        },
        //        GetConfig: function () {
        //            //返回副本
        //            return MyGameEngine.Base.Extend({}, this.__config);
        //        },
        //        SetConfig: function (config) {
        //            MyGameEngine.Base.Extend(this.__config, config);
        //        },

        //观察者
        //根据游戏难度改变属性
        SetByDifficulity: function (dif) {
            this.__SetByDifficulity(dif);

            LianLianKan.difficulity = dif;
            //            //保存本次设置的难度，用于判断是否与上次设置的难度相同。
            //            this.__difficulity = dif;


            //修改游戏难度后，重新开始游戏后生效

            //调用父类同名方法
            this.baseToSubClass(dif);
        },


        //选择Boss
        SelectPlayer: function (index) {
            var player = null,
            parent_player = null;


            //如果不是第一次选择Boss
            if (this.__ai_player) {
                //                /*
                //                不更新，直接保存Boss类的经验值和等级

                //                //                //更新当前boss的数据
                //                //                                this.__RefreshCurrentBossPlayer();
                //                */

                //更新前一个boss的数据
                this.__RefreshCurrentBossPlayer();

                //保存前一个boss的数据
                this.__SaveInfo();
            }


            //根据Boss序号，选择对应的Boss
            //            switch (index) {
            //                case 1:
            //                    player = SingleBoss.GetInstance(Boss_Player_Beginner);
            //                    break;
            //                case 2:
            //                    player = SingleBoss.GetInstance(Boss_Player_Farmer);
            //                    break;
            //                case 3:
            //                    player = SingleBoss.GetInstance(Boss_Player_Hackbuteer);
            //                    break
            //                case 4:
            //                    player = SingleBoss.GetInstance(Boss_Player_Butcher);
            //                    break;
            //                case 5:
            //                    player = SingleBoss.GetInstance(Boss_Player_Revenge);
            //                    break;
            //                case 6:
            //                    player = SingleBoss.GetInstance(Boss_Player_Terminator);
            //                    break;
            //                default:
            //                    player = null;
            //                    break;
            //            }

            //根据Boss序号，选择对应的Boss类
            //注意index要减1
            //            player = SingleBoss.GetInstance(index - 1);
            player = Data_Boss.GetPlayer(index - 1);




            //判断玩家得分是否足够挑战该boss
            if (LianLianKan.score < player.minScore) {
                alert("您需要获得" + player.minScore + "分，才能挑战该Boss！请加油练级吧");
                return false;
            }

            //            parent_player = SingleGamePlayer.GetInstance(Game_Player);

            //设置Boss类的属性
            this.__SetPlayer(player);

            this.__ai_player = player;


            //操作类的属性更新为当前选择的Boss类的属性
            this.__Clone(this.__ai_player);


            //设置操作类__config
            this.__SetBossByLevel(true);

            //设置玩家的属性
            this.__SetPlayerConfig();

            //                        //读取玩家的初始道具数量
            //                        this.__EditPropNum();

            //                        //根据游戏难度设置属性
            //                        this.__SetByDifficulity(LianLianKan.difficulity, true);



            //显示Boss头像
            $("#lianliankan_smallMap_bossHead").attr({ "src": this.__img,
                "height": $("#lianliankan_smallMap").height(),
                "width": $("#lianliankan_smallMap").height()
            });

            //            //清空技能
            //            SingleAbility.Dispose();

            //            //调用父类
            //            this.baseToSubClass(parent_player);
        },
        //获得mapIndex
        GetMapIndex: function () {
            return this.__map.Map.mapIndex;
        },
        //选择地图
        SetMapIndex: function (mapIndex) {
            this.__map.Map.mapIndex = mapIndex;

            this.baseToSubClass(mapIndex);
        },

        //清除计时器
        ClearTimer: function () {
            //            //            console.log("ai ClearTimer");
            //            window.clearInterval(this.__timer_timeLine);
            //            //            window.clearInterval(this.__timer_timeLine_player);

            //            this.__timer_timeLine = 0;
            //            //            this.__timer_timeLine_player = 0;

            this.__ClearTimer();

            this.baseToSubClass();

        },
        //重置
        Reset: function () {
            //            console.log(LianLianKan.score);
            //            this.base();
            //            /* 
            //            此处不用“this.base();”！
            //            因为上面调用“this.ClearTimer();”时，ClearTimer中调用了“this.base()”，已经将base指向了ClearTimer
            //            （即“return parentClass.prototype[name].apply(parentClass.prototype, arguments);”中的name为“ClearTimer”而不是“Reset”）
            //            。
            //            所以如果此处用“this.base();”，实际上是调用父类（Operate_Single）中的ClearTimer方法！
            //            */
            this.baseToSubClass();  //先调用父类的Reset


            //            console.log("reset");
            //            this._game_player.gameInfo.time = this._game_player.gameInfo.timeline = 0;
            //            LianLianKan.config.MAXTIME = 328;


            //            LianLianKan.config.speed = 5;
            //            //消去一对方块，计时器加的时间
            //            LianLianKan.config.addTime = 20;


            //            this._game_player.selected = {};

            //            //*重置状态

            //            LianLianKan.abilityStatus = LianLianKan.AbilityStatus.None;
            //            LianLianKan.bossStatus = LianLianKan.BossStatus.None;
            //            this.__stop_flag = false;

            //*重置自定义事件
            //            this.onStart = null;
            //            this.onEnd = null;
            //            this.onBossElimination = null;
            //            this.onGameElimination = null;
            //            this.onDoubleHit = null;
            //            this.onStop = null;

            //            LianLianKan.gameStatus = LianLianKan.Status.Stop;

            //*重置游戏属性
            this.__remain_num = 0;

            //重置timer
            this.__ClearTimer();


            this.P_subClass_flag = true;

            this.__difficulity_current = LianLianKan.difficulity;


            //重置计时器序号
            this.__init_smallAbility_index = 0;

            this.__init_bigAbility_index = 0;

            this.__use_bigAbility_index = 0;

            this.__use_smallAbility_index = 0;

            this.__bossAbility_index = 0;




            //*重置标志

            //boss施放技能标志
            this.__boss_beginAbility = false;

            this.__boss_protectedByNoProp = false;

            this.__player_noProp = false;

            //            //boss是否有施放时间标志
            //            this.__boss_abilityTime_flag = true;

            //            //小技能施法时间
            //            this.__config.boss_smallAbility_time = this.__ai_player.config.boss_smallAbility_time;


            //*重置算法
            this.__algorithm.Dispose();
            //重新注入map对象
            this.__algorithm.SetMap(this.__map);

            //*重置地图

            //隐藏效果层
            //            console.log(LianLianKan.UI_CommonMap.clueLine.children("div").length);
            //                common.HideDiv(LianLianKan.UI_CommonMap.clueLine.children("div"));


            //            this.__map.line && common.HideDiv(this.__map.line.children("div"));
            //            common.HideDiv(this.__map.select_div);

            //            this.__map.Dispose();
            //            this.__map.Map.map = [];
            //            this.__map.Map.mapIndex = 0;

            //            this.__map = null;

            this.__RefreshBossMapInfo();



            //清空Boss信息
            $("#lianliankan_smallMap_info").empty();
            $("#lianliankan_smallMap_img").attr("src", "Image/Map/null.gif");   //技能动画重置




            //从Boss类中重置操作类属性
            this.__ai_player && this.__Clone(this.__ai_player);


            //            //设置操作类属性
            //            this.__SetBossByLevel();
            //            //根据游戏难度修正操作类属性
            //            this.__SetByDifficulity(LianLianKan.difficulity, true);

            //            //隐藏效果层
            //            //            console.log(LianLianKan.UI_CommonMap.clueLine.children("div").length);
            //            //                common.HideDiv(LianLianKan.UI_CommonMap.clueLine.children("div"));
            //            common.HideDiv(LianLianKan.UI_CommonMap.line.children("diRv"));
            //            common.HideDiv(LianLianKan.UI_CommonMap.select_div);
            //            console.log("finish");

        },
        //挑战boss，开始游戏
        Start: function () {
            //                //            //                console.log("start");
            var self = this,
                mapIndex = 0;

            //            console.log("this.__config.ai_speed = ", this.__config.ai_speed);
            //*判断当前地图是否符合要求（方块数是否符合要求）
            mapIndex = this.__JudgeMap();
            //如果不符合要求，则返回
            if (mapIndex === "break") {
                return;
            }

            //判断玩家得分是否足够挑战该boss
            if (LianLianKan.score < this.__ai_player.minScore) {
                alert("您需要获得" + this.__ai_player.minScore + "分，才能挑战该Boss！请加油练级吧");
                return false;
            }

            //根据游戏难度修正操作类属性
            this.__SetByDifficulity(LianLianKan.difficulity, true);

            //刷新剩余方块数
            this.__remain_num = this.__map.InitMap(mapIndex);


            //初始化自定义事件
            //            this.__InitCustomEvent();

            //                //            //                console.log(this.gameInfo.time);
            //                //            //                //重置游戏，进行设置
            //                //            //                self.Reset();

            //            LianLianKan.gameStatus = LianLianKan.Status.Gaming;
            //            LianLianKan.pattern = LianLianKan.Pattern.Boss;     //挑战boss模式

            //                //            //                console.log(LianLianKan.gameStatus);

            //            this.__ai_player.OnStart();

            //发布开始事件
            this.__ai_player.OnStart();
            //            this.onStart.PublishAll(this.__ai_player);
            ////            this.__ai_player.OnStart();
            //            //取消订阅开始事件
            //            this.onEnd.UnSubscribe(this.__ai_player.OnStart);

            //            this.__ai_player.OnStart();


            //            console.log(this.__ai_player.config.ai_speed);

            //计时消方块
            this.__StartElimination();

            //            self._timer_time = setInterval(function () { self._AddUseTime(); }, 1000);

            //            console.log("start");

            //            //地图初始化
            //            this.__map.InitGameArea();



            //保存当前游戏难度，用于游戏结束时经验值、得分计算
            this.__difficulity_current = LianLianKan.difficulity;

            //刷新地图信息
            this.__RefreshBossMapInfo();


            //循环播放挑战该Boss的背景音乐
            //            LianLianKan.Sound && LianLianKan.Sound.RepeatPlay("boss_background" + this.__index.toString(), -1);
            LianLianKan.Sound && LianLianKan.config.music && LianLianKan.Sound.RepeatPlay(this.__background_music);


            //                //                alert("重置");
            ////                setInterval(function () {
            ////                    self.__Rearrangement();
            //////                    console.log(self.__algorithm.IsNoPath(self.__ai_player.__remain_num));
            ////                    //                    if (self.__algorithm.IsNoPath(self.__ai_player.__remain_num)) {
            ////                    //                        self.ShowInfo("使用重列道具");
            ////                    //                        self.__Rearrangement();
            ////                    //                    }
            ////                }, 2000);

            //            //?显示玩家信息（得分、挑战boss情况、等级）

            //            console.log("start");

            //            //覆写当前挑战的boss序号，用于父类调用
            //            this.P_boss_index_current = this.__index;




            //设置操作类属性
            this.__SetBossByLevel();
            //根据Boss类的设定，设置玩家的属性
            this.__SetPlayerConfig();

            //            /*因为Boss等级变化时，玩家的道具设置不会变化，所以此处不用修改（只在SelectPlayer中修改一次即可）
            //            //根据当前boss序号，修改对应的道具数量
            //            this.__EditPropNum();
            //            */

            this.__EditPropNum();


            //            console.log("this.__config.ai_speed = " + this.__config.ai_speed);


            //把mapIndex传入，使用同一个地图
            this.baseToSubClass(mapIndex);
            //            //调用子类覆盖的AddTimeLine方法
            //            this.__timer_timeLine_player = setInterval(function () { self.AddTimeLine(2); }, Math.floor(3000 / self.GetPlayer().config.time_speed));


            //            this.baseToSubClass();
            //            console.log("aa");

        },
        //        ////此处之所以用重写覆盖，是因为父类中是“this.GameOver("win");”，而此处要为“this.GameOver("lose");”。
        //        Mousedown: function (_this) {
        //            //            //覆写标志
        //            //            this.P_subClass_flag = true;

        //            this.baseToSubClass(_this);

        //            //                        console.log("Mousedown");
        //            //            var current = _this, M = this.baseClass._map.Map.map;
        //            //            var position = current.position();    //使用position()，获得相对于“lianliankan_map”层的坐标
        //            //            //取出坐标
        //            //            var x = current.attr("x"),
        //            //                                                                                y = current.attr("y");
        //            //            //当前方块
        //            //            var current_block = M[y][x];

        //            //            var _selected;
        //            //            if (current_block.img === 0 || LianLianKan.gameStatus != LianLianKan.Status.Gaming) {
        //            //                //                console.log("return");
        //            //                return;
        //            //            }

        //            //            //不使用MyClass.self！因为该属性为静态属性，如果创建了该类后，又创建了类A，则MyClass.self会指向类A！
        //            //            //                _selected = MyClass.self.selected;
        //            //            _selected = this.baseClass._selected;

        //            //            //重置选中的方块
        //            //            this.baseClass._selected = {};
        //            //            //如果已经有选中的方块
        //            //            if (_selected.block) {
        //            //                //如果方块相同
        //            //                if (this.baseClass.__algorithm.IsEqual(_selected.block, current_block)) {
        //            //                    //如果方块可连接
        //            //                    if (this.baseClass.__algorithm.IsLink(_selected.block, current)) {
        //            //                        //消去方块
        //            //                        this.baseClass.__algorithm.Elimination(_selected.block, current_block);

        //            //                        //刷新剩余方块数
        //            //                        this.baseClass.__remain_num -= 2;

        //            //                        //隐藏当前选中效果层
        //            //                        common.HideDiv(this.baseClass._map.select_div);
        //            //                        //显示连线
        //            //                        this.baseClass.__algorithm.ShowLine(_selected.block, current_block);
        //            //                        //                            var t = this.baseClass.gameInfo.timeLine;
        //            //                        //                            console.log(this.baseClass._timeLine);
        //            //                        //计时器加时间
        //            //                        this.baseClass._timeLine -= this.baseClass._config.addTime;
        //            //                        //判断是否为连击
        //            //                        if (this.baseClass.JudgeDoubleHit()) {
        //            //                            this.baseClass._AddDoubleHit();
        //            //                        }
        //            //                        //刷新地图信息
        //            //                        this.baseClass.__RefreshBossMapInfo();


        //            //                        //*发布所有事件

        //            //                        //判断是否胜利
        //            //                        if (this.baseClass.__remain_num === 0) {
        //            //                            //                                        console.log("0");
        //            //                            this.GameOver("lose");

        //            //                            return;
        //            //                        }

        //            //                        //判断是否无解并提示。
        //            //                        //消去一对方块后判断。
        //            //                        if (this.baseClass.__algorithm.IsNoPath(this.baseClass.__remain_num)) {
        //            //                            LianLianKan.UI_Info.ShowInfo("无解！请使用重列或者炸弹道具");

        //            //                            return false;
        //            //                        }


        //            //                        return false;
        //            //                    }
        //            //                }
        //            //            }

        //            //            //保存当前选中方块
        //            //            this.baseClass._selected.block = current_block;
        //            //            this.baseClass._selected.x = x;
        //            //            this.baseClass._selected.y = y;

        //            //            //显示当前选中效果层
        //            //            this.baseClass._map.select_div.css({ "left": position.left + "px", "top": position.top + "px" });

        //            //            //*播放音效
        //            //            return false;

        //        },
        //        JudgeDoubleHit: function () {
        //            return this._operate_single.JudgeDoubleHit();
        //        },
        //        AddTimeLine: function (val) {
        //            //            //覆写标志
        //            //            this.P_subClass_flag = true;

        //            this.baseToSubClass(val);

        //            //            var timeLine = this.baseClass.P_GetTimeLine();

        //            //            //            var game_player = this.baseClass.GetPlayer();

        //            //            if (LianLianKan.gameStatus == LianLianKan.Status.Gaming) {
        //            //                timeLine += val;
        //            //                //                console.log(this.gameInfo.timeLine);
        //            //                timeLine = timeLine < 0 ? 0 : timeLine;

        //            //                //                this.baseClass.P_SetTimeLine(timeLine);

        //            //                //                    console.log(game_player.gameInfo.timeLine);
        //            //                $("#timeLineImg").css("width", timeLine + "px");
        //            //                //                console.log($("#timeLineImg").css("width"));
        //            //                if (timeLine >= LianLianKan.config.MAXTIME) {
        //            //                    //                    if (LianLianKan.pattern == LianLianKan.Pattern.Single) {
        //            //                    this.GameOver("win");
        //            //                    //                    }
        //            //                    //                    else if (LianLianKan.pattern == LianLianKan.Pattern.Boss) {
        //            //                    //                        this._ai_operate.GameOver("win");
        //            //                    //                    }
        //            //                    //                    alert("游戏结束");
        //            //                }
        //            //                //                    console.log(this.gameInfo.timeLine);
        //            //            }

        //        },
        //            //显示玩家信息
        //            ShowInfo: function (info) {
        //                //                alert(info);
        //            },
        //更新地图信息
        RefreshMapInfo: function () {
            this.__RefreshBossMapInfo();

            this.baseToSubClass();

            //            //更新连击数
            //            $("#info_doubleHit").text(this._doubleHit);
            //            $("#info_highestDoubleHit").text(this._hightestDoubleHit);
        },


        //挑战boss，游戏结束
        GameOver: function (_type) {
            //            console.log("Boss GameOver");
            //            console.log("LianLianKan.score = ", LianLianKan.score);
            //            console.log("Boss _type = " + _type);
            //            this.__ai_player.OnEnd();
            var type = "",
                experience = 0,
                level = 0;





            //发布OnEnd事件
            //            this.onEnd.PublishAll(null, _type);
            this.__ai_player.OnEnd(_type);

            //清空
            //            this.onEnd.Dispose();



            //                        alert("over");
            //清除ai消方块的计时器
            this.ClearTimer();
            //            //清除玩家的计时器
            //            this._operate_single.ClearTimer();

            //            LianLianKan.gameStatus = LianLianKan.Status.Wait;



            //type反向，因为电脑赢，即是玩家输。
            type = _type === "win" ? "lose" : "win";
            //                        console.log("type= " + type);



            //计算boss获得的经验值
            experience = this.__Result_Experience(_type);
            //经验值要大于等于0
            if (this.__experience + experience >= 0) {
                this.__experience += experience;
            }

            //判断boss等级
            level = this.__Result_Level();
            this.__level = level;



            //            //根据Boss的level，修正__config



            //                        //设置玩家计时器属性
            //                        this.__SetPlayerConfig();

            //判断是否挑战成功且该boss之前没有被挑战成功，则改变boss_index
            //            if (type === "win" && this.__index > LianLianKan.boss_index) {
            if (type === "win" && !LianLianKan.boss_index.contain(this.__index)) {
                //                LianLianKan.boss_index += 1;
                LianLianKan.boss_index += "," + this.__index;
            }





            //显示信息
            if (_type === "lose") {
                LianLianKan.UI_Info.ShowRightInfo("挑战成功", -1);
            }
            else {
                LianLianKan.UI_Info.ShowRightInfo("挑战失败", -1);
            }
            this.__Show_Data({ experience: experience, level: level });

            //技能动画重置
            $("#lianliankan_smallMap_img").attr("src", "Image/Map/null.gif");


            //            //根据Boss的level，修正player的Boss类的config和__config
            //            this.__SetBossByLevel();


            //更新Boss类的数据
            this.__RefreshCurrentBossPlayer();

            //            //根据Boss的level，修正player的Boss类的config
            //            this.__SetBossByLevel();


            //            this.__Clone(this.__ai_player);
            //            //根据游戏难度修正操作类属性
            //            this.__SetByDifficulity(LianLianKan.difficulity, true);

            //            this.__ai_player.

            //            console.log("LianLianKan.score = ", LianLianKan.score);
            //                        this.base(type);

            //            console.log("LianLianKan.score = ", LianLianKan.score);
            //刷新boss信息
            this.ShowInfo();

            //清空备忘录管理员和备忘录
            this.__Dispose_Caretaker();


            /* 
            此处不用“this.base(type);”！
            因为上面调用“this.ClearTimer();”时，ClearTimer中调用了“this.base()”，已经将base指向了ClearTimer
            （即“return parentClass.prototype[name].apply(parentClass.prototype, arguments);”中的name为“ClearTimer”而不是“GameOver”）
            。
            所以如果此处用“this.base(type);”，实际上是调用父类（Operate_Single）中的ClearTimer方法！
            */

            //            var t = this.prototype;
            //            var m = this;

            this.baseClass.GameOver.call(this, type);

            //            console.log("LianLianKan.score = ", LianLianKan.score);
        },

        //        //使用技能，参数为技能类名
        //        Use: function (ability) {
        //            var ability_instance = null;

        //            //            console.log("use!");

        //            if (operate.IsString(ability)) {
        //                throw new Error("The type of Class name can't be string!");
        //            }

        //            //游戏状态为暂停
        //            LianLianKan.gameStatus = LianLianKan.Status.Pause;
        //            //            //暂停
        //            //            this.Pause();   //调用基类方法


        //            ability_instance = SingleAbility.GetInstance(ability, this.baseClass.GetPlayer.call(this, null), this.__ai_player);

        //            //使用技能，加载技能特效
        //            this.__ai_player.Use(ability_instance);

        //            //技能特效完毕后，恢复游戏
        //            LianLianKan.gameStatus = LianLianKan.Status.Gaming;
        //            //            this.Continue();      //调用基类方法

        //            ////            //?播放声音
        //        },
        //获得当前Boss对象
        GetPlayer: function (type) {
            var player = null;
            switch (type) {
                case "player":
                    player = this.baseToSubClass(type);
                    break
                case "ai":
                    player = this.__ai_player;
                    break;
                default:
                    player = this.__ai_player;
                    break;
            }
            return player;
        },
        //保存boss信息
        SaveInfo: function () {
            //                        console.log(document.cookie);
            //            Data_Boss.SetExperience(this.__name, this.__experience);
            //            Data_Boss.SetLevel(this.__name, this.__level);

            this.__SaveInfo();

            this.baseToSubClass();

            //                        console.log(document.cookie);
        },
        //显示Boss信息
        ShowInfo: function () {
            $("#ai_name").text(this.__ai_player.name);
            $("#ai_experience").text(this.__ai_player.experience);
            $("#ai_level").text(this.__ai_player.level);

            this.baseToSubClass();
        },
        //        //显示地图信息
        //        ShowMapInfo: function () {
        //            this.baseToSubClass();
        //        },

        //        //道具数量
        //        _propNum: {
        //            _prop_findPath: 0,
        //            _prop_rearrangement: 0,
        //            _prop_bomb: 0,
        //            _prop_stop: 0,
        //            _prop_roadBlock: 0
        //        },

        //绑定道具事件
        BindEvent_Prop: function () {
            //            this.baseToSubClass();

            //道具绑定click事件
            this.__OnClickProp = MyGameEngine.Event.BindEvent(this, function (event, args) {
                var prop = null,
                    self = this;

                //开始游戏后才能使用道具
                if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
                    prop = this.P_GetPropNum();

                    switch ($(event.target).attr("id")) {
                        case "index_prop_findPath":
//                            if (prop.prop_findPath > 0) {
//                                //                                SingleProp.GetInstance(FindPath, prop._algorithm, prop.map).Do();
//                                ////                                console.log(prop.propNum._prop_findPath);
//                                //                                if (this.P_subClass_flag) {
//                                if (this.__player_noProp) {
//                                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
//                                    return;
//                                }
//                                else {
//                                    this.P_FindPath();
//                                    LianLianKan.UI_Info.ShowRightInfo("玩家使用指南针道具", -1);
//                                    //播放音效
//                                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("findPath");
//                                    //                                }
//                                    //道具数减1
//                                    this.P_SubtractProp("findPath", 1);
//                                }
                            //                            }

                            this.__UseNoAttackProp(prop.prop_findPath, "玩家对Boss使用指南针道具", "findPath", "findPath", MyGameEngine.Event.BindWithArguments(self, this.P_FindPath));

                            //                            console.log(prop.propNum._prop_findPath);
                            break;
                        case "index_prop_rearrangement":
//                            if (prop.prop_rearrangement > 0) {
//                                //                                SingleProp.GetInstance(Rearrangement, prop._algorithm, prop.map).Do();
//                                //                                console.log(prop.prop_rearrangement);
//                                if (this.__player_noProp) {
//                                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
//                                    return;
//                                }
//                                else {
//                                    this.P_Rearrangement();
//                                    LianLianKan.UI_Info.ShowRightInfo("玩家使用重列道具", -1);
//                                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("rearrangement");
//                                    //道具数减1
//                                    this.P_SubtractProp("rearrangement", 1);
//                                }
                            //                            }

                            this.__UseNoAttackProp(prop.prop_rearrangement, "玩家对Boss使用重列道具", "rearrangement", "rearrangement", MyGameEngine.Event.BindWithArguments(self, this.P_Rearrangement));

                            //                            console.log(prop.prop_rearrangement);
                            break;
                        case "index_prop_bomb":
                            //                            if (prop.prop_bomb > 0) {
                            //                                //                                SingleProp.GetInstance(Bomb, prop._algorithm, prop.map).Do();
                            //                                if (this.__player_noProp) {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
                            //                                    return;
                            //                                }
                            //                                else {
                            //                                    this.P_Bomb();
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家使用炸弹道具", -1);
                            //                                    //播放音效
                            //                                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("bomb");
                            //                                    //道具数减1
                            //                                    this.P_SubtractProp("bomb", 1);
                            //                                }
                            //                            }

                            this.__UseNoAttackProp(prop.prop_bomb, "玩家对Boss使用炸弹道具", "bomb", "bomb", MyGameEngine.Event.BindWithArguments(self, this.P_Bomb));

                            break;
                        case "index_prop_stop":
                            //                            if (prop.prop_stop > 0) {
                            //                                //如果Boss已经在施放技能了，则玩家不能对Boss使用技能
                            //                                if (this.__boss_beginAbility === true || this.P_bigAbility === true) {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("Boss施法期间，玩家不能攻击Boss", -1);
                            //                                    return;
                            //                                }

                            //                                //                                SingleProp.GetInstance(FindPath, prop._algorithm).Do();
                            //                                //                                                                console.log(prop.prop_findPath);
                            //                                if (this.__player_noProp) {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
                            //                                    return;
                            //                                }
                            //                                else {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家对Boss使用禁手道具", -1);
                            //                                    //播放音效
                            //                                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("prop");
                            //                                    //道具数减1
                            //                                    this.P_SubtractProp("stop", 1);
                            //                                    //如果boss没有被保护
                            //                                    if (!this.__boss_protectedByNoProp) {
                            //                                        this.__Stop(5);
                            //                                        //判断是否发动技能（玩家对boss使用道具时判断发动），可同时发动不同类型的技能
                            //                                        this.P_OnPlayerAttackByProp("stop", 5);
                            //                                    }
                            //                                    else {
                            //                                        LianLianKan.UI_Info.ShowRightInfo("Boss处于被保护状态，玩家道具攻击无效", -1);
                            //                                    }
                            //                                }
                            //                            }


                            this.__UseAttackProp(prop.prop_stop, "玩家对Boss使用禁手道具", "prop", "stop", MyGameEngine.Event.BindWithArguments(self, this.__Stop, 5), "stop", 5);


                            //                            console.log(this._prop_findPath);
                            break;
                        case "index_prop_roadBlock":
                            //                            if (prop.prop_roadBlock > 0) {
                            //                                //如果Boss已经在施放技能了，则玩家不能对Boss使用技能
                            //                                if (this.__boss_beginAbility === true || this.P_bigAbility === true) {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("Boss施法期间，玩家不能攻击Boss", -1);
                            //                                    return;
                            //                                }

                            //                                //                                SingleProp.GetInstance(FindPath, this.__algorithm).Do();
                            //                                //                                console.log(this._prop_findPath);
                            //                                if (this.__player_noProp) {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
                            //                                    return;
                            //                                }
                            //                                else {
                            //                                    //道具数减1
                            //                                    this.P_SubtractProp("roadBlock", 1);
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家对Boss使用路障道具", -1);
                            //                                    //播放音效
                            //                                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("prop");
                            //                                    //如果boss没有被保护
                            //                                    if (!this.__boss_protectedByNoProp) {
                            //                                        this.__RoadBlock(6);
                            //                                        //判断是否发动技能（玩家对boss使用道具时判断发动），可同时发动不同类型的技能
                            //                                        this.P_OnPlayerAttackByProp("roadBlock", 6);
                            //                                    }
                            //                                    else {
                            //                                        LianLianKan.UI_Info.ShowRightInfo("Boss处于被保护状态，玩家道具攻击无效", -1);
                            //                                    }
                            //                                }
                            //                            }



                            this.__UseAttackProp(prop.prop_roadBlock, "玩家对Boss使用路障道具", "prop", "roadBlock", MyGameEngine.Event.BindWithArguments(self, this.__RoadBlock, 6), "roadBlock", 6);


                            //                            console.log(this._prop_findPath);
                            break;
                        case "index_prop_mirror":
                            //                            if (prop.prop_mirror > 0) {
                            //                                //                                SingleProp.GetInstance(FindPath, this.__algorithm).Do();
                            //                                //                                console.log(this._prop_findPath);
                            //                                if (this.__player_noProp) {
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家被禁止使用道具", -1);
                            //                                    return;
                            //                                }
                            //                                else {
                            //                                    //道具数减1
                            //                                    this.P_SubtractProp("mirror", 1);
                            //                                    LianLianKan.UI_Info.ShowRightInfo("玩家对Boss使用镜子道具", -1);
                            //                                    //播放音效
                            //                                    LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("prop");
                            //                                    //如果boss没有被保护
                            //                                    if (!this.__boss_protectedByNoProp) {
                            //                                        this.__Mirror();
                            //                                        //判断是否发动技能（玩家对boss使用道具时判断发动），可同时发动不同类型的技能
                            //                                        this.P_OnPlayerAttackByProp("mirror");
                            //                                    }
                            //                                    else {
                            //                                        LianLianKan.UI_Info.ShowRightInfo("Boss处于被保护状态，玩家道具攻击无效", -1);
                            //                                    }
                            //                                }
                            //                            }



                            this.__UseAttackProp(prop.prop_mirror, "玩家对Boss使用镜子道具", "prop", "mirror", MyGameEngine.Event.BindWithArguments(self, this.__Mirror), "mirror");


                            //                            console.log(this._prop_findPath);
                            break;
                        default:
                            throw new Error("道具超出范围");
                            break;
                    }
                }
            });
            MyGameEngine.Event.AddEvent($("ul.index_prop li"), "click", this.__OnClickProp);
        },



        //移除道具事件
        RemoveEvent_Prop: function () {
            //            this.baseToSubClass();
            MyGameEngine.Event.RemoveEvent($("ul.index_prop li"), "click", this.__OnClickProp);
        },

        //        SetConfig: function () {
        //            throw new Error("禁止调用！");
        //        },
        //        SetName: function(){
        //            throw new Error("禁止调用！");
        //        },

        //结束当前游戏
        EndGame: function () {
            //            if (this.__ai_player) {
            /*
            不更新，直接保存Boss类的经验值和等级

            //                //更新当前boss的数据
            //                                this.__RefreshCurrentBossPlayer();
            */
            //                //保存当前boss的数据
            //                this.__SaveInfo();
            //            }
            this.GameOver("win");
        },
        Dispose: function () {
            this.__algorithm.Dispose();
            this.__map.Dispose();

            //?待补充

        }
    }
});