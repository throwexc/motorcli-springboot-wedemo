define("sys/setting/widget/RoleDistributionDialog", [
    "dojo/_base/declare",
    "easyui/widget/SearchCheckBoxDataGridDialog"
], function (declare, SearchCheckBoxDataGridDialog) {

    return declare("sys.setting.widget.RoleDistributionDialog", [SearchCheckBoxDataGridDialog], {

        title : '角色分配',

        icon : 'icon-edit-role',

        pagination : false,

        width : 800,
        height : 350,

        url : 'api/sys/user/check/roles',

        firstFireLoad : false,

        columns : [[
            {field:'checked', checkbox:true, title:''},
            {field:'name', title:'名称',width:450},
            {field:'remark',title:'备注',fixed:true, width:500}
        ]]
    });
});