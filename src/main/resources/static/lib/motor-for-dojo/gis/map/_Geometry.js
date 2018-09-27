define("motor/gis/map/_Geometry", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",

    "motor/_base/_Object",

    "esri/geometry/Point"
], function(declare, connect, array
    , _Object
    , Point
) {

    return declare("motor.gis.map._Geometry", [_Object], {

        map : null,

        init : function () {
            this.inherited(arguments);
        },

        getPoint : function (x, y) {
            return new Point(x, y, this.map.spatialReference);
        },

        addExtent : function (extent1, extent2) {
            var xmax = extent1.xmax;
            var xmin = extent1.xmin;
            var ymax = extent1.ymax;
            var ymin = extent1.ymin;
            var spatialReference = extent1.spatialReference;

            if(extent2.xmax > xmax) {
                xmax = extent2.xmax;
            }
            if(extent2.xmin < xmin) {
                xmin = extent2.xmin;
            }
            if(extent2.ymax > ymax) {
                ymax = extent2.ymax;
            }
            if(extent2.ymin < ymin) {
                ymin = extent2.ymin;
            }
            return extent1.update(xmin, ymin, xmax, ymax, spatialReference);
        },

        clear : function () {
            this.inherited(arguments);
        }
    });
});