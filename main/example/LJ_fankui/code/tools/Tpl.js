class Tpl{
	var node = null;
	var a = /\{.+?\}/g;
	var map = {};
	var attrLst = [];
	var _data = {};
	var _pdata = null;
	var _onChange = null;
	
	function init(node:HTML){
		
		read(this.node = node);
		initListener();
	}
	
	/**
	 * 监听输入元素
	 */
	private function initListener(){
		node.addEventListener("change",listener);
	}
	
	private function removeListener(){
		node.removeEventListener("change",listener);
	}
	
	private function listener(e){
		kk = e;
		var target = e.target;
		var p = null;
		var index = null;
		f:for(var k in map){
			p = map[k];
			for(var i in p){
				if(p[i] == target){
					index = k.split(".");
					break f;
				}
			}
		}
		if(index && dataProvider){
			p = dataProvider;
			for(var i = 0;i<index.length - 1;i++){
				p = p[index[i]];
			}
			p[target.getAttribute("bind")] = e.target.value;
		}
	}
	
	/**
	 * 数据提供
	 */
	public function set dataProvider(value:Object){
		if(typeof value == "object"){
			_pdata = value;
			tplMap.push({value:value,target:_data,domain:@this});
			var p = null;
			for(var i in _data){
				p = value[i]
				if(p != undefined && p != null){
					_data[i] = p;
				}
				
			}
		}else{
			if(window.console){
				console.error("dataProvider input isn't object");
			}else{
				alert(value);
			}
		}
		
	}
	
	public function get dataProvider():Object{
		return _data;
	}
	
	
	/**
	 * 数据变更通知
	 */
	public function set onDataChange(value:Function){
		_onChange = value;
	}
	
	private function read(node:HTML){
		var node = node.childNodes;
		var p = null;
		var m = null;
		var start = 0;
		var name = null;
		var txt = 0;
		for(var i = 0;i<node.length;i++){
			p = node[i];
			if(p instanceof Text){
				if(p.length>2 && p.nodeValue.indexOf("{") != -1){
					while((m = a.exec(p.nodeValue)) != null){
						name = p.nodeValue.substring(m.index + 1,a.lastIndex - 1).trim();
						if(start != m.index){
							txt = document.createTextNode(p.nodeValue.substring(start,m.index));//插入前面的值
							p.parentNode.insertBefore(txt,p);
							i ++;
						}
						txt = document.createTextNode("{" + name +  "}");//插入当前匹配项目
						pushText(fx(name),txt);
						p.parentNode.insertBefore(txt,p);
						start = a.lastIndex;
						i ++;
					};
					txt = document.createTextNode(p.nodeValue.substring(start));//插入前面的值
					p.parentNode.insertBefore(txt,p);
					p.parentNode.removeChild(p);
					
					
				}
			}else if(p.tagName == "INPUT" || p.tagName == "TEXTAREA"){
				if(p.getAttribute("bind")){
					pushText(fx(p.getAttribute("bind")),p);
				}
			}else{
				read(p);
			}
		}
	}
	
	private function pushText(obj,node){
		if(!map[obj.stat]){
			map[obj.stat] = [];
		}
		map[obj.stat].push(node);
		//先把所有属性转化下
		var arr = obj.arr;
		var c = _data;
		var p = null;
		for(var i = 0;i<arr.length;i++){
			p = arr[i];
			//console.log(">>",p,c[p])
			if(c[p]){
				if(i == arr.length - 1){
					c[p] = obj.value;
				}else if(!(typeof c[p] == "object")){
					c[p] = {};
				}
			}else{
				setAttribute(c,p,obj);
				if(i == arr.length - 1){
					c[p] = obj.value;
				}else{
					c[p] = {};
				}
			}
			c = c[p];
		}
		
	}
	
	/**
	 * obj
	 */
	private function fx(value){
		var stat = null;
		var arr = null;
		var val = null;
		var i = value.indexOf("=");
		if(i == -1){
			stat = value;
			arr = value.split(".");
			val = value;
		}else{
			stat = value.substring(0,i).trim();
			var b = value.substring(i+1).trim();
			arr = stat.split(".");
			val = eval(b);
		}
		return {stat:stat,arr:arr,value:val};
	}
	
	private function setAttribute(obj,name,info){
		var index = info.arr;
		var _value = null;
		Object.defineProperty(obj,name,{
			set:function(value){
				if(_value && typeof value == "object"){
					tplMap.push({value:value,target:_value,domain:@this});
					for(var k in _value){
						_value[k] = value[k];
					}
					return;
				}
				_value = value;
				if(_pdata){
					var p = _pdata;
					for(var i = 0;i<index.length - 1;i++){
						p = p[index[i]];
					}
					p[name] = value;
				}
				
				render(info.stat,value);
			},
			get:function(){
				return _value;
			}
		,enumerable:true});
	}
	
	private function render(stat,value){
		var arr = map[stat];
		var p = null;
		for(var i = 0;i<arr.length;i++){
			p = arr[i];
			if(p.tagName){
				p.value = value;
			}else{
				p.nodeValue = value;
			}
		}
	}	
	
	public function destroy(){
		removeListener();
		for(var i = tplMap.length - 1;i>=0;i--){
			
		}
	}
	
}