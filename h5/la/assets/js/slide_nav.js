var url = getRootPath();
$.ajax({
    type: "GET",
    dataType: "json",
    url: url + "/h5/la/assets/json/slide_nav.json",
    success: function (response) {
        console.log(response);
        $.each(response, function (i, val) {
            // console.log(response[i]);
            if(this.second_nav){
                $.each(this.second_nav, function (j, vaj) {
                    if(this.third_nav){
                        console.log("3");
                    }

                });
                console.log("2");
            }
            console.log("1")
        })
    }
});