define("sys/setting/widget/SendMessageDialog", [
    "dojo/_base/declare",
    "dojo/_base/array",

    "easyui/widget/FormDialog",
    "easyui/widget/ComboSearchGrid"
], function (declare, array, FormDialog, ComboSearchGrid) {

    return declare("sys.setting.widget.SendMessageDialog", [FormDialog], {

        title : '消息内容',
        href : 'script/core/sys/setting/widget/send-message-dialog.html',
        $form : null,

        width : 400,
        height : 250,

        _initButtons : function () {
            var me = this;
            this.buttons = [{
                text : '发送消息',
                iconCls : 'icon-message',
                handler : function () {
                    if(me.validate()) {
                        me.onSave(me.getValues());
                    }
                }
            },{
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
            this.inherited(arguments);

            this.$personSelector = this.$form.find('input[name="sendUserId"]');

            new ComboSearchGrid({
                url : 'api/sys/user/search',
                searchName : 'keywords',
                columns :[[
                    {field:'name', title:'姓名',width:80},
                    {field:'unitName', title:'部门名称',width:150},
                    {field:'phone',title:'手机',width:120}
                ]],
                pagination : true,
                width : 280,
                required : true,
                panelWidth : 400,
                panelHeight : 350
            }, this.$personSelector[0]);
        }
    });
});