describe("Boss_Player_Copy", function () {

    var i = 0,
    length = 0;

    var copy = null;

    beforeEach(function () {
        copy = new Boss_Player_Copy();
    });
    afterEach(function () {
    });

    it("���Ա��ݵ�Boss�������Ϊԭʼֵ", function () {
        //����
        var value = [copy.name, copy.experience, copy.level, copy.index,
        copy.img, copy.img_gray, copy.minNum, copy.minScore, copy.text,
        copy.background_music, copy.config];

        var expectedValue = ["", 0, 1, "", "", "", 0, 0, "", [], {}];

        //����


        //����
        for (i = 0, length = value.length; i < length; i++) {
            expect(value[i]).toEqual(expectedValue[i]);
        }

                /*����toEqual��������[] equal []��

                expect([]).toEqual([]); //ͨ��

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