define("easyui/widget/CheckBoxTreeDialog", [
    "dojo/_base/declare",
    "dojo/_base/lang",

    "easyui/widget/_base/_BaseDialog",
    "easyui/widget/CheckBoxTree"
], function (declare, lang, _BaseDialog, CheckBoxTree) {

    return declare("easyui.widget.CheckBoxTreeDialog", [_BaseDialog], {

        content : '<div class="motor-data-dialog"><ul class="dataTree"></ul></div>',

        title : '多选树形窗口',

        modal : true,

        width : 500,
        height : 300,
        expandAll : true,

        url : '',

        buildRendering : function() {
            var me = this;
            this.buttons = [{
                text : '完成',
                iconCls : 'icon-ok',
                handler : function () {
                    var selections = me.getChecked();
                    me.onFinish(selections);
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
            this.createCheckBoxTree();
        },

        createCheckBoxTree : function () {
            var $domNode = $(this.domNode);
            $domNode.css('padding', '0px');
            var $dataTree = $domNode.find(".dataTree");

            this.tree = new CheckBoxTree({
                url : this.url,
                expandAll : this.expandAll
            }, $dataTree[0]);
        },

        onFinish : function (selections) {

        },

        getChecked : function () {
            return this.tree.getChecked();
        },

        reload : function (params) {
            this.tree.reload(params);
        }
    });
});