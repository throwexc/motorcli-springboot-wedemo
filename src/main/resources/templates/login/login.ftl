<#-- @ftlroot "./" -->
<!-- 登录界面 -->
<#include "../common/common.ftl" />

<#macro import_css_other>
<link rel="stylesheet" type="text/css" href="css/login.css">
</#macro>

<#macro body>
<div id="mainBody">
    <div id="cloud1" class="cloud"></div>
    <div id="cloud2" class="cloud"></div>
</div>

<div class="logintop">
    <span>欢迎登录后台管理界面平台</span>
    <ul>
        <li><a href="#">回首页</a></li>
        <li><a href="#">帮助</a></li>
        <li><a href="#">关于</a></li>
    </ul>
</div>

<div class="loginbody">
    <span class="systemlogo"></span>
    <div class="loginbox">
        <form action="login/check" method="post">
            <ul>
                <li>
                    <div class="login-msg">${msg!}</div>
                </li>
                <li><input id="username" name="username" type="text" class="loginuser" value="admin"/></li>
                <li><input id="password" name="password" type="password" class="loginpwd"/></li>
                <li>
                    <label><input id="remember" name="remember" type="checkbox" value="remember" checked="checked" />记住密码</label>
                    <#--<label><a href="#">忘记密码？</a></label>-->
                    <button type="submit" class="loginbtn">登录</button>
                </li>
            </ul>
        </form>
    </div>
</div>

<div class="loginbm">版权所有  仅供学习交流，勿用于任何商业用途</div>
</#macro>

<#macro import_js_other>
<script type="text/javascript" src="webjars/jquery-cookie/1.4.1-1/jquery.cookie.js"></script>
<script src="script/login/cloud.js"></script>
<script src="script/login/login.js"></script>
</#macro>

<@common bodyClass="" bodyStyle="background-color:#1c77ac; background-image:url(images/login/light.png); background-repeat:no-repeat; background-position:center top; overflow:hidden;" />