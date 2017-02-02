using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Drawing;
using System.Drawing.Imaging;

namespace Draw.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 画出地图的缩略图
        /// 地图为20行，10列
        /// x坐标范围：0-200
        /// y坐标范围：0-100
        /// 
        /// 因为方形框宽和高都为10，因此只用x坐标的0-190（20个）和y坐标的0-90（10个）。
        /// </summary>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <param name="data">多个地图数据，中间用"|"隔开</param>
        /// <returns></returns>
        public ActionResult Draw(int width, int height, string data)
        {
            int i = 0,
                    j = 0,
                len_1 = 0,
                len_2 =0,
                _width = 0,
                _height = 0;
            string str = string.Empty,
                    se = string.Empty;

            Bitmap bm = null;
            Graphics g = null;
            Pen p = new Pen(Color.Black, 1);

            var arr = data.Split('|');

            len_1 = arr.Length;

            for (i = 0; i < len_1; i++)
            {
                //每画一张图都创建新实例。
                //如果用“g.Clear(Color.White);”，则背景色为白色！
                //我不希望有背景色！故每次都创建新实例。
                bm = new Bitmap(width, height);
                g = Graphics.FromImage(bm);

                len_2 = arr[i].Length;
                for (j = 0; j < len_2; j++)
                {
                    //这个要放到前面
                    if (j % 20 == 0 && j != 0)
                    {
                        _height += 10;
                    }

                    //if (_height == 80 && _width == 190)
                    //{
                    //    var t = 0;
                    //}
                    if (arr[i].ElementAt(j) == '1')
                    {
                        //画图
                        //g.Clear(Color.White);
                        g.DrawRectangle(p, _width, _height, 10, 10);
                    }

                    if (j % 20 == 0 && j != 0)
                    {
                        _width = 10;
                        //_height += 10;
                    }
                    else
                    {
                        _width = _width + 10 == 200 ? 0 : _width + 10;
                    }
                }
                //指定图片名和保存路径
                //str = @"C:\Documents and Settings\yang\桌面\1.gif";
                str = @"D:\Image\Map" + (i + 1).ToString() + ".gif";    //从1开始
                bm.Save(@str);
                //g.Clear(Color.White);
                _width = 0;
                _height = 0;
            }

            

            g.Dispose();
            bm.Dispose();
            p.Dispose();

            ////画图
            //g.DrawRectangle(p, 0, 0, 10, 10);

            ////指定图片名和保存路径
            //bm.Save(@"D:\图片\1.gif");

            ////画图
            //g.Clear(Color.White);
            //g.DrawRectangle(p, 0, 60, 10, 10);

            ////指定图片名和保存路径
            //bm.Save(@"D:\图片\2.gif");

            ////画图
            //g.Clear(Color.White);
            //g.DrawRectangle(p, 0, 90, 10, 10);

            ////指定图片名和保存路径
            //bm.Save(@"D:\图片\3.gif");

            ////画图
            //g.Clear(Color.White);
            //g.DrawRectangle(p, 0, 91, 10, 10);

            ////指定图片名和保存路径
            //bm.Save(@"D:\图片\4.gif");

            return null;
        }

    }
}
