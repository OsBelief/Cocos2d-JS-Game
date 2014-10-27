var g_sharedGameLayer;
var WinSize;
var GameLayer = cc.Layer.extend({
    startGameLayer: null,
    rightGameLayer: null,
    leftGameLayer: null,
    gameoverLayer: null,
    currentScoreLabel: null,
    score: 0,
    best_score: 0,
    game_over: false,
    ctor: function () {
        this._super();
        WinSize = cc.director.getWinSize();
        var centerPoint = cc.p(WinSize.width / 2, WinSize.height / 2);
        // 背景
        var bgSprite = new BackgroundSprite();
        bgSprite.init(centerPoint);
        this.addChild(bgSprite, 0);
        cc.spriteFrameCache.addSpriteFrames(res.images_plist);
        // 开始游戏图层
        this.startGameLayer = cc.Layer.create();
        var logoSprite = cc.Sprite.create("#jumping_go.png");
        logoSprite.attr({
            x: centerPoint.x,
            y: centerPoint.y + 300
        });
        this.startGameLayer.addChild(logoSprite, 0);
        var startMenuItem = cc.MenuItemSprite.create(
            cc.Sprite.create("#start_normal.png"), // normal state image
            cc.Sprite.create("#start_press.png"), //select state image
            this.onPlay, this);
        var startMenu = cc.Menu.create(startMenuItem);  //7. create the menu
        startMenu.attr({
            x: centerPoint.x - 80,
            y: centerPoint.y - 180
        });
        this.startGameLayer.addChild(startMenu, 0);
        var queenSprite = cc.Sprite.create("#queen_1.png");
        queenSprite.attr({
            x: centerPoint.x + 180,
            y: centerPoint.y - 190
        });
        this.startGameLayer.addChild(queenSprite, 0);
        this.addChild(this.startGameLayer);
        // bar
        this.barSprite = BarSprite.create();
        this.barSprite.attr({
            x: centerPoint.x,
            y: centerPoint.y
        });
        this.addChild(this.barSprite, 0);
        // 左边
        this.leftGameLayer = LeftGameLayer.create();
        this.leftGameLayer.tag = LAYER_TAG.left_game;
        this.addChild(this.leftGameLayer);
        // 右边
        this.rightGameLayer = RightGameLayer.create();
        this.rightGameLayer.tag = LAYER_TAG.right_game;
        this.addChild(this.rightGameLayer);
        // 当前分数
        this.currentScoreLabel = ScoreLabel.create();
//        this.currentScoreLabel.setColor(cc.color(255, 0, 0, 0));
        this.currentScoreLabel.attr({
            x: 100,
            y: centerPoint.y + 400
        });
        this.addChild(this.currentScoreLabel, 2);
        this.currentScoreLabel.setVisible(false);
        this.gameoverLayer = GameOverLayer.create();
        this.addChild(this.gameoverLayer, 2);
        this.gameoverLayer.setVisible(false);
        g_sharedGameLayer = this;
    },
    init: function () {
        if (this._super()) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: null,
                onTouchEnded: null
            }, this);
            return true;
        }
    },
    onPlay: function () {
        this.removeChild(this.startGameLayer);
        this.currentScoreLabel.setVisible(true);
        this.barSprite.slow_long();
        // 左手
        var leftHandSprite = FingerSprite.create();
        leftHandSprite.attr({
            x: WinSize.width / 2 - 120,
            y: WinSize.height / 2 + 120
        });
        this.addChild(leftHandSprite, 0);
        // 右手
        var rightHandSprite = FingerSprite.create();
        rightHandSprite.attr({
            x: WinSize.width / 2 + 120,
            y: WinSize.height / 2 - 120
        });
        this.addChild(rightHandSprite, 0);
        this.leftGameLayer.createLeftBox((Math.floor(Math.random() * 2) + 1.5) * 1000);
        this.rightGameLayer.createRightBox((Math.floor(Math.random() * 2) + 1.5) * 1000);
    },
    onTouchBegan: function (touch, event) {
        // 获取当前点击点所在相对按钮的位置坐标
        var target = event.getCurrentTarget();
        var rect = cc.rect(0, 0, WinSize.width / 2, WinSize.height);
        var position;
        var action;
        var target_eye;
        if (cc.rectContainsPoint(rect, touch.getLocation())) {
            // 停止动画前点击无效
            target_eye = target.getChildByTag(LAYER_TAG.left_game).leftEyeSprite;
            action = target_eye.getActionByTag(ACTION_TAG.jump);
            if (action === null || action && action.isDone()) {
                position = cc.p(WinSize.width / 2 - 240, target_eye.getPositionY());
                cc.audioEngine.playEffect(res.jumpL_ogg);
                target_eye.jump(position);
            }
        } else {
            target_eye = target.getChildByTag(LAYER_TAG.right_game).rightEyeSprite;
            action = target_eye.getActionByTag(ACTION_TAG.jump);
            if (action === null || action && action.isDone()) {
                position = cc.p(WinSize.width / 2 + 240, target_eye.getPositionY());
                cc.audioEngine.playEffect(res.jumpR_ogg);
                target_eye.jump(position);
            }
        }
        return true;
    },
    onGameOver: function () {
        this.game_over = true;
        cc.audioEngine.playEffect(res.die_ogg);
        this.barSprite.slow_short();
        this.leftGameLayer.onLeftGameOver();
        this.rightGameLayer.onRightGameOver();
        this.currentScoreLabel.scale_disappear();
        cc.eventManager.removeListeners(this);
    },
    displayGameOverMenu: function () {
        // 游戏结束时显示菜单
        this.gameoverLayer.scoreLabel.setString(this.score);
        if (this.score > this.best_score) {
            this.best_score = this.score;
        }
        this.gameoverLayer.bestScoreLabel.setString(this.best_score);
        this.gameoverLayer.setVisible(true);
        this.gameoverLayer.display_effects();
    },
    onRetry: function () {
        this.gameoverLayer.setVisible(false);
        this.currentScoreLabel.fly_from_right();    // 从右侧飞入
        this.barSprite.slow_long();
        this.leftGameLayer.resetLeftGame();
        this.rightGameLayer.resetRightGame();
        this.leftGameLayer.createLeftBox((Math.floor(Math.random() * 2) + 1.5) * 1000);
        this.rightGameLayer.createRightBox((Math.floor(Math.random() * 2) + 1.5) * 1000);
        this.score = 0;
        this.game_over = false;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: null,
            onTouchEnded: null
        }, this);
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
    }
});

