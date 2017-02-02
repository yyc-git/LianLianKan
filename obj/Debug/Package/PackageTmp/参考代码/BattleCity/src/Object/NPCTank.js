/****************************************
 * 电脑坦克类
 ****************************************/
var NPCTank = Class(Tank,
{
	_bonus: false,			// 是否带奖励
	_HP: 0,					// 生命值

	_tickRed: null,			// 奖励闪烁计时器
	_statRed: null,
	_tickFlash: null,
	_tickScore: null,		// 奖励加分计时器




	NPCTank: function()
	{
		$Tank(1);	// super


		m_tickRed = new Tick(10);
		m_statRed = new Tick(2);

		m_tickScore = new Tick(10);
		m_tickFlash = new Tick(2);

		m_tickBirth = new Tick(5);
	},


	/**
	 * 覆盖 -- 界面更新
	 */
	_UpdateUI: function()
	{
		//
		// 更新带奖励的NPC颜色
		//
		if(m_bonus)
		{
			if(m_tickRed.On())
			{
				m_statRed.On()? --m_icon : ++m_icon;
				this._UpdateFrame();
			}

			return;
		}

		//
		// 加强型坦克颜色
		//
		if(m_type == 3)
		{
			switch(m_HP)
			{
			case 1:		//白
				m_icon = 10;
				break;
			case 2:		//黄-绿
				m_icon = m_tickFlash.On()? 13 : 12;
				break;
			case 3:		//黄-白
				m_icon = m_tickFlash.On()? 13 : 10;
				break;
			case 4:		//绿-白
				m_icon = m_tickFlash.On()? 12 : 10;
				break;
			}
		}

		this._UpdateFrame();
	},


	/**
	 * 覆盖 -- 设置类型
	 */
	_SetType: function(t)
	{
		$Speed = 1;

		switch(t)
		{
		case 0:		// 普通型
			m_icon = 4;
			m_HP = 1;
			this._SetBullets(1, 2, false);
			break;

		case 1:		// 灵活型
			m_icon = 6;
			$Speed = 2;
			m_HP = 1;
			this._SetBullets(1, 2, false);
			break;

		case 2:		// 威力型
			m_icon = 8;
			m_HP = 1;
			this._SetBullets(1, 3, false);
			break;

		case 3:		// 加强型
			m_icon = 10;
			m_HP = 4;
			this._SetBullets(1, 2, false);
			break;
		}
	},


	/**
	 * 覆盖 -- 坦克被击中
	 */
	_Hit: function(force)
	{
		//
		// 接到炸弹强制爆炸
		//   如果带奖励则丢失
		//
		if(force)
		{
			m_HP = -1;
			m_bonus = false;

			m_sptTank.Hide();
			return HitState.HIT;
		}

		//
		// 显示奖励
		//
		if(m_bonus)
		{
			m_bonus = false;
			App.Scene.Bonus.Show();
		}

		if(--m_HP == 0)
		{
			//
			// 加分（100,200,300,400）
			//
			App.Game.SocreAdd(100 * (m_type + 1));

			//
			// 显示得分（分数图标位于草的上层）
			//
			m_sptTank.SetFrame(Const.FR_SCORE + m_type);
			m_sptTank.SetZ(Const.Z_SCORE);

			return HitState.HIT;
		}

		return HitState.NONE;
	},


	/**
	 * 覆盖 -- 坦克爆炸
	 */
	_Boom: function()
	{
		//
		// 被炸掉的不显示分数，也不类型计数
		//
		if(m_HP == -1)
		{
			m_state = TankState.RESET;
			App.Game.KillEnemy(-1);
		}
		else
		{
			m_state = TankState.SCORE;
			App.Game.KillEnemy(m_type);
		}
	},


	/**
	 * 覆盖 -- 坦克重置
	 */
	_Reset: function()
	{
		// 撤销奖励
		m_bonus = false;

		m_tickRed.Reset();
		m_tickScore.Reset();
	},


	/**
	 * 设置是否带奖励
	 */
	HasBonus: function()
	{
		m_bonus = true;
		m_statRed.Reset();
	}
});