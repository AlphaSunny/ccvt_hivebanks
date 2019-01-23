$(function () {
    var li = "", li_2 = "";

    function SetProgress(i) {
        $(".progress_span").css("width", i + "%");
        $(".progress_text").text(i + "%");
    }

    var i = Math.ceil(Math.random() * 10);

    function doProgress() {
        if (i > 100) {
            $(".progress_span").css("width", "100%");
            $(".progress_text").text(100 + "%");
            $(".up_title").text("升级成功");

            setTimeout(function () {
                window.location.href="glory2.html";
            },1000);
        }
        if (i <= 100) {
            setTimeout(function () {
                doProgress();
            }, 500);
            SetProgress(i);
            i += Math.ceil(Math.random() * 20);
        }
    }

    $(".first_text").click(function () {
        doProgress();
        $(this).remove();
        $(".progress_box").css("display", "block");
    });
});