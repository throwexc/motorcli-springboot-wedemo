<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <base href="${basePath}">

    <title>404 页面不存在</title>

    <link rel="stylesheet" href="webjars/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" href="lib/layui/css/layui.css" media="all">

    <style>
        .tips {
            margin-top: 30px;
            text-align: center;
        }

        .iocn-404 {
            font-size: 300px;
        }

        .message-404 {
            width: 500px;
            margin: 30px auto;
            padding-top: 20px;
            border-top: 5px solid #009688;
            font-size: 16px;
        }

        .message-404 h1 {
            font-size: 100px;
            line-height: 100px;
            color: #009688;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="tips">
            <i class="layui-icon iocn-404" face=""></i>
            <div class="layui-text message-404">
                <h1>
                    <span class="layui-anim layui-anim-loop layui-anim-">4</span>
                    <span class="layui-anim layui-anim-loop layui-anim-rotate">0</span>
                    <span class="layui-anim layui-anim-loop layui-anim-">4</span>
                </h1>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 text-center">
                <button id="goBackBtn" class="layui-btn layui-btn-primary">返回上一个页面</button>
            </div>
        </div>
    </div>

    <script src="webjars/jquery/2.2.3/jquery.min.js"></script>

    <script>
        $(function() {
            var $goBackBtn = $("#goBackBtn");

            $goBackBtn.click(function() {
                window.history.go(-1);
            });
        });
    </script>
</body>
</html>