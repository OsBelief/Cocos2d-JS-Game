/**
 * Created by yicha on 14-8-20.
 */
var GameFailureLayer = cc.Layer.extend({
    themeIndex: null,
    storage: null,
    initWithThemeIndex: function (themeIndex) {
        this.themeIndex = themeIndex;
        // 背景
        var layer = cc.Layer.create();
        var bgSprite = cc.Sprite.create("res/task/task_bg_" + themeIndex + ".jpg");
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        layer.addChild(bgSprite);
        // 牌子
        var gameOverSprite = cc.Sprite.create(res.game_failure_fail);
        gameOverSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2 + 10
        });
        layer.addChild(gameOverSprite);
        // 返回按钮
        var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create(res.button_end_menu)
            , null, null, this.backStartScene, this);
        backMenuItem.attr({
            x: -320,
            y: 210
        });
        // 可利用复活数
        this.storage = LocalStorageUtil.getInstance();
        var skills = this.storage.getPersonalSkill();
        var number = skills[3].availableNumber;
        var numberLabel = cc.LabelTTF.create("复活 X" + number, "Arial", 24);
        numberLabel.setColor(cc.color(255, 0, 0, 0));
        numberLabel.attr({
            x: 240,
            y: 100
        });
        layer.addChild(numberLabel);
        // 复活按钮
        var relieveSprite = cc.Sprite.create(res.relieve_skill);
        var relieveMenuItem = cc.MenuItemSprite.create(relieveSprite
            , null, null, this.useRelive(themeIndex, number, this.storage), this);
        relieveMenuItem.attr({
            x: -240,
            y: -150
        });
        var menu = cc.Menu.create([backMenuItem, relieveMenuItem]);
        layer.addChild(menu);
        this.addChild(layer);
    },
    backStartScene: function () {
        var dialog = ReliveDialog.create();
        this.addChild(dialog);
        this.pauseTouchEvent();
    },
    useRelive: function (themeIndex, number, storage) {
        return function () {
            var scene = null;
            if (number > 0) {
                scene = ThemeMapScene.createWithThemeIndex(themeIndex);
                storage.decreaseSkillNumber("relive");
            } else {
                LoaderScene.preload(store_resources, function () {
                    scene = ShoppingScene.create({tag: 1, themeIndex: themeIndex});
                });
            }
            cc.director.runScene(scene);
        }
    },
    resetThemeProcess: function () {
        this.storage.setRestartProcess(this.themeIndex);
        cc.director.runScene(new StartScene());
    },
    pauseTouchEvent: function () {
        cc.eventManager.pauseTarget(this, true);
    },
    resumeTouchEvent: function () {
        cc.eventManager.resumeTarget(this, true);
    }
});
var GameFailureScene = cc.Scene.extend({
    initWithThemeIndex: function (themeIndex) {
        var layer = new GameFailureLayer();
        layer.initWithThemeIndex(themeIndex);
        this.addChild(layer);
    }
});
GameFailureScene.createWithThemeIndex = function (themeIndex) {
    var scene = new GameFailureScene();
    scene.initWithThemeIndex(themeIndex);
    return scene;
};