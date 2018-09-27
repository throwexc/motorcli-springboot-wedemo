define("easyui/widget/TreeGrid", [
    "dojo/_base/declare",
    "easyui/widget/DataGrid"
], function (declare, DataGrid) {

    return declare("easyui.widget.TreeGrid", [DataGrid], {

        baseClass : 'motor-data-grid motor-tree-grid',

        idField : '',
        labelField : '',

        collapseAll : false,
        border:false,

        _bindIconButtonsEvents : function () {
            var me = this;
            this.$grid.data("treegrid").dc.view.find(".motor-data-grid-options .icon-btn").unbind("click");
            this.$grid.data("treegrid").dc.view.find(".motor-data-grid-options .icon-btn").click(function() {
                me._iconClick = true;
                var $this = $(this);
                var option = $this.data("option");
                var $tr = $this.parents("tr");
                var id = $tr.attr("node-id");
                me.$grid.treegrid("unselectAll");
                var inter = setInterval(function () {
                    me.$grid.treegrid("select", id);
                    if($tr.hasClass("datagrid-row-selected")) {
                        var selected = me.$grid.treegrid("getSelected");
                        try {
                            me.onIconButtonClick(option, selected);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            me._iconClick = false;
                            clearInterval(inter);
                        }
                    }
                }, 200);
            });
        },

        _onLoadSuccess : function () {
            var data = this.$grid.treegrid("getData");
            this._bindIconButtonsEvents();
            if(this.collapseAll === true) {
                this.collapseAllNodes();
            }
            this.onLoadSuccess(data);
        },

        _setupSetting : function () {
            var me = this;
            return {
                border: this.border,
                toolbar : this.$toolbar,
                fitColumns: true,
                fit: true,
                url : this.url,
                method : this.method,
                idField : this.idField,
                animate : true,
                treeField : this.labelField,
                columns: this.columns,
                queryParams : this.queryParams,
                title : this.title,
                loadMsg : '正在加载，请稍候...',

                onLoadSuccess : function() {
                    me._onLoadSuccess();
                    me.isFirstLoad = false;
                },
                loadFilter : function(data) {
                    return me.loadFilter(data);
                }
            };
        },

        getSelected : function () {
            var selected = this.$grid.treegrid("getSelected");
            return selected;
        },

        add : function (record, parentId) {
            this.$grid.treegrid("append", {
                parent : parentId,
                data : [record]
            });
            this._bindIconButtonsEvents();
        },

        update : function (record, recordId) {
            this.$grid.treegrid("update", {
                id : recordId,
                row : record
            });
            this._bindIconButtonsEvents();
        },

        deleteById : function (id) {
            this.$grid.treegrid("remove", id);
        },

        deleteSelected : function () {
            var selected = this.getSelected();
            this.deleteById(selected.id);
        },

        reload : function () {
            this.$grid.treegrid("reload");
        },

        collapseAllNodes : function () {
            this.$grid.treegrid("collapseAll");
        },

        expandAllNodes : function () {
            this.$grid.treegrid("expandAll");
        },

        unselectAll : function () {
            this.$grid.treegrid("unselectAll");
        },

        postCreate : function () {
            var me = this;
            this.$domNode = $(this.domNode);
            var $grid = this.$domNode.find("div");
            var setting = this._setupSetting();
            $grid.treegrid(setting);
            this.$grid = $grid;
        }
    });
});