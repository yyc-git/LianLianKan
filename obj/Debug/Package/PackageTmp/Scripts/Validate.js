
/*  应用策略模式，建立数据验证的父类、子类以及调用者（闭包）。
    放到命名空间中，防止污染对象，外界只可访问调用者（validator）。

    9-21

******************************************************************************************

    调用方式：

    //ID-值，其中值可能为集合，ID为显示错误信息的span的ID（去掉开头的d）
    var data = {
        edit_tel: {
            Value: $("#edit_tel li input[type=text]"),  //值，可以为集合，也可以为单个值（不能为单个jquery或dom对象）
            Handler: "IsNumber|Equal*aa"     //多个处理函数用"|"隔开，多个参数用"*"隔开
        }
    };
    var hasErr = validator.Validate(data);

    if (hasErr){
        //有错误的处理代码
    }
    else{
        //没有错误的处理代码
    }
};
******************************************************************************************


*/

(function () {
    /*  父类

    定义原型方法，不用this.定义。
    这样既可提高内存利用率（每次new父类或子类时，父类的方法都是调用同一内存地址），
    而且可以在子类中通过this.prototype来调用父类的同名方法。
    */
    function Validate_Parent() {
    };

    //定义策略方法，此处仅定义基本方法，可在子类中扩展或修改
    Validate_Parent.prototype = {
        IsNotEmpty: function (data) {
            return data.length !== 0;
        },
        //        TestRegex: function (data, regex) {
        //            return regex.test(data);
        //        },

        //是否为数字
        IsNumber: function (data) {
            var regex = /^\d+$/;
            return regex.test(data);
        },
        Equal: function (data, value) {
            return data === value;
        }
    };



    /* 子类（可有多个） */
    function Validate_Children() {

        var p = 0;

        //在此处继承Validate_Parent（原型），
        //使得下面var base = this.prototype可以获得Validate_Parent原型上的方法！
        this.prototype = Validate_Parent.prototype;

        /*  用apply或call方法，只能继承this.function形式的方法和属性，
            不能继承父类prototype的方法和属性！

        Validate_Parent.apply(this);
        
        */

        /* 此处不需要修正！
        //修正constructor
        this.prototype.constructor = this;  
        */

        var base = this.prototype;

        /*  扩展/修改父类方法
        data可能为jquery集合
        */
        this.IsNotEmpty = function (data) {
            var result = null;

            p = 0;

            if (typeof data == "object") {  //data为jquery对象
                data.each(function () {
                    if (!base.IsNotEmpty($(this.val()))) {      //调用父类方法
                        p++;
                        return false;
                    }
                });
                result = p === 0 ? true : false;
            }
            else {
                result = base.IsNotEmpty(data);
            }

            return {
                Result: result,
                Message: "值不能为空！"     //增加Message属性
            }
        };

        this.IsNumber = function (data) {
            var reg = /^\+*(\d+|(\d+-\d+)+)$/, //注意！要加括号！前面可以有+号
            //            var reg = /[^a-zA-Z]/
                result = null;
            p = 0;
            //            alert("aa");
            //            alert($(data)[0]);
            if (typeof data == "object") {  //data为jquery对象
                //                console.log("jihe");
                //                console.log("p = " + p);
                data.each(function () {  //data为jquery对象
                    //                    console.log("进入IsNumber each!");
                    if (!reg.test($(this).val())) {
                        p++;
                        return false;
                    }
                });
                //                console.log("p = " + p);
                result = p === 0 ? true : false;
            }
            else {   //data为值
                result = reg.test(data);
            }

            return {
                Result: result,
                Message: "值必须为数字！"     //增加Message属性
            }
        };
        //形参为数组
        this.Equal = function (data, arr) {
            var result = null;

            p = 0;

            if (typeof data == "object") {  //data为jquery对象
                //                console.log("进入Equal");
                //                console.log($("#edit_tel li input[type=text]").length);
                data.each(function () {
                    //                    console.log("进入Equal each!");
                    if (!base.Equal($(this).val(), arr[0])) {   //调用父类方法
                        p++;
                        return false;
                    }
                });
                result = p === 0 ? true : false;
            }
            else {
                result = base.Equal(data, arr[0]);
            }

            return {
                Result: result,
                Message: "输入不等！"
            }
        };
    };

    //Validate_Children.prototype = Validate_Parent.prototype;  //如果在此处继承的话，base为Undefined！



    /* 调用者（闭包） */
    var validator = (function () {
        var types = null,
        message = [];
        //        config = {};

        var HasErrors = function () {
            return message.length !== 0;
        };
        //工厂，根据subClass_type判断选择的子类（子类可有多个）
        var Initialize_Type = function (subClass_type) {
            switch (subClass_type) {
                default:
                    types = new Validate_Children;
            }
        };
        return {
            Validate: function (data, subClass_type) {
                try {
                    var i = null,
                                    len = 0,
                                    checker = null,
                                    handler = "",
                                    type = "",
                                    result = null,
                                    arr = null,
                                    function_data = null;

                    message = [];   //清空错误信息

                    //选择合适的子类
                    Initialize_Type(subClass_type);

                    //                config = _config;

                    for (i in data) {
                        if (data.hasOwnProperty(i)) {   //防止遍历到Object.prototype上的方法
                            type = data[i].Handler.split("|");  //多个handler用"|"隔开
                            if (!type) {
                                continue;
                            }
                            len = type.length;  //handler的个数
                            while (len--) {
                                arr = type[len].split("*");
                                //取得handler名
                                handler = arr.shift();
                                //取得handler的参数（数组）
                                //没有参数则function_data为null
                                function_data = arr.length === 0 ? null : arr;

                                //                                handler = type[len];    //handler名

                                //调用子类对应的handler
                                //（不用使用hasOwnProperty判断了，因为子类的prototype上的方法（继承父类）被子类的同名方法覆盖了）
                                checker = types[handler];

                                if (!checker) {     //如果handler不存在
                                    //注意该处的写法！！
                                    //抛出自定义对象
                                    throw {
                                        name: "验证错误",
                                        message: "不存在" + handler + "处理函数"
                                    };
                                }

                                //调用handler
                                if (function_data) {    //如果handler有形参
                                    result = checker(data[i].Value, function_data);
                                }
                                else {
                                    result = checker(data[i].Value);
                                }
                                //                                if (data[i].Data) {  //如果handler有形参
                                //                                    console.log("data[i].Data = " + data[i].Data);
                                //                                    console.log(data[i].Data.split("*"));
                                //                                    result = checker(data[i].Value, data[i].Data.split("*"));   //多个参数用"*"隔开
                                //                                }
                                //                                else {
                                //                                    result = checker(data[i].Value);
                                //                                }

                                if (!result.Result) {
                                    //加入错误信息
                                    message.push(result.Message);
                                }
                            }
//                            if (HasErrors()) {
//                                operate.err_msg(message[0], i);    //显示第一个错误信息
//                            }
                            if (!result.Result) {
                                operate.err_msg(result.Message, i);    
                            }
                            else {
                                operate.err_msg("", i);     //显示验证正确
                            }
                        }
                    }

                    return HasErrors();
                }
                catch (e) {     //此处截获自定义异常
                    alert(e.name + ":\n" + e.message);
                }
                //                var type = new Validate_Children();

                //                console.log(type.constructor === Validate_Children);
                //                console.log(type.constructor === Validate_Parent);

                //                console.log(type.IsEmpty("aaa").Result);
                //                console.log(type.IsEmpty("aaa").Message);
            },
            Message: message    //错误信息数组
        }
    })();

    window.validator = validator;   //提供外界访问口
})();
