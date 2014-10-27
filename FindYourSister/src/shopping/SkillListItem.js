/**
 * Created by yicha on 14-8-20.
 */
// 商品列表的一个子元素
var SkillListItem = cc.Sprite.extend({
    skill: null,
    initWithSkill: function (skill) {
        this.skill = skill;
        this.initWithSpriteFrameName("board.png");
        var skillSprite = cc.Sprite.create("#" + skill.skillName + ".png");
        skillSprite.attr({
            x: 70,
            y: this.height / 2 + 5
        });
        this.addChild(skillSprite);
        var detailLabel = cc.LabelTTF.create(skill.detail, "Arial", 28, cc.size(240, 120), cc.TEXT_ALIGNMENT_CENTER);
        detailLabel.setColor(cc.color(0, 0, 0, 0));
        detailLabel.attr({
            x: 250,
            y: 50
        });
        this.addChild(detailLabel);
        var number = cc.LabelTTF.create("X1", "Arial", 32);
        number.attr({
            x: 100,
            y: 50
        });
        number.setColor(cc.color(255, 0, 0, 0));
        this.addChild(number);
        var coin = cc.Sprite.create("#coinImg.png");
        coin.attr({
            x: 395,
            y: 107,
            scale: 0.5
        });
        this.addChild(coin);
        var price = cc.LabelTTF.create(skill.price, "Arial", 32);
        price.attr({
            x: 450,
            y: 105
        });
        this.addChild(price);
        var purchase = cc.LabelTTF.create("购买", "Arial", 36);
        purchase.setColor(cc.color(0, 255, 255, 0));
        var purchaseMenuItem = cc.MenuItemLabel.create(purchase, this.onPurchaseSkill, this);
        purchaseMenuItem.attr({
            x: -40,
            y: -270
        });
        var menu = cc.Menu.create([purchaseMenuItem]);
        this.addChild(menu);
    },
    onPurchaseSkill: function() {
        var layer = this.getParent().getParent().getParent();
        layer.onPurchaseSkill(this.skill.price, this.tag, this.skill.skillName);
    }
});
SkillListItem.createWithSkill = function (skill) {
    var sp = new SkillListItem();
    sp.initWithSkill(skill);
    return sp;
};