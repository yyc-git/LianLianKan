soundManager.url = 'SoundManager/swf/';     //swf�ļ�������λ��
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

    //Ԥ��������
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
            //������������
            sounds[i] = soundManager.createSound({
                id: c.sounds[i][1] ? c.sounds[i][1] : 'Name' + rnd + i,
                url: c.sounds[i][0],
                onload: MyGameEngine.Event.Bind(this, this.OnLoad), //���سɹ������this.OnLoad
                onfinish: function () { this.OnFinish(this.sID); }  //���Ž�������self.OnFinish(this.sID);
            });
            //            console.log("before load");
            //���ض���
            sounds[i].load();
        }
    },
    OnLoad: function () {
        this.currentLoad++;
        this.config.onStep(this.currentLoad, this.soundCount);  //��ʾ�����

        //ȫ�����سɹ��󣬵���ָ����OnLoadί��
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

            //*δ��֤��

            //����������󲻴��ڣ��򴴽�
            //            if (!this.sounds[i]) {
            //                this.sounds[i] = soundManager.createSound({
            //                    id: c.sounds[i][1] ? c.sounds[i][1] : 'Name' + rnd + i,
            //                    url: c.sounds[i][0],
            //                    onload: function () { this.Play(); },
            //                    onfinish: function () { this.OnFinish(this.sID); }
            //                });
            //                this.sounds[i].load();
            //            }
            //            //����ֱ��ʹ��
            //            else {


            //�����������
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
    /***************************************** �������� *****************************************/

    //ָ�����Ŵ���
    //num:���Ŵ���  
    //���numС�ڵ���0�����ʾѭ������
    RepeatPlay: function (index, num) {
        //        var i = this.FindIndex(index);

        var self = this;

        if (num === undefined || num <= 0) {
            this.Play(index, MyGameEngine.Event.Bind(self, function () {
                self.RepeatPlay(index); //��ʱnumΪundefined�����������ж�Ҫ���ϡ�num === undefined��
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
    //����time�루ѭ�����ţ���time���ֹͣ����
    PlayInTimeByLoop: function (index, time, onfinish) {
        var i = this.FindIndex(index), self = this;
        if (i >= 0) {

            //�����������
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
    //����time�루��ѭ�����ţ���time���ֹͣ����
    PlayInTime: function (index, time, onfinish) {
        var i = this.FindIndex(index), self = this;
        if (i >= 0) {

            //�����������
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
    /***************************************** �������ݽ��� *****************************************/

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
    
