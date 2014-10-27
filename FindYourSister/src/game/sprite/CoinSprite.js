/**
 * Created by yicha on 14-8-14.
 */
// 下方的金币
var CoinSprite = cc.Sprite.extend({
    numberLabel: null,
    number: null,
    init: function (number, labelAttr) {
        this._super();
        this.number = number;
        this.initWithSpriteFrameName("coin2.png");
        // 金币数目
        this.numberLabel = cc.LabelTTF.create(number, "Arial", 44);
        this.numberLabel.setColor(labelAttr.color);
        this.numberLabel.setAnchorPoint(cc.p(0, 0.5));
        this.numberLabel.attr({
            x: this.width / 2 + labelAttr.x,
            y: this.height / 2
        });
        this.addChild(this.numberLabel);
    },
    increaseNumber: function(n) {
        this.number += n;
        this.numberLabel.setString(this.number);
        var localStorageUtil = LocalStorageUtil.getInstance();
        localStorageUtil.increaseCoinNumber(n);
    },
    decreaseNumber: function(n) {
        var m = this.number - n;
        if(m >= 0) {
            this.number = m;
            this.numberLabel.setString(this.number);
            var localStorageUtil = LocalStorageUtil.getInstance();
            localStorageUtil.decreaseCoinNumber(n);
            return true;
        }
        return false;
    }
});
CoinSprite.create = function (number, labelAttr) {
    var sprite = new CoinSprite();
    sprite.init(number, labelAttr);
    return  sprite;
};