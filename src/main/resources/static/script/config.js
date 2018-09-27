var dojoConfig = {
    baseUrl: "script/",
    async: true,
    parseOnLoad: true,
    isDebug : false,
    has: {
        "dojo-firebug": true
    },
    packages: [
        { name: "dojo", location: "../webjars/dojo/dojo"},
        { name: "dijit", location: "../webjars/dojo/dijit"},
        { name: "dojox", location: "../webjars/dojo/dojox"},
        //{ name: "esri", location: "../webjars/arcgis/esri"},
        { name: "motor", location: "../lib/motor-for-dojo"},
        { name: "easyui", location: "../ui/easyui"},
        //{ name: "ArcGIS", location : "arcgis"},
        { name: "common", location: 'common'},
        { name: "main", location: "core/main"},
        { name: "sys", location: "core/sys"}
    ]
};

var HOSTNAME_AND_PATH_TO_JSAPI = "http://localhost:8080";
var SYS_PATH = "http://localhost:8080";
(function() {

    function getQueryParam(name) {
        var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search.toLowerCase().substr(1)).match(reg);
        if (r != null) return decodeURI(r[2]); //   decodeURIComponent(encodeURIComponent (unescape(r[2])));
        return null;
    }

    var scriptEls = document.getElementsByTagName("script"),
        path = scriptEls[scriptEls.length - 1].src,
        i = 2;

    while (i--) {
        path = path.substring(0, path.lastIndexOf('/'));
    }

    HOSTNAME_AND_PATH_TO_JSAPI = path;
    SYS_PATH = path;
})();