var __JUS__ = {};
//浏览器版本检测
__JUS__.__NAVI__ = navigator.appName;
__JUS__.__VERS__ = navigator.appVersion;

//初始实例化
__JUS__.__POS_VALUE__ = null;
__JUS__.__WINDOW__ = {};//全局静态函数总和

__JUS__._MODULE_LIST_ = {};
__JUS__._MODULE_COMMAND_LIST_ = {};//模块命令列表
__JUS__.__MODULE_INIT__ = {};
__JUS__.__MODULE_METHOD__ = {};
//styleSheets
__JUS__.__MODULE_STYLE__ = {};//MODULE 统一样式

//
__JUS__._MODULE_CONTENT_LIST_ = {};
__JUS__._MODULE_CONTENT_LIST_ATTR_ = {};
__JUS__._INSTANCE_COUNT_ = 0;//被实例化的数量
__JUS__._MODULE_CONTENT_TEMP_ = null;

//以下是双向绑定内容
__JUS__.__ARRAY__ = 0;//数组标识
__JUS__.__ARRAY_OBJECT__ = 0;//数组Element唯一标识


/**
 * 错误列表
 */
__JUS__.____ERROR_POS____ = 0;
__JUS__.____ERROR_COUNT____ = 0;
__JUS__.____ERROR____ = function(value){
	console.log("JUS ERROR: " + value);
	return;
	var label = $("<div style='position:absolute;color:#fefefe;background-color:#f05500;margin:5px 5px 0px 5px;border-radius:5px;padding:2px 10px 2px 10px;font-size:14px;font-weight:bold;'>" + ____ERROR_COUNT____ ++ + ". " + value + "</div>");
	$("body").append(label);
	label.css("top",____ERROR_POS____);
	____ERROR_POS____ += label.outerHeight(true);
}


/**
 * 事件监听
 */
__JUS__.____EVENT____ = {};
function FrameEvent(domain,type,func){
	if(!__JUS__.____EVENT____[type]){
		__JUS__.____EVENT____[type] = [];
	}
	var arr = null;
	if(!func){
		arr = __JUS__.____EVENT____[type];
		var nArr = [];
		var p = null;
		for(var i = 0;i<arr.length;i++){
			p = arr[i];
			if(p.domain != domain){
				nArr.push(p);
			}
		}
		arr.length = 0;
		__JUS__.____EVENT____[type] = nArr;
		return;
	}
	
	//判断是否存在
	arr = __JUS__.____EVENT____[type];
	var p = null;
	for(var i = 0;i<arr.length;i++){
		p = arr[i];
		if(p.domain == domain && p.func == func){
			return;
		}
	}
	arr.push({domain:domain,func:func});
	p = null;
}

function Event(type,value){
	var arr = __JUS__.____EVENT____[type];
	if(!arr){
		return;
	}
	var p = null;
	for(var i = 0;i<arr.length;i++){
		p = arr[i];
		try{
			if(document.getElementById(p.domain)){
				p.func(value);
			}else{
				arr.splice(i,1);
				i--;
			}
			
		}catch(e){
			console.log("Event",e);
			p.isError = true;
		}
	}
	p = null;
}



/**
 * 唯一性句柄集合
 */
__JUS__.__MODULE_HANDLE__ = {};
/**
 * 添加句柄
 */
function AddHandle(objName,listener){
	if(!listener){
		alert("AddHandle: " + "please tell me handle listener");
		return;
	}
	if(__JUS__.__MODULE_HANDLE__[objName] == true){
		return;
	}
	
	if(__JUS__.__MODULE_HANDLE__[objName] && __JUS__.__MODULE_HANDLE__[objName]._MODULE_CONTENT_.parent().length != 0){
		if(listener){
			listener({target:__JUS__.__MODULE_HANDLE__[objName]});
		}
	}else{
		if(listener){
			var t = listener({target:null})
			if(t.listener){
				__JUS__.__MODULE_HANDLE__[objName] = true;
				t.listener(function(e){
					__JUS__.__MODULE_HANDLE__[objName] = e;
				});
			}else{
				__JUS__.__MODULE_HANDLE__[objName] = t;
			}
			
		}
	}
}



/**
 * 弹出框管理
 */
var PopManager = new function(){
	var __ZINDEX_CONTENT__ = [];
	//添加弹出框
	this.addPopUp = function(child,content){//弹出类，弹出容器
		if(!content){
			content = $("body");
		}
		if(child._MODULE_CONTENT_){
			child._MODULE_CONTENT_.bind("mousedown",function(){
				PopManager.bringToFront(child);
			});
			content.addChild(child);
			list = getList(content);
			if(list.length>0){
				list = list.child;
				
				for(var i in list){
					if(list[i] == child){
						return;
					}
				}
				list.push(child);
			}else{
				__ZINDEX_CONTENT__.push({content:content,child:child,index:999});
			}
			this.bringToFront(child);
		}
		
	}
	this.bringToFront = function(child){//显示在最前
		//找到自己所在对象
		var c = getChildData(child);
		//找到所有同级元素
		if(c){
			var pta = getList(c.content);
			//查看有没有999级别的
			var p = null;
			var f = false;
			for(var i in __ZINDEX_CONTENT__){
				p = __ZINDEX_CONTENT__[i];
				if(p != c && p.index == 999){
					f = true;
					break;
				}
			}
			if(f){
				//如果有999则降低所有级别
				for(var i in __ZINDEX_CONTENT__){
					__ZINDEX_CONTENT__[i].index --;
				}
				console.log(__ZINDEX_CONTENT__);
			}
			c.index = 999;
			render();
		}
		
	}
	
	this.removePopUp = function(child){//删除窗口
		var p = null;
		for(var i in __ZINDEX_CONTENT__){
			p = __ZINDEX_CONTENT__[i];
			if(p.child == child && p.child._MODULE_CONTENT_){
				__ZINDEX_CONTENT__.splice(i,1);
				var qt = p.child._MODULE_CONTENT_;
				if(qt.attr("onRemove")){
					var clearFunc = "";
					qt.find("div[onRemove]").each(function(){
						clearFunc += this.getAttribute("onRemove") + ";\r\n";
					});
					if(clearFunc != ""){
						(new Function(clearFunc))();
					}
				}
				p.child._MODULE_CONTENT_.remove();
				break;
			}
		}
	}
	
	function getList(content){//获取容器列表
		var list = [];
		for(var i in __ZINDEX_CONTENT__){
			if(__ZINDEX_CONTENT__[i].content == content){
				list.push(__ZINDEX_CONTENT__[i]);
			}
		}
		return list;	
	}
	function getChildData(child){
		var p = null;
		for(var i in __ZINDEX_CONTENT__){
			p = __ZINDEX_CONTENT__[i];
			if(p.child == child){
				return p;
			}
		}
		return null;
	}
	function render(){//渲染图层
		var p = null;
		var arr = [];
		for(var i in __ZINDEX_CONTENT__){
			p = __ZINDEX_CONTENT__[i];
			if(p.child._MODULE_CONTENT_){
				if(p.child._MODULE_CONTENT_.parent().length != 0){
					p.child._MODULE_CONTENT_.css({"position":"absolute","z-index":p.index});
					arr.push(p);
				}else{
					p.child._MODULE_CONTENT_.unbind();
				}
				
			}else{
				p.child.css({"position":"absolute","z-index":p.index});
			}
		}
		__ZINDEX_CONTENT__.length = 0;
		__ZINDEX_CONTENT__ = arr;
	}
	
}



/**
 * 添加静态函数
 * @param className
 * @param attrName
 * @param attrValue
 * @param domain		application domain 程序作用域 默认为空（local）
 * @return
 */
__JUS__.__ADD_STATIC_METHOD__ = function(className,attrName,attrValue,domain){
	var pos = null;
	if(!domain){
		domain = 'local';
	}
	
	pos = __JUS__.__WINDOW__[domain];
	if(!pos){
		__JUS__.__WINDOW__[domain] = {};
	}
	
	if(!(pos = __JUS__.__WINDOW__[domain][className])){
		pos = __JUS__.__WINDOW__[domain][className] = {};
	}
	
	if(!pos[attrName]){
		pos[attrName] = attrValue;
	}
}

__JUS__.__EXTEND__ = function (d,b){
	for (var p in b){
		if (!b.hasOwnProperty(p)){
			continue;
		}
		var g = b.__lookupGetter__(p), s = b.__lookupSetter__(p); 
		if ( g || s ) {
			if ( g )
				d.__defineGetter__(p, g);
			if ( s )
				d.__defineSetter__(p, s);
		} else {
			d[p] = b[p];
		}
	}
}


/**
 * 将数据分析
 */
__JUS__.__FORMAT__ = function(data,uuid,applicationDomain,url){
	applicationDomain = applicationDomain || "local";
	if(!__JUS__._MODULE_CONTENT_LIST_[applicationDomain]){
		__JUS__._MODULE_CONTENT_LIST_[applicationDomain] = {};
	}
	
	var arr = data.split("\1");
	var style = arr[0];
	if(style != ""){
		style = style.split("\n");
		if(!__JUS__.__MODULE_STYLE__[applicationDomain]){
			__JUS__.__MODULE_STYLE__[applicationDomain] = {};
		}
		var t = 0;
		var p = 0;
		var str = null;
		var name = null;
		var value = null;
		for(var s in style){
			str = style[s];
			t = str.indexOf("%");
			p = parseInt(str.substring(0,t));
			name = str.substr(t + 1,p);
			value = str.substring(t + p + 1);
			if(!__JUS__.__MODULE_STYLE__[applicationDomain][name]){
				__JUS__.__MODULE_STYLE__[applicationDomain][name] = true;
				$("head").append("<style class_id='" + name + "'>" + value.replace(/\\r/g,'\r').replace(/\\n/g,'\n') + "</style>");
			}	
		}
		
	}
	
	var script = arr[1];
	var html = arr[2];
	
	html = html.replace(/[\f]/g,"'" + applicationDomain + "'");
	html = html.replace(/[\b]/g,uuid);
	script = script.replace(/[\f]/g,"'" + applicationDomain + "'");
	script = script.replace(/[\b]/g,uuid);
	
	return {html:html,script:script};
}



/**
 * 前端模块编译器
 */
$.fn.loadModule = window.loadModule = function(url,value,listener,applicationDomain){
	url = "juis/" + url.replace(/\./g,'/') + ".html";
	var target = this;
	var load = window.location.toString().indexOf("http:") == 0 ? asjs.post : asjs.get;
	var _CF_ = null;
	load(url,function(e){
		var data = e.target.data;
		var uuid = "J" + (new Date().getTime()) + (__JUS__._INSTANCE_COUNT_ ++);
		__JUS__.__MODULE_INIT__[uuid] = [];
		if(value != undefined){
			__JUS__._MODULE_CONTENT_LIST_ATTR_[uuid] = value;
		}
		var md = __JUS__.__FORMAT__(data,uuid,applicationDomain,url);

		
		data = md.html;
		var tmp = $(data);
		
		if(target.toString().toLowerCase() != "[object window]"){
			//清除自对象
			var clearFunc = "";
			var qt = $(target);
			qt.find("div[onRemove]").each(function(){
				clearFunc += this.getAttribute("onRemove") + ";\r\n";
			});
			if(clearFunc != ""){
				(new Function(clearFunc))();
			}
			qt.find("*").unbind().remove();
			qt.append(tmp);
		}else{
			if(!__JUS__._MODULE_CONTENT_TEMP_ || __JUS__._MODULE_CONTENT_TEMP_.parent().length == 0){
				__JUS__._MODULE_CONTENT_TEMP_ = $("<div style='position:fixed;left:10000px;top:10000px;'></div>");
				$("body").append(__JUS__._MODULE_CONTENT_TEMP_);
			}
			__JUS__._MODULE_CONTENT_TEMP_.append(tmp);
		}
		try{
			(new Function(md.script))();
		}catch(e){
			tmp.append("<script __uuid__='" + uuid + "'>" + md.script + "</script>");
		}
		
		__JUS__.__initLst__(uuid);
		var w = window[uuid];
		w._MODULE_CONTENT_ = tmp;
		if(listener){	
			listener(w);
		}
		if(_CF_){
			_CF_(w);
		}
	});
	return {listener:function(value){
		_CF_ = value;
	}};
}



/**
 * 前端模块编译器
 */
$.fn.addModule = window.addModule = function(url,value,listener,applicationDomain){
	url = "juis/" + url.replace(/\./g,'/') + ".html";
	var target = this;
	var load = window.location.toString().indexOf("http:") == 0 ? asjs.post : asjs.get;
	load(url,function(e){
		var data = e.target.data;
		var uuid = "J" + (new Date().getTime()) + (__JUS__._INSTANCE_COUNT_ ++);
		__JUS__.__MODULE_INIT__[uuid] = [];
		if(value != undefined){
			__JUS__._MODULE_CONTENT_LIST_ATTR_[uuid] = value;
		}
		var md = __JUS__.__FORMAT__(data,uuid,applicationDomain,url);
		data = md.html;
		var tmp = $(data);
		if(target.toString().toLowerCase() != "[object window]"){
			$(target).append(tmp);
		}else{
			if(!__JUS__._MODULE_CONTENT_TEMP_ || __JUS__._MODULE_CONTENT_TEMP_.parent().length == 0){
				__JUS__._MODULE_CONTENT_TEMP_ = $("<div style='position:fixed;left:10000px;top:10000px;'></div>");
				$("body").append(__JUS__._MODULE_CONTENT_TEMP_);
			}
			__JUS__._MODULE_CONTENT_TEMP_.append(tmp);
		}
		try{
			(new Function(md.script))();
		}catch(e){
			tmp.append("<script __uuid__='" + uuid + "'>" + md.script + "</script>");
		}
		__JUS__.__initLst__(uuid);
		if(listener){
			var w = window[uuid];
			w._MODULE_CONTENT_ = tmp;
			listener(w);
		}
	});
}



/**
 * 获取已经存储的Module
 * @param url		类路径地址
 * @param value 	不确定长度隐形参数
 */
function getModule(url,applicationDomain){
	
	var mod = __JUS__._MODULE_CONTENT_LIST_[applicationDomain][url];
	
	if(mod){
		
		var type = typeof mod;
		if(type == "string"){
			return function(){
				var data = mod;
				var uuid = "M" + (new Date().getTime()) + (__JUS__._INSTANCE_COUNT_ ++);
				__JUS__.__MODULE_INIT__[uuid] = [];
				__JUS__._MODULE_CONTENT_LIST_ATTR_[uuid] = arguments;
				var md = __JUS__.__FORMAT__(data,uuid,applicationDomain,url);
				data = md.html;
				var tmp = $(data);
				if(!__JUS__._MODULE_CONTENT_TEMP_ || __JUS__._MODULE_CONTENT_TEMP_.parent().length == 0){
					__JUS__._MODULE_CONTENT_TEMP_ = $("<div style='position:fixed;left:10000px;top:10000px;'></div>");
					$("body").append(__JUS__._MODULE_CONTENT_TEMP_);
				}
				
				__JUS__._MODULE_CONTENT_TEMP_.append(tmp);
				try{
					(new Function(md.script))();
				}catch(e){
					tmp.append("<script __uuid__='" + uuid + "'>" + md.script + "</script>");
				}
				var w = window[uuid];
				
				w._MODULE_CONTENT_ = tmp;
				__JUS__.__initLst__(uuid);
				return w;
			}
			
		}else if(type == "function"){
			return function(){
				return new mod(arguments);
			};
		}
		
	}
	alert("getModule[" + url + "] is not exist.");
	return null;
}



$.fn.addChild = function(child){
	if(!child){
		return;
	}
	if(child._MODULE_CONTENT_){
		if(this.length != 0){
			$(this).append(child._MODULE_CONTENT_);
		}else{
			child._MODULE_CONTENT_.remove();
		}
	}
	else{
		if(this.length != 0){
			$(this).append(child);
		}else{
			child.remove();
		}
	}
	
}




$.fn.removeChild = function(child){
	if(!child){
		return;
	}
	if(child._MODULE_CONTENT_){
		child._MODULE_CONTENT_.remove();
	}
	else{
		child.remove();
	}
	
}

$.fn.triggerParent = function(){
	var $this = $(this);
	var p = null;
	var i = 0;
	$this = $this.parent();
	console.log($this.attr("class_id"));
	if($this.attr("class_id")){
		p = window[$this.attr("id")];
		if(p && p.trigger){
			p.trigger();
			console.log("OK");
		}
	}
}






/**
 * 加载类
 * 本项功能预留
 */
function loadClass(url){
	var load = window.location.toString().indexOf("http:") == 0 ? asjs.post : asjs.get;
	load(url,function(e){
		//TODO
	});
}



/**
 * 将数据转化成模块
 */
$.fn.ModuleFromString = window.ModuleFromString = function(mod,value,listener,applicationDomain){	
	var target = this;
	asjs.load("/index.api",function(e){
		var data = e.target.data;
		var uuid = "J" + (new Date().getTime()) + (_INSTANCE_COUNT_ ++);
		__MODULE_INIT__[uuid] = [];
		if(value != undefined){
			__JUS__._MODULE_CONTENT_LIST_ATTR_[uuid] = value;
		}
		var md = __JUS__.__FORMAT__(data,uuid,applicationDomain,"__TEST__");

		
		data = md.html;
		var tmp = $(data);
		
		if(target.toString().toLowerCase() != "[object window]"){
			//清除自对象
			var clearFunc = "";
			var qt = $(target);
			qt.find("div[onRemove]").each(function(){
				clearFunc += this.getAttribute("onRemove") + ";\r\n";
			});
			if(clearFunc != ""){
				(new Function(clearFunc))();
			}
			qt.find("*").unbind().remove();
			qt.append(tmp);
		}else{
			if(!_MODULE_CONTENT_TEMP_ || _MODULE_CONTENT_TEMP_.parent().length == 0){
				_MODULE_CONTENT_TEMP_ = $("<div style='position:fixed;left:10000px;top:10000px;'></div>");
				$("body").append(_MODULE_CONTENT_TEMP_);
			}
			__JUS__._MODULE_CONTENT_TEMP_.append(tmp);
		}
		try{
			(new Function(md.script))();
		}catch(e){
			tmp.append("<script __uuid__='" + uuid + "'>" + md.script + "</script>");
		}
		
		__JUS__.__initLst__(uuid);
		var w = window[uuid];
		w._MODULE_CONTENT_ = tmp;
		if(listener){	
			listener(w);
		}
		
	},{do:"module",value:mod});
}



__JUS__.__initLst__ = function(uuid){
	var p = null;
	var initLst = __JUS__.__MODULE_INIT__[uuid];
	if(initLst){
		while(initLst.length>0){
			p = initLst.shift();
			if(p.name){
				p.name.apply(p.domain,__JUS__._MODULE_CONTENT_LIST_ATTR_[p.value] || []);
			}
			if(p.append){
				p.append();
			}
		}
		delete __JUS__.__MODULE_INIT__[uuid] 
	}
	
}


/**
 * 类导入函数
 */
function importFunc(url,data){
	__JUS__._MODULE_CONTENT_LIST_[url] = escape(data);
}


/**
 * 添加命令缓存
 */
__JUS__.__PUSH_COMMAND__ = function(domain,name,cmd,obj){
	if(!__JUS__._MODULE_COMMAND_LIST_[domain]){
		__JUS__._MODULE_COMMAND_LIST_[domain] = [];
	}
	if(window[name] instanceof HTMLElement){
		window[name] = {dom:window[name]};
		window[name][cmd] = obj;
	}else{
		window[name][cmd] = obj;
		if(window[name].onAddition){
			window[name].onAddition({target:window[name],type:cmd,command:obj});
		}
	}
	__JUS__._MODULE_COMMAND_LIST_[domain].push(obj);
}


/**
 * 垃圾回收
 */
__JUS__.__CLEAR_ID__ = -1;
__JUS__.__CLEAR_FUNC__ = function(e){
	var cl = null;
	var cp = null;
	requestAnimationFrame(function(){
		for(var name in __JUS__._MODULE_LIST_){
			if(!document.getElementById(name)){
				var obj = window[name];
				if(obj._DELAY_TIME_ && (new Date().getTime() - obj._DELAY_TIME_ >3000)){
					try{
						if(obj.finalize){
							obj.finalize();
						}
					}catch(e){
						alert("run [" + name + "] finalize isn't success!");
					}
					try{
						delete window[name];
					}catch(e){
						window[name] = null;
					}
					delete __JUS__._MODULE_LIST_[name];
					cl = __JUS__._MODULE_COMMAND_LIST_[name];
					if(cl){
						for(var c = 0;c<cl.length;c++){
							cp = cl[c];
							if(cp.finalize){
								cp.finalize();
							}
						}
					}
					
					delete __JUS__._MODULE_COMMAND_LIST_[name];
					delete __JUS__._MODULE_CONTENT_LIST_ATTR_[name];
					if(window.__DEBUG__ && console){
						console.log("remove model id:" + name);
					}
					continue;
				}
				obj._DELAY_TIME_ = new Date().getTime();
				
			}
		}
		clearTimeout(__JUS__.__CLEAR_ID__);
		__JUS__.__CLEAR_ID__ = setTimeout(__JUS__.__CLEAR_FUNC__,5000);
	});
	
}
__JUS__.__CLEAR_ID__ = setTimeout(__JUS__.__CLEAR_FUNC__,5000);




