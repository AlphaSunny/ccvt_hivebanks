function GetVerifyBindingInformation(token, type) {
    let info = "";
    BindingInformation(token, function (response) {
        let data = response.rows;
        $.each(data, function (i, val) {
            if (data[i].bind_name == type && data[i].bind_flag == '1') {
                // return true;
                info = data[i].bind_info;
            }
        })
    }, function (response) {
        ErrorPrompt(response.errmsg)
    });
    console.log(info);
    return info;
}