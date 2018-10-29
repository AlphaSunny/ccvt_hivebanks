$(function () {
    $("#groupMasterListTable").DataTable({
        "ajax": "http://ccvt_test.fnying.com/api/bot_web/group_list.php",
        "columns": [
            {"data": "id", "class": "id"},
            {"data": "name", "class": "name"},
            {"data": "del", "class": "del"},
            {"data": "is_del", "class": "is_del none"},
            {"data": "flirt", "class": "flirt"},
            {"data": "is_flirt", "class": "is_flirt none"},
        ]
    });
});