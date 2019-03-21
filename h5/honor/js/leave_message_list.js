$(function () {
    LeaveMessageList(function (response) {
        let li = "", name = "", text = "",new_arr = [];
        let data = response.rows;
        console.log(data);
        $.each(data, function (i, val) {
            console.log(val.leave_message);
        });
    }, function (response) {
        layer.msg("留言获取失败");
    })
});