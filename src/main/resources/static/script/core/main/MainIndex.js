define("main/MainIndex", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/_base/array",

    "motor/_base/_Object",
    "easyui/module/LinkModule",

    "sys/setting/widget/UserInfoDialog",
    "sys/setting/widget/MessageWindow"
], function (declare, connect, lang, array
, _Object, LinkModule
, UserInfoDialog, MessageWindow
) {
    return declare("main.MainIndex", [_Object], {

        loadModuleFinished : true,

        userInfo : null,
        currentModule : null,
        moduleMap : {},

        firstLoad : true,

        isSubModule : false,

        init : function () {
            this.$accordion = $("#accordion");
            this.$mainTabs = $("#mainTabs");
            this.$moduleLocation = $("#moduleLocation");
            this.$userMsgCount = $("#userMsgCount");
            this.$userBox = $("#userBox");
            this.$msgBox = $("#msgBox");

            $.motor.wait("正在初始化数据, 请稍候...");
            $.motor.Request.get("main/init/info", {}, function (res) {
                if(res.accessToken) {
                    $.ajaxSetup({
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', "Bearer " + res.accessToken);
                        }
                    });
                }

                this.userInfo = res.userInfo;
                this.getModuleMap(res.userModules);
                this.$userMsgCount.html(res.msgCount);
                this.initWidgets();
                $.motor.hideWait();
                this.events();

                this.firstLoad = false;

                this.createUserInfoDialog();
                this.createMessageWindow();
            }, this, false, false);
        },

        getModuleMap : function (modules) {
            array.forEach(modules, function (module) {
                this.moduleMap[module.moduleUrl] = module;
                if(("children" in module) && module.children.length > 0) {
                    this.getModuleMap(module.children);
                }
            }, this);
        },

        initWidgets : function () {
            var me = this;
            var ui = $(".main-top .nav li a.selected");
            this.initMenus(ui.data("ui"));
        },

        emptyAccordion : function () {
            var oldPanels = this.$accordion.accordion("panels");
            array.forEach(oldPanels, function () {
                this.$accordion.accordion("remove", 0);
            },this);
        },

        initMenus : function (ui) {
            if(!ui) {
                return;
            }
            this.emptyAccordion();
            var module = this.moduleMap[ui];
            if(module && 'children' in module && module.children.length > 0) {
                var menus = module.children;
                array.forEach(menus, function (menu, index) {
                    var me = this;
                    this.$accordion.accordion("add", {
                        iconCls : menu.icon,
                        title : menu.name,
                        content : '<div class="menu-box"></div>',
                        selected : false,
                        bodyCls : 'menuson',
                        onOpen : function () {
                            if('children' in menu && menu.children.length > 0) {
                                me.initSubMenus.call(me, menu.children, $(this).find(".menu-box"), menu);
                            }
                        }
                    });
                }, this);
                if(menus.length > 0) {
                    this.$accordion.accordion("select", 0);
                }
            }
        },

        initSubMenus : function (menus, box, parent) {
            var me = this;
            array.forEach(menus, function(menu) {
                if(parent) {
                    menu.parentName = parent.name;
                }
                //<div class="menus-icon ' + ( menu.icon ? menu.icon : '' ) + '"></div>
                var $li = $('<li><cite></cite><a href="javascript:void(0);">' +  menu.name + '</a><i></i></li>');
                $li.data("menu", menu);
                box.append($li);

                $li.click(function () {
                    var $this = $(this);
                    var data = $this.data("menu");
                    $(".menuson li.active").removeClass("active")
                    me.onMenuClick.call(me, data, $this);
                    $this.addClass("active");
                });
            }, this);

        },

        onMenuClick : function (module, $menu) {
            this.isSubModule = false;

            this.$moduleLocation.empty();

            var locationStr = ""

            if(module.parentName) {
                locationStr += module.parentName + ' > ';
            }

            this.$moduleLocation.html(locationStr + module.name);

            this.openModule(module);
        },

        openModule : function (data, item) {
            if(!this.loadModuleFinished) {
                return;
            }

            var exists = this.$mainTabs.tabs('exists', data.name);

            if (exists) {
                $.motor.closeTab(this.$mainTabs, data.name);
            }

            if($.browser.msie == true) {
                var tabs = this.$mainTabs.tabs('tabs');
                if(tabs.length >= 4 && $.browser.fullVersion <= 9.0 && !exists) {
                    $.motor.info("IE9以下(包括IE9)版本浏览器只能打开4个页面， 请关闭其它后再打开。");
                    return;
                }
            }

            this.loadModuleFinished = false;

            if(this.currentModule && !this.isSubModule) {
                //关闭所有模块， 当使用多Tab页时取消该功能
                connect.publish("close_all_module");
            }

            var me = this;

            var parentModule = data.parentModule;
            var queryParams = data.queryParams;

            if(data.resourceType == 1) {
                require([data.moduleUrl], function(Module) {
                    var childrenModule = null;
                    if(data.children && data.children.length > 0) {
                        childrenModule = data.children;
                    }

                    var module = new Module({
                        title : data.name,
                        $tabs : me.$mainTabs,
                        userInfo : me.userInfo,
                        _parentModule : parentModule,
                        _childrenModule : childrenModule,
                        queryParams : queryParams
                    });

                    connect.connect(module, 'onLoadFinish', me, function () {
                        this.loadModuleFinished = true;
                    });

                    if(parentModule) {
                        if(parentModule._childModuleAddCallback && lang.isFunction(parentModule._childModuleAddCallback)) {
                            parentModule._childModuleAddCallback.call(parentModule, data, module, item);
                        }
                    }

                    me.currentModule = module;
                });
            } else if(data.resourceType == 2) {
                var module = new LinkModule({
                    title : data.name,
                    link : data.moduleUrl,
                    $tabs : me.$mainTabs,
                    userInfo : me.userInfo,
                    _parentModule : parentModule,
                    queryParams : queryParams
                });

                connect.connect(module, 'onLoadFinish', me, function () {
                    this.loadModuleFinished = true;
                });

                me.currentModule = module;
            }
        },

        subOpenModule : function (moduleData, data) {
            this.isSubModule = true;
            this.openModule(moduleData, data);
        },

        createUserInfoDialog : function () {
            this.userInfoDialog = new UserInfoDialog({
                userInfo : this.userInfo
            });
        },

        createMessageWindow : function () {
            $.motor.Request.get("api/sys/message/user/new", {
                userId : this.userInfo.id
            }, function (res) {
                var items = res.items;
                this.msgWindow = new MessageWindow({ userInfo : this.userInfo, messages : items });
            }, this, false, false);
        },

        events : function () {
            var me = this;

            //顶部导航切换
            $(".main-top .nav li a").click(function(){
                var $this = $(this);
                var ui = $this.data('ui');
                $(".nav li a.selected").removeClass("selected");
                me.initMenus(ui);
                $this.addClass("selected");
            });

            this.$userBox.click(function () {
                me.userInfoDialog.show();
            });
            
            this.$userMsgCount.click(function () {
                if(me.msgWindow) {
                    me.msgWindow.show();
                }
            });
            
            this.$msgBox.click(function () {
                if(me.msgWindow) {
                    me.msgWindow.show();
                }
            });

            connect.subscribe("open-module", this, this.subOpenModule);
        }
    });
});