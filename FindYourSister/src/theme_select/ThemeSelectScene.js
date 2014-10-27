/**
 * Created by yicha on 14-8-6.
 */
// 主题选择场景
var ThemeSelectLayer = cc.Layer.extend({
    init:function() {
        if(this._super()) {
            cc.spriteFrameCache.addSpriteFrames(res.themeselect_basic_plist);
            // 背景层
            var bgLayer = cc.Layer.create();
            var bgSprite = cc.Sprite.create(res.themeselect_bg);
            bgSprite.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2
            });
            bgLayer.addChild(bgSprite);
            this.addChild(bgLayer);
            // 状态层
            var stateLayer = cc.Layer.create();
            stateLayer.tag = LAYER_TAG.theme_state_layer;
            // 投影仪
            var cameraSprite = cc.Sprite.create("#ppt.png");
            cameraSprite.attr({
                x: WinSize.width / 2,
                y: 60
            });
            stateLayer.addChild(cameraSprite);
            // 返回按钮
            var backMenuItem = cc.MenuItemSprite.create(cc.Sprite.create("#bigLevel_return.png")
                , null, null, this.backStateScene, this);
            backMenuItem.attr({
                x: 0,
                y: -255
            });
            var menu = cc.Menu.create([backMenuItem]);
            stateLayer.addChild(menu);
            this.addChild(stateLayer);
            // 动画图层
            var animalLayer = ThemeScrollLayer.create();
            animalLayer.tag = LAYER_TAG.themes_layer;
            this.addChild(animalLayer);
            return true;
        }
    },
    backStateScene: function() {
        cc.director.runScene(new StartScene());
    },
    showProcessDialog: function() {
        var themeLayer = this.getChildByTag(LAYER_TAG.themes_layer);
        this.pauseTouchEvent();
        var layer = ThemeProcessDialog.create();
        this.addChild(layer);
    },
    startMapScene: function(flag) {
        this.getChildByTag(LAYER_TAG.themes_layer).startMapScene(flag);
    },
    pauseTouchEvent: function () {
        cc.eventManager.pauseTarget(this, true);
    },
    resumeTouchEvent: function () {
        cc.eventManager.resumeTarget(this, true);
    }
});
ThemeSelectLayer.create = function() {
    var layer = new ThemeSelectLayer();
    if(layer!=null && layer.init()) {
        return layer;
    }
    return null;
};
var ThemeSelectScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = ThemeSelectLayer.create();
        this.addChild(layer);
    }
});