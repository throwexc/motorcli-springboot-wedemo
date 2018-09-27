define("easyui/module/gaode/Map", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dijit/_Widget",
    "dijit/_TemplatedMixin"
], function (declare, array, connect,  _Widget, _TemplatedMixin) {

    return declare("easyui.module.gaode.Map", [_Widget, _TemplatedMixin], {

        baseClass : 'motor-map',

        templateString : '<div><div class="motor-map-widget"></div><div class="map-toolbar" style="top: 5px;right: 5px;"> <a href="javascript:void(0);" class="easyui-linkbutton closeTileBtn">关闭影像</a><br><br><a href="javascript:void(0);" class="easyui-linkbutton manageTileBtn">图层管理</a></div></div>',

        isLoad : false,

        buildRendering : function() {
            var me = this;
            this.inherited(arguments);
            this.$domNode = $(this.domNode);
        },

        postCreate : function () {
            this.inherited(arguments);
            this.initMap();
        },

        initMap : function () {
            var me = this;
            var showTile = true;
            this.$form = this.$domNode.find("form");



            this.markers = [];
            this.polygons = [];
            var $closeTileBtn = this.$domNode.find(".closeTileBtn");
            $closeTileBtn.linkbutton({
                iconCls : 'icon-map'
            });

            var $manageTileBtn = this.$domNode.find(".manageTileBtn");
            $manageTileBtn.linkbutton({
                iconCls : 'icon-map'
            });

            var toolBar = new AMap.ToolBar({
                visible: true
            });

            var scale = new AMap.Scale({
                visible: false
            });

            var satellite = new AMap.TileLayer.Satellite();
            var tileLayer = new AMap.TileLayer();
            AMap.plugin('AMap.Geocoder',function(){
                me.geocoder = new AMap.Geocoder();

                var map = new AMap.Map(me.$domNode.find(".motor-map-widget")[0],{
                    resizeEnable: true,
                    zoom: 15,
                    center: [116.480983, 40.0958],
                    layers: [tileLayer,satellite]

                });
                satellite.hide();
                map.addControl(toolBar);
                map.addControl(scale);

                me.map = map;

                $closeTileBtn.click(function () {
                    if(showTile) {
                        $closeTileBtn.find(".l-btn-text").html("关闭影像");
                        satellite.show();
                    } else {
                        $closeTileBtn.find(".l-btn-text").html("打开影像");
                        satellite.hide();
                    }
                    showTile = !showTile;
                });

                $manageTileBtn.click(function () {
                me.creatCheckBoxTree();
                me.LayerDialog.show();

                });


                me.infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -24)
                });

                me.infoWindow.on("open", function () {
                    setTimeout(function () {
                        me.onInfoWindowOpen();
                    }, 200);
                });

                me.isLoad = true;
            });
        },

        layerSearch : function () {
            var map = this.map;
            var me = this;

            var arr = [];
            $.motor.Request.get("api/sys/area/default/areas", {
                id : this.province_id
            }, function(res) {
                var items = [{
                }].concat(res.items);
                arr.push(items);
                var opts = {
                    subdistrict: 3,   //返回下一级行政区
                    level: 'district', //查询级别为区县
                    showbiz:false,  //是否显示商圈
                    extensions : "all" //返回完整行政区边界坐标点
                };
                for(var j=0;j<arr.length ;j++){
                    var adress = arr[j];
                }
                for(var i=0;i<adress.length;i++){
                   adress[i];
                   var ads = adress[1];
                }
                for (var t=0;t<ads.children.length;t++){
                    var asd = ads.children[t];
                    var adName = ads.children[t].name;
                    district = new AMap.DistrictSearch(opts);
                    district.search(adName, function(status, result) {
                        var bounds = result.districtList[0].boundaries;
                        //var polygons = [];
                        if (bounds) {
                            for (var i = 0, l = bounds.length; i < l; i++) {
                                //生成行政区划polygon
                                var polygon = new AMap.Polygon({
                                    map: map,
                                    strokeWeight: 1,
                                    path: bounds[i],
                                    fillOpacity: 0.7,
                                    fillColor: '',
                                    strokeColor: '#000000'
                                });
                                //me.removePolygon();
                                me.polygons.push(polygon);
                            }
                            map.setFitView();//地图自适应
                        }
                    })
                }
            }, this, false, false);

        this.LayerDialog.hide();
        },

        removeMarker : function () {
            this.map.remove(this.markers);
            this.markers = [];
        },

        removePolygon : function () {
            this.map.remove(this.polygons);
            this.polygons = [];
        },

        addMarker : function (lng, lat) {
            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [lng, lat]
            });
            marker.setMap(this.map);
            this.markers.push(marker);
            return marker;
        },


        addCircleMarker : function (lng, lat, color) {
            color = color || "red";
            if(color == "red") {
                color = "r";
            } else {
                color = "b";
            }
            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_" + color + ".png",
                //position: [116.405467, 39.907761],
                //icon: "image/markers/circle_" + color + "_marker.png",
               /* icon: new AMap.Icon({
                    size: new AMap.Size(16, 16),  //图标大小
                    image: "image/markers/circle_" + color + "_marker.png",
                    imageOffset: new AMap.Pixel(-8, -8)
                }),*/
                position: [lng, lat],
                //offset : new AMap.Pixel(0, 0),
                map : this.map
            });
            //marker.setMap(this.map);
            this.markers.push(marker);
            return marker;
        },

        addPolygon : function (bounds, strokeColor, strokeWeight,  fillColor, fillOpacity) {
            strokeColor = strokeColor || '#FF0000';
            strokeWeight = strokeWeight || 3;
            fillColor = fillColor || '#333bff';
            fillOpacity = fillOpacity || 0.7;

            var result = [];

            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    var polygon = new AMap.Polygon({
                        map: this.map,
                        strokeWeight: strokeWeight,
                        strokeColor: strokeColor,
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                        path: bounds[i]
                    });
                    this.polygons.push(polygon);
                    result.push(polygon)
                }
            }

            return result;
        },

        createMarkerInfoWindow : function (marker) {
            var me = this;
            var map = this.map;
            marker.on("click", function (e) {
                me.infoWindow.setContent(e.target.content);
                me.infoWindow.open(map, e.target.getPosition());
            });
        },

        createPolygonInfoWindow : function (polygon, center) {
            var me = this;
            var map = this.map;
            polygon.on("click", function (e) {
                me.infoWindow.setContent(e.target.content);
                me.infoWindow.open(map, center);
            });
        },

        positionPoint : function (adress,province_code,city_code) {
            var me = this;
            var map = this.map;
            if(province_code == "110100") {
                city_code = "010";
            }
            AMap.service('AMap.Geocoder',function(){
                geocoder = new AMap.Geocoder({
                    city: city_code
                });
            })
            if (me.markers.length == 0){
            geocoder.getLocation(adress, function(status, result) {
                if(status=='complete'&&result.geocodes.length){
                    map.setCenter(result.geocodes[0].location);
                    me.removeMarker();
                    me.addMarker(result.geocodes[0].location.lng, result.geocodes[0].location.lat);
                }else{
                    $.motor.info("无法获取地址");
                }
            });}

            this.clickEventListener = this.map.on('click', function(e) {
                var lng = e.lnglat.getLng();
                var lat = e.lnglat.getLat();
                me.removeMarker();
                me.addMarker(lng, lat);

                me.geocoder.getAddress(e.lnglat,function(status,result){
                    if(status=='complete'){
                        me.onPositionFinished(lng, lat, result.regeocode.formattedAddress);
                    }else{
                        $.motor.info("无法获取地址");
                    }
                });
            });

        },

        searchAdress : function (province_code,city_code,district_name, callback, scope) {
            var me = this;
            var map = me.map;
            if(province_code == "110100") {
                city_code = "010";
            }
            AMap.service('AMap.Geocoder',function(){
                geocoder = new AMap.Geocoder({
                    city: city_code
                });
            });

                geocoder.getLocation(district_name, function(status, result) {
                    map.setZoomAndCenter(10);
                    if(status=='complete'&&result.geocodes.length){
                        map.setCenter(result.geocodes[0].location);
                        me.addMarker(result.geocodes[0].location.lng, result.geocodes[0].location.lat);
                        var geocodes = result.geocodes;
                        var findD = null;
                        array.forEach(geocodes, function (d) {
                            if(findD == null) {
                                findD = d;
                            }
                        }, me);
                        if(callback) {
                            scope = scope || me;
                            callback.call(scope, findD);
                        }
                    }else{
                        $.motor.info("无法获取地址");
                    }
                });
        },

        setPositionPoint : function (lng, lat) {
            this.removeMarker();
            this.addMarker(lng, lat);
            this.map.setCenter(AMap.LngLat(lng,lat));
        },

        fitView : function () {
            this.map.setFitView();//地图自适应
        },

        removeClickListener : function () {
            AMap.event.removeListener(this.clickEventListener);
        },

        /**
         * 搜索区县数据
         * @param province_code 区县行政编码
         * @param city_code 城市行政编码
         * @param district_name 区县/乡镇/街道 名称
         * @param callback 回调函数
         * @param scope 作用域
         */
        searchDistrict : function (province_code, city_code, district_name, callback, scope) {
            var me = this;
            if(province_code == "110100") {
                city_code = "010";
            }
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                level: 'district', //查询级别为区县
                showbiz:false,  //是否显示商圈
                extensions : "all" //返回完整行政区边界坐标点
            };
            district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
            district.search(district_name, function(status, result) {
                if(status=='complete'){
                    var districtList = result.districtList;
                    var findD = null;
                    array.forEach(districtList, function (d) {
                        if(findD == null && d.citycode == city_code) {
                            findD = d;
                        }
                    }, me);
                    if(callback) {
                        scope = scope || me;
                        callback.call(scope, findD);
                    }
                }
            });
        },

        clear : function () {
            this.removeMarker();
            this.removePolygon();
            if(this.clickEventListener) {
                this.removeClickListener();
            }
            this.infoWindow.close();
        },

        onPositionFinished : function (lng, lat, address) {

        },

        onInfoWindowOpen : function () {

        },


        destroy : function () {
            this.infoWindow.close();
            this.map.destroy();
            this.inherited(arguments);
        }
    });
});