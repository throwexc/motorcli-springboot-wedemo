<#-- @ftlroot "./" -->
<#macro mainTop>
<div class="main-top">
    <div class="topleft">
        <a href="javascript:void(0);"><img src="images/main/logo.png" title="信息管理系统界面" /></a>
    </div>

    <ul class="nav">
        <#if userModules?exists>
            <#list userModules as m>
                <li>
                    <#if m_index == 0>
                        <a href="javascript:void(0);" data-ui="${m.moduleUrl}" class="selected">
                            <img src="${m.moduleIcon!}" title="${m.name!}" />
                            <h2>${m.name!}</h2>
                        </a>
                    <#else >
                        <a href="javascript:void(0);" data-ui="${m.moduleUrl}">
                            <img src="${m.moduleIcon!}" title="${m.name!}" />
                            <h2>${m.name!}</h2>
                        </a>
                    </#if>

                </li>
            </#list>
        </#if>
    </ul>

    <div class="topright">
        <ul>
            <li><span><img src="images/main/help.png" title="帮助" class="helpimg" style="margin-top: -5px;"/></span><a href="#">帮助</a></li>
            <li><a href="#">关于</a></li>
            <li><a href="logout" target="_parent">退出</a></li>
        </ul>

        <div class="user">
            <span id="userBox">${session_user_info.name!}</span>
            <i id="msgBox">消息</i>
            <b id="userMsgCount">0</b>
        </div>
    </div>
</div>
</#macro>