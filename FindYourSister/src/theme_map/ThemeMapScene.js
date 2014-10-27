/**
 * Created by yicha on 14-8-8.
 */
// 地图场景
var ThemeMapLayer = cc.Layer.extend({
    themeIndex: null,
    nextCheckpoint: null,
    initWithThemeIndex: function (themeIndex) {
        this.themeIndex = themeIndex;
        // 背景层
        var bgLayer = cc.Layer.create();
        var bgSprite = cc.Sprite.create("res/theme_map/theme_map_" + themeIndex + ".jpg");
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        bgLayer.addChild(bgSprite);
        this.addChild(bgLayer);
        // 解析地图配置文件
        this.getThemeMapConfig(themeIndex, this.movePlayerSprite);
    },
    getThemeMapConfig: function(mapIndex, movePlayer) {
        var _this = this;
        cc.loader.loadJson("res/theme_map/theme_map_" + mapIndex + ".json", function (err, data) {
            if (err) {
                return cc.log("load failed");
            } else {
                movePlayer(data, _this);
            }
        });
    },
    movePlayerSprite: function(data, _this) {
        // 从当前关卡移动到新的关卡
        var localStorageUtil = LocalStorageUtil.getInstance();
        // currentProcess是指当前的游戏进度，即移动到的终点
        var currentProcess = localStorageUtil.getCurrentProcess(_this.themeIndex);
        var middle_p = [];
        if(currentProcess === 0) {
            for(var i = 0, len = data.length; i < len; i++) {
                var p = data[i];
                middle_p.push(p);
                if(p["index"] != undefined && p["index"] != null && p["index"] === 1) {
                    _this.nextCheckpoint = {"index": 1, "state": p["state"]};
                    break;
                }
            }
        } else {
            // 先找到上一个目标点
            var beforePoint = null;
            for(var i = 0, len = data.length; i < len; i++) {
                var p = data[i];
                if(p["index"] != undefined && p["index"] != null && p["index"] === currentProcess - 1) {
                    beforePoint = i;
                    break;
                }
            }
            // 再从上一个目标点找到该目标点
            for(var i = beforePoint, len = data.length; i < len; i++) {
                var p = data[i];
                middle_p.push(p);
                if(p["index"] != undefined && p["index"] != null && p["index"] === currentProcess) {
                    _this.nextCheckpoint = {"index": currentProcess, "state": p["state"]};
                    break;
                }
            }
        }
        var playerSprite = cc.Sprite.create("res/theme_map/player_" + _this.themeIndex + ".png");
        playerSprite.attr({
            x: middle_p[0]["x"],
            y: 640 - middle_p[0]["y"],
            scale: 0.2
        });
        _this.addChild(playerSprite);
        var move_action = [];
        for(var i = 1, len = middle_p.length; i < len; i++) {
            var action = cc.MoveTo.create(FRAME_RATE.player_move, cc.p(middle_p[i]["x"], 640 - middle_p[i]["y"]));
            move_action.push(action);
        }
        var actionFin = cc.CallFunc.create(function() {
            // 进入任务指示场景
            var common_resource = task_common_resources;
            var task_resource = window["task_" + _this.themeIndex + "_resources"];
            var resource = task_resource.concat(common_resource);
            LoaderScene.preload(resource, function () {
                var scene = TaskIndicateScene.createWithThemeCheckpoint(_this.themeIndex, _this.nextCheckpoint);
                cc.director.runScene(scene);
            });
        });
        move_action = move_action.concat(actionFin);
        playerSprite.runAction(cc.Sequence.create(move_action));
    }
});
var ThemeMapScene = cc.Scene.extend({
    initWithThemeIndex: function (index) {
        var layer = new ThemeMapLayer();
        layer.initWithThemeIndex(index);
        this.addChild(layer);
    }
});
ThemeMapScene.createWithThemeIndex = function (index) {
    var scene = new ThemeMapScene();
    scene.initWithThemeIndex(index);
    return scene;
};