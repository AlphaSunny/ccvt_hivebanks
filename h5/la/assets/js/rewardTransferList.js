$(function () {
    //get token
    var token = GetCookie('la_token');

    //get reward
    var type = "5";

    function GetRewardFun(type) {
        GetRewardList(token, type, function (response) {
            if (response.errcode == "0") {
                $('#rewardTable').DataTable({
                    order: [[2, "desc"]],
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

    $("#filter_send").on("change", function () {
        var type = $(this).find("option:selected").val();
        GetRewardFun(type);
    })
});