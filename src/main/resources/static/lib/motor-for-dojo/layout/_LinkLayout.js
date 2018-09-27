define("motor/layout/_LinkLayout", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "motor/_base/_Object",

    "motor/utils/LayoutUtil"
], function (declare, lang, domAttr, _Object, LayoutUtil) {
    
    return declare("motor.layout._LinkLayout", [_Object], {

        //链接地址
        linkHref : '',

        isLink : true,

        //是否清除整个界面内容
        clear : false,

        //DOM
        target : null,
        targetId : null,
        
        init : function () {
            if(this.clear) {
                LayoutUtil.clearLayout();
            }
            if(lang.isString(this.target)) {
                this.targetId = this.target;
            } else {
                domAttr.set(this.target, "id", "motor_link_layout_id");
                this.targetId = "motor_link_layout_id";
            }

            var linkPane = null;
            if(this.isLink) {
                linkPane = LayoutUtil.addLinkPane({
                    href: this.linkHref,
                    callback: this.linkReady,
                    scope: this,
                    onClose: this.onClose
                }, this.targetId);
            } else {
                linkPane = LayoutUtil.addLinkPane({
                    content: '<div></div>',
                    callback: this.linkReady,
                    scope: this,
                    onClose: this.onClose
                }, this.targetId);
            }

            linkPane.startup();
            linkPane.resize();

            this._linkPane = linkPane;
        },

        onClose : function() {

        }
    });
});