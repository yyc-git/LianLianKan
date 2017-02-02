describe("Boss_Player_Copy", function () {

    var i = 0,
    length = 0;

    var copy = null;

    beforeEach(function () {
        copy = new Boss_Player_Copy();
    });
    afterEach(function () {
    });

    it("测试备份的Boss类的属性为原始值", function () {
        //构造
        var value = [copy.name, copy.experience, copy.level, copy.index,
        copy.img, copy.img_gray, copy.minNum, copy.minScore, copy.text,
        copy.background_music, copy.config];

        var expectedValue = ["", 0, 1, "", "", "", 0, 0, "", [], {}];

        //操作


        //检验
        for (i = 0, length = value.length; i < length; i++) {
            expect(value[i]).toEqual(expectedValue[i]);
        }

                /*调用toEqual方法，则[] equal []。

                expect([]).toEqual([]); //通过

                console.log([] === {});  //false
                console.log([] == {});//false
                console.log([] == "");   //true
                console.log([] == false);   //true
                console.log([] == undefined);   //false
                console.log([] == []);   //false
                console.log([] === []);   //false
                */
    }); ;
});