/**
 * Created by Belief on 2014/8/17.
 */
var ShoppingLayer = cc.Layer.extend({
    coinLabel: null,
    skillLabel_array: [],
    fromScene: null,
    init: function (fromScene) {
        this._super();
        this.fromScene = fromScene;
        cc.spriteFrameCache.addSpriteFrames(res.store_plist);
        var lazyLayer = cc.Layer.create();
        // 背景
        var bgSprite = cc.Sprite.create(res.store_bg);
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        lazyLayer.addChild(bgSprite);
        // 返回按钮
        var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create(res.btn_close)
            , null, null, this.backStartScene, this);
        backMenuItem.attr({
            x: -415,
            y: 250,
            scale: 0.7
        });
        var menu = cc.Menu.create([backMenuItem]);
        lazyLayer.addChild(menu);
        this.addChild(lazyLayer);
        // 下拉列表
        var localStorageUtil = LocalStorageUtil.getInstance();
        var coin_skill = localStorageUtil.getCoinAndSkill();
        var skills = coin_skill["personalSkill"];
        var skillItems = [];
        for (var i = 0; i < skills.length; i++) {
            var skill = skills[i];
            var skillSprite = SkillListItem.createWithSkill(skill);
            skillSprite.tag = i;
            skillItems.push(skillSprite);

            var label = cc.LabelTTF.create(skill.availableNumber || "0", "Arial", 32);
            label.setColor(cc.color(0, 0, 0, 0));
            if (i < 3) {
                label.attr({
                    x: 445 + 80 * i,
                    y: 568
                });
            } else {
                label.attr({
                    x: 445 + 80 * (i + 1),
                    y: 568
                });
            }
            this.addChild(label);
            this.skillLabel_array.push(label);
        }
        var listView = ListViewLayer.createWithItems(skillItems, 820, 400, 140);
        listView.attr({
            x: WinSize.width / 2 - 50,
            y: WinSize.height / 2 + 180
        });
        this.addChild(listView);
        // 上部提示
        this.coinLabel = cc.LabelTTF.create(coin_skill.coinNumber || "0", "Arial", 32);
        this.coinLabel.attr({
            x: 250,
            y: 565
        });
        this.coinLabel.setColor(cc.color(255, 215, 0, 0));
        this.addChild(this.coinLabel);
    },
    backStartScene: function () {
        var scene = null;
        if(this.fromScene.tag === 0) {
            scene = new StartScene();
        }
        if(this.fromScene.tag === 1) {
            scene = GameFailureScene.createWithThemeIndex(this.fromScene.themeIndex);
        }
        cc.director.runScene(scene);
    },
    onPurchaseSkill: function (price, index, name) {
        var coinNumber = parseInt(this.coinLabel.getString());
        var m = coinNumber - price;
        if (m >= 0) {
            this.coinLabel.setString(m || "0");
            var localStorageUtil = LocalStorageUtil.getInstance();
            localStorageUtil.decreaseCoinNumber(price);
            var skill = this.skillLabel_array[index];
            var n = parseInt(skill.getString());
            skill.setString(n + 1);
            localStorageUtil.increaseSkillNumber(name);
        }
    }
});
var ShoppingScene = cc.Scene.extend({
    init: function (fromScene) {
        this._super();
        var layer = new ShoppingLayer();
        layer.init(fromScene);
        this.addChild(layer);
    }
});
ShoppingScene.create = function (fromScene) {
    var scene = new ShoppingScene();
    scene.init(fromScene);
    return scene;
};