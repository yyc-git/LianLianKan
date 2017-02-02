//Boss类备忘录
var Boss_Player_Copy = MyClass({
    Public: {
        //Boss姓名
        name: "",

        //这两项在选择Boss时再根据cookie中保存的值进行设置
        experience: 0,
        level: 1,

        index: "",
        img: "",    //未挑战成功的boss的头像
        img_gray: "",   //已挑战成功的boss的头像（灰色）
        minNum: 0,     //地图最小要求的方块数，如果为0则不限制地图
        minScore: 0, //玩家需要获得该得分才可以挑战
        text: "",    //boss说明

        background_music: [],    //背景音乐

        //参数设置
        config: {
    }
}
});

