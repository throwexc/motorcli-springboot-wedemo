(function($){

    /******************
     使用说明：校验的使用说明
     校验位置添加属性,validType = "isLongitude"
     有参数的可用中括号,validType="maxLength[200]"
     1、isLongitude   ：   经度校验
     2、isLatitude    ：   纬度校验
     3、maxLength     :    最长校验
     4、CHS           :    汉字校验
     5、postcord      :    邮政编码校验
     6、QQ            ：   qq校验
     7、mobile        ：   手机电话校验
     8、loginName     ：   登录名校验
     9、number        :   数字校验
     10、idcard       ：   身份证号码验证
     11、equalTo      ：   两次数据是否相同校验 equalTo["#另一input的id"]
     12、isExist      :   校验字段数据库是否存在，需要穿两个参数：url和传到后台的参数的Name，后台返回true为存在，false为不存在。例子： validType="isExist['../Datas/StationPointHandler.ashx?action=validateIfExistStationCode','stationCode']"
     13、phone        :    固定电话
     14、fax          :    传真
     15、mail         :    邮件
     16、date         :    日期：yyyy-MM-dd
     17、datetime     :    日期：yyyy-MM-dd hh:mm:ss
     //*****************/
//常用校验
    var validateMessager = "";
    $.extend($.fn.validatebox.defaults.rules, {
//	datetime : {
//		validator: function (value, param) {
//           var pattern = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29) (20|21|22|23|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])$))/;
//            if (!pattern.test(value)) {
//                return false;
//            }
//            else if ((value < 0) || (value > 90)) {
//                return false;
//            }
//            else {
//                return true;
//            }
//            return true;
//        },
//        message: "您输入的日期不正确, 格式为：yyyy-MM-dd hh:mm:ss"
//	},
        date :  {
            validator: function (value, param) {
                var pattern = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;
                if (!pattern.test(value)) {
                    return false;
                }
                else if ((value < 0) || (value > 90)) {
                    return false;
                }
                else {
                    return true;
                }
                return true;
            },
            message: "您输入的日期不正确, 格式为：yyyy-MM-dd"
        },
        maxLength: {
            validator: function (value, param) {
                return value.length <= param[0];
            },
            message: "最多输入{0}个字符"
        },
        minLength: {
            validator: function (value, param) {
                return value.length >= param[0];
            },
            message: '请输入最少{0}个字符'
        },
        rangeLength:{
            validator: function (value, param) {
                return value.length >= param[0] && value.length <= param[1];
            },
            message: '请输入{0}到{2}个字符'
        },
        isLongitude: {
            validator: function (value, param) {
                var pattern = /^[-\+]?\d+(\.\d+)?$/;
                if (!pattern.test(value)) {
                    return false;
                }
                else if ((value < 0) || (value > 180)) {
                    return false;
                }
                else {
                    return true;
                }
                return true;
            },
            message: "经度值应为0-180之间的小数！"
        },
        isLatitude: {
            validator: function (value, param) {
                var pattern = /^[-\+]?\d+(\.\d+)?$/;
                if (!pattern.test(value)) {
                    return false;
                }
                else if ((value < 0) || (value > 90)) {
                    return false;
                }
                else {
                    return true;
                }
                return true;
            },
            message: "纬度值应为0-90之间的小数！"
        },
        chinese: {
            validator: function (value, param) {
                return /^[\u0391-\uFFE5]+$/.test(value);
            },
            message: '请输入汉字'
        },
        postcord: {
            validator: function (value, param) {
                return /^[0-9]\d{5}$/.test(value);
            },
            message: '邮政编码不正确'
        },
        QQ: {
            validator: function (value, param) {
                return /^[1-9]\d{4,10}$/.test(value);
            },
            message: 'QQ号码不正确'
        },
        mobile: {
            validator: function (value, param) {
                if (value.length != 11) {
                    return false;
                } else {
//              return /^(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/.test(value);
                    return /^(13[0-9]||15[^4,\\d]||17[^4,\\d]||18[^4,\\d])\d{8}$/.test(value);
                }
            },
            message: '请输入正确的11位手机号码'
        },
        loginName: {
            validator: function (value, param) {
                return /^[\u0391-\uFFE5\w]+$/.test(value);
            },
            message: '登录名称只允许汉字、英文字母、数字及下划线。'
        },
        number: {
            validator: function (value, param) {
                return /^\d+$/.test(value)&&(value.length <= param[0]);
            },
            message: '请输入正确范围内的数字(最多{0}位)'
        },
        double: {
            validator: function (value, param) {
                return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value) || value==0;
            },
            message: '请输入数字或小数'
        },
        idcard: {
            validator: function (value, param) {
                return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
                    .test(value);
            },
            message: '请输入正确的身份证号码'
        },
        equalTo: {
            validator: function (value, param) {
                return value == $(param[0]).val();
            },
            message: '两次输入的字符不一至'
        },
        isExistDiy: {
            validator: function (value, param) {
                var result = true;
                $.ajax({
                    url: param[0].replace(/^@value$/, value),
                    async: false,
                    data: ajaxData,
                    cache: false,
                    success: function (data) {
                        result = !data=="true";
                    }, error: function () {
                        $.mapuni.tips('编号校验服务请求失败！请联系管理员！');
                    }
                });
                return result;
            },
            message: '已存在相同数据,请重新输入'
        },
        phone: {
            validator: function (value, param) {
                return /\d{3}-\d{8}$|\d{4}-\d{7}$|\d{3}-\d{7}$|\d{4}-\d{8}$/.test(value);
            },
            message: '请输入正确的固定电话号码010-7789509'
        },
        fax: {
            validator: function (value, param) {
                return /^[+]{0,1}(\d){1,4}[ ]?([-]?((\d)|[ ]){1,12})+$/.test(value);
            },
            message: '请输入正确的传真号码'
        },
        mail: {
            validator: function (value, param) {

                return /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i.test(value);
            },
            message: '请输入正确的邮件号码'
        },
        ip: {
            validator: function (value, param) {
                return /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test(value);
            },
            message: '请输入正确的IP地址'
        },
        port: {
            validator: function (value, param) {
                return /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value);
            },
            message: '请输入正确的端口号！ 0到65535的整数'
        },
        phoneOrMobile: {
            validator: function (value, param) {
                return /(^(13[0-9]||15[^4,\\d]||17[^4,\\d]||18[^4,\\d])\d{8}$)|(\d{3}-\d{8}$|\d{4}-\d{7}$|\d{3}-\d{7}$|\d{4}-\d{8}$)/.test(value);
            },
            message: '请输入正确的手机号或者座机号'
        },
        YearDay: {
            validator: function (value, param) {
                return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value)&&(value<365||value==365);
            },
            message: '请输入不大于365的数字或小数'
        },
        DayHour: {
            validator: function (value, param) {
                return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value) &&(value < 24||value==24);
            },
            message: '请输入不大于24的数字或小数'
        }

    });
//添加两个校验的方法：移除校验remove和恢复校验reduce
$.extend($.fn.validatebox.methods, {
    remove: function (jq, newposition) {
        return jq.each(function () {
            $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus.validatebox').unbind('blur.validatebox');
        });
    },
    reduce: function (jq, newposition) {
        return jq.each(function () {
            var opt = $(this).data().validatebox.options;
            $(this).addClass("validatebox-text").validatebox(opt);
        });
    }
});

//扩展表单加载数据方法，增加等待图片
//$("#dg").datagrid("loadData",{url:'loadUrl',queryData:{id:123},success:func,error:func});
$.extend($.fn.form.methods, {
    loadData: function (_thisForm, dataConfig) {
        $.ajax({
            url: dataConfig.url,
            cache: false,
            data: dataConfig.queryData,
            type: 'POST',
            dataType: 'json',
            beforeSend: function () {
                //$("<div id=\"_loading_\" style=\"display:none;width:150px;height:25px;border:1px solid #000;background-color:#ffc;position:absolute;top:40%;left:50%;margin-left:-75px;text-align:center;line-height:25px;font-size:12px;font-weight:bold;color:Blue; \">数据加载中...</div>").appendTo($("body")).fadeIn();
                var _body = $("body");
                $("<div id=\"_load_mask_\" class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_body);
                var msg = $("<div id=\"_load_msg_\" class=\"datagrid-mask-msg\" style=\"display:none;left:50%;top:40%;font-size: 12px;\"></div>").html("数据加载中...").appendTo(_body);
                msg.css("marginLeft", -msg.outerWidth() / 2).show();
            },
            success: function (data) {
                $("#_load_msg_,#_load_mask_").fadeOut();
                _thisForm.form('load', data);
                if (dataConfig.success)
                    dataConfig.success(data);
            },
            error: function (data) {
                $("#_load_msg_").html("数据加载失败！");
                $("#_load_msg_,#_load_mask_").fadeOut(3000);
                if (dataConfig.error)
                    dataConfig.error(data);
            }
        });
    }
});

/**
 * 1）扩展jquery easyui tree的节点检索方法。使用方法如下：
 * $("#treeId").tree("search", searchText);
 * 其中，treeId为easyui tree的根UL元素的ID，searchText为检索的文本。
 * 如果searchText为空或""，将恢复展示所有节点为正常状态
 */
(function ($) {

    $.extend($.fn.tree.methods, {
        /**
         * 扩展easyui tree的搜索方法
         * @param tree easyui tree的根DOM节点(UL节点)的jQuery对象
         * @param searchText 检索的文本
         * @param this-context easyui tree的tree对象
         */
        search: function (jqTree, searchText) {
            //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
            var tree = this;

            //获取所有的树节点
            var nodeList = getAllNodes(jqTree, tree);

            //如果没有搜索条件，则展示所有树节点
            searchText = $.trim(searchText);
            if (searchText == "") {
                for (var i = 0; i < nodeList.length; i++) {
                    $(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
                    $(nodeList[i].target).show();
                }
                //展开已选择的节点（如果之前选择了）
                var selectedNode = tree.getSelected(jqTree);
                if (selectedNode) {
                    tree.expandTo(jqTree, selectedNode.target);
                }
                return;
            }

            //搜索匹配的节点并高亮显示
            var matchedNodeList = [];
            if (nodeList && nodeList.length > 0) {
                var node = null;
                for (var i = 0; i < nodeList.length; i++) {
                    node = nodeList[i];
                    if (isMatch(searchText, node.text)) {
                        matchedNodeList.push(node);
                    }
                }

                //隐藏所有节点
                for (var i = 0; i < nodeList.length; i++) {
                    $(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
                    $(nodeList[i].target).hide();
                }

                //折叠所有节点
                tree.collapseAll(jqTree);

                //展示所有匹配的节点以及父节点
                for (var i = 0; i < matchedNodeList.length; i++) {
                    showMatchedNode(jqTree, tree, matchedNodeList[i]);
                }
            }
        },

        /**
         * 展示节点的子节点（子节点有可能在搜索的过程中被隐藏了）
         * @param node easyui tree节点
         */
        showChildren: function (jqTree, node) {
            //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
            var tree = this;

            //展示子节点
            if (!tree.isLeaf(jqTree, node.target)) {
                var children = tree.getChildren(jqTree, node.target);
                if (children && children.length > 0) {
                    for (var i = 0; i < children.length; i++) {
                        if ($(children[i].target).is(":hidden")) {
                            $(children[i].target).show();
                        }
                    }
                }
            }
        },

        /**
         * 将滚动条滚动到指定的节点位置，使该节点可见（如果有滚动条才滚动，没有滚动条就不滚动）
         * @param param {
     * 	  treeContainer: easyui tree的容器（即存在滚动条的树容器）。如果为null，则取easyui tree的根UL节点的父节点。
     *    targetNode:  将要滚动到的easyui tree节点。如果targetNode为空，则默认滚动到当前已选中的节点，如果没有选中的节点，则不滚动
     * }
         */
        scrollTo: function (jqTree, param) {
            //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
            var tree = this;

            //如果node为空，则获取当前选中的node
            var targetNode = param && param.targetNode ? param.targetNode : tree.getSelected(jqTree);

            if (targetNode != null) {
                //判断节点是否在可视区域
                var root = tree.getRoot(jqTree);
                var $targetNode = $(targetNode.target);
                var container = param && param.treeContainer ? param.treeContainer : jqTree.parent();
                var containerH = container.height();
                var nodeOffsetHeight = $targetNode.offset().top - container.offset().top;
                if (nodeOffsetHeight > (containerH - 30)) {
                    var scrollHeight = container.scrollTop() + nodeOffsetHeight - containerH + 30;
                    container.scrollTop(scrollHeight);
                }
            }
        }
    });




    /**
     * 展示搜索匹配的节点
     */
    function showMatchedNode(jqTree, tree, node) {
        //展示所有父节点
        $(node.target).show();
        $(".tree-title", node.target).addClass("tree-node-targeted");
        var pNode = node;
        while ((pNode = tree.getParent(jqTree, pNode.target))) {
            $(pNode.target).show();
        }
        //展开到该节点
        tree.expandTo(jqTree, node.target);
        //如果是非叶子节点，需折叠该节点的所有子节点
        if (!tree.isLeaf(jqTree, node.target)) {
            tree.collapse(jqTree, node.target);
        }
    }

    /**
     * 判断searchText是否与targetText匹配 不区分大小写
     * @param searchText 检索的文本
     * @param targetText 目标文本
     * @return true-检索的文本与目标文本匹配；否则为false.
     */
    function isMatch(searchText, targetText) {
        return $.trim(targetText) != "" && targetText.toLowerCase().indexOf(searchText.toLowerCase()) != -1;
    }

    /**
     * 获取easyui tree的所有node节点
     */
    function getAllNodes(jqTree, tree) {
        var allNodeList = jqTree.data("allNodeList");
        if (!allNodeList) {
            var roots = tree.getRoots(jqTree);
            allNodeList = getChildNodeList(jqTree, tree, roots);
            jqTree.data("allNodeList", allNodeList);
        }
        return allNodeList;
    }

    /**
     * 定义获取easyui tree的子节点的递归算法
     */
    function getChildNodeList(jqTree, tree, nodes) {
        var childNodeList = [];
        if (nodes && nodes.length > 0) {
            var node = null;
            for (var i = 0; i < nodes.length; i++) {
                node = nodes[i];
                childNodeList.push(node);
                if (!tree.isLeaf(jqTree, node.target)) {
                    var children = tree.getChildren(jqTree, node.target);
                    childNodeList = childNodeList.concat(getChildNodeList(jqTree, tree, children));
                }
            }
        }
        return childNodeList;
    }
})(jQuery);

/**
 * Date: 2015-8-5
 * 扩展Datagrid的数据显示提示tooltip
 * 调用示例：$("#dg").datagrid("doCellTip",{
            onlyShowInterrupt:onlyShowInterrupt,
            position:'bottom',
            maxWidth:'200px',
            specialShowFields:[{field:'status',showField:'statusDesc'}],
            tipStyler:{'backgroundColor':'#fff000', borderColor:'#ff0000', boxShadow:'1px 1px 3px #292929'}
        });
 url：http://www.easyui.info/archives/1330.html
 名称	参数类型	描述以及默认值
 onlyShowInterrupt	string	是否只有在文字被截断时才显示tip，默认值为false，即所有单元格都显示tip。
 specialShowFields	Array	需要特殊定义显示的列，比如要求鼠标经过name列时提示standName列(可以是隐藏列)的内容,specialShowFields参数可以传入：[{field:'name',showField:'standName'}]。
 position	string	tip的位置，可以为top,botom,right,left。
 minWidth	string	tip的最小宽度(IE7+)。
 maxWidth	string	tip的最大宽度(IE7+)。
 width	string	tip的宽度，例如'200px'。
 tipStyler	object	tip内容的样式，注意要符合jquery css函数的要求。
 contentStyler	object	整个tip的样式，注意要符合jquery css函数的要求。
 noShowFields Array  不显示tooltip的列filed名
 */
$.extend($.fn.datagrid.methods, {
    /**
     * 开打提示功能（基于1.3.3+版本）
     * @param {} jq
     * @param {} params 提示消息框的样式
     * @return {}
     */
    doCellTip: function (jq, params) {
        function showTip(showParams, td, e, dg) {
            //无文本，不提示。
            if ($(td).text() == "") return;
            params = params || {};
            var options = dg.data('datagrid');
            var styler = 'style="';
            if (showParams.width) {
                styler = styler + "width:" + showParams.width + ";";
            }
            if (showParams.maxWidth) {
                styler = styler + "max-width:" + showParams.maxWidth + ";";
            }
            if (showParams.minWidth) {
                styler = styler + "min-width:" + showParams.minWidth + ";";
            }
            styler = styler + '"';
            showParams.content = '<div class="tipcontent" ' + styler + '>' + showParams.content + '</div>';
            $(td).tooltip($.extend({
                //content: showParams.content,
                trackMouse: false,
                //position: params.position,
                deltaY:-10,
                onHide: function () {
                    $(this).tooltip('destroy');
                },
                onShow: function () {
                    var tip = $(this).tooltip('tip');
                    if (showParams.tipStyler) {
                        tip.css(showParams.tipStyler);
                    }
                    if (showParams.contentStyler) {
                        tip.find('div.tipcontent').css(showParams.contentStyler);
                    }
                }
            },showParams)).tooltip('show');
        };
        return jq.each(function () {
            var grid = $(this);
            var options = $(this).data('datagrid');
            if (!options.tooltip) {
                var panel = grid.datagrid('getPanel').panel('panel');
                panel.find('.datagrid-body').each(function () {
                    var delegateEle = $(this).find('> div.datagrid-body-inner').length ? $(this).find('> div.datagrid-body-inner')[0] : this;
                    $(delegateEle).undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove').delegate('td[field]', {
                        'mouseover': function (e) {
                            //if($(this).attr('field')===undefined) return;
                            var that = this;
                            var setField = null;
                            //debugger;
                            //如果设置noTooltip，则此列不显示提示
                            if (grid.datagrid("getColumnOption",$(this).attr('field')).noTooltip) {
                                return;
                            }
                            console.log(grid.datagrid("getColumnOption", $(this).attr('field')).noTooltip);
                            if (params.specialShowFields && params.specialShowFields.sort) {
                                for (var i = 0; i < params.specialShowFields.length; i++) {
                                    if (params.specialShowFields[i].field == $(this).attr('field')) {
                                        setField = params.specialShowFields[i];
                                    }
                                }
                            }
                            if (setField == null) {
                                options.factContent = $(this).find('>div').clone().css({ 'margin-left': '-5000px', 'width': 'auto', 'display': 'inline', 'position': 'absolute' }).appendTo('body');
                                var factContentWidth = options.factContent.width();
                                params.content = $(this).text();
                                if (params.onlyShowInterrupt) {
                                    if (factContentWidth > $(this).width()) {
                                        showTip(params, this, e, grid);
                                    }
                                } else {
                                    showTip(params, this, e, grid);
                                }
                            } else {
                                panel.find('.datagrid-body').each(function () {
                                    var trs = $(this).find('tr[datagrid-row-index="' + $(that).parent().attr('datagrid-row-index') + '"]');
                                    trs.each(function () {
                                        var td = $(this).find('> td[field="' + setField.showField + '"]');
                                        if (td.length) {
                                            params.content = td.text();
                                        }
                                    });
                                });
                                showTip(params, this, e, grid);
                            }
                        },
                        'mouseout': function (e) {
                            if (options.factContent) {
                                options.factContent.remove();
                                options.factContent = null;
                            }
                        }
                    });
                });
            }
        });
    },
    /**
     * 关闭消息提示功能（基于1.3.3版本）
     * @param {} jq
     * @return {}
     */
    cancelCellTip: function (jq) {
        return jq.each(function () {
            var data = $(this).data('datagrid');
            if (data.factContent) {
                data.factContent.remove();
                data.factContent = null;
            }
            var panel = $(this).datagrid('getPanel').panel('panel');
            panel.find('.datagrid-body').undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove')
        });
    }
});

var motor = {
    openTab : function($tabs, title, url, callback, scope) {
        $tabs.tabs('add', {
            title: title,
            href: url,
            closable: true,
            onLoad : function(a) {
                if(callback) {
                    var panel = $tabs.tabs("getSelected");
                    callback.call((scope || window), a[0], panel);
                }
            },
            onLoadError : function (error) {
                 if(callback) {
                     callback.call((scope || window), null, null, error);
                 }
            },
            onBeforeDestroy : function () {
                if(scope || scope.destroy) {
                    scope.destroy.call(scope, $(this));
                }
            }
        });
    },

    refreshTab : function ($tabs, title) {
        $tabs.tabs("select", title);
        $tabs.tabs("getSelected").panel("refresh");
    },

    closeTab : function ($tabs, title) {
        $tabs.tabs("close", title);
    },

    createTreeGrid : function($dom, $toolbar, url, id, code, columns, callback, scope) {
        $dom.treegrid({
            border: false,
            toolbar : $toolbar,
            fitColumns: true,
            fit: true,
            url : url,
            idField : id,
            treeField : code,
            columns: columns,
            onLoadSuccess : function(res) {
                callback.call(scope, res);
            },
            loadFilter : function(data) {
                if(data.code == 1) {
                    return data.items;
                }
            }
        });
    },

    formatterIconButtons : function (buttons) {
        var template = '<div class="motor-data-grid-options">';
        $.each(buttons, function (index, button) {
            if(button === '-') {
                template += '<span title="" data-option="none" class="l-btn-left l-btn-icon-left icon-btn">';
                template += '<span class="l-btn-text">&nbsp;</span>';
                template += '<span class="l-btn-icon ">&nbsp;</span>';
                template += '</span>';
            } else {
                template += '<span title="' + button.name + '" data-option="' + button.option + '" class="l-btn-left l-btn-icon-left icon-btn">';
                template += '<span class="l-btn-text">&nbsp;</span>';
                template += '<span class="l-btn-icon ' + button.icon + '">&nbsp;</span>';
                template += '</span>';
            }
        });
        template += '</div>';
        return template;
    }
};

if($.motor) {
    $.extend($.motor, motor);
} else {
    $.motor = motor;
}
})(jQuery);;