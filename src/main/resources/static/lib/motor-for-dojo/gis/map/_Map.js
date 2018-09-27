define("motor/gis/map/_Map", [
"dojo/_base/declare",
"dojo/_base/array",
"dojo/_base/lang",
"dojo/_base/connect",

"motor/_base/_Object",

"esri/SpatialReference",
"esri/geometry/Extent",
"esri/map",
"esri/layers/ArcGISDynamicMapServiceLayer",
"esri/dijit/BasemapLayer",
"esri/dijit/Basemap",
"esri/dijit/BasemapGallery",
"esri/dijit/OverviewMap",
"esri/dijit/Scalebar"
], function(declare, array, lang, connect, _Object
, SpatialReference, Extent, Map, ArcGISDynamicMapServiceLayer, BasemapLayer, Basemap, BasemapGallery, OverviewMap, Scalebar
) {

    return declare("motor.gis.map._Map", [_Object], {

        map : null,
        baseMaps : null,
        mapUrl : null,
        target : null,

        spatialReference : null,

        defaults : {
            displayGraphicsOnPan : false,
            nav : false,
            logo : false,
            slider : true,
            isZoomSlider : true,
            sliderPosition: "bottom-left",
            sliderStyle : 'large'
        },

        overview : null,

        init : function () {
            this.inherited(arguments);
        },

        createMap : function(params) {
            if(!this.target) {
                throw new Error("not a DOM to create Map!");
            }
            if(params) {
                if(params.wkid && params.extent) {

                    this.spatialReference = new SpatialReference({
                        wkid : params.wkid
                    });
                    delete params.wkid;

                    var extentConfig = {};
                    lang.mixin(extentConfig, params.extent);
                    if(!this.spatialReference) {
                        extentConfig.spatialReference = this.spatialReference;
                    }
                    this.extent = new Extent(extentConfig);
                    delete params.extent;
                    this.defaults.extent = this.extent;
                }

                lang.mixin(this.defaults, params);
            }
            this.map = new Map(this.target, this.defaults);
            return this.map;
        },

        setBaseMaps : function (baseMaps, dom) {
            if(!baseMaps) {
                throw new Error("Must be a base baseMaps parameters!");
                return;
            }

            var baseArray = [];

            array.forEach(baseMaps, function(baseMap) {
                var baseLayers = [];
                if(baseMap.layers) {
                    array.forEach(baseMap.layers, function(layer) {
                        var baseLayer = new BasemapLayer({
                            url : layer.url
                        });
                        baseLayers.push(baseLayer);
                    });
                } else {
                    var baseLayer = new BasemapLayer({
                        url : baseMap.url
                    });
                    baseLayers.push(baseLayer);
                }

                var base = new Basemap({
                    layers : baseLayers,
                    title : baseMap.title
                });

                baseArray.push(base);
            });

            this.basemapGallery = new BasemapGallery({
                showArcGISBasemaps : false,
                basemaps : baseArray,
                map : this.map
            }, dom || null);

            this.basemapGallery.startup();
            connect.connect(this.basemapGallery, 'onSelectionChange', this, function() {
                if(this.overview) {
                    this.overview.destroy();
                    this._createOverView(this.overviewParams, this.overviewDom);
                    this.map.overview = this.overview;
                }
            });
            return this.basemapGallery;
        },

        selectBaseMapByIndex : function(index) {
            this.basemapGallery.select(this.basemapGallery.basemaps[index].id);
        },

        createOverview : function(params, dom) {
            this.overviewDom = dom;
            this.overviewParams = params;
            return this._createOverView(params, dom);

        },

        _createOverView : function(params, dom) {
            params = params || {};
            params.map = this.map;
            if(dom) {
                this.overview = new OverviewMap(params, dom);
            } else {
                params.attachTo = "bottom-left";
                this.overview = new OverviewMap(params);
            }

            this.overview.startup();
            this.map.reposition();
            this.map.overview = this.overview;
            return this.overview;
        },

        createScalebar : function(params, dom) {
            params = params || {};
            params.map = this.map;
            var scalebar = null;
            if(dom) {
                scalebar  = new Scalebar(params, dom);
            } else {
                params.attachTo = "bottom-left";
                params.scalebarUnit ="metric";
                scalebar = new Scalebar(params);
            }
            return scalebar;
        }
    });
});