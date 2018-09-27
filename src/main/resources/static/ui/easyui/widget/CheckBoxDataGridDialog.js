define("easyui/widget/CheckBoxDataGridDialog", [
    "dojo/_base/declare",
    "dojo/_base/lang",

    "easyui/widget/_base/_BaseDialog",
    "easyui/widget/DataGrid"
], function (declare, lang, _BaseDialog, DataGrid) {

    return declare("easyui.widget.CheckBoxDataGridDialog", [_BaseDialog], {

        content : '<div class="motor-data-dialog"><div class="dataGrid"></div></div>',

        title : '数据列表窗口',

        modal : true,

        pagination : true,

        width : 500,
        height : 300,

        url : '',
        columns : [[]],
        toolbar : null,

        firstFireLoad : true,
        checkable : true,
        singleSelect : false,

        buildRendering : function() {
            var me = this;
            this.buttons = [{
                text : '完成',
                iconCls : 'icon-ok',
                handler : function () {
                    var selected = me.dataGrid.getChecked();
                    me.onFinish(selected);
                }
            },{
                text : '关闭',
                iconCls : 'icon-close',
                handler : function () {
                    me.hide();
                }
            }];
            this.inherited(arguments);
        },

        postCreate : function () {
            this.inherited(arguments);
            this.createGrid();
        },

        createGrid : function () {
            var $domNode = $(this.domNode);
            $domNode.css('padding', '0px');
            var $dataGrid = $domNode.find(".dataGrid");
            if(!this.toolbar) {
                this.toolbar = this.createToolbar($domNode);
            }

            var dataGrid = new DataGrid({
                url : this.url,
                singleSelect : this.singleSelect,
                columns : this.columns,
                pagination : this.pagination,
                toolbar : this.toolbar,
                checkable : this.checkable,
                firstFireLoad : this.firstFireLoad
            }, $dataGrid[0]);
            this.dataGrid = dataGrid;
        },

        createToolbar : function () {
            return null;
        },

        onFinish : function (selected) {

        },

        reload : function (params) {
            this.dataGrid.reload(params);
        },

        destroy : function () {
            this.columns = [[]];
            this.inherited(arguments);
        }
    });
});