$(function () {
   $.ajax({
       type:"GET",
       dataType:"json",
       url:"",
       success:function (res) {
           let data = res.all_list;
           if(data == ""){
               ErrorPrompt("暂无数据");
               return;
           }
       }
   })
});