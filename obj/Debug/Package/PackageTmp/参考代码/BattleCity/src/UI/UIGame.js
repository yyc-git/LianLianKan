/****************************************
 * 游戏界面模块
 ****************************************/
var UIGame = Class(Layer,
{
	EnemyFlag: null,			// 电脑坦克标记

	LableLife: null,			// 生命数标签
	LableStg: null,				// 关数标签

	_lalStage: null,			// 银幕上的关数层

	_arrMask: null,
	_layInfo: null,				// 右侧信息栏

	_lalGameOver: null,			// 游戏结束升起的字
	_timerOver: 0,

	//_oSound: null,


	/**
	 * 构造函数 - 创建游戏界面
	 */
	UIGame: function()
	{
		$Layer();		// super


		m_tickWater = new Tick(60);
		m_statWater = new Tick(2);
		m_tickStgClr = new Tick(200);

		//m_oSound = new Sound("res/Open.mid");


		var spt, lal, lay;
		var i;

		//
		// 右边信息栏
		//
		m_layInfo = new Layer();
		m_layInfo.Move(452, 0);
		m_layInfo.SetSize(64, 448);

		$Append(m_layInfo);

		//
		// 创建敌人数标志
		//
		$EnemyFlag = [];
		for(i = 0; i < 20; ++i)
		{
			spt = $EnemyFlag[i] = new Sprite("res/Misc.png", 16, 16);
			spt.SetFrame(10);
			spt.Move(18 + 16 * (i%2), 34 + 16 * (i >> 1));

			m_layInfo.Append(spt);
		}

		//
		// "1P"文字
		//
		lal = new Lable();
		lal.SetText("I P");
		lal.Move(14, 252);
		m_layInfo.Append(lal);

		//
		// 生命图标
		//
		spt = new Sprite("res/Misc.png", 16, 16);
		spt.SetFrame(11);
		spt.Move(14, 280);
		m_layInfo.Append(spt);

		//
		// 生命数-标签
		//
		$LableLife = new Lable();
		$LableLife.SetText("2");
		$LableLife.Move(32, 272);
		m_layInfo.Append($LableLife);

		//
		// 旗帜图标
		//
		spt = new Sprite("res/Misc.png", 32, 32);
		spt.SetFrame(4);
		spt.Move(14, 352);
		m_layInfo.Append(spt);

		//
		// 关数-标签
		//
		$LableStg = new Lable();
		$LableStg.SetAlign("right");
		$LableStg.SetSize(48, 30);
		$LableStg.Move(0, 380);
		m_layInfo.Append($LableStg);



		//
		// 开幕层
		//
		m_arrMask = [];

		for(i = 0; i < 2; ++i)
		{
			lay = m_arrMask[i] = new Layer();
			lay.SetSize(512, 224);
			lay.SetBG("#666");
			lay.SetZ(Const.Z_UI);

			$Append(lay);
		}

		//
		// 选关文字
		//
		m_lalStage = new Lable();
		m_lalStage.SetSize(512, 25);
		m_lalStage.SetY(210);
		m_lalStage.SetZ(Const.Z_UI);
		m_lalStage.SetAlign("center");

		$Append(m_lalStage);


		//
		// "GAME OVER"文字
		//
		m_lalGameOver = new Lable("GAME\nOVER");
		m_lalGameOver.Move(212, 448);
		m_lalGameOver.SetColor("#B53120");
		m_lalGameOver.SetZ(Const.Z_UI);
		m_lalStage.SetAlign("center");
		m_lalGameOver.Hide();

		$Append(m_lalGameOver);
	},


	OnEnter: function()
	{
		// 显示-游戏界面
		$Show();

		m_arrMask[0].Move(0, -240);
		m_arrMask[1].Move(0, 464);

		//
		// 第一次开始隐藏信息栏
		//
		if(App.Game.FirstStart)
			m_layInfo.Hide();
	},


	OnLeave: function()
	{
		// 隐藏-游戏界面
		$Hide();

		//
		// 复位相关对象
		//
		m_timerOver = 0;

		// 清空场景内对象
		App.Scene.ClearTank();
	},


	OnUpdate: function(T)
	{
		//
		// 主流程
		//
		if(T > 101)
		{
			var pass = App.Game.Update();

			if(pass)
				return App.MyApp.Go(App.ScoreUI);

			if(!App.Game.GameOver)
			{
				App.Game.Command();
				return T;
			}

			/*
			 * Game Over流程
			 *
			 * 触发条件：
			 *	 1.总部被打 -更新显示爆炸效果
			 *	 2.命没了
			 *
			 * 在Game Over的过程中，
			 *   玩家无法控制，但NPC仍然继续.
			 *
			 * 游戏结束也有可能发生在过关倒计时中，
			 *   这时无需升起Game Over文字。
			 */
			if(++m_timerOver <= 30)
			{
				//
				// 总部被打掉玩家仍可以控制一小会
				//
				App.Game.Command();
			}
			else if(m_timerOver <= 156)
			{
				//
				// 升起Game Over
				//
				if(!App.Game.StgClr)
				{
					m_lalGameOver.Show();
					m_lalGameOver.SetY(508 - m_timerOver*2);
				}
			}
			else if(m_timerOver <= 300)
			{
				// 进入记分前等待
			}
			else
			{
				m_lalGameOver.Hide();

				// 进入计分流程
				return App.MyApp.Go(App.ScoreUI);
			}

			return T;
		}




		//
		// 界面流程
		//
		if(T < 20)
		{
			m_arrMask[0].MoveBy(0, +12);	// 银幕合拢
			m_arrMask[1].MoveBy(0, -12);
		}
		else if(T == 20)
		{
			$SetBG("#666");					// 当前关数界面
			m_lalStage.Show();
		}
		else if(T == 21)
		{
			m_lalStage.SetText("STAGE" + Misc.StrN(App.Game.Stage, 5));

			//
			// 第一次开始，停住选关
			//
			if(!App.Game.FirstStart)
				return T;

			--T;

			switch(true)
			{
			//
			// 加关数 (按住GAME_A或GAME_A键)
			//
			case Input.IsPressed(InputAction.GAME_A):
			case Input.IsPressed(InputAction.GAME_C):
				if(App.Game.Stage < Const.MAX_STAGE)
				{
					App.Game.Stage++;
				}
				break;

			//
			// 减关数 (按住GAME_B或GAME_D键)
			//
			case Input.IsPressed(InputAction.GAME_B):
			case Input.IsPressed(InputAction.GAME_D):
				if(App.Game.Stage > 1)
				{
					--App.Game.Stage;
				}
				break;

			//
			// 开始 (START键)
			//
			case Input.IsPressed(InputAction.START):
				++T;
				break;
			}
		}
		else if(T == 22)
		{
			//
			// 恢复显示敌人标志
			//
			for(var i = 0; i < 20; ++i)
				$EnemyFlag[i].Show();

			App.Game.FirstStart = false;
			App.Game.NewStage();			// 创建新关
		}
		else if(T < 80)
		{
			// 稍作停顿
		}
		else if(T == 80)
		{
			m_lalStage.Hide();				// 隐藏 -关数界面
			m_layInfo.Hide();				// 暂时隐藏信息栏
		}
		else if(T <= 100)
		{
			m_arrMask[0].MoveBy(0, -12);	// 银幕拉开
			m_arrMask[1].MoveBy(0, +12);
		}
		else if(T == 101)
		{
			m_layInfo.Show();				// 显示 -信息栏
			//m_oSound.Play();
		}

		return T;
	}
});