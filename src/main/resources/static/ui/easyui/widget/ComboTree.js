define("easyui/widget/ComboTree", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "easyui/widget/_base/_EasyUiDataWidget"
], function (declare, array, lang, _EasyUiDataWidget) {

    return declare("easyui.widget.ComboTree", [_EasyUiDataWidget], {

        url : '',
        method : 'GET',
        idField:'id',
        labelField : 'name',

        panelWidth : null,

        name : '',

        domStyle : 'width:200px;',

        baseClass : 'motor-combotree',

        templateString : '<input style="${domStyle}" name="${name}" />',

        checkbox : false,
        editable : false,
        required : false,
        disabled : false,

        _params : null,

        _notFireCheckEvent : false,

        _eventFireTimeout : null,

        _fireEvent : true,

        clearValues : null,


        _onChange : function (value) {
            if(this.clearValues) {
                var me = this;
                if(lang.isArray(this.clearValues) && lang.isArray(value)) {
                    var array = new Array();
                    for(var i=0; i<value.length; i++) {
                        var v = value[i];
                        var bool = true;
                        for(var j=0; j<this.clearValues.length; j++) {
                            var clearValue = this.clearValues[j];
                            if(clearValue == v) {
                                bool = false;
                            }
                        }
                        if(bool) {
                            array.push(v);
                        }
                    }
                    this.$combotree.combotree("setValues", array);
                } else {
                    this.$combotree.combotree("setValue", "");
                }
            }
        },

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

        _setupSetting : function () {
            var me = this;
            var setting = {
                method : this.method,
                url : this.url,
                lines : true,
                editable : this.editable,
                panelWidth : this.panelWidth,
                checkAll : this.checkAll,
                required : this.required,
                disabled : this.disabled,
                loadFilter : function(data) {
                    return me.loadFilter(data);
                },
                onLoadSuccess : function (node, data) {
                    me.onLoadSuccess(data);
                },
                onLoadError : function (result) {
                    me.onLoadError(result);
                },
                formatter : function(node){
                    me.onFormatter(node);
                    node.text = node[me.labelField];
                    node.id = node[me.idField];
                    return node[me.labelField];
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
                },
                onChange : function (value) {
                    if(me._eventFireTimeout) {
                        clearTimeout(me._eventFireTimeout);
                    }
                    me._eventFireTimeout = setTimeout(function () {
                        me._onChange(value);
                        me.onChange(value);
                        me._eventFireTimeout = null;
                    }, 100);
                },
                onBeforeSelect : function (node) {
                    me.onBeforeSelect(node);
                },
                onBeforeCheck : function (node, checked) {
                    if(checked === true) {
                        me.onBeforeSelect(node);
                    }
                },
                getValue : function (value) {
                    me.getValue(value);
                }
            };
            if(this.checkbox) {
                setting.checkbox = this.checkbox;
                setting.multiple = this.checkbox;
                setting.cascadeCheck = false;
                setting.onCheck = function (node, checked, e) {
                    if(!me._notFireCheckEvent) {
                        me.checkNodes(node, checked);
                    }
                };
            }
            return setting;
        },

        checkAll : function (fireEvent) {
            var tree = this.$combotree.combotree("tree");
            if(fireEvent === null || fireEvent === undefined) {
                fireEvent = true;
            }
            this._fireEvent = fireEvent;
            var roots = tree.tree("getRoots");
            array.forEach(roots, function (root) {
                tree.tree("check", root.target);
            },this);
            this._fireEvent = true;
        },

        checkNodes : function (node, checked) {
            this._notFireCheckEvent = true;
            this.checkParents(node, checked);
            this.checkChildren(node, checked);
            this._notFireCheckEvent = false;
            if(this._fireEvent) {
                this.onCheck();
            }
        },

        checkParents : function (node, checked) {
            var tree = this.$combotree.combotree("tree");
            var parent = tree.tree("getParent", node.target);
            if(parent) {
                if(checked) {
                    if('checked' in parent && parent.checked === true) {
                        return;
                    }
                    tree.tree("check", parent.target);
                } else {
                    var removeCheck = true;
                    var children = tree.tree("getChildren", parent.target);
                    array.forEach(children, function (child) {
                        if("checked" in child && child.checked === true) {
                            removeCheck = false;
                            return;
                        }
                    },this);
                    if(removeCheck) {
                        tree.tree("uncheck", parent.target);
                    }
                }
                this.checkParents(parent, checked);
            }
        },

        checkChildren : function (node, checked) {
            var tree = this.$combotree.combotree("tree");
            var children = tree.tree("getChildren", node.target);
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
                            tree.tree("check", child.target);
                        } else {
                            tree.tree("uncheck", child.target);
                        }
                    }, this);
                }
            }
        },

        reset : function () {
            this.$combotree.combotree("reset");
        },

        getChecked : function () {
            var checked = this.$combotree.combotree("tree").tree("getChecked");
            return checked;
        },

        postCreate : function () {
            this.inherited(arguments);
            var me = this;
            this.$domNode = $(this.domNode);
            var $combotree = this.$domNode;
            var setting = this._setupSetting();
            $combotree.combotree(setting);
            this.$combotree = $combotree;
        },

        onFormatter : function (data) {

        },

        onClick : function (data) {

        },

        onCheck : function () {

        },

        onBeforeSelect : function (node) {
            return true;
        },

        onChange : function (value) {
        },

        getValue : function (value) {
            return value;
        },

        destroy : function () {
            this.$combotree.combotree("destroy");
            this.inherited(arguments);
        }
    });
});