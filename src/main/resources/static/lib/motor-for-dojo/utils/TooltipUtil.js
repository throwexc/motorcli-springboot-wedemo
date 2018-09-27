define("motor/utils/TooltipUtil", [
"dojo/_base/array",
"dojo/_base/connect"
], function(array, connect) {
	var util = {

		_createTitle : function (title) {
			var htmlStr = '<div style="clear: both;height: 18px;">' +
								'<div style="float: left;"><span class="label label-sm" style="color: #00A3EF;font-weight: bold;font-size: 12px;">' + title + '</span></div>' +
								'<div style="float: right;color: black;"><span style="cursor:pointer;" aria-hidden="true" class="glyphicon glyphicon-remove close-btn label-black"></span></div>'
						  '</div>';
			return $(htmlStr);
		},
		
		_createTooltipObj : function(data) {
			return {
				data : data,
				onShow : function(){},
				onHide : function(){},
				onClick : function() {}
			};
		},
		
		_setupParams : function(params) {
			return {
				className : params.className || 'tip-darkgray',
				bgImageFrameSize : params.bgImageFrameSize || 11,
				offsetX : params.offsetX || -18,
				offsetY : params.offsetY || 5,
				showOn : params.showOn || 'none',
				alignTo : params.alignTo || 'target',
				alignX : params.alignX || 'inner-left',
				showTimeout : params.showTimeout || 100
			};
		},

		addTooltip : function(node, title, data, show, callback, scope, setting, hideOther) {
			var me = this;
			show = show || false;
			if(hideOther == null) {
				hideOther = false;
			}
			data.is_show = show;
			setting = setting || {};
			var tooltip = this._createTooltipObj(data);
			var jqNode = $(node);
			setting = this._setupParams(setting);
			setting.content = function(updateCallback) {
				window.setTimeout(function() {
					var container = $("<div class='text-right motor-tooltip-container'></div>");
					var top = me._createTitle(title);
					var content = callback.call(scope);
					content.css("clear", "both");
					container.append(top);
					container.append(content);
					updateCallback(container);
					container.find('.close-btn').click(function() {
						data.is_show = false;
						tooltip.onHide();
						jqNode.poshytip('hide');
					});
				}, 0);
				return '正在加载...';
			};
			
			jqNode.poshytip(setting);
			jqNode.addClass("motor-tooltip");
			jqNode.data("data", data);

			jqNode.click(function() {
				if(hideOther) {
					me.hideAll();
				}
				var isShow = data.is_show;
				if (!isShow) {
					tooltip.onShow();
					jqNode.poshytip('show');
					data.is_show = true;
				}
				tooltip.onClick();
			});
			if (show) {
				jqNode.poshytip('show');
			}
			
			return tooltip;
		},
		
		removeTooltip : function(node) {
			var $node = $(node);
			var data = $node.data("data");
			$node.unbind("click");
			$node.removeClass("motor-tooltip");
			$node.poshytip('destroy');
		},

		resetTooltip : function () {
			$(".motor-tooltip").each(function () {
				var $this = $(this);
				var data = $this.data("data");
				if(data.is_show) {
					$this.poshytip('hide');
					$this.poshytip('showDelayed', 100);
				}
			});
		},

		removeAll : function () {
			$(".motor-tooltip").each(function () {
				var $this = $(this);
				$this.poshytip("destroy");
			});
			$(".tip-darkgray").remove();
		},

		hideAll : function () {
			$(".motor-tooltip").each(function () {
				var $this = $(this);
				var data = $this.data("data");
				data.is_show = false;
				$this.poshytip("hide");
			});
		},
		
		addControlDialog : function(tooltip, dialog, scope) {
			connect.connect(tooltip, 'onClick', scope, function() {
				dialog.set('data', tooltip.data);
				dialog.hide();
				dialog.show();
			});
		}
	};

	return util;
});