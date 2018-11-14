// //封装懒加载函数
// var lazyLoad = (function () {
//
// //匿名函数自调，避免全局污染
//     function init() {
//         $(window).on("scroll", function () {
//             //监听窗口滚动事件
//             var clock = setTimeout(function () {//启动定时器，加载图片
//                 $("img").each(function () {//遍历每张图片
//                     var $cur = $(this);
//                     if (checkShow($cur))//调用检查函数，如果元素在可视范围内
//                         $cur.attr('src', $cur.attr('data-img'));//显示图片
//                 });
//             }, 300);
//             if (clock) clearTimeout(clock);//停止定时器
//         });
//     };
//
//     //检查元素是否在可视范围内
//     function checkShow($node) {
//         var scrollH = $(window).scrollTop(), //获取窗口滚动高度
//             winH = $(window).height(), //获取窗口高度
//             top = $node.offset().top;//获取图片距离窗口顶部偏移高度
//         if (top < winH + scrollH)
//             return true;
//         else
//             return false;
//     };
//
//     //返回init函数
//     return {
//         load: init
//     };
// })();
//
// //调用懒加载函数
// lazyLoad.load();

$(window).on('scroll', function () {//当页面滚动的时候绑定事件
    $('.mapImgBox img').each(function () {//遍历所有的img标签
        if (checkShow($(this)) && !isLoaded($(this))) {
            // 需要写一个checkShow函数来判断当前img是否已经出现在了视野中
            //还需要写一个isLoaded函数判断当前img是否已经被加载过了
            loadImg($(this));//符合上述条件之后，再写一个加载函数加载当前img
        }
    })
});

function checkShow($img) { // 传入一个img的jq对象
    var scrollTop = $(window).scrollTop();  //即页面向上滚动的距离
    var windowHeight = $(window).height(); // 浏览器自身的高度
    var offsetTop = $img.offset().top;  //目标标签img相对于document顶部的位置

    if (offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop) { //在2个临界状态之间的就为出现在视野中的
        return true;
    }
    return false;
}

function isLoaded($img) {
    return $img.attr('data-src') === $img.attr('src'); //如果data-src和src相等那么就是已经加载过了
}

function loadImg($img) {
    $img.attr('src', $img.attr('data-src')); // 加载就是把自定义属性中存放的真实的src地址赋给src属性
}