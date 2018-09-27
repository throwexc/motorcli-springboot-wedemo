define("easyui/widget/ComboGrid", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "easyui/widget/_base/_EasyUiDataWidget"
], function (declare, array, _EasyUiDataWidget) {

    return declare("easyui.widget.ComboGrid", [_EasyUiDataWidget], {

        title : null,

        baseClass : 'motor-combogrid',

        domStyle : '',

        templateString : '<select style="${domStyle}" name="${name}"></select>',

        url : '',
        method : 'GET',
        toolbar : null,
        columns : [],
        queryParams : {},
        pagination : false,
        panelWidth : null,
        idField:'id',
        textField:'name',

        isFirstLoad : true,

        singleSelect : true,
        selectOnCheck : false,
        border : false,

        pageSize : 10,
        pageList : [10,20,30,40,50],

        checkable : false,
        editable : false,
        firstFireLoad : true,

        width : 200,

        buildRendering : function() {
            var $srcNodeRef = $(this.srcNodeRef);
            if($srcNodeRef.attr("name")) {
                this.name = $srcNodeRef.attr("name");
            }
            if($srcNodeRef.attr("style")) {
                this.domStyle = $srcNodeRef.attr("style");
            }
            this.inherited(arguments);
            if($srcNodeRef.attr("disabled")) {
                $(this.domNode).find("input").attr("disabled", "disabled");
            }
        },

        _onLoadSuccess : function () {
            var data = this.$combogrid.combogrid("grid").datagrid("getData");
            if(this.checkable && data) {
                array.forEach(data.rows, function (row) {
                    if('checked' in row && row.checked === true) {
                        this.checkData(row);
                    }
                }, this);
            }
        },

        _onBeforeLoad : function (params) {
            if('page' in params && 'rows' in params) {
                var page = params.page;
                var rows = params.rows;
                params.page_num = page;
                params.page_size = rows;
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
                fit: false,
                url : this.url,
                method : this.method,
                columns: this.columns,
                queryParams : this.queryParams,
                title : this.title,
                pagination : this.pagination,
                loadMsg : '正在加载，请稍候...',
                singleSelect :  this.singleSelect,
                pageSize : this.pageSize,
                pageList : this.pageList,
                panelWidth : this.panelWidth,
                idField : this.idField,
                textField : this.textField,
                editable : this.editable,
                width : this.width,
                onBeforeLoad : function (params) {
                    if(!me.firstFireLoad && me.isFirstLoad) {
                        me.isFirstLoad = false;
                        return false;
                    }
                    me._onBeforeLoad(params);
                },
                onLoadSuccess : function() {
                    me._onLoadSuccess();
                    me.isFirstLoad = false;
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
                    me.onRowClick(data);
                },
                onClickCell : function (index, field, value) {
                    me.onClickCell(index, field, value);
                },
                onCheck : function (rowIndex, rowData) {
                    me.onCheck(true, rowData);
                },
                onUncheck : function (rowIndex, rowData) {
                    me.onCheck(false, rowData);
                }
            };
            if(this.$toolbar) {
                delete setting.toolbar;
                setting.toolbar = this.$toolbar;
            }
            return setting;
        },

        postCreate : function () {
            this.inherited(arguments);
            var me = this;
            this.$domNode = $(this.domNode);
            var $combogrid = this.$domNode;
            var setting = this._setupSetting();
            $combogrid.combogrid(setting);
            this.$combogrid = $combogrid;
            $combogrid.combo("panel").find(".pagination-info").remove();
        },

        getSelected : function () {
            return this.$combogrid.combogrid("grid").datagrid("getSelected");
        },

        getSelections : function () {
            return this.$combogrid.combogrid("grid").datagrid("getSelections");
        },

        getChecked : function () {
            return this.$combogrid.combogrid("grid").datagrid("getChecked");
        },

        getData : function () {
            return this.$combogrid.combogrid("grid").datagrid("getRows");
        },

        checkData : function (data) {
            var rowIndex = this.$combogrid.combogrid("grid").datagrid("getRowIndex", data);
            this.$combogrid.combogrid("grid").datagrid("checkRow", rowIndex);
        },

        reset : function () {
            this.$combogrid.combogrid("reset");
        },

        reload : function (params) {
            if(!params) {
                this.$combogrid.combogrid("grid").datagrid("reload");
            } else {
                this.$combogrid.combogrid("grid").datagrid("load", params);
            }
        },

        onRowClick : function (data) {

        },

        onClickCell : function (index, field, value) {

        },

        onBeforeLoad : function (params) {

        },

        onCheck : function (checked, data) {

        },

        destroy : function () {
            this.$combogrid.combogrid("destroy");
            this.inherited(arguments);
        }
    });
});