describe("MyBasicOperate", function () {
    //    var player;
    //    var song;

    var value1 = null,
        value2 = null;

    beforeEach(function () {
        //        player = new Player();
        //        song = new Song();

        spyOn(operate, 'IsHostMethod').andCallThrough();
        value1 = operate.IsHostMethod($("#test")[0], "addEventListener");
        value2 = operate.IsHostMethod($("#test")[0], "attachEvent");
    });
    it("����IsHostMethod�����ù�", function () {
        //        player.play(song);
        //        expect(player.currentlyPlayingSong).toEqual(song);

        //        //demonstrates use of custom matcher
        //        expect(player).toBePlaying(song);

        expect(operate.IsHostMethod).toHaveBeenCalled();


    });
    it("����IsHostMethod����ֵ addEventListener", function () {
        expect(value1).toBeTruthy();
    });
    it("����IsHostMethod����ֵ attachEvent", function () {
        expect(value2).toBeTruthy();
    });
});