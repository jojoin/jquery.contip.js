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


  // 气泡类
  function Contip(elm, opt){
    this.options = opt;//$.extend(true, {}, defOpt, opt);
    this.$elm = $(elm);
    this.exist = false;
    this.enabled = true;
    var that = this
      , $elm = this.$elm
      , opt = this.options;
    //提示内容处理
    this.fixtitle();
    // 默认显示
    if(opt.show)
      this.show();
    // 如果不始终显示
    if(!opt.live){
      //点击空白区域 关闭 sidebar
      $(document).click(function(e){ that.hide() });
      $elm.click(function(event){
          event.stopPropagation(); // 防止事件冒泡
      });
    }
    // 气泡打开事件监听
    this.trigger();
  }


  Contip.prototype = {

    timeout: null, //显示或关闭延迟
    onFunc: {}, //事件监听

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
      // 激活气泡，绑定事件
      this.revive();
      // 显示事件
      this._do('show', this.$tip);
      return this;
    },

    tip: function(){
        if (!this.$tip){
          var that = this
            , o = this.options
            , html = o.html || '';
          this.$tip = $('<div class="contip '+o.name+'" name="'+o.name+'" style="z-index:10000; position:absolute; opacity:'+o.opacity+'; background:'+o.bg+'; max-width:'+o.max_width+'px; padding:'+o.padding+'px; border-radius:'+o.radius+'px;"></div>')
          .html('<div class="contip-v" style="position:absolute; width:0; height:0; border:solid transparent '+o.v_size+'px;"></div><div class="contip-con" style="color:'+o.color+'; font-size:'+o.font_size+'; background:'+o.fg+'; border-radius:'+o.radius+'px;">'+html+'</div>');
          // 创建事件
          this._do('create', this.$tip);
        }
        return this.$tip;
    },

    // 初始化 绑定事件
    revive: function(){
      var that = this
        , opt = this.options
        , $tip = this.tip();
      // 如果不始终显示
      if(!opt.live){
        $tip.click(function(event){
            event.stopPropagation(); // 防止事件冒泡
        });
      }
      // 鼠标移入不关闭，移出关闭
      if(opt.hold){
        $tip.mouseenter(function(event){
          clearTimeout(that.timeout);
        });
        $tip.mouseleave(function(event){
          clearTimeout(that.timeout);
          that.$elm.mouseleave(); // 调用关闭逻辑
        });
      }
      return this;
    },

    // 刷新显示位置等样式
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
      return this;
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

    // 关闭提示框
    hide: function(){
      if(!this.exist)
        return
      if(this.options.fade) {
        this.tip().stop().fadeOut(this.options.fade, function(){ $(this).remove();});
      } else {
        this.tip().remove();
      }
      this.exist = false;
      this._do('hide');
      return this;
    },

    fixtitle: function(){
      var opt = this.options;
      if(opt.html)
        return
      var $elm = this.$elm;
      opt.html = $elm.attr(opt.attr);
      if(opt.attr=='title'){
        $elm.attr('original-title', $elm.attr('title') || '').removeAttr('title');
      }
    },


    // 事件监听
    trigger: function(){
      var that = this
        , $elm = this.$elm
        , opt = this.options;
      //事件监听
      switch(opt.trigger){

        case 'hover':
          $elm.on('mouseenter', function(){
            if(that.timeout){
              clearTimeout(that.timeout);
            }
            that.timeout = setTimeout(function(){
              that.show();
              that.timeout = null;
            },opt.delay_in);
          });
          // 如果不始终显示
          if(!opt.live){
            $elm.on('mouseleave', function(){
              if(that.timeout){
                clearTimeout(that.timeout);
              }
              that.timeout = setTimeout(function(){
                that.hide();
                that.timeout = null;
              },opt.delay_out);
            });
          }
        break

        case 'focus':
          $elm.on('focusin', function(){ that.show() });
          if(!opt.live)
            $elm.on('focusout', function(){ that.hide() });
        break;

        case 'click':
          $elm.on('click', function(){ that.show() });
        break

      }
    },


    // 事件监听
    // show hide 
    on: function(name, func){
      if(!this.onFunc[name])
        this.onFunc[name] = [];
      this.onFunc[name].push(func);
      return this;
    },


    // 执行监听的事件
    _do: function(name, err, data){
      if(!this.onFunc[name])
        return
      for(var o in this.onFunc[name]){
        this.onFunc[name][o](err, data);
      }
    },

  
    enable: function() { this.enabled = true; return this;},
    disable: function() { this.enabled = false; return this;},
    toggleEnabled: function() { this.enabled = !this.enabled; return this;}
  };


  var defOpt = {
    name: '', // .contip 元素的 name 和 class
    align: 'top', // 气泡出现的位置， top right bottom left
    padding: 7,
    radius: 4, // 气泡圆角大小 px
    opacity: 1, // 透明度
    max_width: 222, // 气泡最大宽度 px
    rise: 0, // 气泡相对浮动位置，可为负值

    bg: '#000', // 背景颜色
    fg: 'transparent', // 气泡内部颜色
    color: '#fff', // 正文字体颜色
    font_size: '12px', // 正文字体

    fade: 0, // 渐入渐出
    delay_in: 0, //延迟显示
    delay_out: 0, //延迟关闭
    live: false, // 总是显示
    hold: true, //鼠标移入不关闭

    html: '',
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
