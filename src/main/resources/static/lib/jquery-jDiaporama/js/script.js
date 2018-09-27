$(document).ready(function(){

	$(".diaporama1").jDiaporama({
		animationSpeed: "slow",
		delay:2
	});

});


vardefaults = {
	auto:true,//幻灯片是在自动模式
	delay: 3,// 延迟时间为3秒
	animationSpeed:"normal",// 过渡时间是正常的
	controls:true,// 控制按钮默认显示
	keyboard:true,//导航键盘激活
	infos:true,//标题显示
	currentimage:true,// 计数器显示
	paused:false,//幻灯片自动启动
	boucles: 0,// 0 = Illimité, 永远不会停止幻灯片
	sens:"right",// 方向是默认向右滚动的
	onrollover:true//鼠标悬停显示信息
};