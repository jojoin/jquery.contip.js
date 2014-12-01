/*
* 提示框插件
* 作者：杨捷
* 主页：https://github.com/yangjiePro
* QQ：446342398
* email：yangjie@jojoin.com
*
*/




;(function($){

  $.fn.contip = function(opt){
    /*
    var $this = $(this)
      , sign = 'contipalready';
    if($this.attr(sign))
      return
    $this.attr(sign,true);
    */
    return new Contip(this, opt);

  };

  // 事件监听
  function trigger(that, $elm, opt){
    var event = opt.trigger;
    //事件监听
    if(event=='hover'){
      $elm.on('mouseenter', function(){ that.show() });
      if(!opt.live)
        $elm.on('mouseleave', function(){ that.hide() });
    }else if(event=='focus'){
      $elm.on('focusin', function(){ that.show() });
      if(!opt.live)
        $elm.on('focusout', function(){ that.hide() });

    }else if(event=='click' || event=='dbclick'){
      $elm.on(event, function(){ that.show() });
    }
  }

  // 气泡类
  function Contip(elm, opt){
    var $elm = this.$elm = $(elm)
      , opt = this.options = $.extend({}, defOpt, opt);
    //提示内容处理
    this.fixtitle();
    this.enabled = true;
    // 默认显示
    if(opt.show)
      this.show();

    var that = this;
    // 事件监听
    trigger(that, $elm, opt)
    // 浏览器窗口大小改变
    window.onresize = function(){
      that.update();
    }
    // 如果不始终显示
    if(!opt.live){
      //点击空白区域 关闭 sidebar
      $(document).click(function(e){ that.hide() });
      $elm.click(function(event){
          event.stopPropagation(); // 防止事件冒泡
      });
    }
  }


  Contip.prototype = {

      html: function(html){
        if(!this.enabled || !this.$tip)
          return;
        var $tip = this.$tip
          , $con = $tip.find('.contip-con');
        $con.html(html);
        //更新显示位置
        this.update();
      },

      show: function(){
        if(!this.enabled || this.$tip)
          return;
        var opt = this.options
          , $tip = this.newtip();
        $tip.remove().css({visibility: 'hidden',opacity: opt.opacity}).prependTo(document.body);
        // 更新显示位置
        this.update();
        // 显示
        $tip.css({visibility: 'visible', display: 'none'});
        $tip.stop().fadeIn(this.options.fade);
        // 如果不始终显示
        if(!opt.live){
          $tip.click(function(event){
              event.stopPropagation(); // 防止事件冒泡
          });
        }
      },

      update: function(){
        // alert(this.$tip);
        if(!this.$tip)
          return;
        var $tip = this.$tip
          , $v = $tip.find('.contip-v');
        var tip_w = $tip[0].offsetWidth
          , tip_h = $tip[0].offsetHeight
          , elm_w = this.$elm[0].offsetWidth
          , elm_h = this.$elm[0].offsetHeight;
        var style = this.style(tip_w, tip_h, elm_w, elm_h);
        // 小三角 样式
        $v.attr('style',$v.attr('style')+style.v);
        // tip 样式
        $tip.attr('style',$tip.attr('style')+style.tip);
      },

      newtip: function(){
          if (!this.$tip){
              var o = this.options
                , html = o.html || '';
              this.$tip = $('<div class="contip" style="z-index:10000; position:absolute; background:'+o.bg+'; max-width:'+o.max_width+'px; padding:'+o.padding+'px; border-radius:'+o.radius+'px;"></div>')
              .html('<div class="contip-v" style="position:absolute; width:0; height:0; border:solid transparent '+o.v_size+'px;"></div><div class="contip-con" style="color:'+o.color+'; font-size:'+o.font_size+'; background:'+o.fg+'; border-radius:'+o.radius+'px;">'+html+'</div>');
          }
          return this.$tip;
      },

      // tip 气泡样式
      style: function(tip_w, tip_h, elm_w, elm_h){
        var o = this.options
          , ofs = this.$elm.offset()
          , vsize = o.v_size*2
          , vstyle = ' border-'+o.align+'-color:'+o.bg+';'
          , tipstyle = ' ';
        switch(o.align){
          case 'left':
            var vright = -vsize
              , vtop = o.v_px + (tip_h-vsize)*o.v_pos
              , ttop = ofs.top -vtop -o.v_size + elm_h*o.elm_pos + o.elm_px
              , tleft = ofs.left -tip_w -o.v_size - o.rise;
            vstyle += ' right:'+vright+'px; top:'+vtop+'px;';
            tipstyle += ' left:'+tleft+'px; top:'+ttop+'px;';
            break;
          case 'right':
            var vleft = -vsize
              , vtop = o.v_px + (tip_h-vsize)*o.v_pos
              , ttop = ofs.top -vtop -o.v_size + elm_h*o.elm_pos + o.elm_px
              , tleft = ofs.left + elm_w + o.v_size + o.rise;
            vstyle += ' left:'+vleft+'px; top:'+vtop+'px;';
            tipstyle += ' left:'+tleft+'px; top:'+ttop+'px;';
            break;
          case 'bottom':
            var vtop = -vsize
              , vleft = o.v_px + (tip_w-vsize)*o.v_pos
              , tleft = ofs.left -vleft -o.v_size + elm_w*o.elm_pos + o.elm_px
              , ttop = ofs.top +elm_h +o.v_size + o.rise;
            vstyle += ' left:'+vleft+'px; top:'+vtop+'px;';
            tipstyle += ' left:'+tleft+'px; top:'+ttop+'px;';
            break;
          case 'top':
          default:
            var vbottom = -vsize
              , vleft = o.v_px + (tip_w-vsize)*o.v_pos
              , tleft = ofs.left -vleft -o.v_size + elm_w*o.elm_pos + o.elm_px
              , ttop = ofs.top -tip_h -o.v_size - o.rise;
            vstyle += ' left:'+vleft+'px; bottom:'+vbottom+'px;';
            tipstyle += ' left:'+tleft+'px; top:'+ttop+'px;';
            break;
        }
        return {tip: tipstyle, v: vstyle};
      },

      hide: function(){
        if(!this.$tip)
          return
        var $tip = this.$tip;
        $tip.stop().fadeOut(this.options.fade,function(){$tip.remove()});
        this.$tip = null;
      },

      fixtitle: function(){
        var o = this.options;
        if(o.html)
          return
        var $e = this.$elm;
        o.html = $e.attr(o.attr);
        if(o.attr=='title'){
          $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
        }
      },
    
      enable: function() { this.enabled = true; },
      disable: function() { this.enabled = false; },
      toggleEnabled: function() { this.enabled = !this.enabled; }
  };
  


  var defOpt = {

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

  }

})(jQuery);
