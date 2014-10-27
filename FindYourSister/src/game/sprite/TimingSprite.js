/**
 * Created by yicha on 14-8-14.
 */
// 下方的定时器
var TimingSprite = cc.Sprite.extend({
    timingLabel: null,
    timing: null,
    isDeadLine: false,
    initWithTiming: function (timing) {
        this.timing = timing;
        this.isDeadLine = false;
        this.initWithSpriteFrameName("timing.png");
        // 计时时间
        this.timingLabel = cc.LabelTTF.create(this.transformTime(timing), "Arial", 40);
        this.timingLabel.setColor(cc.color(72, 118, 255, 0));
        this.timingLabel.setAnchorPoint(cc.p(0, 0.5));
        this.timingLabel.attr({
            x: this.width / 2 + 50,
            y: this.height / 2
        });
        this.addChild(this.timingLabel);
        this.schedule(this.updateTiming, 1);
    },
    updateTiming: function() {
        //  更新时间
        this.timing--;
        if(this.timing < 0) {
            this.timingLabel.setString(this.transformTime(0));
            this.unscheduleAllCallbacks();
            var stateLayer = this.getParent();
            stateLayer.stopTwinkleEdge();
            stateLayer.getParent().onGameFailure();
        } else if(this.timing >= 0 && this.timing < 10) {
            this.timingLabel.setString(this.transformTime(this.timing));
            this.timingLabel.setColor(cc.color(255, 0, 0, 0));
            if(this.isDeadLine === false) {
                this.getParent().beginTwinkleEdge();
                this.isDeadLine = true;
            }
        } else {
            this.timingLabel.setString(this.transformTime(this.timing));
            if(this.isDeadLine === true) {
                this.getParent().stopTwinkleEdge();
                this.timingLabel.setColor(cc.color(72, 118, 255, 0));
                this.isDeadLine = false;
            }
        }
    },
    reduceTime: function(n) {
        this.timing -= n;
    },
    increaseTime: function(n) {
        this.timing += n;
    },
    transformTime: function(timing) {
        // 将时间转化成要求格式
        var m = parseInt(timing / 60, 10);
        var s = timing % 60;
        var str = "";
        if(m < 10) {
            str += "0" + m + ":";
        } else {
            str += m + ":";
        }
        if(s < 10) {
            str += "0" + s;
        } else {
            str += s;
        }
        return str;
    }
});
TimingSprite.createWithTiming = function (timing) {
    var sprite = new TimingSprite();
    sprite.initWithTiming(timing);
    return  sprite;
};