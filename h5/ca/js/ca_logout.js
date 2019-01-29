//Logout to clear cookies
$('.logout').click(function () {
    DelCookie('ca_token');
    window.location.href = getRootPath();
});