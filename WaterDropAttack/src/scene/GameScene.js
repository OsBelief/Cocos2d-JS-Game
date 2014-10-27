/**
 * Created by yicha on 14-7-29.
 */
var g_sharedGameLayer;
var GameLayer = cc.Layer.extend({
    soundSprite: null,
    gameAnimationLayer: null,
    waterDrop_array: null,
    waterBomb_array: null,
    waterMark_array: null,
    waterMark_number: null,
    themeIndex: null,
    checkpointIndex: null,
    stateMenu: null,
    init: function () {
        if (this._super()) {
            cc.spriteFrameCache.addSpriteFrames(res.waterdrops_plist);
            var centerP = cc.p(WinSize.width / 2, WinSize.height / 2);
            // 背景层
            var bgLayer = cc.Layer.create();
            var bgSprite = cc.Sprite.create(res.game_bg);
            bgSprite.setPosition(centerP);
            bgLayer.addChild(bgSprite);
            var gridSprite = cc.Sprite.create(res.grid);
            gridSprite.attr({
                x: centerP.x,
                y: centerP.y + 30
            })
            bgLayer.addChild(gridSprite);
            this.addChild(bgLayer);
            // 状态层
            var stateLayer = cc.Layer.create();
            var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#btnBack.png"),
                cc.Sprite.create("#btnBackPress.png"), null, this.backCheckpointScene, this);
            backMenuItem.setScale(0.4);
            backMenuItem.attr({
                x: 180,
                y: -320
            });
            // 音乐按钮
            if (VOICE_STATE === 0) {
                this.soundSprite = cc.Sprite.create("#btnvoiceon.png");
            } else {
                this.soundSprite = cc.Sprite.create("#btnvoiceoff.png");
            }
            this.soundSprite.setScale(0.5);
            var soundMenuItem = cc.MenuItemSprite.create(this.soundSprite, null, null, this.settingsSound, this);
            soundMenuItem.attr({
                x: 20,
                y: 330
            });
            // 刷新按钮
            var resetMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#refresh.png"), null,
                null, this.reStartGame, this);
            resetMenuItem.attr({
                x: 200,
                y: 310
            });
            this.stateMenu = cc.Menu.create([backMenuItem, soundMenuItem, resetMenuItem]);
            stateLayer.addChild(this.stateMenu);
            this.addChild(stateLayer);
            return true;
        }
    },
    parseCheckpointConfig: function (themeIndex, checkpointIndex, createWaterDrop) {
        var _this = this;
        cc.loader.loadJson("res/Theme" + themeIndex + "/checkpoint" + checkpointIndex + ".json", function (err, data) {
            if (err) {
                return cc.log("load failed");
            } else {
                createWaterDrop(data, _this);  // 要么在此处理，要么添加回调
            }
        });
    },
    initWithThemeAndCheckpoint: function (themeIndex, checkpointIndex) {
        // 动态的游戏层
        this.waterDrop_array = [];
        this.waterBomb_array = [];
        this.waterMark_array = [];
        this.gameAnimationLayer = cc.Layer.create();
        this.gameAnimationLayer.tag = LAYER_TAG.game_animation;
        this.themeIndex = themeIndex;
        this.checkpointIndex = checkpointIndex;
        this.parseCheckpointConfig(themeIndex, checkpointIndex, this.createWaterDrop);
        var checkpointLabel = cc.LabelBMFont.create("第 " + checkpointIndex + " 关", res.font_fnt);
        checkpointLabel.attr({
            x: 60,
            y: WinSize.height - 90,
            scale: 1.3
        });
        this.gameAnimationLayer.addChild(checkpointLabel);
        var waterNumberLabel = cc.LabelBMFont.create("水滴数", res.font_fnt);
        waterNumberLabel.attr({
            x: 60,
            y: 150,
            scale: 1.3
        });
        this.gameAnimationLayer.addChild(waterNumberLabel);
        this.addChild(this.gameAnimationLayer);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: null,
            onTouchEnded: null
        }, this);
        g_sharedGameLayer = this;
        this.schedule(this.checkGameSuccess, FRAME_RATE.check_gameover);
    },
    createWaterDrop: function (data, _this) {
        // 添加下方的水滴数标记
        _this.waterMark_number = data["water_number"];
        for (var i = 0; i < _this.waterMark_number; i++) {
            var sprite = cc.Sprite.create("#onlyOneDrop_28.png");
            sprite.attr({
                x: 135 + i * 45,
                y: 150
            });
            _this.waterMark_array.push(sprite);
            _this.gameAnimationLayer.addChild(sprite);
        }
        // 添加网格中的水滴
        var state_array = data["water_state"];
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                var state = state_array[i * 6 + j];
                if (state != 0) {
                    var sp = WaterDropSprite.createWithState(state);
                    sp.attr({
                        x: 35 + 82 * j,
                        y: 640 - 84 * i
                    });
                    sp.tag = i * 6 + j;
                    _this.gameAnimationLayer.addChild(sp);
                    _this.waterDrop_array.push(sp);
                } else {
                    _this.waterDrop_array.push(null);
                }
            }
        }
    },
    settingsSound: function () {
        // 设置音乐按钮的状态
        if (VOICE_STATE === 0) {
            this.soundSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("btnvoiceoff.png"));
            VOICE_STATE = 1;
        } else {
            this.soundSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("btnvoiceon.png"));
            cc.audioEngine.playEffect(res.voice_press);
            VOICE_STATE = 0;
        }
    },
    onTouchBegan: function (touch, event) {
        // 每次点击水弹全部消失前点击无效
        var target = event.getCurrentTarget();
        var j = target.waterBomb_array.length;
        while(j--) {
            if (target.waterBomb_array[j].is_exit === true) {
                break;
            }
        }
        if (j === -1) {
            target.waterBomb_array = [];
            for (var i = 0; i < target.waterDrop_array.length; i++) {
                var sp = target.waterDrop_array[i];
                if (sp != null) {
                    var rect = cc.rect(sp.x - sp.width / 2, sp.y - sp.height / 2, sp.width, sp.height);
                    if (cc.rectContainsPoint(rect, touch.getLocation())) {
                        // 点击到的水滴
                        var action = sp.getActionByTag(ACTION_TAG.water_break);
                        if(action===null || action&&action.isDone()) {
                            if(--target.waterMark_number >=0) {
                                target.waterMark_array[target.waterMark_number].removeFromParent();
                                if(VOICE_STATE === 0) {
                                    cc.audioEngine.playEffect(res.voice_hit_water);
                                }
                                if (sp.state === 4) {
                                    g_sharedGameLayer.waterDrop_array[i] = null;
                                    sp.breakWaterDrop();
                                } else {
                                    sp.expandWaterDrop();
                                }
                            } else {
                                target.showFailureMenu();
                            }
                        }
                        break;
                    }
                }
            }
        }
        return true;
    },
    backCheckpointScene: function () {
        // 返回关卡选择场景
        var scene = CheckpointScene.createWithThemeIndex(this.themeIndex);
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_press);
        }
        cc.director.runScene(scene);
    },
    showFailureMenu: function() {
        this.stateMenu.setEnabled(false);
        // 游戏失败菜单
        var layer = cc.Layer.create();
        var bgSprite = cc.Sprite.create(res.successWindow);
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2,
            scaleY: 0.8
        });
        layer.addChild(bgSprite);
        var notice1Label = cc.LabelBMFont.create("已经没有水滴了, 就差一点点。", res.font_fnt);
        notice1Label.attr({
            x: WinSize.width / 2 + 10,
            y: WinSize.height / 2 + 30,
            scaleY: 1.3
        });
        layer.addChild(notice1Label);
        var notice2Label = cc.LabelBMFont.create("继续努力 !", res.font_fnt);
        notice2Label.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2 - 15,
            scaleY: 1.3
        });
        layer.addChild(notice2Label);
        var retryMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#restartButton.png"),
            null, null, this.reStartGame, this);
        var retryMenu = cc.Menu.create([retryMenuItem]);
        retryMenu.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2 - 80
        });
        layer.addChild(retryMenu);
        layer.tag = LAYER_TAG.game_failure;
        this.addChild(layer);
    },
    reStartGame: function() {
        // 重新开始游戏
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_press);
        }
        this.initWithThemeAndCheckpoint(this.themeIndex, this.checkpointIndex);
        if(this.getChildByTag(LAYER_TAG.game_failure) != null) {
            this.removeChildByTag(LAYER_TAG.game_failure);
        }
        if(this.getChildByTag(LAYER_TAG.game_success) != null) {
            this.removeChildByTag(LAYER_TAG.game_success);
        }
        this.removeChildByTag(LAYER_TAG.game_animation);
        this.stateMenu.setEnabled(true);
    },
    checkGameSuccess: function() {
        // 检测游戏是否成功(水滴组全为空，水弹组的is_exit为空)
        var i = this.waterDrop_array.length;
        while(i--) {
            if(this.waterDrop_array[i] != null) {
                break;
            }
        }
        var j = this.waterBomb_array.length;
        if(j > 0) {
            while(j--) {
                if(this.waterBomb_array[j].is_exit === true) {
                    break;
                }
            }
        }
        if(i === -1 && j === -1) {
            this.unscheduleAllCallbacks();
            this.showSuccessMenu();
        }
    },
    showSuccessMenu: function() {
        this.stateMenu.setEnabled(false);
        // 游戏成功菜单
        var layer = cc.Layer.create();
        var bgSprite = cc.Sprite.create(res.successWindow);
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2,
            scaleY: 0.8
        });
        layer.addChild(bgSprite);
        var i = this.waterMark_array.length - this.waterMark_number;
        var noticeLabel = cc.LabelBMFont.create("恭喜您过关了, 只用了" + i +"滴水。", res.font_fnt);
        noticeLabel.attr({
            x: WinSize.width / 2 + 10,
            y: WinSize.height / 2 + 30,
            scaleY: 1.3
        });
        layer.addChild(noticeLabel);
        var shareMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#shareScore.png"),
            null, null, this.shareScore, this);
        shareMenuItem.setScale(0.8);
        var nextGameItem = cc.MenuItemSprite.create(cc.Sprite.create("#nextLevelButton.png"),
            null, null, this.beginNextGame, this);
        nextGameItem.setScale(0.8);
        var gameOverMenu = cc.Menu.create([shareMenuItem, nextGameItem]);
        gameOverMenu.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2 - 80
        });
        gameOverMenu.alignItemsHorizontallyWithPadding(10);
        layer.addChild(gameOverMenu);
        layer.tag = LAYER_TAG.game_success;
        this.addChild(layer);
    },
    beginNextGame: function() {
        // 开始下一关
        var scene = GameScene.createWithThemeAndCheckpoint(this.themeIndex, this.checkpointIndex + 1);
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_press);
        }
        cc.director.runScene(scene);
    },
    shareScore: function() {
        var localStorageUtil = LocalStorageUtil.getInstance();
        var array = localStorageUtil.getCheckpointByThemeIndex(this.themeIndex - 1)["checkpoints"];
        var i = array.length;
        while(i--) {
            if(array[i]["islock"] === false) {
                var shareData = {
                    "imgUrl": "http://m.koudaiwan.cn/game/20140804/shuibogongjizhan/logo/icon.png",
                    "timeLineLink": "http://m.koudaiwan.cn/yly/indexforwx.y",
                    "tTitle": "水波攻击战",
                    "tContent": "我已经玩到水波攻击战的第" + (i + 1)  + "关了, 而且只用了" +
                        (this.waterMark_array.length - this.waterMark_number) + "滴水, 是不是太水了..., 快来挑战我吧!"
                };
                dp_submitScore(0,0,shareData);
                break;
            }
        }
    }
});
var GameScene = cc.Scene.extend({
    initWithThemeAndCheckpoint: function (themeIndex, checkpointIndex) {
        this.init();
        var gameLayer = new GameLayer();
        gameLayer.init();
        gameLayer.initWithThemeAndCheckpoint(themeIndex, checkpointIndex);
        this.addChild(gameLayer);
    }
});
GameScene.createWithThemeAndCheckpoint = function (themeIndex, checkpointIndex) {
    var gameScene = new GameScene();
    var localStorageUtil = LocalStorageUtil.getInstance();
    localStorageUtil.setLastThemeCheckpoint(themeIndex - 1, checkpointIndex - 1);
    gameScene.initWithThemeAndCheckpoint(themeIndex, checkpointIndex);
    return gameScene;
}
