//游戏界面
//显示对应的页面

var Interface_UI_Page = MyInterface("InitMenu", "InitButton", "GetWindow", "Dispose");

var UI_Page = MyClass({ Interface: Interface_UI_Page }, {
    Init: function (ui) {
        this._operate_ui = ui;
    },
    Private: {
        _operate_ui: null,
        //窗体容器（单例模式）
        _window: {},
        //按键
        _button_start: null,
        _button_boss: null,
        _button_setting: null,
        _button_end: null,


        //游戏设置窗体。
        //复用同一个窗体。
        _InitSetting: function () {
            var dlg = null,
                self = this;

            //            //暂停游戏
            //            this._operate_ui.Pause();

            if (this._window.setting) {
                //暂停
                this._operate_ui.Pause();
                //重定位到视窗中间
                this._window.setting.ResizeTo(300, 200);
                //显示
                this._window.setting.Show();
                return;
            }
            else {
                dlg = new YYC.Window({
                    title: "游戏设置",
                    isShow: false,
                    isClear: false,
                    opacity: 0.4,
                    url: "View/GameSetting.html",
                    onLoad: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Pause),
                    onClose: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Continue),
                    id: "iframe_gameSetting"
                });
                //                    dlg.SetTitle("用户信息设置");
                //                    dlg.LoadUrl("Scripts/SelectMap.html");    //加载页面成功后，会触发页面的js
                dlg.ResizeTo(300, 200);
                //                    dlg.AddToolBar({ menu: menu });

                this._window.setting = dlg;
            }
        },
        //选图窗体
        //每次调用都创建一个新的窗体（因为要刷新窗体，如刷新自定义地图等）。
        _InitSelectMap: function () {
            var dlg = null;

            //            //未开始游戏时，可以选图
            //            if (LianLianKan.gameStatus === LianLianKan.Status.Stop || LianLianKan.gameStatus === LianLianKan.Status.None) {
            //            //暂停游戏
            //            this._operate_ui.Pause();

            //            if (this._window.selectMap) {
            //                //                this._window.selectMap.Show();
            //                //                return;

            ////                this._window.selectMap.Dispose();
            //            }
            //            else {
            dlg = new YYC.Window({
                title: "选择地图",
                isShow: false,
                isClear: true,
                opacity: 0.4,
                url: "View/SelectMap.html",
                onLoad: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Pause),
                //                onUnLoad: MyGameEngine.Event.Bind(this, function () {
                //                    this._window.selectMap.Dispose();
                //                }),
                onClose: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Continue),

                id: "iframe_selectMap"
            });
            //                    dlg.SetTitle("用户信息设置");
            //                    dlg.LoadUrl("Scripts/SelectMap.html");    //加载页面成功后，会触发页面的js
            dlg.ResizeTo(650, 400);
            //                    dlg.AddToolBar({ menu: menu });

            this._window.selectMap = dlg;
            //            }
            //            }
        },
        //自定义地图窗体。
        //每次调用都创建一个新的窗体（因为要刷新窗体，如刷新自定义地图等）。
        _InitMapEditor: function () {
            var dlg = null;

            //            //暂停游戏
            //            this._operate_ui.Pause();

            //            if (this._window.mapEditor) {
            //                //                this._window.mapEditor.Show();
            //                //                return;

            //                this._window.mapEditor.Dispose();   //销毁之前的窗体，创建新的窗体
            //            }

            dlg = new YYC.Window({
                title: "自定义地图",
                isShow: false,
                isClear: true,
                opacity: 0.4,
                url: "View/MapEditor.html",
                onLoad: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Pause),
                onClose: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Continue),
                id: "iframe_mapEditor"
            });
            dlg.ResizeTo(800, 500);

            this._window.mapEditor = dlg;
        },
        //挑战Boss窗体。
        //每次调用都创建一个新的窗体（因为要刷新窗体，如刷新已挑战的Boss情况等）。
        _InitBoss: function () {
            var dlg = null;

            //未开始游戏时或者单人游戏时，可以挑战boss
            if (LianLianKan.pattern === LianLianKan.Pattern.Single || LianLianKan.gameStatus === LianLianKan.Status.Stop || LianLianKan.gameStatus === LianLianKan.Status.None) {
                //                //暂停游戏
                //                this._operate_ui.Pause();

                //                if (this._window.boss) {
                //                    this._window.boss.Dispose();   //销毁之前的窗体，创建新的窗体
                //                }
                dlg = new YYC.Window({
                    title: "挑战Boss",
                    isShow: false,
                    isClear: true,
                    opacity: 0.4,
                    url: "View/Boss.html",
                    onLoad: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Pause),
                    onClose: MyGameEngine.Event.Bind(this._operate_ui, this._operate_ui.Continue),
                    id: "iframe_boss"
                });
                dlg.ResizeTo(800, 610);

                this._window.boss = dlg;
            }
            else {
                //                alert("游戏进行期间不能挑战Boss");
                if (confirm("游戏进行期间不能挑战Boss。是否结束游戏？")) {
                    this._operate_ui.EndGame();
                }
                else {
                }
            }
        }
    },
    Public: {
        //菜单
        menu: null,

        //初始化菜单
        InitMenu: function () {
            //            var this._operate_ui = LianLianKan.Operate_UI;
            //            this._operate_ui.Pause();
            this.menu = new YYC.MENU.Menu({ id: "menuContainer", items: [
            		    {
            		        text: '系统',
            		        menu: {
            		            items: [
            					    {
            					        //指向LianLianKan.Operate_UI
            					        text: '开始单人游戏', handler: MyGameEngine.Event.BindEvent(this._operate_ui, this._operate_ui.Start_Single, LianLianKan.Operate_Single)
            					    }, {
            					        text: '暂停', handler: MyGameEngine.Event.BindEvent(this._operate_ui, this._operate_ui.Pause, LianLianKan.Operate_Single)
            					    }, {
            					        text: '保存', handler: MyGameEngine.Event.BindEvent(this._operate_ui, this._operate_ui.SaveInfo, LianLianKan.Operate_Single, LianLianKan.Operate_Boss)
            					    }, {
            					        text: '退出游戏', handler: MyGameEngine.Event.BindEvent(this._operate_ui, this._operate_ui.Exit)
            					    }, {
            					        text: '设置', handler: MyGameEngine.Event.Bind(this, this._InitSetting)   //此处要绑定到this
            					    }, {
            					        text: '重置玩家信息', handler: MyGameEngine.Event.BindEvent(this._operate_ui, this._operate_ui.ResetPlayInfo)
            					    }
            				    ]
            		        }
            		    }, {
            		        text: '地图',
            		        menu: {
            		            items: [
            					    {
            					        text: '选择地图', handler: MyGameEngine.Event.Bind(this, this._InitSelectMap)   //此处要绑定到this
            					    }, {
            					        text: '自定义地图', handler: MyGameEngine.Event.Bind(this, this._InitMapEditor)   //此处要绑定到this
            					    }
            				    ]
            		        }
            		    }, {
            		        text: 'Boss',
            		        menu: {
            		            items: [
            					    {
            					        text: '挑战Boss', handler: MyGameEngine.Event.Bind(this, this._InitBoss)   //此处要绑定到this
            					    }, {
            					        text: '重置Boss', handler: MyGameEngine.Event.BindEvent(this._operate_ui, this._operate_ui.ResetBoss)
            					    }
            				    ]
            		        }
            		    }
            		    ]
            });

            this.menu.RenderTo("lianliankan_menu");



            //                        menu.SetHandle([1, 2], function () {
            //                            alert("new!");
            //                        });
        },
        //初始化按钮
        InitButton: function () {
            var self = this;

            //模式为None或单人模式下，点击开始单人游戏
            this._button_start = new YYC.Button({ text: "开始",
                onClick: function (e) {
                    //
                    if (LianLianKan.pattern === LianLianKan.Pattern.Single || LianLianKan.pattern === LianLianKan.Pattern.None) {
                        self._operate_ui.Start_Single();
                    }
                    else if (LianLianKan.pattern === LianLianKan.Pattern.Boss) {
                        self._operate_ui.Start_Boss();
                    }
                }
            });

            this._button_start.RenderTo("index_button1");

            this._button_boss = new YYC.Button({ text: "挑战Boss",
                onClick: function (e) {
                    self._InitBoss();
                }
            });

            this._button_boss.RenderTo("index_button2");

            this._button_setting = new YYC.Button({ text: "设置",
                onClick: function (e) {
                    self._InitSetting();
                }
            });

            this._button_setting.RenderTo("index_button3");

            this._button_end = new YYC.Button({ text: "结束游戏",
                onClick: function (e) {
                    if (confirm("确定要结束游戏吗？")) {
                        self._operate_ui.EndGame();
                    }
                }
            });

            this._button_end.RenderTo("index_button4");
        },
        GetWindow: function () {
            return this._window;
        },
        Dispose: function () {
        }
    }
});