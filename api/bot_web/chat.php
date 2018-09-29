<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>记录</title>
</head>
<style>
    body, html {
        height: 100%;
        margin: 0;
        padding: 0;
        background: rgb(243,243,243);
        color: #333;
        font-size: 14px;
        font-family: 'Roboto', "微软雅黑", sans-serif;
    }

    #title{
        padding: 1rem 0;
        border-bottom: 1px solid #9e9e9e;
    }

    #content {
        margin: auto;
        padding: 30px;
    }

    h1 {
        text-align: center;
        padding: 0;
        margin: 0;
    }

    #content li {
        list-style: none;
        padding: 2% 0;
    }

    ul {
        padding: 0;
    }

    #content .time {
        color: #333;
        font-size: 12px;
    }

    #content .chatContent {
        background: #ffffff;
        color: #333333;
        padding: 2%;
        border-radius: 20px;
        position: relative;
        margin: 0;
    }

    #content .chatContent:before {
        content: "";
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        top: 0%;
        left: 3%;
        transform: rotate(45deg);
        border-radius: 5px;
        border: 1.5rem solid #ffffff;
        border-bottom-color: transparent;
        border-right-color: transparent;
    }
</style>
<body>
<div id="title"><h1><?php echo base64_decode($_REQUEST['group_name']);?>--聊天记录</h1></div>
<div id="content">
    <ul>
        <?php
        require_once '../api/inc/common.php';
        ini_set("display_errors", "off");
        $args = array('datetime');
        chk_empty_args('GET', $args);
        $db = new DB_COM();
        $datetime = base64_decode(get_arg_str('GET', 'datetime'));
        $group_name = base64_decode(get_arg_str('GET', 'group_name'));
        $day_start = strtotime(date($datetime.' 00:00:00'));
        $day_end = strtotime(date($datetime.' 23:59:59'));

        $tblPrefix = "@风赢小助手";
        $sql = "select bot_nickname,bot_content,bot_send_time from bot_message WHERE group_name='{$group_name}' AND bot_content NOT LIKE '$tblPrefix%' AND bot_nickname!='风赢小助手' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' ORDER BY bot_create_time  ASC ";
        $db->query($sql);
        $rows = $db->fetchAll();
        foreach ($rows as $k=>$v){
        ?>
        <li>
            <p>
                <span class="name"><?php echo $v['bot_nickname']?></span>
                <span class="time"><?php echo $v['bot_send_time']?></span>
            </p>
            <p class="chatContent">
                <?php echo $v['bot_content']?>
            </p>
        </li>
        <?php } ?>
    </ul>
</div>
</body>
</html>