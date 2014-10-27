/**
 * Created by yicha on 14-7-18.
 */
var BoxSprite = cc.Sprite.extend({
    is_score: false,
    corresponding_eye: null,
    ctor: function () {
        this._super();
        this.size = cc.director.getWinSize();
    },
    init: function (random, direct) {
        if (this._super()) {
            // 两种箱子，两种移动方向，可由四种随机值产生
            var spriteFrame;
            if (random === 0) {
                spriteFrame = cc.spriteFrameCache.getSpriteFrame("box_1.png");
                this.initWithSpriteFrame(spriteFrame);
            } else {
                spriteFrame = cc.spriteFrameCache.getSpriteFrame("box_2.png");
                this.initWithSpriteFrame(spriteFrame);
            }
            return true;
        }
    },
    move_up: function () {
        var y = this.getPositionY();
        if (y > WinSize.height + this.height) {
            this.unscheduleAllCallbacks();
        } else {
            this.setPositionY(this.getPositionY() + 30);
            if(cc.rectIntersectsRect(this.collideRect(), this.corresponding_eye.collideRect())) {
                this.unscheduleAllCallbacks();
                g_sharedGameLayer.onGameOver();
                return;
            }
            if (this.is_score === false && this.getPositionY() > WinSize.height / 2) {
                this.is_score = true;   // 防止重复计分
                g_sharedGameLayer.score++;
                g_sharedGameLayer.currentScoreLabel.setString(g_sharedGameLayer.score);
            }
        }
    },
    move_down: function () {
        var y = this.getPositionY();
        if(y < - this.height) {
            this.unscheduleAllCallbacks();
        } else {
            this.setPositionY(this.getPositionY() - 30);
            if(cc.rectIntersectsRect(this.collideRect(), this.corresponding_eye.collideRect())) {
                this.unscheduleAllCallbacks();
                g_sharedGameLayer.onGameOver();
                return;
            }
            if (this.is_score === false && this.getPositionY() < WinSize.height / 2) {
                this.is_score = true;   // 防止重复计分
                g_sharedGameLayer.score++;
                g_sharedGameLayer.currentScoreLabel.setString(g_sharedGameLayer.score);
            }
        }
    },
    collideRect : function() {
        var s = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - s.width / 2, p.y - s.height / 2, s.width, s.height);
    }
});
BoxSprite.create = function (random, direct) {
    var sp = new BoxSprite();
    if (sp && sp.init(random, direct)) {
        return sp;
    }
    return null;
};