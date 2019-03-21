$(function () {
    LeaveMessageList(function (response) {
        console.log(response);
        let li = "", name = "", text = "",new_arr = [];
        let data = response.rows;
        $.each(data, function (i, val) {
            if (data[i].leave_message) {
                console.log(val);
                // new_arr.push(data[i]);
            }
        });
    }, function (response) {
        layer.msg("留言获取失败");
    })
});