/**
 * Created by yicha on 14-7-18.
 */
var BarSprite = cc.Sprite.extend({
    init: function() {
        if(this._super()) {
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("bar.png");
            this.initWithSpriteFrame(spriteFrame);
            this.setScaleY(0.2);
            return true;
        }
    },
    slow_long: function() {
        // 黑条变长特效
        this.stopAllActions();
        var action = cc.ScaleTo.create(1, 1, 1);
        this.runAction(action);
    },
    slow_short: function() {
        // 黑条变短特效
        this.stopAllActions();
        var action = cc.ScaleTo.create(0.1, 1, 0.2);
        var _this = this;
        var actionFinish = cc.CallFunc.create(function(){
            g_sharedGameLayer.displayGameOverMenu();
        });
        this.runAction(cc.Sequence.create([action, actionFinish]));;
    }
});
BarSprite.create = function() {
    var sp = new BarSprite();
    if(sp && sp.init()) {
        return sp;
    }
    return null;
}