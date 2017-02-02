
/* 下拉框操作封装
*   兼容ff、360(ie7)、ie9
    9-12
*/
var mySelect = (function () {
    var _$ = function (id) {
        return $("#" + id);
    }

    return {
        //全选
        SelectAll: function (id) {
            _$(id + " option").each(function () {
                $(this).attr("selected", "selected");   //选中该option
            });
        },
        //全不选
        SelectNone: function (id) {
            _$(id + " option").each(function () {
                $(this).attr("selected", false);   //不选中该option
            });
        },
        //Change事件处理
        ChangeHandler: function (id, handler) {
            //                _$(id).change(handler());
            _$(id).change(handler);
        },
        //清空下拉框
        Clear: function (id) {
            _$(id).empty();
        },
        //添加option(添加到末尾)
        AppendTo: function (id, option) {
            //            var id = "#" + $(this).attr("id");
            //            alert(id);
            $(option).appendTo("#" + id);
        },
        //添加option(添加到开头)
        PrependTo: function (id, option) {
            $(option).prependTo("#" + id);
        },
        //修改value=old_value的option的value为new_value
        ChangeValue: function (id, old_value, new_value) {
            //对特殊字符转义
            old_value = operate.EscapeJquery(old_value);
            //            alert("ChangeValue");
            //            alert("zhuanyi old_value = " + old_value);

            //            alert("option value = old_value   length = " + $(id).children("option[value*=" + old_value + "]").length);
            //            alert("option value = old_value   length = " + $(id).children("option[value*=" + "Custom\\#aa" + "]").length);
            if (typeof (id) == 'string') {  //id为id值
                _$(id).children("option[value*=" + old_value + "]").each(function () {
                    $(this).val(new_value);
                }); //包含old_value
            }
            else {  //id为dom对象
                $(id).children("option[value*=" + old_value + "]").each(function () {
                    $(this).val(new_value);
                });  //包含old_value
            }
            //            alert("option value = new_value   length = " + $(id).children("option[value*=" + new_value + "]").length);
        },
        //修改value=old_value的option的text为new_text
        ChangeText: function (id, old_value, new_text) {
            //对特殊字符转义
            old_value = operate.EscapeJquery(old_value);

            if (typeof (id) == 'string') {  //id为id值
                _$(id).children("option[value*=" + old_value + "]").each(function () {
                    $(this).text(new_text);
                });  //包含old_value
            }
            else {  //id为dom对象
                $(id).children("option[value*=" + old_value + "]").each(function () {
                    $(this).text(new_text);
                });  //包含old_value
            }
        },
        //同时修改value和text
        ChangeValueText: function (id, old_value, new_value, new_text) {
            //先修改text
            this.ChangeText(id, old_value, new_text);
            this.ChangeValue(id, old_value, new_value);
        },
        //选中最后一项
        SelectLast: function (id) {
            if (typeof (id) == 'string') {  //id为id值
                _$(id + " option:last").attr("selected", "selected");
            }
            else {  //id为dom对象(option:last)
                $(id).attr("selected", "selected");
            }
        },
        /* 单选 */
        Single: {
            /* 获取选中的value */
            GetValue: function (id) {
                return _$(id).val();
            },

            /* 获取选中的文本值

            在ie9和ff中，var category = $("#info_category option:checked").text()可以取到值；
            在360中，var category = $("#info_category option[selected]").text()可以取到值！

            因此以下方法可以兼容360、ie9、ff
            */
            GetText: function (id) {
                return _$(id + " option:checked").text() == "" ? _$(id + " option[selected]").text() : _$(id + " option:checked").text();
            },
            //获得选中项的索引
            GetIndex: function (id) {
                return document.getElementById(id).selectedIndex;
            },
            //选中指定的option
            SelectIndex: function (id, index) {
                if (typeof (id) == 'string') {  //id为id值
                    _$(id)[0].selectedIndex = index;
                }
                else {  //id为dom对象
                    $(id)[0].selectedIndex = index;
                }
            },
            //选中指定value的option
            SelectByValue: function (id, value) {
                _$(id).val(value);
                //                _$(id).children("option[value='" + value + "']").first().
            }
        },
        /* 多选 */
        Multiple: {
            GetValue: function (id) {
                return _$(id).val().join(",");
            },
            GetText: function (id) {
                /*  如果text为null，则text += "a";alert(text);
                结果为"nulla"   ！！！！

                var text = null;
                */
                var text = "";
                var checked = null;

                checked = _$(id + " option:checked");
                if (checked.length == 0) {
                    checked = _$(id + " option[selected]");
                }
                checked.each(function () {
                    text += $(this).text() + ',';
                });
                //                alert(text);
                return text.slice(0, -1);   //去掉最后一个逗号
            },
            //设置select中对应value的option选中
            SelectByValue: function (id, array) {
                //                var array = operate.Clone(array);

                //ff下select需要刷新
                if (operate.Browser.ff) {
                    mySelect.SelectNone(id);
                }

                var i = array.length;
                while (i--) {   //往下数，这样效率高
                    //对特殊字符转义
                    array[i] = operate.EscapeJquery(array[i]);
                    _$(id).children("option[value=" + array[i] + "]").each(function () {   //可能有多个option的value等于该值
                        $(this).attr("selected", "selected");   //选中该option
                    });
                }
                //                for (var i = 0, length = array.length;)
                //                _$(id + " option").each(function () {
                //                    if ($(this).val() == )
                //                });
            }
        }
    }
})();