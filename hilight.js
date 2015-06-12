(function($){
	var elem=null;
	var opts=null;
	$.fn.hilight=function(options){
		//初始化配置项
		opts = $.extend( {}, $.fn.hilight.defaults, options );
		return this.each(function(){
			elem=$(this);

			$.fn.hilight.setColor();//设定颜色

			var markup=elem.html();

			markup=$.fn.hilight.format(markup);

			elem.html(markup);
		});
	}
	//默认参数
	$.fn.hilight.defaults={
		background:'#000',
		color:'#fff',
		click_callback_method:function(){};
		//可以有更多...
	}
	//设置颜色方法
	$.fn.hilight.setColor=function(){
		elem.css({
			'background-color':opts.background,
			'color':opts.color,
		})
	}
	//加粗的方法
	$.fn.hilight.format=function(txt){
		return '<strong>'+txt+'</strong>';
	}
})(jQuery);