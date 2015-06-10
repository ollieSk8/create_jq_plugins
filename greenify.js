(function ( $ ) {
 
    $.fn.greenify = function( options ) {
 
        // 这里是配置的默认参数

        var settings = $.extend({
            
            color: "#556b2f",
            backgroundColor: "white"

        }, options );
 
        // Greenify 方法基于默认的参数设定
        return this.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });
 
    };
 
}( jQuery ));