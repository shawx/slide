/**
 * 轮播效果小插件 大家来试试吧
 * 原理移动第一个元素和最后一个元素的位置实现循环播放
 * everybody 有空帮我看看第131行
 * @authors tanxiao (wowo8272300@sina.com)
 * @date    2015-08-10 17:02:17
 * @version 1.0（ps 其实已经是改动好久了。。。）
 */
var Slide = function(e){
	this.obj = null;
	this.objChild = null;
	this.prevObj = null;
	this.nextObj = null;
	this.len = 0;
	this.Width = 0;
	this.Height = 0;

	this.actDown = null;
	this.actMove = null;
	this.actEnd = null;
	this.actIn = null;
	this.actOut = null;

	this.isMove = false;
	this.moving = 0;
	this.small = false;
	this.smallId = null;
	btn : false;
	btnLeft : null;
	btnRight : null;

	this.play = false;
	this.speed = null;
	this.timer = null;
	this.cur = null;
	this.idCur = null;
	this.idIndex = 0;

	this.slideJson = {};
	e && this.init(e);
};
Slide.prototype = {
	init:function(e){
		var system = new RegExp("Windows").exec(navigator.userAgent);
		
		this.actDown = system ? 'mousedown' : 'touchstart';
		this.actMove = system ? 'mousemove' : 'touchmove';
		this.actEnd = system ? 'mouseup' : 'touchend';
		this.actIn = 'mouseover';
		this.actOut = 'mouseout';		
		this.obj = 'string'==(typeof e.id) ? document.getElementById(e.id) : e.id;
		this.objChild = 'string'==(typeof e.idChild) ? document.getElementById(e.idChild).children[0]: e.idChild;
		this.len = this.objChild.children.length;
		this.Width = this.obj.offsetWidth;
		this.Height = this.obj.offsetHeight;
		this.slideJson = this.setJson();
		this.cur = 'string' ==(typeof e.cur) ? e.cur : null;
		this.idCur = 'string' ==(typeof e.idCur) ? e.idCur : null;
		var Sli = this.objChild.children;
		for(var i = 0;i<this.len;i++){
			Sli[i].setAttribute('style','height:'+this.Height+'px;width:'+this.Width+'px;left:'+this.Width+'px;');
		}
		this.small = e.small ? true : false;
		if(this.small){
			this.smallId = 'string' == (typeof e.smallId) ? document.getElementById(e.smallId) : e.smallId;
		}
		this.btn = e.btn ? true :false;
		if(this.btn){
			this.btnLeft = 'string' == (typeof e.btnLeft) ? document.getElementById(e.btnLeft) : e.btnLeft;
			this.btnRight = 'string' == (typeof e.btnRight) ? document.getElementById(e.btnRight) : e.btnRight;
		}
		this.play = e.play ? true : false;
		this.speed = e.speed ? e.speed : 0;
		this.run();
	},
	run:function(){
		var that = this;
		this.aEvent(that.objChild,that.actDown,function(e){
			that.down(e);
		});
		this.aEvent(that.objChild,that.actMove,function(e){
			that.move(e);
		});
		this.aEvent(that.objChild,that.actEnd,function(e){
			that.end(e);
		});
		if(new RegExp("Windows").exec(navigator.userAgent) && this.play){
			this.aEvent(that.obj,that.actIn,function(){
				clearInterval(that.timer);
			});
			this.aEvent(that.obj,that.actOut,function(){
				that.timer = setInterval(function(){
					that.theInterval(-1);
				},that.speed);
			});
		}
		this.aEvent(that.btnLeft,'click',function(){
			clearInterval(that.timer);
			that.theInterval(1);
			if(new RegExp("Windows").exec(navigator.userAgent) != 'Windows' && that.play){
				that.timer = setInterval(function(){
					that.theInterval(-1);
				},that.speed);
			}
		});
		this.aEvent(that.btnRight,'click',function(){
			clearInterval(that.timer);
			that.theInterval(-1);
			if(new RegExp("Windows").exec(navigator.userAgent) != 'Windows' && that.play){
				that.timer = setInterval(function(){
					that.theInterval(-1);
				},that.speed);
			}
		});
		var that = this,objSmall = this.smallId.children[0],objSmallCon = [];
		for(var i = 0; i < this.len ;i++){
			objSmallCon[i] = document.createElement('li');
			objSmall.appendChild(objSmallCon[i]);
		}
		this.smallId.children[0].children[that.idIndex].setAttribute('class', that.cur);
		this.liPosition();
		if(this.play){
			this.timer = setInterval(function(){
				that.theInterval(-1);
			},that.speed);
		}
	},
	theInterval:function(orient){
		var that = this;
		this.liPosition();
		that.moving += orient*that.Width;
		setTimeout(function(){//这里有点疑问 谁有好方法共享一下吧
			that.animateFuc(that.moving,0.3);
		}, 0);
		if(orient == -1){
			if(that.idIndex == that.len-1 ){
			that.idIndex = 0;
			}else{
				that.idIndex += 1;
			}
		}else{
			if(this.idIndex == 0){
				this.idIndex = this.len-1;
			}else{
				this.idIndex -= 1;
			}
		}
		that.smallPos();
	},
	animateFuc:function(x,speed){
		this.objChild.setAttribute('style','height:'+ this.Height +'px; width:'+ this.Width * this.len+'px;-webkit-transform: translate3d('+x+'px,0,0); -webkit-transition:'+speed+'s;');
	},
	down:function(e){
		var that = this;
		e.preventDefault();
		clearInterval(that.timer);
		e = e || window.event;
		this.isMove = true;
		this.liPosition();
		this.slideJson.sX = (e.clientX ? e.clientX : e.touches[0].pageX);
		this.slideJson.sY = (e.clientY ? e.clientY : e.touches[0].pageY);
		this.slideJson.fTime = new Date().getMilliseconds();
	},
	move:function(e){
		var that = this;
		e.preventDefault();
		clearInterval(that.timer);
		if(this.isMove != true){return false;}
		e = e || window.event;
		this.slideJson.mX = (e.clientX ? e.clientX : e.touches[0].pageX);
		this.slideJson.mY = (e.clientY ? e.clientY : e.touches[0].pageY);
		this.slideJson.dX = this.slideJson.mX - this.slideJson.sX;
		this.slideJson.dY = this.slideJson.mY - this.slideJson.sY;
		if(this.isMove && Math.abs(this.slideJson.dX) > Math.abs(this.slideJson.dY)){
			this.animateFuc(this.slideJson.dX+this.moving,0);
		}else{
			this.slideJson.dX = 0;
		}
	},
	end:function(e){
		var that = this;
		e.preventDefault();
		//clearInterval(that.timer);
		document.onmousemove = null;
		document.onthouchmove = null;
		this.isMove = false;
		this.slideJson.lTime = new Date().getMilliseconds();
		if(this.slideJson.dX > (this.Width/2)){
			this.prev();
		}else if(this.slideJson.dX < (-1*this.Width/2)){
			this.next();
		}else if(this.slideJson.dX < 0 && (this.slideJson.lTime-this.slideJson.fTime) < 300){
			this.next();
		}else if(this.slideJson.dX > 0 && (this.slideJson.lTime-this.slideJson.fTime) < 300){
			this.prev();
		}else{
			this.animateFuc(that.moving,0.3);
		}
		if(new RegExp("Windows").exec(navigator.userAgent) != 'Windows' && this.play){
			this.timer = setInterval(function(){
				that.theInterval(-1);
			},that.speed);
		}
		
		return false;
	},
	next:function(){
		var that = this;
		this.moving += -1*this.Width;
		this.animateFuc(this.moving,0.3);
		if(this.idIndex == this.len-1 ){
			this.idIndex = 0;
		}else{
			this.idIndex += 1;
		}
		this.smallPos();
	},
	prev:function(){
		this.moving += this.Width;
		this.animateFuc(this.moving,0.3);
		if(this.idIndex == 0){
			this.idIndex = this.len-1;
		}else{
			this.idIndex -= 1;
		}
		this.smallPos();
	},
	smallPos:function(){
		var that = this;
		for(var i =0;i<this.len;i++){
			if(i == this.idIndex){
				this.smallId.children[0].children[i].setAttribute('class', that.cur);
			}else{
				this.smallId.children[0].children[i].setAttribute('class', '');
			}	
		}
	},
	liPosition:function(){
		var that = this;
		var tar = this.objChild;
		if(this.moving == 0){
			this.moving += -1*that.Width;
			this.animateFuc(this.moving,0);
			tar.insertBefore(tar.children[that.len-1],tar.children[0]);
		}else if(this.moving == -1*this.Width*(this.len-1)){
			this.moving += this.Width;
			this.animateFuc(this.moving,0);
			var fChild = tar.children[0];
			tar.appendChild(fChild);
		}
		return true;
	},
	setJson:function(){
		return{
			sX : 0,
			sY : 0,
			mX : 0,
			mY : 0,
			dX : 0,
			dY : 0,
			fTime : 0,
			lTime : 0
		};
	},
	aEvent:function(e,type,fn){
		e = e || window.event;
		if(e.addEventListener){
			e.addEventListener(type,fn,false);
		}else if(e.attachEvent){
			e.attachEvent("on" + type,fn);
		}else{
			e["on" + type] = fn;
		}
	}
};
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