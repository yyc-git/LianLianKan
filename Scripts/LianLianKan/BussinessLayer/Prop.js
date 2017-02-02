
////道具基类（抽象类）
//var Prop = MyAbstract({
//    Abstract: {
//        Do: function () { 
//        },
//        Dispose: function () {
//        }
//    }
//});

////具体道具子类

////指南针
//var FindPath = MyClass(Prop, {
//    Init: function (algorithm, map) {
//        this._algorithm = algorithm;
////        this._map = map;
//    },
//    Private: {
//        _algorithm: null
////        _map: null
//    },
//    Public: {
//        Do: function () {
//            //            var prop = new Prop();


//            this._algorithm.FindPath();
//            //提示路径数组赋值
//            //            LianLianKan.clueLine_arr = operate.Clone(LianLianKan.path_arr);


//            this._algorithm.ShowLine(this._algorithm.clue_block_arr[0], this._algorithm.clue_block_arr[1], "ShowClueLine");
//        },
//        Dispose: function () {
//            this._algorithm = null;
//        }
//    }
//});

////炸弹
//var Bomb = MyClass(Prop, {
//    Init: function (algorithm, map) {
////        this._algorithm = algorithm;
//        this._map = map;
//    },
//    Private: {
////        _algorithm: null,
//        _map: null
//    },
//    Public: {
//        //        Init: function () {
//        //            this._algorithm = new Algorithm(LianLianKan.UI_CommonMap);
//        //        },
//        Do: function () {
//            //        var algorithm = new Algorithm();
//            //        console.log(this.t);
//            var row = "<img src='Image/bomb_row.gif' width=" + LianLianKan.config.BIGWIDTH.toString() + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px/>";
//            var col = "<img src='Image/bomb_col.gif' width=" + LianLianKan.config.BIGWIDTH.toString() + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px/>";
//            var boom = "<img src='Image/bomb_boom.gif' width=" + LianLianKan.config.BIGWIDTH.toString() + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px/>";

//            //                //寻找方块时，先判断是否无解
//            //                if (IsNoPath()) {
//            //                    Show.ShowInfo("无解！请使用重列或者炸弹道具");
//            //                    return;
//            //                }


//            this._algorithm.FindPath();
//            //                common.HideDiv(LianLianKan.UI_CommonMap.line.children("div"));
//            //        //路径数组赋值
//            //        LianLianKan.pathLine_arr = operate.Clone(LianLianKan.path_arr);

//            this._algorithm.ShowLine(this._algorithm.clue_block_arr[0], this._algorithm.clue_block_arr[1]);
//            this._algorithm.Elimination(this._algorithm.clue_block_arr[0], this._algorithm.clue_block_arr[1]);

//            //刷新剩余方块数
//            LianLianKan.Operate_Single.remain_num -= 2;

//            //隐藏当前选中效果层
//            common.HideDiv(this._map.select_div);


//            //                //如果消去提示框的方块，则隐藏提示框
//            //                if (LianLianKan.Operate_Single.clueLine_click_flag == 1) {
//            //                    common.HideDiv(LianLianKan.UI_CommonMap.clueLine.children("div"));

//            //                    LianLianKan.Operate_Single.clueLine_click_flag = 0;
//            //                }

//            //计时器加时间
//            LianLianKan.Operate_Single.GetPlayer().gameInfo.timeLine -= LianLianKan.config.addTime;

//            //判断是否为连击
//            LianLianKan.Operate_Single.DoubleHit();

//            //刷新地图信息
//            LianLianKan.Operate_Single.RefreshMapInfo();

//            //*发布所有事件

//            //判断是否胜利
//            if (LianLianKan.Operate_Single.GetPlayer().remain_num <= 0) {
//                LianLianKan.Operate_Single.GameOver("win");
//                return;
//            }

//            //消去方块后，判断是否无解
//            if (this._algorithm.IsNoPath(LianLianKan.Operate_Single.GetPlayer().remain_num)) {
//                LianLianKan.UI_Info.ShowInfo("无解！请使用重列或者炸弹道具");
//                return;
//            }

//            return;
//        },
//        Dispose: function () {
//            this._algorithm = null;
//        }
//    }
//});

////重列
//var Rearrangement = MyClass(Prop, {
//    Init: function (algorithm, map) {
//        //        this._algorithm = algorithm;
//        this._map = map;
//    },
//    Private: {
//        //        _algorithm: null,
//        _map: null
//    },
//    Public: {
//        Do: function () {
//            var i = 0, j = 0,
//                    M = this._map.Map.map,
//                    imgs = [],
//                    temp = null,
//                    len = 0;

//            //获得当前剩余方块的序号
//            for (var i = 0; i < this._map.Map.row; i++) {
//                for (var j = 0; j < this._map.Map.col; j++) {
//                    if (M[i][j].img === 0) {
//                        continue;
//                    }

//                    imgs.push(M[i][j].img);
//                }
//            }

//            len = LianLianKan.Operate_Single.remain_num;
//            //打乱数组（LianLianKan.Operate_Single.remain_num次）
//            for (i = 0; i < len; i++) {
//                j = parseInt(Math.random() * len);
//                temp = imgs[i];
//                imgs[i] = imgs[j];
//                imgs[j] = temp;
//            }

//            temp = 0;

//            //重置方块
//            for (var i = 0; i < this._map.Map.row; i++) {
//                for (var j = 0; j < this._map.Map.col; j++) {
//                    if (M[i][j].img === 0) {
//                        continue;
//                    }

//                    M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp'/>");
//                    M[i][j].img = imgs[temp];

//                    temp += 1;
//                }
//            }
////            console.log(M);
//        },
//        Dispose: function () {
//        }
//    }
//});



////            //路障（电脑增加方块）
////            RoadBlock: function (num) {

////            },
///*  已测试正确！加入Boss技能的时候，可以使用！
////技能：路障（电脑对玩家使用）
////增加num个方块
//AddBlock: function (num) {
//var already_add = 0;
//var temp = 0, i = 0, j = 0, len = 0, double = 0;
//var M = LianLianKan.UI_CommonMap.Map.map;
//var imgs = [];

//if (num % 2 !== 0) {
//throw new Error("num要为偶数！");
//}

////如果空格数小于num，则不能增加
//if ((LianLianKan.Operate_Single.GetPlayer().remain_num + num) > LianLianKan.UI_CommonMap.Map.col * LianLianKan.UI_CommonMap.Map.row) {
//console.log("不能增加了！");
//return;
//}


////生成增加的方块序号数组
//for (i = 0, len = num / 2; i < num; i += 2) {
//temp = operate.Random._NToM(1, LianLianKan.IMGAGECOUNT);     //序号是从1开始的！

//imgs[i] = temp;
//imgs[i + 1] = temp;
//}

////打乱数组（num次）
//for (i = 0; i < num; i++) {
//j = parseInt(Math.random() * num);
//temp = imgs[i];
//imgs[i] = imgs[j];
//imgs[j] = temp;
//}


//temp = 0;

//while (temp < num) {
////在随机位置处增加方块
//i = operate.Random._NToM(0, LianLianKan.UI_CommonMap.Map.row - 1);
//j = operate.Random._NToM(0, LianLianKan.UI_CommonMap.Map.col - 1);

//if (M[i][j].img === 0) {
//M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp'/>");
//M[i][j].img = imgs[temp];

////                            double = double === 0 ? 1 : 0;  //是否

////                            already_add += 1;

////                            if (already_add == num) {
////                                break outer;
////                            }

//temp += 1;
//}
//}

////                for (i = 0; i < LianLianKan.UI_CommonMap.Map.row; i++) {
////                    for (j = 0; j < LianLianKan.UI_CommonMap.Map.col; j++) {
////                        if (M[i][j].img === 0) {
////                            M[i][j].html("<img src='Image/box/img" + ("00" + imgs[temp]).slice(-3) + ".bmp'/>");
////                            M[i][j].img = temp;

////                            //                            double = double === 0 ? 1 : 0;  //是否

////                            //                            already_add += 1;

////                            //                            if (already_add == num) {
////                            //                                break outer;
////                            //                            }

////                            temp += 1;


////                        }



////                        //                        if (double === 0) {
////                        //                            temp = operate.Random._NToM(0, LianLianKan.IMGAGECOUNT);
////                        //                        }
////                    }
////                }

////剩余方块数增加already_add（实际增加的方块数）
//LianLianKan.Operate_Single.GetPlayer().remain_num += num;

//Show.RefreshMapInfo();
//},
//*/
////禁手

////禁手
//var Stop = MyClass(Prop, {
//    Init: function (algorithm, map) {
//        this._algorithm = algorithm;
//        this._map = map;
//    },
//    Private: {
//        _algorithm: null,
//        _map: null
//    },
//    Private: {
//        _timer: 0
//    },
//    Public: {
//        Do: function (_second) {
//            var second = _second ? _second : 5;
//            //重复使用禁手道具，会刷新禁手时间  需要测试！
//            if (this._timer) {
//                window.clearTimeout(this._timer);
//            }

//            //道具状态为禁手
//            LianLianKan.PlayerStatus = LianLianKan.PlayerStatus.Stop;

//            LianLianKan.UI_Info.ShowInfo("禁手" + second + "秒");
//            $(LianLianKan.UI_CommonMap.Map.table).find("td").unbind("mousedown");

//            this._timer = window.setTimeout(function () {
//                $(LianLianKan.UI_CommonMap.Map.table).find("td").bind("mousedown", function () {
//                    LianLianKan.Operate_Single.Mousedown($(this));
//                });
//                LianLianKan.UI_Info.ShowInfo("解除禁手");

//                //恢复道具状态
//                LianLianKan.propStatus = LianLianKan.PropStatus.None;
//            }, second * 1000);
//        },
//        Dispose: function () {
//            window.clearTimeout(this._timer);
//            this._timer = 0;

//            LianLianKan.propStatus = LianLianKan.PropStatus.None;

//            if (LianLianKan.UI_CommonMap && LianLianKan.UI_CommonMap.Map.table) {
//                (LianLianKan.UI_CommonMap.Map.table).find("td").unbind("mousedown");
//            }
//        }
//    }
//});

////镜子
//var Mirror = MyClass(Prop, {
//    Init: function (algorithm, map) {
//        this._algorithm = algorithm;
//        this._map = map;
//    },
//    Private: {
//        _algorithm: null,
//        _map: null
//    },
//    Public: {
//        Do: function () {
//            var row = LianLianKan.UI_CommonMap.Map.row;

//            //遍历前一半的列。如果LianLianKan.UI_CommonMap.Map.col为奇数，则中间的列不用对调
//            var col = Math.floor(LianLianKan.UI_CommonMap.Map.col / 2);
//            var i = 0, j = 0,
//                    temp_img = "",
//                    temp_number = 0,
//                    M = LianLianKan.UI_CommonMap.Map.map;

//            //此处要隐藏效果层，否则会出现问题
//            common.HideDiv(LianLianKan.UI_CommonMap.line.children("div"));

//            //相反位置的方块
//            var opposite = null;

//            for (i = 0; i < row; i++) {
//                for (j = 0; j < col; j++) {
//                    /*  这个有问题！
//                    M[i][j]改变后，temp也改变了！所以达不到预期的效果！

//                    temp = M[i][j];
//                    opposite = M[i][LianLianKan.UI_CommonMap.Map.col - j - 1];
//                    M[i][j].html(opposite.html());
//                    M[i][j].img = opposite.img;

//                    opposite.html(temp.html());
//                    opposite.img = temp.img;
//                    */

//                    //与相反位置的方块对调
//                    temp_img = M[i][j].html();
//                    temp_number = M[i][j].img;

//                    opposite = M[i][LianLianKan.UI_CommonMap.Map.col - j - 1];
//                    M[i][j].html(opposite.html());
//                    M[i][j].img = opposite.img;

//                    opposite.html(temp_img);
//                    opposite.img = temp_number;

//                }
//            }
//        },
//        Dispose: function () {
//        }
//    }
//});