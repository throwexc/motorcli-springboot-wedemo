define("motor/layout/_StackLayout", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/dom-style",
    "dojo/dom-attr",

    "motor/layout/_LinkLayout",
    "motor/utils/LayoutUtil"
], function (declare, array, domStyle, domAttr, _LinkLayout, LayoutUtil) {

    return declare("motor.layout._StackLayout", [_LinkLayout], {

        _panes : [],

        init : function () {
            this.inherited(arguments);
            this._panes.push(this._linkPane);
        },

        //创建栈容器内容
        creteStackPane:function(href,onLoadFunction){
            var prePane = this._panes[this._panes.length - 1];
            domStyle.set(prePane.domNode, "display", "none");
            var linkPane = LayoutUtil.addLinkPane({
                href : href,
                callback : function () {
                    onLoadFunction.call(this, linkPane);
                },
                scope : this
            });
            prePane.domNode.parentNode.appendChild(linkPane.domNode);
            this._panes.push(linkPane);
            linkPane.startup();
            linkPane.resize();
        },

        /**
         * 返回
         */
        stackBackup : function() {
            var currentPane = this._panes[this._panes.length - 1];
            if(!currentPane || this._panes.length == 1) {
                return;
            }
            this.deleteArray(this._panes, this._panes.length - 1);
            var parentNode = currentPane.domNode.parentNode;
            var removeNode = currentPane.domNode;
            currentPane.destroyDescendants(true);
            currentPane.destroy(true);
            parentNode.removeChild(removeNode);
            var showPane = this._panes[this._panes.length - 1];
            if (showPane) {
                domStyle.set(showPane.domNode, 'display', "block");
            }
        },

        onClose : function () {
            array.forEach(this._panes, function (pane, index) {
                if (pane.domNode) {
                    var parentNode = pane.domNode.parentNode;
                    var removeNode = pane.domNode;
                    pane.destroyDescendants(true);
                    pane.destroy(true);
                    if (domAttr.get(removeNode, "id") != this.targetId) {
                        parentNode.removeChild(removeNode);
                    }
                }
            }, this);
            this._panes = [];
        }
    });
});