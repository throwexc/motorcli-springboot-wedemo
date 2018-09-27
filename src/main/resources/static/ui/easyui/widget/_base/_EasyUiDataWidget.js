define("easyui/widget/_base/_EasyUiDataWidget", [
    "dojo/_base/declare",
    "easyui/widget/_base/_EasyUiWidget"
], function (declare, _EasyUiWidget) {

    return declare("easyui.widget._base._EasyUiDataWidget", [_EasyUiWidget], {

        /*********** 方法 ***********/

        loadFilter : function(data) {
            if('code' in data) {
                if(data.code >= 1) {
                    this.onLoadData(data);
                    if(data.items) {
                        if('total' in data || 'other' in data) {
                            var result = {
                                rows : data.items
                            };
                            if('total' in data) {
                                result.total = data.total;
                            }
                            if('other' in data) {
                                result.other = data.other;
                            }
                            return result;
                        } else {
                            return data.items;
                        }
                    } else {
                        return data;
                    }
                } else {
                    alert("出错了，需要修改");
                    return null;
                }
            } else {
                return data;
            }
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

        /*********** 事件 ***********/

        onLoadData : function (data) {

        },

        onLoadSuccess : function (data) {

        },

        onContextMenu : function (node) {

        }
    });
});