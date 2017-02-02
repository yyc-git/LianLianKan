/****************************************
 * 技能奖励类
 ****************************************/

/**
 * 奖励状态机
 * @enum {number}
 */
var BonusState =
{
	NONE: 0,
	SHOW: 1,
	SCORE: 2
};


var Bonus = Class(
{
	_sptIcon: null,					// 奖励精灵
	_state: BonusState.NONE,		// 状态机
	_type: 0,						// 0-铲子 1-五角星 2-加命 3-防弹 4-炸弹 5-定时


	_tickFlash: null,				// 图标闪烁间隔
	_statFlash: null,				// 图标闪烁状态

	_tickToggle: null,				// 总部切换间隔
	_statToggle: null,				// 总部切换状态

	_tickScore: null,				// 分数显示时间

	_timerProtect: 0,				// 总部防护时间计时
	_timerFreeze: 0,				// 定时技能计时



	Bonus: function()
	{
		//
		// 创建精灵
		//
		m_sptIcon = new Sprite("res/Tank.png", 32, 32);
		m_sptIcon.Hide();
		m_sptIcon.SetZ(Const.Z_BONUS);
		App.GameUI.Append(m_sptIcon);


		//
		// 相关定时器
		//
		m_tickFlash = new Tick(10);
		m_statFlash = new Tick(2);		// 2态计数器，在true和false间切换。

		m_tickToggle = new Tick(30);
		m_statToggle = new Tick(2);

		m_tickScore = new Tick(20);
	},


	/**
	 * 逻辑更新
	 */
	Update: function()
	{
		m_timerProtect--;
		m_timerFreeze--;

		/*
		 * 铁锹保护倒计时
		 *
		 * 在快结束前时间内，
		 * 总部围墙在 铁块 和 砖块 间切换。
		 * 即使已没有围墙，也补上
		 */
		if(0 <= m_timerProtect && m_timerProtect < 330)
		{
			// 切换定时器
			if(m_tickToggle.On())
				this._SetBaseWall(m_statToggle.On());
		}

		//
		// 更新状态机
		//
		switch(m_state)
		{
		case BonusState.NONE:	// -奖励没有出现
			break;

		case BonusState.SHOW:	// -奖励出现，等待玩家去接
			// 奖励闪烁定时器
			if(m_tickFlash.On())
				m_sptIcon.SetVisible(m_statFlash.On());

			this._CheckBonus();
			break;

		case BonusState.SCORE:	// -显示奖励分数
			if(m_tickScore.On())
				$Clear();
			break;
		}
	},


	/**
	 * 显示奖励
	 */
	Show: function()
	{
		var rnd = Math.random;
		m_type = rnd() * 6 >> 0;

		//
		// 奖励出现在地图上可进入的位置
		//
		var c, r;
		do
		{
			c = rnd() * 24 >> 0;
			r = rnd() * 24 >> 0;
		}
		while(App.Scene.GetBlock4x4(c, r) >= Const.BLOCK_IRON)

		//
		// 显示奖励图标
		//
		m_sptIcon.SetFrame(Const.FR_BONUS + m_type);
		m_sptIcon.Move(Const.POS_X + c * 16, Const.POS_Y + r * 16);
		m_sptIcon.Show();

		m_state = BonusState.SHOW;
	},


	/**
	 * 当前是否处于定时
	 */
	IsFreezed: function()
	{
		return m_timerFreeze > 0;
	},


	/**
	 * 清空奖励
	 */
	Clear: function()
	{
		m_sptIcon.Hide();
		m_state = BonusState.NONE;
	},


	/**
	 * 重置奖励
	 */
	Reset: function()
	{
		$Clear();

		// 复位计数器
		m_tickScore.Reset();

		m_timerFreeze = 0;
		m_timerProtect = 0;
	},



	/**
	 * 获得奖励
	 */
	_CheckBonus: function()
	{
		var i, player = App.Scene.Tanks[0];

		//
		// 玩家是否碰到奖励
		//
		if(!player.IsLive() || !player.CheckColl(m_sptIcon))
			return;

		switch(m_type)
		{
		case 0:		// 铲子
			m_timerProtect = Const.TIME_WALL_IRON;
			m_statToggle.Reset();
			this._SetBaseWall(true);
			break;

		case 1:		// 升级
			player.Upgrade();
			break;

		case 2:		// 加命
			App.Game.LifeInc();
			break;

		case 3:		// 防弹
			player.StartBulProof(Const.TIME_BULPRF_BONUS);
			break;

		case 4:		// 炸弹
			for(i = 1; i < Const.MAX_TANK; ++i)
			{
				if(App.Scene.Tanks[i].IsLive())
					App.Scene.Tanks[i].Hit(true);	//强制爆炸
			}
			break;

		case 5:		// 定时
			m_timerFreeze = 1000;
			break;
		}

		// 奖励500分
		App.Game.SocreAdd(500);

		// 取消闪烁
		m_sptIcon.Show();
		m_sptIcon.SetFrame(Const.FR_SCORE + 4);

		m_state = BonusState.SCORE;
	},


	/**
	 * 设置总部围墙
	 */
	_SetBaseWall: function(iron)
	{
		var skip = iron? 0 : 0xF;

		//-------------------x--y---tile
		App.Scene.SetMapCell(5, 11, 14 + skip);		// 上-左
		App.Scene.SetMapCell(6, 11, 18 + skip);		// 上-中
		App.Scene.SetMapCell(7, 11, 10 + skip);		// 上-右

		App.Scene.SetMapCell(5, 12, 16 + skip);		// 左
		App.Scene.SetMapCell(7, 12, 11 + skip);		// 右
	}
});
