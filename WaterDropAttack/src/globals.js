/**
 * Created by yicha on 14-7-29.
 */
var ChineseNumber = [ "一", "二", "三", "四","五", "六"];
if(typeof FRAME_RATE === "undefined") {
    var FRAME_RATE = {};
    FRAME_RATE.waterDrop_shake = 0.1;   // 水滴振动
    FRAME_RATE.waterDrop_break = 0.1;   // 水滴爆炸
    FRAME_RATE.waterBomb_move = 0.05;   // 水弹移动
    FRAME_RATE.waterBomb_hitWall = 0.05;    // 水滴撞墙
    FRAME_RATE.check_gameover = 1;    // 检测游戏是否结束
}
if(typeof LAYER_TAG === "undefined") {
    var LAYER_TAG = {};
    LAYER_TAG.game_animation = 0;
    LAYER_TAG.game_failure = 1;
    LAYER_TAG.game_success = 2;
    LAYER_TAG.game_state = 3;
}
if(typeof ACTION_TAG === "undefined") {
    var ACTION_TAG = {};
    ACTION_TAG.water_break = 0;
}