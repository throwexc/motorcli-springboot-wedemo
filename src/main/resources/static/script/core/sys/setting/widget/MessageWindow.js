define("sys/setting/widget/MessageWindow", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "easyui/widget/_base/_BaseDialog",
    "sys/setting/widget/MessageList",
    "sys/setting/widget/SendMessageDialog"
], function (declare, connect, _BaseDialog, MessageList, SendMessageDialog) {

    return declare("sys.setting.widget.MessageWindow", [_BaseDialog], {

        title : '系统消息',
        modal : true,
        cache : true,

        width : 600,
        height : 450,

        icon : 'icon-message',

        content : '<div><div class="messageBox"></div></div>',

        userInfo : null,
        messages : [],

        buildRendering : function() {
            var me = this;
            this.buttons = [{
                text : '发送消息',
                iconCls : 'icon-message',
                handler : function () {
                    me.sendMessage();
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

        onLoad : function () {
            var $messageBox = this.$domNode.find(".messageBox");

            this.messageList = new MessageList({
                messages : this.messages
            }, $messageBox[0]);

            this.sendMessageDialog = new SendMessageDialog();

            connect.connect(this.sendMessageDialog, 'onSave', this, this.onSendMessage);
        },

        sendMessage : function () {
            this.hide();
            this.sendMessageDialog.reset();
            this.sendMessageDialog.show();
        },

        onSendMessage : function (values) {
            $.extend(values, {
                userId : this.userInfo.id
            });
            $.motor.Request.post("api/sys/message/push", values, function (res) {
                this.sendMessageDialog.hide();
                this.show();
            }, this, true, true);
        },

        setMessages : function (messages) {
            if(this.messageList) {
                this.messageList.removeAll();
                this.messageList.setMessages(messages);
            }
        },

        events : function () {

        },

        destroy : function () {
            if(this.sendMessageDialog) {
                this.sendMessageDialog.destroy();
            }
            this.inherited(arguments);
        }
    });
});