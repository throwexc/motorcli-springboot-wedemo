define("sys/setting/widget/UserInfoDialog", [
    "dojo/_base/declare",
    "dojo/_base/connect",
    "easyui/widget/FormDialog"
], function (declare, connect, FormDialog) {

    var _InfoDialog = declare("sys.setting.widget.UserInfoDialog._InfoDialog", [FormDialog], {

        title : '用户信息',

        icon : 'icon-man',

        width : 590,
        height : 260,

        href : 'script/core/sys/setting/widget/user-info-form.html',

        onLoad : function () {
            this.$form = this.$domNode.find(".motor-form");
        }
    });

    var _PasswordDialog = declare("sys.setting.widget.UserInfoDialog._PasswordDialog", [FormDialog], {

        title : '修改密码',

        icon : 'icon-key',

        width : 400,
        height : 220,

        href : 'script/core/sys/setting/widget/user-pass-form.html',

        onLoad : function () {
            this.$form = this.$domNode.find(".motor-form");
        }
    });

    return declare("sys.setting.widget.UserInfoDialog", [FormDialog], {

        title : '用户信息',

        icon : 'icon-man',

        width : 400,
        height : 95,

        href : 'script/core/sys/setting/widget/user-info-dialog.html',

        userInfo : null,

        _initButtons : function () {},

        onLoad : function () {
            this.$userInfoBtn = this.$domNode.find(".userInfoBtn");
            this.$passwordBtn = this.$domNode.find(".passwordBtn");

            this._createInfoDialog();
            this._createPasswordDialog();

            this.events();
        },

        _createInfoDialog : function () {
            this._infoDialog = new _InfoDialog();

            connect.connect(this._infoDialog, 'onSave', this, this.saveUserInfo);
        },

        _createPasswordDialog : function () {
            this._passwordDialog = new _PasswordDialog();

            connect.connect(this._passwordDialog, 'onSave', this, this.saveUserPassword);
        },

        saveUserInfo : function (values) {
            $.motor.Request.jsonPost("sys/user/edit/info", values, function (res) {
                var record = res.record;
                this.userInfo = res.record;
                this._infoDialog.hide();
            }, this, true, true);
        },

        saveUserPassword : function (values) {
            values.userId = this.userInfo.id;

            $.motor.Request.jsonPost('api/sys/user/update/password', values, function (res) {
                this._passwordDialog.hide();
            }, this, true, true);
        },
        
        events : function () {
            var me = this;

            this.$userInfoBtn.click(function () {
                me._infoDialog.setValues(me.userInfo);
                me._infoDialog.show();
            });

            this.$passwordBtn.click(function () {
                me._passwordDialog.reset();
                me._passwordDialog.show();
            });
        },

        destroy : function () {
            if(this._infoDialog) {
                this._infoDialog.destroy();
            }
            if(this._passwordDialog) {
                this._passwordDialog.destroy();
            }
            this.inherited(arguments);
        },
    });
});