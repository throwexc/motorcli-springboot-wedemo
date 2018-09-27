define("easyui/widget/UploadDialog", [
    "dojo/_base/declare",

    "easyui/widget/FormDialog"
], function (declare, FormDialog) {

    return declare("easyui.widget.UploadDialog", [FormDialog], {

        title : '上传文件',

        saveBtnText : '提交',

        href : 'ui/easyui/widget/templates/UploadDialog.html',

        width : 400,
        height : 165,

        accept : null,

        uploadUrl : null,

        submitParams : null,

        alias : null,

        displayAlias : true,

        buildRendering : function() {
            if(this.displayAlias == false) {
                this.height = this.height - 40;
            }
            this.inherited(arguments);
        },

        onLoad : function () {
            var me = this;
            if(this.displayAlias == false) {
                this.$domNode.find(".aliasBox").prev().css({
                    border : 'none'
                });
                this.$domNode.find(".aliasBox").hide();
            }
            this.inherited(arguments);

            this.$fileBox = this.$form.find(".fileBox");
            this.$fileInput = $('<input name="file" style="width: 280px;"/>');
            if(this.accept) {
                this.$fileInput.attr('accept', this.accept);
            }
            this.$fileBox.append(this.$fileInput);

            this.$aliasInput = this.$form.find('input[name="alias"]');
            this.$aliasInput.textbox({
                required : true,
                validType : ['maxLength[200]']
            });

            this.$fileInput.filebox({
                prompt:'请选择文件',
                buttonText : '选择文件',
                onChange : function (value) {
                    if(me.alias) {
                        if(value) {
                            me.$aliasInput.textbox("setValue", me.alias);
                        } else {
                            me.$aliasInput.textbox("setValue", "");
                        }
                    } else {
                        if(value) {
                            me.$aliasInput.textbox("setValue", value);
                        } else {
                            me.$aliasInput.textbox("setValue", "");
                        }
                    }
                }
            });
        },

        setAlias : function (alias) {
            this.alias = alias;
        },

        onSave : function (values) {
            var me = this;
            if(this.uploadUrl) {
                $.motor.showWait();
                this.$form.attr("method", "post");
                this.$form.form({
                    url : this.uploadUrl,
                    onSubmit : function (params) {
                        params = $.extend(params, me.submitParams);
                    },
                    success : function (res) {
                        $.motor.hideWait();
                         me.onUploadFinished(JSON.parse(res));
                    }
                });
                this.$form.form("submit");
            }
        },

        onUploadFinished : function (res) {

        }
    });
});