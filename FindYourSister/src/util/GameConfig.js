/**
 * Created by yicha on 14-8-5.
 */
if(typeof FRAME_RATE === "undefined") {
    var FRAME_RATE = {};
    FRAME_RATE.start_world_roll = 35;
    FRAME_RATE.start_title_animal = 0.5;
    FRAME_RATE.start_char_move = 0.3;
    FRAME_RATE.start_helper_move  = 0.2;
    FRAME_RATE.player_move = 1;
    FRAME_RATE.task_hint_shake = 0.5;
    FRAME_RATE.task_face_show = 0.5
}
if(typeof ACTION_TAG === "undefined") {
    var ACTION_TAG = {};
    ACTION_TAG.skill_cooling = 0;
}
if(typeof LAYER_TAG === "undefined") {
    var LAYER_TAG = {};
    LAYER_TAG.state_layer = 0;
    LAYER_TAG.things_layer = 1;
    LAYER_TAG.themes_layer = 2;
    LAYER_TAG.theme_state_layer = 3;
}
if(typeof SKILL_STATE === "undefined") {
    var SKILL_STATE = {};
    SKILL_STATE.cooling = 0;
    SKILL_STATE.enable = 1;
    SKILL_STATE.zero = 2;
}