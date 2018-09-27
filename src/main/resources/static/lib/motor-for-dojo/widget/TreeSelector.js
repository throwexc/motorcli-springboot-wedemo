define("motor/widget/TreeSelector",[
"dojo/_base/declare",
"dojo/_base/connect",
"motor/widget/Select",
"dijit/layout/ContentPane",
"motor/widget/Tree"
], function(declare, connect, Select, ContentPane, Tree) {
	
	var treeSelector = declare("motor.widget.TreeSelector", [Select], {
		
		url : '',
		nodeIconClass : '',
		childrenIconClass : '',
		
		initContent : function() {
			this.treePane = new ContentPane({
				style:'background:#FFFFFF;',
				region:'center'
			}).placeAt(this.dropDown);
			
			this.tree = new Tree({
				url: this.url,
				nodeIconClass : this.nodeIconClass,
				childrenIconClass : this.childrenIconClass
			});
			
			this.tree.startup();

			connect.connect(this.tree, 'onDblClick', this, this.selectTreeNode);
			connect.connect(this.tree, 'onLoad', this, this.onLoad);
			
			this.treePane.domNode.appendChild(this.tree.domNode);
		},
		
		_setValueAttr : function(value){
			this.inherited(arguments);
			if(!value || value == '') {
				this._setDisplay('');
				return;
			}
			var store = this.tree.model.store;
			var labelKey = store._labelAttr;
			var item = store._getItemByIdentity(value);
			if(item) {
				this._setDisplay(item[labelKey].toString());
			}
			this.closeDropDown();
		},
		
		selectTreeNode : function(item) {
			var store = this.tree.model.store;
			var label = store.getLabel(item);
			var value = store.getIdentity(item);
			this._setValueAttr(value);
			this.onSelectRecord(item);
		},
		
		onSelectRecord: function(item) {

		},
		
		reload : function(url) {
			this.url = url;
			this.tree.destroy();
			this.treePane.destroy();
			this.initContent();
		},

		onLoad : function () {
			this._set("_isLoaded", true);
		},
		
		reset : function() {
			this.set('value', '');
		}
	});
	
	return treeSelector;
});