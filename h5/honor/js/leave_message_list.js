$(function () {
    LeaveMessageList(function (response) {
        let li = "", name = "", text = "",new_arr = [];
        let data = response.rows;
        console.log(data);
        $.each(data, function (i, val) {
            if (data[i].leave_message) {
                console.log(data[i]);
                // new_arr.push(data[i]);
            }
        });
    }, function (response) {
        layer.msg("留言获取失败");
    })
});