//*备忘录

var Memento = MyClass({
    Init: function (attribute) {
        //        this._attribute = MyGameEngine.Base.Extend({}, attribute);

        //此处采用深拷贝，因为attribute可能有多层。
        this._attribute = MyGameEngine.Base.ExtendDeep(attribute);
    },
    Public: {
        SetAttribute: function (attribute) {
            this._attribute = MyGameEngine.Base.Extend({}, attribute);
        },
        GetAttribute: function () {
            return this._attribute;
        }
    },
    Private: {
        _attribute: {}
    }
});
