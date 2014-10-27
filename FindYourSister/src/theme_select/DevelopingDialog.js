/**
 * Created by yicha on 14-8-22.
 */
// 显示当前主题不可用
var DevelopingDialog = cc.LayerColor.extend({
    init: function () {
        if (this._super()) {
            var bgSprite = cc.Sprite.create(res.message_frame);
            bgSprite.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2
            });
            this.addChild(bgSprite);
            var messageLabel = cc.LabelTTF.create("正在制作之中,请耐心等待!", "Arial", 36);
            messageLabel.setColor(cc.color(255, 69, 0, 0));
            messageLabel.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2
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
                null, null, this.removeDialog, this);
            btnMenuItem.attr({
                x: 0,
                y: -100
            });
            var menu = cc.Menu.create([btnMenuItem]);
            this.addChild(menu);
            this.setColor(cc.color(0, 0, 0, 0));
            this.setOpacity(180);
            return true;
        }
    },
    removeDialog: function() {
        this.getParent().getParent().resumeTouchEvent();
        this.removeFromParent();
    }
});
DevelopingDialog.create = function () {
    var layer = new DevelopingDialog();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};