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
    require_once '../../inc/common.php';
    ini_set("display_errors", "off");
    $db = new DB_COM();
    if ($_POST['name'] && $_POST['ba_id']){
        $id = $_POST['id'];
        $name = $_POST['name'];
        $ba_id = $_POST['ba_id'];
        if ($id){
            $sql = "update bot_group set name='{$name}',ba_id='{$ba_id}' WHERE id='{$id}'";
            $db->query($sql);
            $count = $db->affectedRows($sql);
            if (!$count){
                echo "<script type='text/javascript'> alert('失败');window.history.go(-1);</script>";
            }else{
                echo "<script type='text/javascript'> alert('sucess');window.location.href='group.php'; </script>";
            }
        }else{
            $data['name'] = $name;
            $data['ba_id'] = $ba_id;
            $data['intime'] = time();
            $sql = $db->sqlInsert("bot_group", $data);
            $timer_id = $db->query($sql);
            if (!$timer_id){
                echo "<script type='text/javascript'> alert('失败');window.history.go(-1);</script>";
            }else{
                echo "<script type='text/javascript'> alert('sucess');window.location.href='group.php'; </script>";
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
                require_once '../../inc/common.php';
                $db = new DB_COM();
                $sql = "select * from bot_group WHERE id='{$id}'";
                $db->query($sql);
                $row = $db->fetchRow();
            }
        ?>
        <h1><?php if ($id){echo "修改";}else{echo "添加";}?>页面</h1>
        <input type="hidden" name="id" value="<?php echo $id?>">
        <label>
            <span>群组名称 :</span>
            <input id="name" type="text" name="name"  value="<?php if ($id){echo $row['name'];}?>" placeholder="" />
        </label>
        <label>
            <span>ba_id :</span>
            <textarea id="ba_id" name="ba_id" placeholder=""><?php if ($id){echo $row['ba_id'];}?></textarea>
        </label>
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
        var name = document.getElementById("name").value;
        var ba_id = document.getElementById("ba_id").value;
        if (name==''){
            alert('请填写群组名称');
            name.focus();
            return false;
        }else if (ba_id==''){
            alert('请填写ba_id');
            ba_id.focus();
            return false;
        }
    }
}
</script>
</body>
</html>