/**
 * 前端模块编译器
 */
$.fn.loadModule = function(module,value,listener,__APPDOMAIN__){
	JUS.loadModule(this,module,value,listener,__APPDOMAIN__);
}
/**
 * 前端模块编译器
 */
$.fn.addModule = function(module,value,listener,__APPDOMAIN__){
	JUS.addModule(this,module,value,listener,__APPDOMAIN__);
}

$.fn.addChild = function(child){
	if(!child){
		return;
	}
	if(child.dom){
		if(this.length != 0){
			$(this).append(child.dom);
		}else{
			child.dom.remove();
		}
	}
	else{
		if(this.length != 0){
			$(this).append(child);
		}else{
			child.remove();
		}
	}
	
};




$.fn.removeChild = function(child){
	if(!child){
		return;
	}
	if(child.dom){
		child.dom.remove();
	}
	else{
		child.remove();
	}
	
};

$.fn.triggerParent = function(){
	var $this = $(this);
	var p = null;
	var i = 0;
	$this = $this.parent();
	if($this.attr("class_id")){
		p = window[$this.attr("id")];
		if(p && p.trigger){
			p.trigger();
		}
	}
};


/**
 * 将数据转化成模块
 */
$.fn.ModuleFromString = window.ModuleFromString = function(mod,value,listener,__APPDOMAIN__){	
	var target = this;
	asjs.load("/index.api",function(e){
		var data = e.target.data;
		var w = __INIT__(__UUID__(),module,data,value,__APPDOMAIN__,target);
		if(listener){	
			listener(w);
		}
		
	},{"do":"module",value:mod});
};