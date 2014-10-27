/**
 * Created by yicha on 14-7-29.
 */
// 水滴
var WaterDropSprite = cc.Sprite.extend({
    state: null,
    initWithState: function(state) {
        if(this.init()) {
            this.state = state;
            switch(state) {
                case 1:
                    this.initWithSpriteFrameName("oneDrop_58.png");
                    this.oneDropShake();
                    break;
                case 2:
                    this.initWithSpriteFrameName("twoDrop_40.png");
                    this.twoDropShake();
                    break;
                case 3:
                    this.initWithSpriteFrameName("threeDrop_25.png");
                    this.threeDropShake();
                    break;
                case 4:
                    this.initWithSpriteFrameName("fourDrop_16.png");
                    this.fourDropShake();
                    break;
            }
        }
    },
    oneDropShake: function() {
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_52.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_51.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_50.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_47.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_58.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_57.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_56.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_46.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_45.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("oneDrop_53.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.waterDrop_shake);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
    },
    twoDropShake: function() {
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_36.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_35.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_32.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_31.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_40.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_39.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_38.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_30.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_29.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("twoDrop_37.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.waterDrop_shake);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
    },
    threeDropShake: function() {
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_25.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_24.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_23.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_22.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_14.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_13.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_21.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_20.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_19.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("threeDrop_15.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.waterDrop_shake);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
    },
    fourDropShake: function() {
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_16.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_12.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_11.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_10.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_5.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_4.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_9.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_8.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_7.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("fourDrop_6.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.waterDrop_shake);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
    },
    expandWaterDrop: function() {
        // 增大水滴
        this.stopAllActions();  // 一定记得先把动画停了
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_hit_water);
        }
        switch(this.state) {
            case 1:
                this.twoDropShake();
                this.state++;
                break;
            case 2:
                this.threeDropShake();
                this.state++;
                break;
            case 3:
                this.fourDropShake();
                this.state++;
                break;
        }
    },
    breakWaterDrop: function() {
        // 状态四爆破
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_hit_water);
        }
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("touchBreak_2.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("touchBreak_0.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("touchBreak_1.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("touchBreak_3.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.waterDrop_break);
        var animate = cc.Animate.create(animation);
        var _this = this;
        var actionFin = cc.CallFunc.create(function(){
            _this.createWaterBomb();
            _this.removeFromParent();
        });
        this.stopAllActions();
        var action = cc.Sequence.create([animate, actionFin]);
        action.tag = ACTION_TAG.water_break;
        this.runAction(action);
    },
    createWaterBomb: function() {
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_drop_break);
        }
        // 四个方向的水滴
        var layer = g_sharedGameLayer.getChildByTag(LAYER_TAG.game_animation);
        var leftBomb = WaterBombSprite.initWithDirector("l", this.tag);
        leftBomb.attr({
            x: this.x - 48,
            y: this.y
        });
        g_sharedGameLayer.waterBomb_array.push(leftBomb);
        layer.addChild(leftBomb);
        var rightBomb = WaterBombSprite.initWithDirector("r", this.tag);
        rightBomb.attr({
            x: this.x + 48,
            y: this.y
        });
        g_sharedGameLayer.waterBomb_array.push(rightBomb);
        layer.addChild(rightBomb);
        var upBomb = WaterBombSprite.initWithDirector("u", this.tag);
        upBomb.attr({
            x: this.x,
            y: this.y + 48
        });
        g_sharedGameLayer.waterBomb_array.push(upBomb);
        layer.addChild(upBomb);
        var downBomb = WaterBombSprite.initWithDirector("d", this.tag);
        downBomb.attr({
            x: this.x,
            y: this.y - 48
        });
        g_sharedGameLayer.waterBomb_array.push(downBomb);
        layer.addChild(downBomb);
    }
});
WaterDropSprite.createWithState = function(state) {
    var sp = new WaterDropSprite();
    sp.initWithState(state);
    return sp;
}