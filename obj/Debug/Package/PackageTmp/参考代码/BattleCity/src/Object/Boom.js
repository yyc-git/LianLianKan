/****************************************
 * 爆炸类
 ****************************************/
var Boom = Class(
{
	_big: false,
	_start: false,
	_sptBoom: null,
	_tickBoom: null,



	Boom: function(big)
	{
		// 创建爆炸精灵
		m_sptBoom = new Sprite("res/Boom.png", 64, 64);
		m_sptBoom.Hide();
		m_sptBoom.SetZ(Const.Z_BOOM);
		m_sptBoom.SetFrameSeq(big ? [0,1,2,3,4,1] : [0,1]);
		App.GameUI.Append(m_sptBoom);


		m_big = big;
		m_tickBoom = new Tick(4);
	},


	Update: function()
	{
		if(!m_start)
			return;

		// 大的爆炸过程中稍作延时
		if(m_big && !m_tickBoom.On())
			return;

		// 显示爆炸动画帧
		m_sptBoom.NextFrame();

		// 爆炸结束
		if(m_sptBoom.GetFrame() == 0)
		{
			m_sptBoom.Hide();
			m_start = false;
			return true;
		}
	},


	Start: function(x, y)
	{
		// 定位爆炸精灵
		m_sptBoom.Move(Const.POS_X + x, Const.POS_Y + y);

		// 开始播放爆炸动画
		m_sptBoom.Show();
		m_start = true;
	},


	Reset: function()
	{
		// 重置爆炸对象
		m_sptBoom.Hide();
		m_tickBoom.Reset();
		m_start = false;
	}
});