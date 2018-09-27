require(["dojo/ready", "motor/init",
    "main/MainIndex",
    "easyui/widget/_base/_EasyUiWidget"
], function (ready, init, MainIndex, _EasyUiWidget) {
    //_EasyUiWidget.prototype.cls = 'c5';
    ready(function () {
        new MainIndex();
    });
});