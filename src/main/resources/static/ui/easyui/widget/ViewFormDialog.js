define("easyui/widget/ViewFormDialog", [
    "dojo/_base/declare",
    "dojo/_base/array",

    "easyui/widget/FormDialog"
], function (declare, array, FormDialog) {

    return declare("common.widget.ViewFormDialog", [FormDialog], {

        file_id: null,
        isAdd: false,
        values: null,

        _setDisabled : function () {
            this.$textInput = this.$form.find(".easyui-textbox");
            this.$dateInput = this.$form.find(".easyui-datebox");
            this.$selector = this.$form.find(".easyui-combobox");
            this.$radio = this.$form.find('input[type="radio"]');
            this.$photoShow = this.$form.find(".expertPhoto");

            this.$textInput.textbox('disable',true);
            this.$dateInput.textbox('disable',true);
            this.$selector.textbox('disable',true);
            this.$radio.attr('disabled',"disabled");
        },

        _initButtons : function () {
            var me = this;
            this.buttons = [{
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
            this.inherited(arguments);
            this._setDisabled();
        },

        setValues: function (values) {
            this.values = values;
            if (!this.isLoaded) {
                var me = this;
                var inter = setInterval(function () {
                    if (me.isLoaded) {
                        if (me.noEdit) {
                            me.$textInput.textbox('disable', true);
                            me.$dateInput.textbox('disable', true);
                            me.$selector.textbox('disable', true);
                        }
                        $.motor.setFormValues(me.$form, values);
                        me.isAdd = false;
                      /*  if (values.photo_file_id) {
                            me.file_id = values.photo_file_id;
                            me.$photoShow.html('<img src="common/file/download/' + values.photo_file_id + '" height="105px" width="110px" />');
                        } else {
                            me.$photoShow.html('请上传照片');
                        }*/
                        clearInterval(inter);
                    }
                }, 200);
            } else {
                var me = this;
                if (me.noEdit) {
                    me.$textInput.textbox('disable', true);
                    me.$dateInput.textbox('disable', true);
                    me.$selector.textbox('disable', true);
                }
                $.motor.setFormValues(me.$form, values);
                me.isAdd = false;
               /* if (values.photo_file_id) {
                    me.file_id = values.photo_file_id;
                    me.$photoShow.html('<img src="common/file/download/' + values.photo_file_id + '" height="105px" width="110px" />');
                } else {
                    me.$photoShow.html('请上传照片');
                }*/
            }

        },
    });
});

