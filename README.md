jquery.contips.js
=================

一个基于JQuery的提示框tips插件。

##选项

```javascript
//默认选项
var theDefaultOptions = {
  
  min_w: 128,
  min_h: 68,

  align: 'auto', //提示框出现的位置 auto top left right bottom
  mode:'hover', //显示的方式 instant hover click focus
  cursor: false, //显示跟随光标
  event: false, //事件

  ver_sc: 0.5,
  ver_px: 0,
  elm_sc: 0.5, //偏移百分比
  elm_px: 0, //偏移像素

  oft: 0, //指定内外偏移，可以为负值，

  out_close: true, //鼠标移出提示框关闭
  hover: true, //鼠标移至提示框不关闭
  open: 360, //显示延迟
  close: 250, //关闭延迟
  ver_pos: false, //指定小三角的位置 {left:0,top:0}

  con: '', //默认内容

  style:{
    close: '', //关闭按钮样式
    wrap: '', //样式，宽高度自适应，可设置min-width和min-height
    ver: '', //小三角样式
    con: '', //内容样式
    tips: '' //总外部样式 absolute fixed 相对于body
  },

  ready: function($elm,$tip){} //已经显示完成之后的回调，$elm为源元素，$tip为新的提示框
};
```



示例代码：

```javascript

$('.elm').contips({
  align: 'bottom',
  con: '提示框内容'
});

```




## 许可证（MIT）

版权所有（c）2013 杨捷<http://jojoin.com/user/1/>

你可以随意使用并修改此模块的内容，但不能替换或修改作者的名称及主页。










