# slide
一个轮播图 小插件

// 调用================================================
window.onload = function(){
	var slide1 = new Slide({
		id : 'slide1',//最外层div id
		idChild : 'bd1',//内层div id
		idCur : 't_cur',//current的classname
		play : true,//是否循环
		speed : 3000,
		small : true,//是否有小圆标
		smallId : 'small1',//小圆标的id
		cur : 'cur',//小圆标current的classna
		btn : true,//是否有按钮
		btnLeft : 't_prev',//上一页id
		btnRight : 't_next'//下一页id
	});
};
