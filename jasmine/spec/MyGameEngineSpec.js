describe("MyGameEngine", function () {
    //    var player;
    //    var song;

    //    var value = null;
    //    var self = this;
    //    var AddEvent = function (oTarget, sEventType, fnHandler) {
    //        var dom = null,
    //                    i = 0,
    //                    len = 0,
    //                temp = null;

    //        var result = "";

    //        if (oTarget instanceof jQuery) {
    //            oTarget.each(function () {
    //                dom = this;

    //                if (operate.IsHostMethod(dom, "addEventListener")) {
    //                    dom.addEventListener(sEventType, fnHandler, false);
    //                    result = "addEventListener";
    //                    return false;
    //                } else if (operate.IsHostMethod(dom, "attachEvent")) {
    //                    dom.attachEvent("on" + sEventType, fnHandler);
    //                    result = "attachEvent";
    //                    return false;
    //                } else {
    //                    dom["on" + sEventType] = fnHandler;
    //                    result = "other";
    //                    return false;
    //                }
    //            });
    //            //            return "jquery";
    //        }
    //        else {
    //            //            //                console.log("dom");

    //            dom = oTarget;

    //            if (operate.IsHostMethod(dom, "addEventListener")) {
    //                dom.addEventListener(sEventType, fnHandler, false);
    //                return "dom addEventListener";
    //            } else if (operate.IsHostMethod(dom, "attachEvent")) {
    //                dom.attachEvent("on" + sEventType, fnHandler);
    //                return "dom attachEvent";
    //            } else {
    //                dom["on" + sEventType] = fnHandler;
    //                return "dom other";
    //            }
    //            return "dom";
    //        }
    //        return result;
    //    };
    //    var _Handle = function () {
    //        console.log("mousedown!");
    //    };

    //    var foo = {
    //        AddEvent: AddEvent
    //    };


    var event = MyGameEngine.Event;

    beforeEach(function () {
        //        player = new Player();
        //        song = new Song();

        //        MyGameEngine.Event.AddEvent($("#test"), "mousedown", function () {
        //            console.log("mousedown!");
        //        });



        //                spyOn(foo, "AddEvent").andCallThrough();
    });

    it("测试AddEvent jquery对象", function () {
        //        expect(value).toEqual("addEventListener");
        //                AddEvent($("#test"), "mousedown", _Handle);
        //                expect(AddEvent).toHaveBeenCalled();

        event.AddEvent($("#test"), "mousedown", function () {
            console.log("mousedown!");
        });
    });
    it("测试AddEvent dom对象", function () {
        event.AddEvent(document.getElementById("test"), "mousedown", function () {
            console.log("dom mousedown!");
        });
    });
});