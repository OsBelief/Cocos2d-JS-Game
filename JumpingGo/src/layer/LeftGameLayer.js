/**
 * Created by yicha on 14-7-24.
 */
var LeftGameLayer = cc.Layer.extend({
    leftEyeSprite: null,
    box_array: null,
    createBoxTimeout:null,
    init: function() {
        if(this._super()) {
            var centerPoint = cc.p(WinSize.width / 2, WinSize.height / 2);
            this.leftEyeSprite = EyeSprite.create();
            this.leftEyeSprite.attr({
                x: centerPoint.x-22,
                y: centerPoint.y
            });
            this.leftEyeSprite.tag = SPRITE_TAG.left_eye;
            this.addChild(this.leftEyeSprite, 1);
            this.box_array = [];
            return true;
        }
    },
    stopCreateBox:function(){
        if(this.createBoxTimeout){
            clearTimeout(this.createBoxTimeout);
            this.createBoxTimeout = null;
        }
    },
    createLeftBox: function(time) {
        var _this = this;
        this.stopCreateBox();
        this.createBoxTimeout = setTimeout(function(){
            if(g_sharedGameLayer.game_over === true) {
                return;
            } else {
                var random = Math.floor(Math.random() * 2);
                var box;
                if(random === 0) {
                    box = BoxSprite.create(random, 0);   // 小箱子
                    box.attr({
                        x: WinSize.width / 2 - 30,
                        y: box.height / 2
                    });
                } else {
                    box = BoxSprite.create(random, 0);   // 大箱子
                    box.attr({
                        x: WinSize.width / 2 - 36,
                        y: box.height / 2
                    });
                }
                box.corresponding_eye = _this.leftEyeSprite;
                box.schedule(box.move_up, FRAME_RATE.box_move);
                _this.addChild(box, 0);
                _this.box_array.push(box);
                time = (Math.floor(Math.random() * 2) + 1.5) * 1000;
                _this.createLeftBox(time);
            }
        }, time);
    },
    onLeftGameOver: function() {
        var i = this.box_array.length;
        while(i--) {
            this.box_array[i].unscheduleAllCallbacks();
        }
        this.leftEyeSprite.stopAllActions();
    },
    resetLeftGame: function() {
        this.leftEyeSprite.attr({
            x: WinSize.width / 2 - 22,
            y: WinSize.height / 2
        });
        this.leftEyeSprite.setRotation(0);
        var i = this.box_array.length;
        while(i--) {
            this.removeChild(this.box_array[i]);
        }
        this.box_array = [];
    }
});
LeftGameLayer.create = function() {
    var sp = new LeftGameLayer();
    if(sp && sp.init()) {
        return sp;
    }
    return null;
}

