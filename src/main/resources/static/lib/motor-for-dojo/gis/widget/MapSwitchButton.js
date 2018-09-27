define("motor/gis/widget/MapSwitchButton",[
    "dojo/_base/declare",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_CssStateMixin",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/query",
    "dojo/_base/fx",
    "dojo/_base/array"
], function(declare, _Widget, _TemplatedMixin, _CssStateMixin, domC, domCss, query, fx, array) {

    return declare("motor.gis.widget.MapSwitchButton", [_Widget, _TemplatedMixin, _CssStateMixin], {
        templateString : '<div class="maptype-wrapper" data-dojo-attach-event="onmouseenter:_onHover, onmouseleave :_onLeave">'+
                            '<div class="maptype" data-dojo-attach-point="contentNode">'+
                            '</div>'+
                        '</div>',

        types : [{type : 'vector', name : '地图'}, {type : 'img', name : '影像'}],

        _onHover : function(e) {
            var isExpend = domCss.contains(this.domNode, "expend");
            var nodes = query(".mapTypeCard", this.domNode);
            if(!isExpend) {
                array.forEach(nodes, function (node, index) {
                    if(nodes.length  - index - 1 != 0) {
                        domCss.add(node, "card-show");
                        fx.animateProperty({
                            node : node,
                            duration : 300,
                            properties : {
                                right : { end : 90 * (nodes.length  - index - 1)}
                            }
                        }).play();
                    }
                }, this);
                domCss.add(this.domNode, "expend");
            }
        },

        _onLeave : function(e) {
            var isExpend = domCss.contains(this.domNode, "expend");
            var nodes = query(".mapTypeCard", this.domNode);
            if(isExpend) {
                array.forEach(nodes, function (node, index) {
                    if (nodes.length - index - 1 != 0) {
                        domCss.remove(node, "card-show");
                        fx.animateProperty({
                            node: node,
                            duration: 300,
                            properties: {
                                right: {end: 5 * (nodes.length - index - 1)}
                            }
                        }).play();
                    }
                }, this);
                domCss.remove(this.domNode, "expend");
            }
        },

        buildRendering : function() {
            this.inherited(arguments);
            var contentBox = query(".maptype", this.domNode);
            var me = this;
            var $contentBox = $(contentBox);

            array.forEach(this.types, function (type, index) {
                var $card = $('<div class="mapTypeCard ' + type.type + ' ' + (index == 0 ? 'active card-show' : '') + '" style="z-index: ' + (this.types.length - index) + ';right:' + (index * 5) + 'px;"><span>' + type.name + '</span></div>');
                $contentBox.prepend($card);
                $card.click(function () {
                    me._onClick.call(me, $contentBox, $card, type);
                });
            }, this);
        },

        _onClick : function ($contentBox, $node, type) {
            $contentBox.find(".mapTypeCard").removeClass("active");
            $node.addClass("active");
            this.onClick(type);
        },

        onClick : function (type) {
            
        }
    });
});