define("motor/gis/map/_Position", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",

    "motor/_base/_Object",
    "motor/gis/map/_Draw",
    "motor/gis/map/_Geometry",
    "motor/gis/map/_Symbol",

    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Polygon",
    "esri/geometry/Extent",

    "esri/symbols/SimpleFillSymbol"

], function(declare, array, connect
    , _Object, _Draw, _Geometry, _Symbol
    , graphic, GraphicsLayer, Polygon, Extent, SimpleFillSymbol
) {

    return declare("motor.gis.map._Position", [_Object, _Draw, _Geometry, _Symbol], {

        map : null,

        _positionGLayer : null,
        _positionGHandles : [],

        init : function () {
            this.inherited(arguments);
        },

        createPositionLayer : function () {
            this._positionGLayer = new GraphicsLayer();
            this.map.addLayer(this._positionGLayer);

            var h1 = connect.connect(this._positionGLayer, 'onGraphicNodeAdd', this, function(obj) {
                var data = obj.graphic.geometry.data;
                this.onAddPositionGraphic(obj, data);
            });

            var h2 = connect.connect(this._positionGLayer, 'onGraphicNodeRemove', this, function(obj) {
                var data = obj.graphic.geometry.data;
                this.onRemovePositionGraphic(obj, data);
            });

            this._positionGHandles.push(h1);
            this._positionGHandles.push(h2);
        },

        position : function (x, y) {
            this._positionGLayer.clear();
            if(!x && !y) {
                alert("没有坐标信息!");
                return;
            }
            this.map.setZoom(this.map.getMaxZoom());
            var nowExtent = new Extent(x, y, x, y, this.map.spatialReference);
            this.map.setExtent(nowExtent, true);
            var point = this.getPoint(x, y);
            return this.drawToLayer(this._positionGLayer, point, this.createPositionSymbol());
        },

        positionByGeometry : function (g, drawMarker) {
            if(drawMarker == null|| drawMarker == undefined) {
                drawMarker = true;
            }
            this._positionGLayer.clear();
            this.map.setExtent(g.getExtent(), true);
            if(g.type == "polygon" && drawMarker) {
                var rings = g.rings;
                var polygon = new Polygon(this.map.spatialReference);
                array.forEach(rings, function (ring) {
                    polygon.addRing(ring);
                });
                var g = new graphic(polygon, this.createTransparentFillSymbol());
                var rg =this._positionGLayer.add(g);

                this.map.setExtent(rg._extent, true);
                var centerPoint = rg._extent.getCenter();
                this.map.centerAt(centerPoint);

                this.drawToLayer(this._positionGLayer, centerPoint, this.createPositionSymbol());

                this._positionGLayer.remove(rg);
            }
        },

        onAddPositionGraphic : function (obj, data) {

        },

        onRemovePositionGraphic : function (obj, data) {

        },

        clear : function() {
            this._positionGLayer.clear();
            this.inherited(arguments);
        },

        destroy : function () {
            delete this._positionGHandles;
            this.inherited(arguments);
        }
    });
});