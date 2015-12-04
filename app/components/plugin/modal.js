(function(root,factory){
	if(typeof define==='function' && define.amd){
		define(['$'],factory)
	}else if(typeof exports === 'object'){
		module.exports = factory();
	}else{
		root.Modal = factory();
	}
}(this,function($){
	var defaults = {
		title:'',
		text:'',
		isMask:true, //遮罩
		hasFoot:true, //是否需要foot
		hasCancelBtn:true,
		okButText:'确定',
		cancelButText:'取消'
	}
	var Modal = function(){
	} 

	Modal.prototype.init = function(options){
		console.log(options)
		var template = setTemplate();

	}
	function extend(){

	}

	function renderTemplate(obj){
		var divEl = document.createElement('div');
		var html = setTemplate();
		divEl.innerHTML = html;

	}
	function setTemplate(obj){
		var maskHtml = obj.isMask?'<div></div>':'',
			html,
			keys = {
				title: titleTemplate,
				tetx:textTemplate,
				foot:footTemplate
			}
			for(var i in keys){
				var strHtml = keys[i](obj);
				html += strHtml;
			}
		return html
	}
	function titleTemplate(obj){
		return	obj.title ? '<h1>'+obj.title+'</h1>':'';
	}
	function textTemplate(obj){
		return  obj.text ? '<div>'+obj.text+'</div>':'';
	}
	function footTemplate(obj){
		var cancelBtn = obj.hasCancelBtn?'<span>'+obj.cancelButText+'</span>':'';
		return hasFoot?'<div><span>'+obj.okButText+'</span>'+cancelBtn+'</div>':''
	}
	return Modal;
}))


