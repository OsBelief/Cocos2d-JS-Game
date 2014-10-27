/**
 * Created by yicha on 14-8-22.
 */
var ReliveDialog = cc.LayerColor.extend({
    init: function () {
        if (this._super()) {
            var bgSprite = cc.Sprite.create(res.message_frame);
            bgSprite.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2
            });
            this.addChild(bgSprite);
            var messageLabel = cc.LabelTTF.create("Game Over,你退出后冒险就会从头开始!想继续挑战" +
                    "请在本界面点击复活道具.你确定要退出吗?", "Arial"
                , 34, cc.size(450, 320));
            messageLabel.setColor(cc.color(255, 69, 0, 0));
            messageLabel.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2 - 60
            });
            this.addChild(messageLabel);
            var btnSprite = cc.Sprite.create(res.message_btn_base);
            var btnLabel = cc.LabelTTF.create("确定", "Arial", 42);
            btnLabel.attr({
                x: btnSprite.width / 2,
                y: btnSprite.height / 2
            });
            btnSprite.addChild(btnLabel);
            var btnMenuItem = cc.MenuItemSprite.create(btnSprite,
                null, null, this.intoStartScene, this);
            btnMenuItem.attr({
                x: -80,
                y: -100
            });
            var noSprite = cc.Sprite.create(res.message_btn_base);
            var noLabel = cc.LabelTTF.create("取消", "Arial", 42);
            noLabel.attr({
                x: noSprite.width / 2,
                y: noSprite.height / 2
            });
            noSprite.addChild(noLabel);
            var noMenuItem = cc.MenuItemSprite.create(noSprite,
                null, null, this.removeDialog, this);
            noMenuItem.attr({
                x: 80,
                y: -100
            });
            var menu = cc.Menu.create([btnMenuItem, noMenuItem]);
            this.addChild(menu);
            this.setColor(cc.color(0, 0, 0, 0));
            this.setOpacity(180);
            return true;
        }
    },
    intoStartScene: function() {
        this.getParent().resetThemeProcess();
    },
    removeDialog: function() {
        this.getParent().resumeTouchEvent();
        this.removeFromParent();
    }
});
ReliveDialog.create = function () {
    var layer = new ReliveDialog();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};