define("easyui/widget/_base/_EasyUiWidget", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/registry"
], function (declare, array ,_Widget, _TemplatedMixin, registry) {

    return declare("easyui.widget._base._EasyUiWidget", [_Widget, _TemplatedMixin], {

        cls : null,

        _onDestroy : function () {

        },

        /*********** 组件渲染 ***********/
        buildRendering : function() {
            this.inherited(arguments);
            this.$domNode = $(this.domNode);
        },

        destroy : function () {
            this._onDestroy();
            var easyUiWidgets = this.$domNode.find("*[class*='easyui-']");
            array.forEach(easyUiWidgets, function (widget) {
                var $widget = $(widget);
                var clzs = $widget.attr("class").split(" ");
                var clz = null;
                array.forEach(clzs, function (c) {
                    if(c.indexOf("easyui") != -1) {
                        clz = c;
                    }
                }, this);

                if(clz && clz != 'easyui-fluid' && clz != 'easyui-linkbutton' && clz != 'easyui-layout') {
                    var widgetName = clz.substring(clz.indexOf("easyui-") + 7 , clz.length);
                    $widget[widgetName]("destroy");
                }
            }, this);
            var widgets = registry.findWidgets(this.domNode);
            array.forEach(widgets, function (w) {
                w.destroy();
            });
            this.inherited(arguments);
        }
    });
});