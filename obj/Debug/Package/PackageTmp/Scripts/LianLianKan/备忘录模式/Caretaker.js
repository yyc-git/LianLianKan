//*备忘录管理员

//备忘录动态创建
//多备份
var Caretaker = MyClass({
    //name:技能名
    Init: function (name) {
        this._name = name;
        this[name + "_memento"] = [];
    },
    Public: {
        SetMemento: function (memento) {
            //加入备份容器中
            this[this._name + "_memento"].push(memento);
        },
        GetMemento: function () {
            //导出最近的一次备份
            return this[this._name + "_memento"].pop();
        },
        Dispose: function () {
            var i = 0,
                len = 0;

            for (i = 0, len = this[this._name + "_memento"].length; i < len; i++) {
                this[this._name + "_memento"][i] = null;
            }

            this[this._name + "_memento"] = [];
        }
    },
    Private: {
        _name: ""
    }
});
