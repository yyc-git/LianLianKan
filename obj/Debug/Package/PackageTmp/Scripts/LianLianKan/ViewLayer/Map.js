/***************************************************************** 显示层 **************************************************/

//地图类接口
//var Interface_UI_Map = MyInterface("InitGameArea", "InitMap", "Dispose");

//地图基类
var Abstract_UI_Map = MyAbstract({
    Public: {
        Virtual: {
            //创建地图区域
            InitGameArea: function (Map, width, height) {
                var i, j, row, col, t, temp;

                var width = width ? width : LianLianKan.config.BIGWIDTH.toString(),
                height = height ? height : LianLianKan.config.BIGHEIGHT.toString();

                //创建table
                t = Map.table = $("<table border='0' cellpadding='0' cellspacing='0'></table>");

                for (i = 0; i < Map.row; i++) {
                    Map.map[i] = [];
                    row = $("<tr></tr>");
                    for (j = 0; j < Map.col; j++) {
                        //绑定Map数组，并绑定坐标属性
                        //注意！此处x坐标为j，y坐标为i
                        //td指定width和height，这样不会发生一列或一行消完后，发生错位的现象。
                        Map.map[i][j] = $("<td width=" + width + "px height=" + height + "px x=" + j + " y=" + i + "></td>").appendTo(row);
                    }
                    t.append(row);
                }

                //将table加入到地图中
                Map.gameArea.append(t);

                //                //选中方块的效果层1
                //                this.select_div = $("<div class='select'></div>").appendTo(Map.gameArea);


                //                //爆炸和连线效果层
                //                this.line = $("<div class='lineContainer'></div>").appendTo(Map.gameArea);

                //                //两个div放爆炸动画，一个放横线，一个放竖线，还有一个用于两个拐点的情况，放横线或者竖线。
                //                //此处已经插入爆炸动画
                //                this.line.append($("<div></div><div></div><div></div><div class='clue'><img src='Image/boom.gif'></div><div class='clue'><img src='Image/boom.gif'></div>"));


                //            //使用炸弹道具的爆炸和连线效果层
                //            this.bomb_line = $("<div class='lineContainer'></div>").appendTo(this.Map.gameArea);

                //            //两个div放爆炸动画，一个放横线，一个放竖线，还有一个用于两个拐点的情况，放横线或者竖线。
                //            //此处已经插入爆炸动画
                //            this.bomb_line.append($("<div></div><div></div><div></div><div class='boom'><img src='Image/bomb_boom.gif'></div><div class='boom'><img src='Image/bomb_boom.gif'></div>"));



                //            //连线提示效果层
                //            this.clueLine = $("<div class='lineContainer'></div>").appendTo(this.Map.gameArea);
                //            /// <reference path="Image/box/img001.bmp" />

                //            /*两个div为提示方框，一个放横线，一个放竖线，还有一个用于两个拐点的情况，放横线或者竖线。

                //            此处要实现提示方框（设置border为红色）覆盖连线图片（因为连线图片会有半截在提示方框内），
                //            如果单纯的设置提示方框的z-index，不能覆盖。

                //            因为经我测试，比如有两个同级的层1和层2，它们都设置了position（为relative或者absolute，层1的left:0px,top:0px，层2的left:-10px, top:0px）、
                //            border(层1蓝色，层2红色)、z-index（层1为10，层2为20），则层2的边框能够覆盖层1的边框。
                //            如果层2加入了图片（如.html("<img src='Image/box/img001.bmp' />")），则层2的图片会显示到层1中（但是层1的边框仍然会覆盖层2的图片）！
                //            如果层1设置了背景色或者也加入了图片（如.html("<img src='Image/box/img002.bmp' />"），则层2的图片在层1中重叠的部分会被覆盖！

                //            所以基于上面的测试和分析，此处.clue设置z-index为10（连线图片的层没有设置z-index），.clue_img中放置图片（用于覆盖连线图片重叠的部分）。

                //            注意此处.clue中没有设置border，而是在.clue_border中设置。这是因为如果在.clue中设置border，则显示效果不好（.clue_img中的图片会被挤出去），
                //            所以在.clue_border中设置border，并设置其position:absolute和left:0，这样图片就不会被挤出去了（相当于加了个效果层，套到图片上）。
                //            */
                //            this.clueLine.append($("<div></div><div></div><div></div><div class='clue'><span class='clue_img'></span><div class='clue_border'></div></div><div class='clue'><span class='clue_img'></span><div class='clue_border'></div></div>"));
            },

            //生成地图
            InitMap: function (mapIndex, Map, width, height) {

                var oMap = null,
                width = width ? width.toString() : LianLianKan.config.BIGWIDTH.toString(),
                height = height ? height.toString() : LianLianKan.config.BIGHEIGHT.toString(),
                    data = [],
                    i, j, tmp, tmp_2,
                //方块图片种类数
                    iCount = LianLianKan.config.IMGAGECOUNT,
                //该地图的方块数量
                    num = 0;
                //                    mapIndex = 0;

                //            var selCount = Math.ceil(oMap.num / 4), 
                var imgs = [], selImgs = [], M = Map.map;


                //                //随机地图
                //                if (Map.mapIndex == -1) {
                //                    //生成随机地图序号
                //                    mapIndex = MyGameEngine.Random._NToM(0, DataSource_MapData.length - 1);
                //                }
                //                else {
                //                    mapIndex = Map.mapIndex;
                //                }
                //                console.log(mapIndex);
                //获得地图数据
                //                oMap = Data_Map.GetMap(mapIndex);
                oMap = LianLianKan.Operate.GetMap(mapIndex);

                data = oMap.data.split("");
                //该地图的方块数量
                num = oMap.num;

                if (operate.IsOdd(num)) {
                    throw new Error("地图方块数量必须为偶数！");
                }

                //                console.log(iCount);
                for (i = 0; i <= num; i = i + 2) {
                    temp = operate.Random._NToM(1, iCount); //随机生成图片序号
                    //                temp = 1;
                    //保证图片配对
                    imgs[i] = temp;
                    imgs[i + 1] = temp;
                }

                //打乱数组（num次）
                for (i = 0; i < num; i++) {
                    j = parseInt(Math.random() * num);
                    tmp = imgs[i];
                    imgs[i] = imgs[j];
                    imgs[j] = tmp;
                }

                tmp = 0;
                for (var i = 0; i < Map.row; i++) {
                    for (var j = 0; j < Map.col; j++) {
                        if (data[i * Map.col + j] === "1") {
                            //此处没有设置td的背景图片为方块图片，而是插入图片。
                            //禁止鼠标拖动图片。
                            M[i][j].html("<img src='Image/box/img" + ("00" + imgs[tmp]).slice(-3) + ".bmp'  width=" + width + "px height=" + height + "px onmousedown='operate.PreventDefault();'/>");
                            M[i][j].img = imgs[tmp];    //保存方块图片序号
                            //M[i][j].innerHTML = M[i][j].img;
                            tmp++;
                        } else {
                            M[i][j].html("");
                            M[i][j].img = 0;
                        }
                        //                    //绑定坐标
                        //                    M[i][j].x = i;
                        //                    M[i][j].y = j;
                    }
                }

                //                console.log("base num = " + num);

                return num;

                //
                //            var span = DOTA.$("mapDetail").getElementsByTagName("span");
                //            DOTA.$("mapImage").innerHTML = "<img title='双击重玩该地图' src='images/map/map" + oMap.id + "B.gif' border='0'>";
                //            span[0].innerHTML = oMap.name;
                //            span[1].innerHTML = oMap.num < 80 ? "简单" : (oMap.num < 120 ? "一般" : (oMap.num < 160 ? "困难" : "超难"));
                //            span[2].innerHTML = oMap.num;
                //            span[3].innerHTML = oMap.author;
                //            this.currentMap = this.getMapIndex();
            }
        }
    },
    Abstract: {
        Dispose: function () {
        }
    }
});

//地图子类

//大地图
var UI_CommonMap = MyClass(Abstract_UI_Map, {
    Public: {
        //选中方块的效果层1
        select_div: null,
        //爆炸和连线的效果层2
        line: null,
        //地图设置
        Map: {
            row: LianLianKan.config.ROW,
            col: LianLianKan.config.COL,
            gameArea: $("#lianliankan_map"),    //地图区域，设置了position为相对（这样地图内的绝对定位的层就以该地图为参照了）
            map: [],
            table: null,     //表格对象
            mapIndex: -1     //使用的地图序号
        },
        InitGameArea: function () {
            this.baseToSubClass(this.Map);

            //选中方块的效果层1
            this.select_div = $("<div class='select'></div>").appendTo(this.Map.gameArea);

            //爆炸和连线效果层
            this.line = $("<div class='lineContainer'></div>").appendTo(this.Map.gameArea);

            //两个div放爆炸动画，一个放横线，一个放竖线，还有一个用于两个拐点的情况，放横线或者竖线。
            this.line.append($("<div></div><div></div><div></div><div class='clue'></div><div class='clue'></div>"));

        },
        InitMap: function (mapIndex) {
            //                var num = 0;
            //                num = this.baseClass.InitMap(this.Map);
            return this.baseToSubClass(mapIndex, this.Map);
            //                console.log("num = " + num);
            //                return num;

        },
        Dispose: function () {
            //            common.HideDiv(this._map.line.children("div"));
            //            common.HideDiv(this._map.select_div);

            //            this.Map.gameArea.empty();
            this.select_div && this.select_div.remove();
            this.select_div = null;

            //            this.Map.gameArea.remove(this.line);
            this.line && this.line.remove();
            this.line = null;

            //            this.Map.gameArea.remove(this.Map.table);
            this.Map.table && this.Map.table.remove();
            this.Map.table = null;

            this.Map.map = [];
            this.Map.mapIndex = 0;
        }
    }
});

//小地图（Boss地图）
var UI_SmallMap = MyClass(Abstract_UI_Map, {
    Public: {
        //            //选中方块的效果层1
        //            select_div: null,
        //            //爆炸和连线的效果层2
        //            line: null,
        //地图设置
        Map: {
            row: LianLianKan.config.ROW,
            col: LianLianKan.config.COL,
            gameArea: $("#lianliankan_smallMap"),    //地图区域
            map: [],
            table: null,     //表格对象
            mapIndex: -1     //使用的地图序号
        },
        InitGameArea: function () {
            this.baseToSubClass(this.Map, LianLianKan.config.SMALLWIDTH, LianLianKan.config.SMALLHEIGHT);
            //                //选中方块的效果层1
            //                this.select_div = $("<div class='select'></div>").appendTo(this.Map.gameArea);

            //                //爆炸和连线效果层
            //                this.line = $("<div class='lineContainer'></div>").appendTo(this.Map.gameArea);

            //                //两个div放爆炸动画，一个放横线，一个放竖线，还有一个用于两个拐点的情况，放横线或者竖线。
            //                this.line.append($("<div></div><div></div><div></div><div class='clue'></div><div class='clue'></div>"));

        },
        InitMap: function (mapIndex) {
            //                var num = 0;
            return this.baseToSubClass(mapIndex, this.Map, LianLianKan.config.SMALLWIDTH, LianLianKan.config.SMALLHEIGHT);
            //                //刷新剩余方块数
            //                LianLianKan.Operate_Boss.GetPlayer().remain_num = num;
            //                return num;
            //                console.log(LianLianKan.Operate_Boss.GetPlayer().remain_num);
        },
        Dispose: function () {
            //            common.HideDiv(this._map.line.children("div"));
            //            common.HideDiv(this._map.select_div);

//            this.Map.gameArea.remove(this.select_div);
//            this.select_div = null;

//            this.Map.gameArea.remove(this.line);
//            this.line = null;

            this.Map.table && this.Map.table.remove();
            this.Map.table = null;

            this.Map.map = [];
            this.Map.mapIndex = 0;
        }
    }
});


