/**
 * 精确定时器
 */
function Timer(lisn, time)
{
	var last = +new Date;
	var delay = 0;
	var tid;


	function Update()
	{
		//
		// 时间差累计
		//
		var cur = +new Date;
		delay += (cur - last);
		last = cur;

		if(delay >= time)
		{
			lisn.OnTimer();
			delay %= time;
		}
	}

	this.Start = function()
	{
		tid = setInterval(Update, 1);
	};

	this.Stop = function()
	{
		clearInterval(tid);
		delay = 0;
	};
}