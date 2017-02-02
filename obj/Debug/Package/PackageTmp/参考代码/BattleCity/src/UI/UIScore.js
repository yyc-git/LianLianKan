/****************************************
 * 计分界面模块
 ****************************************/
var UIScore = Class(Layer,
{
	_lalHiScore: null,			// 最高分
	_lalStage: null,			// 关数
	_lalScroe: null,			// 分数
	_arrLalPTS: null,			// [L PTS R] x 4
	_lalTotalNum: null,			// 总数

	_tickDisp: null,
	_iNumType: 0,
	_iNumAll: 0,



	/**
	 * 构造函数 - 创建计分界面
	 */
	UIScore: function()
	{
		$Layer();		// super


		m_tickDisp = new Tick(30);


		var lal, spt, lay;

		//
		// HI-SCORE
		//
		lal = new Lable("HI-SCORE");
		lal.Move(130, 32);
		lal.SetSize(170, 30);
		lal.SetColor("#B53120");
		$Append(lal);

		//
		// 最高分
		//
		m_lalHi = new Lable();
		m_lalHi.Move(305, 32);
		m_lalHi.SetSize(200, 30);
		m_lalHi.SetColor("#EA9E22");
		$Append(m_lalHi);

		//
		// 计分关数
		//
		m_lalStage = new Lable();
		m_lalStage.Move(0, 64);
		m_lalStage.SetSize(512, 30);
		m_lalStage.SetColor("#FFF");
		m_lalStage.SetAlign("center");
		$Append(m_lalStage);

		//
		// I-PLAYER
		//
		lal = new Lable("I-PLAYER");
		lal.Move(0, 96);
		lal.SetSize(185, 30);
		lal.SetColor("#B53120");
		lal.SetAlign("right");
		$Append(lal);

		//
		// 本关得分
		//
		m_lalScroe = new Lable();
		m_lalScroe.Move(0, 128);
		m_lalScroe.SetSize(185, 30);
		m_lalScroe.SetAlign("right");
		m_lalScroe.SetColor("#EA9E22");
		$Append(m_lalScroe);

		//
		// 得分 PTS 数量
		//
		var top, i, L, R;

		m_arrPTS = [];
		for(i = 0; i < 4; ++i)
		{
			top = 176 + i * 48;

			// PTS
			lal = new Lable();
			lal.Move(130, top);
			lal.SetSize(55, 30);
			lal.SetColor("#FFF");
			lal.SetAlign("right");
			lal.SetText("PTS");

			// 得分
			L = new Lable();
			L.Move(0, top);
			L.SetSize(112, 30);
			L.SetColor("#FFF");
			L.SetAlign("right");

			// 数量
			R = new Lable();
			R.Move(183, top);
			R.SetSize(45, 30);
			R.SetColor("#FFF");
			R.SetAlign("right");


			$Append(lal);
			$Append(L);
			$Append(R);

			m_arrPTS[i] = {L:L, R:R};
		}

		//
		// TOTAL标签
		//
		lal = new Lable();
		lal.Move(0, 368);
		lal.SetSize(185, 30);
		lal.SetColor("#FFF");
		lal.SetAlign("right");
		lal.SetText("TOTAL");
		$Append(lal);

		//
		// 总数
		//
		m_lalTotal = new Lable();
		m_lalTotal.Move(183, 368);
		m_lalTotal.SetSize(45, 30);
		m_lalTotal.SetColor("#FFF");
		m_lalTotal.SetAlign("right");
		$Append(m_lalTotal);

		//
		// 坦克列表
		//
		for(i = 0; i < 4; i++)
		{
			spt = new Sprite("res/Misc.png", 32, 32);
			spt.Move(232, 186 + 48 * i);
			spt.SetFrame(3);
			$Append(spt);

			spt = new Sprite("res/Tank.png", 32, 32);
			spt.Move(250, 176 + 48 * i);
			spt.SetFrame(4 + 2 * i);
			$Append(spt);
		}

		//
		// 分隔符
		//
		lay = new Layer();
		lay.SetBG("#FFF");
		lay.SetSize(128, 3);
		lay.Move(192, 360);
		$Append(lay);
	},



	OnEnter: function()
	{
		// 显示计分层
		$Show();

		// 显示最高分
		m_lalHi.SetText(App.Game.ScoreHi + "");


		//
		// 清空原有显示的数据
		//
		var pts, i;
		for(i = 0; i < 4; ++i)
		{
			pts = m_arrPTS[i];
			pts.L.SetText("");
			pts.R.SetText("");
		}

		m_lalTotal.SetText("");

		m_lalScroe.SetText(App.Game.Score + "");
		m_lalStage.SetText("STAGE  " + App.Game.Stage);

		//
		// 计数器归零
		//
		m_tickDisp.Reset(30);

		m_iNumType = 0;
		m_iNumAll = 0;
	},


	OnLeave: function()
	{
		// 隐藏计分层
		$Hide();
	},


	OnUpdate: function(T)
	{
		if(T < 4)
		{
			if(!m_tickDisp.On())
				return --T;

			m_tickDisp.Reset(10);

			//
			// 得分 PTS 数量
			//
			var pts = m_arrPTS[T]
			
			pts.L.SetText(m_iNumType * (T + 1) * 100 + "");
			pts.R.SetText(m_iNumType + "");


			if(m_iNumType < App.Game.KillTypeNum[T])
			{
				m_iNumType++;
				m_iNumAll++;
				return --T;
			}
			else
			{
				m_tickDisp.Reset(30);		//显示下一类型时稍加延长时间
				m_iNumType = 0;
			}
		}
		else if(T == 50)
		{
			// 显示总数
			m_lalTotal.SetText(m_iNumAll + "");
		}
		else if(T < 180)
		{
			//
			// 统计完成后停顿会
			//
		}
		else if(T == 180)
		{
			if(App.Game.GameOver)	// 进入结束界面
			{
				return App.MyApp.Go(App.OverUI);
			}
			else					// 进入下一关
			{
				//
				// 通关
				//
				if(++App.Game.Stage > Const.MAX_STAGE)
					App.Game.Stage = 1;

				return App.MyApp.Go(App.GameUI);
			}
		}

		return T;
	}
});