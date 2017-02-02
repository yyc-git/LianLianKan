/****************************************
 * 游戏逻辑模块
 ****************************************/
var Game = Class(
{
	Stage: 1,					// 当前关数
	Life: 2,					// 当前生命

	Score: 0,					// 当前得分
	ScoreHi: 20000,				// 游戏最高分
	ScoreBonus: 20000,			// 下一个加命的分数

	FirstStart: true,			// 第一次开始（需要选关）	
	GameOver: false,
	StgClr: false,

	KillTypeNum: null,			// 打掉每种坦克的数目



	_iBirthDelay: 0,			// 出现间隔(随关数增加会加快)
	_tickBirth: null,			// 出现剩余时间


	_tickStgClr: null,			// 过关倒计时

	_iEnemyNum: 0,
	_iEnemyID: 0,

	_bPressd: false,
	_timerSlide: 999,






	Game: function()
	{
		m_tickBirth = new Tick(30);
		m_tickStgClr = new Tick(200);
	},


	NewStage: function()
	{
		// 新的场景
		App.Scene.BuildMap();

		//
		// 计数清零
		//
		m_iEnemyNum = 0;
		m_iEnemyID = 0;

		$KillTypeNum = [0, 0, 0, 0];

		$StgClr = false;
		m_tickStgClr.Reset();

		// 关数越后坦克出现间隔越短
		m_iBirthDelay = 150 - $Stage * 3;

		// 第一辆坦克出现的时间固定
		m_tickBirth.Reset(30);

		App.GameUI.LableStg.SetText($Stage + "");
	},


	/**
	 * GameOver后数据归零
	 */
	Reset: function()
	{
		$FirstStart = true;
		$GameOver = false;

		$Stage = 1;
		$Score = 0;
		$ScoreBonus = 20000;

		$Life = 2;
		this._DisplayLife();
	},
	



	/**
	 * 摧毁敌人坦克
	 */
	KillEnemy: function(type)
	{
		//
		// 打掉的类型统计
		//
		if(type != -1)
			++$KillTypeNum[type];

		/*
		 * 打掉了最后辆坦克，
		 * 并且屏幕上没有剩余的，
		 *   进入过关倒计时。
		 */
		if(--m_iEnemyNum == 0 && m_iEnemyID == 20)
			$StgClr = true;
	},


	/**
	 * 基地被摧毁
	 */
	BaseDestroy: function()
	{
		App.Scene.BaseBoom();
		$GameOver = true;
	},


	/**
	 * 加分数
	 */
	SocreAdd: function(n)
	{
		$Score += n;

		//
		// 加1条命
		//
		if($Score > $ScoreBonus)
		{
			$ScoreBonus += 20000;
			$LifeInc();
		}
	},


	/**
	 * 加减命
	 */
	LifeInc: function()
	{
		++$Life;
		this._DisplayLife();
	},


	LifeDec: function()
	{
		--$Life;

		if($Life < 0)
			$GameOver = true;
		else
			this._DisplayLife();
	},


	_DisplayLife: function()
	{
		App.GameUI.LableLife.SetText($Life + "");
	},


	/**
	 * 游戏逻辑更新
	 */
	Update: function()
	{
		var Tanks = App.Scene.Tanks;
		var rnd = Math.random;


		// 更新场景界面
		App.Scene.Update();

		//
		// 更新玩家坦克
		//
		if(Tanks[0].IsIdle() && $Life >= 0)
			App.Scene.CreatePlayer();

		Tanks[0].Update();


		//
		// 电脑坦克还没到上限，继续产生
		//
		if (m_iEnemyNum < Const.MAX_TANK-1 &&
			m_iEnemyID != 20 &&
			m_tickBirth.On())
		{
			App.Scene.CreateEnemy(m_iEnemyID);

			++m_iEnemyNum;
			++m_iEnemyID;
			m_tickBirth.Reset(m_iBirthDelay);
		}

		/*
		 * 过关倒计时检测
		 *
		 * 此过程中玩家仍可以控制坦克，
		 * NPC状态也在更新（已没有存活的），
		 * 此时若玩家打掉总部，游戏在统计完分数后结束。
		 */
		if($StgClr && m_tickStgClr.On())
			return true;


		/*
		 * 更新NPC的状态:
		 *   坦克一直往前开,遇障碍随机转弯
		 */
		var bFreezed = App.Scene.Bonus.IsFreezed();
		var i, tank;

		for(i = 1; i < Const.MAX_TANK; ++i)
		{
			tank = Tanks[i];

			/*
			 * 如果当前处于定时状态，
			 *   则放弃对NPC的命令，
			 *   但其界面更新依然进行。
			 *
			 * （定时过程中NPC的发出的子弹仍在动，
			 *   带奖励的坦克仍保持闪烁，
			 *   只是不开火和移动）
			 */
			tank.Update();

			if(bFreezed || !tank.IsLive())
				continue;

			//
			// 随机开火
			//
			if(rnd() < 0.03)
				tank.Fire();

			/*
			 * 前进受阻，
			 *   停留随机时间，
			 *   并随机换方向。
			 */
			if(!tank.Go())
			{
				if(rnd() < 0.2)
					tank.SetDir(4 * rnd() >> 0);
			}
		}
	},


	/**
	 * 接受玩家的控制
	 */
	Command: function()
	{
		var player = App.Scene.Tanks[0];

		if(!player.IsLive())
			return;

		//
		// 开火 (按住GAME_A或GAME_C键)
		//
		if(Input.IsPressed(InputAction.GAME_A) || 
		   Input.IsPressed(InputAction.GAME_C))
		{
			player.Fire();
		}

		/**
		 * 冰上自动滑行
		 *
		 * 遇到以下之一则停止滑行：
		 *   滑完tickSlide步；
		 *   碰到障碍；
		 *   滑出冰层。
		 *
		 * 滑行前半短时间玩家无法控制方向，
		 *   之后可以。
		 */
		if(m_timerSlide < 24)
		{
			if(!player.Go() || !player.OnIce())
				m_timerSlide = 999;

			if(++m_timerSlide < 12)
				return;
		}

		//
		// 接受玩家移动指令
		//
		switch(true)
		{
			case Input.IsPressed(InputAction.UP):		//上
				player.SetDir(0);
				break;
			case Input.IsPressed(InputAction.RIGHT):	//右
				player.SetDir(1);
				break;
			case Input.IsPressed(InputAction.DOWN):		//下
				player.SetDir(2);
				break;
			case Input.IsPressed(InputAction.LEFT):		//左
				player.SetDir(3);
				break;
			default:
				//
				// 如果在冰上停住将滑行一段距离
				//
				if(m_bPressd)
				{
					if(player.OnIce())
						m_timerSlide = 0;

					m_bPressd = false;
				}
				return;
		}

		//
		// 滑行的坦克得到控制
		//
		m_timerSlide = 999;

		m_bPressd = true;
		player.Go();
	}
});