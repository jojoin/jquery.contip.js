jquery.contip.js
=================

一个基于JQuery的气泡提示框tip插件。

##选项

```javascript

//默认选项{

    align: 'top', // 气泡出现的位置， top right bottom left
    padding: 7,
    radius: 4, // 气泡圆角大小 px
    max_width: 222, // 气泡最大宽度 px
    rise: 0, // 气泡相对浮动位置，可为负值


    bg: '#000', // 背景颜色
    fg: 'transparent', // 气泡内部颜色
    color: '#fff', // 正文字体颜色
    font_size: '12px', // 正文字体

    fade: 0, // 渐入渐出
    delay_in: 0, // 延迟
    delay_out: 0, // 延迟

    html: '',
    live: false, // 总是显示
    opacity: 0.86, // 透明度
    attr: 'title', // attr 要处理的属性
    trigger: 'hover', // 绑定的事件 hover click dblclick focus ..
    show: false, // 是否默认显示

    v_size: 6, // 尖角的大小，像素
    v_pos: 0.5, // 尖角出现的位置
    v_px: 0, // 尖角出现的位置的偏移 px像素 可为负值

    elm_pos: 0.5, // 尖角相对于elm出现的位置
    elm_px: 0 // 尖角偏移 可为负值

  };
```



示例代码：

```javascript

$('.elm').contip({
  align: 'bottom', //出现在元素底部
  html: '提示框内容'
});

```




## 许可证（MIT）

版权所有（c）2013 杨捷<http://github.com/yangjiePro/>

你可以随意使用并修改此模块的内容，但不能替换或修改作者的名称及主页。










