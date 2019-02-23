function GetVerifyBindingInformation(token, type) {
    BindingInformation(token, function (response) {
        let data = response.rows;
        $.each(data, function (i, val) {
            if (data[i].bind_name == type && data[i].bind_flag == '1') {
                // return true;
                return data[i].bind_info;
            }
        })
    }, function (response) {
        ErrorPrompt(response.errmsg)
    });
}