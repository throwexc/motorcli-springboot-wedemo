define("motor/widget/Tree",[
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/Tree",
    "dojo/data/ItemFileWriteStore",
    "dijit/tree/ForestStoreModel",

    "motor/_base/_Object"
], function(declare, domC, Tree, ItemFileWriteStore, ForestStoreModel, _Object) {

    var tree = declare("motor.common.widget.Tree", [Tree, _Object], {
        url: '',

        // 跟节点显示
        showRoot: false,

        // treeNode 单项选择。 false： 多选
        singular: true,

        nodeIconClass : '',
        childrenIconClass : '',

        postCreate: function() {
            if(this.nodeIconClass != '' && this.childrenIconClass != '') {
                this.getIconClass = function(item, opened) {
                    return item.children ? this.nodeIconClass : this.childrenIconClass;
                };
            }
            this.loadMsg = domC.create('label', {innerHTML: '正在加载...'});
            this.domNode.appendChild(this.loadMsg);

            var store = null;

            if(this.url != '') {
                store = new ItemFileWriteStore({url: this.url});
            } else {
                store = new ItemFileWriteStore({data: {items : []}});
            }

            this.model = new ForestStoreModel({
                store: store,
                showRoot: this.showRoot,
                singular : this.singular
            });

            this.inherited(arguments);

            this.resize();
        },

        onLoad: function() {
            this.loadMsg.style.display = 'none';
            this.onLoaded();
        },

        clearSelected : function() {
            this.set("selectedItems", null);
            this.selectedItem = null;
            this.selectedItems = null;
        },

        getSelected :  function() {
            if(this.selectedItems == null || this.selectedItems.length == 0) {
                return this.formatItem(this.selectedItem);
            } else {
                return this.formatItem(this.selectedItems[0]);
            }
        },

        isSelected : function() {
            var selected = this.getSelected();
            if(selected == null || selected.length == 0) {
                return false;
            } else {
                return true;
            }
        },

        addNode : function(item) {
            var me = this;
            this.model.store.newItem(item, {parent: this.selectedItem, attribute:"children"});
            this.model.store.save();
        },

        updateSelectedNode : function(item, idKey) {
            var me = this;
            var id = this.model.store._features["dojo.data.api.Identity"] || idKey;
            for(var key in item) {
                if(key != id) {
                    this.model.store.setValues(this.selectedItem, key, [item[key]]);
                }
            }
            this.model.store.save();
        },

        deleteNode : function() {
            var me = this;
            this.tree.model.store.deleteItem(this.get('selectedItem'));
        },

        onLoaded : function() {

        },

        onPaneClick : function(){

        },

        destroy : function() {
            this.inherited(arguments);
        }
    });

    return tree;
});