define("sys/developer/Dictionary", [
    "dojo/_base/declare",
    "dojo/_base/connect",

    "easyui/_base/_TabPane",
    "easyui/widget/TreeGrid",
    "easyui/widget/FormDialog"
], function (declare, connect, _TabPane, TreeGrid, FormDialog) {

    return declare("sys.developer.Dictionary", [_TabPane], {

        url : 'script/core/sys/developer/html/dictionary.html',

        onLoad : function ($panel) {
            this.$dataGrid = $panel.find(".dataGrid");
            this.$dictionaryToolbar = $panel.find(".dictionaryToolbar");
            this.$addBtn = $panel.find(".addBtn");
            this.$uncheckBtn = $panel.find(".unCheckBtn");

            this.createGrid();
            this.createSaveDialog();
            this.events();
        },

        createGrid : function () {
            var me = this;
            this.dataGrid = new TreeGrid({
                url : 'api/sys/dictionary/tree',
                idField : 'id',
                labelField : 'key',
                $toolbar : this.$dictionaryToolbar,
                border : true,
                columns : [[
                    {field:'key',title:'键',width:300},
                    {field:'label',title:'名称',width:300},
                    {field:'value',title:'值',width:'25%'},
                    {field:'orderNum',title:'排序号',width:100},
                    {field:'操作',title:'操作', width:65, fixed:true, formatter : me.optionFormatter}
                ]]
            }, this.$dataGrid[0]);

            connect.connect(this.dataGrid, 'onIconButtonClick', this, this.onGridIconBtnClick);
        },

        createSaveDialog : function () {
            this.saveDialog = new FormDialog({
                title : '字典信息',
                href : 'script/core/sys/developer/html/dictionary-edit-form.html',
                width : 410,
                height : 260
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
            $.motor.Request.jsonPost('api/sys/dictionary/save', values, function(res) {
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
                $.motor.Request.del("api/sys/dictionary/delete/" + data.id, {}, function (res) {
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