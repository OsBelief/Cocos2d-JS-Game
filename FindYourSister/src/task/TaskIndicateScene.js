/**
 * Created by yicha on 14-8-11.
 */
// 任务指示场景
var TaskIndicateLayer = cc.Layer.extend({
    themeIndex: null,
    checkpoint: null,
    thing_array: null,
    checkpointTask: null,
    initWithThemeCheckpoint: function (themeIndex, checkpoint) {
        this.themeIndex = themeIndex;
        this.checkpoint = checkpoint;
        this.getThingsInfor(this.parseThingsInfor);
        cc.spriteFrameCache.addSpriteFrames("res/task/task_indicate.plist");
        // 背景层
        var bgLayer = cc.Layer.create();
        var sprite = cc.Sprite.create("res/task/task_bg_" + themeIndex + ".jpg");
        sprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        bgLayer.addChild(sprite);
        this.addChild(bgLayer);
        // 状态层
        var stateLayer = cc.Layer.create();
        var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create(res.button_end_menu)
            , null, null, this.backStartScene, this);
        backMenuItem.attr({
            x: -320,
            y: -210
        });
        var continueMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#button_end_continue.png")
            , null, null, this.startGame, this);
        continueMenuItem.attr({
            x: 320,
            y: -210
        });
        var menu = cc.Menu.create([backMenuItem, continueMenuItem]);
        stateLayer.addChild(menu);
        this.addChild(stateLayer);
        // 动画层
        var animalLayer = cc.Layer.create();
        // 上方提示
        var hintSprite = cc.Sprite.create("#findThisBoard_1.png");
        hintSprite.attr({
            x: 480,
            y: 540
        });
        animalLayer.addChild(hintSprite);
        // 提示语
        var hintLabel = cc.LabelTTF.create("请找到以下东西", "Arial", 42);
        hintLabel.setColor(cc.color(79, 148, 205, 0));
        hintLabel.attr({
            x: 480,
            y: 550
        });
        animalLayer.addChild(hintLabel);
        this.addChild(animalLayer);
        this.beginHintAnimal(hintSprite);
    },
    backStartScene: function () {
        cc.director.runScene(new StartScene);
    },
    beginHintAnimal: function (hintSprite) {
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("findThisBoard_1.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("findThisBoard_.png"));
        var animation = cc.Animation.create(animFrames, FRAME_RATE.task_hint_shake);
        var animate = cc.Animate.create(animation);
        hintSprite.runAction(cc.RepeatForever.create(animate));
    },
    getThingsInfor: function (callback) {
        // 获得某类东西和具体东西对应关系的文件
        var _this = this;
        cc.loader.loadTxt(res.things_infor, function (err, data) {
            if (err) {
                return cc.log("load failed");
            } else {
                callback(data, _this);
            }
        });
    },
    parseThingsInfor: function (data, _this) {
        var things = data.split("\r\n");
        _this.thing_array = [];
        var i = things.length;
        while (i--) {
            var thing = things[i];
            var items = thing.split(" ");
            var thingObject = {};
            var tagName = [];
            for (var j = 0; j < items.length; j++) {
                if (j === 0) {
                    thingObject.thingIndex = items[0];
                } else {
                    tagName.push(items[j]);
                }
            }
            thingObject.tagName = tagName;
            _this.thing_array.push(thingObject);
        }
        var levelDesign = new LevelDesign(_this.thing_array, _this.themeIndex, _this.checkpoint);
        _this.checkpointTask = levelDesign.createNewLevel();
        _this.showFaceAndTask();
    },
    showFaceAndTask: function () {
        // 大脸
        var faceSprite = cc.Sprite.create("#objCard.png");
        faceSprite.attr({
            x: 480,
            y: 320,
            scale: 0.4
        });
        this.addChild(faceSprite);
        var action = cc.ScaleTo.create(FRAME_RATE.task_face_show, 1, 1);
        var _this = this;
        var actionFin = cc.CallFunc.create(function () {
            var targets = _this.checkpointTask.targets;
            var taskStr = "";
            // 显示任务提示
            for (var i = 0; i < targets.length; i++) {
                taskStr += targets[i].targetName + " X " + targets[i].thingsNumber + "\n";
            }
            var taskLabel = cc.LabelTTF.create(taskStr, "Arial", 32);
            taskLabel.setColor(cc.color(0, 255, 0, 0));
            taskLabel.attr({
                x: 480,
                y: 320
            });
            _this.addChild(taskLabel);
        });
        faceSprite.runAction(cc.Sequence.create([action, actionFin]));
    },
    startGame: function () {
        // 进入游戏场景
        var _this = this;
        var resources = window["game_" + _this.themeIndex + "_resources"];
        resources = resources.concat(game_resources);
        LoaderScene.preload(resources, function () {
            cc.director.runScene(GameScene.createWithThemeAndTask(_this.themeIndex, _this.checkpoint["index"], _this.checkpointTask));
        });
    }
});
var TaskIndicateScene = cc.Scene.extend({
    initWithThemeCheckpoint: function (themeIndex, checkpoint) {
        var layer = new TaskIndicateLayer();
        layer.initWithThemeCheckpoint(themeIndex, checkpoint);
        this.addChild(layer);
    }
});
TaskIndicateScene.createWithThemeCheckpoint = function (themeIndex, checkpoint) {
    var scene = new TaskIndicateScene();
    scene.initWithThemeCheckpoint(themeIndex, checkpoint);
    return scene;
};