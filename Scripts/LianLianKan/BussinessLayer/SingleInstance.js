/* 单例模式 */

//获得道具类的单例。
//每个道具会使用一个算法对象。算法对象不能共用一个（即全局对象）的原因是，算法的path_arr属性不能共用！
//相当于创建道具类的静态实例，每个道具类静态实例有一个不同的算法对象。
var SingleProp = (function () {
    var instance = [];  //道具类实例数组

    var GetInstance = function (type, algorithm, map) {
        var temp = null;
        var result = instance.filter(function (el) {
            if (el instanceof type) {
                return el;
            }
        });

//        if (result.length === 0) {
//            algorithm ? instance.push(new type(algorithm)) : instance.push(new type());
//            return new type;
//        }
        if (result.length === 0) {
            temp = new type(algorithm, map);
            instance.push(temp);
            return temp;
        }
        else {
            if (result.length > 1) {
                throw new Error("实例多于1个！");
            }
            return result[0];
        }
    };

    var Dispose = function () {
        instance = [];
    };

    return {
        GetInstance: GetInstance,
        Dispose: Dispose
    }
} ());



//获得技能类的单例。
var SingleAbility = (function () {
    var instance = [];  //技能类实例数组

    var GetInstance = function (type, game_player, ai_player) {
        var temp = null;
        var result = instance.filter(function (el) {
            if (el instanceof type) {
                return el;
            }
        });

        if (result.length === 0) {
            temp = new type(game_player, ai_player);
            instance.push(temp);
            return temp;
        }
        else {
            if (result.length > 1) {
                throw new Error("实例多于1个！");
            }
            return result[0];
        }
    };

    var Dispose = function () {
        instance = [];
    };

    return {
        GetInstance: GetInstance,
        Dispose: Dispose
    }
} ());



//获得玩家类的单例
var SingleGamePlayer = (function () {
    var instance = null;  //玩家类实例（玩家只有一个）

    var GetInstance = function (type) {
//                var temp = null;
//                var result = instance.filter(function (el) {
//                    if (el instanceof type) {
//                        return el;
//                    }
//                });

//                //        if (result.length === 0) {
//                //            instance.push(new type());
//                //            return new type;
//                //        }
//                if (result.length === 0) {
//                    temp = new type();
//                    instance.push(temp);
//                    return temp;
//                }
//                else {
//                    if (result.length > 1) {
//                        throw new Error("实例多于1个！");
//                    }
//                    return result[0];
//                }

        if (!instance) {
            instance = new type();
        }
            return instance;
        };

        var Dispose = function () {
            instance = null;
        };

        return {
            GetInstance: GetInstance,
            Dispose: Dispose
        }
} ());

//获得Boss玩家类的单例
var SingleBoss = (function () {
    var instance = [];  //Boss类实例数组

    //type可以是序号（number）或者是类
    var GetInstance = function (type) {
        if (operate.IsNumber(type)) {
            return instance[type];
        }
        else {
            var temp = null;
            var result = instance.filter(function (el) {
                if (el instanceof type) {
                    return el;
                }
            });

            //        if (result.length === 0) {
            //            instance.push(new type());
            //            return new type;
            //        }
            if (result.length === 0) {
                temp = new type();
                instance.push(temp);
                return temp;
            }
            else {
                if (result.length > 1) {
                    throw new Error("实例多于1个！");
                }
                return result[0];
            }
        }
    };
    //手动加入实例
    var Add = function (type) {
        var result = instance.filter(function (el) {
            if (el instanceof type) {
                return el;
            }
        });
        if (result.length === 0) {
            instance.push(new type());
        }
    };

    //获得实例个数
    var GetNum = function () {
        return instance.length;
    };



    var Dispose = function () {
        instance = [];
    };

    return {
        GetInstance: GetInstance,
        Add: Add,
        GetNum: GetNum,
        Dispose: Dispose
    }
} ());

