<?php
/**
 * Created by PhpStorm.
 * User: fanzhuguo
 * Date: 2019/1/9
 * Time: 下午2:39
 */



ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
//die('fuck off');
require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

fuckYou();
function fuckYou(){
    $db = new DB_COM();

    $sql_total_11_30 = "select sum(tx_amount/100000000) as cutter from com_base_balance where ctime > '2018-12-01' and debit_id in ('6C69520E-E454-127B-F474-452E65A3EE75','50D2910C-6C38-344F-9D30-3289F945C2A6') ";


    $sql_adder_11_30 = "select sum(tx_amount/100000000) as adder from com_base_balance where ctime > '2018-12-01' and credit_id in ('6C69520E-E454-127B-F474-452E65A3EE75','50D2910C-6C38-344F-9D30-3289F945C2A6') and tx_type in('gone_staff','give_like','ccvt_inte')";

    $sql_total_12_28 = "select sum(tx_amount/100000000) as cutter from com_base_balance where ctime > '2018-12-29' and debit_id in ('6C69520E-E454-127B-F474-452E65A3EE75','50D2910C-6C38-344F-9D30-3289F945C2A6')";
    $sql_adder_12_28 = "select sum(tx_amount/100000000) as adder from com_base_balance where ctime > '2018-12-29' and credit_id in ('6C69520E-E454-127B-F474-452E65A3EE75','50D2910C-6C38-344F-9D30-3289F945C2A6') and tx_type in('gone_staff','give_like','ccvt_inte')";

    $sql_total_today = "select sum((base_amount+lock_amount)/100000000) as today from us_base" ;


    $db->query($sql_total_11_30);
    $sql_total_11_30 = $db->fetchRow();

    $db->query($sql_adder_11_30);
    $sql_adder_11_30 = $db->fetchRow();

    $db->query($sql_total_12_28);
    $sql_total_12_28 = $db->fetchRow();

    $db->query($sql_adder_12_28);
    $sql_adder_12_28 = $db->fetchRow();

    $db->query($sql_total_today);
    $sql_total_today = $db->fetchRow();

    $cutter = $sql_total_11_30[0]['cutter'] - $sql_adder_11_30[0]['adder'];
    $adder_1130 = $sql_adder_11_30[0]['adder'];
    $total_1130 = $sql_total_today[0]['today'] - $cutter + $adder_1130;


    $cutter = $sql_total_12_28[0]['cutter'] - $sql_total_12_28[0]['adder'];
    $adder_1130 = $sql_total_12_28[0]['adder'];
    $total_1228 = $sql_total_today[0]['today'] - $cutter + $adder_1130;

    echo '1130:'.$total_1130;
    echo '1228:'.$total_1228;
    echo '----------month.'.$total_1228-$total_1130;
}