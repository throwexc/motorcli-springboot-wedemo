define("motor/gis/map/_Symbol", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/_base/Color",

    "motor/_base/_Object",

    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/Font"
], function(declare, connect, array, Color
    , _Object
    , PictureMarkerSymbol, SimpleMarkerSymbol, TextSymbol, SimpleLineSymbol, SimpleFillSymbol, Font
) {

    return declare("motor.gis.map._Symbol", [_Object], {

        map : null,

        init : function () {
            this.inherited(arguments);

            this._distanceStartSymbolUrl = "script/lib/motor-for-dojo/images/markers/distanceStart.png";
            this._distanceEndSymbolUrl = "script/lib/motor-for-dojo/images/markers/distanceEnd.png";
            this._positionSymbolUrl = this._distanceStartSymbolUrl;
        },

        createPictureMarkerSymbol : function(url, width, height, offsetX, offsetY) {
            if(!url) {
                throw new Error("not param url!");
            }
            width = width || 30;
            height = height || 30;
            offsetX = offsetX || 0;
            offsetY = offsetY || 14;
            var symbol = new PictureMarkerSymbol(url, width, height);
            symbol.setOffset(offsetX, offsetY);
            return symbol;
        },

        createStartSymbol : function () {
            return this.createPictureMarkerSymbol(this._distanceStartSymbolUrl, 30, 30, 0, 14);
        },

        createEndSymbol : function () {
            return this.createPictureMarkerSymbol(this._distanceEndSymbolUrl, 32, 32, 0, 14)
        },

        createPositionSymbol : function () {
            return this.createPictureMarkerSymbol(this._positionSymbolUrl, 30, 30, 0, 14);
        },
        
        createTransitionSymbol : function () {
            var symbol = new SimpleMarkerSymbol();
            symbol.style = SimpleMarkerSymbol.STYLE_CIRCLE;
            symbol.setSize(12);
            symbol.setColor("#FF00CC");
            return symbol;
        },

        createColorCircleSymbol : function (color, size) {
            size = size || 12;
            var symbol = new SimpleMarkerSymbol();
            symbol.style = SimpleMarkerSymbol.STYLE_CIRCLE;
            symbol.setSize(size);
            symbol.setColor(color);
            return symbol;
        },

        createColorCenterNoneSymbol : function (color, size) {
            size = size || 12;
            var lineSymbol = this.createLineSymbol(null, color, 3);
            var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, size, lineSymbol, "#ffffff");
            return symbol;
        },

        createTextSymbol : function (text, offsetX, offsetY, isBold, color, size) {
            var symbol =  new TextSymbol(text);
            size = size || "12pt";
            offsetX = offsetX || 55;
            offsetY = offsetY || -5;
            isBold = isBold || true;
            symbol.setOffset(offsetX,offsetY);
            if(isBold) {
                var font = new Font(size, Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD,"Courier");
                symbol.setFont(font);
            }
            if(color) {
                var c = new Color();
                c.setColor(color);
                symbol.setColor(c);
            }
            return symbol;
        },

        createCenterPointText : function (text, color) {
            color = color || "#ffffff";
            return this.createTextSymbol(text, null, null, true, color, "14pt");
        },

        createLineSymbol : function (style, color, size) {
            style = style || SimpleLineSymbol.STYLE_SOLID;
            color = color || new Color([255, 0, 0]);
            size = size || 2;
            var symbol = new SimpleLineSymbol(style, color, size);
            return symbol;
        },

        createFillSymbol : function (style, color, borderStyle, borderColor, borderWidth) {
            style = style || SimpleFillSymbol.STYLE_SOLID;
            color =  color || new Color([0, 0, 0, 0.25]);
            borderStyle = borderStyle || SimpleLineSymbol.STYLE_SOLID;
            borderColor = borderColor || "#FF0000";
            borderWidth = borderWidth || 1;
            var symbol = new SimpleFillSymbol(style, new SimpleLineSymbol(borderStyle, borderColor, borderWidth), color);
            return symbol;
        },

        createBorderFillSymbol : function (borderStyle, borderColor, borderWidth) {
            return this.createFillSymbol(null, new Color([0, 0, 0, 0]), borderStyle, borderColor, borderWidth);
        },

        createDashDotDotFillSymbol : function (borderColor, borderWidth) {
            return this.createFillSymbol(null, new Color([0, 0, 0, 0]), SimpleLineSymbol.STYLE_DASHDOTDOT, borderColor, borderWidth);
        },

        createTransparentFillSymbol : function () {
            return this.createFillSymbol(null, new Color([255, 255, 255, 0]), null, new Color([255, 255, 255, 0]));
        },

        createColorFillSymbol : function (color) {
            var c = new Color();
            c.setColor(color);
            var rgb1 = c.toRgb();
            var rgb2 = c.toRgb();
            rgb1.push(0.2);
            rgb2.push(0.7);
            return this.createFillSymbol(null, new Color(rgb1), null, new Color(rgb2));
        }
    });
});