define("sys/setting/Role", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",

    "easyui/_base/_TabPane",
    "easyui/widget/DataGrid",
    "easyui/widget/FormDialog",
    "easyui/widget/SearchBox",
    "easyui/widget/CheckBoxTreeDialog"
], function (declare, connect, array, _TabPane, DataGrid, FormDialog, SearchBox, CheckBoxTreeDialog) {

    return declare("sys.setting.Role", [_TabPane], {

        url : 'script/core/sys/setting/html/role.html',

        onLoad : function ($panel) {
            this.$dataGrid = $panel.find(".dataGrid");
            this.$roleToolbar = $panel.find(".roleToolbar");
            this.$searchBox = this.$roleToolbar.find(".searchBox");

            this.$addBtn = this.$roleToolbar.find(".addBtn");
            this.$deleteAllBtn = this.$roleToolbar.find(".deleteAllBtn");

            this.createRoleGrid();
            this.createSaveDialog();
            this.createResourceCheckDialog();
            this.events();
        },

        createRoleGrid : function () {
            var me = this;
            this.dataGrid = new DataGrid({
                url : 'api/sys/role/search',
                $toolbar : this.$roleToolbar,
                singleSelect : false,
                checkable : true,
                border : true,
                columns : [[
                    {field:'ck', checkbox:true, title:''},
                    {field:'name', title:'名称',width:350},
                    {field:'remark', title:'备注',width:550},
                    {field:'操作',title:'操作', width:95, fixed:true, formatter : me.optionFormatter}
                ]]
            }, this.$dataGrid[0]);

            connect.connect(this.dataGrid, 'onIconButtonClick', this, this.onGridIconBtnClick);

            this.searchBox = new SearchBox({}, this.$searchBox[0]);
            connect.connect(this.searchBox, 'onSearch', this, this.searchRole);
        },

        optionFormatter : function () {
            return $.motor.formatterIconButtons([{
                name : '修改',
                option : 'update',
                icon : 'icon-edit'
            },{
                name : '分配权限',
                option : 'acls',
                icon : 'icon-setting'
            },{
                name : '删除',
                option : 'delete',
                icon : 'icon-delete'
            }]);
        },

        onGridIconBtnClick : function (option, data) {
            if(option == 'update') {
                this.update(data);
            } else if(option == 'delete') {
                this.deleteRole(data);
            } else if(option == "acls") {
                this.ACL(data);
            }
        },

        searchRole : function (search, searchName) {
            var params = {};
            params["name"] = search;
            params["startTime"] = "2018-10-14 23:59:59";
            this.dataGrid.reload(params);
        },

        createSaveDialog : function () {
            this.saveDialog = new FormDialog({
                title : '角色信息',
                href : 'script/core/sys/setting/html/role-edit-form.html',
                width : 400,
                height : 240
            });
            connect.connect(this.saveDialog, 'onSave', this, this.save);
        },

        events : function () {
            var me = this;

            this.$addBtn.click(function () {
                me.saveDialog.reset();
                me.saveDialog.show();
            });

            this.$deleteAllBtn.click(function () {
                var roles = me.dataGrid.getSelections();
                if(roles.length == 0) {
                    $.motor.warningInfo("请选择要删除的记录");
                    return;
                }
                me.deleteRoles(roles);
            });
        },

        update : function (data) {
            this.saveDialog.reset();
            this.saveDialog.setValues(data);
            this.saveDialog.show();
        },

        deleteRole : function (data) {
            $.motor.confirm("是否确定删除?", function () {
                $.motor.Request.del("api/sys/role/delete/" + data.id, {}, function (res) {
                    this.dataGrid.deleteSelected();
                }, this, true);
            }, this);
        },

        deleteRoles : function (roles) {
            $.motor.confirm("是否确定删除?", function () {
                var idArray = new Array();
                array.forEach(roles, function (s) {
                    idArray.push(s.id);
                }, this);
                $.motor.Request.jsonDel("api/sys/role/delete", idArray, function (res) {
                    this.dataGrid.deleteSelections();
                }, this, true);
            }, this);
        },

        save : function (values) {
            $.motor.Request.jsonPost('api/sys/role/save', values, function(res) {
                this.saveDialog.hide();
                if(values.id) {
                    this.dataGrid.update(res.record);
                } else {
                    this.dataGrid.add(res.record);
                }
            }, this, true);
        },

        /************************** ACL *********************/
        createResourceCheckDialog : function () {
            this.resourceCheckDialog = new CheckBoxTreeDialog({
                url : 'api/sys/resource/actor/check/resources',
                title : '权限分配',
                height : 500
            });

            connect.connect(this.resourceCheckDialog, 'onFinish', this, this.saveACL);
        },

        ACL : function (data) {
            this.resourceCheckDialog.reload({
                actorId : data.id
            });
            this.resourceCheckDialog.show();
        },

        saveACL : function () {
            var role = this.dataGrid.getSelected();
            var resources = this.resourceCheckDialog.getChecked();
            var idArray = new Array();
            array.forEach(resources, function (resource) {
                idArray.push(resource.id);
            }, this);
            var values = {
                actorId : role.id,
                resourceIds : idArray,
                reset : true
            };
            $.motor.Request.jsonPost('api/sys/acl/save/read', values, function(res) {
                this.resourceCheckDialog.hide();
            }, this, true);
        },

        destroy : function () {
            if(this.saveDialog) {
                this.saveDialog.destroy();
            }
            if(this.resourceCheckDialog) {
                this.resourceCheckDialog.destroy();
            }
            this.inherited(arguments);
        }
    });
});