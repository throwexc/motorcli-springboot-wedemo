define("easyui/widget/SearchCheckBoxDataGridDialog", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "easyui/widget/CheckBoxDataGridDialog",
    "easyui/widget/SearchBox"
], function (declare, connect, CheckBoxDataGridDialog, SearchBox) {

    return declare("easyui.widget.SearchCheckBoxDataGridDialog", [CheckBoxDataGridDialog], {

        content : '<div class="motor-data-dialog"><div class="dataGrid"></div><div class="motor-grid-toolbar text-left"><input class="searchBox" style="width:180px;"/></div></div>',

        searchName : 'search',

        toolbar : null,

        _params : {},

        createToolbar : function ($domNode) {
            var $toolbar = $domNode.find(".motor-grid-toolbar");

            this.$searchBox = $toolbar.find(".searchBox");
            this.searchBox = new SearchBox({
                name : this.searchName
            }, this.$searchBox[0]);

            connect.connect(this.searchBox, 'onSearch', this, this.search);

            return $toolbar;
        },

        setParams : function (params) {
            this._params = params;
        },

        reload : function (params) {
            this.inherited(arguments);
            this._params = params || {};
            this.searchBox.reset();
        },

        search : function (search, searchName) {
            var params = {};
            params[searchName] = search;
            $.extend(this._params, params);
            this.reload(this._params);
        }
    });
});