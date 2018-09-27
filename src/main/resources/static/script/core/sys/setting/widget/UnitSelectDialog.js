define("sys/setting/widget/UnitSelectDialog", [
    "dojo/_base/declare",
    "easyui/widget/TreeDialog"
], function (declare, TreeDialog) {

    return declare("sys.setting.widget.UserSelectDialog", [TreeDialog], {

        title : '部门选择',

        icon : 'icon-house',

        width : 500,
        height : 450,

        url : 'api/sys/unit/tree'
    });
});