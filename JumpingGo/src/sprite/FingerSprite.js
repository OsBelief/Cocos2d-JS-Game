/**
 * Created by yicha on 14-7-21.
 */
var FingerSprite = cc.Sprite.extend({
    init: function() {
        if(this._super()) {
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("finger.png");
            this.initWithSpriteFrame(spriteFrame);
            this.schedule(this.disappear, FRAME_RATE.finger_disapper);
            return true;
        }
    },
    disappear: function() {
        var action = cc.FadeOut.create(1);  // 1s内淡出
        var _this = this;
        var actionFin = cc.CallFunc.create(function(){
            _this.unscheduleAllCallbacks();
            g_sharedGameLayer.removeChild(_this);
        });
        this.runAction(cc.Sequence.create([action, actionFin]));
    }
});
FingerSprite.create = function () {
    var sp = new FingerSprite();
    if (sp && sp.init()) {
        return sp;
    }
    return null;
};