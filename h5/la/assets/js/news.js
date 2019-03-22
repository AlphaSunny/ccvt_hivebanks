$(function () {
    //get token
    var token = GetCookie("la_token");

    let limit = 50, offset = 0;

    function GetNewsListFun(limit, offset) {
        let total = "", totalPage = "", count = "", tr = "",overdue_time = "";
        GetNewsList(token, limit, offset, function (response) {
            if (response.errcode == "0") {
                ShowLoading("hide");
                var data = response.rows;
                if (data == null) {
                    GetDataEmpty("newsList", "4");
                    return;
                }

                total = response.total;
                totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (totalPage > 1 && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }

                $.each(data, function (i, val) {
                    if(data[i].overdue_time == "0"){
                        overdue_time = "--";
                    }else{
                        overdue_time = data[i].overdue_time;
                    }
                    let now_time = new Date();
                    let out_time = new Date("2019/03/30 16:04");
                    console.log(now_time);
                    console.log(out_time);
                    console.log(out_time - now_time);
                    tr += "<tr class='newsItem'>" +
                        "<td><a href='newsDetail.html?news_id=" + data[i].news_id + "' class='newsTitleClick'>" + data[i].title + "</a></td>" +
                        "<td class='text-center'><span>" + data[i].author + "</span></td>" +
                        "<td class='text-center'><span>" + data[i].ctime + "</span></td>" +
                        "<td class='text-center'><span>" + overdue_time + "</span></td>" +
                        "<td class='text-center'>" +
                        "<span class='news_id none'>" + data[i].news_id + "</span>" +
                        "<button class='btn btn-success modifyNewsBtn i18n' name='modify'>modify</button>" +
                        "<button class='btn btn-danger margin-left-2 deleteNewsBtn i18n' name='delete'>delete</button>" +
                        "</td>" +
                        "</tr>"
                });
                $("#newsList").html(tr);
                execI18n();
                //显示页码
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        ShowLoading("show");
                        GetNewsListFun(limit, (current - 1) * limit);
                    }
                });
            }

        }, function (response) {
            ShowLoading("hide");
            GetDataFail("newsList", "4");
            LayerFun(response.errcode);
        });
    }

    GetNewsListFun(limit, offset);


    //delete news
    $(document).on("click", ".deleteNewsBtn", function () {
        var news_id = $(this).siblings(".news_id").text(), _this = $(this);
        $(".preloader-wrapper").addClass("active");
        DeleteNews(token, news_id, function (response) {
            if (response.errcode == "0") {
                $(".preloader-wrapper").removeClass("active");
                LayerFun("successfullyDeleted");
                _this.closest(".newsItem").remove();

            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun("failedToDelete");
        })
    });

    //modify news
    $(document).on("click", ".modifyNewsBtn", function () {
        var this_news_id = $(this).siblings(".news_id").text();
        window.location.href = "pressReleases.html?this_news_id=" + this_news_id;
    })


});