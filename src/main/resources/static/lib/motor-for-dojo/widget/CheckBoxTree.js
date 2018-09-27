define("motor/widget/CheckBoxTree",[
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-construct",

    "dijit/Tree",
    "dijit/form/CheckBox",

    "dijit/tree/ForestStoreModel",
    "dojo/data/ItemFileWriteStore",

    "motor/_base/_Object"
], function(declare, array, lang, domClass, domC, Tree, CheckBox, ForestStoreModel, ItemFileWriteStorem, _Object) {

    var sore = declare("motor.widget.CheckBoxTree._Stroe", [ForestStoreModel], {
        // checkboxAll: Boolean
        //		如果为true,  则树的每个结点前都加一个'CheckBox', 否则必须由 dojo.data 指明
        checkboxAll: true,

        // checkboxState: Boolean
        //		每个 'CheckBox' 的默认状态, 可以由 dojo.data 指明
        checkboxState: false,

        // checkboxRoot: Boolean
        //		如果为true, 则为根节点添加一个 'CheckBox', 即使根节点不在 dojo.data 中
        //		该属性是建立在 showRoot 属性之上的, 如果showRoot为false, 则该节点不予显示
        checkboxRoot: true,

        // checkboxStrict: Boolean
        //		如果为true, 则当子节点被选中时, 父节点同时状态变更, 当父节点被选中时, 子节点状态同时状态变更
        checkboxStrict: true,

        // checkboxIdent: String
        //		指定 'CheckBox' 的状态跟据 dojo.data.item 中的特定数据判断状态
        checkboxIdent: "checked",

        // checkboxMState: String
        //		指定 'CheckBox' 的状态是否为混合状态。
        //		如果不为混合状态, 则 'CheckBox' 为默认状态 checked/unchecked
        //		如果为混合状态, 则 'CheckBox' 为 true 或 false
        checkboxMState: "mixed",

        updateCheckbox: function(/*dojo.data.Item*/ storeItem, /*Boolean*/ newState) {
            // summary:
            //		更新 'CheckBox' 状态 (true/false), 并更新该 dojo.data.Item 状态与其父子节点的状态
            // description:
            //		更新父子节点的 'CheckBox'（如果有的话）。当用户点击某个节点时，这个函数被调用。
            //		如果'checkboxStrict'设置为true, 父子节点将保持一致性。
            //	storeItem:
            //		dojo.data.Item 类型对象
            //	newState:
            //		更新状态 (true/false)
            //	example:
            //		model.updateCheckboxState(item, true);
            //
            if(!this.checkboxStrict) {
                this._setCheckboxState(storeItem, newState, false);		// 只更新当前节点
            } else {
                this._updateChildCheckbox(storeItem, newState);			// 更新父子节点
            }
        },

        getCheckboxState: function(/*dojo.data.Item*/ storeItem) {
            // summary:
            //		获取该 dojo.data.Item 的状态从 dojo.data.store 中
            // description:
            //		一个 'CheckBox' 有三种状态 (true / false / undefined)
            //		如果 checkboxIdent 属性没有定义, 则采取下例方案：
            //			a) 如果当前 'CheckBox' 的状态为 undefined, 则根据 (checkboxAll || checkboxRoot) 来给定默认状态 (checkboxState)
            //			b) 如果当前 'CheckBox' 的状态为 undefined, 并 checkboxAll 为 false, 则返回 undefined, 这将造成该节点不带有 'CheckBox'
            //
            //	storeItem:
            //		dojo.data.Item 类型对象
            //	example:
            //		var currState = model.getCheckboxState(item);
            //
            var state = {checked: undefined, mixed: false, disabled:false};	// 创建初始状态

            //处理 root 节点
            if (storeItem == this.root) {
                if(typeof(storeItem.checkbox) == "undefined") {
                    this.root.checkbox = undefined;		// 创建不带复选框的根节点
                    this.root.mixedState = false;
                    if(this.checkboxRoot) {
                        this._setCheckboxState( storeItem, this.checkboxState, false);
                        state.checked = this.checkboxState;
                    }
                } else {
                    state.checked = this.root.checkbox;
                    state.mixed	  = this.root.mixedState;
                }
            } else {
                state.checked = this.store.getValue(storeItem, this.checkboxIdent);
                state.mixed	  = this.store.getValue(storeItem, this.checkboxMState);
                state.disabled = this.store.getValue(storeItem, "disabled")|| state.disabled;
                if(state.checked == undefined && this.checkboxAll) {
                    this._setCheckboxState(storeItem, this.checkboxState, false);
                    state.checked = this.checkboxState;
                }
            }
            return state ; // 返回 (true/false or undefined)
        },

        _setCheckboxState: function(/*dojo.data.Item*/ storeItem, /*Boolean*/ newState, /*Boolean*/ mixedState) {
            // summary:
            //		在 dojo.data.Store 中更新 dojo.data.Item 的状态
            // description:
            //		更新 dojo.data.Item 状态, 并出发 onCheckboxChange 事件
            //	storeItem:
            //		dojo.data.Item 类型对象
            //	newState:
            //		更新状态  true / false
            //	mixedState:
            //		是否为混合状态, 即该节点下的子节点状态并非全部
            //	example:
            //		model.setCheckboxState(item, true, false);
            //
            var stateChanged = true;

            if( storeItem != this.root ) {
                var currState = this.store.getValue(storeItem, this.checkboxIdent);
                var currMixed = this.store.getValue(storeItem, this.checkboxMState);
                if((currState != newState || currMixed != mixedState) && (currState !== undefined || this.checkboxAll)) {;
                    this.store.setValue(storeItem, this.checkboxIdent, [newState]);
                    this.store.setValue(storeItem, this.checkboxMState, [mixedState]);
                } else {
                    stateChanged = false;
                }
            } else {
                if((this.root.checkbox != newState || this.root.mixedState != mixedState) &&  (this.root.checkbox !== undefined || this.checkboxRoot )) {
                    this.root.checkbox   = newState;
                    this.root.mixedState = mixedState;
                } else {
                    stateChanged = false;
                }
            }
            if(stateChanged) {
                this.onCheckboxChange(storeItem, mixedState);
            }
            return stateChanged;
        },

        _updateChildCheckbox: function(/*dojo.data.Item*/ storeItem, /*Boolean*/ newState) {
            //	summary:
            //		更新爷子节点的状态 (true / false)
            //	description:
            //		如果父节点状态发生变化，所有的子节点和递归向下的所有节点将更新，以反映变化。
            //	storeItem:
            //		dojo.data.Item 类型对象
            //	newState:
            //		更新状态  true / false
            if(this.mayHaveChildren(storeItem)) {
                this.getChildren(storeItem, lang.hitch( this,
                    function(children) {
                        array.forEach(children, function(child) {
                            this._updateChildCheckbox(child, newState);
                        }, this);
                    }),
                    function(err) {
                        console.error(this, ": updating child checkboxes: ", err);
                    });
            } else {
                if(this._setCheckboxState(storeItem, newState, false)) {
                    this._updateParentCheckbox(storeItem);
                }
            }
        },

        _updateParentCheckbox: function(/*dojo.data.Item*/ storeItem ) {
            //	summary:
            //		更新父节点状态, 这将取决于子节点的状态
            //	description:
            //		如果该节点的状态为 true, 则父节点将受到更新， 如果为 false, 则如果父节点下已经没有为 true 状态的子节点，父节点也将受到更新
            //	storeItem:
            //		dojo.data.Item 类型对象
            var parents = this._getParentsItem( storeItem);
            array.forEach(parents, function(parentItem) {
                this.getChildren(parentItem, lang.hitch( this,
                    function(children) {
                        var hasChecked   	= false,
                            hasUnChecked 	= false,
                            isMixed			= false;
                        array.some(children, function(child) {
                            state = this.getCheckboxState(child);
                            isMixed |= state.mixed;
                            switch(state.checked) {
                                case true:
                                    hasChecked = true;
                                    break;
                                case false:
                                    hasUnChecked = true;
                                    break;
                            }
                            return isMixed;
                        }, this );
                        isMixed |= !(hasChecked ^ hasUnChecked);
                        if( this._setCheckboxState(parentItem, isMixed ? true: hasChecked, isMixed ? true: false)) {
                            this._updateParentCheckbox(parentItem);
                        }
                    }),
                    function(err) {
                        console.error(this, ": fetching mixed state: ", err);
                    });
            }, this );
        },

        _getParentsItem: function(/*dojo.data.Item*/ storeItem) {
            // summary:
            //		获取向上递归的所有父节点
            //	storeItem:
            //		dojo.data.Item 类型对象
            var parents = [];

            if(storeItem != this.root) {
                var references = storeItem[this.store._reverseRefMap];
                for(itemId in references) {
                    parents.push(this.store._itemsByIdentity[itemId]);
                }
                if (!parents.length) {
                    parents.push(this.root);
                }
            }
            return parents ;
        },

        validateData: function(/*dojo.data.Item*/ storeItem, /*thisObject*/ scope) {
            if(scope.checkboxStrict) {
                try {
                    scope.store._forceLoad();
                } catch(e) {
                    console.log(e);
                }
                lang.hitch(scope, scope._validateStore) (storeItem);
            }
        },

        _validateStore: function(/*dojo.data.Item*/ storeItem) {
            this.getChildren(storeItem, lang.hitch( this,
                function(children) {
                    var hasGrandChild = false,
                        oneChild	  = null;
                    array.forEach(children, function(child) {
                        if( this.mayHaveChildren(child)) {
                            this._validateStore(child);
                            hasGrandChild = true;
                        } else {
                            oneChild = child;
                        }
                    },this);
                    if(!hasGrandChild && oneChild) {
                        this._updateParentCheckbox(oneChild);
                    }
                }),
                function(err) {
                    console.error(this, ": validating checkbox data: ", err);
                }
            );
        },

        onCheckboxChange: function(/*dojo.data.Item*/ storeItem) {
            // summary:
            //		'CheckBox' 状态改变事件
        }
    });

    var treeNode = declare("motor.widget.CheckBoxTree._TreeNode", [Tree._TreeNode], {
        _checkbox: null,

        _setCheckedState: function(/*Object*/ state) {
            // summary:
            //		更新 'CheckBox' 值
            if(this.tree.checkboxMultiState) {
                this._checkbox.attr('value', state.mixed ? "mixed" : state.checked ? "checked" : "unchecked" );
            } else {
                this._checkbox.attr('value', state.checked ? "checked" : "unchecked" );
            }
            this._checkbox.attr('checked', state.checked );
            this._checkbox.attr('disabled', state.disabled );
        },

        _getCheckedState: function() {
            // summery:
            //		获取 'CheckBox' 值
            return this._checkbox.checked;
        },

        _createCheckBox :function () {
            var me = this;
            var	state = this.tree.model.getCheckboxState(this.item);

            if(state.checked !== undefined) {
                this._checkbox = new CheckBox({
                    onClick : function (e) {
                        me.tree._onCheckboxClick.call(me.tree, me, this, e);
                    }
                }).placeAt(this.expandoNode,'after');
                this._setCheckedState(state);
            }
            if(this.isExpandable) {
                if (!this.tree.branchIcons) {
                    domClass.removeClass(this.iconNode,"dijitTreeIcon");
                }
            } else {
                if(!this.tree.nodeIcons) {
                    domClass.removeClass(this.iconNode,"dijitTreeIcon");
                }
            }
        },

        buildRendering : function() {
            this.inherited(arguments);

            this._createCheckBox();
        },

        destroy : function() {
            this.inherited(arguments);
        }
    });

    var tree = declare("motor.widget.CheckBoxTree", [Tree, _Object], {

        // checkboxMultiState: Boolean
        //		该值是必须的, 默认为 true, 如果为 false 'CheckBox' 将只能为 'checked' or 'unchecked', 否则, 为混合状态 'checked', 'unchecked' or 'mixed'
        checkboxMultiState: true,

        // branchIcons: Boolean
        //		图标显示
        branchIcons: true,

        // nodeIcons: Boolean
        //		叶子图标的显示
        nodeIcons: true,

        //url
        url: '',

        //show root
        showRoot: false,

        model : null,

        _createTreeNode: function(args) {
            // summary:
            //		创建一个 Tree Node
            return new treeNode(args);
        },

        _onCheckboxClick : function (node, checkbox, e) {
            this._publish("execute", {item: node.item, node: node});
            this.model.updateCheckbox(node.item, node._getCheckedState());
            if(node._getCheckedState()) {
                this.onNodeChecked(node.item, node, true);
            } else {
                this.onNodeUnchecked(node.item, node, false);
            }
        },

        _onCheckboxChange: function(/*dojo.data.Item*/ storeItem) {
            // summary:
            //		'CheckBox' 值改变时调用
            var model 	 = this.model,
                state	 = model.getCheckboxState(storeItem),
                identity = model.getIdentity(storeItem),
                nodes 	 = this._itemNodesMap[identity];

            if(nodes) {
                array.forEach( nodes, function(node) {
                    if(node._checkbox != null)
                        node._setCheckedState(state);
                }, this );
            }
        },

        //  summary:
        //		向下递归获取被选的节点
        //	parent :
        //		父节点
        //	array :
        //		要返回的数组
        _getChildrenChecked : function(parent, checkedArrayy) {
            if('children' in parent && parent.children.length > 0) {
                var children = parent.children;
                array.forEach(parent.children, function (child, index) {
                    if(child.checked[0] === true) {
                        checkedArrayy.push(child);
                    }
                    this._getChildrenChecked(child, checkedArrayy);
                }, this);
            }
        },

        //  summary:
        //		获取被选的所有节点
        getCheckedItems : function() {
            var me = this;
            var store = this.model.store;
            var items = new Array();
            store.fetch({
                onItem: function(item) {
                    if(item.checked[0] === true) {
                        items.push(item);
                    }
                    me._getChildrenChecked.call(me, item, items);
                }
            });
            return items;
        },

        buildRendering : function() {
            var store = null;
            if(this.url != '') {
                store = new ItemFileWriteStorem({url: this.url});
            } else {
                store = new ItemFileWriteStorem({data: {items : []}});
            }

            this.model = new sore({
                store: store,
                showRoot: this.showRoot,
                singular : true
            });

            this.connect(this.model, "onCheckboxChange", "_onCheckboxChange");
            this.model.validateData(this.model.root, this.model);

            this.inherited(arguments);
            this.loadMsg = domC.create('label', {innerHTML: '正在加载...'});
            this.domNode.appendChild(this.loadMsg);

            this.resize();
        },

        onNodeChecked : function (item, node, checked) {
        },

        onNodeUnchecked : function (item, node, checked) {
        },

        onLoad: function() {
            this.loadMsg.style.display = 'none';
            this.model.store.save();
            this.onLoaded();
        },

        onLoaded : function () {

        },

        destroy : function() {
            this.inherited(arguments);
        }
    });

    return tree;
});