/****************************************
 * 游戏场景模块
 ****************************************/
var Scene = Class(
{
	Tanks: null,		// 所有坦克 new Array(MAX_TANK)
	Bonus: null,		// 奖励实例


	/**
	 * 本游戏地图大小(13*13)，共169地块格子。
	 *
	 * 每个地块格子32*32px，用 4 个block标记障碍。
	 *
	 * ||============||
	 * ||  b1 ||  b2 ||
	 * ||=====||=====||
	 * ||  b3 ||  b4 ||
	 * ||============||
	 *
	 *
	 *   砖块的block又可分 4 小块，
	 *      block值 = 1 + 2 + 4 + 8
	 *   |-----|-----|
	 *   |  1  |  2  |
	 *   |-----|-----|
	 *   |  4  |  8  |
	 *   |—————|—————|
	 *
	 *   每个bit代表各个碎片块
	 */
	Block: null,			// Array(26*26)

	_arrStageData: null,	// 游戏数据
	_arrEnemyData: null,

	_curStgMap: null,		// 当前关数据
	_curStgEnemy: null,


	_tickWater: null,		// 更新水的动画
	_statWater: null,

	_oMapLayer: null,		// 地砖层（WebPlay.TiledLayer）
	_oBoomBase: null,		// 总部爆炸对象

	_arrGrass: null,		// 草地精灵数组
	_numGrass: 0,

	_arrFragMap: null,		// 碎片精灵数组
	_arrFragFree: null,



	/**
	 * 构造函数 - 初始化场景
	 */
	Scene: function()
	{
		m_tickWater = new Tick(60);
		m_statWater = new Tick(2);

		m_arrGrass = [];


		//
		// 初始化障碍物数组，碎片数组
		//
		m_arrFragMap = [];
		m_arrFragFree = [];
	
		$Block = [];

		for(i = 0; i < 26; ++i)
		{
			m_arrFragMap[i] = [];
			$Block[i] = [];
		}

		//
		// 创建地砖层
		//
		m_oMapLayer = new TiledLayer(13, 13, "res/Terr.png", 32, 32);
		m_oMapLayer.SetZ(Const.Z_MAP);
		m_oMapLayer.CreateAniTile(4);
		m_oMapLayer.SetBG("#000");
		m_oMapLayer.Move(Const.POS_X, Const.POS_Y);

		App.GameUI.Append(m_oMapLayer);


		//
		// 初始化坦克对象
		//
		$Tanks = [new MyTank()];				// 玩家坦克

		for(i = 1; i < Const.MAX_TANK; ++i)		// 敌人坦克
		{
			$Tanks[i] = new NPCTank();
		}

		// 奖励对象
		$Bonus = new Bonus();

		// 总部爆炸对象
		m_oBoomBase = new Boom(true);

		// 载入数据资源（map.dat）
		this._LoadData(RES_DATA);
	},


	BaseBoom: function()
	{
		m_oBoomBase.Start(176, 368);

		// 报废的鹰 (Terr.png:3)
		$SetMapCell(6, 12, 3);
	},


	/**
	 * 更新场景画面
	 */
	Update: function()
	{
		$Bonus.Update();
		m_oBoomBase.Update();

		//
		// 更新水的动画
		//
		if(m_tickWater.On())
			m_oMapLayer.SetAniTile(-1, m_statWater.On()? 4 : 5);
	},


	/**
	 * 创建玩家坦克
	 */
	CreatePlayer: function()
	{
		var tank = $Tanks[0];

		tank.SetPos(128, 384);		// 总部左边
		tank.SetDir(0);				// 玩家坦克方向默认向上
		tank.StartBulProof(Const.TIME_BULPRF_DEF);	// 开启防弹衣
		tank.Birth();
	},


	/**
	 * 创建敌人坦克
	 */
	CreateEnemy: function(id)
	{
		var pos, i, tank;

		//
		// 找出一个空闲的坦克对象
		//
		for(i = 1; i < Const.MAX_TANK; ++i)
		{
			tank = $Tanks[i];

			if(tank.IsIdle())
				break;
		}

		pos = id % 3;
		pos = (pos + 1) % 3;				// 敌人位置（0:中，1:右，2:左,...）

		$SetMapCell(pos * 6, 0, 0);			// 出生地为空

		tank.SetPos(192 * pos, 0);			// 地图顶端
		tank.SetDir(2);						// 默认朝下
		tank.SetType(m_curStgEnemy[id]);	// 设置类型

		// 隐藏一个敌人标志
		App.GameUI.EnemyFlag[19 - id].Hide();


		//
		// 是否为带奖励的红坦克
		//
		if(Const.BONUS_MAP[id])
		{
			tank.HasBonus();

			// 清除存在的奖励
			$Bonus.Clear();
		}

		// 生产坦克
		tank.Birth();
	},



	/**
	 * 构造地图（每一关开始前）
	 */
	BuildMap: function()
	{
		var id = App.Game.Stage - 1;

		m_curStgMap = m_arrStageData[id];
		m_curStgEnemy = m_arrEnemyData[id];


		// 草地计数
		m_numGrass = 0;

		//
		// 填充地图每一格
		//
		var r, c;
		for(r = 0; r < 13; r++)
		for(c = 0; c < 13; c++)
		{
			$SetMapCell(c, r, m_curStgMap[r][c]);
		}

		//
		// 隐藏多余的草地
		//
		var i, l = m_arrGrass.length;
		for(i = m_numGrass; i < l; ++i)
			m_arrGrass[i].Hide();


		// 设置总部鹰图标 (Terr.png:2)
		$SetMapCell(6, 12, 2);

		// 玩家出生位置为空
		$SetMapCell(4, 12, 0);
	},


	/**
	 * 清空地图（游戏结束后）
	 */
	ClearMap: function()
	{
		m_oMapLayer.FillCells(0, 0, 13, 13, 0);

		var i, l = m_arrGrass.length;
		for(i = 0; i < l; ++i)
			m_arrGrass[i].Hide();
	},


	/**
	 * 清空坦克
	 */
	ClearTank: function()
	{
		$Bonus.Reset();

		for(var i = 0; i < Const.MAX_TANK; ++i)
			$Tanks[i].Reset();
	},


	/**
	 * 获取4x4 block的内容
	 *   如果有一个不相同则返回-1
	 */
	GetBlock4x4: function(c, r)
	{
		var B = $Block;
		var b = B[r][c];

		if (b == B[r  ][c+1] &&
			b == B[r+1][c  ] &&
			b == B[r+1][c+1])
		{
			return b;
		}

		return -1;
	},


	/**
	 * 设置地图格子内容
	 */
	SetMapCell: function(c, r, cellID)
	{
		//
		// 清除该位置可能的碎砖层
		//
		var x = c * 2;
		var y = r * 2;

		this._ClearFrag(x  , y  );
		this._ClearFrag(x+1, y  );
		this._ClearFrag(x  , y+1);
		this._ClearFrag(x+1, y+1);

		//
		// cellID 对应 res/Terr.png 的图标
		//
		if(cellID == 1)							// 草
		{
			var spt = m_arrGrass[m_numGrass];

			//
			// 草地位于坦克上层
			// 用精灵代替地砖渲染
			//
			if(!spt)
			{
				spt = m_arrGrass[m_numGrass] = new Sprite("res/Terr.png", 32, 32);
				spt.SetZ(Const.Z_GRASS);
				App.GameUI.Append(spt);
			}

			spt.Move(Const.POS_X + c * 32, Const.POS_Y + r * 32);
			spt.Show();
			m_numGrass++;

			// 清空之前遗留的地形
			cellID = 0;
		}
		else if(cellID == 2)					// 鹰
		{
			this._SetCellBlock(6, 12, Const.BLOCK_BASE1, 0xF);
		}
		else if(cellID == 3)					// 摧毁的鹰
		{
			this._SetCellBlock(6, 12, Const.BLOCK_BASE2, 0xF);
		}
		else if(cellID == 4)					// 水
		{
			this._SetCellBlock(c, r, Const.BLOCK_WATER, 0xF);

			// 水为动态砖
			cellID = -1;
		}
		else if(cellID == 6)					// 冰
		{
			this._SetCellBlock(c, r, Const.BLOCK_ICE, 0xF);
		}
		else if(7 <= cellID && cellID <= 21)	// 钢
		{
			this._SetCellBlock(c, r, Const.BLOCK_IRON, cellID - 6);
		}
		else if(cellID >= 22)					// 砖
		{
			this._SetCellBlock(c, r, Const.BLOCK_TILE, cellID - 21);
		}

		if(cellID == 0)							// 空
			this._SetCellBlock(c, r, Const.BLOCK_NONE, 0xF);

		// 渲染格子
		m_oMapLayer.SetCell(c, r, cellID);
	},


	/**
	 * 设置砖块碎片
	 */
	SetTileFrag: function(col, row, val)
	{
		var B = $Block;
		var x1 = col - col % 2;
		var y1 = row - row % 2;

		var x2 = x1 + 1;
		var y2 = y1 + 1;

		var x, y;


		B[row][col] = val;

		/**
		 * 如果4个block中出现一个或多个空块，
		 *   那么隐藏这几个碎片精灵，
		 *   直接设置相应位置为空的大砖块。
		 */
		var i, tile = 0;

		for(i = 0; i < 4; ++i)
		{
			x = i % 2? x2 : x1;
			y = i < 2? y1 : y2;

			if(B[y][x])
				tile += (1 << i);	//tile = tile + 2^i
			else
				this._ClearFrag(x, y);
		}

		/**
		 * 设置合并后的大砖块
		 *   21 + 砖块序列 => Terr.png中砖块的具体位置
		 */
		m_oMapLayer.SetCell(x1/2, y1/2, tile? tile+21 : 0);

		if(val)
			this._DrawFrag(col, row, val);
	},


	/**
	 * 设置铁块碎片
	 */
	SetIronFrag: function(col, row, val)
	{
		var B = $Block;
		B[row][col] = val;

		var x1 = col - col % 2;
		var y1 = row - row % 2;

		var x2 = x1 + 1;
		var y2 = y1 + 1;

		var x, y;
		var i, tile = 0;

		//
		// 计算碎铁块的形状
		//
		for(i = 0; i < 4; ++i)
		{
			x = i % 2? x2 : x1;
			y = i < 2? y1 : y2;

			if(B[y][x])
				tile += (1 << i);	//tile = tile + 2^i
		}

		m_oMapLayer.SetCell(x1/2, y1/2, tile? tile+6 : 0);
	},


	/**
	 * 砖块碎片 - 渲染
	 */
	_DrawFrag: function(col, row, val)
	{
		var spt = m_arrFragMap[row][col];

		if(!spt)
			spt = m_arrFragFree.pop();

		if(!spt)
		{
			spt = new Sprite("res/Frag.png", 16, 16);
			spt.SetZ(Const.Z_FRAG);

			App.GameUI.Append(spt);
		}

		spt.Show();
		spt.Move(Const.POS_X + col * 16, Const.POS_Y + row * 16);
		spt.SetFrame(val - 1);

		m_arrFragMap[row][col] = spt;
	},


	/**
	 * 砖块碎片 - 清除
	 */
	_ClearFrag: function(col, row)
	{
		var spt = m_arrFragMap[row][col];

		if(spt)
		{
			spt.Hide();

			m_arrFragFree.push(spt);
			m_arrFragMap[row][col] = null;
		}
	},


	/**
	 * 设置每个格子障碍。
	 *   每个格子占用4个block，用1bit表示
	 *   mask = 1 + 2 + 4 + 8
	 */
	_SetCellBlock: function(col, row, v, mask)
	{
		var B = $Block;

		var x1 = col * 2;
		var x2 = x1 + 1;
		var y1 = row * 2;
		var y2 = y1 + 1;

		B[y1][x1] = (mask & 1)? v:0;
		B[y1][x2] = (mask & 2)? v:0;
		B[y2][x1] = (mask & 4)? v:0;
		B[y2][x2] = (mask & 8)? v:0;
	},


	/**
	 * 游戏数据载入
	 */
	_LoadData: function(v)
	{
		var Map, Enemy;
		var i, r, c;
		var t, n = 0;
		var ch;


		m_arrStageData = [];
		m_arrEnemyData = [];

		for(i = 0; i < Const.MAX_STAGE; ++i)
		{
			Map = [];
			Enemy = [];

			for(r = 0; r < 13; r++)
			{
				t = Map[r] = [];

				for(c = 0; c < 13; c++)
					t[c] = v.charCodeAt(n++) - 65;
			}

			for(r = 0; r < 20; r++)
				Enemy[r] = v.charCodeAt(n++) - 65;

			m_arrStageData[i] = Map;
			m_arrEnemyData[i] = Enemy;
		}
	}
});