/* 扩展Array，增加forEach和filter方法 */
(function () {
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, thisObj) {
            var scope = thisObj || window;
            for (var i = 0, j = this.length; i < j; ++i) {
                fn.call(scope, this[i], i, this);
            }
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fn, thisObj) {
            var scope = thisObj || window;
            var a = [];
            for (var i = 0, j = this.length; i < j; ++i) {
                if (!fn.call(scope, this[i], i, this)) {
                    continue;
                }
                a.push(this[i]);
            }
            return a;
        };
    }
})();





//共有方法库
var common = {
    //隐藏效果层
    HideDiv: function (div) {
        div && div.css("left", "-4000px");
    },
    //地图数据加入自定义地图
    AddCustomMap: function (data, isIframe) {
        var arr_data = data.split("|");

        //如果在iframe中调用（MapEditor.html）
        if (isIframe) {
            //“序号|地图名|地图数据|作者名”
            //自定义地图序号为-1
            self.parent.DataSource_MapData.push(new self.parent.Map(Number(arr_data[0]), arr_data[1], arr_data[2], arr_data[3]));
        }
        else {
            //“序号|地图名|地图数据|作者名”
            //自定义地图序号为-1
            DataSource_MapData.push(new Map(Number(arr_data[0]), arr_data[1], arr_data[2], arr_data[3]));
        }

        return arr_data;
    },
    //页数跳转
    Jump: function (pageNum, pageIndex) {
        var totalNumber = arguments[0];
        //                var pageSize = arguments[1];
        var page = arguments[1];
        var where = arguments[2];

        //    alert("totalNumber=" + totalNumber);
        var jtext = jQuery.trim($("#_jumpid").val());
        //    alert("jtext="+jtext);
        if (jtext.length > 0) {
            var jtest = /^\d{1,4}$/;
            if (!jtest.test(jtext) || jtext === "0") {  //页号为0也不行
                alert("请输入正确的页号，谢谢!");
            }
            else {
                jtext = parseInt(jtext);    //jtext为String型，要转换为整型
                if (jtext == page) {     //输入的页码为当前页
                    alert("您输入的是当前页，请重新输入~");
                }
                else if (jtext <= totalNumber) {
                    //                alert("jtext=" + jtext);
                    getContentTab(where, jtext);
                }
                else {
                    alert("您输入的页号超过了最大页数，请重新输入~");
                }
            }
        }
        else {
            window.alert("请输入要跳转的页号，谢谢~");
        }
    }
};









// 
//<!doctype html>
//<html>
//  <head>
//    <title>javascript 观察者模式 by 司徒正美</title>
//    <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
//  </head>
//  <body>
//    <script type="text/javascript">
//      var dom = {
//        each : function(obj,fn,score){
//          for(var key in obj){
//            if(obj.hasOwnProperty(key))
//              fn.call(score,obj[key],key,obj)
//          }
//        }
//      };
//      dom.each({
//        indexOf: function (el, index) {
//          var n = this.length,
//          i = index == null ? 0 : index < 0 ? Math.max(0, n + index) : index;
//          for (; i < n; i++)
//            if (i in this && this[i] === el) return i;
//          return -1;
//        },
//        //移除 Array 对象中指定位置的元素。
//        removeAt: function (index) {
//          return this.splice(index, 1)
//        },
//        //移除 Array 对象中某个元素的第一个匹配项。
//        remove: function (item) {
//          var index = this.indexOf(item);
//          if (index !== -1) this.removeAt(index);
//          return item;
//        }
//      },function(method,name){
//        if(!Array.prototype[name])
//          Array.prototype[name] = method;
//      });

//      /* 订阅者接口 */
//      var Observer = function() {
//        //观察者要实现的方法
//        this.update = function() {throw "此方法必须被实现！"}
//      }
//      /* 发布者接口 */
//      var Subject = function() {
//        this.observers = [];
//      }
//      Subject.prototype = {
//        //如果状态发生改变，通知所有观察者调用其update方法
//        notifyObservers : function(context) {
//          for(var i = 0, n = this.observers.length; i < n; i++) {
//            this.observers[i].update(context);
//          }
//        },
//        // 添加订阅者
//        attach : function(observer){
//          if(!observer.update) throw 'Wrong observer';
//          this.observers.push(observer);
//        },
//        /* 移除订阅者 */
//        detach : function(observer) {
//          if(!observer.update) { throw 'Wrong observer'; }
//          this.observers.remove(observer);
//        }
//      }
//      //实现接口
//      var implement = function(Concrete,Interface){
//        for(var prop in  Interface) {
//          Concrete[prop] = Interface[prop];
//        }
//      }


//      /***************** 发布者的实现类 ***********************/
//      var mainCheck = document.createElement("input");
//      mainCheck.type = 'checkbox';
//      mainCheck.id = 'MainCheck';
//      mainCheck.style.cssText = 'border:1px solid red';
//      implement( mainCheck,new Subject());
//      /* 当点击按钮的时候 给相关的观察者发送通知. 观察者接收到通知的时候 改变状态 */
//      mainCheck['onclick'] = function(){
//        this.notifyObservers(this.checked)
//      }

//      document.body.appendChild(mainCheck);

//      /********************* 订阅者的实现类 *****************************/
//      var obsCheck1 = document.createElement('input');
//      var obsCheck2 = document.createElement('input');
//      obsCheck1.type = 'checkbox';
//      obsCheck1.id = 'Obs1';
//      document.body.appendChild(obsCheck1);

//      obsCheck2.type = 'checkbox';
//      obsCheck2.id = 'Obs2';
//      document.body.appendChild(obsCheck2);
//      implement( obsCheck1,new Observer());
//      implement( obsCheck2,new Observer());

//      /* 必须实现它们的具体update方法 */
//      obsCheck1.update = function(value) {
//        this.checked = value;
//      }

//      obsCheck2.update = function(value) {
//        this.checked = value;
//      }

//      // 将发布者和订阅者(观察者)关联
//      mainCheck.attach(obsCheck1);
//      mainCheck.attach(obsCheck2);

//    </script>
//  </body>
//</html>
