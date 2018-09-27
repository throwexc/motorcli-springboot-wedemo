define("motor/widget/Select", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-construct",

	"dijit/popup",
	"dijit/form/Select",
	"dijit/layout/BorderContainer",
	"dijit/Toolbar"

], function(declare, lang, domAttr, domClass, domGeometry, domConstruct,
			popup, Select, BorderContainer, Toolbar) {
	
	var select = declare("motor.widget.Select", [Select], {
		
		title : '',
		height : 200,
		width : 0,

		style : 'width : 100%;',
		
		_fillContent: function(){
			var style = "";
			if(this.height != 0) {
				style += "height : " + this.height + "px;";
			}
			if(this.width != 0) {
				style += "width : " + this.width + "px;"
			}
			this.dropDown = new BorderContainer({
				style : style
			});
			this.initTitle();
			this.initContent();
		},
		
		_setValueAttr: function(value){
			this.value = value;
			this.inherited(arguments);
			domAttr.set(this.valueNode, "value", value);
			this._refreshState();
		},

		openDropDown: function(){
			// summary:
			//		Opens the dropdown for this widget.   To be called only when this.dropDown
			//		has been created and is ready to display (ie, it's data is loaded).
			// returns:
			//		return value of dijit/popup.open()
			// tags:
			//		protected

			var dropDown = this.dropDown,
				ddNode = dropDown.domNode,
				aroundNode = this._aroundNode || this.domNode,
				self = this;

			var retVal = popup.open({
				parent: this,
				popup: dropDown,
				around: aroundNode,
				orient: this.dropDownPosition,
				maxHeight: this.maxHeight,
				onExecute: function(){
					//self.closeDropDown(true); //TODO 解决输入框移开焦点自动关闭的BUG
				},
				onCancel: function(){
					self.closeDropDown(true);
				},
				onClose: function(){
					domAttr.set(self._popupStateNode, "popupActive", false);
					domClass.remove(self._popupStateNode, "dijitHasDropDownOpen");
					self._set("_opened", false);	// use set() because _CssStateMixin is watching
				}
			});

			// Set width of drop down if necessary, so that dropdown width + width of scrollbar (from popup wrapper)
			// matches width of aroundNode
			if(this.forceWidth || (this.autoWidth && aroundNode.offsetWidth > dropDown._popupWrapper.offsetWidth)){
				var resizeArgs = {
					w: aroundNode.offsetWidth - (dropDown._popupWrapper.offsetWidth - dropDown.domNode.offsetWidth)
				};
				if(lang.isFunction(dropDown.resize)){
					dropDown.resize(resizeArgs);
				}else{
					domGeometry.setMarginBox(ddNode, resizeArgs);
				}
			}

			domAttr.set(this._popupStateNode, "popupActive", "true");
			domClass.add(this._popupStateNode, "dijitHasDropDownOpen");
			this._set("_opened", true);	// use set() because _CssStateMixin is watching

			this._popupStateNode.setAttribute("aria-expanded", "true");
			this._popupStateNode.setAttribute("aria-owns", dropDown.id);

			// Set aria-labelledby on dropdown if it's not already set to something more meaningful
			if(ddNode.getAttribute("role") !== "presentation" && !ddNode.getAttribute("aria-labelledby")){
				ddNode.setAttribute("aria-labelledby", this.id);
			}

			return retVal;
		},
		
		initTitle : function() {
			if(this.title && this.title != '') {
				this.titlePane = new Toolbar({region : 'top'}).placeAt(this.dropDown);
				domConstruct.create('b', {innerHTML: '&nbsp;&nbsp;<b>[' + this.title + ']</b>'}, this.titlePane.domNode);
			}
		},
		
		initContent : function() {
			
		},
		
		loadDropDown: function(/*Function*/ loadCallback){
			loadCallback();
		},
		
		reset : function() {
			this._setValueAttr('');
			this._setDisplay('');
		}
	});
	
	return select;
});
