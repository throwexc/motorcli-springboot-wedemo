define("easyui/widget/TreeDialog", [
    "dojo/_base/declare",
    "dojo/_base/lang",

    "easyui/widget/_base/_BaseDialog",
    "easyui/widget/Tree"
], function (declare, lang, _BaseDialog, Tree) {

    return declare("easyui.widget.TreeDialog", [_BaseDialog], {

        content : '<div class="motor-data-dialog"><ul class="dataTree"></ul></div>',

        title : '树形数据窗口',

        modal : true,

        width : 500,
        height : 300,

        url : '',

        buildRendering : function() {
            var me = this;
            this.buttons = [{
                text : '完成',
                iconCls : 'icon-ok',
                handler : function () {
                    var selected = me.tree.getSelected();
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
            this.createTree();
        },

        createTree : function () {
            var $domNode = $(this.domNode);
            $domNode.css('padding', '0px');
            var $tree = $domNode.find(".dataTree");

            var tree = new Tree({
                url : this.url
            }, $tree[0]);
            this.tree = tree;
        },

        reload : function () {
            this.tree.reload();
        },

        onFinish : function (selected) {

        }
    });
});