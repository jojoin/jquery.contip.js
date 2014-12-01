/*
* 提示框插件
* 作者：杨捷
* 主页：https://github.com/yangjiePro
* QQ：446342398
* email：yangjie@jojoin.com
*
*/




;(function($){

  // 气泡缓存
  var _id = 0
    , Contips = {};

  //窗口大小改变，更新气泡位置
  window.onresize = update_all;

  // jQuery 扩展
  $.fn.contip = function(opt){

    opt = opt || {};
    for(var d in defOpt){
      if(opt.hasOwnProperty(d))
        continue
      opt[d] = defOpt[d];
    }

    //新建提示框
    var that = new Contip(this, opt);
    that.id = ++_id;
    Contips['id'+that.id] = that;
    return that;

  };


  // 刷新所有气泡
  function update_all(){
    for(var i in Contips) {
      Contips[i].update();
    };
  }


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
    this.options = opt;//$.extend(true, {}, defOpt, opt);
    this.$elm = $(elm);
    this.exist = false;
    this.enabled = true;

    var $elm = this.$elm
      , opt = this.options;

    //提示内容处理
    this.fixtitle();
    // 默认显示
    if(opt.show)
      this.show();

    var that = this;
    // 事件监听
    trigger(that, $elm, opt)
    // 浏览器窗口大小改变
    /*
    window.onresize = function(){
      that.update();
    }
    */
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
        if(!this.enabled)
          return
        var $tip = this.tip()
          , $con = $tip.find('.contip-con');
        $con.html(html);
        //更新显示位置
        this.update();
      },

      show: function(){
        if(!this.enabled || this.exist)
          return
        //表示正在显示中
        this.exist = true;
        var opt = this.options
          , $tip = this.tip();
        // $tip.attr('original-style', $tip.attr('style'));
        $tip.remove().css({ display: 'block', visibility: 'hidden'}).prependTo(document.body);
        // 更新显示位置
        this.update();
        // 显示
        $tip.stop().css({opacity: 0, visibility: 'visible'}).animate({opacity: this.options.opacity}, this.options.fade);
      },

      tip: function(){
          if (!this.$tip){
            var o = this.options
              , html = o.html || '';
            this.$tip = $('<div class="contip" style="z-index:10000; position:absolute; opacity:'+o.opacity+'; background:'+o.bg+'; max-width:'+o.max_width+'px; padding:'+o.padding+'px; border-radius:'+o.radius+'px;"></div>')
            .html('<div class="contip-v" style="position:absolute; width:0; height:0; border:solid transparent '+o.v_size+'px;"></div><div class="contip-con" style="color:'+o.color+'; font-size:'+o.font_size+'; background:'+o.fg+'; border-radius:'+o.radius+'px;">'+html+'</div>');
            // 如果不始终显示
            if(!o.live){
              this.$tip.click(function(event){
                  event.stopPropagation(); // 防止事件冒泡
              });
            }
          }
          return this.$tip;
      },

      update: function(){
        // alert(this.$tip);
        if(!this.exist)
          return
        var tip_w = this.$tip[0].offsetWidth
          , tip_h = this.$tip[0].offsetHeight
          , elm_w = this.$elm[0].offsetWidth
          , elm_h = this.$elm[0].offsetHeight;
        //改变位置等样式
        // console.log([tip_w, tip_h, elm_w, elm_h]);
        this.offset(tip_w, tip_h, elm_w, elm_h);
      },

      // tip 气泡样式
      offset: function(tip_w, tip_h, elm_w, elm_h){
        var $tip = this.tip()
          , $v = $tip.find('.contip-v')
          , o = this.options
          , ofs = this.$elm.offset()
          , vsize = o.v_size*2;

        //$v.attr('already', true); //已经初始化

        switch(o.align){

          case 'left':
            var vright = -vsize
              , vtop = o.v_px + (tip_h-vsize)*o.v_pos
              , ttop = ofs.top -vtop -o.v_size + elm_h*o.elm_pos + o.elm_px
              , tleft = ofs.left -tip_w -o.v_size - o.rise;
            $v.css({right: vright, top: vtop, borderLeftColor: o.bg});
            $tip.css({left: tleft, top: ttop});
            return

          case 'right':
            var vleft = -vsize
              , vtop = o.v_px + (tip_h-vsize)*o.v_pos
              , ttop = ofs.top -vtop -o.v_size + elm_h*o.elm_pos + o.elm_px
              , tleft = ofs.left + elm_w + o.v_size + o.rise;
            $v.css({left: vleft, top: vtop, borderRightColor: o.bg});
            $tip.css({left: tleft, top: ttop});
            return

          case 'bottom':
            var vtop = -vsize
              , vleft = o.v_px + (tip_w-vsize)*o.v_pos
              , tleft = ofs.left -vleft -o.v_size + elm_w*o.elm_pos + o.elm_px
              , ttop = ofs.top +elm_h +o.v_size + o.rise;
            $v.css({left: vleft, top: vtop, borderBottomColor: o.bg});
            $tip.css({left: tleft, top: ttop});
            return

          case 'top':
          default:
            var vbottom = -vsize
              , vleft = o.v_px + (tip_w-vsize)*o.v_pos
              , tleft = ofs.left -vleft -o.v_size + elm_w*o.elm_pos + o.elm_px
              , ttop = ofs.top -tip_h -o.v_size - o.rise;
            $v.css({left: vleft, bottom: vbottom, borderTopColor: o.bg});
            $tip.css({left: tleft, top: ttop});
            // console.log({left: tleft, top: ttop});
            return
        }

      },

      hide: function(){
        if(!this.exist)
          return
        if(this.options.fade) {
          this.tip().stop().fadeOut(this.options.fade, function(){ $(this).remove();});
        } else {
          this.tip().remove();
        }
        this.exist = false;
      },

      fixtitle: function(){
        var o = this.options;
        if(o.html)
          return
        var $elm = this.$elm;
        o.html = $elm.attr(o.attr);
        if(o.attr=='title'){
          $elm.attr('original-title', $elm.attr('title') || '').removeAttr('title');
        }
      },
    
      enable: function() { this.enabled = true; },
      disable: function() { this.enabled = false; },
      toggleEnabled: function() { this.enabled = !this.enabled; },

      //销毁自己
      destroy: function(){
        delete Contips['id'+this.id];
        delete this;
      }
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

    html: '',
    live: false, // 总是显示
    opacity: 1, // 透明度
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
