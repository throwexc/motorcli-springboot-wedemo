define("motor/data/Connection", [
"dojo/_base/lang",
"dojo/dom",
"dojo/dom-construct",
"dojo/_base/connect",
"dojo/string"
], function(lang, dom, domC, connect, String) {

	function isElement(it) {
		return (it === null) || (it === undefined) || (it === '') || (isArray(it) && it.length === 0);
	};

	function isDate(it) {
		if(it instanceof Date) {
			return true;
		} else {
			return false;
		}
	};

	function isEmpty(it) {
		return (it === null) || (it === undefined) || (it === '') || (isArray(it) && it.length === 0);
	};

	function isArray(it) {
		return it && (it instanceof Array || typeof it == "array" || it == []);
	};

	function isNumeric(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	};

	function urlAppend(url, string) {
		if(!isEmpty(string)) {
			return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
		}
		return url;
	};

	function bind(fn, scope, args) {
		var method = fn;
		return function() {
			return method.apply(scope || null, args);
		};
	};

	
	function toQueryObjects(name, values, recursive) {
		var objects = [],
			i, ln;
		if(isArray(values)) {
			for(i=0, ln=values.length; i<ln; i++) {
				if(recursive) {
					objects = objects.concat(toQueryObjects(name + '[' + i + ']', values[i], true));
				} else {
					objects.push({
						name : name,
						value : values[i]
					});
				}
			}
		} else if(lang.isObject(values)) {
			for(i in values) {
				if(recursive) {
					objects = objects.concat(toQueryObjects(name + '[' + i + ']', values[i], true));
				} else {
					objects.push({
						name : name,
						value : values[i]
					});
				}
			}
		} else {
			objects.push({
				name : name,
				value : values
			});
		}
		return objects;
	};
	
	function toQueryString(object, recursive) {
		var paramObjects = [],
			params = [],
			i, j, ln, paramObject, value;
		for(i in object) {
			if(object.hasOwnProperty(i)) {
				paramObjects = paramObjects.concat(toQueryObjects(i, object[i], recursive));
			}
		}
		
		for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;
            if (isEmpty(value)) {
                value = '';
            } else if (isDate(value)) {
                value = value.format("yyyy-MM-dd");
            }
			
            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(""  + value));
        }

        return params.join('&');
	};
	
	function fromQueryString (queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);

                    //<debug error>
                    if (!matchedName) {
                        throw new Error('Malformed query string given, failed parsing name from "' + part + '"');
                    }
                    //</debug>

                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    };
	
	/**
	 * 创建使用你的浏览器的Ajax请求对象
	 */
	function getXhrInstance() {
		var options = [function() {
			return new XMLHttpRequest();
		}, function() {
			 return new ActiveXObject('MSXML2.XMLHTTP.3.0');
		}, function() {
			return new ActiveXObject('MSXML2.XMLHTTP');
		}, function() {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}], i=0, len=options.length, xhr;
		
		for(; i<len; i++) {
			try {
				xhr = options[i];
				xhr();
				break;
			} catch(e){
			}
		}
		
		return xhr();
	};
	
	/**
	 * 序列化Form参数
	 */
	function serializeForm(form) {
		var fElements = form.elements,
            hasSubmit = false,
            encoder   = encodeURIComponent,
            data      = '',
            eLen      = fElements.length,
            element, name, type, options, hasValue, e,
            o, oLen, opt;
		for (e = 0; e < eLen; e++) {
            element = fElements[e];
            name    = element.name;
            type    = element.type;
            options = element.options;

            if (!element.disabled && name) {
                if (/select-(one|multiple)/i.test(type)) {
                    oLen = options.length;
                    for (o = 0; o < oLen; o++) {
                        opt = options[o];
                        if (opt.selected) {
                            hasValue = opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified;
                            data += String.substitute("${name}=${value}", {name : encoder(name), value : encoder(hasValue ? opt.value : opt.text)});
                        }
                    }
                } else if (!(/file|undefined|reset|button/i.test(type))) {
                    if (!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)) {
                        data += encoder(name) + '=' + encoder(element.value) + '&';
                        hasSubmit = /submit/i.test(type);
                    }
                }
            }
        }
	};
	
	/**
	 * 创建IE8以上的Ajax的跨域请求
	 */
	function getXdrInstance() {
		var xdr;

        if (dojo.isIE >= 8) {
            xdr = new XDomainRequest();
        } else {
        	throw new Error("Your browser does not support CORS");
        }

        return xdr;
	};
	
	var conn = {
		statics: {
	        requestId: 0
	    },
	
	    url: null,
	    async: true,
	    method: 'GET',
	    username: '',
	    password: '',
	    
	    BLANK_URL : 'about:blank',
	    
	    /**
	     * @cfg {Boolean} disableCaching
	     * 如果为True, 则禁用GET请示的缓存
	     */
	    disableCaching: true,
	
	    /**
	     * @cfg {Boolean} withCredentials
	     * 表示是否为跨域请求，如果为真则返回服务器相应时，头信息中应加入Access-Control-Allow-Origin ：* （*可以为域地址）
	     */
	    withCredentials: false,
	
	    /**
	     * @cfg {Boolean} cors
	     * 如果为True, 则使用CORS的Ajax对象。该选项是唯一影响是否用户XDomainRequest或使用XMLHttpRequest对象。但只支持IE8以上浏览器
	     */
	    cors: false,
	
	    /**
	     * 是否为XDomainRequest对象
	     */
	    isXdr: false,
	
	    defaultXdrContentType: 'text/plain',
	
	    /**
	     * @cfg {String} disableCachingParam
	     * GET请求的附加参数，用于取消缓存使用
	     */
	    disableCachingParam: '_ct',
	
	    /**
	     * @cfg {Number} timeout
	     * 超时时间
	     */
	    timeout : 300000,
	
	    useDefaultHeader : true,
	    defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
	    useDefaultXhrHeader : true,
	    defaultXhrHeader : 'XMLHttpRequest',
	    
	    requests : {},
	    
	    /**
		 * 获取Form的HTML对象
		 */
		_getForm : function(options) {
			var form = options.form || null;
			if(lang.isString(form)) {
				form = dom.byId(form);
			}
			return form;
		},
		
		/**
		 * 查看Form是否为上传文件的Form
		 */
		_isFormUpload : function(options) {
			var form = this._getForm(options);
	        if (form) {
	            return (options.isUpload || (/multipart\/form-data/i).test(form.getAttribute('enctype')));
	        }
	        return false;
		},
		
		_setupParams : function(options, params) {
			var form = this._getForm(options), sForm;
			if(form && !this._isFormUpload(options)) {
				sForm = serializeForm(form);
				params = params ? (params + '&' + sForm) : sForm;
			}
			return params;
		},
		
		/**
		 * 检查是否有Form,有的话先按Form的Action指向的url
		 */
		_setupUrl : function(options, url) {
			var form = this._getForm(options);
			if(form) {
				url = url || form.action
			}
			return url;
		},
		
		/**
		 * 设置请示时的方法
		 */
		_setupMethod : function(options, method) {
			if(this._isFormUpload(options)) {
				return 'POST';
			}
			return method;
		},
	    
		/**
		 * 设置参数
		 */
	    _setOptions : function(options, scope) {
	    	var params = options.params || {},
				url = options.url || null,
				method,
				disableCaching;
			if(lang.isFunction(params)) {
				params = params.call(scope, options);
			}
			if(lang.isFunction(url)) {
				url = url.call(scope, options);
			}
			url = this._setupUrl(options, url);
			if(!url) {
				console.error("No URL specified");
			}
			if(lang.isObject(params)) {
				params = toQueryString(params);
			}
			
			params = this._setupParams(options, params);
			method = (options.method || this.method || ((params || data) ? 'POST' : 'GET')).toUpperCase();
			
			method = this._setupMethod(options, method);
			
			disableCache = options.disableCaching !== false ? (options.disableCaching || this.disableCaching) : false;
			
			if(method === 'GET' && params) {
				url = urlAppend(url, params);
				params = null;
			}
			
			if(method === 'GET' && disableCache) {
				url  = urlAppend(url, (options.disableCachingParam || this.disableCachingParam) + '=' + (new Date().getTime()));
			}
			
			return  {
				url : url,
				method : method,
				data : params || null
			};
	    },
	    
	     /**
		 * 上传
		 */
		_upload : function(form, url, params, options) {
			if(lang.isString(form)) {
				form = dom.byId(form);
			}
			options = options || {};
			url = url || form.action;
			var id = "_motor_upload_iframe_" + new Date().getTime(),
				hiddens = [],
				encoding = 'multipart/form-data',
				frame = domC.create("iframe", {id : id, name : id, style : 'display: none !important;', src : this.BLANK_URL}, document.body),
				addField = function(name, value) {
					hiddenItem = domC.create("input", {type: 'hidden', value: value, name: name}, form);
					form.appendChild(hiddenItem);
                	hiddens.push(hiddenItem);
				},
				hiddenItem, obj, value, name, vLen, v, hLen, h;
				frame.contentWindow.name = id;
			if (document.frames) {
	            document.frames[id].name = id;
	        }
	        form.target = id;
	        form.action = url;
	        form.method = 'POST';
			form.enctype = encoding;
            form.encoding = encoding;
			
            if (params) {
            	obj = fromQueryString(params) || {};
            	for (name in obj) {
	                if (obj.hasOwnProperty(name)) {
	                    value = obj[name];  
	                    if (isArray(value)) {
	                        vLen = value.length;
	                        for (v = 0; v < vLen; v++) {
	                            addField(name, value[v]);
	                        }
	                    } else {
	                        addField(name, value);
	                    }
	                }
	            }
            }
            
            connect.connect(frame, 'load', this, function() {
            	this._onUploadComplete(frame, options);
            });
            form.submit();
            
            hLen = hiddens.length;
            for (h = 0; h < hLen; h++) {
	            domC.destroy(hiddens[h]);
	        }
		},
		
		_onUploadComplete : function(frame, options) {
			var response = {
                responseText: '',
                responseXML: null
            }, callback, success, doc, contentNode;
            
            try {
            	doc = frame.contentWindow.document || frame.contentDocument || window.frames[frame.id].document;
            	
            	if (doc) {
            		if(dojo.isOpera && doc.location == 'about:blank') {
            			return;
            		}
            		if(doc.body) {
            			if ((contentNode = doc.body.firstChild) && /pre/i.test(contentNode.tagName)) {
	                        response.responseText = contentNode.textContent;
	                    } else if ((contentNode = doc.getElementsByTagName('textarea')[0])) {
	                        response.responseText = contentNode.value;
	                    } else {
	                        response.responseText = doc.body.textContent || doc.body.innerText;
	                    }
            		}
            		
            		response.responseXML = doc.XMLDocument || doc;
	                callback = options.success;
	                success = true;
            	}
            } catch(e) {
            	response.responseText = '{success:false,message:"' + String.trim(e.message || e.description) + '"}';
	            callback = options.failure;
	            success = false;
            }
            this.requestComplete(response, options);
            
            if(callback) {
            	callback.call(options.scope, response, options);
            }
            
            if(options.callback) {
            	options.callback.call(options.scope, options, success, response);
            }
	
	        setTimeout(function() {
	        	domC.destroy(frame);
	        }, 100);
		},
		
		/**
		 * 打开请求
		 */
		_openRequest : function(options, requestOptions, async, username, password) {
			var xhr = this._newRequest(options);
			
			if(username) {
				xhr.open(requestOptions.method, requestOptions.url, async, username, password);
			} else {
				if(this.isXdr) {
					xhr.open(requestOptions.method, requestOptions.url, async);
				} else {
					xhr.open(requestOptions.method, requestOptions.url, async);
				}
			}
			
			if(options.withCredentials || this.withCredentials) {
				xhr.withCredentials = true;
			}
			
			return xhr;
		},
		
		/**
		 * 创建一个新的AJAX请求
		 */
		_newRequest : function(options) {
			var xhr = null;
			if((options.cors || this.cors) && dojo.isIE && dojo.isIE <= 9) {
				this.isXdr = true;
				xhr = getXdrInstance();
			} else {
				xhr = getXhrInstance();
			}
			return xhr;
		},
		
		_setupHeaders: function(xhr, options, data, params) {
			var contentType = this.defaultPostHeader,
				headers = options.headers || {},
				key, header;
			if(!headers['Content-Type'] && (params || data)) {
				headers['Content-Type'] = contentType;
			}
			if(!headers['X-Requested-With']) {
				headers['X-Requested-With'] = this.defaultXhrHeader;
			}
			try {
	            for (key in headers) {
	                if (headers.hasOwnProperty(key)) {
	                    header = headers[key];
	                    xhr.setRequestHeader(key, header);
	                }
	            }
	        } catch(e) {
	        	console.error(e);
	        }
	        return headers;
		},
		
		_clearTimeout: function(request) {
	        clearTimeout(request.timeout);
	        delete request.timeout;
	    },
		
		_cleanup: function(request) {
	        request.xhr = null;
	        delete request.xhr;
	    },
	    
	    /**
		 * 判断状态
		 */
		_parseStatus: function(status) {
	        status = status == 1223 ? 204 : status;
	
	        var success = (status >= 200 && status < 300) || status == 304,
	            isException = false;
	
	        if (!success) {
	            switch (status) {
	                case 12002:
	                case 12029:
	                case 12030:
	                case 12031:
	                case 12152:
	                case 13030:
	                    isException = true;
	                    break;
	            }
	        }
	        return {
	            success: success,
	            isException: isException
	        };
	    },
	    
	     _createException : function(request) {
	        return {
	            request : request,
	            requestId : request.id,
	            status : request.aborted ? -1 : 0,
	            statusText : request.aborted ? 'transaction aborted' : 'communication failure',
	            aborted: request.aborted,
	            timedout: request.timedout
	        };
	    },
	    
	    _createResponse : function(request) {
	    	var xhr = request.xhr,
            isXdr = this.isXdr,
            headers = {},
            lines = isXdr ? [] : xhr.getAllResponseHeaders().replace(/\r\n/g, '\n').split('\n'),
            count = lines.length,
            line, index, key, response, byteArray;
            
            while (count--) {
            line = lines[count];
	            index = line.indexOf(':');
	            if (index >= 0) {
	                key = line.substr(0, index).toLowerCase();
	                if (line.charAt(index + 1) == ' ') {
	                    ++index;
	                }
	                headers[key] = line.substr(index + 1);
	            }
	        }
	        
	        request.xhr = null;
        	delete request.xhr;
	        
        	response = {
	            request: request,
	            requestId: request.id,
	            status: xhr.status,
	            statusText: xhr.statusText,
	            getResponseHeader: function(header) {
	                return headers[header.toLowerCase()];
	            },
	            getAllResponseHeaders: function() {
	                return headers;
	            }
	        };
	        
	        if (isXdr) {
	            this._processXdrResponse(response, xhr);
	        }
	        
	        response.responseText = xhr.responseText;
            response.responseXML = xhr.responseXML;
	        
	        xhr = null;
	        
   			return response;
	    },
	    
	    _processXdrResponse: function(response, xhr) {
	        response.getAllResponseHeaders = function () {
	            return [];
	        };
	        response.getResponseHeader = function () {
	            return '';
	        };
	        response.contentType = xhr.contentType;
	    },
	    
	    _processXdrRequest: function(request, xhr) {
	        var me = this;
	        delete request.headers;
	        request.contentType = request.options.contentType || 'text/plain';
	
	        xhr.onload = function() {
	        	me.onStateChange.call(me, request, true);
	        };
	        xhr.onerror = xhr.ontimeout = function() {
	        	me.onStateChange.call(me, request, false);
	        };
	    },
	    
	    _onComplete : function(request, xdrResult) {
	    	var options = request.options,
	    	scope = options.scope || null,
	    	result, success, response;
	    	
	    	try {
	    		result = this._parseStatus(request.xhr.status);
	    	} catch(e) {
	    		result = {
	                success : false,
	                isException : false
	            };
	    	}
	    	success = this.isXdr ? xdrResult : result.success;
	    	if (success) {
	            response = this._createResponse(request);
	            this.requestComplete(response, options);
	            if(options.success) {
	            	options.success.call(scope, response, options);
	            }
	        } else {
	            if (result.isException || request.aborted || request.timedout) {
	                response = this._createException(request);
	            } else {
	                response = this._createResponse(request);
	            }
	            this.requestException(response, options);
	            if(options.failure) {
	            	options.failure.call(scope, response, options);
	            }
	        }
	        if(options.callback) {
	        	options.callback.call(scope, options, success, response);
	        }
	        delete this.requests[request.id];
	        return response;
	    },
	    
	    _onStateChange : function(request, xdrResult) {
	        if ((request.xhr && request.xhr.readyState == 4) || this.isXdr) {
	            this._clearTimeout(request);
	            this._onComplete(request, xdrResult);
	            this._cleanup(request);
	        }
	    },
	    
	    request : function(options) {
	    	options = options || {};
	    	var scope = options.scope || null,
				username = options.username || '',
				password = options.password || '',
				async,
				requestOptions,
				request,
				headers,
				xhr;
			if(this.onBeforeRequest(options) !== false) {
				requestOptions = this._setOptions(options, scope);
				if(this._isFormUpload(options)) {
					this._upload(options.form, requestOptions.url, requestOptions.data, options);
					return null;
				}
				
				async = options.async !== false ? (options.async || this.async) : false;
				xhr = this._openRequest(options, requestOptions, async, username, password);
				
				if(!this.isXdr) {
					headers = this._setupHeaders(xhr, options, requestOptions.data, requestOptions.params);
				}
				
				var me = this;
				request =  {
					id : ++me.statics.requestId,
					xhr: xhr,
	                headers: headers,
	                options: options,
	                async: async,
	                timeout: setTimeout(function() {
	                    request.timedout = true;
	                    me.abort(request);
	                }, options.timeout || me.timeout)
				};
				
				this.requests[request.id] = request;
            	this.latestId = request.id;
            	
            	if (async) {
	                if (!this.isXdr) {
	                    xhr.onreadystatechange = bind(this._onStateChange, this, [request]);
	                }
	            }
	            
	            if (me.isXdr) {
	                this._processXdrRequest(request, xhr);
	            }
	            
	            xhr.send(requestOptions.data);
	            if (!async) {
	                return this._onComplete(request);
	            }
	            return request;
			} else {
				if(options.callback) {
					options.callback.call(scope, options, undefined, undefined);
				}
	            return null;
	        }
	    },
	    
	    /**
		 * 销毁
		 */
		abort : function(request) {
			var xhr;
			if(!request) {
				request = this.getLatest();
			}
			
			if (request && this.isLoading(request)) {
				 xhr = request.xhr;
	            try {
	                xhr.onreadystatechange = null;
	            } catch (e) {
	                xhr.onreadystatechange = function(){};
	            }
	            xhr.abort();
	            this._clearTimeout(request);
	            if (!request.timedout) {
	                request.aborted = true;
	            }
	            this._onComplete(request);
	            this._cleanup(request);
			}
		},
		
		/**
		 * 获取最后一个请示
		 */
		getLatest: function(){
	        var id = this.latestId,
	            request;
	            
	        if (id) {
	            request = this.requests[id];
	        }
	        return request || null;
	    },
	    
	     /**
	     * 查看请求是否为正在工作中
	     */
	    isLoading : function(request) {
	    	if (!request) {
	            request = this.getLatest();
	        }
	        if (!(request && request.xhr)) {
	            return false;
	        }
	        var state = request.xhr.readyState;
        	return !(state === 0 || state == 4);
	    },
	    
	    
	    /**
		 * 提供请求之前事件，返回flase则取消请求
		 */
		onBeforeRequest : function(options) {
		},
		
		requestComplete : function(response, options) {},
		requestException : function(response, options) {}
	};
	
	return conn;
});