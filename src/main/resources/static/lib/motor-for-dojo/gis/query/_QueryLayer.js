define("motor/gis/query/_QueryLayer", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/connect",
    "motor/_base/_Object",

    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/tasks/FindTask",
    "esri/tasks/FindParameters"
], function (declare, lang, connect, _Object,
             QueryTask, Query, IdentifyTask, IdentifyParameters, FindTask, FindParameters) {

    return declare("motor.gis.query._QueryLayer", [_Object], {

        map : null,

        init : function () {
            this.inherited(arguments);
        },

        addQueryTask : function(params, callback, scope) {
            var me = this;
            if(!params) {
                throw new Error("not a have params");
            }
            if(!params.url) {
                throw new Error("not a have url");
            }
            params.where = params.where || '1=1';
            var queryTask = new QueryTask(params.url);
            var query = new Query();
            query.outSpatialReference = this.map.spatialReference;
            query.where = params.where;
            query.returnGeometry = true;
            query.outFields = ['*'];
            queryTask.execute(query, function(result) {
                if(callback && lang.isFunction(callback)) {
                    scope = scope || me;
                    callback.call(scope, result);
                }
            });
        },

        addIdentifyTask : function(params, callback, scope) {
            if(!params) {
                throw new Error("not a have params");
            }
            if(!params.url) {
                throw new Error("not a have url");
            }
            if(!params.layerIds) {
                throw new Error("not a have layerIds");
            }
            if(!params.extent) {
                throw new Error("not a have extent");
            }

            var me = this;
            var identifyTask = new IdentifyTask(params.url);
            var identifyParams = new IdentifyParameters();
            identifyParams.tolerance = 0;
            identifyParams.returnGeometry = params.returnGeometry;
            identifyParams.layerIds = params.layerIds;
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.mapExtent = params.extent;
            identifyParams.geometry = params.extent;
            identifyTask.execute(identifyParams, function(result) {
                if(callback && lang.isFunction(callback)) {
                    scope = scope || me;
                    callback.call(scope, result);
                }
            });
        },

        addFindTask : function (params, callback, scope) {
            if(!params) {
                throw new Error("not a have params");
            }
            if(!params.url) {
                throw new Error("not a have url");
            }
            if(!params.layerIds) {
                throw new Error("not a have layerIds");
            }
            if(!params.extent) {
                throw new Error("not a have extent");
            }

            var me = this;
            var search = params.search || '';

            var findTask = new FindTask(params.url);
            var findParams = new FindParameters();
            findParams.returnGeometry = true;
            findParams.contains = false;

            //设置搜索字
            findParams.searchText = '?' +search + '?';
            findParams.layerIds = params.layerIds;

            findTask.execute(findParams, function(result){
                if(callback && lang.isFunction(callback)) {
                    scope = scope || me;
                    callback.call(scope, result);
                }
            }, function(err){
                callback.call(scope, {msg : '要素查询失败', code : -1});
            });
        }
    });
})