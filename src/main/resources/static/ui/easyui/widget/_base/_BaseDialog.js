define("easyui/widget/_base/_BaseDialog", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dijit/_Widget",
    "easyui/widget/_base/_EasyUiWidget"
], function (declare, array, lang, _Widget, _EasyUiWidget) {

    return declare("easyui.widget._base._BaseDialog", [_EasyUiWidget], {

        $domNode : null,

        title : '',
        icon : '',
        width : 0,
        height : 0,
        closed : true,
        cache : false,
        modal : false,
        collapsible : false,
        minimizable : false,
        maximizable : false,
        draggable : true,
        href : null,
        toolbar : null,
        left : null,
        top : null,
        style : null,
        buttons : null,
        content : null,
        inline : false,

        baseClass : 'motor-dialog',

        templateString : '<div data-dojo-attach-point="containerNode"></div>',

        href : '',

        isLoaded : false,

        padding : 5,

        checkSession : function (responseText) {
            if(responseText.indexOf('{') == 0) {
                var res = lang.strToJson(responseText);
                if(res.code == -1) {
                    window.location = SYS_PATH;
                }
            }
        },

        _setupSetting : function () {
            var me = this;
            var setting = {
                cls : this.cls,
                title : this.title,
                iconCls : this.icon,
                width : this.width,
                height : this.height,
                closed : this.closed,
                cache : this.cache,
                modal : this.modal,
                collapsible : this.collapsible,
                minimizable : this.minimizable,
                maximizable : this.maximizable,
                draggable : this.draggable,
                left : this.left,
                top : this.top,
                toolbar : this.toolbar,
                buttons : this.buttons,
                href : this.href,
                inline : this.inline,
                onLoad :function(responseText) {
                    me.isLoaded = true;
                    me.checkSession(responseText);
                    me.onLoad.call(me);
                    me.onLoadFinish();
                },
                onClose : function() {
                    me._onHide.call(me);
                },
                onMove : function (left, top) {
                    me._onMove.call(me, left, top);
                },
                onResize : function () {
                    me._onResize.call(me);
                }
            };
            if(this.content) {
                delete setting.href;
                setting.content = this.content;
                setting.onOpen = function () {
                    setTimeout(function () {
                        if(!me.isLoaded) {
                            me.isLoaded = true;
                            me.onLoad();
                        }
                    }, 50);
                };
            }
            if(this.style) {
                if(this.style.left != undefined || this.style.top != undefined || this.style.right != undefined || this.style.bottom != undefined) {
                    delete setting.left;
                    delete setting.top;
                }
                setting.style = this.style;
            }
            return setting;
        },

        _resetLocation : function () {
            if(!this.isLoaded) {
                return;
            }
            var $window = this.$domNode.parent(".window");
            var $parent = $("body");
            var top = $window.position().top;
            var left = $window.position().left;
            var width = $window.width();
            var height = $window.height();
            var maxWidth = $parent.width();
            var maxHeight = $parent.height();
            var isMove = false;

            if(top <= 0) {
                top = 1;
                isMove = true;
            } else if(top + height >= maxHeight) {
                top = maxHeight - height;
                isMove = true;
            }
            if(left <= 0) {
                left = 1;
                isMove = true;
            } else if(left + width >= maxWidth) {
                left = maxWidth - width - 10;
                isMove = true;
            }

            if(isMove) {
                setTimeout(function () {
                    var $windowShadow = $window.next(".window-shadow");
                    $window.animate({left: left + "px", top : top + "px"});
                    $windowShadow.animate({left: left + "px", top : top + "px"});
                }, 100);
            }
        },

        _appendTo : function () {
            $("body").append(this.$domNode);
        },

        _onDestroy : function () {
            this.hide();
        },

        _onShow : function () {
            if(!this.isLoaded) {
                var me = this;
                var inter = setInterval(function () {
                    if(me.isLoaded) {
                        try {
                            setTimeout(function () {
                                me.onShow();
                            }, 100);
                        } catch (error) {
                           console.log(error);
                        } finally {
                            clearInterval(inter);
                        }
                    }
                }, 200);
            } else {
                this.onShow();
            }
        },

        _onHide : function () {
            this.onHide();
        },

        _onMove : function (left, top) {
            this.onMove(left, top);
            this._resetLocation();
        },

        _onResize : function () {
            this.onResize();
            this._resetLocation();
        },

        _initButtons : function () {

        },

        buildRendering : function() {
            this.inherited(arguments);
            this._initButtons();
            var setting = this._setupSetting();
            var $domNode = $(this.domNode);
            $domNode.css('padding', this.padding + 'px');
            this.$domNode = $domNode;
            this._appendTo();
            $domNode.dialog(setting);
        },

        show : function () {
            this.$domNode.dialog("open");
            this._onShow();
        },

        hide : function () {
            this.$domNode.dialog('close');
        },

        onlyHide : function () {
            var parent = this.$domNode.parents(".window");
            parent.hide();
            parent.next(".window-shadow").hide();
        },

        //折叠面板
        collapse : function () {
            this.$domNode.dialog("collapse");
        },

        //展开面板
        expand : function () {
            this.$domNode.dialog("expand");
        },

        setTitle : function (title) {
            this.$domNode.dialog("setTitle", title);
        },

        postCreate : function () {
            this.inherited(arguments);
        },

        onLoad : function () {
            
        },

        onLoadFinish : function () {

        },

        onHide : function () {
            
        },

        onMove : function (left, top) {
            
        },

        onResize : function () {

        },

        onShow : function () {

        },

        destroy : function () {
            this.inherited(arguments);
            this.$domNode.parent().next(".window-shadow").remove();
            this.$domNode.parent().next(".window-mask").remove();
            this.$domNode.dialog('destroy', true);
        }
    });
});