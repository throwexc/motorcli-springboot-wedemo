define("easyui/widget/ModuleSelector", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_Container"
], function (declare, array, connect,
             _Widget, _TemplatedMixin, _Container
) {

    var _Module = declare("easyui.widget.ModuleSelector._Module", [_Widget, _TemplatedMixin],  {

        baseClass : 'motor-data-module-selector-item',

        templateString : '<div data-dojo-attach-event="onclick:_onClick"><div class="module-icon ${icon}"></div><div class="text-item">${name}</div></div>',

        name : null,
        icon : null,
        data : null,
        check : false,

        _onClick : function (e) {
            this.onClick(this.data);
        },

        buildRendering : function () {
            if(this.check === true) {
                this.baseClass  += " check";
            }
            this.inherited(arguments);
        },

        onClick : function (data) {

        }
    });

    return declare("easyui.widget.ModuleSelector", [_Widget, _TemplatedMixin, _Container], {

        baseClass : 'motor-data-module-selector',

        templateString : '<div data-dojo-attach-point="containerNode"></div>',

        modules : null,

        _initModules : function (modules) {
            var me = this;
            array.forEach(modules, function (module, index) {
                var opt = {
                    name : module.name,
                    icon : module.icon,
                    data : module,
                    onClick : function (data) {
                        me.onModuleClick(data);
                    }
                };
                if("check" in module && module.check === true) {
                    opt.check = true;
                }
                var child = new _Module(opt);
                this.addChild(child);
            }, this);
        },

        buildRendering : function () {
            this.inherited(arguments);
            if(this.modules) {
                this._initModules(this.modules);
            }
        },

        setModules : function (modules) {
            this.removeAll();
            this.modules = modules;
            this._initModules(modules);
        },

        removeAll : function () {
            var children = this.getChildren();
            array.forEach(children, function (child) {
                this.removeChild(child);
                child.destroy();
            }, this);
        },

        onModuleClick : function (module) {

        }
    });
});