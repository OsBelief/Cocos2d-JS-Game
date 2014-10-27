/**
 * Created by yicha on 14-8-19.
 */
// 商店中的技能精灵
var ShopSkillSprite = cc.Sprite.extend({
    numberLabel: null,
    number: null,
    init: function (number, img, labelAttr) {
        this._super();
        this.number = number;
        this.initWithSpriteFrameName(img);
        this.numberLabel = cc.LabelTTF.create(number || "0", "Arial", 64);
        this.numberLabel.setColor(labelAttr.color);
        this.numberLabel.setAnchorPoint(cc.p(0, 0.5));
        this.numberLabel.attr({
            x: this.width / 2 + labelAttr.offset,
            y: this.height / 2
        });
        this.addChild(this.numberLabel);
    },
    increaseSkillNumber: function(skillName) {
        this.number ++;
        this.numberLabel.setString(this.number);
        var localStorageUtil = LocalStorageUtil.getInstance();
        localStorageUtil.increaseSkillNumber(skillName);
    }
});
ShopSkillSprite.create = function (number, img, labelAttr) {
    var sprite = new ShopSkillSprite();
    sprite.init(number, img, labelAttr);
    return  sprite;
};