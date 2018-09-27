define("easyui/widget/ModuleSelectDialog", [
    "dojo/_base/declare",
    "dojo/_base/array",

    "easyui/widget/_base/_BaseDialog",
    "easyui/widget/ModuleSelector"
], function (declare, array, _BaseDialog, ModuleSelector) {

    return declare("easyui.widget.ModuleSelectDialog", [_BaseDialog], {

        cache : true,
        modal : true,

        data : null,

        modules : null,

        width : 500,
        height : 300,

        href : 'script/core/common/widget/templates/ModuleSelectDialog.html',

        setData : function (data) {
            this.data = data;
        },

        onLoad :function () {
            var me = this;
            this.$moduleSelector = this.$domNode.find(".moduleSelector");


            this.moduleSelector = new ModuleSelector({
                modules : this.modules,
                onModuleClick : function (module) {
                    me.onModuleClick(module, me.data);
                }
            }, this.$moduleSelector[0]);
        },

        setModules : function (modules, checkLength) {
            if(!this.moduleSelector) {
                var me = this;
                var inter = setInterval(function () {
                    if(me.moduleSelector) {
                        try {
                            me.moduleSelector.setModules(modules);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            clearInterval(inter);
                        }
                    }
                }, 200);
            } else {
                this.moduleSelector.setModules(modules);
            }
        },

        onModuleClick : function (module, data) {

        }
    });
});
