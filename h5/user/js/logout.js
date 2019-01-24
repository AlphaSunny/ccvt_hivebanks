//Logout to clear cookies
$('.logout').click(function () {
    DelCookie('user_token');
    window.location.href = getRootPath();
});