/**
 * Created by yicha on 14-8-12.
 */
// 游戏场景
var GameLayer = cc.Layer.extend({
    checkPointTask: null,
    themeIndex: null,
    checkpointIndex: null,
    initWithThemeAndTask: function (themeIndex, checkpointIndex, task) {
        this.checkPointTask = task;
        this.themeIndex = themeIndex;
        this.checkpointIndex = checkpointIndex;
        // 背景层
        var bgLayer = cc.Layer.create();
        var bgSprite = cc.Sprite.create("res/game/game_bg_" + themeIndex + ".png");
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        bgLayer.addChild(bgSprite);
        this.addChild(bgLayer);
        // 状态层
        var localStorageUtil = LocalStorageUtil.getInstance();
        var game_state = {
            themeIndex: themeIndex,
            targets: task.targets,
            taskNumber: task.taskNumber,
            personalSkill: localStorageUtil.getPersonalSkill(),
            coinNumber: localStorageUtil.getCoinNumber()
        };
        var stateLayer = GameStateLayer.createWithGameState(game_state);
        stateLayer.tag = LAYER_TAG.state_layer;
        this.addChild(stateLayer);
        // 东西层
        var _this = this;
        cc.loader.loadJson(res.thing_images, function (err, data) {
            if (err) {
                return cc.log("load failed");
            } else {
                // 重构images.json
                var imageSets = data["data"]["Imageset"];
                for (var i = 0; i < imageSets.length; i++) {
                    var images = imageSets[i]["Image"];
                    var _image = {};
                    for (var j = 0; j < images.length; j++) {
                        var image = images[j];
                        var _name = image["-Name"];
                        var _Xpos = image["-XPos"];
                        var _YPos = image["-YPos"];
                        var _Width = image["-Width"];
                        var _Height = image["-Height"];
                        _image[_name] = {"-XPos": _Xpos, "-YPos": _YPos, "-Width": _Width, "-Height": _Height};
                    }
                    imageSets[i]["Image"] = _image;
                }
                var thingsLayer = ThingsLayer.createWithThingsAndImgData(task.things, data);
                _this.addChild(thingsLayer);
            }
        });
    },
    touchSuccess: function (position, touchThing) {
        this.increaseCoinEffect(1, position);
        // 点击正确的东西消失
        touchThing.disappear();
    },
    touchFailure: function (position) {
        var layer = cc.Layer.create();
        // 显示红叉
        var wrongSprtie = cc.Sprite.create("#wrong.png");
        wrongSprtie.setPosition(position);
        wrongSprtie.setScale(0.5);
        layer.addChild(wrongSprtie);
        // 显示时间减7
        var reduceTimeLabel = cc.LabelTTF.create("-7", "Arial", 64);
        reduceTimeLabel.attr({
            x: position.x + 50,
            y: position.y
        });
        reduceTimeLabel.setColor(cc.color(255, 0, 0, 0));
        layer.addChild(reduceTimeLabel);
        // 时间减7
        var stateLayer = this.getChildByTag(LAYER_TAG.state_layer);
        stateLayer.timingSprite.reduceTime(7);
        this.addChild(layer);
        // 消失
        wrongSprtie.scheduleOnce(function () {
            wrongSprtie.setVisible(false);
        }, 0.3);
        var action = cc.FadeOut.create(1);
        var actionFin = cc.CallFunc.create(function () {
            layer.removeFromParent();
        }, this);
        reduceTimeLabel.runAction(cc.Sequence.create([action, actionFin]));
    },
    checkTargetComplete: function (index) {
        // 检测任务目标是否完成，如果完成则创建新的任务
        var targets = this.checkPointTask.targets;
        var belongTarget = targets[index];
        var stateLayer = this.getChildByTag(LAYER_TAG.state_layer);
        var tipSprite = stateLayer.tip_array[index];
        if (belongTarget.thingsNumber === belongTarget.completed) {
            // 这个目标已完成
            // 每完成一个目标金币加5
            this.increaseCoinEffect(5, cc.p(480, 320));
            var taskNumberSprite = stateLayer.taskNumberTip;
            taskNumberSprite.updateFinished();
            tipSprite.finishTarget();
            if (taskNumberSprite.isCompleted()) {
                this.passCheckpoint();
            } else {
                // 创建新的任务
                this.createNewTarget(tipSprite, index);
            }
        } else {
            tipSprite.updateNumberLabel();
        }
    },
    createNewTarget: function (tipSprite, index) {
        var things_array = this.checkPointTask.things;
        var targetGenerator = new TargetGenerator(this.themeIndex, this.checkpointIndex, things_array);
        var new_target = targetGenerator.createNewTarget();
        // 更新原有任务列表
        var targets = this.checkPointTask.targets;
        targets.splice(index, 1, new_target);
        // 显示新的任务
        tipSprite.setNewTarget(new_target);
        this.showFaceAndTask(new_target);
    },
    showFaceAndTask: function (new_target) {
        // 大脸
        var layer = cc.Layer.create();
        this.addChild(layer);
        var faceSprite = cc.Sprite.create("#objCard.png");
        faceSprite.attr({
            x: 480,
            y: 320,
            scale: 0.4
        });
        layer.addChild(faceSprite);
        var action = cc.ScaleTo.create(FRAME_RATE.task_face_show, 1, 1);
        var actionFin = cc.CallFunc.create(function () {
            var taskStr = new_target.targetName + " X " + new_target.thingsNumber;
            // 显示新任务
            var taskLabel = cc.LabelTTF.create(taskStr, "Arial", 32);
            taskLabel.setColor(cc.color(0, 255, 0, 0));
            taskLabel.attr({
                x: 480,
                y: 320
            });
            layer.addChild(taskLabel);
            var _this = this;
            taskLabel.scheduleOnce(function () {
                layer.removeFromParent();
                // 每完成一个目标时间+5
                var label = cc.LabelTTF.create("+5秒", "Arial", 48);
                label.setColor(cc.color(255, 215, 0, 0));
                label.attr({
                    x: WinSize.width / 2,
                    y: WinSize.height / 2
                });
                _this.addChild(label);
                var stateLayer = _this.getChildByTag(LAYER_TAG.state_layer);
                stateLayer.timingSprite.increaseTime(5);
                var action = cc.FadeOut.create(2);
                var actionFin = cc.CallFunc.create(function () {
                    label.removeFromParent();
                }, label);
                label.runAction(cc.Sequence.create([action, actionFin]));
            }, 1);
        }, this);
        faceSprite.runAction(cc.Sequence.create([action, actionFin]));
    },
    passCheckpoint: function () {
        // 该关卡通过，进入theme_map场景
        var localStorageUtil = LocalStorageUtil.getInstance();
        localStorageUtil.setCurrentProcess(this.themeIndex, this.checkpointIndex + 1);
        if (this.checkpointIndex > 31) {
            this.themeIndex += 1;
        }
        var scene = ThemeMapScene.createWithThemeIndex(this.themeIndex);
        cc.director.runScene(scene);
    },
    onGameFailure: function () {
        cc.eventManager.pauseTarget(this, true);
        var sprite = this.findOneTargetSprite();
        // 东西旋转
        sprite.setAnchorPoint(cc.p(0.5, 0.5));
        sprite.setPosition(cc.p(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2));
        var action1 = cc.RotateTo.create(0.3, 15);
        var action2 = cc.RotateTo.create(0.3, -15);
        var action12 = cc.Repeat.create(cc.Sequence.create([action1, action2]), 4);
        var actionFin = cc.CallFunc.create(function () {
            // 进入游戏失败场景
            var common_resource = game_failure_resources;
            var failure_resource = window["task_" + this.themeIndex + "_resources"];
            var resource = failure_resource.concat(common_resource);
            var _this = this;
            LoaderScene.preload(resource, function () {
                var scene = GameFailureScene.createWithThemeIndex(_this.themeIndex);
                cc.director.runScene(scene);
            });
        }, this);
        sprite.runAction(cc.Sequence.create([action12, actionFin]));
    },
    increaseCoinEffect: function (number, position) {
        // 金币加1
        var coinIncrease = cc.LabelTTF.create("+" + number + "个金币!", "Arial", 36);
        coinIncrease.attr({
            x: position.x,
            y: position.y
        });
        coinIncrease.setColor(cc.color(255, 165, 0, 0));
        this.addChild(coinIncrease);
        var stateLayer = this.getChildByTag(LAYER_TAG.state_layer);
        stateLayer.coinSprite.increaseNumber(number);
        var action = cc.FadeOut.create(1.5);
        coinIncrease.runAction(action);
    },
    /**
     * 找到属于目标中的一个精灵
     * @returns {*}
     */
    findOneTargetSprite: function () {
        var unfinished = null;
        var targets = this.checkPointTask.targets;
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            if (target.thingsNumber > target.completed) {
                unfinished = target.targetName;
                break;
            }
        }
        // 找出该任务下的一个精灵
        var sprite = null;
        var thingsLayer = this.getChildByTag(LAYER_TAG.things_layer);
        var thingSprite_array = thingsLayer.getChildren();
        for (var i = 0; i < thingSprite_array.length; i++) {
            var tagNames = thingSprite_array[i].tagNames;
            for (var j = 0; j < tagNames.length; j++) {
                if (tagNames[j] === unfinished) {
                    sprite = thingSprite_array[i];
                    break;
                }
            }
        }
        // 如果Sprite不在屏幕内，则将其移入屏幕
        if (sprite.x + thingsLayer.x  < 10) {
            thingsLayer.x -= sprite.x + thingsLayer.x - 10;
        }
        if (sprite.x + thingsLayer.x + sprite.width > 950) {
            thingsLayer.x -=sprite.x + thingsLayer.x + sprite.width - 950;
        }
        return sprite;
    }
});
var GameScene = cc.Scene.extend({
    initWithThemeAndTask: function (themeIndex, checkpointIndex, task) {
        var layer = new GameLayer();
        layer.initWithThemeAndTask(themeIndex, checkpointIndex, task);
        this.addChild(layer);
    }
});
GameScene.createWithThemeAndTask = function (themeIndex, checkpointIndex, task) {
    var gameScene = new GameScene();
    gameScene.initWithThemeAndTask(themeIndex, checkpointIndex, task);
    return gameScene;
};
