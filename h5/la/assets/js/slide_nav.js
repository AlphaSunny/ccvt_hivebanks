var url = getRootPath();
console.log(url);
$.ajax({
    type: "GET",
    dataType: "json",
    url: url + "/la/assets/json/slide_nav.json",
    success:function (response) {
        console.log(response);
    }
});