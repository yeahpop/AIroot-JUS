class Template{
	var a = /\{.+?\}/g;
	var map = {};
	var vMap = {};
	var attrLst = [];
	function init(node:HTML){
		read(node);
	}
	
	
	function read(node:HTML){
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
						pushText(name,txt);
						p.parentNode.insertBefore(txt,p);
						start = a.lastIndex;
						i ++;
					};
					txt = document.createTextNode(p.nodeValue.substring(start));//插入前面的值
					p.parentNode.insertBefore(txt,p);
					p.parentNode.removeChild(p);
					
					
				}
			}else if(p.tagName == "INPUT"){
				if(p.value.length>2 && p.value.indexOf("{") != -1){
					p.value = p.value.replace(a,function(a,b,c,d){
						name = a.substring(1,a.length - 1).trim();
						return "{" + name + "}";
					});
					var arr = [];
					while((m = a.exec(p.value)) != null){
						name = p.value.substring(m.index + 1,a.lastIndex - 1).trim();
						pushText(name);
						arr.push(name);
					};
					pushAttr(p,p.value,arr);
				}
			}else{
				read(p);
			}
		}
	}
	
	function pushText(name,node){
		if(!map[name]){
			map[name]= [];
			Object.defineProperty(__inthis__,name,{
				set:function(value){
					vMap[name] = value;
					render(name,value);
				},
				get:function(){
					return vMap[name];
				}
			,enumerable:true});
		}
		if(node){
			map[name].push(node);
		}
		
	}
	
	/**
	 *
	 */
	function pushAttr(obj,temp,names){
		attrLst.push({obj:obj,temp:temp,names:names});
	}
	
	function render(name,value){
		var arr = map[name];
		var p = null;
		for(var i = 0;i<arr.length;i++){
			p = arr[i];
			arr[i].nodeValue = value;
		}
		var str = null;
		for(var j = 0;j<attrLst.length;j++){
			p = attrLst[j];
			str = p.temp;
			for(var n = 0;n<p.names.length;n++){
				str = str.replace("{" + p.names[n] + "}",vMap[p.names[n]]);
			}
			p.obj.value = str;
		}
	}
	
	
}