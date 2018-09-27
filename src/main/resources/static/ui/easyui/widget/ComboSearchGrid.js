define("easyui/widget/ComboSearchGrid", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",
    "easyui/widget/_base/_EasyUiDataWidget",
    "easyui/widget/SearchBox"
], function (declare, array, connect, _EasyUiDataWidget, SearchBox) {

    return declare("easyui.widget.ComboSearchGrid", [_EasyUiDataWidget], {

        title : null,

        baseClass : 'motor-combogrid',

        domStyle : '',

        templateString : '<select style="${domStyle};" name="${name}"></select>',

        url : '',
        method : 'GET',
        toolbar : null,
        columns : [],
        queryParams : {},
        pagination : false,
        panelWidth : 180,
        panelHeight : 200,
        idField:'id',
        textField:'name',
        searchName : 'search',

        width : 200,

        isFirstLoad : true,

        singleSelect : true,
        selectOnCheck : false,
        border : false,

        pageSize : 10,
        pageList : [10,20,30,40,50],

        checkable : false,
        editable : false,
        firstFireLoad : true,

        name : '',

        required : false,

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
            if(this.queryParams) {
                params = $.extend(params, this.queryParams);
            }
            params._ct = new Date().getTime();
            this.onBeforeLoad(params);
        },

        _onShowPanel : function () {
            this.searchBox.focus();
        },

        _setupSetting : function () {
            var me = this;
            var setting = {
                border: this.border,
                toolbar : this.toolbar,
                fitColumns: true,
                fit: true,
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
                panelHeight : this.panelHeight,
                idField : this.idField,
                textField : this.textField,
                editable : this.editable,
                width : this.width,
                required : this.required,
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
                },
                onChange : function (value) {
                    me.onChange(value);
                },
                onSelect : function (index, data) {
                    me.onSelected(data);
                },
                onShowPanel : function () {
                    me._onShowPanel();
                    me.onShowPanel();
                }
            };
            if(this.$toolbar) {
                delete setting.toolbar;
                setting.toolbar = this.$toolbar;
            }
            return setting;
        },

        _search : function (value, name) {
            var params = {};
            params[name] = value;
            if(this.queryParams) {
                params = $.extend(params, this.queryParams);
            }
            this.reload(params);
            this.searchBox.reset();
        },

        onSearch : function (value, name) {
            var params = {};
            params[name] = value;
            this.reload(params);
            this.searchBox.reset();
        },

        postCreate : function () {
            this.inherited(arguments);
            var me = this;
            this.$domNode = $(this.domNode);
            var $combogrid = this.$domNode;
            var setting = this._setupSetting();
            var $toolbar = $("<div class='combo-search-grid-toolbar'><div class='search-box'></div></div>");
            setting.toolbar = $toolbar;
            $combogrid.combogrid(setting);
            var $searchBox = $toolbar.find(".search-box");
            this.searchBox = new SearchBox({
                name : this.searchName,
                width : '100%'
            }, $searchBox[0]);
            this.$combogrid = $combogrid;
            $combogrid.combo("panel").find(".pagination-info").remove();

            connect.connect(this.searchBox, 'onSearch', this, this._search);

            this.$domNode.next(".combo").css({
                width : me.width
            }).removeClass("easyui-fluid").find(".textbox-text").css({
                width : me.width
            });
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

        getText : function () {
            this.$combogrid.combogrid("getText");
        },

        getValue : function () {
            this.$combogrid.combogrid("getValue");
        },

        onRowClick : function (data) {

        },

        onClickCell : function (index, field, value) {

        },

        onBeforeLoad : function (params) {

        },

        onCheck : function (checked, data) {

        },

        onChange : function (value) {

        },

        onSelected : function (data) {

        },

        onShowPanel : function () {

        },

        destroy : function () {
            this.$combogrid.combogrid("destroy");
            this.inherited(arguments);
        }
    });
});