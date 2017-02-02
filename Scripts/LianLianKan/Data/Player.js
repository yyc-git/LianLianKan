//*玩家基类
var Parent_Game_Player = MyAbstract({
//    Public: {
//        Virtual: {
//            Use: function (ob) {
//                obj.Do();
//            }
//        }
//    },
    Abstract: {
        Dispose: function () {
        }
    }
});

//玩家接口
//    var Interface_Game_Player = MyInterface("Use");

//*子类

//游戏玩家类
var Game_Player = MyClass(Parent_Game_Player, {
    Public: {
//        //玩家剩余方块数
        //        remain_num: 0,


        //这四项在操作类中设置（读取cookie）
        //姓名
        name: "Player",
        //得分
        score: 0,
        level: "",
        boss_index: "",



        //参数设置
        config: {
            //玩家计时器速度
            time_speed: 12,
            //消去方块时，玩家计时器加的时间
            addTime: 18
        },



             //玩家初始的道具数
            prop_findPath: 3,
            prop_rearrangement: 3,
            prop_bomb: 3,
            prop_stop: 0,
            prop_roadBlock: 0,
            prop_mirror: 0,


        //            //提示框点击标志
        //            clueLine_click_flag: 0,

//        //游戏信息
//        gameInfo: {
//            timeLine: 0,
//            time: 0
//        },
//        //已经选中的方块
//        selected: {},

//        //上次消方块时间，用于判断是否为连击
//        last_time: null,
//        //连击数
//        doubleHit: 0,
//        //最高连击数
//        hightestDoubleHit: 0,

        //构造函数
        Init: function () {
            //            if (opt) {
            //                this.name = opt.name;
            //                this.score = opt.score;
            //                this.boss_index = opt.boss_index;
            //                this.level = opt.level;


            //                this.config.time_speed = opt.config.time_speed;
            //                this.config.addTime = opt.config.addTime;
            //            }




        },

//        //使用道具
//        Use: function (prop) {
//            //            prop.Do();
//            this.base(prop);
//        },
        Dispose: function () {
        }
        //            GetRemain_num: function () {
        //            },
        //            SetRemain_num
    }
});


//Boss基类  要实现开始事件handler和结束事件handler
var Parent_Boss_Player = MyAbstract({
    Public: {
//        //剩余方块数
//        remain_num: 0,
        //Boss经验值
        experience: 0,
        //Boss等级
        level: 1

//            Virtual: {
//        //使用技能
//        Use: function (ob) {
//            ob.Do();
//        }
//        //            //使用道具
//        //            UseProp: function (ob) {
//        //                obj.Do();
//        //            }
//    }
    },
    Abstract: {
        //开始事件handler
        OnStart: function () {
        },
        //结束事件handler
        OnEnd: function (type) {
        },
        Dispose: function () {
        }
    }
});


//Boss类


//小矮人

var Boss_Player_Small = MyClass(Parent_Boss_Player, {
    //构造函数
    Init: function (opt) {
    },
    Public: {
        //Boss姓名
        name: "小矮人",
        //         index: 6,

        //这两项在选择Boss时再根据cookie中保存的值进行设置
        experience: 0,
        level: 1,

        index: "1",
        img: "Image/BossHead/小矮人.jpg",    //未挑战成功的boss的头像
        img_gray: "Image/BossHead/小矮人_gray.jpg",   //已挑战成功的boss的头像（灰色）
        minNum: 40,     //地图最小要求的方块数，如果为0则不限制地图
        minScore: -1000, //玩家需要获得该得分才可以挑战
        text: "逃跑：Boss逃离战斗，玩家挑战失败。<br>"
        + "防护：一段时间内，Boss对玩家道具攻击免疫。<br>"
        + "符文攻击：一段时间内，玩家计时器加速，玩家消方块加的时间减少。<br>"
        + "群雷轰击：Boss立即消去一定数量方块，并且在持续时间内每隔一段时间消去一定数量方块。",    //boss说明

        background_music: ["Sound/Boss/boss_background1.mp3", "boss_background1"],    //背景音乐

        //        //*以下属性不拷贝到Boss操作类中，用于预加载

        //        //所有的音乐
        //        total_music: [],
        //        total_img: [],



        //参数设置
        config: {
            //可以使用的技能  { 技能名   概率 正处于技能持续时间中的标志 是否为大招(是则值为.mp3文件的地址，否则为false)（注意！使用大招时，系统会暂停5s，因此如果大招有持续时间的话，需要加上这5s！）   
            //  技能图片/gif动画    大招技能说明信息    技能音效    boss使用该技能说的话      小技能系统说明信息    什么时候判断     参数}
            ability: [
            {   name: "逃跑",   
                probability: 0.2,   //概率
                big: false,     //是否为大招
                img: "Image/Ability/Escape.gif",    //技能图片/gif动画
                imgInfo: "逃跑",  //大招技能说明信息

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/Escape.mp3", "Escape"],  //技能音效
                say: "好汉不吃眼前亏！我闪~", //boss使用该技能说的话
                systemInfo: "Boss逃离战斗，玩家挑战失败。", //小技能系统说明信息
                when: "onPlayerElimination",    //什么时候发动
                value: [2, 20]   //技能参数
            },
            { name: "防护",
                probability: 0.4,   
                //正处于技能持续时间中的标志，用于判断是否发动技能。
                //如果效果可以叠加，则没有该项属性；
                //如果效果不能叠加，则增加该项属性。
                flag: false,

                big: false,
                img: "Image/Ability/Protect.gif",
                imgInfo: "防护",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/Protect.mp3", "Protect"],  //技能音效
                say: "看来我要加强防守了！",
                systemInfo: "{0}秒内，Boss对玩家道具攻击免疫。",
                when: "onPlayerAttackByProp",
                value: [8]   //持续时间
            },
            { name: "符文攻击",
                probability: 0.1,
                //正处于技能持续时间中的标志，用于判断是否发动技能。
                //如果效果可以叠加，则没有该项属性；
                //如果效果不能叠加，则增加该项属性。
                flag: false,

                big: false,
                img: "Image/Ability/RuneAttack.gif",
                imgInfo: "符文攻击",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/RuneAttack.mp3", "RuneAttack"],  //技能音效
                say: "封住你的穴位！",
                systemInfo: "{2}秒内，玩家计时器加速{0}，玩家消方块加的时间减少{1}。",
                when: "onPlayerElimination",
                value: [20, 2, 5]   //玩家计时器加速值 玩家消去方块加的时间减少值 持续时间
            },
            { name: "群雷轰击",
                probability: 0.2,
                big: true,
                img: "Image/Ability/Thunder.gif",
                imgInfo: "群雷轰击",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/Thunder.mp3", "Thunder"],  //技能音效
                say: "闪电，赐予我力量吧！",
                systemInfo: "Boss立即消去{0}对方块，并且在{3}秒内每隔{2}秒消去{1}对方块。",
                when: "onPlayerDoubleHit",
                value: [3, 4, 6, 2, 2, 6]   //玩家连击数 剩余方块数差 Boss立刻消去的方块对数 Boss每次间隔时间消去的方块对数 间隔时间 持续时间 
            }
            ],

            //            ability: [{ name: "Harvest", probability: 0.02,
            //                big: false,
            //                img: "Image/Ability/Harvest",
            //                imgInfo: "丰收",
            //                say: "丰收吧！",
            //                systemInfo: "使用技能“丰收”",
            //                when: "onBossElimination",
            //                value: [200]   //玩家增加的得分
            //            }],



            //小技能施法时间(s)（boss放小技能时，暂停消方块的时间）
            boss_smallAbility_time: 2.5,
            //Boss消方块速度
            ai_speed: 2,
            //玩家计时器速度
            time_speed: 12,
            //消去方块时，玩家计时器加的时间
            addTime: 18,
            //玩家初始的道具数
            prop_findPath: 5,
            prop_rearrangement: 5,
            prop_bomb: 5,
            prop_stop: 1,
            prop_roadBlock: 1,
            prop_mirror: 1
        },
        OnStart: function () {
            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
            LianLianKan.UI_Info.ShowUpInfo("你好啊！能交个朋友吗？", -1, true);
        },
        OnEnd: function (type) {
            switch (type) {
                case "win":
                    LianLianKan.UI_Info.ShowUpInfo("嘿嘿~承让啦~", -1, true);
                    break;
                case "lose":
                    LianLianKan.UI_Info.ShowUpInfo("佩服！不过我可是越战越强的哦！", -1, true);
                    break;
                default:
                    LianLianKan.UI_Info.ShowUpInfo(type.toString(), -1, true);
                    break;
            }
        },
        Dispose: function () {
        }
    }
});

//加入实例
SingleBoss.Add(Boss_Player_Small);




//花仙女
var Boss_Player_FlowerGirl = MyClass(Parent_Boss_Player, {
    //构造函数
    Init: function (opt) {
    },
    Public: {
        //Boss姓名
        name: "花仙女",
        //         index: 6,

        //这两项在选择Boss时再根据cookie中保存的值进行设置
        experience: 0,
        level: 1,

        index: "2",
        img: "Image/BossHead/花仙女.jpg",    //未挑战成功的boss的头像
        img_gray: "Image/BossHead/花仙女_gray.jpg",   //已挑战成功的boss的头像（灰色）
        minNum: 40,     //地图最小要求的方块数，如果为0则不限制地图
        minScore: -1000, //玩家需要获得该得分才可以挑战
        text: "回春：一段时间内，Boss消方块加速，Boss解除禁手效果，Boss对玩家道具攻击免疫。<br>"
        + "迅捷：一段时间内，Boss消方块加速，Boss小技能施法时间减少。<br>"
        + "蓄力一击：Boss立即消去一定数量方块，玩家禁手数秒。<br>"
        + "火舞：Boss立即消去一定数量方块，玩家立即增加一定数量方块，一段时间内Boss消方块加速。",    //boss说明

        background_music: ["Sound/Boss/boss_background2.mp3", "boss_background2"],    //背景音乐

        //        //*以下属性不拷贝到Boss操作类中，用于预加载

        //        //所有的音乐
        //        total_music: [],
        //        total_img: [],



        //参数设置
        config: {
            ability: [
            { name: "回春",
                probability: 0.2,
                //正处于技能持续时间中的标志，用于判断是否发动技能。
                //如果效果可以叠加，则没有该项属性；
                //如果效果不能叠加，则增加该项属性。
                flag: false,

                big: false,
                img: "Image/Ability/Resume.gif",
                imgInfo: "回春",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/Resume.mp3", "Resume"],  //技能音效
                say: "快快回复~",
                systemInfo: "{1}秒内，Boss消方块加速{0}，Boss解除禁手效果，Boss对玩家道具攻击免疫。",
                when: "onPlayerElimination",
                value: [6, 0.5, 6]   //剩余方块数差 Boss消方块速度增加值 持续时间
            },
            { name: "迅捷",
                probability: 0.08,
                big: false,
                img: "Image/Ability/Fast.gif",
                imgInfo: "迅捷",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/Fast.mp3", "Fast"],  //技能音效
                say: "你能抓的住我吗？",
                systemInfo: "{2}秒内，Boss消方块加速{0}，Boss小技能施法时间减少{1}秒。",
                when: "onBossElimination",
                value: [1, 0.4, 5]   //Boss消方块速度增加值 小技能施法时间减少值 持续时间
            },
            { name: "蓄力一击",
                probability: 0.2,
                big: false,
                img: "Image/Ability/StrengthAttack.gif",
                imgInfo: "蓄力一击",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/StrengthAttack.mp3", "StrengthAttack"],  //技能音效
                say: "喝！",
                systemInfo: "Boss立即消去{0}对方块，玩家禁手{1}秒。",
                when: "onBossElimination",
                value: [-6, 3, 2]   //剩余方块数差 Boss消去的方块对数 玩家禁手时间
            },
            { name: "火舞",
                probability: 0.2,
                //正处于技能持续时间中的标志，用于判断是否发动技能。
                //如果效果可以叠加，则没有该项属性；
                //如果效果不能叠加，则增加该项属性。
                flag: false,

                big: true,
                img: "Image/Ability/FireDance.gif",
                imgInfo: "火舞",

                /*不能包含中文！
                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/FireDance.mp3", "FireDance"],  //技能音效
                say: "悄悄地告诉你，我可是舞蹈10级哦~",
                systemInfo: "Boss立即消去{0}对方块，玩家立即增加{1}对方块，{3}秒内Boss消方块加速{2}。",
                when: "onBossElimination",
                value: [40, 4, 4, 4, 1, 2]   //玩家剩余方块数 剩余方块数差 Boss消去的方块对数 玩家增加的方块对数 Boss消方块速度增加值 持续时间
            }
            ],

            //            ability: [{ name: "Harvest", probability: 0.02,
            //                big: false,
            //                img: "Image/Ability/Harvest",
            //                imgInfo: "丰收",
            //                say: "丰收吧！",
            //                systemInfo: "使用技能“丰收”",
            //                when: "onBossElimination",
            //                value: [200]   //玩家增加的得分
            //            }],



            //小技能施法时间(s)（boss放小技能时，暂停消方块的时间）
            boss_smallAbility_time: 2,
            //Boss消方块速度
            ai_speed: 2.5,
            //玩家计时器速度
            time_speed: 12,
            //消去方块时，玩家计时器加的时间
            addTime: 18,
            //玩家初始的道具数
            prop_findPath: 5,
            prop_rearrangement: 5,
            prop_bomb: 5,
            prop_stop: 1,
            prop_roadBlock: 1,
            prop_mirror: 1
        },
        OnStart: function () {
            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
            LianLianKan.UI_Info.ShowUpInfo("神仙？妖怪？谢谢！", -1, true);
        },
        OnEnd: function (type) {
            switch (type) {
                case "win":
                    LianLianKan.UI_Info.ShowUpInfo("嘻嘻~不要让小女子哦~", -1, true);
                    break;
                case "lose":
                    LianLianKan.UI_Info.ShowUpInfo("呜呜~你欺负我！", -1, true);
                    break;
                default:
                    LianLianKan.UI_Info.ShowUpInfo(type.toString(), -1, true);
                    break;
            }
        },
        Dispose: function () {
        }
    }
});

//加入实例
SingleBoss.Add(Boss_Player_FlowerGirl);



//战神
var Boss_Player_Mars = MyClass(Parent_Boss_Player, {
    //构造函数
    Init: function (opt) {
    },
    Public: {
        //Boss姓名
        name: "战神",
        //         index: 6,

        //这两项在选择Boss时再根据cookie中保存的值进行设置
        experience: 0,
        level: 1,

        index: "3",
        img: "Image/BossHead/战神.jpg",    //未挑战成功的boss的头像
        img_gray: "Image/BossHead/战神_gray.jpg",   //已挑战成功的boss的头像（灰色）
        minNum: 40,     //地图最小要求的方块数，如果为0则不限制地图
        minScore: -1000, //玩家需要获得该得分才可以挑战
        text: "狂暴：一段时间内，Boss消方块加速，技能效果提升。<br>"
        + "反击：玩家受到同样的效果。<br>"
        + "暴击：Boss立即消去一定数量方块。<br>"
        + "秒杀：Boss瞬间消完所有方块。",    //boss说明

        background_music: ["Sound/Boss/boss_background3.mp3", "boss_background3"],    //背景音乐

//        //*以下属性不拷贝到Boss操作类中，用于预加载

//        //所有的音乐
//        total_music: [],
//        total_img: [],



        //参数设置
        config: {
            ability: [
            { name: "狂暴",
                probability: 0.1,
                //正处于技能持续时间中的标志，用于判断是否发动技能。
                //如果效果可以叠加，则没有该项属性；
                //如果效果不能叠加，则增加该项属性。
                flag: false,

                big: false,
                img: "Image/Ability/Rage.gif",
                imgInfo: "狂暴",

                /*不能包含中文！
                                music: ["Sound/Ability/狂暴.mp3", "狂暴"],  //技能音效
                */
                music: ["Sound/Ability/Rage.mp3", "Rage"],  //技能音效
                say: "啊~~~~我要宰了你！",
                systemInfo: "{2}秒内，Boss消方块加速{0}，技能效果提升{1}级，技能瞬发。",
                //                when: "onPlayerFast",
                when: "onPlayerElimination",
                value: [-10, 1, 4, 8]   //剩余方块数差 Boss消方块速度属性增加值 等级提升值 持续时间  
            },
            {   name: "反击", 
                probability: 0.5,
                big: false,
                img: "Image/Ability/BeatBack.gif",
                imgInfo: "反击",
                music: ["Sound/Ability/BeatBack.mp3", "BeatBack"],  //技能音效
                say: "你也吃我一招！",
                systemInfo: "玩家受到同样的效果，效果提升{0}级",
                when: "onPlayerAttackByProp",     //反击    玩家对boss使用道具时判断
                value: []
            },
            {   name: "暴击", 
                probability: 0.2,
                big: false,
                img: "Image/Ability/Crit.gif",
                imgInfo: "暴击",
                music: ["Sound/Ability/Crit.mp3", "Crit"],  //技能音效
                say: "雷霆一击！",
                systemInfo: "Boss立即消去{0}对方块。",
                when: "onBossElimination",
                value: [6]  //消去6对方块
            },
                        { name: "秒杀",
                            probability: 0.15,
                            big: true,
                            img: "Image/Ability/Kill.gif",
                            imgInfo: "秒杀",
                            music: ["Sound/Ability/Kill.mp3", "Kill"],  //技能音效
                            say: "想赢我？没这么简单！",
                            systemInfo: "Boss消完所有方块。",
                            when: "onPlayerElimination",
                            value: [20] //玩家剩余方块数
                        }
            ],

            //            ability: [{ name: "Harvest", probability: 0.02,
            //                big: false,
            //                img: "Image/Ability/Harvest",
            //                imgInfo: "丰收",
            //                say: "丰收吧！",
            //                systemInfo: "使用技能“丰收”",
            //                when: "onBossElimination",
            //                value: [200]   //玩家增加的得分
            //            }],


            //小技能施法时间(s)（boss放小技能时，暂停消方块的时间）
            boss_smallAbility_time: 3,
            //Boss消方块速度
            ai_speed: 1.5,
            //玩家计时器速度
            time_speed: 14,
            //消去方块时，玩家计时器加的时间
            addTime: 16,
            //玩家初始的道具数
            prop_findPath: 7,
            prop_rearrangement: 7,
            prop_bomb: 7,
            prop_stop: 2,
            prop_roadBlock: 2,
            prop_mirror: 2
        },
        OnStart: function () {
            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
            LianLianKan.UI_Info.ShowUpInfo("来者何人？竟有胆子向我挑战？让你见识一下本大爷的厉害！", -1, true);
        },
        OnEnd: function (type) {
            switch (type) {
                case "win":
                    LianLianKan.UI_Info.ShowUpInfo("这就是实力的差距！", -1, true);
                    break;
                case "lose":
                    LianLianKan.UI_Info.ShowUpInfo("不错嘛！不过这只是我的热身准备而已，下一次你就别想这么轻松地赢我了！", -1, true);
                    break;
                default:
                    LianLianKan.UI_Info.ShowUpInfo(type.toString(), -1, true);
                    break;
            }
        },
        Dispose: function () {
        }
    }
});

//加入实例
SingleBoss.Add(Boss_Player_Mars);




////新手
//var Boss_Player_Beginner = MyClass(Parent_Boss_Player, {
//    //构造函数
//    Init: function (opt) {
//        //            if (opt) {
//        //                this.name = opt.name;
//        //                this.experience = opt.experience;
//        //                this.level = opt.level > 5 ? 5 : opt.level;     //等级最大为5级

//        //                this.config.ability = operate.Clone(opt.config.ability);
//        //                this.config.ai_speed = opt.config.ai_speed;
//        //                this.config.time_speed = opt.config.time_speed;
//        //                this.config.addTime = opt.config.addTime;
//        //            }



//        //获得Boss数据
////        this.name = Data_Boss.GetName();
////        this.experience = Data_Boss.GetExperience();
////        this.level = Data_Boss.GetLevel();

////        this.config.ai_speed = Data_Boss.GetAi_speed();
////        this.config.time_speed = Data_Boss.GetTime_speed();
////        this.config.addTime = Data_Boss.GetAddTime();
//    },
//    Public: {
//        //Boss姓名
//        name: "新手",
//        //序号，用于判断玩家是否已挑战过该boss
//        index: 1,
//        img: "Image/BossHead/新手.jpg",    //未挑战成功的boss的头像
//        img_gray: "Image/BossHead/新手_gray.jpg",   //已挑战成功的boss的头像（灰色）
//        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
//        minScore: 0, //玩家需要获得该得分才可以挑战
//        text: "新手说明",    //boss说明
//        


//        //参数设置
//        config: {
//            //可以使用的技能  { 技能名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)  什么时候判断}
//            ability: [],
//            //Boss消方块速度
//            ai_speed: 0.5,
//            //玩家计时器速度
//            time_speed: 2,
//            //消去方块时，玩家计时器加的时间
//            addTime: 5,
//            //玩家初始的道具数
//            prop_findPath: 3,
//                    prop_rearrangement: 3,
//                    prop_bomb: 9,
//                    prop_stop: 9,
//                    prop_roadBlock: 9,
//                    prop_mirror: 9
//                },

////        config: {
////            //可以使用的技能  { 技能名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)  什么时候判断}
////            ability: [{ name: "Harvest", probability: 1, big: false, when: "onBossElimination"}],
////            //Boss消方块速度
////            ai_speed: 1,
////            //玩家计时器速度
////            time_speed: 5,
////            //消去方块时，玩家计时器加的时间
////            addTime: 5
////        },

////        //使用技能
////        Use: function (ability) {
////            //            ability.Do();
////            this.base(ability);
////        },
//        OnStart: function () {
//            //            this.name = "aa";
//            //            console.log(this.name);
//            //            console.log(this.experience);
//            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
//        },
//        OnEnd: function (type) {
////            console.log("OnEnd");
////            console.log(this.name);
////            console.log(type);
//            switch (type) {
//                case "win":
//                    LianLianKan.UI_Info.ShowRightInfo("我居然赢了！哈哈！", -1);
//                    break;
//                case "lose":
//                    //                    LianLianKan.UI_Info.ShowRightInfo("骚年，这只是刚开始而已！");
//                    LianLianKan.UI_Info.ShowRightInfo("你能赢后面的boss吗？", -1);
//                    break;
//                default:
//                    break;
//            }
//        },
//        Dispose: function () {
//        }
//    }
//});

////加入实例
//SingleBoss.Add(Boss_Player_Beginner);



////农民伯伯
//var Boss_Player_Farmer = MyClass(Parent_Boss_Player, {
//    //构造函数
//    Init: function (opt) {
//        //            if (opt) {
//        //                this.name = opt.name;
//        //                this.experience = opt.experience;
//        //                this.level = opt.level > 5 ? 5 : opt.level;     //等级最大为5级

//        //                this.config.ability = operate.Clone(opt.config.ability);
//        //                this.config.ai_speed = opt.config.ai_speed;
//        //                this.config.time_speed = opt.config.time_speed;
//        //                this.config.addTime = opt.config.addTime;
//        //            }

//        //获得Boss数据
//        //            this.name = Data_Boss.GetName();
//        //        this.experience = Data_Boss.GetExperience();
//        //        this.level = Data_Boss.GetLevel();

//        //                    this.config.ai_speed = Data_Boss.GetAi_speed();
//        //        this.config.time_speed = Data_Boss.GetTime_speed();
//        //        this.config.addTime = Data_Boss.GetAddTime();
//    },
//    Public: {
//        //Boss姓名
//        name: "农民伯伯",
//        //序号，用于判断玩家是否已挑战过该boss
//        index: 2,
//        img: "Image/BossHead/农民伯伯.jpg",    //未挑战成功的boss的头像
//        img_gray: "Image/BossHead/农民伯伯_gray.jpg",   //已挑战成功的boss的头像（灰色）
//        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
//        minScore: 0, //玩家需要获得该得分才可以挑战
//        text: "新手说明",    //boss说明



//        //参数设置
//        config: {
//            //可以使用的技能  { 技能名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)   技能图片/gif动画    技能说明信息
//            //  boss使用该技能说的话      系统信息    什么时候判断     参数}
//            ability: [{ name: "Harvest", probability: 1,    //0.02
//                big: false,
//                img: "Image/Ability/Harvest.gif",
//                imgInfo: "丰收",
//                say: "丰收吧！",
//                systemInfo: "使用技能“丰收”",
//                when: "onBossElimination",
//                value: [200]   //玩家增加的得分
//            }],

//            //Boss消方块速度
//            ai_speed: 1,
//            //玩家计时器速度
//            time_speed: 5,
//            //消去方块时，玩家计时器加的时间
//            addTime: 5,
//            //玩家初始的道具数
//            prop_findPath: 3,
//            prop_rearrangement: 3,
//            prop_bomb: 9,
//            prop_stop: 9,
//            prop_roadBlock: 9,
//            prop_mirror: 9
//        },
//        //        //使用技能
//        //        Use: function (ability) {
//        //            //            ability.Do();
//        //            this.base(ability);

//        //            //判断是否为大招（播放声音、显示信息/图片）

//        //            //如果不是大招，则播放普通声音，显示信息/图片

//        //            //如果技能有限制逻辑，此处添加（如“技能效果持续10s 效果不能叠加 只有效果消失后，才可能再使用该技能”）
//        //        },
//        OnStart: function () {
//            //系统信息
//            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
//            //Boss说话
//            LianLianKan.UI_Info.ShowUpInfo("一分耕耘，一分收获~", 5, true);
//        },
//        OnEnd: function (type) {
//            switch (type) {
//                case "win":
//                    LianLianKan.UI_Info.ShowUpInfo("霍霍~小伙子再练练吧！", 0, true);
//                    break;
//                case "lose":
//                    LianLianKan.UI_Info.ShowUpInfo("恩~是个棒小伙！", 0, true);
//                    break;
//                default:
//                    break;
//            }
//        },
//        Dispose: function () {
//        }
//    }
//});

////加入实例
//SingleBoss.Add(Boss_Player_Farmer);





//////火枪狙击手
////var Boss_Player_Hackbuteer = MyClass(Parent_Boss_Player, {
////    //构造函数
////    Init: function (opt) {
////    },
////    Public: {
////        //Boss姓名
////        name: "火枪狙击手",
////        index: 3,
////        img: "Image/BossHead/火枪狙击手.jpg",    //未挑战成功的boss的头像
////        img_gray: "Image/BossHead/火枪狙击手_gray.jpg",   //已挑战成功的boss的头像（灰色）
////        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
////        minScore: 0, //玩家需要获得该得分才可以挑战
////        text: "新手说明",    //boss说明



////        //参数设置
////        config: {
////            ability: [{ name: "Snipe", probability: 0.2, big: false, when: "onPlayerFast",
////                value: [6, 6]   //剩余方块数差 玩家增加的方块对数
////            }],

////            //Boss消方块速度
////            ai_speed: 1,
////            //玩家计时器速度
////            time_speed: 5,
////            //消去方块时，玩家计时器加的时间
////            addTime: 5,
////            //玩家初始的道具数
////            prop_findPath: 3,
////            prop_rearrangement: 3,
////            prop_bomb: 9,
////            prop_stop: 9,
////            prop_roadBlock: 9,
////            prop_mirror: 9
////        },
////        OnStart: function () {
////            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
////        },
////        OnEnd: function (type) {
////            switch (type) {
////                case "win":
////                    LianLianKan.UI_Info.ShowRightInfo("霍霍~小伙子再练练吧！", -1);
////                    break;
////                case "lose":
////                    LianLianKan.UI_Info.ShowRightInfo("恩~是个棒小伙！", -1);
////                    break;
////                default:
////                    break;
////            }
////        },
////        Dispose: function () {
////        }
////    }
////});


//////加入实例
////SingleBoss.Add(Boss_Player_Hackbuteer);






////屠夫
//var Boss_Player_Butcher = MyClass(Parent_Boss_Player, {
//    //构造函数
//    Init: function (opt) {
//    },
//    Public: {
//        //Boss姓名
//        name: "屠夫",
//        index: 4,
//        img: "Image/BossHead/屠夫.jpg",    //未挑战成功的boss的头像
//        img_gray: "Image/BossHead/屠夫_gray.jpg",   //已挑战成功的boss的头像（灰色）
//        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
//        minScore: 0, //玩家需要获得该得分才可以挑战
//        text: "新手说明",    //boss说明



//        //参数设置
//        config: {
//            //可以使用的技能  { 技能名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)  什么时候判断     参数}
//            ability: [{ name: "Dismember", probability: 0.2, big: true, when: "onPlayerDoubleHit",
//                value: [4, 5]   //玩家连击数 禁手时间
//            }],

//            //Boss消方块速度
//            ai_speed: 1,
//            //玩家计时器速度
//            time_speed: 5,
//            //消去方块时，玩家计时器加的时间
//            addTime: 5,
//            //玩家初始的道具数
//            prop_findPath: 3,
//            prop_rearrangement: 3,
//            prop_bomb: 9,
//            prop_stop: 9,
//            prop_roadBlock: 9,
//            prop_mirror: 9
//        },
//        OnStart: function () {
//            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
//        },
//        OnEnd: function (type) {
//            switch (type) {
//                case "win":
//                    LianLianKan.UI_Info.ShowRightInfo("霍霍~小伙子再练练吧！", -1);
//                    break;
//                case "lose":
//                    LianLianKan.UI_Info.ShowRightInfo("恩~是个棒小伙！", -1);
//                    break;
//                default:
//                    break;
//            }
//        },
//        Dispose: function () {
//        }
//    }
//});


////加入实例
//SingleBoss.Add(Boss_Player_Butcher);



////复仇之魂
//var Boss_Player_Revenge = MyClass(Parent_Boss_Player, {
//    //构造函数
//    Init: function (opt) {
//    },
//    Public: {
//        //Boss姓名
//        name: "复仇之魂",
//         index: 5,
//        img: "Image/BossHead/复仇之魂.jpg",    //未挑战成功的boss的头像
//        img_gray: "Image/BossHead/复仇之魂_gray.jpg",   //已挑战成功的boss的头像（灰色）
//        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
//        minScore: 0, //玩家需要获得该得分才可以挑战
//        text: "新手说明",    //boss说明



//        //参数设置
//        config: {
// //可以使用的技能  { 技能名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)  什么时候判断     参数}
//            ability: [
//            { name: "Roar", probability: 0.1, big: false, when: "onPlayerFast",
//                value: [10, 5, 3]   //剩余方块数差 属性增加值 持续时间  
//            },
//            { name: "Disturb", probability: 0.05, big: true, when: "onPlayerElimination",
//                value: []
//            }
//            ],   

//            //Boss消方块速度
//            ai_speed: 1,
//            //玩家计时器速度
//            time_speed: 5,
//            //消去方块时，玩家计时器加的时间
//            addTime: 5,
//            //玩家初始的道具数
//            prop_findPath: 3,
//            prop_rearrangement: 3,
//            prop_bomb: 9,
//            prop_stop: 9,
//            prop_roadBlock: 9,
//            prop_mirror: 9
//        },
//        OnStart: function () {
//            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
//        },
//        OnEnd: function (type) {
//            switch (type) {
//                case "win":
//                    LianLianKan.UI_Info.ShowRightInfo("霍霍~小伙子再练练吧！", -1);
//                    break;
//                case "lose":
//                    LianLianKan.UI_Info.ShowRightInfo("恩~是个棒小伙！", -1);
//                    break;
//                default:
//                    break;
//            }
//        },
//        Dispose: function () {
//        }
//    }
//});

////加入实例
//SingleBoss.Add(Boss_Player_Revenge);





//////终结者
////var Boss_Player_Terminator = MyClass(Parent_Boss_Player, {
////    //构造函数
////    Init: function (opt) {
////    },
////    Public: {
////        //Boss姓名
////        name: "终结者",
////        //         index: 6,
////        index: 3,
////        img: "Image/BossHead/终结者.jpg",    //未挑战成功的boss的头像
////        img_gray: "Image/BossHead/终结者_gray.jpg",   //已挑战成功的boss的头像（灰色）
////        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
////        minScore: 0, //玩家需要获得该得分才可以挑战
////        text: "新手说明",    //boss说明



////        //参数设置
////        config: {
//////可以使用的技能  { 技能名   概率 是否为大招(是则值为.mp3文件的地址，否则为false)  什么时候判断     参数}
////            ability: [
////            { name: "Rage", probability: 0.5, big: false,
////                img: "Image/Ability/Harvest.gif",
////                                imgInfo: "丰收",
////                                say: "丰收吧！",
////                                systemInfo: "使用技能“丰收”",
////            when: "onPlayerFast",
////                value: [10, 8, 5]   //剩余方块数差 属性增加值 持续时间  
////            },
////            { name: "Kill", probability: 0.5, big: true,
////                img: "Image/Ability/Kill.gif",
////                imgInfo: "丰收",
////                say: "丰收吧！",
////                systemInfo: "使用技能“丰收”",
////            when: "onPlayerElimination",
////                value: [20] //玩家剩余方块数
////            },
////            { name: "BeatBack", probability: 0.5, big: true,
////                img: "Image/Ability/BeatBack.gif",
////                imgInfo: "丰收",
////                say: "丰收吧！",
////                systemInfo: "使用技能“丰收”",
////            when: "onPlayerAttackByProp",     //反击    玩家对boss使用道具时判断
////                value: []
////            },
////            { name: "Crit", probability: 0.5, big: false,
////                img: "Image/Ability/BeatBack.gif",
////                imgInfo: "丰收",
////                say: "丰收吧！",
////                systemInfo: "使用技能“丰收”",
////            when: "onBossElimination",
////                value: [6]
////            }
////            ],

//////            ability: [{ name: "Harvest", probability: 0.02,
//////                big: false,
//////                img: "Image/Ability/Harvest",
//////                imgInfo: "丰收",
//////                say: "丰收吧！",
//////                systemInfo: "使用技能“丰收”",
//////                when: "onBossElimination",
//////                value: [200]   //玩家增加的得分
//////            }],


////            //Boss消方块速度
////            ai_speed: 1,
////            //玩家计时器速度
////            time_speed: 5,
////            //消去方块时，玩家计时器加的时间
////            addTime: 5,
////            //玩家初始的道具数
////            prop_findPath: 3,
////            prop_rearrangement: 3,
////            prop_bomb: 9,
////            prop_stop: 9,
////            prop_roadBlock: 9,
////            prop_mirror: 9
////        },
////        OnStart: function () {
////            LianLianKan.UI_Info.ShowRightInfo("开始挑战" + this.name, -1);
////        },
////        OnEnd: function (type) {
////            switch (type) {
////                case "win":
////                    LianLianKan.UI_Info.ShowRightInfo("霍霍~小伙子再练练吧！", -1);
////                    break;
////                case "lose":
////                    LianLianKan.UI_Info.ShowRightInfo("恩~是个棒小伙！", -1);
////                    break;
////                default:
////                    break;
////            }
////        },
////        Dispose: function () {
////        }
////    }
////});

//////加入实例
////SingleBoss.Add(Boss_Player_Terminator);
