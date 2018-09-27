define("easyui/_base/_TabLinkPane", [
    "dojo/_base/declare",
    "easyui/_base/_TabPane"
], function (declare, _TabPane) {

    return declare("easyui._base._TabLinkPane", [_TabPane], {

        url : '/link',

        onLoad : function ($panle) {
            $panle.css({
                overflow : 'hidden'
            });
        }
    });
});