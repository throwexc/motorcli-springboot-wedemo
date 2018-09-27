define("motor/init", [
"dojo/_base/lang",
"dojo/_base/kernel",
"dojo/json",
"dojo/data/ItemFileReadStore",
"dijit/layout/BorderContainer",
"dijit/layout/LinkPane"
], function(lang, kernel, json, ItemFileReadStore, BorderContainer, LinkPane) {

    // borderContainer分割线
    dijit.layout.BorderContainer.prototype.gutters = false;

    /**
     * 为store添加一个方法，以供用来提取所有的数据
     */
    dojo.data.ItemFileReadStore.prototype.getItems = function() {
        var items = new Array();
        this.fetch({
            onItem: function(item) {
                var values = {};
                for(var key in item) {
                    // 去掉dojo自动生成字段
                    if("_0" == key || "_RI" == key || "_S" == key || "_S_" == key || "_0_" == key) {
                        continue;
                    }
                    values[key] = item[key][0];
                }
                items.push(values);
            }
        });
        return items;
    };

    lang.urlAppend = function(url, string) {
        if(!lang.isEmpty(string)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }
        return url;
    };

    lang.isDate = function (it) {
        if(it instanceof Date) {
            return true;
        } else {
            return false;
        }
    };

    lang.isEmpty = function(it) {
        return (it === null) || (it === undefined) || (it === '') || (lang.isArray(it) && it.length === 0);
    };

    lang.isArray = function(it) {
        return it && (it instanceof Array || typeof it == "array" || it == []);
    };

    lang.isNumeric= function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    lang.hasInArray = function(str, array) {
        var flag = false;
        for(var i=0; i<array.length; i++) {
            if(str === array[i]) {
                flag = true;
                break;
            }
        }
        return flag;
    };

    lang.formateChildren = function(children) {
        var childrenArray = new Array();
        for(var i=0; i<children.length; i++) {
            childrenArray.push(lang.formatItem(children[i]));
        }
        return childrenArray;
    };

    lang.formatItem = function(item) {
        var result = {};
        for(var key in item) {
            if("_0" == key || "_RI" == key || "_S" == key || "_S_" == key || "_0_" == key || "_RRM" == key) {
                continue;
            }
            if(item[key]) {
                if(key != 'children' && lang.isArray(item[key])) {
                    result[key] = item[key][0];
                } else if(key == 'children') {
                    result[key] = lang.formateChildren(item[key]);
                } else {
                    result[key] = item[key];
                }
            }
        }

        return result;
    };

    lang.getFormValues = function(from) {
        var formParams = from.getValues();
        for(var key in formParams) {
            var value = formParams[key];
            if(value === null || value === undefined || value === '' || value.toString() === 'NaN') {
                delete formParams[key];
            } else {
                if(value instanceof Date) {
                    formParams[key] = value.format("yyyy-MM-dd");
                }
            }
        }
        return formParams;
    };

    lang.bind = function(fn, scope, args) {
        var method = fn;
        return function() {
            return method.apply(scope || null, args);
        };
    };

    lang.getDPI = function() {
        var arrDPI = new Array();
        if (window.screen.deviceXDPI != undefined) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        }
        else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
    };

    lang.NNum = function(num) {
        num = num + "";
        var aNew;
        var re = /([0-9]+.[0-9]{2})[0-9]*/;
        aNew = num.replace(re,"$1");
        return parseFloat(aNew);
    };

    lang.jsonToStr = function (json) {
        return kernel.toJson(json);
    };

    lang.strToJson = function (str) {
        return json.parse(str);
    };

    lang.insertArray  = function(array, index, obj) {
        array.splice(index, 0, obj);
    };

    lang.deleteArray = function(array, index) {
        array.splice(index, 1);
    };
});