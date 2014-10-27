/**
 * Created by yicha on 14-8-5.
 */
var WinSize = null;
// 游戏开始场景
var StartLayer = cc.Layer.extend({
    init: function () {
        if (this._super()) {
            WinSize = cc.director.getWinSize();
            // 背景层
            // 背景
            var backLayer = cc.Layer.create();
            var centerPoint = cc.p(WinSize.width / 2, WinSize.height / 2);
            var backSprite = cc.Sprite.create(res.start_ipad);
            backSprite.setPosition(centerPoint);
            backLayer.addChild(backSprite);
            this.addChild(backLayer);
            // 动画层
            // 转动的世界
            var animalLayer = cc.Layer.create();
            var worldSprite = cc.Sprite.create(res.start_world);
            worldSprite.attr({
                x: centerPoint.x - 200,
                y: -230
            });
            var rollAction = cc.RotateBy.create(FRAME_RATE.start_world_roll, -360);
            worldSprite.runAction(cc.RepeatForever.create(rollAction));
            animalLayer.addChild(worldSprite);
            // 标题
            cc.spriteFrameCache.addSpriteFrames(res.start_title_plist);
            var titleSprite = cc.Sprite.create("#title_1.png");
            titleSprite.attr({
                x: 350,
                y: 500
            });
            animalLayer.addChild(titleSprite);
            // 小人
            cc.spriteFrameCache.addSpriteFrames(res.start_char_move_plist);
            var playerSprite = cc.Sprite.create("#char_move_1.png");
            playerSprite.attr({
                x: 300,
                y: 230
            });
            animalLayer.addChild(playerSprite);
            // 脚印
            var footShadow = cc.Sprite.create(res.start_shadow);
            footShadow.attr({
                x: 300,
                y: 40
            });
            animalLayer.addChild(footShadow);
            this.addChild(animalLayer);
            this.beginTitleAnimal(titleSprite);
            this.beginPlayerRun(playerSprite);
            // 状态层
            var stateLayer = cc.Layer.create();
            // 购物
            var shoppingMenuItem = cc.MenuItemSprite.create(cc.Sprite.create(res.start_btn_store), null, null, this.intoShopping
                , this);
            shoppingMenuItem.attr({
                x: 296,
                y: 250
            });
            // 帮助
            var helpMenuItem = cc.MenuItemSprite.create(cc.Sprite.create(res.start_btn_help),
                null, null, this.showHelpLayer, this);
            helpMenuItem.attr({
                x: 400,
                y: 250
            });
            // 开始游戏
            var startGameSprite = cc.Sprite.create(res.start_baseBtn);
            var startLabel = cc.LabelTTF.create("开始游戏", "Arial", 42);
            startLabel.attr({
                x: startGameSprite.width / 2,
                y: startGameSprite.height / 2
            });
            startGameSprite.addChild(startLabel);
            var startGameMenuItem = cc.MenuItemSprite.create(startGameSprite,
                null, null, this.intoThemeScene, this);
            startGameMenuItem.attr({
                x: 300,
                y: 60
            });
            var menu = cc.Menu.create([shoppingMenuItem, helpMenuItem, startGameMenuItem]);
            stateLayer.addChild(menu);
            this.addChild(stateLayer);
            // 检查是否已注册
            this.checkRegister();
            return true;
        }
    },
    beginTitleAnimal: function (titleSprite) {
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("title_1.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("title_2.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.start_title_animal);
        var animate = cc.Animate.create(animation);
        titleSprite.runAction(cc.RepeatForever.create(animate));
    },
    beginPlayerRun: function (playerSprite) {
        var animFrames_move = [];
        animFrames_move.push(cc.spriteFrameCache.getSpriteFrame("char_move_1.png"));
        animFrames_move.push(cc.spriteFrameCache.getSpriteFrame("char_move_2.png"));
        animFrames_move.push(cc.spriteFrameCache.getSpriteFrame("char_move_3.png"));
        animFrames_move.push(cc.spriteFrameCache.getSpriteFrame("char_move_4.png"));
        var animation_move = cc.Animation.create(animFrames_move, FRAME_RATE.start_char_move);
        var animate_move = cc.Animate.create(animation_move);
        playerSprite.runAction(cc.RepeatForever.create(animate_move));
    },
    showHelpLayer: function () {
        var layer = HelpLayer.create();
        layer.attr({
            x: 0,
            y: 0
        });
        this.addChild(layer);
    },
    intoThemeScene: function () {
        // 进入主题选择图层
        LoaderScene.preload(themeselect_resources, function () {
            cc.director.runScene(new ThemeSelectScene());
        });
    },
    checkRegister: function () {
        // 检查是否已注册
        var localStorageUtil = LocalStorageUtil.getInstance();
        var player = localStorageUtil.getPlayer();
        if (player == null) {
            cc.eventManager.pauseTarget(this, true);
            this.showHelpLayer();
        }
    },
    intoShopping: function () {
        LoaderScene.preload(store_resources, function () {
            var scene = ShoppingScene.create({tag:0});
            cc.director.runScene(scene);
        });
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = StartLayer.create();
        this.addChild(layer);
    }
});

StartLayer.create = function () {
    var sc = new StartLayer();
    if (sc && sc.init()) {
        return sc;
    }
    return null;
};
