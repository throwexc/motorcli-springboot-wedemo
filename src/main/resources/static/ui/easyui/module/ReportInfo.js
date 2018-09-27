define("easyui/module/ReportInfo", [
    "dojo/_base/declare",

    "easyui/_base/_ChildTabPanel"
], function (declare, _ChildTabPanel
) {

    return declare("easyui.module.ReportInfo", [_ChildTabPanel], {

        url : 'common/report/info',

        queryParams : null,

        onLoad : function ($panel) {

            this.$closeBtn = $panel.find(".closeBtn");

            this.events();
        },

        events : function () {
            var me = this;

            this.$closeBtn.click(function () {
                me.closeTab();
            });
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});