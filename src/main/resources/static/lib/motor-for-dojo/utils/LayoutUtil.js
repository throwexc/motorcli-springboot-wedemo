define("motor/utils/LayoutUtil", [
    "dojo/_base/lang",
    "dijit/registry",
    "dojo/_base/array",
    "dijit/layout/BorderContainer",
    "dojo/dom-construct",
    "dijit/layout/ContentPane",
    "dijit/layout/LinkPane",
    "dojo/_base/connect",
    "dojo/ready"
], function(lang, dijitReg, array, BorderContainer, domConstruct, ContentPane, LinkPane, connect, ready) {

    var layoutUnitClass = {

        clearLayout : function() {
            var body = dojo.body();
            var widgets = dijitReg.toArray();

            array.forEach(widgets, function(widget) {
                var parentNode = widget.domNode.parentNode;
                parentNode.removeChild(widget.domNode);
                widget.destroyDescendants(true);
                widget.destroy(true);
            });

            body.innerHTML = "";
        },

        getBody : function() {
            return dojo.body();
        },

        newDiv : function(params, parent) {
            if(parent) {
                return domConstruct.create("div", params, parent);
            } else {
                return domConstruct.create("div", params, this.getBody());
            }
        },

        newBorderContainer : function(dom) {
            return new BorderContainer({}, dom);
        },

        newContentPane : function(dom) {
            return new ContentPane({}, dom);
        },

        newLinkPane : function(params, dom) {
            return new LinkPane(params, dom);
        },

        addBorderContainer : function(dom) {
            var container = null;
            if(dom) {
                container = this.newBorderContainer(dom);
            } else {
                container = this.newBorderContainer(this.newDiv({}, this.getBody()));
            }
            return container;
        },

        addContentPane : function(dom, parent, region) {
            var pane = null;
            if(dom) {
                pane = this.newContentPane(dom);
            } else {
                pane = this.newContentPane(this.newDiv());
            }
            if(region) {
                pane.set('region', region);
            }
            if(parent) {
                parent.addChild(pane);
            }
            return pane;
        },

        addLinkPane : function(params, dom) {
            var me = this;
            var pane = null;
            var callback = params.callback || function(){};
            var scope = params.scope || pane;
            if(dom) {
                if(lang.isString(dom)) {
                    var old = dijitReg.byId(dom);
                    if(old) {
                        if(old.onClose) {
                            old.onClose.call(old.app);
                        }
                        old.destroyDescendants(true);
                        old.destroy(true);
                    }
                } else {
                    var old = dijitReg.byNode(dom);
                    if(old) {
                        if(old.onClose) {
                            old.onClose.call(old.app);
                        }
                        old.destroyDescendants(true);
                        old.destroy(true);
                    }
                }
                pane = this.newLinkPane(params, dom);
            } else {
                pane = this.newLinkPane(params, this.newDiv());
            }

            pane.app = scope;
            if(params.href) {
                connect.connect(pane, 'onDownloadEnd', function () {
                    var resText = $(pane.domNode).html();
                    me.checkSession(resText);
                    ready(lang.hitch(scope, callback, pane));
                });
            } else {
               setTimeout(function () {
                   callback.call(scope, pane);
               }, 200);
            }

            return pane;
        },

        closeLinkPane : function (dom) {
            if(dom) {
                if(lang.isString(dom)) {
                    var old = dijitReg.byId(dom);
                    if(old) {
                        if(old.onClose) {
                            old.onClose.call(old.app);
                        }
                        old.destroyDescendants(true);
                        old.destroy(true);
                    }
                } else {
                    var old = dijitReg.byNode(dom);
                    if(old) {
                        if(old.onClose) {
                            old.onClose.call(old.app);
                        }
                        old.destroyDescendants(true);
                        old.destroy(true);
                    }
                }
            }
        },

        destroyDialog : function(dialog) {
            if(dialog.domNode) {
                var parentNode = dialog.domNode.parentNode;
                parentNode.removeChild(dialog.domNode);
                dialog.destroyDescendants(true);
                dialog.destroy(true);
            }
        },

        checkSession : function (responseText) {
            if(responseText.indexOf('{') == 0) {
                var res = lang.strToJson(responseText);
                if(res.code == -1) {
                    window.location = SYS_PATH;
                }
            }
        }
    };

    return layoutUnitClass;
});