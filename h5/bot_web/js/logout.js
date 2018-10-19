$(function () {


    $('#logout').click(function () {
        DelCookie('robot_token');
        DelCookie('robot_username');
        window.location.href = 'login.html';
    });





});

