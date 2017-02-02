
//全局设置
soundManager.url = 'SoundManager/swf/';     //swf文件夹在所位置
soundManager.debugMode = false;
soundManager.waitForWindowLoad = true;

YYC.SoundLoader = function (sounds, onStep, onLoad) {
    this.config = sounds.sounds ? sounds : {
        preLoad: true,
        sounds: sounds || [],
        onStep: onStep || function () { },
        onLoad: onLoad || function () { }
    };
    this.sounds = [];

    this.soundCount = this.config.sounds.length;
    this.currentLoad = 0;

    //预加载声音
    if (this.config.preLoad) {
        this.LoadSound();
    }
};
YYC.SoundLoader.prototype = {
    LoadSound: function () {
        //        console.log(soundManagerIsLoad);
        var c = this.config, i, sounds = this.sounds, rnd = parseInt(Math.random() * 1000, 10);
        var self = this;
        for (i = 0; i < c.sounds.length; i++) {
//            console.log("../" + c.sounds[i][0]);
            //创建声音对象
            sounds[i] = soundManager.createSound({
                id: c.sounds[i][1] ? c.sounds[i][1] : 'Name' + rnd + i,
                url: c.sounds[i][0],
                onload: MyGameEngine.Event.Bind(this, this.OnLoad), //加载成功后调用this.OnLoad
                onfinish: function () { this.OnFinish(this.sID); }  //播放结束后调用self.OnFinish(this.sID);
            });
            //            console.log("before load");
            //加载对象
            sounds[i].load();
        }
    },
    OnLoad: function () {
        this.currentLoad++;
        this.config.onStep(this.currentLoad, this.soundCount);  //显示进度条

        //全部加载成功后，调用指定的OnLoad委托
        if (this.currentLoad === this.soundCount) {
            this.config.onLoad(this.currentLoad);
        }
    },
    OnFinish: function (index) {
        var i = this.FindIndex(index);
        if (i >= 0) {
            if (this.sounds[i].onfinish) {
                this.sounds[i].onfinish();
            }
        }
    },
    FindIndex: function (index) {
        var s = this.config.sounds;
        if (typeof index === "number") { // index
            return index;
        } else { // name
            for (var i = 0; i < s.length; i++) {
                if (s[i][1] === index) {
                    return i;
                }
            }
        }
        return -1;
    },
    Play: function (index, onfinish) {
        var i = this.FindIndex(index), self = this;
        var c = this.config, i, sounds = this.sounds, rnd = parseInt(Math.random() * 1000, 10);
        if (i >= 0) {

            //*未验证！

            //如果声音对象不存在，则创建
            //            if (!this.sounds[i]) {
            //                this.sounds[i] = soundManager.createSound({
            //                    id: c.sounds[i][1] ? c.sounds[i][1] : 'Name' + rnd + i,
            //                    url: c.sounds[i][0],
            //                    onload: function () { this.Play(); },
            //                    onfinish: function () { this.OnFinish(this.sID); }
            //                });
            //                this.sounds[i].load();
            //            }
            //            //否则直接使用
            //            else {


            //声音对象存在
            this.sounds[i].play({ onfinish: function () {
                //                    console.log("finish!");
                //                    self.Play(index);
                onfinish();
            }
            });




            //            }

            this.sounds[i].onfinish = onfinish;
        }
    },
    Pause: function (index) {
        var i = this.FindIndex(index);
        if (i >= 0) {
            this.sounds[i].pause();
        }
    },
    Stop: function (index) {
        var i = this.FindIndex(index);
        if (i >= 0) {
            this.sounds[i].stop();
        }
    },
    /***************************************** 新增内容 *****************************************/

    //指定播放次数
    //num:播放次数  
    //如果num小于等于0，则表示循环播放
    RepeatPlay: function (index, num) {
        //        var i = this.FindIndex(index);

        var self = this;

        if (num === undefined || num <= 0) {
            this.Play(index, MyGameEngine.Event.Bind(self, function () {
                self.RepeatPlay(index); //此时num为undefined，所以条件判断要加上“num === undefined”
            }));
        }
        else {
            this.Play(index, MyGameEngine.Event.Bind(self, function () {
                num -= 1;
                if (num > 0) {
                    self.RepeatPlay(index, num);
                }
                else {
                    return;
                }
            }));
        }
        return;
    },
    //播放time秒（循环播放），time秒后停止播放
    PlayInTimeByLoop: function (index, time, onfinish) {
        var i = this.FindIndex(index), self = this;
        if (i >= 0) {

            //声音对象存在
            this.RepeatPlay(index, 0);
//            this.sounds[i].play({ onfinish: function () {
//                //                    console.log("finish!");
//                //                    self.Play(index);
//                onfinish();
//            }
//            });

//            this.sounds[i].onfinish = onfinish;

            window.setTimeout(function () {
                self.Stop(index);
            }, time * 1000);
        }
    },
    //播放time秒（不循环播放），time秒后停止播放
    PlayInTime: function (index, time, onfinish) {
        var i = this.FindIndex(index), self = this;
        if (i >= 0) {

            //声音对象存在
//            this.RepeatPlay(index, 0);
                        this.sounds[i].play({ onfinish: function () {
                            //                    console.log("finish!");
                            //                    self.Play(index);
                            onfinish();
                        }
                        });

                        this.sounds[i].onfinish = onfinish;

            window.setTimeout(function () {
                self.Stop(index);
            }, time * 1000);
        }
    },
    Resume: function (index) {
        var i = this.FindIndex(index);

        if (i >= 0) {
            this.sounds[i].resume();
        }
    },
    PauseAll: function () {
        var i = 0,
            len = 0;

        for (i = 0, len = this.sounds.length; i < len; i++) {
            this.sounds[i].pause();
        }
    },
    StopAll: function () {
        var i = 0,
            len = 0;

        for (i = 0, len = this.sounds.length; i < len; i++) {
            this.sounds[i].stop();
        }
    },
    ResumeAll: function () {
        var i = 0,
            len = 0;

        for (i = 0, len = this.sounds.length; i < len; i++) {
            this.sounds[i].resume();
        }
    },
    /***************************************** 新增内容结束 *****************************************/

    Dispose: function () {
        var i, sounds = this.sounds;
        for (i = 0; i < sounds.length; i++) {
            if (sounds[i]) {
                sounds[i].stop();
                sounds[i] = null;
            }
        }
        sounds.length = 0;
        this.config = null;
    }
};
    
