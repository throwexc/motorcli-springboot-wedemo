define("sys/developer/Module", [
    "dojo/_base/declare",
    "dojo/_base/connect",

    "easyui/_base/_TabPane",
    "easyui/widget/TreeGrid",
    "easyui/widget/FormDialog"
], function (declare, connect, _TabPane, TreeGrid, FormDialog) {

    return declare("sys.developer.Module", [_TabPane], {

        url : 'script/core/sys/developer/html/module.html',

        onLoad : function ($panel) {
            this.$dataGrid = $panel.find(".dataGrid");
            this.$moduleToolbar = $panel.find(".moduleToolbar");
            this.$addBtn = $panel.find(".addBtn");
            this.$uncheckBtn = $panel.find(".uncheckBtn");

            this.createGrid(this.$dataGrid);
            this.createSaveDialog();

            this.events();
        },

        createGrid : function () {
            var me = this;
            this.dataGrid = new TreeGrid({
                url : 'api/sys/module/tree',
                idField : 'id',
                labelField : 'name',
                $toolbar : this.$moduleToolbar,
                collapseAll : true,
                border : true,
                columns : [[
                    {field:'name',title:'名称',width:300},
                    {field:'dataState',title:'状态',width:80, formatter : function(value) {
                        if(value == 0) {
                            return '<span style="color: red;">禁用</span>';
                        } else {
                            return '<span style="color: green;">启用</span>';
                        }
                    }},
                    {field:'moduleUrl',title:'用户接口',width:300},
                    {field:'moduleIcon',title:'图标',width:200},
                    {field:'orderNum',title:'排序号',width:200},
                    {field:'resourceType',title:'资源类型',width:200, formatter : function (value) {
                        var text = "";
                        if(value == 1) {
                            return "<span style='color:green;'>内部模块</span>";
                        } else if(value == 2) {
                            return "<span style='color:blue;'>外部链接</span>";
                        }
                    }},
                    {field:'操作',title:'操作', width:65, fixed:true, formatter : me.optionFormatter}
                ]]
            }, this.$dataGrid[0]);

            connect.connect(this.dataGrid, 'onIconButtonClick', this, this.onGridIconBtnClick);
        },

        createSaveDialog : function () {
            var me = this;
            this.saveDialog = new FormDialog({
                title : '模块信息',
                href : 'script/core/sys/developer/html/module-edit-form.html',
                width : 590,
                height : 330
            });
            connect.connect(this.saveDialog, 'onSave', this, this.save)
        },

        optionFormatter : function () {
            return $.motor.formatterIconButtons([{
                name : '修改',
                option : 'update',
                icon : 'icon-edit'
            },{
                name : '删除',
                option : 'delete',
                icon : 'icon-delete'
            }]);
        },

        events : function () {
            var me = this;
            this.$addBtn.click(function () {
                me.saveDialog.reset();
                me.saveDialog.show();
            });
            this.$uncheckBtn.click(function () {
                me.dataGrid.unselectAll();
            });
        },

        onGridIconBtnClick : function (option, data) {
            if(option == 'update') {
                this.update(data);
            } else if(option == 'delete') {
                this.deleteItem(data);
            }
        },

        update : function (data) {
            this.saveDialog.reset();
            this.saveDialog.setValues(data);
            this.saveDialog.show();
        },

        save : function (values) {
            var selected = this.dataGrid.getSelected();
            if(selected && !values.id) {
                values.parentId = selected.id;
            }
            $.motor.Request.jsonPost('api/sys/module/save', values, function(res) {
                if(values.id) {
                    this.dataGrid.update(res.record, values.id);
                } else {
                    this.dataGrid.add(res.record, values.parentId);
                }
                this.saveDialog.hide();
            }, this, true);
        },

        deleteItem : function (data) {
            $.motor.confirm("是否确定删除?", function () {
                $.motor.Request.del("api/sys/module/delete/" + data.id, {}, function (res) {
                    this.dataGrid.deleteById(data.id);
                }, this, true);
            }, this);
        },


        destroy : function () {
            if(this.saveDialog) {
                this.saveDialog.destroy();
            }
            this.inherited(arguments);
        }
    });
});