define("motor/gis/map/_Draw", [
"dojo/_base/declare",
"dojo/_base/connect",
"dojo/_base/array",
    
"motor/_base/_Object",

"motor/gis/map/_Geometry",
"motor/gis/map/_Symbol",

"esri/toolbars/draw",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/symbols/SimpleFillSymbol",
"esri/geometry/jsonUtils",
"esri/geometry/Geometry",
"esri/geometry/Polygon",
"esri/geometry/Circle",
"esri/geometry/Point",
"esri/units"
], function(declare, connect, array
, _Object, _Geometry, _Symbol
, draw, GraphicsLayer, Graphic, SimpleFillSymbol, jsonUtils, Geometry, Polygon, Circle, Point, Units
) {

    return declare("motor.gis.map._Draw", [_Object, _Geometry, _Symbol], {

        map : null,
        drawToolbar : null,
        _drawGLayer :　null,
        _drawGHandles : [],
        _addedGLayer : [] ,

        init : function () {
            this.inherited(arguments);
        },

        createDrawToolbar : function () {
            this.drawToolbar = new draw(this.map);
            this._drawGLayer = new GraphicsLayer();
            this.map.addLayer(this._drawGLayer);

            connect.connect(this.drawToolbar, 'onDrawEnd', this, this._drawEnd);

            this.createEvents();
        },

        addGraphicsLayer : function (params) {
            var graphicsLayer = new GraphicsLayer(params);
            this._addedGLayer.push(graphicsLayer);
            this.map.addLayer(graphicsLayer);
            return graphicsLayer;
        },

        createEvents : function() {
            this.inherited(arguments);
            var h1 = connect.connect(this._drawGLayer, 'onGraphicNodeAdd', this, function(obj) {
                var data = obj.graphic.geometry.data;
                this.onAddGraphic(obj, data);
            });

            var h2 = connect.connect(this._drawGLayer, 'onGraphicNodeRemove', this, function(obj) {
                var data = obj.graphic.geometry.data;
                this.onRemoveGraphic(obj, data);
            });

            this._drawGHandles.push(h1);
            this._drawGHandles.push(h2);
        },

        getDrawLayer : function () {
            return this._drawGLayer;
        },

        drawToLayer : function (layer, geometry, symbol, data) {
            var graphic = new Graphic(geometry, symbol, data);
            return layer.add(graphic);
        },

        _drawEnd : function (geometry, e) {
            this.drawToolbar.deactivate();
            this.map.enableMapNavigation();
            switch (geometry.type) {
                case 'polyline':
                    this._drawLine(geometry, e);
                    break;
                case 'polygon':
                    this._drawPolygon(geometry, e);
                    break;
                case 'point':
                    this._drawPoint(geometry, e);
                    break;
            }
        },

        _drawLine : function (geometry, e) {

        },

        _drawPolygon :function (geometry) {
            var g = new Graphic(geometry, this.createColorFillSymbol("#0000ff"));
            this._drawGLayer.add(g);
            this.onDrawEnd(geometry, g);
        },

        _drawPoint : function (geometry) {
            var g = new Graphic(geometry, this.createColorCircleSymbol("#ff0000"));
            this._drawGLayer.add(g);
            this.onDrawEnd(geometry, g);
        },

        removeDrawGraphic : function (graphic) {
            this.getDrawLayer().remove(graphic);
        },
        
        drawPolygon : function () {
            this.drawToolbar.deactivate();
            this.drawToolbar.activate(draw.POLYGON);
            this.map.disableMapNavigation();
        },

        drawPoint : function () {
            this.drawToolbar.deactivate();
            this.drawToolbar.activate(draw.POINT);
            this.map.disableMapNavigation();
        },

        drawPolygonByRings : function (rings, symbol, data) {
            symbol = symbol || new SimpleFillSymbol();
            var polygon = new Polygon(this.map.spatialReference);
            array.forEach(rings, function (ring) {
                polygon.addRing(ring);
            });
            if(data) {
                polygon.data = data;
            }
            var g = new Graphic(polygon, symbol, data);
            return this._drawGLayer.add(g);
        },

        drawByGeometry : function (geometry, symbol, data) {
            geometry.data = data;
            return this._drawGLayer.add(new Graphic(geometry, symbol, data));
        },

        drawByJson : function (json, symbol, data) {
            var geometry = jsonUtils.fromJson(json);
            if(geometry.type == "polygon") {
                return this.drawPolygonByRings(geometry.rings, symbol,  data);
            } else if(geometry.type == "point") {
                return this.drawPointByXY(geometry.x, geometry.y, symbol, data);
            }
        },

        drawPointByXY : function (x, y, sybmol, data) {
            sybmol = sybmol || this.createPositionSymbol();
            var point = this.getPoint(x, y);
            if(data) {
                point.data = data;
            }
            return this.drawToLayer(this._drawGLayer, point, sybmol, data);
        },

        /**
         * 缓冲一个点内的所有图形
         * @param x
         * @param y
         * @param radius 半径
         */
        bufferPointGraphic : function (x, y, radius) {
            var circle = new Circle({
                center: [x, y],
                radius: radius,
                radiusUnit: Units.METERS
            });

            var graphics = this._drawGLayer.graphics;
            var resultArray = new Array();
            array.forEach(graphics, function (g) {
                if(circle.contains(g.geometry)) {
                    resultArray.push(g);
                }
            }, this);
            return resultArray;
        },

        onDrawEnd : function (geometry, graphic) {

        },

        onAddGraphic : function (obj) {

        },

        onRemoveGraphic : function (obj) {

        },

        clear : function () {
            this._drawGLayer.clear();
            array.forEach(this._addedGLayer, function (gLayer) {
                gLayer.clear();
            }, this);
            this.inherited(arguments);
            this.onClear();
        },

        onClear : function () {

        },

        destroy : function () {
            array.forEach(this._addedGLayer, function (gLayer) {
                this.map.removeLayer(gLayer);
            }, this);
            delete this._drawGHandles;
            this.inherited(arguments);
        }
    });
});