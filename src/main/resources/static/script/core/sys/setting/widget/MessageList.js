define("sys/setting/widget/MessageList", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_Container"
], function (declare, array, connect, _Widget, _TemplatedMixin, _Container) {

    var _MessageItemNode = declare("sys.setting.widget._MessageItemNode", [_Widget, _TemplatedMixin], {
        baseClass : 'motor-message-item',

        templateString : '<div>' +
                            '<table>' +
                                '<tr>' +
                                    '<td><span class="label label-sm label-black">${title}</span></td>' +
                                    '<td style="width: 125px;text-align: right;color: #52a5ff;">${time}</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="motor-message-content"><span class="label label-sm label-black">${content}</span></td>' +
                                    '<td style="width: 125px;text-align: right;"><a href="javascript:void(0);" class="easyui-linkbutton readBtn">标记为已读</a></td>' +
                                '</tr>' +
                            '</table>' +
                         '</div>',

        title : null,
        content : null,
        msgId : null,
        time : null,

        buildRendering : function() {
            this.inherited(arguments);
            var me = this;
            var $domNode = $(this.domNode);
            $domNode.find(".readBtn").linkbutton({
                iconCls : 'icon-ok',
                onClick : function () {
                    me.readMsg.call(me);
                }
            });
        },

        readMsg : function () {
            $.motor.Request.post('api/sys/message/read/' + this.msgId, {}, function (res) {
                this.getParent().removeMsg(this);
            }, this, true, false);
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });

    return declare("sys.setting.widget.MessageList", [_Widget, _TemplatedMixin, _Container], {

        baseClass : 'motor-message-list',

        templateString : '<div data-dojo-attach-point="containerNode"></div>',

        messages : [],

        buildRendering : function() {
            this.inherited(arguments);
            this.setMessages(this.messages);

        },

        removeMsg : function (msg) {
            this.removeChild(msg);
            connect.publish("SysMsgRemove");
        },

        removeAll : function () {
            var children = this.getChildren();
            array.forEach(children, function (child) {
                this.removeChild(child);
            }, this);
        },

        setMessages : function (messages) {
            array.forEach(messages, function (msg) {
                var item = new _MessageItemNode({
                    title : msg.title,
                    content : msg.content,
                    msgId : msg.id,
                    time : msg.createTime
                });
                this.addChild(item);
            }, this);
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});