/**
 * Created by yicha on 14-8-5.
 */
if(typeof FRAME_RATE === "undefined") {
    var FRAME_RATE = {};
}
if(typeof ACTION_TAG === "undefined") {
    var ACTION_TAG = {};
    ACTION_TAG.animal_light_ring = 0;
}
if(typeof LAYER_TAG === "undefined") {
    var LAYER_TAG = {};
    LAYER_TAG.animal_layer = 0;
    LAYER_TAG.game_status_layer = 1;
    LAYER_TAG.guide_layer = 2;
    LAYER_TAG.help_layer = 3;
}
if(typeof SPRITE_TAG === "undefined") {
    var SPRITE_TAG = {};
    SPRITE_TAG.target_board = 0;
    SPRITE_TAG.target_animal = 1;
    SPRITE_TAG.animal_light_ring = 2;
}
if(typeof GUIDE_INDEX === "undefined") {
    var GUIDE_INDEX = {};
    GUIDE_INDEX.no_guide = 0;
    GUIDE_INDEX.vertical = 1;
    GUIDE_INDEX.horizontal = 2;
    GUIDE_INDEX.remainder = 3;
}
if(typeof ELIMINATE_TYPE === "undefined") {
    var ELIMINATE_TYPE = {};
    ELIMINATE_TYPE.normal_eliminate = 0;
    ELIMINATE_TYPE.line_eliminate = 1;
    ELIMINATE_TYPE.column_eliminate = 2;
}