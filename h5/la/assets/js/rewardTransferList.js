$(function () {
    //get token
    var token = GetCookie('la_token');

    //get reward
    var type = "5";
    function GetRewardFun (type){
        GetRewardList(token,type,function (response) {
            if(response.errcode == "0"){
                console.log(response);
            }
        }, function (response) {
            
        })
    }
    GetRewardFun(type);
});