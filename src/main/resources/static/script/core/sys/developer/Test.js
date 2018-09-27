define("sys/developer/Test", [
    "dojo/_base/declare",
    "dojo/_base/connect",

    "easyui/_base/_TabPane",
    "easyui/widget/UploadDialog"
], function (declare, connect, _TabPane, UploadDialog) {

    return declare("sys.developer.Test", [_TabPane], {

        url : 'script/core/sys/developer/html/Test.html',

        onLoad : function ($panel) {
            this.$uploadBtn = $panel.find(".uploadBtn");

            this.createUploadDialog();

            var me = this;

            this.$uploadBtn.click(function () {
                me.uploadDialog.show();
            });
        },

        createUploadDialog : function() {
            this.uploadDialog = new UploadDialog({
                uploadUrl : 'common/file/upload/temp/file',
                submitParams : {
                    userId : this.userInfo.id
                }
            });
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});