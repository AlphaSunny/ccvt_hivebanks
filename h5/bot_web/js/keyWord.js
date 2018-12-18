$(function () {

    //添加-显示弹框
    $(".add_key_word_btn").click(function () {
        $("#myModalLabel").text("添加AI关键字");
        $("#keyWordModal").modal("show");
    });

    // 编辑-
    $(".edit_key_word_btn").click(function () {
        var key_word = $(this).parents("tr").find(".key_word").text();
        var key_word_content = $(this).parents("tr").find(".key_word_content").text();
        $("#myModalLabel").text("编辑AI关键字");
        $("#key_word").val(key_word);
        $("#key_word_content").val(key_word_content);
        $("#keyWordModal").modal("show");
    })
});