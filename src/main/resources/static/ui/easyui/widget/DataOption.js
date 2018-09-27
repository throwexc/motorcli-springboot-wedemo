define("easyui/widget/DataOption", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_Container",

    "easyui/widget/DataGrid"
], function (declare, array, connect, _Widget, _TemplatedMixin, _Container, DataGrid) {

    return declare("easyui.widget.DataOption", [_Widget, _TemplatedMixin, _Container], {

        baseClass : 'motor-data-select-and-input',

        templateString : '<div data-dojo-attach-point="containerNode"></div>',

        loadUrl : null, //数据加载地址  可以为空
        columns : [[]], //数据字段

        border : true,
        title : '',
        pagination : false,

        _addOptionCol : function () {
            var me = this;
            this.columns[0].push({
                field:'操作',title:'操作', width:35, fixed:true, formatter : me._optionFormatter
            });
        },

        _createDataGrid : function () {
            this.dataGrid = new DataGrid({
                url : this.loadUrl,
                pagination : this.pagination,
                $toolbar : this.$toolbar,
                border : this.border,
                title : this.title,
                singleSelect : true,
                columns : this.columns
            }, this.$dataGrid[0]);

            connect.connect(this.dataGrid, 'onIconButtonClick', this, this.onGridIconBtnClick);
        },

        _optionFormatter : function () {
            return $.motor.formatterIconButtons([{
                name : '删除',
                option : 'delete',
                icon : 'icon-delete'
            }]);
        },

        buildRendering : function() {
            var me = this;
            this.inherited(arguments);
            this.$dataGrid = $('<div class="dataGrid"></div>');
            this.$toolbar = $('<div class="girdToolbar text-right"><a href="javascript:void(0);" class="addBtn">添加</a></div>');
            $(this.containerNode).append(this.$dataGrid);
            $(this.containerNode).append(this.$toolbar);
            this._addOptionCol();
            this.$toolbar.find(".addBtn").linkbutton({
                iconCls : 'icon-add',
                onClick : function () {
                    me.onAdd();
                }
            });
        },

        postCreate : function () {
            this.inherited(arguments);
            this._createDataGrid();
        },

        onGridIconBtnClick : function (option, data) {
            if(option == "delete") {
                this.onDelete(data);
            }
        },

        onAdd : function () {

        },

        onDelete : function (data) {

        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});