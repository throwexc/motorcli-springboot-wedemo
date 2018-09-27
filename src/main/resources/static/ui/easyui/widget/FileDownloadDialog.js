define("easyui/widget/FileDownloadDialog", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",

    "easyui/widget/_base/_BaseDialog",
    "easyui/widget/DataGrid"
], function (declare, array, connect, _BaseDialog, DataGrid) {

    return declare("easyui.widget.FileDownloadDialog", [_BaseDialog], {

        title : '文件下载',
        cache : true,
        modal : true,

        width : 600,
        height : 350,
        padding : 0,

        href : 'ui/easyui/widget/templates/FileDownloadDialog.html',

        url : null,

        icon : 'icon-save',

        saveBtnText : '完成',

        firstFireLoad : true,

        _initButtons : function () {
            var me = this;
            this.buttons = [{
                text : '关闭',
                iconCls : 'icon-close',
                handler : function () {
                    me.hide();
                }
            }];
        },

        buildRendering : function() {
            this.inherited(arguments);
        },

        onLoad : function () {
            this.$fileGrid = this.$domNode.find(".fileGrid");
            this.createFileGrid();
        },

        createFileGrid : function () {
            var me = this;
            this.fileGrid = new DataGrid({
                url : this.url,
                singleSelect : true,
                pagination : false,
                firstFireLoad : this.firstFireLoad,
                columns : [[
                    {field:'alias', align : 'center', title:'文件名称', width:100},
                    {field:'操作',title:'操作', width:35, fixed:true, formatter : function () {
                        return me.optionFileFormatter.call(me);
                    }}
                ]]
            }, this.$fileGrid[0]);

            connect.connect(this.fileGrid, 'onIconButtonClick', this, this.onFileGridIconBtnClick);
        },

        optionFileFormatter : function () {
            var buttons = [];
            buttons.push({
                name : "下载",
                option : 'download',
                icon : 'icon-download'
            });
            return $.motor.formatterIconButtons(buttons);
        },

        onFileGridIconBtnClick : function (option, data) {
            if(option == 'download') {
                this.downloadFile(data);
            } else if(option == 'delete') {
                this.delFile(data);
            }
        },

        downloadFile : function (data) {
            window.open(SYS_PATH + "/common/file/download/" + data.file_id);
        },

        reload : function (params) {
            this.fileGrid.reload(params);
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});