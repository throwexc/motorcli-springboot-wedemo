define("easyui/widget/TreeAndGridDialog", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/connect",

    "easyui/widget/_base/_BaseDialog",
    "easyui/widget/DataGrid",
    "easyui/widget/Tree",
    "easyui/widget/SearchBox"
], function (declare, lang, connect, _BaseDialog, DataGrid, Tree, SearchBox) {

    return declare("easyui.widget.TreeAndGridDialog", [_BaseDialog], {

        content : '<div class="easyui-layout" data-options="fit:true,border:false">' +
                    '<div data-options="region:\'west\',collapsible:false,headerCls:\'noborder-left-top\'" title="树形信息" class="treeBox" style="width:220px;border-left: none;border-top: none;border-bottom: none;">' +
                        '<div class="dataTree"></div>' +
                    '</div>' +
                    '<div data-options="region:\'center\',headerCls:\'noborder-top-right\'" style="border-top: none;border-right: none;border-bottom: none;" title="表格信息" class="gridBox">' +
                    '<div class="dataGrid"></div></div>' +
                '</div>'+
                '<div class="toolbar text-left"><input class="searchBox" style="width:180px;"></div>',

        title : null,
        treeTitle : null,
        gridTitle : null,

        treeUrl : null,
        gridUrl : null,
        columns : [[]],

        modal : true,

        width : 800,
        height : 450,

        pagination : true,
        firstFireLoad : true,
        checkable : false,
        singleSelect : true,
        searchable : false,

        toolbar : null,

        treeCheckbox : false,

        method : 'POST',

        params : {},

        _validateSelected : function (selected) {
            return true;
        },

        _onFinish : function () {
            var selected = this.dataGrid.getChecked();
            if(this._validateSelected(selected)) {
                this.onFinish(selected);
            }
        },

        buildRendering : function() {
            var me = this;
            this.buttons = [{
                text : '完成',
                iconCls : 'icon-ok',
                handler : function () {
                    me._onFinish();
                }
            },{
                text : '关闭',
                iconCls : 'icon-close',
                handler : function () {
                    me.hide();
                }
            }];
            if(this.singleSelect == true) {
                if(this.columns && this.columns.length > 0 && this.columns[0] && this.columns[0].length > 0) {
                    if(this.columns[0][0].checkbox && this.columns[0][0].checkbox === true) {
                        lang.deleteArray(this.columns[0], 0);
                    }
                }
                this.checkable = false;
            }
            this.inherited(arguments);
        },

        postCreate : function () {
            this.inherited(arguments);
            var $domNode = $(this.domNode);
            this.$domNode = $domNode;
            $domNode.css('padding', '0px');

            if(this.treeTitle) {
                $domNode.find(".treeBox").panel("setTitle", this.treeTitle);
            }
            if(this.gridTitle) {
                $domNode.find(".gridBox").panel("setTitle", this.gridTitle);
            }
            if(!this.searchable) {
                $domNode.find(".toolbar").remove();
            }

            this.$dataTree = $domNode.find('.dataTree');
            this.$dataGrid = $domNode.find('.dataGrid');

            this.createTree();
            this.createGrid();


        },

        /**
         * 创建班组树形列表
         */
        createTree : function () {
            this.tree = new Tree({
                url : this.treeUrl,
                checkbox : this.treeCheckbox
            }, this.$dataTree[0]);

            if(this.treeCheckbox) {
                connect.connect(this.tree, 'onCheck', this, this.treeChecked);
            } else {
                connect.connect(this.tree, 'onClick', this, this.treeNodeClick);
            }

            connect.connect(this.tree, 'onLoadSuccess', this, this.onTreeLoad);
        },

        /**
         * 创建Grid
         */
        createGrid : function () {
            this.toolbar = this.createToolbar();

            this.dataGrid  = new DataGrid({
                url : this.gridUrl,
                singleSelect : this.singleSelect,
                firstFireLoad : this.firstFireLoad,
                columns : this.columns,
                pagination : this.pagination,
                toolbar : this.toolbar,
                checkable : this.checkable,
                method : this.method
            }, this.$dataGrid[0]);

            if(this.searchable) {
                this.searchBox = new SearchBox({}, this.toolbar.find(".searchBox")[0]);
                connect.connect(this.searchBox, 'onSearch', this, function (search, searchName) {
                    this.tree.unselect();
                    this.onSearch(search, searchName);
                });
            }

            connect.connect(this.dataGrid, 'onLoadSuccess', this, this.onGridLoad);
        },

        /**
         * 创建Grid Toolbar
         */
        createToolbar : function () {
            if(this.searchable) {
                return this.$domNode.find(".toolbar");
            } else {
                return null;
            }
        },

        /**
         * 树单击事件
         */
        treeNodeClick : function () {
            if(this.searchBox) {
                this.searchBox.reset();
            }
            this.onSearch();
        },

        treeChecked : function () {
            if(this.searchBox) {
                this.searchBox.reset();
            }
            this.onSearch();
        },

        /**
         * 重新加载
         * @param params 参数
         */
        reload : function (params) {
            this.params = params;
            if(this.searchBox) {
                this.searchBox.reset();
            }
            this.dataGrid.reload(params);
        },

        /**
         * 搜索
         * @param search 关键字值
         * @param searchName 关键字名称
         */
        onSearch : function (search, searchName) {

        },

        /**
         * 选择完成事件
         */
        onFinish : function (selected) {

        },

        onGridLoad :function (data) {

        },

        onTreeLoad : function (data) {

        },

        /**
         * 销毁
         */
        destroy : function () {
            this.inherited(arguments);
        }
    });
});