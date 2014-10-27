/**
 * Created by yicha on 14-7-18.
 */
var EyeSprite = cc.Sprite.extend({
    init: function() {
        if(this._super()) {
            var eye = "eye_" + (Math.floor(Math.random() * 4) + 1) + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(eye);
            this.initWithSpriteFrame(spriteFrame);
            this.schedule(this.change_state, FRAME_RATE.eye_changed);
            return true;
        }
    },
    change_state: function() {
        var eye = "eye_" + (Math.floor(Math.random() * 4) + 1) + ".png";
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(eye);
        this.initWithSpriteFrame(spriteFrame);
    },
    jump: function(p) {
        var current_p = this.getPosition();
        var jumpUp = cc.MoveTo.create(FRAME_RATE.eye_jump, p);
        var jumpDown = cc.MoveTo.create(FRAME_RATE.eye_jump, current_p);
        var rotateAction = cc.RotateBy.create(FRAME_RATE.eye_jump * 2, 90);
        var jumpAction = cc.Sequence.create([jumpUp, jumpDown]);
        var action = cc.Spawn.create(jumpAction, rotateAction);
        action.tag = ACTION_TAG.jump;
        this.runAction(action);
    },
    collideRect : function() {
        var s = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - s.width / 2, p.y - s.height / 2, s.width, s.height);
    }
});
EyeSprite.create = function() {
    var sp = new EyeSprite();
    if(sp && sp.init()) {
        return sp;
    }
    return null;
}