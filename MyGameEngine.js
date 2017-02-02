

/*  要是实现的基本功能：
1、实现面向对象的写法，包括抽象类、接口、继承等        *重点！
2、预加载（图片、声音）
3、声音操作
4、生成随机数、概率


需要jquery的支持


待续。。。。。。
*/


/*  
实现面向对象的写法（抽象类、接口、私有、公有、静态）
10-23


该框架的好处是用属性、方法之间可以用this互相调用。

缺点就是外界可以访问到私有属性/方法、保护属性/方法。





Private：私有属性/方法
Public：公有属性/方法
Protected: 保护属性/方法
Virtual : 虚方法（公有虚方法）（虚方法可以不被重写，虚方法只能在Public或Protected中声明）
Static：静态属性/方法

访问私有或公有属性/方法的方法：都用this来调用。




//私有属性/方法以“_”开头，保护属性/方法以“P_”开头。

11-24

基类的私有成员以“_”开头，  //保护成员以“P_”开头，
第一层子类私有成员以“__”开头，   //保护成员以“P__”开头，
第二层子类私有成员以“___”开头，  //保护成员以“P___”开头，
以此类推。。。。。。
这样做的目的是继承树上的各层类的私有互不干涉  //和保护成员互不干涉。

注意：如果基类为接口，则接口不作为此处的基类（它的子类作为基类进行判断）；
如果基类为抽象类且该抽象类没有私有成员，则抽象类不作为此处的基类（它的子类作为基类进行判断），否则抽象类作为此处的基类（即私有成员以“_”开头）。



父类中，不希望被子类重写的成员，放到Sealed中，
如果公有成员被其它成员调用，且该公有成员不在Sealed中且不希望被子类多态，则使用纯虚原则先将其写成私有方法，再其它成员调用私有方法。
如：
Operate_Game.js Operate_Single类中的RefreshMapInfo、GameOver等公有成员。

如果公有成员被其它成员调用，且该公有成员希望被子类多态（子类同名方法用this.baseToSubClass调用父类同名方法，父类同名方法又调用了该公有成员。
该公有成员被子类覆盖了，所以父类同名方法实际上调用的是子类中与该公有成员同名的成员），则不做任何处理，其它成员直接调用该公有成员。
如：
Operate_Game.js Operate_Single类中AddTimeLine、Mousedown等。

子类（Operate_Boss）的Start方法中通过this.baseToSubClass（this.baseToSubClass的作用是将父类的同名方法指向子类）调用父类的Start方法，
父类的Start方法又调用了公有成员AddTimeLine。而该AddTimeLine被子类的同名方法AddTimeLine覆盖了，所以父类的Start方法实际调用的是子类的AddTimeLine。

Mousedown同理。




子类调用父类方法都用this.baseToSubClass()/this.baseClass.xxx.call(this, xxx)。因为这样都统一调用子类的原型链。
如果用this.base()/this.baseClass.xxx()，这样就是调用父类的原型链了，可能会造成子类原型和父类原型混乱的情况（如有些子类方法用this.baseToSubClass()
（希望调用子类多态同名方法时），有些子类方法用this.base()）。



//子类多态：子类同名方法中调用父类的同名方法（如通过this.base()/this.baseClase.xxx/this.baseToSubClass等），父类的同名方法又包括了父类中的公有成员。


12-04


*/

(function () {
    //当前是否处于创建类的阶段。
    //放在自执行函数中，initializing就是自执行函数的内部变量，自执行函数的上下文结束后，外部就不能访问initializing了。
    //不用var的话，就不是当前上下文的一个变量了，而是全局对象的一个属性。这样外部就能够访问了。
    var initializing = false;
    //    var count = 0;


    //获得函数的参数数组
    function argumentNames(fn) {
        var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    };

    //获得函数名
    function GetFunctionName(fn) {
        var name = "";

        if (!fn) {
            return null;
        }

        name = fn.toString().match(/^.*function\s*([^\(]*)/);
        return name === null ? name : name[1];
    };

    //判断是否为数组
    function IsArray(val) {
        return !!(val &&    //"!!"表示转化为bool型
        typeof val == "object" &&
        typeof val.length == 'number' &&
        typeof val.splice == 'function' &&
        !(val.propertyIsEnumerable('length'))   //val.propertyIsEnumerable('length')：返回 Boolean 值，指出val是否具有该length属性且该属性是否是可列举的。
        );
    };

    //检查抽象类的公有方法+虚方法+抽象方法是否包含父类的抽象方法/属性 或 接口方法/属性。
    //不用hasOwnProperty判断！否则就检查不到是否包含了父类的抽象方法/属性 或 接口方法/属性。
    function Check(parentClass, interface, children) {
        //        if (!parent || !interface || !children) {
        //            throw new Error("Check - arguments error!");
        //        }

        if (parentClass) {
            //检查是否实现了抽象方法/属性
            for (name in parentClass.prototype) {
                //                console.log(name);
                if (name === "constructor") {
                    continue;
                }
                //                if (parentClass.prototype.hasOwnProperty(name)) {
                if (name.contain("Abstract_")) {
                    //抽象方法
                    if (typeof parentClass.prototype[name] === "function") {
                        if (children[name.slice(9)] === undefined || typeof children[name.slice(9)] !== "function") {
                            //                            var t = name.slice(9);
                            throw new Error("Abstract method '" + name + "' must be overwrited!");
                        }
                    }
                    //抽象属性
                    else {
                        if (children[name.slice(9)] === undefined || typeof children[name.slice(9)] === "function") {
//                            var t = name.slice(9);
//                            var p = children[name.slice(9)];
//                            var q = typeof children[name.slice(9)];
                            throw new Error("Abstract attribute '" + name + "' must be overwrited!");
                        }
                    }
                }
                //                }
            }
        }

        if (interface) {
            //检查是否实现了接口方法/属性
            for (name in interface.prototype) {
                //                console.log(name);
                if (name === "constructor") {
                    continue;
                }
                //                if (interface.prototype.hasOwnProperty(name)) {
                //接口方法
                if (typeof interface.prototype[name] === "function") {
                    //                    var t = name.slice(10);
                    //                    var m = children[name.slice(10)];
                    //                        console.log("t = " + t);
                    //                        console.log("m = " + m);
                    if (children[name.slice(10)] === undefined || typeof children[name.slice(10)] !== "function") {
                        throw new Error("Interface method '" + name + "' must be overwrited!");
                    }
                }
                //接口属性
                else {
                    //                    var t = name.slice(10);
                    //                    var m = children[name.slice(10)];
                    //                        console.log("t = " + t);
                    //                        console.log("m = " + m);
                    if (children[name.slice(10)] === undefined || typeof children[name.slice(10)] === "function") {
                        throw new Error("Interface attribute '" + name + "' must be overwrited!");
                    }
                }
                //                }
            }
        }
    };

    //检查抽象成员
    function AddAbstract(abstract, currentClass, temp) {
        var name = "";

        for (name in abstract) {
            if (abstract.hasOwnProperty(name)) {
                //                if (typeof abstract[name] !== "function") {
                //                    throw new Error("Virtual attribute is not allowed!");
                //                }
                //                else {
                //抽象方法前面加"Abstract_"前缀
                currentClass.prototype["Abstract_" + name] = abstract[name];
                //                currentClass.prototype[name] = abstract[name];

                temp[name] = abstract[name];    //加入temp
                //                }
            }
        }
    };

    //检查虚方法(不能为虚属性)
    function AddVirtual(virtual, currentClass, temp) {
        var name = "";

        for (name in virtual) {
            if (virtual.hasOwnProperty(name)) {
                if (typeof virtual[name] !== "function") {
                    throw new Error("Virtual attribute is not allowed!");
                }
                else {
                    currentClass.prototype[name] = virtual[name];

                    temp[name] = virtual[name];    //加入temp
                }
            }
        }
    };

    //加入密封方法。
    //没有实现检查子类是否重写了父类的密封方法，只是定义了一个规范。
    function AddSealed(sealed, currentClass, temp) {
        var name = "";

        for (name in sealed) {
            if (sealed.hasOwnProperty(name)) {
                currentClass.prototype[name] = sealed[name];

                temp[name] = sealed[name];    //加入temp
            }
        }
    };



    //创建接口
    //接口可以继承接口
    function MyInterface(_parent, _method, _attribute) {
        var i = 0, args = null;

        var parent = null,
            method = null,
            attribute = null;

        if (typeof _parent === "function") {
            if (GetFunctionName(_parent) !== "I") {
                throw new Error("Interface must inherit interface!");
            }
            else {
                parent = _parent;

                //形如“MyInterface(Parent, "A", "B", "GetName");”
                if (_method && !IsArray(_method)) {
                    method = Array.prototype.slice.call(arguments, 1);
                    attribute = null;
                }
                //形如“MyInterface(Parent, ["A", "B", "GetName"], ["a", "c"]);”
                else {
                    method = _method;
                    attribute = _attribute;
                }
            }
            //            console.log(parent.toString());
        }
        else {
            parent = null;
            //形如“MyInterface("A", "B", "GetName");”
            if (_method && !IsArray(_method)) {
                method = arguments
                attribute = null;
            }
            //形如“MyInterface(["A", "B", "GetName"], ["a", "c"]);”
            else {
                method = arguments[0];
                attribute = arguments[1];
            }
        }

        function I() {
        }

        // 如果此接口需要从其它接口扩展
        if (parent) {
            I.prototype = new parent();
            I.prototype.constructor = I;
        }

        //        console.log("method = " + method);
        //        console.log("attribute = " + attribute);


        //        //形如“MyInterface(["A", "B", "GetName"], ["a", "c"]);”
        //        if (IsArray(method)) {

        //方法
        for (i = 0; i < method.length; i++) {
            //加上前缀“Interface_”
            I.prototype["Interface_" + method[i]] = function () {
                throw new Error("This method must be overwrited!");
            };
        }
        //属性
        if (attribute) {
            if (!IsArray(attribute)) {
                throw new Error("Attribute must be array!");
            }
            else {
                for (i = 0; i < attribute.length; i++) {
                    //加上前缀“Interface_”
                    I.prototype["Interface_" + attribute[i]] = 0;
                }
            }
        }
        //        }
        //        //形如“MyInterface("A", "B", "GetName");”
        //        else {
        //            args = Array.prototype.slice.call(arguments, 1);
        //            //方法
        //            for (i = 0; i < args.length; i++) {
        //                I.prototype[args[i]] = function () {
        //                    throw new Error("This method must be overwrited!");
        //                };
        //            }
        //        }

        return I;
    };



    //创建抽象类
    //抽象类能够继承接口、抽象类以及实体类，但此处约定抽象类只能继承接口和抽象类，不能继承实体类！
    //（这样方便判断抽象类是否包含全部的父类（接口/抽象类）成员）
    function MyAbstract(_parent, _prop) {
        var Static = null;
        var k = null, name = null, temp = {},
            virtual = {};

        //        if (arguments.length > 1) {
        //            throw new Error("AbstractClass can't inherit other classes!");
        //        }

        var abstractClass = null,
                interface = null,
            prop = null;


        //取出父类、接口
        if (arguments.length === 1) {
            prop = arguments[0];
            //            parent = null;
            abstractClass = null;
            interface = null;
        }
        //_parent为{AbstractClass: xx, Interface: xx}
        else if (typeof _parent === "object") {

            if (!_parent.AbstractClass && !_parent.Interface) {
                throw new Error("Please Add AbstractClass or Interface!");
            }
            if (GetFunctionName(_parent.AbstractClass) === "F" || GetFunctionName(_parent.Interface) === "F") {
                throw new Error("AbstractClass here can't inherit parentClass which is created by MyClass function!");
            }

            abstractClass = _parent.AbstractClass;
            interface = _parent.Interface;

            prop = _prop;
        }
        //_parent直接为xx，就表示父类为抽象类
        else if (typeof _parent === "function") {
            if (GetFunctionName(_parent) === "F") {
                throw new Error("AbstractClass here can't inherit parentClass which is created by MyClass function!");
            }

            abstractClass = _parent;
            interface = null;

            prop = _prop;
        }
        else {
            throw new Error("arguments is not allowed!");
        }


        Static = prop.Static ? prop.Static : null;


        // 本次调用所创建的类（构造函数）
        function A() {
            //            // 如果抽象父类存在，则实例对象的baseClass指向父类的原型
            //            // 这就提供了在实例对象中调用父类方法的途径
            //            if (abstractClass) {
            //                this.baseClass = abstractClass.prototype;
            //            }
        }

        // 如果此接口需要从其它接口扩展
        if (abstractClass) {
            //            //删除父类的私有成员，保留本类的私有成员
            //            for (name in abstractClass.prototype) {
            //                if (abstractClass.prototype.hasOwnProperty(name)) {
            //                    //私有成员以“_”开头，可能有多个“_”（多层继承）
            //                    if (!name.match(/^_+/)) {
            //                        //                                                delete parentClass.prototype[name];
            //                        A.prototype[name] = abstractClass.prototype[name];
            //                    }
            //                }
            //            }

            A.prototype = new abstractClass();
            A.prototype.constructor = A;

            // 如果父类存在，则实例对象的baseClass指向父类的原型。
            // 这就提供了在实例对象中调用父类方法的途径。
            //baseClass的方法是指向abstractClass的，不是指向F（子类）的！
            A.prototype.baseClass = abstractClass.prototype;
        }



        if (prop.Private) {
            //私有属性/方法直接覆盖
            for (name in prop.Private) {
                if (prop.Private.hasOwnProperty(name)) {
                    A.prototype[name] = prop.Private[name];
                }
            }
        }

        if (prop.Public) {
            for (name in prop.Public) {
                if (prop.Public.hasOwnProperty(name)) {
                    //检查抽象成员，抽象成员放到Public或Protected中
                    if (name === "Abstract") {
                        AddAbstract(prop["Public"][name], A, temp);
                        continue;
                    }
                    //检查虚方法，虚方法放到Public或Protected中
                    if (name === "Virtual") {
                        AddVirtual(prop["Public"][name], A, temp);
                        continue;
                    }
                    //密封的方法（不允许子类重写）
                    if (name === "Sealed") {
                        AddSealed(prop["Public"][name], A, temp);
                        continue;
                    }
                    A.prototype[name] = prop.Public[name];

                    temp[name] = prop.Public[name];    //用于检查是否包含父类的抽象方法/属性 或 接口方法/属性
                }
            }
        }
        //保护成员
        if (prop.Protected) {
            for (name in prop.Protected) {
                if (prop.Protected.hasOwnProperty(name)) {
                    //检查抽象成员，抽象成员放到Public或Protected中
                    if (name === "Abstract") {
                        AddAbstract(prop["Protected"][name], A, temp);
                        continue;
                    }
                    //检查虚方法，虚方法放到Public或Protected中
                    if (name === "Virtual") {
                        AddVirtual(prop["Protected"][name], A, temp);
                        continue;
                    }
                    //密封的方法（不允许子类重写）
                    if (name === "Sealed") {
                        AddSealed(prop["Protected"][name], A, temp);
                        continue;
                    }
                    A.prototype[name] = prop.Protected[name];

                }
            }
        }

        //        //虚方法(不能为虚属性)
        //        if (prop.Virtual) {
        //            for (name in prop.Virtual) {
        //                if (prop.Virtual.hasOwnProperty(name)) {
        //                    if (typeof prop.Virtual[name] !== "function") {
        //                        throw new Error("Virtual attribute is not allowed!");
        //                    }
        //                    else {
        //                        //                        //虚方法前面加"Virtual_"前缀，在子类中要检查虚方法
        //                        A.prototype[name] = prop.Virtual[name];

        //                        temp[name] = prop.Virtual[name];    //用于检查是否包含父类的抽象方法/属性 或 接口方法/属性
        //                    }
        //                }
        //            }
        //        }


        //抽象类可以没有抽象成员
        //        if (!prop.Abstract) {
        //            throw new Error("AbstractClass must have abstract methods!");
        //        }

        //放到外面的抽象成员，默认为公有抽象成员
        for (name in prop.Abstract) {
            if (prop.Abstract.hasOwnProperty(name)) {
                //                console.log();
                //抽象方法前面加"Abstract_"前缀
                A.prototype["Abstract_" + name] = prop.Abstract[name];

                temp[name] = prop.Abstract[name];   //用于检查是否包含父类的抽象方法/属性 或 接口方法/属性
            }
        }

        //        //检查抽象类的公有方法+虚方法+抽象方法是否包含父类的抽象方法/属性 或 接口方法/属性
        //检查抽象类的公有方法+虚方法+抽象方法是否包含父类的接口方法/属性
        Check(null, interface, temp);

        //静态属性/方法赋值
        for (k in Static) {
            A[k] = Static[k];
        }

        return A;
    }



    //    //是否调用父类函数
    //    var base_flag = false;

    //创建普通类
    //父类_parent可以为{Class: xx, Interface: xx}，或者直接为xx类
    function MyClass(_parent, _prop) {
        //        console.log("length = " + arguments.length);
        var Static = null;
        //                    Private = null,
        //            Public = null,
        //            Origin = null;

        var k = null, name = null;

        var parentClass = null, interface = null, prop = null, temp = {};
        //        var temp = null;

        //取出父类、接口
        if (arguments.length === 1) {
            prop = arguments[0];
            parentClass = null;
            interface = null;
        }
        //{Class: xx, Interface: xx}
        else if (typeof _parent === "object") {
            //            if (parent.Class)
            if (!_parent.Class && !_parent.Interface) {
                throw new Error("Please Add Class or Interface!");
            }

            parentClass = _parent.Class;
            interface = _parent.Interface;

            prop = _prop;
        }
        //直接为xx类
        else if (typeof _parent === "function") {
            parentClass = _parent;
            interface = null;
            //            parent = _parent;
            //            interface = null;

            prop = _prop;
        }
        else {
            throw new Error("arguments is not allowed!");
        }



        //取出静态属性/方法、私有属性/方法、公有属性/方法
        //        Private = prop.Private;

        //        Public = prop.Public;

        Static = prop.Static ? prop.Static : null;



        //        //保存原始的私有属性，用于创建实例时，重置私有属性
        //        //        var Origin = {};
        //        //        Origin = Private
        //        Origin = operate.ExtendDeep(Private);
        //        operate.Extend(Origin, Private);


        //        //访问公共属性/方法的入口，
        //        MyClass.Public = Public;


        // 本次调用所创建的类（构造函数）
        function F() {

            // 如果当前处于实例化类的阶段，则调用Init原型函数
            if (!initializing) {
                //                console.log("F");
                //                // 如果父类存在，则实例对象的baseClass指向父类的原型
                //                // 这就提供了在实例对象中调用父类方法的途径
                //                if (parentClass) {
                //                    this.baseClass = parentClass.prototype;
                //                    //                    console.log(this.baseClass);
                //                }
                this.Init && this.Init.apply(this, arguments);
            }

            //            this.Public = Public;

            //            console.log("F");


            //            if (this.)
            //            console.log(this._m);
            //            delete this._m;

            //            delete F.prototype._m;
            //            delete F.prototype._a;
            //            this._m = null;
            //            this._a = null;
            //            delete F.prototype._a;



            /*不能删除私有成员和保护成员！否则类的成员就不能调用到私有和保护的成员了（因为已经删除了）！
            对象的创建算法参考http://www.cnblogs.com/TomXu/archive/2012/02/06/2330609.html




            //删除私有成员和保护成员，这样外界就不能访问私有和保护成员了！
            for (name in this) {
            if (name.search(/(^_)|(^P_)/) !== -1) {
            delete F.prototype[name];
            //                                                    this[name] = null;
            }
              
            }
            */



            //            console.log(count);
            //            count++;

            //不使用MyClass.self！因为该属性为静态属性，如果创建了该类后，又创建了类A，则MyClass.self会指向类A！

            //            MyClass的静态属性self指向创建的类的实例，可以通过self来访问实例的属性和方法
            //            MyClass.self = this;





            //            Private.C();

            //            for (name in Private) {
            //                Private[name].call(this);
            //            }




        }




        //        Private.C = Private.C.call(null, Public);

        //        Private.call(F, null);

        //                Private.M = (function (pub) {
        //                    return function () {
        //                        Private.M.call(null, arguments);
        //                    }
        //                }(Public));


        //        for (name in Private) {
        //            Private[name] = function () {
        //                //            console.log("1111111");
        //                return function () {
        //                    //                console.log("222222222");
        //                    return Private[name].call(this, arguments);
        //                }

        //            };
        //        }



        //        Private.C = function () {
        //            return function () {
        //                Private.C.call(F, arguments);
        //            }
        //        };


        // 如果此类需要从其它类扩展
        if (parentClass) {

            initializing = true;
            F.prototype = new parentClass();
            F.prototype.constructor = F;

            //            for (name in parentClass.prototype) {
            //                if (parentClass.prototype.hasOwnProperty(name)) {
            //                    //私有成员不继承
            //                    if (!name.match(/^_/)) {
            //                        F.prototype[name] = parentClass.prototype[name];
            //                    }
            //                }
            //            }

            //            //删除父类的私有成员，保留本类的私有成员
            //            for (name in parentClass.prototype) {
            //                if (parentClass.prototype.hasOwnProperty(name)) {
            //                    //私有成员以“_”开头，可能有多个“_”（多层继承）
            //                    if (!name.match(/^_+/)) {
            //                        //                                                delete parentClass.prototype[name];
            //                        F.prototype[name] = parentClass.prototype[name];
            //                    }
            //                }
            //            }

            //            console.log(F.prototype.constructor);


            // 如果父类存在，则实例对象的baseClass指向父类的原型。
            // 这就提供了在实例对象中调用父类方法的途径。
            //baseClass的方法是指向parentClass的，不是指向F（子类）的！
            F.prototype.baseClass = parentClass.prototype;




            initializing = false;
        }

        //加入构造函数
        //构造函数可以单独列出来，也可以写到Public中
        if (prop.Init) {
            F.prototype.Init = prop.Init;
        }
        //        Private.call(this);

        //        if (parentClass && parentClass.prototype["JudgeDoubleHit"]) {
        //            console.log(parentClass.toString());


        if (parentClass) {
            for (name in parentClass.prototype) {
                if (parentClass.prototype.hasOwnProperty(name)) {
                    //如果不是抽象方法/保护方法/私有方法/接口成员，则加入到temp中。
                    //用于添加父类的密封方法（因为子类并没有加入父类的密封方法）。
                    if (!name.match(/^Abstract_/) || !name.match(/^P_/) || !name.match(/^_/) || !name.match(/^Interface_/)) {
                        temp[name] = parentClass.prototype[name];
                    }
                }
            }
        }



        //        }

        //        if (this.baseClass.Protected) {
        //            if (this.baseClass.Protected.Sealed) {

        //                for (k in this.baseClass.Protected.Sealed) {
        //                    temp[k] = this.baseClass.Protected.Sealed[k];
        //                }
        //            }
        //        }


        if (prop.Private) {
            //私有属性/方法直接覆盖
            for (name in prop.Private) {
                if (prop.Private.hasOwnProperty(name)) {
                    F.prototype[name] = prop.Private[name];
                }
            }
        }

        //        if (!prop.Public) {
        //            throw new Error("Class must have public methods!");
        //        }
        //        else {

        //        }


        //保护成员
        if (prop.Protected) {
            for (name in prop.Protected) {
                if (prop.Protected.hasOwnProperty(name)) {
                    //检查虚方法，虚方法放到Public或Protected中
                    if (name === "Virtual") {
                        AddVirtual(prop["Protected"][name], F, temp);
                        continue;
                    }
                    //密封的方法（不允许子类重写）
                    if (name === "Sealed") {
                        AddSealed(prop["Protected"][name], F, temp);
                        continue;
                    }

                    F.prototype[name] = prop.Protected[name];

                    //如果父类有保护抽象成员，此处检查子类的保护成员是否实现了父类的保护抽象成员
                    temp[name] = prop.Protected[name];
                }
            }
        }

        //        //虚方法(不能为虚属性)
        //        if (prop.Virtual) {
        //            for (name in prop.Virtual) {
        //                if (prop.Virtual.hasOwnProperty(name)) {
        //                    if (typeof prop.Virtual[name] !== "function") {
        //                        throw new Error("Virtual attribute is not allowed!");
        //                    }
        //                    else {
        //                        F.prototype[name] = prop.Virtual[name];

        //                        temp[name] = prop.Virtual[name];    //加入temp
        //                    }
        //                }
        //            }
        //        }

        if (prop.Abstract) {
            throw new Error("Only abstractClass can have abstract methods!");
        }



        if (prop.Public) {
            // 覆盖父类的同名公有方法
            for (name in prop.Public) {
                //            console.log("for in name = " + name);
                //            //私有属性/方法不加入到原型中
                //            if (name === "Private") {
                ////                console.log("continue");
                //                continue;
                //            }

                if (prop.Public.hasOwnProperty(name)) {
                    //检查虚方法，虚方法放到Public或Protected中
                    if (name === "Virtual") {
                        AddVirtual(prop["Public"][name], F, temp);
                        continue;
                    }
                    //密封的方法（不允许子类重写）
                    if (name === "Sealed") {
                        AddSealed(prop["Public"][name], F, temp);
                        continue;
                    }
                    //                    console.log("Public");
                    //                    console.log("name = " + name);
                    //                    console.log("prop.Public[name] = " + prop.Public[name]);
                    temp[name] = prop.Public[name];     //加入temp

                    // 如果此类继承自父类parent并且父类原型中存在同名函数name
                    if (parentClass &&
            typeof prop.Public[name] === "function" &&
            typeof F.prototype[name] === "function") {
                        //                        console.log("parent!");




                        F.prototype[name] = function (name) {
                            return function () {
                                /*此处如果写成“this.base = parentClass.prototype[name];”，则在使用this.base()调用父类同名方法时，
                                父类同名方法的this指针是指向F的！（即指向子类，而不是指向父类！）   为什么？？？？
                                如：
                                var Person = MyAbstract({
                                Init: function (name) {
                                this.name = name;
                                },
                                Public: {
                                m: 1,
                                getEmployeeID: function () {
                                console.log(this.m);
                                }
                                }
                                }
                                });


                                var Employee = MyClass({
                                Init: function (name) {
                                this.name = name;
                                },
                                Public: {
                                m: 100,
                                getEmployeeID: function () {
                                this.baseClass.getEmployeeID();
                                this.base();
                                }
                                }
                                });

                                var m = new Employee();
                                m.getEmployeeID();    //输出：1  100（）

                                分析：
                            
                                this.baseClass.getEmployeeID()的this指向Person，而this.base()的this指向Employee！

                                解决方案：

                                用apply修正this.base()中的this，使其指向父类。
                                */


                                //                                if (!this.base) {
                                //此处不用创建闭包了！因为外面已经创建了闭包，name已经被保存了！
                                this.base = function () {
                                    //这个写法也可以！为什么不用apply修正this也行？？！
                                    //parentClass.prototype[name](); 

                                    //此处的arguments为base方法传入的形参
                                    //注意！要加上“return”，这样才能返回parentClass.prototype[name]的返回值
                                    return parentClass.prototype[name].apply(parentClass.prototype, arguments);

                                    //                                    this.baseClass.
                                };
                                //                                }
                                //                                if (!this.baseToSubClass) {
                                //指向子类，可以用于模版模式
                                this.baseToSubClass = parentClass.prototype[name];
                                //                                }

                                //                                this.base = function () {
                                //                                    //                                    console.log(base_flag);

                                //                                    Private = {
                                //                                    };
                                ////                                    base_flag = true;
                                //                                    return parent.prototype[name];
                                //                                };
                                //                            console.log("arg = " + arg);

                                //执行fn并返回执行的结果
                                //此处的arguments为F.prototype[name]方法传入的形参。
                                return prop.Public[name].apply(this, arguments);
                            };

                        } (name);

                    }
                    else {
                        //                    console.log();
                        //公有属性
                        if (typeof (prop.Public[name]) !== "function") {
                            F.prototype[name] = prop.Public[name];
                        }
                        //公有方法
                        else {
                            /* 如果不传入Public[name]，而直接在自执行函数中调用Public[name]，如
                            F.prototype[name] = function () {
                            return function () {
                            prop.Public[name].apply(this, arguments);
                            };
                            } ();

                            或者写成：
                            F.prototype[name] = function () {
                            prop.Public[name].call(this, arguments);
                            };
                        
                        
                            这样的话，在创建实例时调用方法时，都会执行MyClass中的最后一个函数！见下例
                        
                            var Person = MyClass({
                            Init: function (name) {
                            this.name = name;
                            },
                            getName: function () {
                            console.log("getName");
                            },
                            getEmployeeID: function ($private) {
                            console.log("Person getEmployeeID");
                            }
                            });
                            var m = new Person("name");     
                            m.getName();    //第一种和第二种写法此处会输出："Person getEmployeeID"
                

                            这样执行的原因是：

                            （引用自“深入理解JavaScript系列（16）：闭包（Closures）”）
                            同一个父上下文中创建的闭包是共用一个[[Scope]]属性的。也就是说，
                            某个闭包对其中[[Scope]]的变量做修改会影响到其他闭包对其变量的读取。
                            这就是说：所有的内部函数都共享同一个父作用域。

                            也就是说，function里面的name都是共用父作用域中的name！所以此处F.prototype[name]被激活的时候，
                            name都为最后一个值即"getEmployeeID"。
                            所以F原型上的方法都指向"getEmployeeID"

                            解决方案：

                            创建一个闭包来保存name的值。
                            */
                            F.prototype[name] = function (name) {
                                return function () {
                                    return prop.Public[name].apply(this, arguments);     //执行fn并返回执行的结果
                                };
                            } (name);

                        }
                    }
                }
            }
        }




        //检查公有成员和虚函数是否实现了抽象方法/属性 或 接口方法/属性
        Check(parentClass, interface, temp);

        //静态属性/方法赋值
        for (k in Static) {
            F[k] = Static[k];
        }

        return F;
    };

    window.MyInterface = MyInterface;

    window.MyAbstract = MyAbstract;

    window.MyClass = MyClass;
} ());

//alert(initializing);


/*

//                    该框架有个很大的问题！就是私有方法调用私有方法时，被调用的私有方法不能调用公有属性/方法！！！！！

//                    最大的好处就是外界不能访问私有属性/方法。


//                    实现面向对象的写法 
//                    10-23

//                    Private：私有属性/方法
//                    Public：公有属性/方法
//                    Static：静态属性/方法

//                    访问私有属性/方法的方法是：方法的第一个参数设为$private，通过$private.私有属性/方法 来调用。


//                    例子：

//                    var Person = MyClass({
//                    Init: function (name) {
//                    this.name = name;
//                    },
//                    Private: {
//                    _m: function () {
//                    console.log("private!");
//                    },
//                    _a: 1,
//                    _b: {
//                    _c: 2
//                    }
//                    },
//                    Public: {
//                    getName: function () {
//                    console.log("Person_getName");
//                    },
//                    getEmployeeID: function ($private, a) {
//                    console.log(a);
//                    }
//                    }
//                    });
//                    var Employee = MyClass(Person, {
//                    Init: function (name) {
//                    this.name = name;
//                    },
//                    Private: {
//                    _m: function ($public) {
//                    console.log(this._a);   //调用私有属性_a
//                    console.log("private!");

//                    $public.say();      //（this指针传入）调用公有方法say()
//                    },
//                    _a: 1,
//                    _b: {
//                    _c: 2
//                    }

//                    },
//                    Public: {
//                    say: function() {
//                    console.log("say");
//                    },
//                    getName: function () {
//                    this.baseClass.getName();
//                    console.log("Employee_getName");
//                    },
//                    getEmployeeID: function ($private, a) {
//                    this.base(a);
//                    console.log($private._a);

//                    $private._m(this);  //调用私有方法_m，并将this指针传入

//                    }
//                    },
//                    Static: {
//                    s: 0
//                    }
//                    });

//                    var m = new Employee("name");
//                    m.getEmployeeID("aaaa");    //"aaaa"   1
//                    m.getName();    //"Person_getName"  "Employee_getName"
//                    console.log(Employee.s);    //0
//                    Employee.s++;
//                    console.log(Employee.s);    //1
//                    var x = new Employee("name");
//                    Employee.s++;
//                    console.log(Employee.s);    //2


(function () {
//当前是否处于创建类的阶段
var initializing = false;


//获得函数的参数数组
function argumentNames(fn) {
var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
return names.length == 1 && !names[0] ? [] : names;
};


//    //是否调用父类函数
//    var base_flag = false;

function MyClass(parent, prop) {
//        console.log("length = " + arguments.length);
var Static = null,
Private = null,
Public = null,
Origin = null;

var k = null, name = null;

// 只接受一个参数的情况 - MyClass(prop)
if (typeof parent === "object") {
prop = parent;
parent = null;
}

//取出静态属性/方法、私有属性/方法、公有属性/方法
Private = prop.Private;

Public = prop.Public;

Static = prop.Static;

//保存原始的私有属性，用于创建实例时，重置私有属性
//        var Origin = {};
//        Origin = Private
Origin = operate.ExtendDeep(Private);
//        operate.Extend(Origin, Private);


//        //访问公共属性/方法的入口，
//        MyClass.Public = Public;


// 本次调用所创建的类（构造函数）
function F() {

// 如果当前处于实例化类的阶段，则调用Init原型函数
if (!initializing) {
// 如果父类存在，则实例对象的parent指向父类的原型
// 这就提供了在实例对象中调用父类方法的途径
if (typeof parent === "function") {
this.baseClass = parent.prototype;
}
this.Init && this.Init.apply(this, arguments);
}

//            console.log("F");
//创建新的实例时，私有属性还原。
//注意，此处为深拷贝
Private = operate.ExtendDeep(Origin);



//            Private.C();

//            for (name in Private) {
//                Private[name].call(this);
//            }




}




//        Private.C = Private.C.call(null, Public);

//        Private.call(F, null);

//                Private.M = (function (pub) {
//                    return function () {
//                        Private.M.call(null, arguments);
//                    }
//                }(Public));


//        for (name in Private) {
//            Private[name] = function () {
//                //            console.log("1111111");
//                return function () {
//                    //                console.log("222222222");
//                    return Private[name].call(this, arguments);
//                }

//            };
//        }



//        Private.C = function () {
//            return function () {
//                Private.C.call(F, arguments);
//            }
//        };


// 如果此类需要从其它类扩展
if (parent) {
initializing = true;
F.prototype = new parent();
F.prototype.constructor = F;
initializing = false;
}

//加入构造函数
if (prop.Init) {
F.prototype.Init = prop.Init;
}
//        Private.call(this);



// 覆盖父类的同名函数
for (name in Public) {
//            //私有属性/方法不加入到原型中
//            if (name === "Private") {
////                console.log("continue");
//                continue;
//            }

if (Public.hasOwnProperty(name)) {
// 如果此类继承自父类parent并且父类原型中存在同名函数name
if (typeof parent === "function" &&
typeof (Public[name]) === "function" &&
typeof (F.prototype[name]) === "function") {
//                        console.log("parent!");

F.prototype[name] = function (name, fn) {
return function () {
//要将arguments转换为数组，否则concat要出问题！
var a = Array.prototype.slice.call(arguments, 0);
var arg = argumentNames(fn)[0] === "$private" ? [Private].concat(a) : a;


this.base = parent.prototype[name];
//                                this.base = function () {
//                                    //                                    console.log(base_flag);

//                                    Private = {
//                                    };
////                                    base_flag = true;
//                                    return parent.prototype[name];
//                                };
//                            console.log("arg = " + arg);
return fn.apply(this, arg);     //执行fn并返回执行的结果
};

} (name, Public[name]);
}
else {
if (typeof (Public[name]) !== "function") {
F.prototype[name] = Public[name];
}
else {
//                        如果不传入Public[name]，而直接在自执行函数中调用Public[name]，如
//                        F.prototype[name] = function () {
//                        return function () {
//                        var arg = argumentNames(Public[name])[0] === "$private" ? [Private].concat(arguments) : arguments;
//                        return Public[name].apply(this, arg);
//                        };
//                        } ();
//                        
//                        
//                        这样的话，在创建实例时，就会执行MyClass中的最后一个函数！见下例
//                        
//                        var Person = MyClass({
//                        Init: function (name) {
//                        this.name = name;
//                        },
//                        getName: function () {
//                        console.log("getName");
//                        },
//                        getEmployeeID: function ($private) {
//                        console.log("Person getEmployeeID");
//                        }
//                        });
//                        var m = new Person("name");     //输出"Person getEmployeeID"
//                
//                        
F.prototype[name] = function (name, fn) {
return function () {

//                            var private = Array.prototype.concat.call(Private);
//                            console.log("Private = " + typeof Private);

//要将arguments转换为数组，否则concat要出问题！
var a = Array.prototype.slice.call(arguments, 0);
var arg = argumentNames(fn)[0] === "$private" ? [Private].concat(a) : a;
//                            console.log("arg = " + arg);
return fn.apply(this, arg);     //执行fn并返回执行的结果
};
} (name, Public[name]);
}
}
}
}

//静态属性/方法赋值
for (k in Static) {
F[k] = Static[k];
}

return F;
};


window.MyClass = MyClass;
} ());
*/
//获得函数的参数数组


var MyGameEngine = (function () {
    /************************************ 基本操作 ********************************************/
    var Base = {
        /* 判断类型/对象 */

        //判断浏览器类型
        Browser: {
            ie: ! -[1, ],
            ie7: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 7",
            ie8: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 8",
            ie9: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 9",
            ff: navigator.userAgent.indexOf("Firefox") >= 0 && true,
            opera: navigator.userAgent.indexOf("Opera") >= 0 && true
        },
        //判断是否为jQuery对象
        IsjQuery: function (ob) {
            return ob instanceof jQuery;
        },
        //判断是否为数组
        IsArray: function (val) {
            return !!(val &&    //"!!"表示转化为bool型
        typeof val == "object" &&
        typeof val.length == 'number' &&
        typeof val.splice == 'function' &&
        !(val.propertyIsEnumerable('length'))   //val.propertyIsEnumerable('length')：返回 Boolean 值，指出val是否具有该length属性且该属性是否是可列举的。
        );
        },
        /*判断是否为function（是否为类）*/
        IsFunction: function (func) {
            //            return typeof func == "function";
            return Object.prototype.toString.call(func) === "[object Function]";
        },

        /* 获得坐标/距离 */

        //获得obj到指定的被定为了的祖先元素parentObj的距离
        GetToParentOffset: function (obj, parentObj) {
            var left = 0, top = 0, position = null,
                obj = $(obj),
                parentObj = $(parentObj);

            do {
                position = obj.position();
                left += position.left;
                top += position.top;

                obj = obj.offsetParent();
            } while (obj && obj[0] !== parentObj[0]);    //jquery对象不能用"=="或"==="判等，要转换为dom对象再判等
            return {
                left: left,
                top: top
            };
        },

        /* 获得对象等 */

        //按id值获得dom对象
        GetDom: function (id) {
            return typeof id == "string" ? document.getElementById(id) : id;
        },
        $: function (id) {
            return typeof id == "string" ? $("#" + id) : id;
        },
        argumentNames: function (fn) {
            var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
            return names.length == 1 && !names[0] ? [] : names;
        },

        //获得函数名
        GetFunctionName: function (fn) {
            var name = "";

            if (!fn) {
                return null;
            }

            name = fn.toString().match(/^.*function\s*([^\(]*)/);
            return name === null ? name : name[1];
        },


        /* 格式化 */

        /* 字符串或者函数委托
        例如：
        （其中B为函数委托）
        function B() {
        alert("B!");
        }
        function A(fn){
        //    alert("A!");
        fn();
        alert(arguments[2]);
        };
        var c = 1;
        $("#test_3").html(MyGameEngine.Base.FormatDelegate("<input type='button' onclick='A({0}, \"{1}\", {2});'/>", B, "zzzzzzz", c));
        */
        FormatDelegate: function (s, pars) {
            if (!s) return "";  //如果s为空，则s=""
            if (pars === null || pars === undefined) return s;

            var i = 0, j = 0, len = 0;
            var args = null;

            if (operate.IsArray(pars) && arguments.length === 2 && pars.length > 1) {
                args = pars;
            }
            else {
                args = Array.prototype.slice.call(arguments, 1);
            }

            for (i = 0, len = args.length; i < len; i++) {
                if (this.IsFunction(args[i])) {
                    s = s.replace(new RegExp("\\\{" + (j++) + "\\\}", "g"), this.GetFunctionName(args[i]));
                }
                else {
                    s = s.replace(new RegExp("\\\{" + (j++) + "\\\}", "g"), args[i].toString());
                }
            }
            return s;
        },


        /* 拷贝/继承 */

        //复制source到destination中(包括source的原型链和Object的原型链)
        //不用中间对象， 貌似有问题！
        //浅拷贝
        Extend: function (destination, source) {
            //            var temp = {};
            for (var property in source) {
                //                temp[property] = source[property];  //用中间对象来保存source
                destination[property] = source[property];
            }
            return destination;
        },
        //destination中没有的属性不拷贝
        ExtendByExist: function (destination, source) {
            for (var property in source) {
                if (destination[property]) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        //复制source到destination中(不包括source的原型链)
        //浅拷贝
        ExtendNoPrototype: function (destination, source) {
            //            var temp = {};
            for (var property in source) {
                if (source.hasOwnProperty(property)) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        /* 深拷贝

        来自汤姆大叔
        9-24

        使用例子：
        var dad = {    
        counts: [1, 2, 3],   
        reads: { paper: true }
        };
        var kid = extendDeep(dad);
        kid.counts.push(4);
        console.log(kid.counts.toString()); // "1,2,3,4"
        console.log(dad.counts.toString()); // "1,2,3"
        console.log(dad.reads === kid.reads); // false
        kid.reads.paper = false;

        */
        ExtendDeep: function (parent, child) {
            var i,
                toStr = Object.prototype.toString,
                astr = "[object Array]";
            child = child || {};
            for (i in parent) {
                if (parent.hasOwnProperty(i)) {
                    if (typeof parent[i] === 'object') {
                        child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                        operate.ExtendDeep(parent[i], child[i]);
                    } else {
                        child[i] = parent[i];
                    }
                }
            }
            return child;
        },

        /* Dom操作 */

        //获得当前样式
        //            <style type="text/css">
        //            p{color:#0F0;}
        //            #text{color:#FF0;}
        //            </style>
        //            <p id="text"> hello world </p>
        //            <script>
        //            var ldd={
        //                getStyle:function(obj,prop){return obj.style[prop];},

        //                getCurrentStyle:function(obj,prop){
        //                    if(obj.currentStyle){return obj.currentStyle[prop];}      //IE
        //                    if(document.defaultView){return document.defaultView.getComputedStyle(obj,null)[prop];}   //非 IE
        //                    }
        //                };
        //            var obj=document.getElementById("text"); 

        //            alert(ldd.getStyle(obj,"color"));

        //            alert(ldd.getCurrentStyle(obj,"color"));
        //            </script>
        //            上述代码中，第一个alert 不显示任何内容，第二个alert显示"#F00" 。
        //            obj.style 返回通过 STYLE 标签属性应用到元素的内嵌样式，此种样式权重最大，为1000。因为<p>中没有内嵌样式，故而第一个alert 不显示任何内容。
        //            obj.currentStyle （IE 特有，w3c标准方法为 document.defaultView.getComputedStyle）返回的是浏览器当前使用的属性，由于<p> 中没有内嵌样式，根据css 权重，最终使用的color  是#text 中的样式，即color:#FF0。 所以第二个alert显示的内容为"#F00"。
        GetCurrentStyle: function (element) {
            return element.currentStyle || document.defaultView.getComputedStyle(element, null);
        }
    };



    /************************************ 生成随机数、概率 ********************************************/
    //生成随机数
    var Random = {
        //0到1随机小数，如0.4581578007260767
        _0To1: function () {
            return Math.random();
        },
        //over到under的任意整数
        _NToM: function (over, _under) {
            //                alert("under = " + under);
            //                alert("over = " + over);
            if (over && _under < over) {
                throw new Error("参数错误");
                return;
            }

            under = _under + 1;     //此处要加1。因为_NToM函数只会产生over到_under-1的数。
            switch (arguments.length) {
                case 1:
                    return Math.floor(Math.random() * under + 1); //没设下限的话，默认为1
                case 2:
                    return Math.floor(Math.random() * (under - over) + over);
                default:
                    return 0;
            }
        },
        //生成制定位数的随机整数
        //如生成4位的随机整数：RndNum(4);
        RndNum: function (n) {
            var rnd = "";
            for (var i = 0; i < n; i++)
                rnd += Math.floor(Math.random() * 10);
            return rnd;
        },

        //over到under的任意整数，且是num的倍数
        _NToMByT: function (num, over, under) {
            var a = 0,
                    b = 0,
                    c = 0;

            switch (arguments.length) {
                case 2:
                    a = Math.floor(under / num);
                    b = 0;  //没设下限的话，默认从0开始
                    c = this._NToM(a, b);
                    return c * num;
                case 3:
                    a = Math.floor(under / num);
                    b = Math.ceil(over / num);
                    if (a < b) {
                        throw new Error("不存over到under且是num的倍数的整数");
                        return;
                    }
                    c = this._NToM(b, a);
                    return c * num;
                default:
                    throw new Error("_NToMByT 形参不能超过3个");
            }
        },
        //根据概率判断是否发生
        //probability为0-1的数，1表示100%，0表示0%
        Probability: function (probability) {
            var result = Math.random();
            //            console.log(t);
            if (result <= probability) {
                return true;
            }
            else {
                return false;
            }
        }
    };


    /************************************ 事件 ********************************************/

    /* 注意：不能写成：
    MyGameEngine.Event.AddEvent(document.getElementById("test_div"), "mousedown", MyGameEngine.Event.BindEvent(this, Handler));
    MyGameEngine.Event.RemoveEvent(document.getElementById("test_div"), "mousedown", MyGameEngine.Event.BindEvent(this, Handler));

    这样不能移除掉绑定的事件！因为MyGameEngine.Event.BindEvent(this, Handler)不是同一个函数！（因为BindEvent返回了一个匿名函数，这两个
    BindEvent返回的匿名函数不是同一个！）

    应该写为：
    this._Handle = MyGameEngine.Event.BindEvent(this, Handler);
    MyGameEngine.Event.AddEvent($("div"), "mousedown", _Handle);
    MyGameEngine.Event.RemoveEvent($("div"), "mousedown", _Handle);

    这样_Handle就是同一个函数了！
    */
    var Event = {
        Bind: function (object, fun) {
            return function () {
                return fun.apply(object, arguments);
            };
        },
        /*
        注意BindWithArguments与Bind的区别！它们传的参数不一样！

        示例：

        var func = Bind(this, A);
        func("a");  //将func的参数"a"传入A

        var func = BindWithArguments(this, A, "b");
        func(); //将"b"传入A
        */

        BindWithArguments: function (object, fun, _args) {
            var args = null;
            var self = this;


            //            if (arguments.length === 3 && operate.IsArray(_args) && !operate.IsNotObject(_args[0])) {
            //                args = _args;
            ////                console.log("BindWithArguments      ", args);
            //            }
            //            else {


            args = Array.prototype.slice.call(arguments, 2);


            //            }
            //            console.log("BindWithArguments      ", args);


            return function () {
                return fun.apply(object, args);
            }
        },
        //注意！BindEvent传的参数与BindWithArguments类似，只是第一个参数为event！
        BindEvent: function (object, fun) {
            var args = Array.prototype.slice.call(arguments, 2);
            var self = this;

            return function (event) {
                //                if (!object) {
                //                    return fun.apply(fun, [self.WrapEvent(event)].concat(args)); //对事件对象进行包装
                //                }
                //                else {
                return fun.apply(object, [self.WrapEvent(event)].concat(args)); //对事件对象进行包装
                //                }
            }
        },
        /* oTarget既可以是单个dom元素，也可以使jquery集合。
        如：
        MyGameEngine.Event.AddEvent(document.getElementById("test_div"), "mousedown", _Handle); 
        MyGameEngine.Event.AddEvent($("div"), "mousedown", _Handle);
        */
        AddEvent: function (oTarget, sEventType, fnHandler) {
            //            var oTarget = $(oTarget)[0];    //转换为dom对象
            var dom = null,
                i = 0,
                len = 0,
            temp = null;

            if (oTarget instanceof jQuery) {
            //                oTarget[0].attachEvent("on" + sEventType, fnHandler);
            //                len = oTarget.length;

            //                for (i = 0; i < len; i++) {
            //                    //                    dom[i].addEventListener(sEventType, fnHandler, false);
            //                    temp = oTarget.get(i);
            //                    if (temp.attachEvent) {
            ////                        console.log("attachEvent");
            //                        temp.attachEvent("on" + sEventType, fnHandler);
            //                    }
            //                    else if (temp.addEventListener) {
            ////                        console.log("addEventListener");
            //                        temp.addEventListener(sEventType, fnHandler, false);
            //                    }
            //                    else {
            ////                        console.log("else");
            //                        temp["on" + sEventType] = fnHandler;
            //                    }
            //                }



            oTarget.each(function () {
                dom = this;

                if (operate.IsHostMethod(dom, "addEventListener")) {
                    dom.addEventListener(sEventType, fnHandler, false);
                } else if (operate.IsHostMethod(dom, "attachEvent")) {
                    dom.attachEvent("on" + sEventType, fnHandler);
                } else {
                    dom["on" + sEventType] = fnHandler;
                }
            });
        }
        else {
            //                console.log("dom");

            dom = oTarget;

            if (operate.IsHostMethod(dom, "addEventListener")) {
                dom.addEventListener(sEventType, fnHandler, false);
            } else if (operate.IsHostMethod(dom, "attachEvent")) {
                dom.attachEvent("on" + sEventType, fnHandler);
            } else {
                dom["on" + sEventType] = fnHandler;
            }
        }



    },
    RemoveEvent: function (oTarget, sEventType, fnHandler) {
        var dom = null,
                i = 0,
                len = 0,
            temp = null;


        if (oTarget instanceof jQuery) {
            oTarget.each(function () {
                dom = this;
                if (operate.IsHostMethod(dom, "removeEventListener")) {
                    dom.removeEventListener(sEventType, fnHandler, false);
                } else if (operate.IsHostMethod(dom, "detachEvent")) {
                    dom.detachEvent("on" + sEventType, fnHandler);
                } else {
                    dom["on" + sEventType] = null;
                }
            });



            //                len = oTarget.length;
            //                //                dom = oTarget[0];

            //                for (i = 0; i < len; i++) {
            //                    //                    dom[i].addEventListener(sEventType, fnHandler, false);
            //                    temp = oTarget.get(i);

            //                    if (temp.detachEvent) {
            ////                        console.log("detachEvent");
            //                        temp.detachEvent("on" + sEventType, fnHandler);
            //                    }
            //                    else if (temp.removeEventListener) {
            ////                        console.log("removeEventListener");
            //                        temp.removeEventListener(sEventType, fnHandler, false);
            //                    }
            //                    else {
            ////                        console.log("else");
            //                        temp["on" + sEventType] = fnHandler;
            //                    }
            //                }
        }
        else {
            dom = oTarget;
            if (operate.IsHostMethod(dom, "removeEventListener")) {
                dom.removeEventListener(sEventType, fnHandler, false);
            } else if (operate.IsHostMethod(dom, "detachEvent")) {
                dom.detachEvent("on" + sEventType, fnHandler);
            } else {
                dom["on" + sEventType] = null;
            }
        }
    },
    /*
    包装event对象   -待补充

    event.type:返回事件名。返回没有“on”作为前缀的事件名，比如，onclick事件返回的type是click
    event.target: 返回事件源，就是发生事件的元素
    event.preventDefault: 阻止默认事件动作
    event.stopBubble: 阻止冒泡
    event.offsetLeft:为匹配的元素集合中获取第一个元素的当前坐标的left，相对于文档（document）。
    event.offsetTop:为匹配的元素集合中获取第一个元素的当前坐标的top，相对于文档（document）。
    event.positionLeft:获取匹配元素中第一个元素的当前坐标的left，相对于offset parent的坐标。( offset parent指离该元素最近的而且被定位过的祖先元素 ) 
    event.positionTop:获取匹配元素中第一个元素的当前坐标的top，相对于offset parent的坐标。( offset parent指离该元素最近的而且被定位过的祖先元素 ) 
    event.pageX: 鼠标相对于文档的左边缘的位置。 
    event.pageY: 鼠标相对于文档的上边缘的位置。 
    event.relatedTarget: 发生mouseover和mouseout事件时，相关的dom元素。
    （mouseover：鼠标来之前的元素；mouseout：鼠标将要去的那个元素）
    event.mouseButton: 鼠标按键。
    左键： 1
    右键： 2
    中键： 4
    没有按键： 0


    */
    WrapEvent: function (oEvent) {
        var e = oEvent ? oEvent : window.event;
        //            console.log(e);
        var target = e.srcElement || e.target;
        //ie
        if (Base.Browser.ie) {
            //                e.charCode = (e.type == "keypress") ? e.keyCode : 0;
            //                e.eventPhase = 2;
            //                e.isChar = (e.charCode > 0);

            e.pageX = e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
            e.pageY = e.clientY + document.body.scrollTop || document.documentElement.scrollTop;

            //                e.pageX = e.x;
            //                e.pageY = e.y;


            //                var eventDoc = e.target.ownerDocument || document;
            //                var doc = eventDoc.documentElement;
            //                var body = eventDoc.body;

            //                e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            //                e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);



            //                                e.preventDefault = function () {
            //                                    this.returnValue = false;
            //                                };
            e.preventDefault = function () {
                e.returnValue = false;
            };



            //                e.target = e.srcElement;

            //                e.stopBubble = function () {
            //                    this.cancelBubble = true;
            //                };
            e.stopBubble = function () {
                e.cancelBubble = true;
            };


            if (e.type == "mouseout") {
                e.relatedTarget = e.toElement;
            } else if (e.type == "mouseover") {
                e.relatedTarget = e.fromElement;
            }
            //                e.time = (new Date()).getTime();


            //                if (Base.Browser.ie7) {

            //                }
            //                else if (Base.Browser.ie8) {
            //                    //                    console.log(e.button);
            ////                                        switch (e.button) {
            ////                                            case 0:
            ////                                                //360浏览器（使用ie8内核）
            ////                                                if (e.type === "mouseup") {
            //////                    不能写成e.button = 2,会提示错误！
            ////                                                    e.mouseButton = 2;
            ////                                                }
            ////                                                else {
            ////                                                    e.mouseButton = 0;
            ////                                                }
            ////                                                break;
            ////                                            case 2:
            ////                                            case 1:
            ////                                            case 3:
            ////                                            case 4:
            ////                                            case 5:
            ////                                            case 6:
            ////                                            case 7:
            ////                                                e.mouseButton = e.button;
            ////                                                break;
            ////                                            default:
            ////                                                throw new Error("button值不能大于7！");
            ////                                                break;
            ////                                        }
            //                }
            //                else if (Base.Browser.ie9) {

            //                }
            //                else {
            //                    e.mouseButton = e.button;
            //                }


            e.mouseButton = e.button;

        }
        else {
            e.stopBubble = e.stopPropagation;

            //ff没有多个键一起按的事件
            switch (e.button) {
                case 0:
                    e.mouseButton = 1;
                    break;
                case 1:
                    e.mouseButton = 4;
                    break;
                case 4:
                    e.mouseButton = 0;
                    break;
                default:
                    e.mouseButton = e.button;
                    break;
            }


        }

        e.target = target;


        e.offsetLeft = $(target).offset().left;   //使用jquery的方法
        e.offsetTop = $(target).offset().top;     //使用jquery的方法

        e.positionLeft = $(target).position().left;   //使用jquery的方法
        e.positionTop = $(target).position().top;   //使用jquery的方法

        //            e.pageX = $(e.target).pageX();  //使用jquery的方法
        //            e.pageY = $(e.target).pageY();  //使用jquery的方法

        return e;
    },
    GetEvent: function () {
        //            if (window.event) {
        //                return this.WrapEvent(window.event);
        //            }
        //            else {
        //this.GetEvent.caller为调用了GetEvent方法的函数的引用
        return this.GetEvent.caller.arguments[0];
        //            }
    },
    /* 手动触发事件

    默认为不冒泡，不进行默认动作。

    2012-12-03

    网上资料：http://hi.baidu.com/suchen36/item/fb3eefbb8125c0a4eaba93e2


    为大家介绍js下的几个方法：
    1. createEvent（eventType）
    参数：eventType 共5种类型：
    Events ：包括所有的事件. 

    HTMLEvents：包括 'abort', 'blur', 'change', 'error', 'focus', 'load', 'reset', 'resize', 'scroll', 'select', 
    'submit', 'unload'. 事件

    UIEevents ：包括 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'keydown', 'keypress', 'keyup'.
    间接包含 MouseEvents. 

    MouseEvents：包括 'click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'. 

    MutationEvents:包括 'DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 
    'DOMCharacterDataModified', 'DOMNodeInsertedIntoDocument', 
    'DOMNodeRemovedFromDocument', 'DOMSubtreeModified'. 

    2. 在createEvent后必须初始化，为大家介绍5种对应的初始化方法

    HTMLEvents 和 通用 Events：
    initEvent( 'type', bubbles, cancelable )

    UIEvents ：
    initUIEvent( 'type', bubbles, cancelable, windowObject, detail )

    MouseEvents： 
    initMouseEvent( 'type', bubbles, cancelable, windowObject, detail, screenX, screenY, 
    clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget )

    MutationEvents ：
    initMutationEvent( 'type', bubbles, cancelable, relatedNode, prevValue, newValue, 
    attrName, attrChange ) 

    3. 在初始化完成后就可以随时触发需要的事件了，为大家介绍targetObj.dispatchEvent(event)
    使targetObj对象的event事件触发
    需要注意的是在IE 5.5+版本上请用fireEvent方法，还是浏览兼容的考虑

    4. 例子
    //例子1 立即触发鼠标被按下事件
    var fireOnThis = document.getElementById('someID');
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent( 'click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
    fireOnThis.dispatchEvent(evObj);

    //例子2 考虑兼容性的一个鼠标移动事件
    var fireOnThis = document.getElementById('someID');
    if( document.createEvent ) 
    {
    var evObj = document.createEvent('MouseEvents');
    evObj.initEvent( 'mousemove', true, false );
    fireOnThis.dispatchEvent(evObj);
    }
    else if( document.createEventObject )
    {
    fireOnThis.fireEvent('onmousemove');
    }

    */
    TriggerEvent: function (oTarget, type) {
        var evObj = null,
                dom = null;

        if (operate.IsHostMethod(document, "createEvent")) {
            /* 判断事件类型
            switch (type) {
            case 'abort':
            case 'blur':
            case 'change':
            case 'error':
            case 'focus':
            case 'load':
            case 'reset':
            case 'resize':
            case 'scroll':
            case 'select':
            case 'submit':
            case 'unload':
            evObj = document.createEvent('HTMLEvents');
            evObj.initEvent(type, false, true);
            break;
            case 'DOMActivate':
            case 'DOMFocusIn':
            case 'DOMFocusOut':
            case 'keydown':
            case 'keypress':
            case 'keyup':
            evObj = document.createEvent('UIEevents');
            evObj.initUIEvent(type, false, true);     //出错：参数过少
            break;
            case 'click':
            case 'mousedown':
            case 'mousemove':
            case 'mouseout':
            case 'mouseover':
            case 'mouseup':
            evObj = document.createEvent('MouseEvents');
            evObj.initMouseEvent(type, false, true);  //出错：参数过少
            break;
            case 'DOMAttrModified':
            case 'DOMNodeInserted':
            case 'DOMNodeRemoved':
            case 'DOMCharacterDataModified':
            case 'DOMNodeInsertedIntoDocument':
            case 'DOMNodeRemovedFromDocument':
            case 'DOMSubtreeModified':
            evObj = document.createEvent('MutationEvents');
            evObj.initMutationEvent(type, false, true);   //出错：参数过少
            break;
            default:
            throw new Error("超出范围！");
            break;

            }
            */

            //此处使用通用事件
            evObj = document.createEvent('Events');
            evObj.initEvent(type, false, true);
            if (oTarget instanceof jQuery) {
                oTarget.each(function () {
                    dom = this;
                    dom.dispatchEvent(evObj);
                });
            }
            else {
                dom = oTarget;
                dom.dispatchEvent(evObj);
            }
        }
        else if (operate.IsHostMethod(document, "createEventObject")) {
            if (oTarget instanceof jQuery) {
                oTarget.each(function () {
                    dom = this;
                    dom.fireEvent('on' + type);
                });
            }
            else {
                dom = oTarget;
                dom.fireEvent('on' + type);
            }
        }
    }
};




return {
    //基本操作
    Base: Base,
    //生成随机数
    Random: Random,
    //事件
    Event: Event
}
} ());
