<#-- @ftlroot "./" -->

<#include "import-css.ftl" />
<#include "import-js.ftl" />

<#macro common title="Motor Web Demo Test System" bodyClass="claro" bodyStyle="">
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <base href="${basePath}">

    <meta charset="utf-8" />
    <meta name="description" content="Motor Web Demo Test System" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>${title}</title>

    <@import_css />
    <@import_css_other />
</head>
<body class="${bodyClass}" style="${bodyStyle}">
<@body />
<@import_js />
<@import_js_other />
</body>
</html>
</#macro>