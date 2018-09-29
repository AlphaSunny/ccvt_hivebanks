<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<style>
    .elegant-aero {
        margin-left:auto;
        margin-right:auto;
        max-width: 500px;
        background: #D2E9FF;
        padding: 20px 20px 20px 20px;
        font: 12px Arial, Helvetica, sans-serif;
        color: #666;
    }
    .elegant-aero h1 {
        font: 24px "Trebuchet MS", Arial, Helvetica, sans-serif;
        padding: 10px 10px 10px 20px;
        display: block;
        background: #C0E1FF;
        border-bottom: 1px solid #B8DDFF;
        margin: -20px -20px 15px;
    }
    .elegant-aero h1>span {
        display: block;
        font-size: 11px;
    }

    .elegant-aero label>span {
        float: left;
        margin-top: 10px;
        color: #5E5E5E;
    }
    .elegant-aero label {
        display: block;
        margin: 0px 0px 5px;
    }
    .elegant-aero label>span {
        float: left;
        width: 20%;
        text-align: right;
        padding-right: 15px;
        margin-top: 10px;
        font-weight: bold;
    }
    .elegant-aero input[type="text"], .elegant-aero input[type="email"], .elegant-aero textarea, .elegant-aero select {
        color: #888;
        width: 70%;
        padding: 0px 0px 0px 5px;
        border: 1px solid #C5E2FF;
        background: #FBFBFB;
        outline: 0;
        -webkit-box-shadow:inset 0px 1px 6px #ECF3F5;
        box-shadow: inset 0px 1px 6px #ECF3F5;
        font: 200 12px/25px Arial, Helvetica, sans-serif;
        height: 30px;
        line-height:15px;
        margin: 2px 6px 16px 0px;
    }
    .elegant-aero textarea{
        height:100px;
        padding: 5px 0px 0px 5px;
        width: 70%;
    }
    .elegant-aero select {
        background: #fbfbfb url('down-arrow.png') no-repeat right;
        background: #fbfbfb url('down-arrow.png') no-repeat right;
        appearance:none;
        -webkit-appearance:none;
        -moz-appearance: none;
        text-indent: 0.01px;
        text-overflow: '';
        width: 70%;
    }
    .elegant-aero .button{
        padding: 10px 30px 10px 30px;
        background: #66C1E4;
        border: none;
        color: #FFF;
        box-shadow: 1px 1px 1px #4C6E91;
        -webkit-box-shadow: 1px 1px 1px #4C6E91;
        -moz-box-shadow: 1px 1px 1px #4C6E91;
        text-shadow: 1px 1px 1px #5079A3;

    }
    .elegant-aero .button:hover{
        background: #3EB1DD;
    }
</style>
<body>
<?php
    require_once '../inc/common.php';
    ini_set("display_errors", "off");
    $db = new DB_COM();
    if ($_POST['date']){
        $id = $_POST['id'];
        $date = $_POST['date'];
        if ($id){
            $sql = "update bot_date set date='{$date}' WHERE id='{$id}'";
            $db->query($sql);
            $count = $db->affectedRows($sql);
            if (!$count){
                echo "<script type='text/javascript'> alert('失败');window.history.go(-1);</script>";
            }else{
                echo "<script type='text/javascript'> alert('sucess');window.location.href='date.php'; </script>";
            }
        }else{
            $data['date'] = $date;
            $data['intime'] = time();
            $sql = $db->sqlInsert("bot_date", $data);
            $timer_id = $db->query($sql);
            if (!$timer_id){
                echo "<script type='text/javascript'> alert('失败');window.history.go(-1);</script>";
            }else{
                echo "<script type='text/javascript'> alert('sucess');window.location.href='date.php'; </script>";
            }
        }
    }
?>
<div class="elegant-aero">
    <form action="<?php echo $_SERVER['PHP_SELF'];?>" method="post">
        <?php
            ini_set("display_errors", "off");
            $id = intval($_GET['id']);
            if ($id) {
                require_once '../inc/common.php';
                $db = new DB_COM();
                $sql = "select * from bot_date WHERE id='{$id}'";
                $db->query($sql);
                $row = $db->fetchRow();
            }
        ?>
        <h1><?php if ($id){echo "修改";}else{echo "添加";}?>页面</h1>
        <input type="hidden" name="id" value="<?php echo $id?>">
        <label>
            <span>日期 :</span>
            <input id="date" type="text" name="date"  value="<?php if ($id){echo $row['date'];}?>" placeholder="" />
        </label>

            <span>注:可以填写周几,也可以填写日期,Sunday（星期日）、Monday（星期一）、Tuesday（星期二）、Wednesday（星期三）、Thursday（星期四）、Friday（星期五）、Saturday（星期六）</span>

        <label>
            <span>&nbsp;</span>
            <input type="submit" class="button" id="submit" value="Send"/>
        </label>

    </form>
</div>
<script src="./js/jquery.js"></script>
<script type="text/javascript">
//$(function () {
//    $('#submit').click(function () {
//        alert(222);
//    })
//})
window.onload = function () {
    var subBtn = document.getElementById("submit");
    subBtn.onclick = function () {
        var date = document.getElementById("date").value;
        if (date==''){
            alert('请填写日期');
            date.focus();
            return false;
        }
    }
}
</script>
</body>
</html>