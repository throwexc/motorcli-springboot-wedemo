define("sys/setting/widget/SetPasswordDialog", [
    "dojo/_base/declare",
    "easyui/widget/FormDialog"
], function (declare, FormDialog) {

    return declare("sys.setting.widget.SetPasswordDialog", [FormDialog], {

        title : '设置密码',
        modal : true,

        width : 400,
        height : 125,

        icon : 'icon-key',

        href : 'script/core/sys/setting/widget/password-form.html'
    });
});