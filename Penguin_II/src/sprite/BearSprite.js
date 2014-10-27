/**
 * Created by yicha on 14-7-10.
 */
var BearSprite = cc.Sprite.extend({
    penguin : null,
    rate : null,
    cotr : function() {
        this._super();
    },
    init : function() {
        this.initWithFile(res.idle);
    },
    readyBaseBall : function() {
        // 熊挥杆准备
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.ready_1);
        animation.addSpriteFrameWithFile(res.ready_2);
        animation.addSpriteFrameWithFile(res.ready_3);
        animation.addSpriteFrameWithFile(res.ready_4);
        animation.addSpriteFrameWithFile(res.ready_5);
        animation.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate = cc.Animate.create(animation);
        this.stopAllActions();
        this.runAction(animate);
    },
    playBaseBall : function(penguin, percentage) {
        this.penguin = penguin;
        this.rate = percentage; // 将力量值看做企鹅被打出时的初速度
        // 熊开始挥杆
        this.stopAllActions();
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.strike_1);
        animation.addSpriteFrameWithFile(res.strike_2);
        animation.addSpriteFrameWithFile(res.strike_3);
        animation.addSpriteFrameWithFile(res.strike_4);
        animation.addSpriteFrameWithFile(res.strike_5);
        animation.setDelayPerUnit(0.05);
        var animate = cc.Animate.create(animation);
        // 挥杆结束后检测碰撞
        var actionFinish = cc.CallFunc.create(this.checkStrike.call(this));
        this.runAction(cc.Sequence.create([animate, actionFinish]));
    },
    strikeSuccess : function() {
        // 熊击打成功
        var animation_s = cc.Animation.create();
        animation_s.addSpriteFrameWithFile(res.strike_s_1);
        animation_s.addSpriteFrameWithFile(res.strike_s_2);
        animation_s.addSpriteFrameWithFile(res.strike_s_3);
        animation_s.addSpriteFrameWithFile(res.strike_s_4);
        animation_s.addSpriteFrameWithFile(res.strike_s_5);
        animation_s.setDelayPerUnit(0.1);
        var animate_s = cc.Animate.create(animation_s);
        this.stopAllActions();
        this.runAction(animate_s);
    },
    strikeFall : function() {
        // 熊击打失败
        var animation_f = cc.Animation.create();
        animation_f.addSpriteFrameWithFile(res.strike_f_1);
        animation_f.addSpriteFrameWithFile(res.strike_f_2);
        animation_f.addSpriteFrameWithFile(res.strike_f_3);
        animation_f.addSpriteFrameWithFile(res.strike_f_4);
        animation_f.setDelayPerUnit(0.1);
        var animate_f = cc.Animate.create(animation_f);
        this.stopAllActions();
        this.runAction(animate_f);
    },
    checkStrike : function() {
        var rect = cc.rect(this.getPositionX()-20, this.getPositionY()-10, 40, 70);
        if(cc.rectContainsPoint(rect, cc.p(this.penguin.getPositionX(), this.penguin.getPositionY()))) {
            this.penguin.stopAllActions();
            this.penguin.flyAfterStrike(this.rate);
            this.strikeSuccess();
        } else {
            this.strikeFall();
        }
    }
});