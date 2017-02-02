/* 策略模式 */
///* 模版模式 */

//    //算法类接口

//算法类
var Algorithm = MyAbstract({
    Private: {
        _NoPoint: function (ord_x, ord_y, x, y) {
            //                var link = true;
            var result = {};
            //                    var M = LianLianKan.UI_CommonMap.Map.map;

            //                var map = M;

            var x_min, x_max, y_min, y_max, min;

            var len = 0;    //记录x或y方向上，连线的个数

            var position = null;

            var direction = "";

            var path = [];

            //                //要将String类型转换为number对象
            //                ord_x = Number(ord_x);
            //                ord_y = Number(ord_y);
            //                x = Number(x);
            //                y = Number(y);

            if (ord_x === x) {
                //                    y_min = Math.min(ord_y, y);
                //                    y_max = Math.max(ord_y, y);

                if (ord_y > y) {
                    //                        direction = "y_up";
                    y_min = y;
                    y_max = ord_y;
                }
                else {
                    //                        direction = "y_down";
                    y_min = ord_y;
                    y_max = y;
                }

                //                    //多个拐点时，如果超出边界，则返回false
                //                    if (y_max >= this.P_map.Map.row) {
                //                        return false;
                //                    }

                //                    path.push(this.P_map.Map.map[x][y_min]);
                min = ++y_min;

                //                    while ((this.P_map.Map.map[y_min][x].img === 0) && y_min < y_max) {
                while (y_min < y_max && (this.P_map.Map.map[y_min][x].img === 0)) {
                    len++;

                    y_min++;
                }

                //                    if (y_min === y_max) {
                //                        if (len !== 0) {
                //                            //长度再加1，这样就可以满足有拐点的情况
                //                            len++;
                //                            position = this.P_map.Map.map[min][x].position();
                //                            //加入路径，标记路径方向为y方向，记录起始位置坐标（最小坐标）以及连线的长度
                //                            path.push([{ x: position.left, y: position.top, direction: "y", len: len}]);

                //                            return path;
                //                        }
                //                        //为拐点
                //                        else {
                //                            return true;
                //                        }
                //                    }
                if (y_min === y_max) {

                    //长度加1放到ShowLine中统一加！

                    //长度再加1，这样就可以满足有拐点的情况
                    //                        len++;

                    position = this.P_map.Map.map[min][x].position();

                    path.push({ x: position.left, y: position.top, direction: "y", len: len });

                    return path;
                }
                else {
                    return false;
                }
                //                    if (y_min === y_max) {
                //                        if (len !== 0) {


                //                            position = this.P_map.Map.map[min][x].position();
                //                            //加入路径，标记路径方向为y方向，记录起始位置坐标（最小坐标）以及连线的长度

                //                        }
                //                        //为拐点
                //                        else {
                //                            return true;
                //                        }
                //                    }
            }
            else if (ord_y === y) {

                if (ord_x > x) {
                    //                        direction = "x_left";
                    x_min = x;
                    x_max = ord_x;
                }
                else {
                    //                        direction = "x_right";
                    x_min = ord_x;
                    x_max = x;
                }

                //                    x_min = Math.min(ord_x, x);
                //                    x_max = Math.max(ord_x, x);

                //                    //多个拐点时，如果超出边界，则返回false
                //                    if (x_max >= this.P_map.Map.col) {
                //                        return false;
                //                    }

                //                    path.push(this.P_map.Map.map[x_min][y]);
                min = ++x_min;
                //                    while ((this.P_map.Map.map[y][x_min].img === 0) && x_min < x_max) {
                while (x_min < x_max && (this.P_map.Map.map[y][x_min].img === 0)) {
                    len++;
                    //                        path.push([this.P_map.Map.map[y][x_min], "x"]);  //加入路径，标记路径方向为x方向
                    x_min++;
                }

                //                    //如果为多个拐点，且两头都有方块，则返回false
                //                    if (point && this.P_map.Map.map[y][x_min].img === 0 && this.P_map.Map.map[y][x_min].img === 0) {
                //                        return false;
                //                    }

                //                    guaidian && path.push([this.P_map.Map.map[y][x_min], "x"]);  //拐点
                //                    if (x_min === x_max) {
                //                        if (len !== 0) {
                //                            //长度再加1，这样就可以满足有拐点的情况
                //                            len++;
                //                            position = this.P_map.Map.map[y][min].position();
                //                            //加入路径，标记路径方向为x方向，记录起始位置坐标（最小坐标）以及连线的长度
                //                            path.push([{ x: position.left, y: position.top, direction: "x", len: len}]);
                //                            return path;
                //                        }
                //                        //为拐点
                //                        else {
                //                            return true;
                //                        }
                //                    }

                if (x_min === x_max) {

                    //长度加1放到ShowLine中统一加！

                    //长度再加1，这样就可以满足有拐点的情况
                    // len++;

                    position = this.P_map.Map.map[y][min].position();

                    path.push({ x: position.left, y: position.top, direction: "x", len: len });

                    return path;
                }
                else {
                    return false;
                }
            }
            //                else {
            //                    return false;
            //                }
            return false;

            //                if (!link) {
            //                    return link;
            //                }




            //                LianLianKan.pathLine_arr = link === true && LianLianKan.pathLine_arr.concat(path);   //获得连接路径


            //                return path;
        },

        //有一个拐点
        //上：1
        //右：2
        //下：3
        //左：4
        _OnePoint: function (ord_x, ord_y, x, y) {
            //                if (clear) {
            //                    LianLianKan.pathLine_arr = [];
            //                }
            var path = [];
            var temp_1, temp_2, guaidian;
            //                    var this.P_map.Map.map = this.P_map.Map.map;

            var position = null;
            //                var success = false;


            //                if (x > ord_x && y > ord_y) {
            //                    temp_1 = this._NoPoint(ord_x, ord_y, ord_x, y);
            //                }


            //                ((ord_y > y && this.P_map.Map.map[y][ord_x].img === 0) || this.P_map.Map.map[ord_y][ord_x].img === 0)

            //第一种情况：x坐标相同
            temp_1 = this._NoPoint(ord_x, ord_y, ord_x, y);
            if (temp_1 && this.P_map.Map.map[y][ord_x].img === 0) {
                temp_2 = this._NoPoint(ord_x, y, x, y);
                if (temp_2) {
                    //                        if (temp_1 !== true) {
                    //                            temp_1[0].len++;    //加上拐点

                    //                            path = path.concat(temp_1);
                    //                        }
                    //                        //第一个路径为拐点，加入拐点坐标
                    //                        else {
                    //                            position = this.P_map.Map.map[y][ord_x].position();
                    //                            path.push({ x: position.left, y: position.top, direction: "y", len: 1 });
                    //                        }

                    //                        temp_1[0].len++;    //加上拐点

                    path = path.concat(temp_1).concat(temp_2);

                    //                            //当前选中方块在之前选中方块的右方
                    //                            if (ord_x < x) {
                    //                                path.push([this.P_map.Map.map[y][ord_x], "12"]);     //拐点
                    //                            }
                    //                            //当前选中方块在之前选中方块的左方
                    //                            else {
                    //                                path.push([this.P_map.Map.map[y][ord_x], "14"]);     //拐点
                    //                            }


                    //                        path.push("guaidian");     //拐点

                    //                        if (temp_2 !== true) {
                    //                            path = path.concat(temp_2);
                    //                        }
                    //                        //第一个路径为拐点，加入拐点坐标
                    //                        else {
                    //                            position = this.P_map.Map.map[y][ord_x].position();
                    //                            path.push({ x: position.left, y: position.top, direction: "x", len: 1 });
                    //                        }

                    //                        path = path.concat(temp_2);

                    return path;
                }
            }

            //                if (!success)
            //第二种情况：y坐标相同
            temp_1 = this._NoPoint(ord_x, ord_y, x, ord_y);

            if (temp_1 && this.P_map.Map.map[ord_y][x].img === 0) {
                temp_2 = this._NoPoint(x, ord_y, x, y);
                if (temp_2) {
                    //                        if (temp_1 !== true) {
                    //                            temp_1[0].len++;    //加上拐点

                    //                            path = path.concat(temp_1);
                    //                        }
                    //                        //第一个路径为拐点，加入拐点坐标
                    //                        else {
                    //                            position = this.P_map.Map.map[ord_y][x].position();
                    //                            path.push({ x: position.left, y: position.top, direction: "y", len: 1 });
                    //                        }

                    //                        //                        if (temp_1 !== true) {
                    //                        //                            path = path.concat(temp_1);
                    //                        //                        }
                    //                        //                        //                            //当前选中方块在之前选中方块的上方
                    //                        //                        //                            if (ord_y > y) {
                    //                        //                        //                                path.push([this.P_map.Map.map[ord_y][x], "21"]);     //拐点
                    //                        //                        //                            }
                    //                        //                        //                            //当前选中方块在之前选中方块的下方
                    //                        //                        //                            else {
                    //                        //                        //                                path.push([this.P_map.Map.map[y][ord_x], "23"]);     //拐点
                    //                        //                        //                            }
                    //                        //                        path.push("guaidian");     //拐点

                    //                        if (temp_2 !== true) {
                    //                            path = path.concat(temp_2);
                    //                        }
                    //                        //第一个路径为拐点，加入拐点坐标
                    //                        else {
                    //                            position = this.P_map.Map.map[ord_y][x].position();
                    //                            path.push({ x: position.left, y: position.top, direction: "x", len: 1 });
                    //                        }

                    //                        temp_1[0].len++;    //加上拐点

                    path = path.concat(temp_1).concat(temp_2);

                    return path;
                }
                //                        else {
                //                            return false;
                //                        }
            }
            //                else {
            return false;
            //                }
        },

        //水平方向判断
        _TwoPoint_X: function (ord_x, ord_y, x, y, direction) {
            //                    var this.P_map.Map.map = this.P_map.Map.map;
            var temp = null;
            var path = [];
            var success = false;

            var position = null;

            var len = 0;

            var min = 0;    //最小的x轴坐标

            //                //要将String类型转换为number对象
            //                ord_x = Number(ord_x);
            //                ord_y = Number(ord_y);
            //                x = Number(x);
            //                y = Number(y);

            //                var dire = "";

            //                (direction == "right" && ord_x++) || (direction == "left" && ord_x--);

            if (direction == "right") {
                ord_x += 1;
                min = ord_x;

                //                    dire = "x_right";
            }
            else {
                ord_x -= 1;

                //                    dire = "x_left";
            }

            while (ord_x < this.P_map.Map.col && ord_x >= 0 && this.P_map.Map.map[ord_y][ord_x].img === 0) {
                temp = this._OnePoint(ord_x, ord_y, x, y);
                //找到了路径
                if (temp) {


                    //                        break;
                    success = true;
                    break;

                    //                        //当前选中方块在之前选中方块的右方
                    //                        if (direction == "right") {
                    //                            //右上方或右下方
                    //                            (ord_y > y && path.push([this.P_map.Map.map[ord_y][ord_x], "21"])) || path.push([this.P_map.Map.map[ord_y][ord_x], "23"]);
                    //                        }
                    //                        //当前选中方块在之前选中方块的右方
                    //                        else if (direction == "left") {
                    //                            //左上方或左下方
                    //                            (ord_y > y && path.push([this.P_map.Map.map[ord_y][ord_x], "41"])) || path.push([this.P_map.Map.map[ord_y][ord_x], "43"]);
                    //                        }
                    //                        else {
                    //                            throw new Error("direction error!");
                    //                        }
                    //                        direction == "right" && path.push([this.P_map.Map.map[ord_x][ord_y], "x"]);   //拐点

                    //                        path.push(temp.path);
                    //                        path = path.concat(temp);

                    //                        //                        break;
                    //                        success = true;
                    //                        break;
                }
                else {
                    len += 1;

                    (direction == "right" && ord_x++) || (direction == "left" && ord_x--);
                    //                        LianLianKan.pathLine_arr.push([this.P_map.Map.map[ord_x][ord_y], "x"]);
                }
            }

            if (direction == "left") {
                min = ord_x + 1;    //方向为left的话，距离要往右移动一格
            }

            if (success) {
                //长度加1放到ShowLine中统一加！

                //                                        len++;

                position = this.P_map.Map.map[ord_y][min].position();
                path.push({ x: position.left, y: position.top, direction: "x", len: len });

                //                if (path.length !== 0) {
                //                    path[0].len++;    //加上拐点

                //                }
                //                //第一个路径为拐点，加入拐点坐标
                //                else {
                //                    position = this.P_map.Map.map[ord_y][min].position();
                //                    path.push({ x: position.left, y: position.top, direction: "x", len: 1 });
                //                }

                path = path.concat(temp);

                return path;
            }
            else {
                return false;
            }


            //                path.push([this.P_map.Map.map[ord_y][ord_x], "x"]);


            //                return success ? path : false;

            //                if (success) {
            //                    return path;
            //                }
            //                //                    return;
            //                //                }
            //                //                else {
            //                //                    return;
            //                //                }
            //                return success;
        },

        //垂直方向判断
        _TwoPoint_Y: function (ord_x, ord_y, x, y, direction) {
            //                var this.P_map.Map.map = this.P_map.Map.map;
            //                var temp = null;
            //                var path = [];
            //                var success = false;

            //                (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            //                while (ord_y < this.P_map.Map.row && ord_y >= 0 && this.P_map.Map.map[ord_x][ord_y].img !== 0) {
            //                    temp = this._OnePoint(ord_x, ord_y, x, y);
            //                    //找到了路径
            //                    if (temp) {
            //                        path.push([this.P_map.Map.map[ord_x][ord_y], "y"]);   //拐点

            //                        path.push(temp.path);

            //                        //                        break;
            //                        success = true;
            //                        break;
            //                    }
            //                    else {
            //                        path.push([this.P_map.Map.map[ord_x][ord_y], "y"]);
            //                        (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            //                        //                        LianLianKan.pathLine_arr.push([this.P_map.Map.map[ord_x][ord_y], "x"]);
            //                    }
            //                }

            //                if (success) {
            //                    return path;

            //                }
            //                //                else {
            //                //                    return;
            //                //                }
            //                return success;


            //                    var M = this.P_map.Map.map;
            var temp = null;
            var path = [];
            var success = false;

            var position = null;

            var len = 0;

            var min = 0;    //最小的y轴坐标

            //                //要将String类型转换为number对象
            //                ord_x = Number(ord_x);
            //                ord_y = Number(ord_y);
            //                x = Number(x);
            //                y = Number(y);

            //                var dire = "";

            //                (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            if (direction == "down") {
                ord_y += 1;
                min = ord_y;
                //                    dire = "y_down";
            }
            else {
                ord_y -= 1;
                //                    dire = "y_up";
            }

            while (ord_y < this.P_map.Map.row && ord_y >= 0 && this.P_map.Map.map[ord_y][ord_x].img === 0) {
                //                    temp = this._OnePoint(ord_x, ord_y, x, y);
                //                    //找到了路径
                //                    if (temp) {
                //                        //当前选中方块在之前选中方块的上方
                //                        if (direction == "up") {
                //                            //右上方或左上方
                //                            (ord_x < x && path.push([this.P_map.Map.map[ord_y][ord_x], "12"])) || path.push([this.P_map.Map.map[ord_y][ord_x], "14"]);
                //                        }
                //                        //当前选中方块在之前选中方块的下方
                //                        else if (direction == "down") {
                //                            //右下方或左下方
                //                            (ord_x < x && path.push([this.P_map.Map.map[ord_y][ord_x], "32"])) || path.push([this.P_map.Map.map[ord_y][ord_x], "34"]);
                //                        }
                //                        else {
                //                            throw new Error("direction error!");
                //                        }
                //                        //                        direction == "right" && path.push([this.P_map.Map.map[ord_x][ord_y], "x"]);   //拐点

                //                        //                        path.push(temp.path);
                //                        path = path.concat(temp);

                //                        //                        break;
                //                        success = true;
                //                        break;
                //                    }
                //                    else {
                //                        path.push([this.P_map.Map.map[ord_y][ord_x], "y"]);
                //                        (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
                //                        //                        LianLianKan.pathLine_arr.push([this.P_map.Map.map[ord_x][ord_y], "x"]);
                //                    }


                temp = this._OnePoint(ord_x, ord_y, x, y);
                //找到了路径
                if (temp) {
                    success = true;
                    break;
                }
                else {
                    len += 1;

                    (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
                }

            }

            if (direction == "up") {
                min = ord_y + 1;    //方向为up的话，距离要往下移动一格
            }

            //                if (path.length !== 0) {
            //                    path[0].len++;    //加上拐点

            //                }
            //                //第一个路径为拐点，加入拐点坐标
            //                else {
            //                    position = this.P_map.Map.map[min][ord_x].position();
            //                    path.push({ x: position.left, y: position.top, direction: "x", len: 1 });
            //                }

            if (success) {

                //长度加1放到ShowLine中统一加！
                //                    len++;

                position = this.P_map.Map.map[min][ord_x].position();
                path.push({ x: position.left, y: position.top, direction: "y", len: len });

                path = path.concat(temp);

                return path;
            }
            else {
                return false;
            }


            //                path.push([this.P_map.Map.map[ord_y][ord_x], "x"]);


            //                return success ? path : false;
        },

        //有两个拐点
        _TwoPoint: function (ord_x, ord_y, x, y) {
            //                var result = true;
            //                var M = this.P_map.Map.map;
            var temp = null;
            var path = [];
            var success = false;
            //                LianLianKan.pathLine_arr = [];

            //上
            path = this._TwoPoint_Y(ord_x, ord_y, x, y, "up");
            if (path) {
                return path;
            }

            //下
            path = this._TwoPoint_Y(ord_x, ord_y, x, y, "down");
            if (path) {
                return path;
            }

            //左
            path = this._TwoPoint_X(ord_x, ord_y, x, y, "left");
            if (path) {
                return path;
            }

            //右
            path = this._TwoPoint_X(ord_x, ord_y, x, y, "right");
            if (path) {
                return path;
            }







            return false;
            //                return this._TwoPoint_X(ord_x, ord_y, x, y, "right") || this._TwoPoint_X(ord_x, ord_y, x, y, "left") || this._TwoPoint_Y(ord_x, ord_y, x, y, "up") || this._TwoPoint_Y(ord_x, ord_y, x, y, "down");

            //右
            //                this._TwoPoint_X(ord_x, ord_y, x, y, "right");

            //                ord_x++;
            //                while (ord_x < this.P_map.Map.col && this.P_map.Map.map[ord_x][ord_y].img !== 0) {
            //                    temp = this._OnePoint(ord_x, ord_y, x, y);
            //                    //找到了路径
            //                    if (temp) {
            //                        path.push([this.P_map.Map.map[ord_x][ord_y], "x"]);   //拐点

            //                        path.pathLine_arr.push(temp.path);

            //                        //                        break;
            //                        success = true;
            //                        break;
            //                    }
            //                    else {
            //                        path.push([this.P_map.Map.map[ord_x][ord_y], "x"]);
            //                        ord_x++;
            //                        //                        LianLianKan.pathLine_arr.push([this.P_map.Map.map[ord_x][ord_y], "x"]);
            //                    }
            //                }

            //                if (success) {
            //                    LianLianKan.pathLine_arr.concat(path);
            //                    return;
            //                }
            //                else {
            //                    path = [];
            //                }

            //左
            //                this._TwoPoint_X(ord_x, ord_y, x, y, "left");

            //上

            //下

        }
    },
    Protected: {
        //*模版成员
        Abstract: {
            P_ChangeFlag: function () {
            },
            P_map: null,
            //加入方块标志，需要被子类覆盖
            P_addBlock_flag: false
        }


        //*父类、子类共用的成员
       
    },
    Public: {
        //IsLink()找到的路径
        path_arr: [],
        clue_block_arr: [],
        //一对相同的方块
        common_block_arr: [],


        Virtual: {
            /*
            这个方法也可行，但是性能不行（记录连接路径的算法需要修改）。

            这个方法记录路径的算法是把每次经过的路径（td）记录下来（记录绑定该td的map数组和方向，
            如果为拐点，还要判断是哪种拐点（一共有8种拐点），再把拐点加入到记录中）保存到路径数组中，然后在显示时，
            把路径数组中的map数组（绑定td）的图片换成连线图片。

            这样做的效率很低，且需要判断拐点。


            因此我使用了改进的算法，即：

            记录x或者y方向的最小坐标（因为x方向的连线是从左边开始加的，y方向的连线是从上边开始加的）和该方向上的连线个数（此处个数要多加1个，
            这样就可以应对有拐点的情况了）。

            最多使用三个层来显示连线（有两个拐点的情况会使用三个层；一个拐点的情况使用两个层；没有拐点的情况使用一个层），
            一个层都放x方向的连线，一个层都放y方向的连线，另外一个层都放x或y方向的连线（即最多有两个x方向和一个y方向的层 或者
            一个x方向和两个y方向的层，这样即可显示所有情况的连线）

            层的显示方式见《连线显示层演示》！



            //判断方块可连接
            var IsLink = (function () {


            //            var ord_x;
            //            var ord_y;
            //            var x, y;
            //            var JudgeNoPoint = function (_ord, _new) {
            //                min = Math.min(_ord, _new);
            //                y_max = Math.max(_ord, _new);

            //                min++;
            //                while ((M[x][min].img === 0) && y_min < y_max) {
            //                    y_min++;
            //                }
            //                if (y_min < y_max) {
            //                    result = false;
            //                }
            //                else {
            //                    result = true;
            //                }
            //            };

            //没有拐点
            //            var this._NoPoint = function (ord_x, ord_y, x, y, guaidian, point) {
            //                var link = true;
            //                var result = {};
            //                var M = this.P_map.Map.map;

            //                //                var map = M;

            //                var x_min, x_max, y_min, y_max;

            //                var path = [];

            //                //                if (clear) {
            //                //                    LianLianKan.pathLine_arr = [];
            //                //                }

            //                if (ord_x === x) {
            //                    y_min = Math.min(ord_y, y);
            //                    y_max = Math.max(ord_y, y);

            //                    //多个拐点时，如果超出边界，则返回false
            //                    if (y_max >= this.P_map.Map.row) {
            //                        return false;
            //                    }

            //                    //                    path.push(M[x][y_min]);
            //                    y_min++;
            //                    while ((M[y_min][x].img === 0) && y_min < y_max) {
            //                        //                        map[x][y_min].
            //                        path.push([M[y_min][x], "y"]);  //加入路径，标记路径方向为y方向
            //                        y_min++;
            //                    }

            //                    //如果为多个拐点，且两头都有方块，则返回false
            //                    if (point && M[y_min][x].img === 0 &&  M[y_max][x].img === 0){
            //                        return false;
            //                    }

            //                    guaidian && path.push([M[y_min][x], "y"]);  //拐点
            //                    //                    if (y_min < y_max) {
            //                    link = y_min === y_max;
            //                    //                    }
            //                    //                    else {
            //                    //                        link = true;
            //                    //                    }
            //                }
            //                else if (ord_y === y) {
            //                    x_min = Math.min(ord_x, x);
            //                    x_max = Math.max(ord_x, x);

            //                    //多个拐点时，如果超出边界，则返回false
            //                    if (x_max >= this.P_map.Map.col) {
            //                        return false;
            //                    }

            //                    //                    path.push(M[x_min][y]);
            //                    x_min++;
            //                    while ((M[y][x_min].img === 0) && x_min < x_max) {
            //                        path.push([M[y][x_min], "x"]);  //加入路径，标记路径方向为x方向
            //                        x_min++;
            //                    }

            //                    //如果为多个拐点，且两头都有方块，则返回false
            //                    if (point && M[y][x_min].img === 0 && M[y][x_min].img === 0) {
            //                        return false;
            //                    }

            //                    guaidian && path.push([M[y][x_min], "x"]);  //拐点

            //                    link = x_min === x_max;
            //                    //                    if (x_min < x_max) {
            //                    //                        link = false;
            //                    //                    }
            //                    //                    else {
            //                    //                        link = true;
            //                    //                    }
            //                }
            //                else {
            //                    link = false;
            //                }

            //                if (!link) {
            //                    return link;
            //                }




            //                //                LianLianKan.pathLine_arr = link === true && LianLianKan.pathLine_arr.concat(path);   //获得连接路径


            //                return path;
            //            };

            var this._NoPoint = function (ord_x, ord_y, x, y) {
            var link = true;
            var result = {};
            var M = this.P_map.Map.map;

            //                var map = M;

            var x_min, x_max, y_min, y_max;


            var path = [];

            //                if (clear) {
            //                    LianLianKan.pathLine_arr = [];
            //                }

            if (ord_x === x) {
            y_min = Math.min(ord_y, y);
            y_max = Math.max(ord_y, y);

            //                    //多个拐点时，如果超出边界，则返回false
            //                    if (y_max >= this.P_map.Map.row) {
            //                        return false;
            //                    }

            //                    path.push(M[x][y_min]);
            y_min++;
            while ((M[y_min][x].img === 0) && y_min < y_max) {
            //                        map[x][y_min].
            path.push([M[y_min][x], "y"]);  //加入路径，标记路径方向为y方向
            y_min++;
            }

            //                    //如果为多个拐点，且两头都有方块，则返回false
            //                    if (point && M[y_min][x].img === 0 && M[y_max][x].img === 0) {
            //                        return false;
            //                    }

            //                    guaidian && path.push([M[y_min][x], "y"]);  //拐点
            //                    if (y_min < y_max) {


            link = y_min === y_max;
            //                    }
            //                    else {
            //                        link = true;
            //                    }
            }
            else if (ord_y === y) {
            x_min = Math.min(ord_x, x);
            x_max = Math.max(ord_x, x);

            //                    //多个拐点时，如果超出边界，则返回false
            //                    if (x_max >= this.P_map.Map.col) {
            //                        return false;
            //                    }

            //                    path.push(M[x_min][y]);
            x_min++;
            while ((M[y][x_min].img === 0) && x_min < x_max) {
            path.push([M[y][x_min], "x"]);  //加入路径，标记路径方向为x方向
            x_min++;
            }

            //                    //如果为多个拐点，且两头都有方块，则返回false
            //                    if (point && M[y][x_min].img === 0 && M[y][x_min].img === 0) {
            //                        return false;
            //                    }

            //                    guaidian && path.push([M[y][x_min], "x"]);  //拐点

            link = x_min === x_max;
            //                    if (x_min < x_max) {
            //                        link = false;
            //                    }
            //                    else {
            //                        link = true;
            //                    }
            }
            else {
            link = false;
            }

            if (!link) {
            return link;
            }




            //                LianLianKan.pathLine_arr = link === true && LianLianKan.pathLine_arr.concat(path);   //获得连接路径


            return path;
            };

            //有一个拐点
            //上：1
            //右：2
            //下：3
            //左：4
            var this._OnePoint = function (ord_x, ord_y, x, y) {
            //                if (clear) {
            //                    LianLianKan.pathLine_arr = [];
            //                }
            var path = [];
            var temp_1, temp_2, guaidian;
            var M = this.P_map.Map.map;
            //                var success = false;


            //                if (x > ord_x && y > ord_y) {
            //                    temp_1 = this._NoPoint(ord_x, ord_y, ord_x, y);
            //                }

            temp_1 = this._NoPoint(ord_x, ord_y, ord_x, y);

            //                ((ord_y > y && M[y][ord_x].img === 0) || M[ord_y][ord_x].img === 0)

            //第一种情况：x坐标相同
            if (temp_1 && M[y][ord_x].img === 0) {
            //当前选中方块在之前选中方块的上方
            if (ord_y > y) {
            temp_2 = this._NoPoint(ord_x, y, x, y);
            if (temp_2) {
            path = path.concat(temp_1);
            //当前选中方块在之前选中方块的右方
            if (ord_x < x) {
            path.push([M[y][ord_x], "12"]);     //拐点
            }
            //当前选中方块在之前选中方块的左方
            else {
            path.push([M[y][ord_x], "14"]);     //拐点
            }
            path = path.concat(temp_2);

            return path;
            }
            //                        else {
            //                            //                            success = false;
            //                        }
            }
            //当前选中方块在之前选中方块的下方
            else {
            temp_2 = this._NoPoint(ord_x, y, x, y);
            if (temp_2) {
            path = path.concat(temp_1);
            //当前选中方块在之前选中方块的右方
            if (ord_x < x) {
            path.push([M[y][ord_x], "32"]);     //拐点
            }
            //当前选中方块在之前选中方块的左方
            else {
            path.push([M[y][ord_x], "34"]);     //拐点
            }
            path = path.concat(temp_2);

            return path;
            }
            //                        else {
            //                            //                            success = false;
            //                        }
            }
            }

            //                if (!success)
            //第二种情况：y坐标相同
            temp_1 = this._NoPoint(ord_x, ord_y, x, ord_y);

            if (temp_1 && M[ord_y][x].img === 0) {
            //当前选中方块在之前选中方块的右方
            if (ord_x < x) {
            temp_2 = this._NoPoint(x, ord_y, x, y);
            if (temp_2) {
            path = path.concat(temp_1);
            //当前选中方块在之前选中方块的上方
            if (ord_y > y) {
            path.push([M[ord_y][x], "21"]);     //拐点
            }
            //当前选中方块在之前选中方块的下方
            else {
            path.push([M[y][ord_x], "23"]);     //拐点
            }
            path = path.concat(temp_2);

            return path;
            }
            else {
            return false;
            }
            }
            //当前选中方块在之前选中方块的左方
            else {
            temp_2 = this._NoPoint(x, ord_y, x, y);
            if (temp_2) {
            path = path.concat(temp_1);
            //当前选中方块在之前选中方块的上方
            if (ord_y > y) {
            path.push([M[y][ord_x], "41"]);     //拐点
            }
            //当前选中方块在之前选中方块的左方
            else {
            path.push([M[y][ord_x], "43"]);     //拐点
            }
            path = path.concat(temp_2);

            return path;
            }
            else {
            return false;
            }
            }
            }
            else {
            return false;
            }

            //                if (temp_1) {
            //                    guaidian =
            //                    temp_1 = temp_1.push();
            //                }


            //                temp_2 = this._NoPoint(ord_x, y, x, y);

            //                if (temp_1 && temp_2) {

            //                    path = path.concat(temp_1.path).concat(temp_2.path);
            //                    return path;
            //                }
            //                else {
            //                    temp_1 = this._NoPoint(ord_x, ord_y, x, ord_y, true, true);
            //                    temp_2 = this._NoPoint(x, ord_y, x, y, false, true);

            //                    if (temp_1 && temp_2) {

            //                        path = path.concat(temp_1.path).concat(temp_2.path);
            //                        return path;
            //                    }
            //                    else {
            //                        return false;
            //                    }
            //                }
            //                if (this._NoPoint(ord_x, ord_y, x, ord_y, true, true) && this._NoPoint(x, ord_y, x, y)) {
            //                    //                    LianLianKan.pathLine_arr = 
            //                    return true;
            //                }
            //                else {
            //                    //                    LianLianKan.pathLine_arr = [];
            //                    return false;
            //                }
            };

            //水平方向判断
            var this._TwoPoint_X = function (ord_x, ord_y, x, y, direction) {
            var M = this.P_map.Map.map;
            var temp = null;
            var path = [];
            var success = false;

            (direction == "right" && ord_x++) || (direction == "left" && ord_x--);
            while (ord_x < this.P_map.Map.col && ord_x >= 0 && M[ord_y][ord_x].img === 0) {
            temp = this._OnePoint(ord_x, ord_y, x, y);
            //找到了路径
            if (temp) {
            //当前选中方块在之前选中方块的右方
            if (direction == "right") {
            //右上方或右下方
            (ord_y > y && path.push([M[ord_y][ord_x], "21"])) || path.push([M[ord_y][ord_x], "23"]);
            }
            //当前选中方块在之前选中方块的右方
            else if (direction == "left") {
            //左上方或左下方
            (ord_y > y && path.push([M[ord_y][ord_x], "41"])) || path.push([M[ord_y][ord_x], "43"]);
            }
            else {
            throw new Error("direction error!");
            }
            //                        direction == "right" && path.push([M[ord_x][ord_y], "x"]);   //拐点

            //                        path.push(temp.path);
            path = path.concat(temp);

            //                        break;
            success = true;
            break;
            }
            else {
            path.push([M[ord_y][ord_x], "x"]);
            (direction == "right" && ord_x++) || (direction == "left" && ord_x--);
            //                        LianLianKan.pathLine_arr.push([M[ord_x][ord_y], "x"]);
            }
            }

            return success ? path : false;

            //                if (success) {
            //                    return path;
            //                }
            //                //                    return;
            //                //                }
            //                //                else {
            //                //                    return;
            //                //                }
            //                return success;
            };

            //垂直方向判断
            var this._TwoPoint_Y = function (ord_x, ord_y, x, y, direction) {
            //                var M = this.P_map.Map.map;
            //                var temp = null;
            //                var path = [];
            //                var success = false;

            //                (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            //                while (ord_y < this.P_map.Map.row && ord_y >= 0 && M[ord_x][ord_y].img !== 0) {
            //                    temp = this._OnePoint(ord_x, ord_y, x, y);
            //                    //找到了路径
            //                    if (temp) {
            //                        path.push([M[ord_x][ord_y], "y"]);   //拐点

            //                        path.push(temp.path);

            //                        //                        break;
            //                        success = true;
            //                        break;
            //                    }
            //                    else {
            //                        path.push([M[ord_x][ord_y], "y"]);
            //                        (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            //                        //                        LianLianKan.pathLine_arr.push([M[ord_x][ord_y], "x"]);
            //                    }
            //                }

            //                if (success) {
            //                    return path;

            //                }
            //                //                else {
            //                //                    return;
            //                //                }
            //                return success;


            var M = this.P_map.Map.map;
            var temp = null;
            var path = [];
            var success = false;

            (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            while (ord_y < LianLianKan.UI_CommonMap.Map.row && ord_y >= 0 && M[ord_y][ord_x].img === 0) {
            temp = this._OnePoint(ord_x, ord_y, x, y);
            //找到了路径
            if (temp) {
            //当前选中方块在之前选中方块的上方
            if (direction == "up") {
            //右上方或左上方
            (ord_x < x && path.push([M[ord_y][ord_x], "12"])) || path.push([M[ord_y][ord_x], "14"]);
            }
            //当前选中方块在之前选中方块的下方
            else if (direction == "down") {
            //右下方或左下方
            (ord_x < x && path.push([M[ord_y][ord_x], "32"])) || path.push([M[ord_y][ord_x], "34"]);
            }
            else {
            throw new Error("direction error!");
            }
            //                        direction == "right" && path.push([M[ord_x][ord_y], "x"]);   //拐点

            //                        path.push(temp.path);
            path = path.concat(temp);

            //                        break;
            success = true;
            break;
            }
            else {
            path.push([M[ord_y][ord_x], "y"]);
            (direction == "down" && ord_y++) || (direction == "up" && ord_y--);
            //                        LianLianKan.pathLine_arr.push([M[ord_x][ord_y], "x"]);
            }
            }

            return success ? path : false;
            };

            //有两个拐点
            var this._TwoPoint = function (ord_x, ord_y, x, y) {
            //                var result = true;
            //                var M = LianLianKan.UI_CommonMap.Map.map;
            var temp = null;
            var path = [];
            var success = false;
            //                LianLianKan.pathLine_arr = [];

            //上
            path = this._TwoPoint_Y(ord_x, ord_y, x, y, "up");
            if (path) {
            return path;
            }

            //下
            path = this._TwoPoint_Y(ord_x, ord_y, x, y, "down");
            if (path) {
            return path;
            }

            //左
            path = this._TwoPoint_X(ord_x, ord_y, x, y, "left");
            if (path) {
            return path;
            }

            //右
            path = this._TwoPoint_X(ord_x, ord_y, x, y, "right");
            if (path) {
            return path;
            }







            return false;
            //                return this._TwoPoint_X(ord_x, ord_y, x, y, "right") || this._TwoPoint_X(ord_x, ord_y, x, y, "left") || this._TwoPoint_Y(ord_x, ord_y, x, y, "up") || this._TwoPoint_Y(ord_x, ord_y, x, y, "down");

            //右
            //                this._TwoPoint_X(ord_x, ord_y, x, y, "right");

            //                ord_x++;
            //                while (ord_x < LianLianKan.UI_CommonMap.Map.col && M[ord_x][ord_y].img !== 0) {
            //                    temp = this._OnePoint(ord_x, ord_y, x, y);
            //                    //找到了路径
            //                    if (temp) {
            //                        path.push([M[ord_x][ord_y], "x"]);   //拐点

            //                        path.pathLine_arr.push(temp.path);

            //                        //                        break;
            //                        success = true;
            //                        break;
            //                    }
            //                    else {
            //                        path.push([M[ord_x][ord_y], "x"]);
            //                        ord_x++;
            //                        //                        LianLianKan.pathLine_arr.push([M[ord_x][ord_y], "x"]);
            //                    }
            //                }

            //                if (success) {
            //                    LianLianKan.pathLine_arr.concat(path);
            //                    return;
            //                }
            //                else {
            //                    path = [];
            //                }

            //左
            //                this._TwoPoint_X(ord_x, ord_y, x, y, "left");

            //上

            //下

            };

            return function (selected, x, y) {

            var result = null;
            //                    //赋值
            //                    ord_x = selected.x;
            //                    ord_y = selected.y;

            //                    x = _x;
            //                    y = _y;

            result = this._NoPoint(selected.x, selected.y, x, y);
            if (!result) {
            result = this._OnePoint(selected.x, selected.y, x, y);
            if (!result) {
            result = this._TwoPoint(selected.x, selected.y, x, y);

            if (!result) {
            return false;
            }
            }
            //                        else{
            ////                            LianLianKan.pathLine_arr.concat(result.path);
            //                        }
            }
            //                    else{
            ////                        LianLianKan.pathLine_arr.concat(result.path);
            //                    }

            LianLianKan.pathLine_arr = LianLianKan.pathLine_arr.concat(result);
            //                    return this._NoPoint(selected.x, selected.y, x, y);
            return true;
            };

            } ());
            */
            //判断方块可连接
            //寻找一对可以消去的方块，并保存路径
            //修改后的算法
            IsLink: function (selected, current) {
                var result = null;
                //获得x和y坐标，并转换为number类
                var ord_x = Number(selected.attr("x")),
                    ord_y = Number(selected.attr("y")),
                    x = Number(current.attr("x")),
                    y = Number(current.attr("y"));
                //                var t = LianLianKan.pathLine_arr;

                //重置
                this.path_arr = [];

                //                    //赋值
                //                    ord_x = selected.x;
                //                    ord_y = selected.y;

                //                    x = _x;
                //                    y = _y;

                result = this._NoPoint(ord_x, ord_y, x, y);
                if (!result) {
                    result = this._OnePoint(ord_x, ord_y, x, y);
                    if (!result) {
                        result = this._TwoPoint(ord_x, ord_y, x, y);

                        if (!result) {
                            return false;
                        }
                    }
                    //                        else{
                    ////                            LianLianKan.pathLine_arr.concat(result.path);
                    //                        }
                }
                //                    else{
                ////                        LianLianKan.pathLine_arr.concat(result.path);
                //                    }

                //                //指南针连线提示
                //                if (clue) {
                //                    LianLianKan.clueLine_arr = LianLianKan.clueLine_arr.concat(result);

                //                }
                //                else {
                //                    LianLianKan.pathLine_arr = LianLianKan.pathLine_arr.concat(result);
                //                }
                this.path_arr = result;

                //                    return this._NoPoint(selected.x, selected.y, x, y);
                return true;

            },
            //判断方块相同
            IsEqual: function (selected, M) {
                return selected.img === M.img;
            },
            IsNoPath: function (remain_num) {
                if (remain_num <= 0) {
                    return false;
                }
                return !this.FindPath();    //调用FindPath
            },
            //找到一对相同的方块
            FindBlock: function(){
            var i = 0, j = 0, t = 0, k = 0, temp = null;

                for (i = 0; i < this.P_map.Map.row; i++) {
                    for (j = 0; j < this.P_map.Map.col; j++) {
                        for (t = i; t < this.P_map.Map.row; t++) {
                            //此处k应该从j+1开始
                            for (k = 0; k < this.P_map.Map.col; k++) {
                                //"(j !== k || i !== t)"表示不是同一个方块
                                if (this.P_map.Map.map[i][j].img !== 0 && (j !== k || i !== t) && this.IsEqual(this.P_map.Map.map[i][j], this.P_map.Map.map[t][k])){
                                    //保存到相同方块的数组中
                                    this.common_block_arr[0] = this.P_map.Map.map[i][j];
                                    this.common_block_arr[1] = this.P_map.Map.map[t][k];

                                    return true;
                                }
                            }
                        }
                    }
                }
                //没找到相同的方块
                return false;
            },
            FindPath: function () {
                var i = 0, j = 0, t = 0, k = 0, temp = null;
                //                var M = this.P_map.Map.map;

                //如果玩家/boss增加方块
                if (this.P_addBlock_flag) {
                    this.P_ChangeFlag(); //改变对应的标志位，子类中实现
                }
                else {
                    //                    console.log(this.algorithm.clue_block_arr.length);

                    //如果之前提示的方块没有消去，且电脑没有对玩家使用路障或增加方块，则返回
                    if (this.clue_block_arr[0]) {
                        //                        console.log(this.clue_block_arr[0].img);
                        //                        console.log(this.clue_block_arr[1].img);
                        if (this.clue_block_arr[0].img !== 0 && this.clue_block_arr[1].img !== 0) {

                            //                    console.log("find return");
                            //                    //刷新gif动画
                            //                    this.P_map.clueLine.find("img").each(function () {
                            //                        $(this).attr("src", $(this).attr("src"));
                            //                    });

                            //保存路径
                            this.IsLink(this.clue_block_arr[0], this.clue_block_arr[1]);
                            //                    LianLianKan.clueLine_arr = operate.Clone(LianLianKan.path_arr);

                            return true;
                        }
                    }
                }
                for (i = 0; i < this.P_map.Map.row; i++) {
                    for (j = 0; j < this.P_map.Map.col; j++) {
                        for (t = i; t < this.P_map.Map.row; t++) {
                            //此处k应该从0开始，而不是从j开始！
                            for (k = 0; k < this.P_map.Map.col; k++) {

                                //                                console.log("i = " + i + "| j =" + j + "| t = " + t + "| k = " + k);

                                if (this.P_map.Map.map[i][j].img === 0 || !this.IsEqual(this.P_map.Map.map[i][j], this.P_map.Map.map[t][k]) || (t == i && k <= j)) {
                                    continue;
                                }

                                //                            //清空路径放到此处！
                                //                            //放到调用IsLink方法前！
                                //                            LianLianKan.clueLine_arr = [];


                                //                                                                var t = this.IsLink(this.P_map.Map.map[i][j], this.P_map.Map.map[t][k]);
                                //                                console.log(t);
                                //                                console.log(this.P_map);
                                //判断是否可连接并获得路径
                                if (this.IsLink(this.P_map.Map.map[i][j], this.P_map.Map.map[t][k])) {

                                    //                                //只显示连线
                                    //                                ShowLine.ShowClueLine(this.P_map.Map.map[i][j], this.P_map.Map.map[t][k], true);

                                    //                                        console.log(this.P_map.clueLine.find("div.clue_img").length);

                                    //                                        console.log(this.P_map.clueLine.find("div.clue_img").eq(0).html());
                                    //                                        this.P_map.clueLine.find("div.clue_img").eq(4).prepend($(this.P_map.Map.map[i][j].html()));


                                    //保存到已提示方块的数组中
                                    this.clue_block_arr[0] = this.P_map.Map.map[i][j];
                                    this.clue_block_arr[1] = this.P_map.Map.map[t][k];

                                    return true;
                                }
                            }
                        }
                    }
                }
                //无解
                this.clue_block_arr[0] = null;
                this.clue_block_arr[1] = null;
                return false;
            },
            //显示爆炸
            ShowBoom: function (selected_block, current_block) {
                var div = null;
                var offset_selected = selected_block.position();
                var offset_current_block = current_block.position();
                var self = this;

                //爆炸效果层
                div = this.P_map.line.children("div.clue");


                //爆炸动画
                div.eq(0).html("<img src='Image/boom.gif' onmousedown='operate.PreventDefault();'/>").css({ "left": offset_selected.left + "px", "top": offset_selected.top + "px" });
                div.eq(1).html("<img src='Image/boom.gif' onmousedown='operate.PreventDefault();'/>").css({ "left": offset_current_block.left + "px", "top": offset_current_block.top + "px" });


                div.find("img").each(function () {
                    self.ResetGifAnimation($(this));
                });
            },
            //消去方块
            Elimination: function (selected_block, current_block) {
                //重载
                if (arguments.length === 0) {
                    this.clue_block_arr[0].html("");
                    this.clue_block_arr[0].img = 0;

                    this.clue_block_arr[1].html("");
                    this.clue_block_arr[1].img = 0;
                }
                else {
                    //            console.log("Elimination");





                    //            //所有效果层隐藏
                    //            this.P_map.clueLine.children("div").css("left", "-4000px");
                    //            this.P_map.line.children("div").css("left", "-4000px");


                    //消去方块
                    selected_block.html("");
                    selected_block.img = 0;

                    current_block.html("");
                    current_block.img = 0;

                    //                //刷新剩余方块数
                    //                LianLianKan.Operate_Single.GetPlayer().remain_num -= 2;

                    //                //隐藏当前选中效果层
                    //                common.HideDiv(this.P_map.select_div);

                    //            div.eq(4)
                    //            //            L[3].innerHTML = L[4].innerHTML
                    //            var t = $("<img src='Image/boom.gif' />");
                    //            LianLianKan.UI_CommonMap.select_div.append(t);
                    //            selected.block.html();
                    //            selected.block.html("<img src='Image/boom.gif'>");
                    //            selected.block.img = 0;

                    //            current_block.html("<img src='Image/boom.gif'>");
                    //            current_block.img = 0;
                }
            }
        },
        //不允许被覆写
        Sealed: {
            //注入map对象(用于Operate_Game.js调用Dispose后)。
            SetMap: function (map) {
                this.P_map = map;
            }
        }
    },
    Abstract: {
        //显示连线
        ShowLine: function () {
        },
        Dispose: function () {
        }
    }
});


//玩家算法类
var Game_Algorithm = MyClass(Algorithm, {
    Protected: {
        //*实现模版成员

        P_ChangeFlag: function () {
            LianLianKan.player_addBlock_flag = false;
        },
        P_map: null,
        P_addBlock_flag: false
    },
    Public: {

        Init: function (map) {
            this.P_map = map;
            //                console.log(this.P_map);
        },
        //            //判断方块相同
        //            IsEqual: function (selected, M) {
        //                //                return selected.img === M.img;
        //                this.base(selected, M);
        //            },
        FindPath: function () {
            //复写模版成员
            this.P_addBlock_flag = LianLianKan.player_addBlock_flag;
            //调用父类同名方法
            return this.baseToSubClass();
        },
        ShowLine: function (selected_block, current_block, _div) {
            var div = null;
            var i = 0, len = 0, path_len = 0;
            var offset_selected = selected_block.position();
            var offset_current_block = current_block.position();
            var currentDiv = null;
            var temp = null;
            var row_gif = "", col_gif = "";
            var self = this;


            //            //清除上次路径的gif动画
            //            for (i = 0, len = LianLianKan.prePathLine.length; i < len; i++) {
            //                LianLianKan.prePathLine[i].html("");
            //            }
            //            //重置prePathLine
            //            LianLianKan.prePathLine = [];


            //                console.log("_div = " + _div);

            //                if (_div != "ShowClueLine") {
            //爆炸和连线效果层
            div = this.P_map.line.children("div");
            //                }
            //                else {
            //                    div = LianLianKan.UI_CommonMap.clueLine.children("div");
            //                }

            //所有效果层隐藏
            //改用直接清空。因为如果不清空，则div中图片可能会过多，这样在ie7下就会造成有些连线显示不出来！（ff和ie9正常）

//            common.HideDiv(this.P_map.line.children("div"));
            div.html("");
            //                common.HideDiv(LianLianKan.UI_CommonMap.clueLine.children("div"));

            //连线gif图片。
            //指定图片的width(31)和height(35)，要不然连线可能会过长
            row_gif = "<img src='Image/row.gif' width=" + LianLianKan.config.BIGWIDTH.toString() + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px onmousedown='operate.PreventDefault();'/>";
            col_gif = "<img src='Image/col.gif' width=" + LianLianKan.config.BIGWIDTH.toString() + "px height=" + LianLianKan.config.BIGHEIGHT.toString() + "px onmousedown='operate.PreventDefault();'/>";

            //连线动画
            for (i = 0, len = this.path_arr.length; i < len; i++) {
                currentDiv = div.eq(i);     //i<=2
                //连线长度
                path_len = this.path_arr[i].len;

                //                    console.log(path_len);

                //长度加1，这样就可以应对有拐点的情况了
                path_len += 1;

                //                var ll = (LianLianKan.config.BIGWIDTH * (LianLianKan.pathLine_arr[i].len) + 10).toString();
                switch (this.path_arr[i].direction) {
                    //                    case "x_left":                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    case "x":

                        currentDiv.html(new Array(path_len + 1).join(row_gif));
                        currentDiv.css({ "width": (LianLianKan.config.BIGWIDTH * path_len).toString() + "px", "height": LianLianKan.config.BIGHEIGHT.toString() + "px",
                            "left": (this.path_arr[i].x - Math.round(LianLianKan.config.BIGWIDTH / 2)).toString() + "px", "top": this.path_arr[i].y.toString() + "px"
                        });
                        break;
                    //                    case "x_left":                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    //                        currentDiv.html(new Array(this.path_arr[i].len + 1).join("<img src='Image/row.gif' />"));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    //                        currentDiv.css({ "width": LianLianKan.config.BIGWIDTH * (LianLianKan.pathLine_arr[i].len + 1) + "px", "height": LianLianKan.config.BIGHEIGHT.toString() + "px",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    //                            "left": (LianLianKan.pathLine_arr[i].x + LianLianKan.config.BIGWIDTH / 2).toString() + "px", "top": LianLianKan.pathLine_arr[i].y.toString() + "px"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    //                        });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    //                        break;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    case "y":
                        currentDiv.html(new Array(path_len + 1).join(col_gif));

                        //ie7下，y轴连线要往上移点
                        if (ie7) {
                            currentDiv.css({ "width": LianLianKan.config.BIGWIDTH.toString() + "px", "height": (LianLianKan.config.BIGHEIGHT * path_len).toString() + "px",
                                "left": this.path_arr[i].x.toString() + "px", "top": (this.path_arr[i].y.toString() - Math.round(LianLianKan.config.BIGHEIGHT / 2) - 10).toString() + "px"
                            });
                        }
                        else {
                            currentDiv.css({ "width": LianLianKan.config.BIGWIDTH.toString() + "px", "height": (LianLianKan.config.BIGHEIGHT * path_len).toString() + "px",
                                "left": this.path_arr[i].x.toString() + "px", "top": (this.path_arr[i].y.toString() - Math.round(LianLianKan.config.BIGHEIGHT / 2)).toString() + "px"
                            });
                        }

                        break;
                    default:
                        throw new Error("direction error!");
                        break;
                }
            }


            //            console.log(offset_current_block.top);

            //                if (_div == "ShowClueLine") {
            //                    //方块提示框插入方块图片，用于覆盖连线的图片
            //                    temp = current_block.html();
            //                    div.find(".clue_img").html(temp);

            //                    //方块提示框
            //                    div.eq(3).css({ "left": offset_selected.left + "px", "top": offset_selected.top + "px" }).attr({ "x": offset_selected.left,
            //                        "y": offset_selected.top
            //                    });
            //                    div.eq(4).css({ "left": offset_current_block.left + "px", "top": offset_current_block.top + "px" }).attr({ "x": offset_current_block.left,
            //                        "y": offset_current_block.top
            //                    });
            //                }
            //                else {


            if (_div == "ShowClueLine") {
                //方块提示框插入方块图片，用于覆盖连线的图片
                temp = current_block.html();
                div.eq(3).html(temp).append("<div class='clue_border'></div>");
                div.eq(4).html(temp).append("<div class='clue_border'></div>");

                //方块提示框
                div.eq(3).css({ "left": offset_selected.left + "px", "top": offset_selected.top + "px" }).attr({ "x": offset_selected.left,
                    "y": offset_selected.top
                });
                div.eq(4).css({ "left": offset_current_block.left + "px", "top": offset_current_block.top + "px" }).attr({ "x": offset_current_block.left,
                    "y": offset_current_block.top
                });
            }

            div.find("img").each(function () {
                self.ResetGifAnimation($(this));
            });
        },
        ResetGifAnimation:function(img){
            $(img).attr("src", $(img).attr("src") + "?" + new Date().getTime());
        } ,
        Dispose: function () {
            this.P_map = null;
            this.path_arr = [];
            this.clue_block_arr = [];
        }
        //            IsLink: function (selected, current) {
        //                return this.baseToSubClass(selected, current);     //调用子类的FindPath     模版模式
        //            },
        //            IsNoPath: function (remain_num) {
        //                this.baseToSubClass(remain_num);    //调用子类的FindPath     模版模式
        //            },
        //            //消去方块
        //            Elimination: function (selected_block, current_block) {
        //                this.base(selected_block, current_block);
        //            }
    }
});

//Boss算法类
var Boss_Algorithm = MyClass(Algorithm, {
    Protected: {
        //*实现模版成员

        P_ChangeFlag: function () {
            LianLianKan.boss_addBlock_flag = false;
        },
        P_map: null,
        P_addBlock_flag: false
    },
    Public: {
        Init: function (map) {
            this.P_map = map;
            //                console.log(this.P_map);
        },
        ShowLine: function () {
            throw new Error();
        },
        FindPath: function () {
            //复写模版成员
            this.P_addBlock_flag = LianLianKan.boss_addBlock_flag;
            //调用父类同名方法
            return this.baseToSubClass();
        },
        Dispose: function () {
            this.P_map = null;
            this.path_arr = [];
            this.clue_block_arr = [];
        }
        //            //判断方块相同
        //            IsEqual: function (selected, M) {
        //                //                return selected.img === M.img;
        //                this.base(selected, M);
        //            },
        //            IsLink: function (selected, current) {
        //                return this.baseToSubClass(selected, current);     //调用子类的FindPath     模版模式
        //            },
        //            IsNoPath: function (remain_num) {
        //                return this.baseToSubClass(remain_num);    //调用子类的FindPath     模版模式
        //                //                if (remain_num <= 0) {
        //                //                    return false;
        //                //                }
        //                //                return !this.FindPath();    //调用子类的FindPath     模版模式
        //            },
        //            //消去方块
        //            Elimination: function (selected_block, current_block) {
        //                this.base(selected_block, current_block);
        //            }
    }
});