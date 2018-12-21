var url = getRootPath();
var li = "";
$.ajax({
    type: "GET",
    dataType: "json",
    url: url + "/h5/la/assets/json/slide_nav.json",
    success: function (response) {
        $.each(response, function (i, val) {
            li+="<li>"+ response[i].name +"</li>";
            if(this.second_nav){
                $.each(this.second_nav, function (j, vaj) {
                    if(this.third_nav){
                        // console.log("3");

                    }

                });
                // console.log("2");
            }
            // console.log("1")
        })
    }
});