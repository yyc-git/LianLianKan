//地图数据类，相当于模版类
function Map(index, name, data, author) {
    //        this.id = id || (Link.Map.Index ? ++Link.Map.Index : Link.Map.Index = 1);
    //    this.id = id;

    this.index = index || 0;
    this.name = name || "";
    this.data = data || "";
    this.author = author || "system";

    this.num = this.data.replace(/_/g, "").length;  //data中1的个数
//    this.time = time || 0;
};

//地图数据
//    var DataSource_MapData = [new Map(1, 'All', '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111', 'System', 0)];

//        var DataSource_MapData = [new Map(1, 'All', '1111111111 1111111111 1111111111 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111', 'System', 0)];

//        var DataSource_MapData = [new Map(1, 'All', '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111', 'System', 0)];

//var DataSource_MapData = [new Map(1, 'All', '111111111111111111111___________________1___________________1___________________1___________________1___________________1___________________111111111111111111111___________________1___________________', 'System', 0)];
//    var DataSource_MapData = [new Map(1, 'All', '_____11111_____11111________1111111111111____111111____11111111111111111111____111111111111111111111111111111_______________________________111111111111111111111____________________', 'System', 0)];
//        var DataSource_MapData = [new Map(1, 'All', '11___111_______________________________111111111111111111111____________________111111111111111111', 'System', 0)];

//    var DataSource_MapData = [new Map(1, 'All', '11___111_______________________________1__________________111111111111111111', 'System', 0)];



//地图数据要按序号加入
var DataSource_MapData = [
//new Map('System1', '', 'System', 0)
//new Map('All', '__11__________________11________________', 'System', 0),
//new Map('All', '__1111________________11________________', 'System', 6),
//new Map('Easy', '11___111_______________________________1__________________1111', 'YYC', 10),
//new Map('Easy', '11___111_______________________________1__________________1111', 'YYC', 10),
//new Map('Easy', '11___111_______________________________1__________________1111', 'YYC', 10),
//new Map('Easy', '11___111_______________________________1__________________1111', 'YYC', 10),
//new Map('Easy', '11___111_______________________________1__________________1111', 'YYC', 10),
//new Map('Easy', '__1___________________11___________________11111_______111__________1_11_1111________________1_______111111_1_111________1111111111111___________1111111_1_11111___11_____1_1_1_1111____________________', 'YYC', 64)


//            YYC:            _____________________1___1__1___1__1111__1___1__1___1_1______1___1__1___1_1______1___1__1___1_1______1___1__1___1_1______11111__11111_1________1______1___1________1______1____1111_____________________


//                        绝望|_____________________111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111_____________________|system          

//cg|______________________1111111___1111111__1_________1______1__1_________1______1__1_________1______1__1_________11111111__1________________1__1_________1______1___1111111__11111111_____________________|system


//                        
//a|111111111111111111111111111111111111111111111111111111111111111111_________111111111111_______11111111111111_____1111111111111111___11111111111111111111111111111111111111111111111111111111111111111111|system
//b|_____________________11111___1___1___1_____1_____11__1__11_____1_____111_1_111_____1_____111111111_____1_________1_________1_________1_______11111___111111111__________________________________________|system
//c|_____________________111111111111111111___________________1___________________1__111111111111111111__1___________________1___________________111111111111111111_________________________________________|system
//d|_____________________11111111111111111___1___________________1_111111111111111___1_______________1___111111111111111_1___________________1___11111111111111111__________________________________________|system
//杨|________________________1_____1111111_______1_________11______11111______11_________1_______11_________111_____111111_____1_1_1______1__1____1__1__1____1_1_1_______1______1__111_______________________|system
//元|_______________________11111111111111____________________________________________111111111111111111_______1______1____________1______1____________1______1_______111111______111111_____________________|system
//超|_____1______111111_____11111_____1___1_______1______1___11____1111111________________1______111111_______1______1____1_____1_111____1____1____1__1______111111___1_1________________1__1111111111111111_|system
//莹|______1_____1___________111111111111__________1_____1_________1111111111111111____1______________1____1__111111111___1___________1_______________111111111_______________1_1_____________111111111______|system
//WYJ|_1_____1_____1________1___111___1__________111___111____________1_____1______________________________1___1___11111111111__1_1_________1________1__________1________1________1_1________1_________11_____|system                        
//        LR|_____________________1_________11111111__1_________1______1__1_________1______1__1_________1_____1___1_________111111____1_________1__1______1_________1___1_____1111111___1____1_______________________|system
//突出重围|111111111111111111111__________________11_1111111111111111_11_1______________1_11_1_111111111111_1_11_1_111111111111_1_11_1______________1_11_1111111111111111_11__________________111111111111111111111|system
//g|111111111111111111111__________________11_1111111111111111_11________________1_11_1111111111111111_11_1111111111111111_11_1________________11_1111111111111111_11__________________111111111111111111111|system
//牛|_____1___1______________1____1_____________111111111111_______1______1___________1_______1___________________1___________111111111111111111__________1___________________1___________________1__________|system
//方块|_____________________11_11_11_11_11_11___11_11_11_11_11_11_______________________11_11_11_11_11_11___11_11_11_11_11_11_______________________11_11_11_11_11_11___11_11_11_11_11_11______________________|system                 
//Boss|111_______________111__1_____________1__1__1_____________1__1__1_____________1__111___111___111__1__1____1___1_1___1_111111__1___1_1___1___11__1_1___1_1___1___11__1__111___111____11111_____________11_|system

new Map(0, 'YYC', '_____________________1___1__1___1__1111__1___1__1___1_1______1___1__1___1_1______1___1__1___1_1______1___1__1___1_1______11111__11111_1________1______1___1________1______1____1111_____________________', 'system'),
new Map(1, '绝望', '_____________________111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111__111111111111111111_____________________', 'system'),
new Map(2, 'cg', '______________________1111111___1111111__1_________1______1__1_________1______1__1_________1______1__1_________11111111__1________________1__1_________1______1___1111111__11111111_____________________', 'system'),
new Map(3, 'a', '111111111111111111111111111111111111111111111111111111111111111111_________111111111111_______11111111111111_____1111111111111111___11111111111111111111111111111111111111111111111111111111111111111111', 'system'),
new Map(4, 'b', '_____________________11111___1___1___1_____1_____11__1__11_____1_____111_1_111_____1_____111111111_____1_________1_________1_________1_______11111___111111111__________________________________________', 'system'),
new Map(5, 'c', '_____________________111111111111111111___________________1___________________1__111111111111111111__1___________________1___________________111111111111111111_________________________________________', 'system'),
new Map(6, 'd', '_____________________11111111111111111___1___________________1_111111111111111___1_______________1___111111111111111_1___________________1___11111111111111111__________________________________________', 'system'),
new Map(7, '杨', '____1_____111111111_____1____________1______1___________1____1111111_______1________1________11________111______1111111___1_1_1______1__1_1__1__1__1____1__1__1_____1______1__1___1_____1_____1__1___11_', 'system'),
new Map(8, '元', '_______________________11111111111111____________________________________________111111111111111111_______1______1____________1______1____________1______1_______111111______111111_____________________', 'system'),
new Map(9, '超', '_____1______111111_____11111_____1___1_______1______1___11____1111111________________1______111111_______1______1____1_____1_111____1____1____1__1______111111___1_1________________1__1111111111111111_', 'system'),
new Map(10, '莹', '______1_____1___________111111111111__________1_____1_________1111111111111111____1______________1____1__111111111___1___________1_______________111111111_______________1_1_____________111111111______', 'system'),
new Map(11, 'WYZ', '_1_____1_____1________1___111___1__________111___111____________1_____1______________________________1___1___11111111111__1_1_________1________1__________1________1________1_1________1_________11_____', 'system'),
new Map(12, 'LR', '_____________________1_________11111111__1_________1______1__1_________1______1__1_________1_____1___1_________111111____1_________1__1______1_________1___1_____1111111___1____1_______________________', 'system'),
new Map(13, '突出重围', '111111111111111111111__________________11_1111111111111111_11_1______________1_11_1_111111111111_1_11_1_111111111111_1_11_1______________1_11_1111111111111111_11__________________111111111111111111111', 'system'),
new Map(14, 'g', '111111111111111111111__________________11_1111111111111111_11________________1_11_1111111111111111_11_1111111111111111_11_1________________11_1111111111111111_11__________________111111111111111111111', 'system'),
new Map(15, '牛', '_____1___1______________1____1_____________111111111111_______1______1___________1_______1___________________1___________111111111111111111__________1___________________1___________________1__________', 'system'),
//new Map(-1, 'Bos1s', '1111111111', 'system'),
new Map(16, '方块', '_____________________11_11_11_11_11_11___11_11_11_11_11_11_______________________11_11_11_11_11_11___11_11_11_11_11_11_______________________11_11_11_11_11_11___11_11_11_11_11_11______________________', 'system'),
new Map(17, 'Boss', '111_______________111__1_____________1__1__1_____________1__1__1_____________1__111___111___111__1__1____1___1_1___1_111111__1___1_1___1___11__1_1___1_1___1___11__1__111___111____11111_____________11_', 'system')
//new Map('', '', 'system')
];
//保存系统自带地图的副本，用来还原地图数据
var Copy_DataSource_MapData = operate.Clone(DataSource_MapData);
////增加是否加入自定义地图的标志属性
//Copy_DataSource_MapData.AddCustomMap = false;
//var addCustomMap_flag = false;
//DataSource_MapData.AddCustomMap = false;

