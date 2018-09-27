define("motor/gis/map/_Measure", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/number",
    "dojo/dom-style",
    "dojo/dom-attr",

    "motor/_base/_Object",
    "motor/gis/map/_Draw",
    "motor/gis/map/_Symbol",

    "esri/toolbars/draw",
    "esri/layers/GraphicsLayer",

    "esri/geometry/Polyline",

    "esri/geometry/geodesicUtils",
    "esri/units"
], function(declare, connect, array, number, domStyle, domAttr
    , _Object, _Draw, _Symbol
    , Draw, GraphicsLayer
    , Polyline
    , geodesicUtils, units
) {

    return declare("motor.gis.map._Measure", [_Object, _Draw, _Symbol], {

        map : null,
        measureToolbar : null,
        _measureHandlers : [],

        _measureGLayer : null,
        _measureType : null,
        _geometrys : [],
        _handlers : [],
        _step : 0,
        _lastPoint : null,

        init : function () {
            this.inherited(arguments);
        },

        createMeasureToolbar : function () {
            this._measureGLayer = new GraphicsLayer();
            this.map.addLayer(this._measureGLayer);
            this.measureToolbar = new Draw(this.map);
            var h1 = connect.connect(this.measureToolbar, 'onDrawEnd', this, this._measureDrawEnd);
            this._measureHandlers.push(h1);
        },

        _disHandlers : function () {
            array.forEach(this._handlers, function(handler) {
                connect.disconnect(handler);
            });
            this._handlers = [];
            this.inherited(arguments);
        },

        _measureDrawEnd : function (geometry, e) {
            switch (geometry.type) {
                case 'polyline':
                    this._measureDrawEndLine(geometry, e);
                    break;
                case 'polygon':
                    this._measureDrawEndArea(geometry, e);
                    break;
            }
            this._step++;
            this._disHandlers();
            this.measureToolbar.deactivate();
        },

        _measureDrawEndLine : function (geometry, e) {
            var line = this.drawToLayer(this._measureGLayer, geometry, this.createFillSymbol());
            this._geometrys[this._step].push(line);
            switch(this._measureType) {
                case 'distance':
                    this._lastPoint.setSymbol(this.createEndSymbol());
                    var lastPointDomNode = this._lastPoint.getDojoShape().getNode();

                    domStyle.set(lastPointDomNode, "cursor", "pointer");
                    domAttr.set(lastPointDomNode, "title", "点击清除本次测距");

                    var gs = this._geometrys[this._step];
                    var removeIndex = this._step;

                    var clearHandler = connect.connect(lastPointDomNode, 'onclick', this, function() {
                        array.forEach(gs, function(removeG) {
                            this._measureGLayer.remove(removeG);
                        }, this);
                        this._geometrys[removeIndex] = [];
                        connect.disconnect(clearHandler);
                    });
                    break;
            }
        },

        _measureDrawEndArea : function(geometry, e) {
            var polygon = this.drawToLayer(this._measureGLayer, geometry, this.createFillSymbol());
            this._geometrys[this._step].push(polygon);
            switch(this._measureType) {
                case 'area':
                    var areas = geodesicUtils.geodesicAreas([geometry], units.SQUARE_KILOMETERS);

                    var area = areas[0];
                    var showText = null;
                    if(area >= 10000) {
                        area = number.format(area/10000, {
                            places : 2
                        });
                        showText = area + "万平方公里";
                    } else {
                        area = number.format(area, {
                            places : 2
                        });
                        showText = area + "平方公里";
                    }

                    polygon.setAttributes({
                        area: showText
                    });

                    var centerPoint = geometry.getExtent().getCenter();

                    var textSymbol = this.createTextSymbol(showText);

                    var textG = this.drawToLayer(this._measureGLayer, centerPoint, textSymbol);

                    this._geometrys[this._step].push(textG);

                    var domNode = polygon.getDojoShape().getNode();

                    domStyle.set(domNode, "cursor", "pointer");
                    domAttr.set(domNode, "title", "点击清除本次测量面积");

                    var gs = this._geometrys[this._step];
                    var removeIndex = this._step;

                    var clearHandler = connect.connect(domNode, 'onclick', this, function() {
                        array.forEach(gs, function(removeG) {
                            this._measureGLayer.remove(removeG);
                        }, this);
                        this._geometrys[removeIndex] = [];
                        connect.disconnect(clearHandler);
                    });
                    break;
            }
        },

        measureDistance : function () {
            this.clear();
            this.measureToolbar.activate(Draw.POLYLINE);
            this._measureType = "distance";

            this._geometrys.push([]);

            var pointCount = 0;
            var polyline = new Polyline(this.map.spatialReference);

            var symbolHandler = connect.connect(this.map, 'onClick', this, function(e) {

                if(pointCount == 0) {
                    if(polyline.paths.length > 0) {
                        polyline.removePath(0);
                    }
                    polyline.addPath([e.mapPoint]);
                } else {
                    polyline.insertPoint(polyline.paths.length - 1, pointCount, e.mapPoint);
                }

                var lengths = geodesicUtils.geodesicLengths([polyline], units.KILOMETERS);

                var length = number.format(lengths[0], {
                    places : 2
                });

                var showText = length < 1 ? length * 1000 + "米" : length + "公里";


                var textSymbol = this.createTextSymbol(showText);

                if(textSymbol == null) {
                    return;
                }

                var textG = this.drawToLayer(this._measureGLayer, e.mapPoint, textSymbol);

                this._geometrys[this._step].push(textG);

                var point = null;

                if(pointCount == 0) {
                    //起点
                    point = this.drawToLayer(this._measureGLayer, e.mapPoint, this.createStartSymbol());
                } else {
                    //折线点
                    point = this.drawToLayer(this._measureGLayer, e.mapPoint, this.createTransitionSymbol());
                    this._lastPoint = point;
                }
                this._geometrys[this._step].push(point);
                pointCount++;
            });

            this._handlers.push(symbolHandler);
        },

        measureArea : function () {
            this.clear();
            this.measureToolbar.activate(Draw.POLYGON);
            this._measureType = "area";
            this._geometrys.push([]);
        },

        clear : function () {
            this._measureGLayer.clear();
            this.measureToolbar.finishDrawing();
            this.measureToolbar.deactivate();
            this._step = 0;
            this._geometrys = [];
            this._disHandlers();
            this.inherited(arguments);
        },

        destroy : function () {
            delete this._measureHandlers;
            this.inherited(arguments);
        }
    });
});