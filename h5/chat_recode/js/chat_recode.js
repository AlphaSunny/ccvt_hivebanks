$(function () {
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    console.log(height);
    $('html,body').scrollTop(999999999);
});