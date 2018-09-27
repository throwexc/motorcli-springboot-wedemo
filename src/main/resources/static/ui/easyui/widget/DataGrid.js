define("easyui/widget/DataGrid", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "easyui/widget/_base/_EasyUiDataWidget"
], function (declare, array, _EasyUiDataWidget) {

    return declare("easyui.widget.DataGrid", [_EasyUiDataWidget], {

        $domNode : null,
        $toolbar : null,

        title : null,

        baseClass : 'motor-data-grid',

        templateString : '<div><div style="width: 100%;height: 100%;"></div></div>',

        url : '',
        method : 'GET',
        toolbar : null,
        columns : [],
        queryParams : {},
        pagination : true,
        rownumbers : true,

        _isFirstLoad : true,

        singleSelect : true,
        selectOnCheck : false,
        border : false,

        pageSize : 20,
        pageList : [20,50,100,200],

        fit : true,
        height : null,
        checkable : false,
        editable : false,
        firstFireLoad : true,
        showPageInfo : true,
        showPageList : true,
        showRefresh : true,
        showHeader : true,
        headerCls : "motor-datagrid-header",
        collapsible : false,
        style : null,
        rowStyler : function(index,row){
            if(index == 0 ||(index % 2 == 0)) {
                return "";
            } else {
                return " background-color: #eee;";
            }
        },

        view : null,
        onAfterRender : null,

        _editRowIndex : null,
        _editing : false,

        _iconClick : false,

        _bindIconButtonsEvents : function () {
            var me = this;
            this.$grid.data("datagrid").panel.find(".motor-data-grid-options .icon-btn").unbind("click");
            this.$grid.data("datagrid").panel.find(".motor-data-grid-options .icon-btn").click(function(e) {
                me._iconClick = true;
                var $this = $(this);
                var option = $this.data("option");
                var $tr = $this.parents("tr");
                var rowIndex = $tr.attr("datagrid-row-index");
                me.$grid.datagrid("unselectAll");
                var inter = setInterval(function () {
                    me.$grid.datagrid("selectRow", parseInt(rowIndex));
                    if($tr.hasClass("datagrid-row-selected")) {
                        var selected = me.$grid.datagrid("getSelected");
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

        _onLoadSuccess : function (data) {
            this._bindIconButtonsEvents();
            this.onLoadSuccess(data);

            var rows = this.$grid.datagrid("getRows");
            if(this.checkable === true && rows.length > 0) {
                array.forEach(rows, function (row) {
                    if('checked' in row && row.checked === true) {
                        this.checkData(row);
                    }
                }, this);
            }
        },

        _endEditing : function () {
            if(this._editRowIndex == null || this._editRowIndex == undefined) {
                return true;
            }
            if(this.$grid.datagrid("validateRow", this._editRowIndex)) {
                this.$grid.datagrid("endEdit", this._editRowIndex);
                this._bindIconButtonsEvents();
                this._editing = false;
                return true;
            } else {
                return false;
            }
        },

        _checkEditRow : function (index) {
            var me = this;
            if(!this._editing || index != this._editRowIndex) {
                if(this._endEditing()) {
                    this._editing = true;
                    this._editRowIndex = index;
                    this.$grid.datagrid('beginEdit', index);
                    var editors = this.$grid.datagrid("getEditors", index);
                    array.forEach(editors, function (editor) {
                        var editorObj = this.$grid.datagrid("getEditor", {index : index, field : editor.field});
                        var $target =  $(editorObj.target);
                        $target.bind("blur", function () {
                            setTimeout(function () {
                                if($("input.datagrid-editable-input:focus").length == 0) {
                                    me._endEditing();
                                }
                            }, 0);
                        });
                    }, this);
                }
            }
        },

        _onBeforeLoad : function (params) {
            if('page' in params && 'rows' in params) {
                var page = params.page;
                var rows = params.rows;
                params.pageNum = page;
                params.pageSize = rows;
                delete params.page;
                delete params.rows;
            }
            params._ct = new Date().getTime();
            this.onBeforeLoad(params);
        },

        _setupSetting : function () {
            var me = this;
            var setting = {
                border: this.border,
                toolbar : this.toolbar,
                fitColumns: true,
                fit: this.fit,
                height : this.height,
                url : this.url,
                method : this.method,
                columns: this.columns,
                cls: this.cls,
                queryParams : this.queryParams,
                title : this.title,
                pagination : this.pagination,
                loadMsg : '正在加载，请稍候...',
                singleSelect :  this.singleSelect,
                pageSize : this.pageSize,
                pageList : this.pageList,
                showPageList : false,
                rownumbers : this.rownumbers,
                headerCls : this.headerCls,
                showHeader : this.showHeader,
                collapsible : this.collapsible,
                rowStyler : this.rowStyler,
                view : this.view,
                onBeforeLoad : function (params) {
                    if(!me.firstFireLoad && me._isFirstLoad) {
                        me._isFirstLoad = false;
                        return false;
                    }
                    me._onBeforeLoad(params);
                },
                onLoadSuccess : function(data) {
                    me._onLoadSuccess(data);
                    me._isFirstLoad = false;
                },
                onLoadError : function (result) {
                    var status = result.status;
                    if(status == 500 && result.responseJSON) {
                        $.motor.dangerInfo(result.responseJSON.message || result.responseJSON.msg || result.responseJSON.info);
                        return;
                    }
                    if(status == 400) {
                        $.motor.dangerInfo("无效的请求，请检查请求方式、参数等请求信息");
                        return;
                    }
                    if(status == 404) {
                        $.motor.dangerInfo("请求的地址没有找到");
                        return;
                    }
                    $.motor.dangerInfo("未知状态码:" + status);
                },
                loadFilter : function(data) {
                    return me.loadFilter(data);
                },
                onClickRow : function (index,data) {
                    if(me.editable) {
                        me._checkEditRow(index);
                    }
                    if(!me._iconClick) {
                        me.onRowClick(data);
                    }
                },
                onClickCell : function (index, field, value) {
                    me.onClickCell(index, field, value);
                },
                onCheck : function (rowIndex, rowData) {
                    me.onCheck(true, rowData);
                },
                onUncheck : function (rowIndex, rowData) {
                    me.onCheck(false, rowData);
                },
                onCheckAll :function (rows) {
                    me.onCheckAll(true, rows);
                },
                onUncheckAll :function (rows) {
                    me.onCheckAll(false, rows);
                }
            };
            if(this.$toolbar) {
                delete setting.toolbar;
                setting.toolbar = this.$toolbar;
            }
            return setting;
        },

        postCreate : function () {
            var me = this;
            this.inherited(arguments);
            this.$domNode = $(this.domNode);
            this.$grid = this.$domNode.find("div");
            var setting = this._setupSetting();
            if(!setting.view) {
                delete setting.view;
            } else if(this.onAfterRender) {
                setting.view.onAfterRender = function (target) {
                    me.onAfterRender.call(me, target);
                };
            }
            if(this.height != null) {
                this.$domNode.css("height", this.height + 'px');
            }
            this.$grid.datagrid(setting);
            if(!this.showPageInfo) {
               var pager  =  this.$grid.datagrid("getPager");
               pager.pagination({
                   displayMsg : ''
               });
            }
            if(!this.showPageList) {
                var pager  =  this.$grid.datagrid("getPager");
                pager.pagination({
                    showPageList : false
                });
            }
            if(!this.showRefresh) {
                var pager  =  this.$grid.datagrid("getPager");
                pager.pagination({
                    showRefresh : false
                });
            }
            if(this.$domNode.parents(".panel-body")) {
                this.$domNode.parents(".panel-body").parents(".easyui-layout").layout("resize");
            }
        },

        getSelected : function () {
            return this.$grid.datagrid("getSelected");
        },

        getSelections : function () {
            return this.$grid.datagrid("getSelections");
        },

        getChecked : function () {
            return this.$grid.datagrid("getChecked");
        },

        getData : function () {
            return this.$grid.datagrid("getRows");
        },

        add : function (record) {
            this.$grid.datagrid("appendRow", record);
            this._bindIconButtonsEvents();
        },

        addRows : function (records) {
            array.forEach(records, function (record) {
                this.$grid.datagrid("appendRow", record);
            }, this);
            this._bindIconButtonsEvents();
        },

        update : function (record) {
            var selected = this.getSelected();
            var rowIndex = this.$grid.datagrid("getRowIndex", selected);
            this.$grid.datagrid("updateRow", {
                index: rowIndex,
                row : record
            });
            this._bindIconButtonsEvents();
        },

        deleteSelections : function () {
            var selections = this.getSelections();
            array.forEach(selections, function (selected) {
                var rowIndex = this.$grid.datagrid("getRowIndex", selected);
                this.$grid.datagrid("deleteRow", rowIndex);
            }, this);
        },

        deleteByData : function (data) {
            var rowIndex = this.$grid.datagrid("getRowIndex", data);
            this.$grid.datagrid("deleteRow", rowIndex);
        },

        deleteSelected : function () {
            var selected = this.getSelected();
            this.deleteByData(selected);
        },

        deleteAll : function () {
            var datas = this.getData();
            array.forEach(datas, function (data) {
                this.deleteByData(data);
            }, this);
        },

        checkData : function (data) {
            var rowIndex = this.$grid.datagrid("getRowIndex", data);
            this.$grid.datagrid("checkRow", rowIndex);
        },

        checkAll : function () {
            this.$grid.datagrid("checkAll");
        },

        reload : function (params) {
            if(!params) {
                this.$grid.datagrid("reload");
            } else {
                this.$grid.datagrid("load", params);
            }
        },

        uncheckAll : function () {
            this.$grid.datagrid("uncheckAll");
        },

        loadData : function (data) {
            this.$grid.datagrid("loadData", data);
        },

        setUrl : function (url) {
            this.url = url;
            this.$grid.datagrid({ url : url });
        },

        onIconButtonClick : function (option, data) {

        },

        onRowClick : function (data) {

        },

        onClickCell : function (index, field, value) {
            
        },

        onBeforeLoad : function (params) {
            
        },

        onCheck : function (checked, data) {

        },

        onCheckAll : function (checked, rows) {

        }
    });
});