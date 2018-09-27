define("easyui/widget/_base/_BaseWindow", [
    "dojo/_base/declare",
    "easyui/widget/_base/_BaseDialog"
], function (declare, _BaseDialog) {

    return declare("easyui.widget._base._BaseWindow", [_BaseDialog], {

        collapsible : true,
        minimizable : true,
        maximizable : true,
        modal : false,
        closed : false,

        buildRendering : function() {
            this.inherited(arguments);
        },

        postCreate : function () {
            this.inherited(arguments);
        }

    });
});