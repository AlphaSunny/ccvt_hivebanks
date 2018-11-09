$(function () {
    //get token
    var token = GetCookie('la_token');

    //get reward
    var type = "5";

    function GetRewardFun(type) {
        GetRewardList(token, type, function (response) {
            if (response.errcode == "0") {
                console.log(response);
                $('#rewardTable').DataTable({
                    // order: [[3, "desc"]],
                    destroy: true,
                    deferRender: true,
                    data: response.rows,
                    columns: [
                        {"data": "us_account"},
                        {"data": "tx_detail"},
                        {"data": "amount"},
                        {"data": "gift_time"},
                    ],
                });
            }
        }, function (response) {
            
        })
    }

    GetRewardFun(type);

    $(".send_filter_child").click(function () {
        var type = $(this).val();
        console.log(type);
    })
});