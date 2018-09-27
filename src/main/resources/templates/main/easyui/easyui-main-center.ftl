<#-- @ftlroot "./" -->
<#macro mainCenter>
<div class="easyui-layout" data-options="fit:true,border:false">
    <div data-options="region:'north',border:false">
        <div class="place">
            <span>位置：</span>
            <ul class="placeul">
                <li><a style="cursor: default;" id="moduleLocation" href="javascript:void(0);">首页</a></li>
            </ul>
        </div>
    </div>
    <div data-options="region:'center',border:false" style="padding: 5px">
        <div id="mainTabs" class="easyui-tabs" data-options="fit:true, showHeader : false,border:false">
        </div>
    </div>
</div>

</#macro>