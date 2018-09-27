define("easyui/module/Report",[
    "dojo/_base/declare",
    "dojo/_base/connect",

    "easyui/_base/_TabPane",
    "easyui/widget/ModuleSelector"
],function (declare, connect, _TabPane, ModuleSelector) {

    return declare("easyui.module.Report",[_TabPane],{

        url : 'common/report',


        onLoad : function ($panel) {
            this.$moduleSelector = $panel.find(".moduleSelector");

            this.moduleSelector = new ModuleSelector({
                modules : this.getChildrenModule()
            }, this.$moduleSelector[0]);

            connect.connect(this.moduleSelector, 'onModuleClick', this, this.onModuleClick);
        },

        onModuleClick : function (module) {
            this.removeAllChildTab();
            this.addReportTab(module);
        },

        addReportTab : function(data){
            var moduleSetting = this.getChildSetting({
                user_interface : 'common/ReportInfo',
                name : data.name,
                queryParams : {
                    reportServerAddress : this.reportAddress,
                    reportUrl : data.user_interface
                }
            });
            this.addChildTab(moduleSetting, data);
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});