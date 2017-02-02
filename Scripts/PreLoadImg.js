///*   

//8-3

//我想实现推荐信息图片预加载。

//终于实现了！！！！


//重构为module(9-25)

//********************************************************************************
//调用方式

//array = [];
//<% 
//foreach (var item in photo)
//{
//%>
////                alert("zzz");
////                var count = <%= photo.Count() %>;
//array.push("<%= item %>");
////alert(array);
//<% } %>
//}


//        
//preLoadImg.Set(array, function(img, j){
//$("#index_recommend").find("img").eq(j).attr("src", img.src);
//});

//********************************************************************************





//*/

////function PreLoadImg(images, onStep, OnLoad) {
////    this.Imgs = images || [];

////    this.imgCount = this.Imgs.length;
////    this.currentLoad = 0;
////    this.timer = 0;

////    //调用构造函数时，执行该函数
////    this.LoadImg();
////};

////PreLoadImg.prototype = {
////    
////};





//var preLoadImg = (function () {
//    var Imgs = [];
//    var array = null;

//    var len = 0,
//        delay = 500;    //默认延迟时间

//    //    var options = { };


//    var OnLoad = function () { };


//    var ImageCache = function (img) {
//        //                var Imgs = new Array(array.length);
//        for (var i = 0, len = array.length; i < len; i++) {
//            img[i] = new Image();
//            img[i].src = array[i];
//        }
//    };


//    //加载图片
//    var Delay = function (img) {
//        for (var j = 0, len = img.length; j < len; j++) {
//            if (img[j].complete) {
//                OnLoad(img[j], j);  //调用OnLoad委托
//            }
//            else {
//                img[j].onload = function () {
//                    OnLoad(img[j], j);  //调用OnLoad委托
//                };
//            }
//        }
//        return;
//    }

//    var LoadImg = function (img) {

//        //    i = 0;
//        setTimeout(function () { Delay(img) }, delay);   //要延迟加载！且延迟时间要够长！！！(小于等于200ms经我测试不可行)
//        //    i = 0;

//    }

//    var Initialize = function () {
//        if (!array) {
//            throw new Error("array不能为空！");
//        }

//        if (!Imgs) {    //如果图片对象数组不存在，则初始化；否则直接调用
//            Imgs = new Array(array.length);
//            ImageCache(Imgs);  //初始化图片对象数组
//        }
//        //        console.log("Initialize! Imgs.length = " + Imgs.length);
//        LoadImg(Imgs); //预加载图片
////        console.log("Initialize! Imgs.length = " + Imgs.length);
//    };


//    return {
//        //入口，预加载图片并调用OnLoad显示图片。
//        //设置array,onload以及延迟时间
//        Set: function (_array, _onLoad, _delay) {
//            this.Clear();

//            array = DOTA.Clone(_array);
//            OnLoad = _onLoad;
//            if (_delay !== undefined) {
//                delay = _delay;
//            }

//            Initialize();
//        },
//        //只预加载图片，并返回图片数组（如果长度为1，则返回单个Image对象）。
//        //如果已经预加载过了，则直接返回图片数组。
//        SetImg: function (_array) {
//            //this.Clear();
//            if (!Imgs) {
//                Imgs = new Array(array.length);
//                ImageCache(Imgs);  //初始化图片对象数组
//            }
//            return Imgs.length == 1 ? Imgs[0] : Imgs;
//        },
//        Clear: function () {
//            Imgs = null;
//            array = null;
//            len = 0;
//            OnLoad = function () { };
//        },
//        /* 不能写成“GetImgs: Imgs”！
//        如果这样写，使用preLoadImg.GetImgs获得的Imgs是初始化的(var Imgs = [];)Imgs，
//        即为空数组[]
//        */
//        GetImgs: function () {
//            return Imgs.length == 1 ? Imgs[0] : Imgs;
//        }
//    }
//} ());

YYC.PreLoadImg = function(images, onStep, onLoad){
	this.config = images.images ? images : {
		images : images || [],
		onStep : onStep || function(){},
		onLoad : onLoad || function(){}
	};
	this.imgs = [];
	
	this.imgCount = this.config.images.length;
	this.currentLoad = 0;
	this.timerID = 0;
	
	this.LoadImg();
};
YYC.PreLoadImg.prototype = {
    LoadImg: function () {
        var c = this.config, i, imgs = this.imgs, self = this;
        for (i = 0; i < c.images.length; i++) {
            imgs.push(new Image());
            /* 
            经过对多个浏览器版本的测试，发现ie、opera下，当图片加载过一次以后，如果再有对该图片的请求时，由于浏览器已经缓存住这张图
 
            片了，不会再发起一次新的请求，而是直接从缓存中加载过来。对于 firefox和safari，它们试图使这两种加载方式对用户透明，同样
 
            会引起图片的onload事件，而ie和opera则忽略了这种同一性，不会引起图片的onload事件，因此上边的代码在它们里边不能得以实现效果。
 
            确实，在ie，opera下，对于缓存图片的初始状态，与firefox和safari，chrome下是不一样的（有兴趣的话，可以在不同浏览器下，测试一下在给img的src赋值缓存图片的url之前，img的状态），
            但是对onload事件的触发，却是一致的，不管是什么浏览器。

            产生这个问题的根本原因在于，img的src赋值与 onload事件的绑定，顺序不对（在ie和opera下，先赋值src，再赋值onload，因为是缓存图片，就错过了onload事件的触发）。
            应该先绑定onload事件，然后再给src赋值。
            */
            imgs[i].onload = function () {
                this.onload = null;     //解决ie内存泄露  此处this指代imgs[i]
                MyGameEngine.Event.Bind(self, self.OnLoad)();
            };
            imgs[i].src = c.images[i];
            this.timerID = (function (i) {
                return setTimeout(function () {
                    if (i == self.currentLoad) {
                        imgs[i].src = c.images[i];
                    }
                }, 500);
            })(i);
        }
    },
    OnLoad: function (i) {
//        console.log("加载图片完成");
        clearTimeout(this.timerID);
        this.currentLoad++;
        this.config.onStep(this.currentLoad, this.imgCount);

        if (this.currentLoad === this.imgCount) {
            this.config.onLoad(this.currentLoad);
            this.Dispose();
        }
    },
    Dispose: function () {
        var i, imgs = this.imgs;
        for (i = 0; i < imgs.length; i++) {
            imgs[i].onload = null;
            imgs[i] = null;
        }
        imgs.length = 0;
        this.config = null;
    }
};
