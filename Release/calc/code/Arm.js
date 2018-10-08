class Arm{
	public var screenHandle = null;
	
	var a = null;
	var b = null;
	var ops = "";
	var tempVar = "";
	function init(){
		//alert("我是CPU");
	}
	
	
	public function push(value){
		console.log("我收到了" + value);
		switch(value){
			case "DEL" :
				tempVar = tempVar.substr(0,tempVar.length - 1);
				break;
			case "CE" :
			case "C" :
				tempVar = "";
				break;
			case "+" :
				ops = "+";
				if(a == null){
					a = parseInt(tempVar);
					tempVar = "";
				}
				break;
			case "-" :
				ops = "-";
				if(a == null){
					a = parseInt(tempVar);
					tempVar = "";
				}
				break;
			case "X" :
			
				break;
			case "/" :
			
				break;
			case "+/-":
			
				break;
			case "=":
				b = parseInt(tempVar);
				tempVar = workOut(a,b,ops);
				break;
			default:
			if(tempVar == "0"){
				tempVar = "";
			}
			tempVar += value;
		}
		
		if(tempVar == ""){
			tempVar = "0";
		}
		
		render(tempVar);
	}
	
	function workOut(a,b,ops){
		switch(ops){
			case "+" :
				return a + b;
			case "-" :
				return a - b;
		}
	}
	
	
	/**
	 * 渲染到显示屏
	 */
	public function render(value){
		if(screenHandle){
			screenHandle.show(value);
		}
	}
}