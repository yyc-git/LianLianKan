var config = {};
config.my_site = ''; // ���������Ϸ��������վ�ϣ���������ַ�磺config.my_site = 'http://www.mysite.com/tank'���Ի�ø��õ���Ϸ����

config.develop_model = 'product'; // develop | test | product �����product���������нӿڼ�飬�������Ϸ�ٶ�

config.enemy_number_of_level = [{r:5,b:3,y:2,g:1},{r:10,b:5,y:3,g:2},{r:15,b:5,y:5,g:5}]; // ÿһ�صĵз�̹������

config.default_scene = 'lawn'; // Ĭ�ϳ���

// ��Ϸ����
config.player1_lives = 4;
config.player1_speed = 2;
config.player1_move_keys = { 37: 'left', 38: 'up', 39: 'right', 40: 'down'};
config.player1_fire_key = 32;

config.player2_lives = 4;
config.player2_speed = 2;
config.player2_move_keys = { 65: 'left', 87: 'up', 68: 'right', 83: 'down'};
config.player2_fire_key = 71;

config.enemy_red_speed = 1;
config.enemy_blue_speed = 1.5;
config.enemy_yellow_speed = 2;
config.enemy_green_speed = 2.5;
config.bullet_speed = 10;