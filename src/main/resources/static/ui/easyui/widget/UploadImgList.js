define("easyui/widget/UploadImgList", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_Container",

    "easyui/widget/UploadDialog"
], function (declare, array, connect, _Widget, _TemplatedMixin, _Container, UploadDialog) {

    var _ImgBox = declare("easyui.widget.UploadImgList._ImgBox", [_Widget, _TemplatedMixin], {

        baseClass : 'motor-data-upload-img-box',

        templateString : '<div></div>',

        data : null,

        displayAlias : true,

        deleteUrl : '',

        isDeleteFile : null,

        isAddBtn : false,

        buildRendering : function() {
            var me = this;
            this.inherited(arguments);

            var $domNode = $(this.domNode);
            var $img = $('<img src="' + this.data.location + '" />');
            $domNode.append($img);

            var $delBtn = $('<img style="width: 16px;height: 16px;float: right; cursor: pointer;margin-left: -16px;" src="image/icon/icon_close.png" />');
            $domNode.append($delBtn);

            $delBtn.click(function () {
                me._onDelete();
            });
        },

        _delete : function () {
            this.getParent().removeChild(this);
        },

        _onDelete : function () {
            $.motor.Request.get(this.deleteUrl, {
                id : this.data.id,
                isDeleteFile : this.isDeleteFile
            }, function (res) {
                this._delete();
            }, this, true, false);
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });

    return declare("easyui.widget.UploadImgList", [_Widget, _TemplatedMixin, _Container], {

        name : null,

        baseClass : 'motor-data-upload-img-list',

        templateString : '<div><table style="width: 100%;"><td data-dojo-attach-point="containerNode" style="padding: 0px;"></td><td style="width: 80px; vertical-align: text-top;" valign="top" class="text-right"><a href="javascript:void(0);" class="addBtn">添加</a></td></table></div>',

        submitParams : null,

        deleteUrl : 'common/file/upload/temp/file/delete',

        isDeleteFile : null,

        isAddBtn : false,

        _onSave : function () {
            this.uploadDialog.reset();
            this.uploadDialog.show();
        },

        buildRendering : function() {
            var me = this;
            this.inherited(arguments);

            this.$domNode = $(this.domNode);
            this.$addBtn =  this.$domNode.find(".addBtn");

            this.$addBtn.linkbutton({
                iconCls : 'icon-add',
                onClick : function () {
                    me._onSave();
                }
            });

            this.addBtnIsHide();
        },

        addBtnIsHide : function () {
            if(this.isAddBtn){
                this.$addBtn.hide();
            }
        },

        postCreate : function () {
            var me = this;
            this.inherited(arguments);
            this.uploadDialog = new UploadDialog({
                accept : 'image/jpeg,image/x-png',
                uploadUrl : 'common/file/upload/temp/file',
                submitParams : this.submitParams,
                displayAlias : this.displayAlias,
                onUploadFinished : function (res) {
                    me.uploadDialog.hide();
                    me.showImg(res);
                }
            });
        },

        setImages : function (items) {
            array.forEach(items, function (item) {
               this.addChild(new _ImgBox({
                   data : item,
                   deleteUrl : this.deleteUrl,
                   isDeleteFile : this.isDeleteFile
               }));
            }, this);
        },

        showImg : function (res) {
            var record = res.record;

            this.addChild(new _ImgBox({
                data : record,
                deleteUrl : this.deleteUrl,
                isDeleteFile : this.isDeleteFile
            }));
        },

        getName : function () {
            return this.name;
        },

        getValue : function () {
            var ids = new Array();
            var children = this.getChildren();
            if(children.length == 0) {
                return null;
            }
            array.forEach(children, function (child) {
                ids.push(child.data.fileId);
            }, this);
            return ids.toString();
        },

        clear : function() {
            var children = this.getChildren();

            array.forEach(children, function (child) {
                this.removeChild(child);
                child.destroy();
            }, this);
        },

        destroy : function () {
            this.inherited(arguments);
        }
    });
});