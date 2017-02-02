///* =========================================================================

//     Modello, JavaScript Class Framework

//     Author: Ken Xu <ken@ajaxwing.com>

//     For more information, see: http://modello.sourceforge.net/

//   -----------------------------------------------------------------------

//     Copyright 2006 by Ken Xu

//			      All Rights Reserved

//     Permission to use, copy, modify, and distribute this software and its
//     documentation for any purpose and without fee is hereby granted, provided
//     that the above copyright notice appear in all copies and that both that
//     copyright notice and this permission notice appear in supporting
//     documentation, and that the name of Ken Xu not be used in advertising or
//     publicity pertaining to distribution of the software without specific,
//     written prior permission.

//     KEN XU DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE, INCLUDING
//     ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO EVENT SHALL
//     KEN XU BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
//     DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
//     AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
//     OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

//   ========================================================================= */


//var Modello = {
//    version: '0.0.3',
//    date: '2006-03-27'
//}

////“var Class = new (function(){})”这种写法会自动创建实例！？   
//var Class = new (function () {

//    this.create = function () {
//        //创建的类的构造函数
//        var cls = function () {
//            //__class__为创建的类的属性，指向创建的类,
//            this.__class__ = arguments.callee;
//            _construct.apply(this, arguments);
//         }
//        _extends(cls, arguments);
//        //为类加入静态方法
//        cls.register = function (path, override) {return Class.register(this, path, override);}
//        cls.create = _createInstance;
//        cls.toString = _toStringClass;
//        cls.subclassOf = function (cls) {return _subclassOf(this, cls);}
//        cls.superclassOf = function (cls) {return _subclassOf(cls, this);}
//        return cls;
//    }

//    this.register = function (cls, path, override) {
//        var override = override || false;
//        if (typeof cls != 'function') {
//            throw new Error('Class register error: The first argument must be a function');
//        }
//        var pair = [];
//        if (!_parse_path(path, pair)) {
//            throw new Error('Class register error: Invalid class path');
//        }
//        var pkg = pair[0];
//        var cn = pair[1];
//        var old_class = _class_depository[pkg][cn];
//        if (old_class) {
//            if (override) {
//                delete old_class.__package__;
//                delete old_class.__classname__;
//            } else {
//                throw new Error('Class register error: Class "' + path + '" already exists');
//            }
//        }
//        _class_depository[pkg][cn] = cls;
//        cls.__package__ = pkg;
//        cls.__classname__ = cn;
//        return cls;
//    }

//    this.get = function (path) {
//        var pair = [];
//        if (!_parse_path(path, pair, true) || !_class_depository[pair[0]][pair[1]]) {
//            throw new Error('Class get error: Class "' + path + '" is not found');
//        }
//        return _class_depository[pair[0]][pair[1]];
//    }

//    this.abstractMethod = function () {
//        throw new Error('Class runtime error: call an abstract method that has not been implemented');
//    }

//    this.toString = function () { return '[object Class]'; }

//    var _class_depository = {};

//    var _parse_path = function (path, pair, check) {
//        if (typeof path != 'string' || path.length == 0) {
//            return false;
//        }
//        var arr = path.split('.');
//        if (arr.length > 1) {
//            pair[0] = arr.slice(0, arr.length - 1).join('.');
//            pair[1] = arr[arr.length - 1];
//        } else {
//            pair[0] = '';
//            pair[1] = path;
//        }
//        if (typeof _class_depository[pair[0]] != 'object') {
//            if (check) {
//                return false;
//            } else {
//                _class_depository[pair[0]] = {};
//            }
//        }
//        return true;
//    }

//    var _createInstance = function () {
//        var args = [];
//        for (var i = 0; i < arguments.length; i++) {
//            args.push('arguments[' + i + ']');
//        }
//        return eval('new this(' + args.join(', ') + ');');
//    }

//    var _extends = function (cls, args) {
//        cls.__superclasses__ = [];
//        for (var i = 0; i < args.length; i++) {
//            var superclass = args[i];
//            if (typeof superclass == 'string') {
//                superclass = Class.get(superclass);
//            }
//            if (typeof superclass != 'function') {
//                throw new Error('Class create error: Invalid superclass: ' + 'args[' + i + ']');
//            }
//            cls.__superclasses__.push(superclass);
//        }
//    }

//    var _construct = function () {
//        var cls = this.__class__;
//        for (var i = cls.__superclasses__.length - 1; i >= 0; i--) {
//            var s = cls.__superclasses__[i];
//            eval('this.super' + i + ' = new s(Class);');
//            eval('_extend(this, this.super' + i + ');');
//        }
//        this.__class__ = cls;
//        this.toString = _toStringInstance;
//        if (typeof cls.construct == 'function') {
//            cls.construct.apply(this, [this, cls]);
//        }
//        this.getClass = function () {return this.__class__;}
//        this.isA = function (cls) {return _subclassOf(this.__class__, cls);}
//        this.instanceOf = _instanceOf;
//        if (arguments[0] != Class && typeof this.initialize == 'function') {
//            this.initialize.apply(this, arguments);
//        }
//    }

//    var _extend = function (dest, src) {
//        for (prop in src) {
//            if (prop.substr(0, 5) == 'super' && !isNaN(parseInt(prop.substr(5)))) {
//                continue;
//            }
//            dest[prop] = src[prop];
//        }
//    }

//    var _toStringClass = function () {
//        if (this.__classname__) {
//            if (this.__package__.length > 0) {
//                return '[class ' +  this.__package__ + '.' + this.__classname__ + ']';
//            } else {
//                return '[class ' +  this.__classname__ + ']';
//            }
//        } else {
//            return '[class Anonymous]';
//        }
//    }

//    var _toStringInstance = function () {
//        if (this.__class__.__classname__) {
//            if (this.__class__.__package__.length > 0) {
//                return '[object ' + this.__class__.__package__ + '.' + this.__class__.__classname__ + ']';
//            } else {
//                return '[object ' + this.__class__.__classname__ + ']';
//            }
//        } else {
//            if (this.__class__) {
//                return '[object Anonymous class]';
//            } else {
//                return '[object Object]';
//            }
//        }
//    }

//    var _instanceOf = function (cls) {
//        if (typeof cls == 'string') {
//            cls = Class.get(cls);
//        }
//        if (typeof cls != 'function') {
//            return false;
//        }
//        return this.__class__ == cls;
//    }

//    var _subclassOf = function (cls1, cls2) {
//        if (typeof cls1 == 'string') {
//            cls1 = Class.get(cls1);
//        }
//        if (typeof cls2 == 'string') {
//            cls2 = Class.get(cls2);
//        }
//        if (typeof cls1 != 'function' || typeof cls2 != 'function') {
//            return false;
//        }
//        if (!cls1.__superclasses__ || cls1.__superclasses__.constructor != Array) {
//            return false;
//        }
//        for (var i = 0; i < cls1.__superclasses__.length; i++) {
//            if (cls1.__superclasses__[i] == cls2) {
//                return true;
//            } else {
//                if (_subclassOf(cls1.__superclasses__[i], cls2)) {
//                    return true;
//                }
//            }
//        }
//        return false;
//    }

//});


///* ----------------------------
//    Utility methods.
//   ---------------------------- */
//var Define = (function () {
//    var __defined_macros__ = [];
//    return (function (name, value) {
//        if (arguments.length < 2 || typeof name != 'string') {
//            throw new Error('Define error: Usage: Define(\'name\', value);');
//        }
//        for (var i = 0; i < __defined_macros__.length; i++) {
//            if (__defined_macros__[i] == name) {
//                return;
//            }
//        }
//        if (typeof value == 'string') {
//            eval('window.' + name + ' = "' + value + '";');
//        } else {
//            if (typeof value == 'number' || typeof value == 'boolean') {
//                eval('window.' + name + ' = ' + value + ';');
//            } else {
//                eval('window.' + name + ' = value ;');
//            }
//        }
//        __defined_macros__.push(name);
//    });
//})();


///* ----------------------------
//    Methods for compatible.
//   ---------------------------- */
//if (!Array.prototype.push) {
//    Array.prototype.push = function () {
//        var l = this.length;
//        for (var i = 0; i < arguments.length; i++) {
//            this[l + i] = arguments[i];
//        }
//        return this.length;
//    }
//}

//if (!Function.prototype.apply) {
//    Function.prototype.apply = function (obj, args) {
//        var arr = [];
//        var obj = obj || window;
//        var args = args || [];
//        for (var i = 0; i < args.length; i++) {
//            arr[i] = 'args[' + i + ']';
//        }
//        obj.__tmp_method__ = this;
//        var result = eval('obj.__tmp_method__(' + arr.join(', ') + ')');
//        delete obj.__tmp_method__;
//        return result;
//    }
//}




















