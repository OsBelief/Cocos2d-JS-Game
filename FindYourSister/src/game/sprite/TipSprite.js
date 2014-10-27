/**
 * Created by yicha on 14-8-14.
 */
// 上端左边的提示
var TipSprite = cc.Sprite.extend({
    number: null,
    numberLabel: null,
    nameLabel: null,
    initWithTarget: function (target) {
        this.initWithSpriteFrameName("block_1.png");
        // 提示物上的数字
        this.number = target.thingsNumber;
        this.numberLabel = cc.LabelTTF.create(this.number, "Arial", 44);
        this.numberLabel.setColor(cc.color(255, 0, 0, 0));
        this.numberLabel.attr({
            x: this.width / 2,
            y: this.height / 2
        });
        this.addChild(this.numberLabel);
        // 东西名称
        this.nameLabel = cc.LabelTTF.create(target.targetName, "Arial", 48);
        this.nameLabel.setColor(cc.color(72, 118, 255, 0));
        this.nameLabel.setAnchorPoint(cc.p(0, 0.5));
        this.nameLabel.attr({
            x: this.width + 45,
            y: this.height / 2
        });
        this.addChild(this.nameLabel);
    },
    updateNumberLabel: function() {
        this.number--;
        this.numberLabel.setString(this.number);
    },
    finishTarget: function() {
        // 完成该目标
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("block_2.png"));
        this.numberLabel.setVisible(false);
        this.nameLabel.setVisible(false);
    },
    setNewTarget: function(target) {
        this.numberLabel.setVisible(true);
        this.nameLabel.setVisible(true);
        this.number = target.thingsNumber;
        this.numberLabel.setString(this.number);
        this.nameLabel.setString(target.targetName);
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("block_1.png"));
    }
});
TipSprite.createWithTarget = function (target) {
    var sprite = new TipSprite();
    sprite.initWithTarget(target);
    return  sprite;
};