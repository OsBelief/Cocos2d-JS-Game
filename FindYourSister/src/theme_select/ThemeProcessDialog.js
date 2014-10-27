/**
 * Created by yicha on 14-8-22.
 */
var ThemeProcessDialog = cc.LayerColor.extend({
    init: function () {
        if (this._super()) {
            var bgSprite = cc.Sprite.create(res.message_frame);
            bgSprite.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2
            });
            this.addChild(bgSprite);
            var messageLabel = cc.LabelTTF.create("检测到当前有进度记录,进入哪个?(新开关卡将会覆盖当前进度)", "Arial",
                34, cc.size(450, 240));
            messageLabel.setColor(cc.color(255, 69, 0, 0));
            messageLabel.setAnchorPoint(cc.p(0, 0.5));
            messageLabel.attr({
                x: WinSize.width / 2 - bgSprite.width / 2 + 36,
                y: WinSize.height / 2 - 36
            });
            this.addChild(messageLabel);
            var btnSprite = cc.Sprite.create(res.message_btn_base);
            btnSprite.setScaleX(1.8);
            var btnMenuItem = cc.MenuItemSprite.create(btnSprite,
                null, null, this.continueProcess, this);
            btnMenuItem.attr({
                x: -46,
                y: -60
            });

            var btnReStart = cc.Sprite.create(res.message_btn_base);
            btnReStart.setScaleX(1.8);
            var restartMenuItem = cc.MenuItemSprite.create(btnReStart,
                null, null, this.restartProcess, this);
            restartMenuItem.attr({
                x: -46,
                y: -135
            });
            var menu = cc.Menu.create([btnMenuItem, restartMenuItem]);
            this.addChild(menu);
            var btnLabel = cc.LabelTTF.create("继续原有进度", "Arial", 32);
            btnLabel.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2 - 60
            });
            this.addChild(btnLabel);
            var restartLabel = cc.LabelTTF.create("新开关卡", "Arial", 32);
            restartLabel.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2 - 135
            });
            this.addChild(restartLabel);
            this.setColor(cc.color(0, 0, 0, 0));
            this.setOpacity(180);
            return true;
        }
    },
    continueProcess: function () {
        this.getParent().startMapScene(false);
        this.removeFromParent();
    },
    restartProcess: function (themeIndex) {
        this.getParent().startMapScene(true);
        this.removeFromParent();
    }
});
ThemeProcessDialog.create = function () {
    var layer = new ThemeProcessDialog();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};