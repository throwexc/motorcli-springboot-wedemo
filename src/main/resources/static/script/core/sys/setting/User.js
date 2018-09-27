define("sys/setting/User", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",

    "easyui/_base/_TabPane",
    "easyui/widget/Tree",
    "easyui/widget/DataGrid",
    "easyui/widget/FormDialog",
    "easyui/widget/SearchBox",
    "./widget/DeletedUserSelectDialog",
    "./widget/SetPasswordDialog",
    "./widget/UnitSelectDialog",
    "./widget/RoleDistributionDialog"
], function (declare, connect, array, _TabPane, Tree, DataGrid, FormDialog, SearchBox, DeletedUserSelectDialog, SetPasswordDialog, UnitSelectDialog, RoleDistributionDialog) {

    return declare("sys.setting.User", [_TabPane], {

        url : 'script/core/sys/setting/html/user.html',

        onLoad : function ($panel) {
            var $dataTree = $panel.find(".dataTree");
            var $treeContextMenu = $(".unit-tree-context-menu");
            var $dataGrid = $panel.find(".dataGrid");
            var $userToolbar = $panel.find(".userToolbar");
            var $searchBox = $panel.find(".searchBox");
            var $addBtn = $panel.find(".addBtn");
            var $deleteAllBtn = $panel.find(".deleteAllBtn");
            var $resetDeleteBtn = $panel.find(".resetDeleteBtn");
            var $setPasswordBtn = $panel.find(".setPasswordBtn");
            var $resetUnitBtn = $panel.find(".resetUnitBtn");

            this.$treeContextMenu = $treeContextMenu;
            this.$userToolbar = $userToolbar;
            this.$addBtn = $addBtn;
            this.$deleteAllBtn = $deleteAllBtn;
            this.$resetDeleteBtn = $resetDeleteBtn;
            this.$setPasswordBtn = $setPasswordBtn;
            this.$resetUnitBtn = $resetUnitBtn;

            this.createUnitTree($dataTree, $treeContextMenu);
            this.createUnitSaveDialog();

            this.createGrid($dataGrid, $searchBox);
            this.createUserSaveDialog();

            this.createResetUserDialog();
            this.createSetPasswordDialog();
            this.createUnitSelectDialog();
            this.createRoleDialog();

            this.events($treeContextMenu);
        },

        /****************************** unit *********************************/

        createUnitTree : function ($dom, $contextMenu) {
            var tree = new Tree({
                url : 'api/sys/unit/tree',
                $contextMenu : $contextMenu
            }, $dom[0]);

            connect.connect(tree, 'onContextMenu', this, this.unitTreeContextMenu);
            connect.connect(tree, 'onClick', this, this.unitTreeClick);
            this.unitTree = tree;
        },

        unitTreeContextMenu : function (node) {
            if(!node.parentId) {
                this.$treeContextMenu.find(".deleteUnitBtn").hide().prev().hide();
            } else {
                this.$treeContextMenu.find(".deleteUnitBtn").show().prev().show();
            }
        },

        unitTreeClick : function (data) {
            this.searchBox.reset();
            this.searchUser();
        },

        createUnitSaveDialog : function () {
            this.unitSaveDialog = new FormDialog({
                title : '部门信息',
                href : 'script/core/sys/setting/html/unit-edit-form.html',
                width : 400,
                height : 280
            });
            connect.connect(this.unitSaveDialog, 'onSave', this, this.saveUnit);
        },

        saveUnit : function (values) {
            var selected = this.unitTree.getSelected();
            if(selected && !values.id) {
                values.parentId = selected.id;
            }
            $.motor.Request.jsonPost('api/sys/unit/save', values, function(res) {
                this.unitSaveDialog.hide();
                if(values.id) {
                    this.unitTree.update(res.record);
                } else {
                    this.unitTree.add(res.record);
                }
            }, this, true);
        },

        deleteUnit : function (data) {
            $.motor.confirm("是否确定删除?", function () {
                $.motor.Request.del("api/sys/unit/delete/" + data.id, {}, function (res) {
                    this.unitTree.deleteSelected();
                }, this, true);
            }, this);
        },

        /****************************** user *********************************/

        createGrid : function ($dom, $searchBox) {
            var me = this;
            var dataGrid = new DataGrid({
                url : 'api/sys/user/search',
                $toolbar : this.$userToolbar,
                singleSelect : false,
                checkable : true,
                columns : [[
                    {field:'ck', checkbox:true, title:''},
                    {field:'name', title:'姓名',width:150},
                   /* {field:'sn', title:'员工编号',width:100},*/
                    {field:'unitName', title:'部门名称',width:100},
                    {field:'username',title:'用户名',width:100},
                    {field:'sex',title:'性别',width:50},
                    {field:'phone',title:'手机',width:100},
                    {field:'roles',title:'角色',width:200},
                    {field:'操作',title:'操作',width:95, fixed:true, formatter : me.optionFormatter}
                ]]
            }, $dom[0]);
            this.dataGrid = dataGrid;

            connect.connect(this.dataGrid, 'onIconButtonClick', this, this.onGridIconBtnClick);

            var searchBox = new SearchBox({}, $searchBox[0]);
            connect.connect(searchBox, 'onSearch', this, function (search, searchName) {
                this.unitTree.unselect();
                this.searchUser(search, searchName);
            });
            this.searchBox = searchBox;
        },

        createUserSaveDialog : function () {
            var me = this;
            this.userSaveDialog = new FormDialog({
                title : '用户信息',
                href : 'script/core/sys/setting/html/user-edit-form.html',
                width : 590,
                height : 360
            });

            connect.connect(this.userSaveDialog, 'onSave', this, this.saveUser);
        },

        optionFormatter : function () {
            return $.motor.formatterIconButtons([{
                name : '修改',
                option : 'update',
                icon : 'icon-edit'
            },{
                name : '分配角色',
                option : 'roles',
                icon : 'icon-setting'
            },{
                name : '删除',
                option : 'delete',
                icon : 'icon-delete'
            }]);
        },

        searchUser : function (search, searchName) {
            var unit = this.unitTree.getSelected();
            var params = {};
            if(unit) {
                params.unitId = unit.id;
            }
            if(search) {
                params["keywords"] = search;
            }
            this.dataGrid.reload(params);
        },

        update : function (data) {
            this.userSaveDialog.setValues(data);
            this.userSaveDialog.show();
        },

        saveUser : function (values) {
            var unit = this.unitTree.getSelected();
            if(unit) {
                values.unitId = unit.id;
            }
            $.motor.Request.jsonPost('api/sys/user/save', values, function(res) {
                if(values.id) {
                    this.dataGrid.update(res.record);
                } else {
                    this.dataGrid.add(res.record);
                }
                this.userSaveDialog.hide();
            }, this, true);
        },

        deleteUser : function (data) {
            $.motor.confirm("是否确定删除?", function () {
                $.motor.Request.del("api/sys/user/delete/" + data.id, {}, function (res) {
                    this.dataGrid.deleteSelected();
                }, this, true);
            }, this);
        },

        deleteUsers : function (users) {
            $.motor.confirm("是否确定删除?", function () {
                var idArray = new Array();
                array.forEach(users, function (s) {
                    idArray.push(s.id);
                }, this);
                $.motor.Request.jsonDel("api/sys/user/delete", idArray, function (res) {
                    this.dataGrid.deleteSelections();
                }, this, true);
            }, this);
        },

        onGridIconBtnClick : function (option, data) {
            if(option == 'update') {
                this.update(data);
            } else if(option == 'delete') {
                this.deleteUser(data);
            } else if(option == 'roles') {
                this.roels(data);
            }
        },

        /****************************** common *********************************/

        events : function ($treeContextMenu) {
            var me = this;

            var addUnitBtn = $treeContextMenu.find(".addUnitBtn");
            var updateUnitBtn = $treeContextMenu.find(".updateUnitBtn");
            var deleteUnitBtn = $treeContextMenu.find(".deleteUnitBtn");

            addUnitBtn.click(function () {
                me.unitSaveDialog.reset();
                me.unitSaveDialog.show();
            });

            updateUnitBtn.click(function () {
                var selected = me.unitTree.getSelected();
                me.unitSaveDialog.reset();
                me.unitSaveDialog.setValues(selected);
                me.unitSaveDialog.show();
            });

            deleteUnitBtn.click(function () {
                var selected = me.unitTree.getSelected();
                me.deleteUnit(selected);
            });

            this.$addBtn.click(function () {
                if(!me.unitTree.getSelected()) {
                    $.motor.warningInfo("请选择部门");
                    return;
                }
                me.userSaveDialog.reset();
                me.userSaveDialog.show();
            });

            this.$deleteAllBtn.click(function () {
                var users = me.dataGrid.getSelections();
                if(users.length == 0) {
                    $.motor.warningInfo("请选择要删除的记录");
                    return;
                }
                me.deleteUsers(users);
            });

            this.$resetDeleteBtn.click(function () {
                me.resetUserDialog.reload();
                me.resetUserDialog.show();
            });

            this.$setPasswordBtn.click(function () {
                var users = me.dataGrid.getSelections();
                if(users.length == 0) {
                    $.motor.warningInfo("请选择要修改的记录");
                    return;
                }
                me.setPasswordDialog.reset();
                me.setPasswordDialog.show();
            });

            this.$resetUnitBtn.click(function () {
                var users = me.dataGrid.getSelections();
                if(users.length == 0) {
                    $.motor.warningInfo("请选择要修改的记录");
                    return;
                }
                me.unitSelectDialog.reload();
                me.unitSelectDialog.show();
            });
        },


        /************************ other *************************/

        createResetUserDialog : function () {
            this.resetUserDialog = new DeletedUserSelectDialog();
            connect.connect(this.resetUserDialog, 'onFinish', this, this.resetUsers);
        },

        resetUsers : function (users) {
            if(users.length == 0) {
                $.motor.warningInfo("请选择要恢复的用户");
                return;
            }
            var idArray = new Array();
            array.forEach(users, function (user) {
                idArray.push(user.id);
            }, this);
            $.motor.Request.jsonPost("api/sys/user/status/delete/recovery", idArray, function (res) {
                this.resetUserDialog.hide();
                this.dataGrid.reload();
            }, this, true);
        },

        createSetPasswordDialog : function () {
            this.setPasswordDialog = new SetPasswordDialog();
            connect.connect(this.setPasswordDialog, 'onSave', this, this.setPassword);
        },

        setPassword : function (values) {
            var users = this.dataGrid.getSelections();
            var idArray = new Array();
            array.forEach(users, function (user) {
                idArray.push(user.id);
            }, this);
            values.userIds  = idArray;
            $.motor.Request.jsonPost("api/sys/user/set/password", values, function (res) {
                this.setPasswordDialog.hide();
            }, this, true);
        },

        createUnitSelectDialog : function () {
            this.unitSelectDialog = new UnitSelectDialog();
            connect.connect(this.unitSelectDialog, 'onFinish', this, this.setUnit);
        },

        setUnit : function (selected) {
            var users = this.dataGrid.getSelections();
            var idArray = new Array();
            var values = {};
            array.forEach(users, function (user) {
                idArray.push(user.id);
            }, this);
            values.userIds  = idArray;
            values.unitId = selected.id;
            $.motor.Request.jsonPost("api/sys/user/set/unit", values, function (res) {
                this.unitSelectDialog.hide();
                this.dataGrid.reload();
            }, this, true);
        },

        createRoleDialog : function () {
            this.roleDialog = new RoleDistributionDialog();
            connect.connect(this.roleDialog, 'onFinish', this, this.saveRoles);
        },

        roels : function (user) {
            this.roleDialog.reload({
                userId : user.id
            });
            this.roleDialog.show();
        },

        saveRoles : function (roles) {
            var user = this.dataGrid.getSelected();
            var idArray = new Array();
            array.forEach(roles, function (role) {
                idArray.push(role.id);
            },this);
            var values = {
                userId : user.id,
                roleIds : idArray,
                reset : true
            };
            $.motor.Request.jsonPost("api/sys/user/save/role", values, function (res) {
                this.roleDialog.hide();
                this.dataGrid.reload();
            }, this, true);
        },

        destroy : function () {
            this.$treeContextMenu.remove();
            if(this.unitSaveDialog) {
                this.unitSaveDialog.destroy();
            }
            if(this.userSaveDialog) {
                this.userSaveDialog.destroy();
            }
            if(this.resetUserDialog) {
                this.resetUserDialog.destroy();
            }
            if(this.setPasswordDialog) {
                this.setPasswordDialog.destroy();
            }
            if(this.unitSelectDialog) {
                this.unitSelectDialog.destroy();
            }
            if(this.roleDialog) {
                this.roleDialog.destroy();
            }
            this.inherited(arguments);
        }
    });
});