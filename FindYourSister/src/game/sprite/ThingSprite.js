/**
 * Created by yicha on 14-8-15.
 */
// 东西
var ThingSprite = cc.Sprite.extend({
    tagNames: null,
    targetIndex: null,
    initWithProperty: function(thingIndex, tagNames) {
        this.tag = thingIndex;
        this.tagNames = tagNames;
    },
    isTaskContain: function(targets) {
        // 点击的精灵是否是任务包含的
        for(var i = 0; i < targets.length; i++) {
            for(var j = 0; j < this.tagNames.length; j++) {
                if(targets[i].targetName === this.tagNames[j]) {
                    this.targetIndex = i;   // 点击成功的精灵属于的任务索引
                    targets[i].completed++;
                    return true;
                }
            }
        }
    },
    disappear: function() {
        // 消失
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.p(this.x + this.width / 2, this.y + this.height / 2));
        var fadeAction = cc.FadeOut.create(1);
        var scaleAction = cc.ScaleTo.create(1, 0, 0);
        var rotateAction = cc.RotateTo.create(1, 90);
        var action = cc.Spawn.create([fadeAction, scaleAction, rotateAction]);
        var _this = this;
        var actionFin = cc.CallFunc.create(function() {
            var thingsLayer = _this.getParent();
            thingsLayer .addNewThing(_this, _this.tag);
            thingsLayer.getParent().checkTargetComplete(_this.targetIndex);
            _this.removeFromParent();
        });
        this.runAction(cc.Sequence.create([action, actionFin]));
    }
});
ThingSprite.createWithProperty = function(thingIndex, tagNames) {
    var sp = new ThingSprite();
    sp.initWithProperty(thingIndex, tagNames);
    return sp;
};