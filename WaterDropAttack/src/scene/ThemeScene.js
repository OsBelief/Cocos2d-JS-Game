/**
 * Created by yicha on 14-7-28.
 * 选择主题的场景
 */
var ThemeLayer = cc.Layer.extend({
    themeFlags: null,
    init: function() {
        if(this._super()) {
            var bgSprite = cc.Sprite.create(res.background);
            var centerPoint = cc.p(WinSize.width / 2, WinSize.height / 2);
            bgSprite.setPosition(centerPoint);
            this.addChild(bgSprite);

            var localStorageUtil = LocalStorageUtil.getInstance();
            this.themeFlags = localStorageUtil.getThemes();
            var themeMenu = cc.Menu.create(this.createMenuItems(-120, 150));
            themeMenu.setPosition(centerPoint);
            this.addChild(themeMenu);
            var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#btnBack.png"),
                cc.Sprite.create("#btnBackPress.png"), null,this.backStartScene, this);
            backMenuItem.setScale(0.4);
            var backMenu = cc.Menu.create([backMenuItem]);
            backMenu.attr({
                x: WinSize.width - 40,
                y: 80
            });
            this.addChild(backMenu);
            return true;
        }
    },
    createMenuItems: function(x, y) {
        var menuItems = [];
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 2; j++) {
                var sprite = cc.Sprite.create(this.checkThemes(this.themeFlags[i * 2 + j]));
                var label = cc.LabelBMFont.create("第" + ChineseNumber[i * 2 + j] + "季", res.font_fnt);
                label.attr({
                    x: sprite.width / 2,
                    y: sprite.height / 2,
                    scale: 0.7
                }); // 这地方感觉有问题，理应是label.setPosition(0, 0);
                sprite.addChild(label);
                sprite.setScale(1.5);
                var menuItem = cc.MenuItemSprite.create(sprite, null, null, this.startCheckpointScene(i * 2 + j + 1), this);
                menuItem.attr({
                    x: x + j * 190,
                    y: y - i * 180
                });
                menuItems.push(menuItem);
            }
        }
        return menuItems;
    },
    backStartScene: function() {
        if(VOICE_STATE === 0) {
            cc.audioEngine.playEffect(res.voice_press);
        }
        cc.director.runScene(new StartScene());
    },
    checkThemes: function(flag) {
        if(flag === false) {
            return "#optionBg.png";
        } else {
            return "#optionBgLocked.png";
        }
    },
    startCheckpointScene: function(number) {
        // 进入关卡选择场景
        var _this = this;
        return function(){
            if(_this.themeFlags[number-1] === false){
                var scene = CheckpointScene.createWithThemeIndex(number);
                if(VOICE_STATE === 0) {
                    cc.audioEngine.playEffect(res.voice_press);
                }
                cc.director.runScene(scene);
            }
        };
    }
});
ThemeLayer.create = function() {
    var sc = new ThemeLayer();
    if(sc && sc.init()) {
        return sc;
    }
    return null;
}
var ThemeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = ThemeLayer.create();
        this.addChild(layer);
    }
});