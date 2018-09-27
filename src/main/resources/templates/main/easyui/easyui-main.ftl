<#-- @ftlroot "./" -->

<#include "./easyui-main-top.ftl" />
<#include "./easyui-main-left.ftl" />
<#include "./easyui-main-center.ftl" />

<#macro import_css_other>
<link rel="stylesheet" type="text/css" href="webjars/bootstrap/3.3.6/css/bootstrap.min.css" >
<#--<link rel="stylesheet" type="text/css" href="webjars/dojo/dijit/themes/claro/claro.css" >-->
<link rel="stylesheet" type="text/css" href="css/icon.css" >
<link rel="stylesheet" type="text/css" href="webjars/jquery-easyui/themes/ui-cupertino/easyui.css" >
<link rel="stylesheet" type="text/css" href="webjars/jquery-easyui/themes/icon.css" >
<link rel="stylesheet" type="text/css" href="webjars/jquery-easyui/themes/color.css" >
<link rel="stylesheet" type="text/css" href="lib/ScanPhotos/css/Test-Photo.css" >
<link rel="stylesheet" type="text/css" href="css/easy-ui.css" >
<link rel="stylesheet" type="text/css" href="css/widget.css" >
<link rel="stylesheet" type="text/css" href="css/main.css" >
</#macro>

<#macro body>
<div id="mainLayout" class="easyui-layout easyui-fluid" data-options="fit:true,border:false" style="overflow: hidden;">
    <div data-options="region:'north', border:false">
        <@mainTop />
    </div>
    <div data-options="region:'west', border:false" style="width:160px;">
        <@mainLeft />
    </div>
    <div data-options="region:'center',border:false">
        <@mainCenter />
    </div>
</div>

<div id="accordionBtn" class="accordion-btn"></div>
</#macro>

<#macro import_js_other>
<!-- dojo config -->
<script type="text/javascript" src="script/config.js"></script>
<!-- jquery easy ui -->
<script type="text/javascript" src="webjars/jquery-easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="webjars/jquery-easyui/extension/datagrid-cellediting.js"></script>
<script type="text/javascript" src="webjars/jquery-easyui/locale/easyui-lang-zh_CN.js"></script>
<!-- 消息提示 -->
<script type="text/javascript" src="lib/toastr/toastr.js"></script>
<!-- 图片浏览器 -->
<script type="text/javascript" src="lib/ScanPhotos/js/jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="lib/ScanPhotos/js/Test-Photo.js"></script>
<!-- dojo -->
<script type="text/javascript" src="webjars/dojo/dojo/dojo.js"></script>
<!-- 富文本编辑器 -->
<!--
<script type="text/javascript" charset="utf-8" src="lib/ueditor/ueditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="lib/ueditor/ueditor.all.min.js"> </script>
<script type="text/javascript" charset="utf-8" src="lib/ueditor/lang/zh-cn/zh-cn.js"></script>
-->
<!-- motor -->
<script type="text/javascript" src="lib/motor-for-jquery/motor-for-jquery.js"></script>
<script type="text/javascript" src="lib/motor-for-jquery-easyui/motor-for-jquery-easyui.js"></script>
<!-- 主框架入口 -->
<script type="text/javascript" src="script/core/main/main-index.js"></script>
</#macro>