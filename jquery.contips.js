
/*
* 提示框插件
* 作者：杨捷
* 主页：http://jojoin.com/user/1/
* QQ：446342398
* email：myworld4059@163.com
*
*/


contips = (function($){

    var A = {}

        ,$body = $('body')
        ,$window = $(window);


    //默认选项
    var theDefaultOptions = {
        //
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

        ready: function($elm,$tip){} //已经显示完成之后的回调
    };




    $.fn.contips = function(opts){

        var that = $(this);

        //参数预处理
        opts.ver_w = 10; //小三角宽度

        return that.each(function() {
            var op = $.extend({},theDefaultOptions,opts);
            op.style = $.extend({},theDefaultOptions.style,opts.style);
            fixEvent($(this),op);
        });

    };


    //注册打开的事件
    function fixEvent(that,op){

        if(op.mode=='hover'){
            that.on('mouseenter',function(){ showTip(that,op); });
            if(op.out_close){ //鼠标移出关闭
                that.on('mouseleave',function(){ hideTip(that,op); });
            }
        }else if(op.mode=='click'){
            that.on('click',function(event){
                var offset = false;
                if(op.cursor){ //显示跟随鼠标
                    offset = mouseCoords(op.event);
                }
                showTip(that,op,offset);
            });
        }else if(op.mode=='instant'){
            var offset = false;
            if(op.cursor){ //显示跟随鼠标
                offset = mouseCoords(op.event);
            }
            showTip(that,op,offset);
        }
    }


    //获取鼠标坐标
    function mouseCoords(ev)
    {
        if(ev.pageX || ev.pageY){
            return {left:ev.pageX, top:ev.pageY};
        }
        return {
            left:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            top:ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    }

    //打开提示框
    function showTip(that,op,offset){
        clearTime(that);
        if(!that.timeoutOpen && that.$tip==null){
            that.timeoutOpen = setTimeout(function(){
                open(that,op,offset);//打开
            },op.open);
        }
    }
    function open(that,op,offset){
        var backOb = calculate(that,op,offset);

        that.$tip = $(getHtml(that,backOb)).appendTo(document.body);
        op.ready(that,that.$tip);
        hoverNotClose(that,op);
        bindCloseEvent(that,op);
    }


    //关闭提示框
    function hideTip(that,op){
        clearTime(that);
        if(!that.timeoutClose){
            that.timeoutClose = setTimeout(function(){
                close(that,op)
            },op.close);
        }
    }
    function close(that,op){
        that.$tip.remove();
        that.$tip = null;
    }



    //清除打开或关闭的延迟
    function clearTime(that){
        if(that.timeoutOpen) {
            clearTimeout(that.timeoutOpen);
            that.timeoutOpen = false;
        }
        if(that.timeoutClose) {
            clearTimeout(that.timeoutClose);
            that.timeoutClose = false;
        }
    }


    //计算位置等等
    function calculate(that,op,offt){
        var backOb = {};
        backOb.con = op.con; //拷贝内容
        var style = backOb.style = {};
        for(var k in op.style){
            style[k] = op.style[k]; //拷贝样式
        }

        var offset=offt,elm_height=0,elm_width=0,align = op.align;
        if(!op.cursor){
            offset = that.offset(); //当前事件元素的相对于body的位置
            elm_height = that.outerHeight();
            elm_width = that.outerWidth();
        }


        //alert(op.align);
        if(align=='auto'){ //默认显示位置变换
            var client = ScollPostion();
            //alert(offset.top - client.top+elm_height/2);
            if(offset.top - client.top+elm_height/2 >= client.clientHeight*0.3){
                align = 'top';
            }else{
                align = 'bottom';
            }
            op.ver_sc = (offset.left - client.left+elm_width/2)/client.clientWidth;
        }

        solveStyle(style,op,align,offset,elm_height,elm_width);

        style.wrap += 'min-width:'+op.min_w+'px;min-height:'+op.min_h+'px';
        backOb.align = align;

        return backOb;
    }


    //解析style属性
    function solveStyle(style,op,align,offset,elm_height,elm_width){

        var body_height = $window.height()
            ,body_width = $window.width();

        op.ver_sc>1?op.ver_sc=1:0;
        op.ver_sc<0?op.ver_sc=0:0;

        if(align=='top' || align=='bottom'){
            if(align=='top'){
                var bottom = body_height - offset.top + op.ver_w + op.oft;
                style.tips += 'bottom:'+bottom+'px;';
            }else{
                var top = elm_height + offset.top + op.ver_w + op.oft;
                style.tips += 'top:'+top+'px;';
            }
            if(op.ver_sc<=0.5){
                var ver_left = (op.min_w - (op.ver_w*2))*op.ver_sc + op.ver_px
                    ,left = offset.left + elm_width*op.elm_sc + op.elm_px - op.ver_w - ver_left;
                style.ver = 'left:'+ver_left+'px;';
                style.tips += 'left:'+left+'px;';
            }else{
                var ver_right = (op.min_w-(op.ver_w*2))*(1.0-op.ver_sc) + op.ver_px
                    ,right = body_width - offset.left - elm_width*(1.0-op.elm_sc) - op.ver_w - ver_right;
                style.ver = 'right:'+ver_right+'px;';
                style.tips += 'right:'+right+'px;';
            }
        }else{
            if(align=='left'){

            }else{

            }
        }
    }


    //获得html
    function getHtml(that,op){
        return tmpl(CONTIPS_TPL,op);
    }

    //关闭提示框按钮，事件绑定
    function bindCloseEvent(that,op){
        that.$tip.find('.close').click(function(){
            close(that,op)
        });
    }

    //鼠标移至提示框不关闭
    function hoverNotClose(that,op){
        if(op.hover){
            that.$tip.mouseenter(function(){
                clearTime(that);
            });
        }
        if(op.out_close){
            that.$tip.mouseleave(function(){
                hideTip(that,op);
            });
        }
    }


    //获取浏览器窗口大小
    function getView(){
        // 获取窗口宽度
        var off = {};
        off.width = off.width || window.innerWidth;
        off.width = off.width || document.body.clientWidth;
         // 获取窗口高度
        off.height = off.height || window.innerHeight;
        off.height = off.height || document.body.clientHeight;
         // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        off.height = off.height ||document.documentElement.clientHeight;
        off.width = off.width|| document.documentElement.clientWidth;

        return off;
    }

    return A;
})(jQuery);





/*
提示框模板
*/

window.CONTIPS_TPL = '<div class="contips" style="[%=style.tips%]">' +
    '<div class="wrap" style="[%=style.wrap%]">' +
    '<div class="ver [%=align%]" style="[%=style.ver%]"><div class="arr1"></div><div class="arr2"></div></div>' +
    '<div class="con" style="[%=style.con%]">[%=con%]</div>' +
    '<div class="close" title="关闭" style="[%=style.close%]">╳</div>' +
    '</div></div>';






/*
模板解析函数
*/

window.tmpl = (function (cache, $) {
    return function (str, data) {
        var fn = !/\s/.test(str)
            ? cache[str] = cache[str]
            || tmpl(document.getElementById(str).innerHTML)

            : function (data) {
            var i, variable = [$], value = [[]];
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            };
            return (new Function(variable, fn.$))
                .apply(data, value).join("");
        };

        fn.$ = fn.$ || $ + ".push('"
            + str.replace(/\\/g, "\\\\")
            .replace(/[\r\t\n]/g, " ")
            .split("[%").join("\t")
            .replace(/((^|%])[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%]/g, "',$1,'")
            .split("\t").join("');")
            .split("%]").join($ + ".push('")
            .split("\r").join("\\'")
            + "');return " + $;

        return data ? fn(data) : fn;
    }})({}, '$' + (+ new Date));






function  ScollPostion() {//滚动条位置
    var t, l, w, h, cw, ch;
    var documentElement = document.documentElement;
    var documentBody = document.body;
    if (documentElement && documentElement.scrollTop) {
        t = documentElement.scrollTop;
        l = documentElement.scrollLeft;
        w = documentElement.scrollWidth;
        h = documentElement.scrollHeight;
    } else if (documentBody) {
        t = documentBody.scrollTop;
        l = documentBody.scrollLeft;
        w = documentBody.scrollWidth;
        h = documentBody.scrollHeight;
    }

    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;
    var doClientWidth = documentBody.clientWidth;
    var doClientHeight = documentBody.clientHeight;
    var enClientWidth = documentElement.clientWidth;
    var enClientHeight = documentElement.clientHeight;

    //获取窗口宽度
    if (innerWidth)
        cw = innerWidth;
    else if ((documentBody) && (doClientWidth))
        cw = doClientWidth;
    //获取窗口高度
    if (innerHeight)
        ch = innerHeight;
    else if ((documentBody) && (doClientHeight))
        ch = doClientHeight;

    //通过深入Document内部对body进行检测，获取窗口大小
    if (documentElement  && enClientHeight &&
        enClientWidth)
    {
        ch = enClientHeight;
        cw = enClientWidth;
    }


    return { top:t, left:l, width:w, height:h, clientWidth:cw ,clientHeight:ch };
}

