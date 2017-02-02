/****************************************
 * 玩家坦克类
 ****************************************/
var MyTank = Class(Tank,
{
	_sptBulprf: null,		// 防弹衣精灵
	_timerBulprf: 0,		// 防弹时间



	MyTank: function()
	{
		$Tank(0);	// super

		//
		// 创建防弹衣精灵
		//
		m_sptBulprf = new Sprite("res/Misc.png", 32, 32);
		m_sptBulprf.Hide();
		m_sptBulprf.SetFrameSeq(Tank.BULPRF);
		m_sptTank.Append(m_sptBulprf);

		m_tickBirth = new Tick(2);
	},


	/**
	 * 覆盖 -- 界面更新
	 */
	_UpdateUI: function()
	{
		--m_timerBulprf;

		//
		// 更新防弹衣动画
		//
		if(m_timerBulprf > 0)
		{
			m_sptBulprf.Show();
			m_sptBulprf.NextFrame();
		}
		else if(m_timerBulprf == 0)
		{
			m_sptBulprf.Hide();
		}
	},


	/**
	 * 覆盖 -- 设置类型
	 */
	_SetType: function(t)
	{
		$Speed = 2;

		switch(t)
		{
		case 0:		// 普通
			m_fireDelay = 13;
			this._SetBullets(1, 2, false);
			break;

		case 1:		// 快速
			m_fireDelay = 11;
			this._SetBullets(1, 3, false);
			break;

		case 2:		// 连发
			m_fireDelay = 7;
			this._SetBullets(2, 3, false);
			break;

		case 3:		// 威力
			m_fireDelay = 7;
			this._SetBullets(2, 3, true);
			break;
		}

		m_icon = t;
	},


	/**
	 * 覆盖 -- 坦克被击中
	 */
	_Hit: function()
	{
		if(m_timerBulprf > 0)
		{
			return HitState.MISS;
		}
		else
		{
			m_sptTank.Hide();
			return HitState.HIT;
		}
	},


	/**
	 * 覆盖 -- 坦克爆炸
	 */
	_Boom: function()
	{
		$SetType(0);

		// 减少1条命
		App.Game.LifeDec();

		m_state = TankState.RESET;
	},


	/**
	 * 覆盖 -- 坦克重置
	 */
	_Reset: function()
	{
		//
		// 停止防弹状态
		//
		if(m_timerBulprf > 0)
		{
			m_timerBulprf = 0;
			m_sptBulprf.Hide();
		}
	},


	/**
	 * 开启防弹衣
	 */
	StartBulProof: function(t)
	{
		m_timerBulprf = t;
	},


	/**
	 * 坦克升级
	 */
	Upgrade: function()
	{
		if(m_type < 3)
			$SetType(m_type + 1);
	},


	/**
	 * 返回是否位于冰上
	 */
	OnIce: function()
	{
		// Math.floor(x / 16)
		return Const.BLOCK_ICE ==
				App.Scene.GetBlock4x4($X >> 4, $Y >> 4);
	}
});