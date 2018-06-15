(function(__UP__,__NAME__){
	var ____ = {};
	if(__UP__ instanceof HTMLElement){
		____.dom = __UP__;
	}else{
		__JUS__.__EXTEND__(____,__UP__);
	};
	var _self = $('#' + __NAME__);
	{@jscode}
	__JUS__.__MODULE_INIT__['{@Base}'].push({domain:____,name:____.init,value:__NAME__{@APPEND_CODE}});
	__JUS__._MODULE_LIST_[__NAME__] = window[__NAME__] = ____;
})({@domain},"{@domain}");