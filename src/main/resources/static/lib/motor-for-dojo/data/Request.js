define("motor/data/Request", [
"dojo/_base/lang",
"motor/data/Connection",
"dojo/_base/kernel",
"dojo/json",
"dojo/io/iframe",
"dojo/dom-construct"
], function(lang, Connection, kernel, json, iframe, domC) {
	
	function executeCallback(callback, response, scope) {
		var result = json.parse(response.responseText);
		if(result.code > 0) {
			callback.call(scope, true, result);
		} else {
			if(result) {
				$.motor.dangerInfo(result.message || result.msg || result.info);
			} /*else if(result.exceptionflag != null && result.exceptionflag == 'no_session') {
				alert("您需要重新登录！");
				window.location.href = HOSTNAME_AND_PATH_TO_JSAPI + "/sys/logout";
			}*/
            callback.call(scope, false, result);
		}
	};
	
	var request = {
		
		put : function(url, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				method : 'PUT',
				callback : function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		get : function(url, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				method : 'GET',
				callback :  function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		syncGet : function(url, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				method : 'GET',
				async : false,
				callback :  function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		post : function(url, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				method : 'POST',
				callback :  function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		syncPost : function(url, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				method : 'POST',
				async : false,
				callback :  function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		del : function(url, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				method : 'DELETE',
				callback :  function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		upload : function(url, form, params, callback, scope) {
			params = params || {};
			Connection.request({
				url : url,
				params : params,
				form : form,
				method : 'POST',
				callback :  function(options, success, response) {
					if(success) {
						executeCallback(callback, response, scope);
					}
				},
				scope : scope
			});
		},
		
		download : function(url, params) {
			params = params || {};
			var form, addFiled, hiddens=[];
			form = domC.create("form", {
				style : 'display : none;',
				action : url,
				method : 'POST'
			}, document.body);
			addFiled = function(key, value) {
				var hiddenFiled = domC.create("input", {
					name : key,
					value : value,
					type : 'hidden'
				}, form);
				hiddens.push(hiddenFiled);
			};
			
			for(var key in params) {
				addFiled(key, params[key]);
			}
			
			form.submit();
			
			for(var i=0; i<hiddens.length; i++){
				domC.destroy(hiddens[i]);
			}
			domC.destroy(form);
		}
	};
	
	return request;
});