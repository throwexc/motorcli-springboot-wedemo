define("sys/setting/widget/DeletedUserSelectDialog", [
    "dojo/_base/declare",
    "easyui/widget/CheckBoxDataGridDialog"
], function (declare, CheckBoxDataGridDialog) {

    return declare("sys.setting.widget.DeletedUserSelectDialog", [CheckBoxDataGridDialog], {

        title : '用户选择',

        icon : 'icon-man',

        pagination : false,

        width : 800,
        height : 350,

        url : 'api/sys/user/status/delete',

        columns : [[
            {field:'checked', checkbox:true, title:''},
            {field:'name', title:'姓名',width:200},
            {field:'username',title:'用户名',width:200},
            {field:'unitName', title:'部门名称',width:150},
            {field:'sex',title:'性别',width:100},
            {field:'phone',title:'手机',width:150},
            {field:'roles',title:'角色',width:150, fixed:true}
        ]],

        reload : function () {
            this.dataGrid.reload();
        }
    });
});