define("easyui/widget/FormDialog", [
    "dojo/_base/declare",
    "dojo/_base/array",

    "easyui/widget/_base/_BaseDialog"
], function (declare, array, _BaseDialog) {

    return declare("easyui.widget.FormDialog", [_BaseDialog], {

        title : '表单窗口',
        cache : true,
        modal : true,

        icon : 'icon-save',

        saveBtnText : '完成',

        _initButtons : function () {
                var me = this;
                this.buttons = [{
                    text : me.saveBtnText,
                    iconCls : 'icon-save',
                    handler : function () {
                        if(me.validate()) {
                            me.onSave(me.getValues());
                        }
                    }
                },{
                    text : '关闭',
                    iconCls : 'icon-close',
                    handler : function () {
                        me.hide();
                    }
                }];
        },

        buildRendering : function() {
            this.inherited(arguments);
        },

        onLoad : function () {
            this.$form = this.$domNode.find(".motor-form");
        },

        reset : function () {
            if(this.$form && this.isLoaded) {
                $.motor.resetForm(this.$form);
            }
        },

        validate : function () {
            var isValid = this.$form.form('validate');
            return isValid;
        },

        getValues : function () {
            return $.motor.formValueToJson(this.$form);
        },

        setValues : function (values) {
            if(!this.isLoaded) {
                var me = this;
                var inter = setInterval(function () {
                    if(me.isLoaded) {
                        try {
                            setTimeout(function () {
                                $.motor.setFormValues(me.$form, values);
                            }, 100);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            clearInterval(inter);
                        }
                    }
                }, 200);
            } else {
                $.motor.resetForm(this.$form);
                $.motor.setFormValues(this.$form, values);
            }
        },

        onSave : function (values) {

        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});