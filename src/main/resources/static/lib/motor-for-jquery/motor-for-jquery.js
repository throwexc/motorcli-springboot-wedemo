(function($){

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

    var motor = {
        formValueToJson : function(form) {
            var valueArray = form.serializeArray();
            var result = {};
            $.each(valueArray, function(index, field) {
                if(result[field.name]) {
                    if($.isArray(result[field.name])) {
                        result[field.name].push(field.value);
                    } else {
                        var temp = result[field.name];
                        result[field.name] = new Array();
                        result[field.name].push(temp);
                        result[field.name].push(field.value);
                    }
                } else {
                    result[field.name] = field.value;
                }
            });
            return result;
        },

        setFormDefaultValues : function ($form) {
            motor.resetForm($form);
            var startDate = moment().startOf("month").format("YYYY-MM-DD");
            var endDate = moment().endOf("month").format("YYYY-MM-DD");
            var values = motor.formValueToJson($form);
            $.extend(values, {
                start_time : startDate,
                end_time : endDate
            });
            motor.setFormValues($form, values);
            return motor.formValueToJson($form);
        }
    };

    motor.body = $('body');

    motor.waitIsShow = false;

    motor.apllyTo = function(srcObj, tagObj) {
        for(var key in srcObj) {
            tagObj[key] = srcObj[key]
        }
    };

    motor.wait = function (msg) {
        if(motor.waitIsShow === false) {
            motor.waitIsShow = true;
            $.messager.progress({
                text: msg
            });
        }
    };

    motor.showWait = function() {
        motor.wait('正在处理，请稍候...');
    };

    motor.hideWait = function() {
        if(motor.waitIsShow === true) {
            motor.waitIsShow = false;
            $.messager.progress('close');
        }
    };

    motor.confirm = function(/*title, */msg, callback, scope) {
        $.messager.confirm("系统提示", msg, function (r){
            if (r){
                callback.call(scope);
            }
        });
    };

    motor.msg = function(message, position, timeout, theme, icon, closable) {
        toastr.options.positionClass = 'toast-' + position;
        toastr.options.extendedTimeOut = 0; //1000;
        toastr.options.timeOut = timeout;
        toastr.options.closeButton = closable;
        toastr.options.iconClass = icon + ' toast-' + theme;
        toastr['custom'](message);
    };

    motor.successInfo = function(msg){
        motor.msg(msg, 'top-right', '5000', 'success', 'fa-check', true);
    };

    motor.dangerInfo = function(msg) {
        motor.msg(msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
    };

    motor.warningInfo = function(msg) {
        motor.msg(msg, 'top-right', '5000', 'warning', 'fa-warning', true);
    };

    motor.info = function (msg) {
        motor.msg(msg, 'top-right', '5000', 'info', 'fa-envelope', true);
    };

    function errorCallback(result, isShowWait, status) {
        if(isShowWait) {
            motor.hideWait();
        }
        if(!status) {
            if(result != "" && result != null){
                motor.dangerInfo(result.message || result.msg || result.info);
            }
            return;
        }
        if(status == 400) {
            motor.dangerInfo("无效的请求，请检查请求方式、参数等请求信息");
            return;
        }
        if(status == 404) {
            motor.dangerInfo("请求的地址没有找到");
            return;
        }
        if(status == 405) {
            motor.dangerInfo("请求方式错误，请检查请求方式");
            return;
        }
        if(status == 415) {
            motor.dangerInfo("请求参数方式有误");
            return;
        }
        motor.dangerInfo("未知状态码:" + status);
    };

    function successCallback(data, callback, scope, isShowWait, showInfo) {
        if(isShowWait) {
            motor.hideWait();
        }
        if(data.code > 0) {
            callback.call(scope, data);
            if(showInfo == null || showInfo == undefined) {
                showInfo = true;
            }
            if(showInfo) {
                var msg = data.msg || data.message || "操作成功";
                motor.successInfo(msg);
            }
        } else if(data.code == -1) {
            motor.hideWait();
            motor.dangerInfo("登录已超时，请重新登录");
        } else if((data.msg != null && data.msg != "") || (data.info != null && data.info != "")){
            motor.hideWait();
            motor.dangerInfo(data.msg || data.info);
        }
    };

    function ajax(type, url, data, callback, scope, isShowWait, showInfo) {
        isShowWait = isShowWait || false;
        if(isShowWait) {
            motor.showWait();
        }
        $.ajax({
            url: url,
            type: type,
            data: data,
            contentType:"application/x-www-form-urlencoded; charset=UTF-8",
            error: function (request, message, ex) {
                if(request.status == 200) {
                    successCallback(JSON.parse(request.responseText), callback, scope, isShowWait, showInfo);
                } else if(request.status == 500) {
                    errorCallback(request.responseJSON, isShowWait);
                } else {
                    errorCallback(request.responseJSON, isShowWait, request.status);
                }
            },
            success: function (data) {
                successCallback(data, callback, scope, isShowWait, showInfo);
            }
        });
    };

    function syncAjax(type, url, data, callback, scope, isShowWait, showInfo) {
        isShowWait = isShowWait || false;
        if(isShowWait) {
            motor.showWait();
        }
        $.ajax({
            url: url,
            type: type,
            data: data,
            async : false,
            contentType:"application/x-www-form-urlencoded; charset=UTF-8",
            error: function (request, message, ex) {
                if(request.status == 200) {
                    successCallback(JSON.parse(request.responseText), callback, scope, isShowWait, showInfo);
                } else if(request.status == 500) {
                    errorCallback(request.responseJSON, isShowWait);
                } else {
                    errorCallback(request.responseJSON, isShowWait, request.status);
                }
            },
            success: function (data) {
                successCallback(data, callback, scope, isShowWait, showInfo);
            }
        });
    };

    function jsonAjax(type, url, data, callback, scope, isShowWait, showInfo) {
        isShowWait = isShowWait || false;
        if(isShowWait) {
            motor.showWait();
        }
        $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(data),
            dataType:"json",
            contentType:"application/json; charset=UTF-8",
            error: function (request, message, ex) {
                if(request.status == 200) {
                    successCallback(JSON.parse(request.responseText), callback, scope, isShowWait, showInfo);
                } else if(request.status == 500) {
                    errorCallback(request.responseJSON, isShowWait);
                } else {
                    errorCallback(request.responseJSON, isShowWait, request.status);
                }
            },
            success: function (data) {
                successCallback(data, callback, scope, isShowWait, showInfo);
            }
        });
    };

    motor.Request = {
        get : function(url, data, callback, scope, isShowWait, showInfo) {
            data = data || {};
            data["_ct"] = new Date().getTime();
            ajax('GET', url, data, callback, scope, isShowWait, showInfo);
        },
        post : function(url, data, callback, scope, isShowWait, showInfo) {
            ajax('POST', url, data, callback, scope, isShowWait, showInfo);
        },
        put : function(url, data, callback, scope, isShowWait, showInfo) {
            ajax('PUT', url, data, callback, scope, isShowWait, showInfo);
        },
        del : function(url, data, callback, scope, isShowWait, showInfo) {
            ajax('DELETE', url, data, callback, scope, isShowWait, showInfo);
        },

        jsonPost : function(url, data, callback, scope, isShowWait, showInfo) {
            jsonAjax('POST', url, data, callback, scope, isShowWait, showInfo);
        },
        jsonPut : function(url, data, callback, scope, isShowWait, showInfo) {
            jsonAjax('PUT', url, data, callback, scope, isShowWait, showInfo);
        },
        jsonDel : function(url, data, callback, scope, isShowWait, showInfo) {
            jsonAjax('DELETE', url, data, callback, scope, isShowWait, showInfo);
        },

        syncGet : function(url, data, callback, scope, isShowWait, showInfo) {
            data = data || {};
            data["_ct"] = new Date().getTime();
            syncAjax('GET', url, data, callback, scope, isShowWait, showInfo);
        },
        syncPost : function(url, data, callback, scope, isShowWait, showInfo) {
            syncAjax('POST', url, data, callback, scope, isShowWait, showInfo);
        },
        syncPut : function(url, data, callback, scope, isShowWait, showInfo) {
            syncAjax('PUT', url, data, callback, scope, isShowWait, showInfo);
        },
        syncDel : function(url, data, callback, scope, isShowWait, showInfo) {
            syncAjax('DELETE', url, data, callback, scope, isShowWait, showInfo);
        }
    };

    motor.setFormValues = function($form, record, removeKeys) {
        if(removeKeys != null) {
            for(var key in record) {
                if(removeKeys instanceof Array) {
                    if(removeKeys.indexOf(key) >= 0 ) {
                        delete record[key];
                    }
                } else if(key === removeKeys) {
                    delete record[key];
                }

            }
        }
        if($form.form) {
            var values = {};
            for(var key in record) {
                values[key] = "";
            }
            $form.form("load", values);
            $form.form("load", record);
            return;
        }
        $form.find('input[type="radio"], input[type="checkbox"]').removeAttr("checked");
        for(var key in record) {
            $form.find('input[type="text"][name="' + key + '"], input[type="hidden"][name="' + key + '"], select[name="' + key + '"], textarea[name="' + key + '"], input[type="email"][name="' + key + '"]').val(record[key]);
            $form.find('input[type="radio"][name="' + key + '"]').each(function(i, radio) {
                var $radio = $(this);
                if($radio.val() == record[key]) {
                    $radio.attr("checked", "checked");
                    $radio.prop("checked", true);
                }
            });

            $form.find('input[type="checkbox"][name="' + key + '"]').each(function(i, radio) {
                var $checkbox = $(this);
                var checkValues = record[key];
                for(var i = 0;i < checkValues.length; i++){
                    if($checkbox.val() == checkValues[i]){
                        $checkbox.attr("checked", "checked");
                        $checkbox.prop("checked", true);
                    }
                }
            });
        }
    };

    motor.disabledForm = function($form, buttons) {
        $form.find('input[type!="button"]').attr("disabled", "disabled");
        $form.find('select').attr("disabled", "disabled");
        $form.find('textarea').attr("disabled","disabled");
        if(buttons) {
            $.each(buttons, function(i, b) {
                b.attr("disabled", "disabled");
            });
        }
    };

    motor.enableForm  = function ($form, buttons) {
        $form.find('input[type!="button"]').removeAttr("disabled", "disabled");
        $form.find('select').removeAttr("disabled", "disabled");
        $form.find('textarea').removeAttr("disabled","disabled");
        if(buttons) {
            $.each(buttons, function(i, b) {
                b.removeAttr("disabled", "disabled");
            });
        }
    };

    motor.resetForm = function ($form, record) {
        $form[0].reset();
        $form.find('input[type="text"]').val('');
        $form.find('textarea').val('');
        $form.find('input[type="hidden"]').val('');
        $form.find('input[type="email"]').val('');
        $form.find('input[type="radio"], input[type="checkbox"]').removeAttr("checked");
        $form.find('input[type="radio"]').each(function(i, r) {
            if(i == 0) {
                $(r).attr("checked", "checked");
                $(r).prop("checked", true);
            }
        });
        $form.find('input[type="checkbox"]').each(function(i, r) {
            if(i == 0) {
                $(r).attr("checked", "checked");
                $(r).prop("checked", true);
            }
        });
        if(record) {
            motor.setFormValues($form, record);
        }

        if($form.form) {
            $(".combobox-item").removeClass("combobox-item-selected");
            $form.form("reset");
        }

        if(record) {
            motor.setFormValues($form, record);
        } else {
            var values = motor.formValueToJson($form);
            motor.setFormValues($form, values);
        }
    };

    $.motor = motor;
})(jQuery);

/**
 * 修改chart
 */
$(function() {
    if(window.Highcharts != undefined) {
        Highcharts.setOptions({
            lang: {
                contextButtonTitle : "操作",
                printChart:"打印图表",
                downloadJPEG: "导出JPEG图片" ,
                downloadPDF: "导出PDF文档"  ,
                downloadPNG: "导出PNG图片"  ,
                downloadSVG: "导出SVG矢量图" ,
                exportButtonTitle: "导出图片",
                drillUpText : '返回'
            }
        });

        Highcharts.getOptions().exporting.buttons.contextButton.menuItems.splice(1,1);
    }
});

(function(jQuery){

    if(jQuery.browser) return;

    jQuery.browser = {};
    jQuery.browser.mozilla = false;
    jQuery.browser.webkit = false;
    jQuery.browser.opera = false;
    jQuery.browser.msie = false;

    var nAgt = navigator.userAgent;
    jQuery.browser.name = navigator.appName;
    jQuery.browser.fullVersion = ''+parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        jQuery.browser.opera = true;
        jQuery.browser.name = "Opera";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            jQuery.browser.fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        jQuery.browser.msie = true;
        jQuery.browser.name = "Microsoft Internet Explorer";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Chrome";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Safari";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            jQuery.browser.fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        jQuery.browser.mozilla = true;
        jQuery.browser.name = "Firefox";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
        (verOffset=nAgt.lastIndexOf('/')) )
    {
        jQuery.browser.name = nAgt.substring(nameOffset,verOffset);
        jQuery.browser.fullVersion = nAgt.substring(verOffset+1);
        if (jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()) {
            jQuery.browser.name = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=jQuery.browser.fullVersion.indexOf(";"))!=-1)
        jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);
    if ((ix=jQuery.browser.fullVersion.indexOf(" "))!=-1)
        jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);

    jQuery.browser.majorVersion = parseInt(''+jQuery.browser.fullVersion,10);
    if (isNaN(jQuery.browser.majorVersion)) {
        jQuery.browser.fullVersion = ''+parseFloat(navigator.appVersion);
        jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);
    }
    jQuery.browser.version = jQuery.browser.majorVersion;
})(jQuery);