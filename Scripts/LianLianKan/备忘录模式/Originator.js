/*发起人放到Operate_Boss.js中！


//*发起人

var Originator = MyClass({
    Init: function (attribute) {
        this._attribute = attribute;
    },
    Public: {
        SetAttribute: function (attribute) {
            this._attribute = MyGameEngine.Base.Extend({}, attribute);
        },
        GetAttribute: function () {
            return this._attribute;
        },
        CreateMemento: function () {
            return new Memento(this._attribute);
        },
        RestoreMemento: function (memento) {
            this.SetAttribute(memento.GetAttribute());
        }
    },
    Private: {
        _attribute: {}
    }
});
*/