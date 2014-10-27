/**
 * Created by yicha on 14-7-21.
 */
if(typeof FRAME_RATE == "undefined") {
    var FRAME_RATE = {};
    FRAME_RATE.eye_changed = 2; // 眼睛动画的时间间隔
    FRAME_RATE.eye_jump = 0.5;  // 眼睛跳起的时长
    FRAME_RATE.finger_disapper = 2;   // 指示手指显示的时长
    FRAME_RATE.create_box = 2;  // 产生箱子的时间间隔
    FRAME_RATE.box_move = 0.1;  // 箱子移动的时间间隔
};
//var BG_FRAME_RATE = 2;  // 背景颜色变化的时间间隔
if(typeof SPRITE_TAG == "undefined") {
    var SPRITE_TAG = {};
    SPRITE_TAG.left_eye = 01;
    SPRITE_TAG.right_eye = 02
};
if(typeof ACTION_TAG == "undefined") {
    var ACTION_TAG = {};
    ACTION_TAG.jump = 0;
};
if(typeof LAYER_TAG == "undefined") {
    var LAYER_TAG = {};
    LAYER_TAG.left_game = 0;
    LAYER_TAG.right_game = 1;
};
//if(typeof BG_RGB == "undefined") {
//    var BG_RGB = [
//        {
//           r:192,
//           g:255,
//           b:62
//        },
//        {
//            r:127,
//            g:255,
//            b:0
//        },
//        {
//            r:0,
//            g:255,
//            b:0
//        },
//        {
//            r:0,
//            g:255,
//            b:127
//        },
//        {
//            r:255,
//            g:131,
//            b:250
//        },
//        {
//            r:224,
//            g:102,
//            b:255
//        },
//        {
//            r:191,
//            g:62,
//            b:255
//        },
//        {
//            r:0,
//            g:191,
//            b:255
//        },
//        {
//            r:30,
//            g:114,
//            b:255
//        },
//        {
//            r:72,
//            g:118,
//            b:255
//        }
//    ];
//};