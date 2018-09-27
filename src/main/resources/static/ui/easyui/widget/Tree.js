define("easyui/widget/Tree", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "easyui/widget/_base/_EasyUiDataWidget"
], function (declare, array, _EasyUiDataWidget) {

    return declare("easyui.widget.Tree", [_EasyUiDataWidget], {

        url : '',
        method : 'GET',
        labelField : 'name',

        baseClass : 'motor-tree',
        templateString : '<div><ul></ul></div>',

        $contextMenu : null,

        checkbox : false,
        onlyLeafCheck : false,

        _params : null,

        _notFireCheckEvent : false,
        _fireEvent : true,

        data : null,
        expandAll : true,

        _setupSetting : function () {
            var me = this;
            var setting = {
                method : this.method,
                url : this.url,
                lines : true,
                data : this.data,
                onlyLeafCheck : this.onlyLeafCheck,
                loadFilter : function(data) {
                    return me.loadFilter(data);
                },
                onLoadSuccess : function (node, data) {
                    if(me.expandAll == true){
                        $(this).tree('expandAll');
                    }else {
                        $(this).tree('collapseAll');
                    }
                    me.onLoadSuccess(data);
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
                formatter : function(node){
                    return me.formatterNodeLabel(node[me.labelField]);
                },
                onContextMenu : function (e, node) {
                    e.preventDefault();
                    if(me.$contextMenu) {
                        me.onContextMenu(node);
                        me.$tree.tree('select', node.target);
                        me.$contextMenu.menu('show', {
                            left: e.pageX,
                            top: e.pageY
                        });
                    };
                },
                onBeforeLoad : function (node, params) {
                    $(this).html("正在加载，请稍候...");
                    if(me._params) {
                        $.extend(params, me._params);
                    }
                    params._ct = new Date().getTime();
                },
                onClick : function (node) {
                    me.onClick(node);
                }
            };
            if(this.checkbox) {
                setting.checkbox = this.checkbox;
                setting.cascadeCheck = false;
                setting.onCheck = function (node, checked, e) {
                    if(!me._notFireCheckEvent) {
                        me.checkNodes(node, checked);
                    }
                };
            }
            return setting;
        },

        postCreate : function () {
            this.inherited(arguments);
            var me = this;
            this.$domNode = $(this.domNode);
            var $tree = this.$domNode.find("ul");
            var setting = this._setupSetting();
            $tree.tree(setting);
            this.$tree = $tree;
        },

        getSelected : function () {
            return this.$tree.tree("getSelected");
        },

        add : function (record, appendToParent) {
            var selected = this.getSelected();
            if(appendToParent == null | appendToParent == undefined) {
                appendToParent = true;
            }
            var parent = null;
            if(appendToParent === true) {
                parent = selected ? selected.target : null;
            }
            this.$tree.tree("append", {
                parent : parent,
                data : [record]
            });
        },

        update : function (record) {
            var selected = this.getSelected();
            if (selected){
                var nodeData = {
                    target: selected.target
                };
                $.extend(nodeData, record);
                this.$tree.tree('update', nodeData);
            }
        },

        deleteSelected : function () {
            var selected = this.getSelected();
            this.$tree.tree("remove", selected.target);
        },

        getChecked : function () {
            return this.$tree.tree("getChecked", ['checked','indeterminate']);
        },

        formatterNodeLabel : function (label) {
            return label;
        },

        unselect : function () {
            this.$tree.tree("select", this.$tree.tree("getRoot"));
        },

        checkNodes : function (node, checked) {
            this._notFireCheckEvent = true;
            this.checkParents(node, checked);
            this.checkChildren(node, checked);
            this._notFireCheckEvent = false;
            if(this._fireEvent) {
                this.onCheck(node, checked);
            }
        },

        checkParents : function (node, checked) {
            var parent = this.$tree.tree("getParent", node.target);
            if(parent) {
                if(checked) {
                    if('checked' in parent && parent.checked === true) {
                        return;
                    }
                    this.$tree.tree("check", parent.target);
                } else {
                    var removeCheck = true;
                    var children = this.$tree.tree("getChildren", parent.target);
                    array.forEach(children, function (child) {
                        if("checked" in child && child.checked === true) {
                            removeCheck = false;
                            return;
                        }
                    },this);
                    if(removeCheck) {
                        this.$tree.tree("uncheck", parent.target);
                    }
                }
                this.checkParents(parent, checked);
            }
        },

        checkChildren : function (node, checked) {
            var children = this.$tree.tree("getChildren", node.target);
            if(children && children.length > 0) {
                var checkAll = true;
                if(checked === true) {
                    array.forEach(children, function (child) {
                        if('checked' in child && child.checked === checked) {
                            checkAll = false;
                        }
                        this.checkChildren(child);
                    }, this);
                }
                if(checkAll) {
                    array.forEach(children, function (child) {
                        if (checked) {
                            this.$tree.tree("check", child.target);
                        } else {
                            this.$tree.tree("uncheck", child.target);
                        }
                    }, this);
                }
            }
        },

        reload : function (params) {
            if(params) {
                this._params = params;
            }
            this.$tree.tree("reload");
        },

        onClick : function (data) {
            
        },

        onCheck : function () {

        },

        checkAll : function (fireEvent) {
            if(fireEvent === null || fireEvent === undefined) {
                fireEvent = true;
            }
            this._fireEvent = fireEvent;
            var roots = this.$tree.tree("getRoots");
            array.forEach(roots, function (root) {
                this.$tree.tree("check", root.target);
            },this);
            this._fireEvent = true;
        },

        getRoots: function () {
            return this.$tree.tree("getRoots");
        },

        loadData : function (data) {
            this.$tree.tree("loadData", data);
        }
    });
});