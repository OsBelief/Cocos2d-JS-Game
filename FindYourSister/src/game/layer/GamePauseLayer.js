/**
 * Created by yicha on 14-8-19.
 */
// 游戏暂停图层
var GamePauseLayer = cc.Layer.extend({
    init: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.game_pause_plist);
        // 背景
        var bgSprite = cc.Sprite.create(res.game_pause_bg);
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        this.addChild(bgSprite);
        // 继续游戏
        var continueSprite = cc.Sprite.create(res.start_baseBtn);
        var continueLabel = cc.LabelTTF.create("继续游戏", "Arial", 42);
        continueLabel.attr({
            x: continueSprite.width / 2,
            y: continueSprite.height / 2
        });
        continueSprite.addChild(continueLabel);
        var continueMenuItem = cc.MenuItemSprite.create(continueSprite,
            null, null, this.continueGame, this);
        continueMenuItem.attr({
            x: -330,
            y: 150,
            scale: 0.8
        });
        // 存盘退出
        var saveSprite = cc.Sprite.create(res.start_baseBtn);
        var saveLabel = cc.LabelTTF.create("存盘退出", "Arial", 42);
        saveLabel.attr({
            x: saveSprite.width / 2,
            y: saveSprite.height / 2
        });
        saveSprite.addChild(saveLabel);
        var saveMenuItem = cc.MenuItemSprite.create(saveSprite,
            null, null, this.saveQuit, this);
        saveMenuItem.attr({
            x: -330,
            y: -150,
            scale: 0.8
        });
        var controlMenu = cc.Menu.create([continueMenuItem, saveMenuItem]);
        this.addChild(controlMenu);
        var localStorageUtil = LocalStorageUtil.getInstance();
        var coin_skill = localStorageUtil.getCoinAndSkill();
        // 金币
        var coinSprite = CoinSprite.create(coin_skill.coinNumber,
            {color: cc.color(255, 255, 255, 0), x: 50});
        coinSprite.attr({
            x: 520,
            y: 310,
            scale: 0.6
        });
        this.addChild(coinSprite);
        // 技能
        var skill_array = [];
        for (var i = 0; i < 3; i++) {
            var skill = coin_skill.personalSkill[i];
            var sp = ShopSkillSprite.create(skill.availableNumber, "pause_item" + (i + 1) + ".png",
                {color: cc.color(255, 255, 255, 0), offset: 60});
            sp.attr({
                x: 630 + i * 80,
                y: 310,
                scale: 0.4
            });
            this.addChild(sp);
            skill_array.push(sp);
        }
        // 购买技能
        var menu = cc.Menu.create();
        for (var i = 0; i < 3; i++) {
            var label = cc.LabelTTF.create("购买", "Arial", 42);
            var sp = cc.Sprite.create("#fastBuy" + (i + 1) + ".png");
            label.attr({
                x: sp.width / 2,
                y: sp.height / 2 - 62
            });
            sp.addChild(label);
            var spMenuItem = cc.MenuItemSprite.create(sp, null, null,
                this.purchaseSkill(skill_array[i], coinSprite, coin_skill.personalSkill[i]), this);
            spMenuItem.attr({
                x: -60 + 150 * i,
                y: -180
            });
            menu.addChild(spMenuItem);
        }
        this.addChild(menu);
    },
    continueGame: function () {
        cc.director.resume();
        var thingsLayer = this.getParent().getChildByTag(LAYER_TAG.things_layer);
        thingsLayer.resumeEventResponse();
        this.removeFromParent();
    },
    saveQuit: function () {
        cc.director.runScene(new StartScene());
        cc.director.resume();
    },
    purchaseSkill: function (skillSprite, coinSprite, skill) {
        return function () {
            if (coinSprite.decreaseNumber(skill.price)) {
                skillSprite.increaseSkillNumber(skill.skillName);
                var stateLayer = this.getParent().getChildByTag(LAYER_TAG.state_layer);
                stateLayer.updateStateLabel(skill.skillName, skill.price);
            }
        }
    }
});
GamePauseLayer.create = function () {
    var layer = new GamePauseLayer();
    layer.init();
    return layer;
};