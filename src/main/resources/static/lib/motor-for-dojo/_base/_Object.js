define("motor/_base/_Object", [
    "dojo/_base/declare",
    "dojo/_base/lang"
], function (declare, lang) {

    return declare("motor._base._Object", null, {

        constructor : function(config) {
            lang.mixin(this, config);
            this.init();
        },

        init : function() {}
    });
});