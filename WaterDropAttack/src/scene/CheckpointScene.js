/**
 * Created by yicha on 14-7-29.
 * 选择关卡的场景
 */
var CheckpointLayer = cc.Layer.extend({
    themeIndex: null,
    checkpointFlags: null,
    initWidthThemeIndex: function(index) {
        this.init();
        this.themeIndex = index;
        var bgSprite = cc.Sprite.create(res.background);
        var centerPoint = cc.p(WinSize.width / 2, WinSize.height / 2);
        bgSprite.setPosition(centerPoint);
        this.addChild(bgSprite);
        var themeLabel = cc.LabelBMFont.create("第" + ChineseNumber[index-1] + "季", res.font_fnt);
        themeLabel.attr({
            x: centerPoint.x,
            y: WinSize.height - 30,
            scale: 1.5
        });
        this.addChild(themeLabel);
        var localStorageUtil = LocalStorageUtil.getInstance();
        this.checkpointFlags = localStorageUtil.getCheckpointByThemeIndex(index-1)["checkpoints"];
        var themeMenu = cc.Menu.create(this.createMenuItems(-155, 300));
        themeMenu.setPosition(centerPoint);
        this.addChild(themeMenu);
        var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#btnBack.png"),
            cc.Sprite.create("#btnBackPress.png"), null,this.backThemeScene, this);
        backMenuItem.setScale(0.4);
        var backMenu = cc.Menu.create(backMenuItem);
        backMenu.attr({
            x: WinSize.width - 40,
            y: 80
        });
        this.addChild(backMenu);
    },
    createMenuItems: function(x, y) {
        var menuItems = [];
        // 8行5列
        for(var i = 0; i < 8; i++) {
            for(var j = 0; j < 5; j++) {
                var sprite = cc.Sprite.create(this.checkCheckpoints(this.checkpointFlags[i * 5 + j]["islock"]));
                var label = cc.LabelBMFont.create(i * 5 + j + 1, res.font_fnt);
                label.attr({
                    x: sprite.width / 2,
                    y: sprite.height / 2,
                    scale: 2
                }); // 这地方感觉有问题，理应是label.setPosition(0, 0);
                sprite.addChild(label);
                var menuItem = cc.MenuItemSprite.create(sprite, null, null, this.startGameScene(i * 5 + j + 1), this);
                menuItem.attr({
                    x: x + j * 80,
                    y: y - i * 70,
                    scale: 0.6
                });
                menuItems.push(menuItem);
            }
        }
        return menuItems;
    },
    startGameScene: function(checkpointIndex) {
        var _this = this;
        return function() {
            cc.log("_this.checkpointFlags[checkpointIndex-1][\"islock\"]：" + (checkpointIndex-1));
            if(_this.checkpointFlags[checkpointIndex-1]["islock"] === false){
                var scene = GameScene.createWithThemeAndCheckpoint(_this.themeIndex, checkpointIndex);
                if(VOICE_STATE === 0) {
                    cc.audioEngine.playEffect(res.voice_press);
                }
                cc.director.runScene(scene);
            }
        }
    },
    backThemeScene: function() {
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_press);
        }
        cc.director.runScene(new ThemeScene());
    },
    checkCheckpoints: function(flag) {
        if(flag === false) {
            return "#optionBg.png";
        } else {
            return "#optionBgLocked.png";
        }
    }
});
var CheckpointScene = cc.Scene.extend({
    initWithThemeIndex:function(index){
        this.init();
        var layer = new CheckpointLayer();
        layer.initWidthThemeIndex(index);
        this.addChild(layer);
    }
});
CheckpointScene.createWithThemeIndex=function(index){
    var checkpointScene=new CheckpointScene();
    checkpointScene.initWithThemeIndex(index);
    return checkpointScene;
    cc.Sprite.create();
}
