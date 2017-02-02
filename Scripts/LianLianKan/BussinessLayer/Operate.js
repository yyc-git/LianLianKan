
//*游戏操纵基类
var Abstract_Operate_Game = MyAbstract({
    Protected: {
        P_Pause: function () {
            //            this._operate.Pause();
            if (LianLianKan.gameStatus === LianLianKan.Status.Gaming) {
                LianLianKan.gameStatus = LianLianKan.Status.Pause;
                //菜单栏显示为“继续”
                LianLianKan.UI_Page.menu.SetText([0, 1], "继续");
                //页面暂停
                //                    LianLianKan.UI_Info.ShowInfo("暂停");
                return false;
            }
        },
        //继续
        P_Continue: function () {
            //            this._operate.Continue();
            if (LianLianKan.gameStatus === LianLianKan.Status.Pause) {
                LianLianKan.gameStatus = LianLianKan.Status.Gaming;
                //菜单栏显示为“暂停”
                LianLianKan.UI_Page.menu.SetText([0, 1], "暂停");
                //页面恢复
                //                    LianLianKan.UI_Info.ShowInfo("继续");
                return false;
            }
        },
        //*清除计时器

        P_ClearTimeout: function (timer) {
            window.clearTimeout(timer);
            timer = 0;
        },
        P_ClearInterval: function (timer) {
            window.clearInterval(timer);
            timer = 0;
        }
    },
    Public: {
        //        //暂停
        //        Pause: function () {
        //        },
        //        //恢复
        //        Continue: function () {
        //        },
        Virtual: {
            GameOver: function (type, result) {
                //                console.log("Operate type = " + type);
                LianLianKan.gameStatus = LianLianKan.Status.Stop;


                //结束音效
                LianLianKan.Sound && LianLianKan.Sound.StopAll();

                //                //播放结束音效
                //                LianLianKan.Sound && LianLianKan.Sound.Play("end");


                //显示胜利/失败图片
                switch (type) {
                    case "win": //win
                        //                    alert("你赢了！");
                        LianLianKan.UI_Info.ShowCenter("Image/win.gif", "+" + result.score + "分", -1);
                        //播放胜利音效
                        LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("win");
                        //                  
                        //                                msg.className = "win";
                        //                                score = gameInfo.count * 2 - gameInfo.time;
                        //                                score += proInfo.reset * 8 + proInfo.compass * 4;
                        //                                score += gameInfo.maxCombo * 3;
                        break;
                    case "lose": //lose
                        //                    alert("你输了！");
                        LianLianKan.UI_Info.ShowCenter("Image/lose.gif", "-" + result.score + "分", -1);
                        //播放失败音效
                        LianLianKan.Sound && LianLianKan.config.sound && LianLianKan.Sound.Play("lose");
                        //                                msg.className = "lose";
                        //                                score = -gameInfo.leftBox - parseInt(gameInfo.time / 2);
                        //                                score = score - (3 - proInfo.reset) * 8 - (3 - proInfo.compass) * 4;
                        //                                score += gameInfo.maxCombo * 3;
                        break;
                }
            }
        },
        Sealed: {
    },
    //获得地图数据
    GetMap: function (id) {
        return Data_Map.GetMap(id);
    }
},
Abstract: {
    //        Reset: function () {
    //        },
    //        Start: function () {
    //        },
    RefreshMapInfo: function () {
    },
    //            ShowInfo: function () {
    //            },
    //    Use: function () {
    //    },
    //            GameOver: function (type) {
    //            },
    GetPlayer: function () {
    },
    //        //依赖注入地图对象，并创建算法对象
    //        SetMap: function (map) {
    //        },
    //清除计时器
    ClearTimer: function () {
    },
    Start: function () {
    },
    //        //获得操作类实例
    //        SetOperate: function (operate) {
    //        },

    Mousedown: function () {
    },
    AddTimeLine: function () {
    },
    JudgeDoubleHit: function () {
    },
    //        //游戏结束后，移除事件绑定
    //        RemoveEvent: function(){
    //        },

    //保存信息
    SaveInfo: function () {
    },
    //            //游戏开始后的初始设置
    //        Init_Start: function(){
    //        },
    //显示玩家/boss信息
    ShowInfo: function () {
    },
    //显示地图信息
    ShowMapInfo: function () {
    },
    //更换玩家/Boss
    SelectPlayer: function () {
    },

    //获得mapIndex
    GetMapIndex: function () {
    },
    //设置mapIndex
    SetMapIndex: function () {
    },

    //用于游戏设置
    GetName: function () {
    },
    //观察者
    SetName: function (name) {
    },
    //观察者
    //设置游戏难度
    SetByDifficulity: function (dif) {
    },
    //    //获得序号
    //    GetIndex: function(){
    //    },

    //        //获得信息
    //        GetInfo: function () {
    //        },
    //        //游戏速度设置改变后，调用该方法，改变Operate_Single的_name、_config。
    //        SetConfig: function(config){
    //        },
    //        //游戏设置改变姓名后，调用该方法，改变Operate_Single的_name。
    //        SetName: function(){
    //        },



    //绑定道具事件
    BindEvent_Prop: function () {
    },
    //移除道具事件
    RemoveEvent_Prop: function () {
    },
    //结束当前游戏
    EndGame: function () {
    },
    Dispose: function () {
    }
}
});
//    //*操纵类接口
//    var Interface_Operate = MyInterface([
//    "Reset",    //重置
//    "Start",    //开始游戏
//    "RefreshMapInfo",   //更新地图信息
//    "GameOver",     //游戏结束
//    "ShowInfo",     //显示信息
//    "Use",   //使用道具/技能
//    "GetPlayer"     //获得玩家对象
//    ]);




//*子类

//Boss操纵类


//    //玩家操作类接口（继承操纵类接口）
//    var Interface_Game_Operate = MyInterface({ Interface: Interface_Operate }, [
//        "Mousedown",    //点击方块
//        "AddTimeLine",   //计时器增加
//        "JudgeDoubleHit"     //判断是否为连击
//    ]);

//    //玩家操作类接口
//    var Interface_Game_Operate = MyInterface([
//        "Mousedown",    //点击方块
//        "AddTimeLine",   //计时器增加
//        "JudgeDoubleHit"     //判断是否为连击
//    ]);

//    //Boss操作类接口
//    var Interface_Boss_Operate = MyInterface([

//        ]);

////玩家操作类基类
//var Abstract_Game_Operate = MyAbstract(Operate, {
//    Abstract: {
//        Mousedown: function () {
//        },
//        AddTimeLine: function () {
//        },
//        JudgeDoubleHit: function () {
//        }
//    }
//});










////    /* 代理模式 */

///* 观察者模式 */



////单人操纵类
//var Operate_Single = MyClass(Abstract_Operate_Game, {   //创建子类，继承抽象类
//    Init: function (map) {  //构造函数
//    },
//    Private: {
//    },
//    Protected: {
//    },
//    Public: {
//        Sealed: {   //密封方法
//        }
//    }
//});











