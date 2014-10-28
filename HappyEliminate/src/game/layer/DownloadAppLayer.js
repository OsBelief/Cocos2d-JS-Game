/**
 * Created by chengzhenhua on 14-10-23.
 */
var DownloadAppLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.download_plist);
        this.setColor(cc.color(0, 0, 0, 0));
        this.setOpacity(120);
        var winSize = WinSize;
        // 背景
        var bgSprite = new cc.Sprite("#download_menu.png");
        bgSprite.attr({
            x: winSize.width / 2,
            y: winSize.height / 2,
            scale: 0.8
        });
        this.addChild(bgSprite);
        // 返回
        var backSprite = new cc.Sprite("#download_back.png");
        var backLabel = new cc.LabelTTF("返  回", "Arial", 24);
        backLabel.attr({
            x: backSprite.width / 2,
            y: backSprite.height / 2
        });
        backSprite.addChild(backLabel);
        var backMenuItem = new cc.MenuItemSprite(backSprite, null, null, this.onClickBackBtn, this);
        backMenuItem.attr({
            x: backSprite.width / 2 - 210,
            y: backSprite.height / 2 + 100
        });
        // 玩的开心吧
        var title_1 = new cc.LabelTTF("玩的开心吧!", "Arial", 40);
        title_1.setColor(cc.color(155, 155, 155, 0));
        title_1.attr({
            x: winSize.width / 2,
            y: winSize.height / 2 + 50
        });
        this.addChild(title_1);
        // 更多精彩内容请下载官方App
        var title_2 = new cc.LabelTTF("更多精彩内容请下载官方app", "Arial", 24);
        title_2.setColor(cc.color(255, 38, 38, 0));
        title_2.attr({
            x: winSize.width / 2,
            y: winSize.height / 2 - 10
        });
        this.addChild(title_2);
        // Android下载
        var androidSprite = new cc.Sprite("#download_download.png");
        var androidLabel = new cc.LabelTTF("Android下载\n(56.9MB)", "Arial", 24, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        androidLabel.attr({
            x: androidSprite.width / 2,
            y: androidSprite.height / 2
        });
        androidSprite.addChild(androidLabel);
        var androidMenuItem = new cc.MenuItemSprite(androidSprite, null, null, this.downLoadFromAndroid, this);
        androidMenuItem.attr({
            x: -105,
            y: -100
        });
        // AppStore下载
        var appStoreSprite = new cc.Sprite("#download_download.png");
        var appStoreLabel = new cc.LabelTTF("App Store下载\n(36.4MB)", "Arial", 24, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        appStoreLabel.attr({
            x: appStoreSprite.width / 2,
            y: appStoreSprite.height / 2
        });
        appStoreSprite.addChild(appStoreLabel);
        var appStoreMenuItem = new cc.MenuItemSprite(appStoreSprite, null, null, this.downLoadFromIOS, this);
        appStoreMenuItem.attr({
            x: 105,
            y: -100
        });
        var menu = new cc.Menu(backMenuItem, androidMenuItem, appStoreMenuItem);
        menu.attr({
            x: winSize.width / 2,
            y: winSize.height / 2
        });
        this.addChild(menu);
    },
    onClickBackBtn: function () {

    },
    downLoadFromAndroid: function () {

    },
    downLoadFromIOS: function () {

    }
});
DownloadAppLayer.create = function () {
    var layer = new DownloadAppLayer();
    return layer;
};