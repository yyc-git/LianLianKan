

/*************************************************************** 数据层 ***************************************************/

var Data_Map = {
    //获得地图数据
    GetMap: function (id) {
        var curMap = id >= 0 ? id : parseInt(Math.random() * DataSource_MapData.length);
        //            if (!this.lockMap) {
        //                this.mapIndex = -1;
        //            }
        return DataSource_MapData[curMap];
    }
};

var Data_Player = {
    GetPlayer: function () {
                 //此处玩家类都用单例模式。这样是为了能共享同一实例的数据。
        return SingleGamePlayer.GetInstance(Game_Player);
    },
    //获得得分
    GetScore: function (name) {
        var score = operate.GetCookie(name + "_score");
        return score == "no" ? 0 : score;
    },
    //记录得分
    SetScore: function (name, value) {
        //保存100个小时
        operate.TrySetCookie(name + "_score", value, 100);
    },
    //获得挑战boss的情况（挑战到第几个boss了）
    GetBossIndex: function (name) {
        var bossIndex = operate.GetCookie(name + "_boss_index");
        return bossIndex == "no" ? "" : bossIndex;
    },
    //记录挑战boss的情况（挑战到第几个boss了）
    SetBossIndex: function (name, value) {
            //保存100个小时
        operate.TrySetCookie(name + "_boss_index", value, 100);
    },
    //获得等级情况
    GetLevel: function (name) {
            var level = operate.GetCookie(name + "_level");
        return level == "no" ? "" : level;
    },
    //记录等级情况
    SetLevel: function (name, value) {
            //保存100个小时
        operate.TrySetCookie(name + "_level", value, 100);
    },
//    //最高连击数
//    GetHightestDoubleHit: function(name){
//        var highestDoubleHit = operate.GetCookie(name + "_highestDoubleHit");
//        return highestDoubleHit == "no" ? 0 : highestDoubleHit;
//    },
//    SetHightestDoubleHit: function(name, value){
//        //保存100个小时
//        operate.TrySetCookie(name + "_highestDoubleHit", value, 100);
//    },
    //获得姓名
    GetName: function (_name) {
            var name = operate.GetCookie(_name + "_name");
        return name == "no" ? "player" : name;
    },
    //记录姓名
    SetName: function (name, value) {
            //保存100个小时
        operate.TrySetCookie(name + "_name", value, 100);
    }
};



var Data_Boss = {
    GetPlayer: function (index) {
        //此处Boss类都用单例模式。这样是为了能共享同一实例的数据。
        return SingleBoss.GetInstance(index);
    },

    //获得经验值
    GetExperience: function (name) {
        var experience = operate.GetCookie(name + "_ai_experience");
        return experience == "no" ? 0 : experience;
    },
    //记录经验值
    SetExperience: function (name, value) {
        //保存100个小时
        operate.TrySetCookie(name + "_ai_experience", value, 100);
    },
//    //获得Boss速度
//    GetAi_speed: function (name) {
//        return 1;
//    },
//    //记录Boss速度
//    SetAi_speed: function (name) {
//    },
//    //获得玩家计时器速度
//    GetTime_speed: function (name) {
//    },
//    //记录玩家计时器速度
//    SetTime_speed: function (name) {
//    },
//    //获得玩家消去一对方块加的时间
//    GetAddTime: function (name) {
//    },
//    //记录玩家消去一对方块加的时间
//    SetAddTime: function (name) {
//    },
    //获得等级情况
    GetLevel: function (name) {
        var level = operate.GetCookie(name + "_ai_level");
        return level == "no" ? 1 : level;
    },
    //记录等级情况
    SetLevel: function (name, value) {
            //保存100个小时
        operate.TrySetCookie(name + "_ai_level", value, 100);
    }
//    //获得序号
//    GetIndex: function (name) {
//        var index = operate.GetCookie(name + "_ai_index");
//        return index == "no" ? "" : index;
//    },
//    //记录序号
//    SetIndex: function (name, value) {
//        //保存100个小时
//        operate.TrySetCookie(name + "_ai_index", value, 100);
//    }

     //Boss不能修改name

//    //获得姓名
//    GetName: function (name) {
////        return "ba";
//    },
//    //记录姓名
//    SetName: function (name) {
//    }
};


/*************************************************************** 数据层结束 ***************************************************/
