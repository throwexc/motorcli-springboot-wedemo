define("motor/widget/GridSelector",[
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/query",
    "motor/widget/Select",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dojox/grid/DataGrid",
    "dojo/data/ItemFileReadStore",
    "motor/data/Request"
], function(declare, connect, dom, domStyle, query, Select, BorderContainer, ContentPane, TextBox, Button, DataGrid, ItemFileReadStore, Request) {

    var selector = declare("motor.widget.GridSelector", [Select], {

        url : '',

        fields : [],

        placeHolder : '',

        initTop : function () {
            var topPane = new BorderContainer({
                region:'top',
                style:{background: '#ffffff', height: '35px'}
            });

            this.dropDown.addChild(topPane);
            this.text = new TextBox({region: 'center', placeHolder: this.placeHolder});
            this.searchBtn = new Button({label: '搜 索', region: 'right'});

            topPane.addChild(this.text);
            topPane.addChild(this.searchBtn);

            topPane.startup();

            connect.connect(this.searchBtn, 'onClick', this, this.search);
        },

        initCenter : function () {
            this.grid = new DataGrid({
                structure : this.fields,
                store : new ItemFileReadStore({data: {items: []}}),
                selectionMode: 'single',
                rowHeight : 24,
                region : 'center'
            });
            this.dropDown.addChild(this.grid);
            this.grid.startup();

            connect.connect(this.grid, 'onRowDblClick', this, this.onRowSelected);
        },

        initContent : function() {
            this.initTop();
            this.initCenter();
        },

        onRowSelected : function (e) {
            var item = this.grid.getItem(e.rowIndex);
            var label = this.grid.store.getLabel(item);
            var value = this.grid.store.getIdentity(item);
            this._setValueAttr(value, label);
            this.onSelectRecord(item);
        },

        _setValueAttr : function(value, label){
            this.inherited(arguments);
            if(!value || value == '') {
                this._setDisplay('');
                return;
            }
            this._set('value', value);
            this._setDisplay(label);
            this.closeDropDown();
        },

        search : function () {
            var searchText =  this.text.get('value');

            this.grid.updateRowCount(0);
            this.grid.showMessage(this.grid.loadingMessage);

            var url = this.url + "?search=" + searchText;

            Request.get(url, {}, function (res) {
                var store = new ItemFileReadStore({data: res});
                this.grid.setStore(store);
                var gridContentDom = query(".dojoxGridContent", this.grid.domNode);
                $(gridContentDom).css("height", '100%');
            }, this);
        },

        onSelectRecord: function(item) {

        },

        reset : function() {
            this.set('value', '');
        }
    });

    return selector;
});