define("easyui/_base/_TabPane", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dijit/registry",
    "motor/_base/_Object"
], function (declare, array, lang, connect, registry, _Object) {

    function toQueryObjects(name, values, recursive) {
        var objects = [],
            i, ln;
        if(lang.isArray(values)) {
            for(i=0, ln=values.length; i<ln; i++) {
                if(recursive) {
                    objects = objects.concat(toQueryObjects(name + '[' + i + ']', values[i], true));
                } else {
                    objects.push({
                        name : name,
                        value : values[i]
                    });
                }
            }
        } else if(lang.isObject(values)) {
            for(i in values) {
                if(recursive) {
                    objects = objects.concat(toQueryObjects(name + '[' + i + ']', values[i], true));
                } else {
                    objects.push({
                        name : name,
                        value : values[i]
                    });
                }
            }
        } else {
            objects.push({
                name : name,
                value : values
            });
        }
        return objects;
    };

    function toQueryString(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;
        for(i in object) {
            if(object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;
            if (lang.isEmpty(value)) {
                value = '';
            } else if (lang.isDate(value)) {
                value = value.format("yyyy-MM-dd");
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(""  + value));
        }

        return params.join('&');
    };

    return declare("easyui._base._TabPane", [_Object], {

        $tabs : null,

        title : '',
        url : '',

        _childrenTabs : null,

        queryParams : null,

        init : function () {
            this._childrenTabs = {};
            this.inherited(arguments);
            this._initPrams();
            this.openTab();
        },

        _initPrams : function () {
            if(this.url && this.queryParams) {
                var params =  toQueryString(this.queryParams);
                this.url = lang.urlAppend(this.url, params);
            }
        },

        openTab : function () {
            $.motor.openTab(this.$tabs, this.title, this.url, this._onLoad, this);
        },

        closeTab : function () {
            this._close();
            this.onClose();
        },

        _onLoad : function (responseText, $panel, error) {
            if(error) {
                this.onLoadFinish();
                this._subscribeSysChange = connect.subscribe("close_all_module", this, this._close);
                return;
            }
            this.checkSession(responseText);
            this.onLoad($panel);
            this.onLoadFinish();
            this._subscribeSysChange = connect.subscribe("close_all_module", this, this._close);
        },

        _onChildClose : function (child) {
            var findChild = null;
            var findChildKey = null;
            for(var childKey in this._childrenTabs) {
                if(this._childrenTabs[childKey] == child) {
                    findChild = child;
                    findChildKey = childKey;
                    break;
                }
            }
            if(findChild) {
                delete this._childrenTabs[findChildKey];
            }
        },

        _close : function () {
            this.$tabs.tabs("close", this.title);
        },

        getChildrenModule : function () {
            return this._childrenModule || [];
        },

        onLoadFinish : function () {

        },

        onLoad : function ($panel) {

        },

        onClose : function () {

        },

        checkSession : function (responseText) {
            if(responseText.indexOf('{') == 0) {
                var res = lang.strToJson(responseText);
                if(res.code == -1) {
                    window.location = SYS_PATH;
                }
            }
        },

        _childModuleAddCallback : function (moduleConfig, child, data) {
            this._childrenTabs[moduleConfig.user_interface] = child;
            if(child.onOpenChild && lang.isFunction(child.onOpenChild)) {
                child.onOpenChild.call(child, data);
            }
        },

        getChildSetting : function (setting) {
            var me = this;
            setting = setting || {};
            $.extend(setting, {
                $tabs : me.$tabs,
                map : me.map,
                user_info : me.user_info,
                resource_type : 1
            });
            return setting;
        },

        addChildTab : function(moduleConfig, data) {
            var me = this;
            if(data == undefined || data == null) {
                data = null;
            }
            moduleConfig.parentModule = this;
            moduleConfig.resourceType = 1;
            connect.publish("open-module", [moduleConfig, data]);
        },

        removeChildTab : function(child) {
            var findChild = null;
            var findChildKey = null;
            for(var childKey in this._childrenTabs) {
                if(this._childrenTabs[childKey] == child) {
                    findChild = child;
                    findChildKey = childKey;
                    break;
                }
            }
            if(findChild) {
                findChild._close.call(findChild);
                delete this._childrenTabs[findChildKey];
            }
        },

        removeAllChildTab : function () {
            for(var key in this._childrenTabs) {
                var child = this._childrenTabs[key];
                child._close.call(child);
                delete this._childrenTabs[key];
            }
        },

        destroy : function ($panel) {
            var widgets = registry.findWidgets($panel[0]);
            array.forEach(widgets, function (w) {
                w.destroy();
            });
            if($panel) {
                var easyUiWidgets = $panel.find("*[class*='easyui-']");
                array.forEach(easyUiWidgets, function (widget) {
                    var $widget = $(widget);
                    var clzs = $widget.attr("class").split(" ");
                    var clz = null;
                    array.forEach(clzs, function (c) {
                        if(c.indexOf("easyui") != -1) {
                            clz = c;
                        }
                    }, this);

                    if(clz && clz != 'easyui-fluid') {
                        var widgetName = clz.substring(clz.indexOf("easyui-") + 7 , clz.length);
                        try {
                            $widget[widgetName]("destroy");
                        } catch (error) {
                            try {
                                if ($widget.data("widgetName")) {
                                    $widget.data("widgetName")("destroy");
                                }
                            } catch (error) {
                                console.log("destroy widget is fire error [" +error+ "]");
                                console.log("destroy widget clz [" + clz + "]");
                            }
                        }
                    }
                }, this);
            }
            if(this._subscribeSysChange) {
                connect.unsubscribe(this._subscribeSysChange);
            }

            for(var childKey in this._childrenTabs) {
                var _child = this._childrenTabs[childKey];
                _child._close.call(_child);
            }
            this.inherited(arguments);
        }
    });
});