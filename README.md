
write jquery plugins
===========================

有时候你想重复使用同一个代码块，举例：你想写一方法，你可以用这个方法，选择做一系列的选择操作，所以你想创造一个插件。

****
###　　　　　　　　Translator:ollieSk8
###　　　　　　github:https://github.com/ollieSk8

===========================

###jquery怎么样工作：jquery对象方法（jquery Object Methods）

在写自己的插件之前，我们必须明白下面这段代码是如何工作的：

```javascript
$( "a" ).css( "color", "red" );
```

这是一段简洁实用的jquery代码段，但是你知道jquery幕后是如何工作的么？当你只用 “$"函数选择元素的时候，它返回了一个jquery对象。这个对象包含了所有jquery可以调用的方法，例如，你肯定已经使用过这些（.css(), .click()…等等）。

这些方法适用于你用jquery选择器选择出来的所有元素。jquery对象的这些方法是从$.fn object 继承出来的。

$.fn 对象包含了所有jquery的对象方法，如果你想写自己的方法增加到jquery, 你需要把你的自定义方法写在$.fn上。

###基本的插件制作方法： 

例如我们想制作一个greenify插件，用这个插件来设置一个dom元素的文字为绿色的。所以我们把一个叫greenify得方法增加到$.fn上，它跟其他jquery对象方法一样。

```javascript
$.fn.greenify = function() {

    this.css( "color", "green" );
};
 
$( "a" ).greenify(); // 使得所有链接颜色为绿色。

```

`注意：这里我们使用的.css()，前边调用它的是this,而不是$(this)对象。这是因为我们的grenify方法和.css()方法被调用的对象一样，
this代表了一个jquery对象。`

###启用链式:

这一步要做2件事帮助我们的插件可以被实际使用。

1. 链式操作是jquery的一个特点，你可以在一个被选出的元素后增加5或者6个操作。这是通过所以jquery对象方法再次返回来原来的jquery对象来完成的，使我们的方法启用链式操作只需要增加一行：

```javascript
$.fn.greenify = function() {

    this.css( "color", "green" );

    return this;// 启用链式
}
 
$( "a" ).greenify().addClass( "greenified" );

```

`这样使得a标签的文字变成绿色后我们还可以给a标签增加class.`

###$别名的保护，增加作用域:

2. $符号在javascript库或框架中非常流行，如果你在项目中同时用了其他类库和jquery一起，你不能使得jquery使用$符号，

用jquery.noConflict()方法释放掉$符号，然而我们的插件是假设使用$符号构建的jquery方法。但是我们还是需要继续使用

$符号和其他插件一起共工作。我们必须把我们的代码放在匿名函数表达式中（防止$被污染）。然后我们把jquery作为参数传递进去，

相应的形参用$符号。


```javascript
(function ( $ ) {
 
    $.fn.greenify = function() {
        this.css( "color", "green" );
        return this;
    };
 
}( jQuery ));

```

此外，我们使用匿名函数表达式是为了把变量私有化，加入我们想使用不同的颜色，我们可以用变量缓存。

```javascript
(function ( $ ) {
 
    var shade = "#556b2f";
 
    $.fn.greenify = function() {
        this.css( "color", shade );
        return this;
    };
 
}( jQuery ));

```

#####只使用一个$.fn来构建插件：


#####只使用一个$.fn 会降低你的插件方法被覆盖的几率，下面的例子是不推荐的做法：

```javascript
(function( $ ) {

    //不好的例子
    
    $.fn.openPopup = function() {
        // Open popup code.
    };
 
    $.fn.closePopup = function() {
        // Close popup code.
    };
 
}( jQuery ));

```
#####最好的实践是只使用一个$.fn，然后在内部判断不同的行为，来执行不同的操作：

```javascript

(function( $ ) {
 
    $.fn.popup = function( action ) {
 
        if ( action === "open") {
            // Open popup code.
        }
 
        if ( action === "close" ) {
            // Close popup code.
        }
 
    };
 
}( jQuery ));

```

###使用each()方法遍历（each() method）

典型的jquery方法包含任意数量的dom元素，这就是为什么jquery对象被称为对象集合。如果你想对一定数量的元素执行

任何操作你肯定要用到each遍历dom树。（操作包括获取元素的属性 get attribute,元素位置 positions）.

```javascript

$.fn.myNewPlugin = function() {
 
    return this.each(function() {
        //遍历元素然后do something
    });
 
};

```

`注意：我们返回的是.each()的结果 代替了 return this. 因为each()已经是可链式的，each内部已经返回了我们需要return的this.这是到目前为止让我们应用链式最好的方式。`


###参数的配置使用：

当你的插件越来越复杂，最好的方式是让你的插件来接收参数，这样的插件是可定制的。最简单的方法是，把很多个参数用一个对象

字面量装起来。现在我们来让我们的greenify插件接收一些参数：

```javascript
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

```

实际调用的时候传入参数：

```javascript
$( "div" ).greenify({
    color: "orange"
});
```

默认的的color颜色设定 “#556b2f”,将被 color “orange” 覆盖掉。


###把所有东西整合在一起：

下面这个插件用到了我们上面讨论过的技术：

```javascript
(function( $ ) {
 
    $.fn.showLinkLocation = function() {
 
        this.filter( "a" ).each(function() {
            var link = $( this );
            link.append( " (" + link.attr( "href" ) + ")" );
        });
 
        return this;
 
    };
 
}( jQuery ));

// 实际调用
$( "a" ).showLinkLocation();

```

这个插件的工作方式是：把a标签的href属性里的值，增加到a标签的里边

```html
<!--插件被调用前 -->
<a href="page.html">Foo</a>
 
<!--插件被调用后 -->
<a href="page.html">Foo (page.html)</a>
```


```javascript

(function( $ ) {
 
        $.fn.showLinkLocation = function() {
     
            this.filter( "a" ).append(function() {
                return " (" + this.href + ")";
            });
     
            return this;
     
        };
 
    }( jQuery ));

```

我们只用.append()方法接受回调，该回调函数返回的值将追加到遍历的每一个a元素集合中。

`注意：我们没有使用.attr()方法来获得元素的属性，这是因为 原生的DOM API给了我们简单的获取href属性的方式,原生的方法要比jquery的方法性能好!`


本文翻译自api.jquery.com的插件制作官方文档，如果文章有翻译错误，请指正。(转载请注明出处，谢谢:blush:)

[参考原文地址：http://learn.jquery.com/plugins/basic-plugin-creation/](http://learn.jquery.com/plugins/basic-plugin-creation/ "悬停显示")





