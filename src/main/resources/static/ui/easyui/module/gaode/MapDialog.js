define("easyui/module/gaode/MapDialog", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "easyui/widget/_base/_BaseDialog",
    "app/widget/Map"
], function (declare, connect, _BaseDialog, Map) {

    return declare("easyui.module.gaode.MapDialog", [_BaseDialog], {

        title : '地图窗口',

        width : 600,
        height : 450,

        cache : true,
        modal : true,

        icon : 'icon-map',

        saveBtnText : '完成',

        padding : 0,

        href : 'script/easyui/module/gaode/templates/MapDialog.html',

        _onHide : function () {
            if(this.map) {
                this.map.removeClickListener();
            }
            this.onHide();
        },

        buildRendering : function() {
            var me = this;
            this.buttons = [{
                text : '关闭',
                iconCls : 'icon-close',
                handler : function () {
                    me.hide();
                }
            }];
            this.inherited(arguments);
        },

        onLoad : function () {
            this.$gdMap = this.$domNode.find(".gdMap");
            this.map = new Map({}, this.$gdMap[0]);

            connect.connect(this.map, 'onPositionFinished', this, this.onPositionFinished);
        },

        positionPoint : function (adress) {
            if(!this.isLoaded || !this.map.isLoad) {
                var me = this;
                var inter = setInterval(function () {
                    if(me.isLoaded && me.map.isLoad) {
                        clearInterval(inter);
                        me.map.positionPoint(adress);
                    }
                }, 200);
            } else {
                this.map.positionPoint(adress);
            }
        },

        setPositionPoint : function (lng, lat) {
            if(!this.isLoaded || !this.map.isLoad) {
                var me = this;
                var inter = setInterval(function () {
                    if(me.isLoaded && me.map.isLoad) {
                        clearInterval(inter);
                        me.map.setPositionPoint(lng, lat);
                    }
                }, 200);
            } else {
                this.map.setPositionPoint(lng, lat);
            }
        },

        onPositionFinished : function (lng, lat, address) {
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});