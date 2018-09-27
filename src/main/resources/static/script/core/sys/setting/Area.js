define("sys/setting/Area", [
    "dojo/_base/declare",
    "dojo/_base/connect",

    "easyui/_base/_TabPane",
    "easyui/widget/SyncTreeGrid",
    "easyui/widget/FormDialog"
], function (declare, connect, _TabPane, SyncTreeGrid, FormDialog) {

    return declare("sys.setting.Area", [_TabPane], {

        url : 'script/sys/setting/html/area.html',

        onLoad : function ($panel) {
            this.$dataGrid = $panel.find(".dataGrid");
            this.$areaToolbar = $panel.find(".toolbar");
            this.$addBtn = $panel.find(".addBtn");
            this.$uncheckBtn = $panel.find(".unCheckBtn");

            this.createGrid();
            this.createSaveDialog();
            this.events();
        },

        createGrid : function () {
            var me = this;
            this.dataGrid = new SyncTreeGrid({
                url : 'api/sys/area/sync/tree',
                idField : 'id',
                labelField : 'name',
                $toolbar : this.$areaToolbar,
                border : true,
                columns : [[
                    {field:'name',title:'名称',width:300},
                    {field:'shortName',title:'短名称',width:300},
                    {field:'sort',title:'排序号',width:200},
                    {field:'adcode',title:'行政区划编码',width:200},
                    {field:'level',title:'级别',width:200},
                    {field:'操作',title:'操作', width:65, fixed:true, formatter : me.optionFormatter}
                ]]
            }, this.$dataGrid[0]);

            connect.connect(this.dataGrid, 'onIconButtonClick', this, this.onGridIconBtnClick);
        },

        createSaveDialog : function () {
            var me = this;
            this.saveDialog = new FormDialog({
                title : '行政区划',
                href : 'script/sys/setting/html/area-edit-form.html',
                width : 620,
                height : 220
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
            $.motor.Request.jsonPost('api/sys/area/save', values, function(res) {
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
                $.motor.Request.del("api/sys/area/delete/" + data.id, {}, function (res) {
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