$(function () {
    LeaveMessageList(function (response) {
        console.log(response);
    }, function (response) {
        layer.msg("留言获取失败");
    })
});