define("easyui/widget/CheckBoxTree", [
    "dojo/_base/declare",
    "easyui/widget/Tree"
], function (declare, Tree) {

    return declare("easyui.widget.CheckBoxTree", [Tree], {

        checkbox : true
    });
});