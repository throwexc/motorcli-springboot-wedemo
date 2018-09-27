$(function () {
    $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
    $(window).resize(function() {
        $('.loginbox').css({'position': 'absolute', 'left': ($(window).width() - 692) / 2});
    });

    var $username = $("#username");
    var $password = $("#password");
    var $remember = $("#remember");
    var username = $.cookie('motor_cookie_username');
    var password = $.cookie('motor_cookie_password');
    if(username) {
        $username.val(username);
    }
    if(password) {
        $password.val(password);
    }

    if(username && password) {
        $remember.attr("checked", "checked");
        $remember.prop("checked", true);
    }

    $username.focus();
});