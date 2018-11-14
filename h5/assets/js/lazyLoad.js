//封装懒加载函数
var lazyLoad = (function () {

//匿名函数自调，避免全局污染
    function init() {
        $(window).on("scroll", function () {
            //监听窗口滚动事件
            var clock = setTimeout(function () {//启动定时器，加载图片
                $("img").each(function () {//遍历每张图片
                    var $cur = $(this);
                    if (checkShow($cur))//调用检查函数，如果元素在可视范围内
                        $cur.attr('src', $cur.attr('data-img'));//显示图片
                });
            }, 300);
            if (clock) clearTimeout(clock);//停止定时器
        });
    };

    //检查元素是否在可视范围内
    function checkShow($node) {
        var scrollH = $(window).scrollTop(), //获取窗口滚动高度
            winH = $(window).height(), //获取窗口高度
            top = $node.offset().top;//获取图片距离窗口顶部偏移高度
        if (top < winH + scrollH)
            return true;
        else
            return false;
    };

    //返回init函数
    return {
        load: init
    };
})();

//调用懒加载函数
lazyLoad.load();