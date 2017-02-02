
////道具基类（抽象类）
//var Ability = MyAbstract({
//    Protected: {
//        //        //玩家操作类对象
//        //        P_game_operate: null,
//        //        //Boss操作类对象
//        //        P_game_operate: null

//        //玩家对象
//        P_game_player: null,
//        //Boss对象
//        P_ai_player: null
//    },
//    Abstract: {
//        Do: function () {
//        },
//        Dispose: function () {
//        }
//    }
//});

////具体技能子类

////收获庄家
//var Harvest = MyClass(Ability, {
//    Init: function (game_player, ai_player) {
//        this.P_game_player = game_player;
//        this.P_ai_player = ai_player;
//    },
//    Private: {
//    //        //游戏玩家对象
//    //        _game_player: null
//},
//Public: {
//    Do: function () {
//        this.P_game_player.score += 200;

//        //            var row = this.P_game_operate.map.Map.row;

//        //            //遍历前一半的列。如果this.P_game_operate.map.Map.col为奇数，则中间的列不用对调
//        //            var col = Math.floor(this.P_game_operate.map.Map.col / 2);
//        //            var i = 0, j = 0,
//        //                    temp_img = "",
//        //                    temp_number = 0,
//        //                    M = this.P_game_operate.map.Map.map;

//        ////            //此处要隐藏效果层，否则会出现问题
//        ////            common.HideDiv(this.P_game_operate.map.line.children("div"));

//        //            //相反位置的方块
//        //            var opposite = null;

//        //            for (i = 0; i < row; i++) {
//        //                for (j = 0; j < col; j++) {
//        //                    /*  这个有问题！
//        //                    M[i][j]改变后，temp也改变了！所以达不到预期的效果！

//        //                    temp = M[i][j];
//        //                    opposite = M[i][this.P_game_operate.map.Map.col - j - 1];
//        //                    M[i][j].html(opposite.html());
//        //                    M[i][j].img = opposite.img;

//        //                    opposite.html(temp.html());
//        //                    opposite.img = temp.img;
//        //                    */

//        //                    //与相反位置的方块对调
//        //                    temp_img = M[i][j].html();
//        //                    temp_number = M[i][j].img;

//        //                    opposite = M[i][this.P_game_operate.map.Map.col - j - 1];
//        //                    M[i][j].html(opposite.html());
//        //                    M[i][j].img = opposite.img;

//        //                    opposite.html(temp_img);
//        //                    opposite.img = temp_number;

//        //                }
//        //            }
//    },
//    Dispose: function () {
//        this.P_game_player = null;
//        this.P_ai_player = null;
//    }
//}
//});
