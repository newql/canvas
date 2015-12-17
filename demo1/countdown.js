var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;//第一个数字距离画布左边的距离
//const endTime = new Date(2015,8,18,18,47,52);
//6代表的七月 在javascript中月份是从0到11 代表十二个月 最多倒计时四天的时间 是因为时间的小时给的是两位数字即最多为99小时

//要让endtime成为当前时间的后面的一个小时 更改程序为如下  倒计时一个小时
var endTime = new Date();
endTime.setTime(endTime.getTime()+3600*1000);

var curShowTimeSeconds = 0;//将要在浏览器网页中显示的时间

var balls = [];//产生新的小球 有颜色的
const colors = ["#33b5e5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];



window.onload = function(){

	//下面5句话是对屏幕的自适应
	WINDOW_WIDTH = document.documentElement.clientWidth-20;
	WINDOW_HEIGHT = document.documentElement.clientHeight-20;
	//WINDOW_HEIGHT = 700;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;//108 = 15*6+9*2 得到的是RADIUS+1 所以最后要减去1
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
	var canvas = document.getElementById("canvas");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	var ctx = canvas.getContext("2d");

	curShowTimeSeconds = getCurrentShowTimeSeconds();//计算出时间差的秒数
	//render(ctx);
	setInterval(function(){
		render(ctx);//负责绘制数字
		update();//调整数据 时间的变化
	},50);

};

function getCurrentShowTimeSeconds()
{
	var curTime = new Date();
	var ret = endTime.getTime()-curTime.getTime();
	ret = Math.round(ret/1000);

	return ret>=0 ? ret:0;
}

function update()//负责时间的改变 以及如果需要产生新的小球时产生小球的运动变化进行更新
{
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();//下一次要显示的时间

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;

	if(nextSeconds != curSeconds)//判断时间是否发生变化
	{
		if(parseInt(curHours/10)!=parseInt(nextHours/10))
		{
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		if(parseInt(curHours%10)!=parseInt(nextHours%10))
		{
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours/10));
		}
		if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10))
		{
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10))
		{
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10))
		{
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10))
		{
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(nextSeconds%10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}
	updateBalls();//对存在的小球进行更新
	//console.log(balls.length);
}

function updateBalls()//小球弹跳位置的改变
{
	for(var i=0;i<balls.length;i++)
	{
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= WINDOW_HEIGHT-RADIUS)
		{
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy*0.75;
		}
	}

	//后面这几句话的作用是将已经出了画布的小球都删除掉
	var cnt = 0;//记录有多少个小球在画面中
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
            balls[cnt++] = balls[i];
        //所有满足上述if条件中的小球都会继续在画布上 其余的小球都已经没有在balls中了

    while( balls.length > cnt ){
        balls.pop();//把数字cnt数字以外的小球都删掉了
    }

}

function addBalls(x,y,num)//在x y的位置加上彩色的小球
{
	for(var i=0;i<digit[num].length;i++)
	{
		for(var j=0;j<digit[num][i].length;j++)
		{
			if(digit[num][i][j] ==1)
			{
				var aBall = {
					x:x+(j*2+1)*(RADIUS+1),
					y:y+(i*2+1)*(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					//小球在x方向的速度 取-4或者4
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
					//随机获取上述colors中的一个颜色
					
				}
				balls.push(aBall);
			}
		}
	}
}

function render(ctx)//绘制时间 和绘制小球
{
	ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//将之前的画布内容清掉再重新画

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds%60;

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),ctx);//绘制每个数字
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),ctx);//绘制每个数字

	for(var i=0;i<balls.length;i++)//绘制小球
	{
		ctx.fillStyle = balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
	}
};

function renderDigit(x,y,num,ctx)
{
	ctx.fillStyle = "rgb(0,102,153";

	for(var i=0;i<digit[num].length;i++)
	{
		for(var j=0;j<digit[num][i].length;j++)
		{
			if(digit[num][i][j]==1)
			{
				ctx.beginPath();
				ctx.arc(x+(j*2+1)*(RADIUS+1),y+(i*2+1)*(RADIUS+1),RADIUS,0,2*Math.PI);
				ctx.closePath();

				ctx.fill();
			}
		}
	}
}
