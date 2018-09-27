define("motor/gis/map/_GISBase", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "motor/gis/map/_Draw",
    "motor/gis/map/_Geometry",
    "motor/gis/map/_Measure",
    "motor/gis/map/_Nav",
    "motor/gis/map/_Position",
    "motor/gis/map/_Symbol",
    "motor/gis/query/_QueryLayer"
], function(declare, array, _Draw, _Geometry, _Measure, _Nav, _Position, _Symbol, _QueryLayer
) {

    return declare("motor.gis.map._GISBase", [_Draw, _Geometry, _Measure, _Nav, _Position, _Symbol, _QueryLayer], {

        map : null,

        init : function () {
            this.inherited(arguments);

            this.createDrawToolbar();
            this.createMeasureToolbar();
            this.createNavToolbar();
            this.createPositionLayer();
        },

        setVisibility : function(isVisible) {
            this._drawGLayer.setVisibility(isVisible);
            this._measureGLayer.setVisibility(isVisible);
            this._positionGLayer.setVisibility(isVisible);
            array.forEach(this._addedGLayer, function (l) {
                l.setVisibility(isVisible);
            },this);
        },

        destroy : function () {
            this.clear();
            this.map.removeLayer(this._drawGLayer);
            this.map.removeLayer(this._measureGLayer);
            this.map.removeLayer(this._positionGLayer);
            this.inherited(arguments);
        }
    });
});