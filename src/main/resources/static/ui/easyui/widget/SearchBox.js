define("easyui/widget/SearchBox", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-style",
    "easyui/widget/_base/_EasyUiWidget"
], function (declare, lang, domStyle, _EasyUiWidget) {

    return declare("easyui.widget.SearchBox", [_EasyUiWidget], {
        templateString : '<div class="motor-search-box"><input type="text" name="${name}" style="${domStyle}" /></div>',

        name : 'search',
        domStyle : '',

        width : 180,

        prompt : '请输入关键字搜索',

        validType: null,

        _setupSetting : function () {
            var me = this;
            return {
                width : this.width,
                prompt : this.prompt,
                validType : this.validType,
                searcher : function (value, name) {
                    me.onSearch(value, name);
                }
            };
        },

        validate : function () {
            var isValid =  this.$input.searchbox('isValid');
            return isValid;
        },

        /*********** 组件渲染 ***********/
        buildRendering : function() {
            var $srcNodeRef = $(this.srcNodeRef);
            if($srcNodeRef.attr("name")) {
                this.name = $srcNodeRef.attr("name");
            }
            if($srcNodeRef.attr("style")) {
                this.domStyle = $srcNodeRef.attr("style");
            }
            this.inherited(arguments);

            var $domNode = $(this.domNode);
            var $input = $domNode.find("input");
            var setting = this._setupSetting();

            if(lang.isString(setting.width)) {
                $domNode.css("width", setting.width);
                $input.css("width", setting.width);
            }

            this.$input = $input;

            $input.searchbox(setting);
        },
        focus : function () {
            var me = this;
            setTimeout(function () {
                me.$domNode.find('input.textbox-text').focus();
            }, 50);
        },

        reset : function () {
            this.$input.searchbox("setValue", '');
        },

        onSearch : function (value, name) {

        }
    });
});