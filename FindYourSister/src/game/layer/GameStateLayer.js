/**
 * Created by yicha on 14-8-13.
 */
// 游戏场景的状态层
var GameStateLayer = cc.Layer.extend({
    edge_array: null,
    tip_array: null,
    taskNumberTip: null,
    coinSprite: null,
    timingSprite: null,
    eyeSkill: null,
    timeSkill: null,
    brushSkill: null,
    initWithWithGameState: function (game_state) {
        this.tip_array = [];
        cc.spriteFrameCache.addSpriteFrames(res.game_common_plist);
        cc.spriteFrameCache.addSpriteFrames("res/game/game_state_" + game_state.themeIndex + ".plist");
        this.edge_array = [];
        // 上边状态条
        var topEdge = cc.Sprite.create("#game_frame.png");
        topEdge.attr({
            x: WinSize.width / 2,
            y: 625
        });
        this.edge_array.push(topEdge);
        this.addChild(topEdge);
        // 状态条上的左边三提示
        var leftTip = this.createTipByTarget(game_state.targets[0]);
        leftTip.attr({
            x: 40,
            y: 610,
            scale: 0.5
        });
        this.addChild(leftTip);
        this.tip_array.push(leftTip);
        var middleTip = this.createTipByTarget(game_state.targets[1]);
        middleTip.attr({
            x: 240,
            y: 610,
            scale: 0.5
        });
        this.addChild(middleTip);
        this.tip_array.push(middleTip);
        var rightTip = this.createTipByTarget(game_state.targets[2]);
        rightTip.attr({
            x: 440,
            y: 610,
            scale: 0.5
        });
        this.addChild(rightTip);
        this.tip_array.push(rightTip);
        // 右边的任务数提示
        this.taskNumberTip = TaskNumberSprite.createWithTaskNumber(game_state.taskNumber);
        this.taskNumberTip.attr({
            x: 760,
            y: 600
        });
        this.addChild(this.taskNumberTip);
        // 暂停游戏按钮
        var pauseMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#pauseBtn.png"),
            null, null, this.pauseGame, this);
        pauseMenuItem.attr({
            x: 420,
            y: 285,
            scale: 0.8
        });
        // 下边状态条
        var bottomEdge = cc.Sprite.create("#game_frame.png");
        bottomEdge.attr({
            x: WinSize.width / 2,
            y: 15
        });
        this.edge_array.push(bottomEdge);
        this.addChild(bottomEdge);
        // 火眼金睛
        var eyeNumber = game_state.personalSkill[0].availableNumber;
        this.eyeSkill = BasicSkillSprite.createWithSkill({number: eyeNumber, imgsrc: "eye.png"});
        var eyeMenuItem = cc.MenuItemSprite.create(this.eyeSkill, null, null,
            this.useEyeSkill(this.eyeSkill), this);
        eyeMenuItem.attr({
            x: -390,
            y: -275,
            scale: 0.8
        });
        // 时间机器
        var timeNumber = game_state.personalSkill[1].availableNumber;
        this.timeSkill = BasicSkillSprite.createWithSkill({number: timeNumber, imgsrc: "time.png"});
        var timeMenuItem = cc.MenuItemSprite.create(this.timeSkill, null, null,
            this.useTimeSkill(this.timeSkill), this);
        timeMenuItem.attr({
            x: -240,
            y: -275,
            scale: 0.8
        });
        // 强力清除
        var brushNumber = game_state.personalSkill[2].availableNumber;
        this.brushSkill = BasicSkillSprite.createWithSkill({number: brushNumber, imgsrc: "brush.png"});
        var brushMenuItem = cc.MenuItemSprite.create(this.brushSkill, null, null,
            this.useBrushSkill(this.brushSkill), this);
        brushMenuItem.attr({
            x: -90,
            y: -275,
            scale: 0.8
        });
        var menu = cc.Menu.create([pauseMenuItem, eyeMenuItem, timeMenuItem, brushMenuItem]);
        this.addChild(menu);
        // 金币
        this.coinSprite = CoinSprite.create(game_state.coinNumber,
            {color: cc.color(255, 0, 0, 0), x: 50});
        this.coinSprite.attr({
            x: 560,
            y: 40
        });
        this.addChild(this.coinSprite);
        // 定时器
        this.timingSprite = TimingSprite.createWithTiming(60);
        this.timingSprite.attr({
            x: 800,
            y: 40
        });
        this.addChild(this.timingSprite);
    },
    createTipByTarget: function (target) {
        var sprite = null;
        if (target != undefined) {
            sprite = TipSprite.createWithTarget(target);
        } else {
            sprite = cc.Sprite.create("#block_2.png");
        }
        return sprite;
    },
    pauseGame: function () {
        // 暂停游戏
        cc.director.pause();
        var thingsLayer = this.getParent().getChildByTag(LAYER_TAG.things_layer);
        thingsLayer.pauseEventResponse();
        var pauseLayer = GamePauseLayer.create();
        this.getParent().addChild(pauseLayer);
    },
    /**
     * 使用火眼金睛
     * @param eyeSkill
     * @returns {Function}
     */
    useEyeSkill: function (eyeSkill) {
        var _this = this;
        return function () {
            var skill_state = eyeSkill.handleCooling("eye");
            if (skill_state === SKILL_STATE.zero) {
                _this.pauseGame();
            }
            if (skill_state === SKILL_STATE.enable) {
                var layer = _this.getParent();
                var sprite = layer.findOneTargetSprite();
                // 东西旋转
                var action1 = cc.RotateTo.create(0.3, 15);
                var action2 = cc.RotateTo.create(0.3, -15);
                var action12 = cc.RepeatForever.create(cc.Sequence.create([action1, action2]));
                sprite.runAction(cc.Sequence.create(action12));
            }
        }
    },
    /**
     * 使用时间机器
     * @param timeSkill
     * @returns {Function}
     */
    useTimeSkill: function (timeSkill) {
        var _this = this;
        return function () {
            var skill_state = timeSkill.handleCooling("time");
            if (skill_state === SKILL_STATE.enable) {
                // 定时时间+30
                this.timingSprite.increaseTime(30);
                // 显示+30
                var label = cc.LabelTTF.create("+30秒", "Arial", 81);
                label.setColor(cc.color(255, 215, 0, 0));
                label.setRotation(24);
                label.attr({
                    x: WinSize.width / 2,
                    y: WinSize.height / 2
                });
                this.addChild(label);
                var action = cc.FadeOut.create(2);
                var actionFin = cc.CallFunc.create(function () {
                    label.removeFromParent();
                }, label);
                label.runAction(cc.Sequence.create([action, actionFin]));
            }
            if (skill_state === SKILL_STATE.zero) {
                _this.pauseGame();
            }
        }
    },
    useBrushSkill: function (brushSkill) {
        var _this = this;
        return function () {
            var skill_state = brushSkill.handleCooling("brush");
            if (skill_state === SKILL_STATE.zero) {
                _this.pauseGame();
            }
        }
    },
    beginTwinkleEdge: function () {
        // 上下边闪烁
        var animFrames1 = [];
        animFrames1.push(cc.spriteFrameCache.getSpriteFrame("game_frame.png"));
        animFrames1.push(cc.spriteFrameCache.getSpriteFrame("game_bg_fail.png"));
        var animation1 = cc.Animation.create(animFrames1, 0.5);
        var animate1 = cc.Animate.create(animation1);
        this.edge_array[0].runAction(cc.RepeatForever.create(animate1));
        var animFrames2 = [];
        animFrames2.push(cc.spriteFrameCache.getSpriteFrame("game_frame.png"));
        animFrames2.push(cc.spriteFrameCache.getSpriteFrame("game_bg_fail.png"));
        var animation2 = cc.Animation.create(animFrames2, 0.5);
        var animate2 = cc.Animate.create(animation2);
        this.edge_array[1].runAction(cc.RepeatForever.create(animate2));
    },
    stopTwinkleEdge: function () {
        this.edge_array[0].stopAllActions();
        this.edge_array[0].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("game_frame.png"));
        this.edge_array[1].stopAllActions();
        this.edge_array[1].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("game_frame.png"));
    },
    updateStateLabel: function (skillName, spend) {
        var m = this.coinSprite.number - spend;
        this.coinSprite.numberLabel.setString(m);
        switch (skillName) {
            case "eye":
                this.eyeSkill.updateLabel(1);
                break;
            case "time":
                this.timeSkill.updateLabel(1);
                break;
            case "brush":
                this.brushSkill.updateLabel(1);
                break;
        }
    }
});
GameStateLayer.createWithGameState = function (game_state) {
    var gameStateLayer = new GameStateLayer();
    gameStateLayer.initWithWithGameState(game_state);
    return gameStateLayer;
};