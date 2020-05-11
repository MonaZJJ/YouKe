var Validate = {
    //为空校验
    emptyValidate: function (ele, msg, defaultValue) {
        var ele = Common.getJqueryObj(ele);
        var value = $.trim(ele.val());
        var defaultValue = defaultValue || "";
        if (value == "" || value == defaultValue) { //未输入值或者是默认值
            Common.showInfoMsg(msg, ele);
            return false;
        }
        return true;
    },
    //为空校验,并获取焦点
    emptyValidateAndFocus: function (ele, msg, defaultValue) {
        var ele = Common.getJqueryObj(ele);
        var value = $.trim(ele.val());
        var defaultValue = defaultValue || "";
        if (value == "" || value == defaultValue) { //未输入值或者是默认值
            Common.showInfoMsg(msg, function () {
                ele.focus();
            });
            return false;
        }
        return true;
    },
    //为空校验,并获取焦点
    emptyValidateAndFocusAndColor: function (ele, msg, defaultValue) {
        var ele = Common.getJqueryObj(ele);
        var value = $.trim(ele.val());
        var defaultValue = defaultValue || "";
        if (value == "" || value == defaultValue) { //未输入值或者是默认值
            Common.showInfoMsg(msg, function () {
                ele.focus();
                ele.css('border', '1px solid red')
            });
            return false;
        }
        return true;
    },
    //为空校验,不提示信息
    emptyValidateNoMsg: function (ele, defaultValue) {
        var ele = Common.getJqueryObj(ele);
        var value = $.trim(ele.val());
        var defaultValue = defaultValue || "";
        if (value == "" || value == defaultValue) { //未输入值或者是默认值
            return false;
        }
        return true;
    },
    //密码规则校验
    passwordValidate: function (ele, minLength, maxLength, msg) {
        var ele = Common.getJqueryObj(ele);
        var value = $.trim(ele.val());

        var v1 = /[0-9]/.test(value) == true ? 1 : 0; //包含数字
        var v2 = /[a-zA-z]/.test(value) == true ? 1 : 0; //包含字母

        var regExp = new RegExp("^[a-zA-Z0-9!@#$%^&*()_+]{" + minLength.toString() + "," + maxLength.toString() + "}$")
        var v3 = regExp.test(value); //8-20位

        //密码：介于M-N位之间，只能包含英文字母（A-Z）、数字字符（0-9）以及半角标点符号（!@#$%^&*()_+，不含空格），至少包含1个英文字母和1个数字字符
        var isPass = (v1 + v2 + v3) == 3; //必须包含1位数字、1个字母

        if (isPass == false) {
            if (msg == null || msg.length == 0) {
                msg = "密码为" + minLength.toString() + "-" + maxLength.toString() + "位的字母，数字或符号组合";
            }
            Common.showInfoMsg(msg);
        }

        return isPass;
    },
    //密码确认校验
    passwordConfirm: function (pw1, pw2, msg) {
        var pw1 = $(pw1);
        var pw2 = $(pw2);
        var value1 = $.trim(pw1.val());
        var value2 = $.trim(pw2.val());
        if (value1.length > 0 && value2.length > 0 && pw1.val() != pw2.val()) {
            if (msg == null || msg.length == 0) {
                msg = "两次所填写的密码不一致，请重新输入";
            }
            Common.showInfoMsg(msg);
            return false;
        }
        return true;
    },
    //密码确认校验
    passwordConfirmAndFocus: function (pw1, pw2, msg) {
        var pw1 = $(pw1);
        var pw2 = $(pw2);
        var value1 = $.trim(pw1.val());
        var value2 = $.trim(pw2.val());
        if (value1.length > 0 && value2.length > 0 && pw1.val() != pw2.val()) {
            if (msg == null || msg.length == 0) {
                msg = "两次所填写的密码不一致，请重新输入";
            }
            Common.showInfoMsg(msg, function () {
                ele.focus()
            });
            return false;
        }
        return true;
    },
    //值是否相同校验
    dataIsSameAndFocus: function (val1, val2, msg) {
        var val1 = $(val1);
        var val2 = $(val2);
        var value1 = $.trim(val1.val());
        var value2 = $.trim(val2.val());
        if (value1.length > 0 && value2.length > 0 && val1.val() == val2.val()) {
            if (msg == null || msg.length == 0) {
                msg = "值一致，请重新输入";
            }
            Common.showInfoMsg(msg, function () {
                val2.focus()
            });
            return false;
        }
        return true;
    },
    //数字验证
    decimalValidate: function (ele, msg) {
        var ele = Common.getJqueryObj(ele);
        var pattern = /^\d+(\.\d+)?$/; //非负浮点数验证
        var value = Common.clearCommas($.trim(ele.val()));
        var isPass = pattern.test(value);
        if (isPass == false) {
            if (msg == null || msg.length == 0) {
                msg = "输入了无效的数字";
            }
            Common.showInfoMsg(msg);
        }
        return isPass;
    },
    //数字验证
    digitValidate: function (ele, msg) {
        var ele = Common.getJqueryObj(ele);
        var pattern = /^[0-9]*$/;
        var value = Common.clearCommas($.trim(ele.val()));
        var isPass = pattern.test(value);
        if (isPass == false) {
            if (msg == null || msg.length == 0) {
                msg = "输入了无效的数字";
            }
            Common.showInfoMsg(msg);
        }
        return isPass;
    },
    //限制输入字数
    Checklength: function (ele, msg) {
        var ele = Common.getJqueryObj(ele);
        var max = ele[0].getAttribute("maxlength");
        if (max == null || max == "" || max == undefined) {
            return true;
        }
        if (ele.val().length > max) {
            Common.showInfoMsg(msg);
            return false;
        }
        var min = ele[0].getAttribute("min");;
        if (min == null || min == "" || min == undefined) {
            return true;
        }
        if (ele.val().length < min) {
            Common.showInfoMsg(msg);
            return false;
        }
        return true;
    },
    //限制textarea输入字数
    CheckTextarealength: function (ele) {
        var ele = Common.getJqueryObj(ele)[0];
        var max = ele.getAttribute("maxlength");
        if (max == null || max == "" || max == undefined) {
            return true;
        }
        if (ele.value.length > max) {
            return false;
        }
        return true;
    },
    //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
    checkUrl: function checkURL(ele) {
        var ele = Common.getJqueryObj(ele);
        var value = $.trim(ele.val());
        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(Expression);
        if (objExp.test(value) == true) {
            return true;
        } else {
            Common.showInfoMsg("链接不合法", function () {
                ele.focus();
            });
            return false;
        }



    },
}