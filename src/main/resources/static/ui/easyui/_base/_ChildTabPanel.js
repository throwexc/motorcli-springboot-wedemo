define("easyui/_base/_ChildTabPanel", [
    "dojo/_base/declare",

    "easyui/_base/_TabPane"
], function (declare, _TabPane) {

    return declare("easyui._base._ChildTabPanel", [_TabPane], {

        _parentModule : null,

        _close : function () {
            this.$tabs.tabs("close", this.title);
            if(this._parentModule) {
                this._parentModule._onChildClose(this);
            }
        },

        getParent : function () {
            return this._parentModule;
        },

        onOpenChild : function (data) {
            
        }
    });
});