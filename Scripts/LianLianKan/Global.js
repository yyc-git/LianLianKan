//判断浏览器是否为ie7
var ie7 = document.getElementById("ie7") !== null ? true : false;

//容器类
var LianLianKan = {
    //*全局实例


    UI_CommonMap: null,
    UI_SmallMap: null,

    //        Algorithm: null,

    //主界面操作类
    Operate_UI: null,
    //玩家操作类
    Operate_Single: null,
    //Boss操作类
    Operate_Boss: null,
    //当前选择的操作类（玩家或boss操作类）
    Operate: null,

    //*界面类

    //页面
    UI_Page: null,

    //信息
    UI_Info: null,

    //        //游戏玩家类
    //        Game_Player: null,


    Sound: null,     //声音对象
    //预加载图片实例
    ImgLoader: null,


    //        algorithm: null,    //算法
    //        prop: null,     //道具




    //*设置

    config: {
        //常量

        //地图行数
        ROW: 10,
        //地图列数
        COL: 20,

        //大地图td的宽度和高度
        BIGWIDTH: 31,
        BIGHEIGHT: 35,

        //小地图td的宽度和高度
        SMALLWIDTH: 10,
        SMALLHEIGHT: 12,

        //声音（[路径, ID值]）
        MUSIC: [['Sound/start.mp3', 'start'], ['Sound/sel.mp3', 'sel'], ['Sound/elec.mp3', 'elec'], ['Sound/lose.mp3', 'lose'], ['Sound/win.mp3', 'win'], ['Sound/single_background.mp3', 'single_background'],
        ['Sound/Prop/bomb.mp3', 'bomb'], ['Sound/Prop/prop.mp3', 'prop'], ['Sound/Prop/findPath.mp3', 'findPath'], ['Sound/Prop/rearrangement.mp3', 'rearrangement']],
        //方块图标种类数
        IMGAGECOUNT: 40,



        //            //计时器速度
        //            speed: 5,
        //            //消去方块时，计时器加的时间
        //            addTime: 0,
        //            //Boss消方块速度
        //            speed_ai: 0,
        //计时器最大时间
        MAXTIME: 328,




    //小技能最小施法时间
    min_smallAbility_time: 1,



    //背景音乐开关
    music: true,


    //音效开关
    sound: true


    //*游戏难度对应的参数更改
    //_SetByDifficulity/__SetByDifficulity

//    easy: {
//        time_speed: -4,
//        addTime: 4,
//        ai_speed: -2
//    },
//    normal: {
//        time_speed: 0,
//        addTime: 0,
//        ai_speed: 0
//    },
//    hard: {
//         time_speed: 4,
//        addTime: -4,
//        ai_speed: 2
//    },


    //*玩家得分和对应的等级
    //Operate_Single.js _Result_Level


//    score_level:[[0, "菜鸟"], [1000, "新手"], [3000, "大杀特杀"], [8000, "主宰比赛"],
//    [20000, "妖怪般的杀戮"], "Hole Shit"],



    //*根据连击数增加道具
    //Operate_Single.js _AddPropByDoubleHit

    //连击数 增加的道具数 增加的道具种类("player/boss/all)
//    addPropByDoubleHit: [[5, 1, "player"], [8, 1, "all"], [12, 1, "all"], [20, 1, "all"], [25, 1, "all"]],



    //*游戏结束后，单人游戏模式下玩家得分计算
    //Operate_Single.js P_Result_Score

    //*游戏结束后，挑战Boss模式下玩家得分计算
    //Operate_Boss.js P_Result_Score

    //*游戏结束后，Boss获得的经验值
    //Operate_Boss.js __Result_Experience

    //*Boss等级计算
    //Operate_Boss.js __Result_Level

    //*根据Boss的level，修正Boss和玩家属性
    //Operate_Boss.js __SetBossByLevel


    },

    //*全局属性

//    //主界面菜单栏
//    menu: null,

    //玩家得分
    score: 0,
    //玩家姓名
    playerName: "",
    //已挑战成功的boss序号
    boss_index: "",

//    //boss数量
//    boss_num: 6,


    //难度
    //默认为正常
    difficulity: 2,


    //第一个计时器序号，用于在ie下暴力清除所有的计时器
    timer_firstIndex: 0,


    //*状态（状态值改为从1开始）

    //游戏难度
    Difficulity: {
        Easy: 1,
        Normal: 2,
        Hard: 3
    },


//    //道具状态
//    propStatus: null,

//    PropStatus: {
//        None: 1,
//        RoadBlock: 2,
//        Stop: 3
//    },

//    //技能状态
//    abilityStatus: null,

//    //?待补充
//    AbilityStatus: {
//        None: 1,
////        Shout: 2,
////        //变身
////        Transfiguration : 3
//        AddPlayer: 2,    //持续时间大于0的增加玩家属性
//        AddBoss: 3,    //持续时间大于0的增加Boss属性
//        SubtractPlayer: 4,    //持续时间大于0的减少玩家属性
//        SubtractBoss: 5    //持续时间大于0的减少Boss属性
//    },



//    //玩家状态
//    playerStatus: null,
//    PlayerStatus: {
//        None: 1,
//        Stop: 2,    //禁手
//        AddBlock: 3     //玩家增加方块

////        Add: 3,    //持续时间大于0的增加属性
////        Subtract: 4    //持续时间大于0的减少属性
//    //    Reverse: 5,     //反向
//    //    Rearrangement: 6    //重列
//    },

//    //boss状态
//    bossStatus: null,
//    BossStatus: {
//        None: 1,
//        Stop: 2,    //禁手
//        AddBlocl: 3    //Boss增加方块
//    },


        //游戏状态
    gameStatus: null,
    //枚举游戏状态
    Status: {
        None: 1,
        Wait: 2,
        Pause: 3,
        Gaming: 4,
        Stop: 5
    },

    //游戏模式
    pattern: null,
    Pattern: {
        None: 1,
        Single: 2,  //单人游戏
        Boss: 3   //挑战boss
    },


    //*标志

//    //boss施放技能标志
//    boss_beginAbility: false,


    //玩家禁手标志
    player_stop_flag: false,

    //玩家增加方块标志
    player_addBlock_flag: false,

    //boss禁手标志
    boss_stop_flag: false,

    //boss增加方块标志
    boss_addBlock_flag: false,


    //持续时间大于0的增加玩家属性标志
    player_addAttribute_flag: false,

    //持续时间大于0的减少玩家属性标志
    player_substractAttribute_flag: false,

    //持续时间大于0的增加boss属性标志
    boss_addAttribute_flag: false,

    //持续时间大于0的减少boss属性标志
    boss_substractAttribute_flag: false


};