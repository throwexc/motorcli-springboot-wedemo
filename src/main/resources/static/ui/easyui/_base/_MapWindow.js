define("easyui/_base/_MapWindow", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dijit/registry",
    "easyui/widget/_base/_BaseWindow"
], function (declare, connect, array, registry, _BaseWindow) {

    return declare("easyui.patrol.SetPlan", [_BaseWindow], {

        $appendNode : $("#map").parent().parent(),
        $tabs : null,

        map : null,

        href : '',

        minimizable : false,
        maximizable : false,
        inline : true,
        cache : true,

        subscribeClose : true,

        width : 600,
        height : 350,

        left : 3,
        top : 30,

        _resetLocation : function () {
            if(!this.isLoaded) {
                return;
            }
            var $window = this.$domNode.parent(".window");
            var $parent = this.$appendNode;
            var top = $window.position().top;
            var left = $window.position().left;
            var width = $window.width();
            var height = $window.height();
            var maxWidth = $parent.width();
            var maxHeight = $parent.height();
            var isMove = false;

            if(top <= 0) {
                top = 1;
                isMove = true;
            } else if(top + height >= maxHeight) {
                top = maxHeight - height;
                isMove = true;
            }
            if(left <= 0) {
                left = 1;
                isMove = true;
            } else if(left + width >= maxWidth) {
                left = maxWidth - width - 10;
                isMove = true;
            }

            if(isMove) {
                setTimeout(function () {
                    var $windowShadow = $window.next(".window-shadow");
                    $window.animate({left: left + "px", top : top + "px"});
                    $windowShadow.animate({left: left + "px", top : top + "px"});
                }, 100);
            }
        },

        _appendTo : function () {
            this.$appendNode.append(this.$domNode);
        },

        _onDestroy : function () {
        },

        _onHide : function () {
            this.inherited(arguments);
            this.destroy();
        },

        _onCloseAllModule : function () {
            if(this.subscribeClose) {
                this.$domNode.dialog("close");
            }
        },

        buildRendering : function () {
            var declaredClass = this.declaredClass;
            var widgets = registry.findWidgets(this.$appendNode[0]);
            array.forEach(widgets, function (w) {
                if(w.declaredClass === declaredClass) {
                    w.destroy();
                }
            }, this);
            this.inherited(arguments);
            this.$tabs.tabs("select", 0);

            if(this.subscribeClose) {
                this._subscribe = connect.subscribe("close_all_module", this, this._onCloseAllModule);
            }
        },

        destroy : function () {
            if(this._subscribe) {
                connect.unsubscribe(this._subscribe);
            }
            this.inherited(arguments);
        }
    });
});