define("motor/gis/map/_Nav", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",

    "motor/_base/_Object",
    "esri/toolbars/navigation",
    "esri/geometry/Extent"
], function(declare, connect, array
    , _Object
    , navigation, Extent
) {

    return declare("motor.gis.map._Nav", [_Object], {

        map : null,
        navToolbar : null,
        _navHandlers : [],

        init : function () {
            this.inherited(arguments);
        },

        createNavToolbar : function () {
            this.navToolbar = new navigation(this.map);
            var h1 = connect.connect(this.navToolbar, 'onExtentHistoryChange', this, this.onExtentHistoryChange)
            this._navHandlers.push(h1);
        },

        zoomIn : function() {
            this.map.setMapCursor("url('script/lib/motor-for-dojo/images/cursors/zoomin.cur'),auto");
            this.navToolbar.activate(navigation.ZOOM_IN);
        },

        zoomOut : function() {
            this.map.setMapCursor("url('script/lib/motor-for-dojo/images/cursors/zoomout.cur'),auto");
            this.navToolbar.activate(navigation.ZOOM_OUT);
        },

        global : function() {
            this.navToolbar.zoomToFullExtent();
        },

        prev : function() {
            this.navToolbar.zoomToPrevExtent();
        },

        next : function() {
            this.navToolbar.zoomToNextExtent();
        },

        panNorth : function() {
            this.map.panUp();
        },

        panWest : function() {
            this.map.panLeft();
        },

        panEast : function() {
            this.map.panRight();
        },

        panSouth : function() {
            this.map.panDown();
        },

        isFirstExtent : function () {
            return this.navToolbar.isFirstExtent();
        },

        isLastExtent : function () {
            return this.navToolbar.isLastExtent();
        },


        toExtent : function (extent) {
            this.map.setExtent(extent.expand(1.25), true);
            var centerPoint = extent.getCenter();
            this.map.centerAt(centerPoint);
        },

        toByLocations : function (minX, minY, maxX, maxY) {
            var extent = new Extent(minX, minY, maxX, maxY, this.map.spatialReference);
            this.map.setExtent(extent.expand(1.25), true);
        },

        onExtentHistoryChange : function () {
            connect.publish('MapExtentChange');
            this.onMapExtentChange();
        },

        onMapExtentChange : function () {

        },

        clear : function () {
            this.map.setMapCursor("default");
            this.navToolbar.deactivate();
            this.inherited(arguments);
        },

        destroy : function () {
            delete this._navHandlers;
            this.inherited(arguments);
        }
    });
});