/**
 * Created by yicha on 14-8-5.
 */
// 帮助图层
var HelpLayer = cc.LayerColor.extend({
    tutorials: null,
    currentIndex: 0,
    rightArrow: null,
    leftArrow: null,
    tutorialSprite: null,
    confirmButton: null,
    init: function () {
        if (this._super()) {
            // 帮助精灵
            this.tutorials = [];
            var texture1 = cc.textureCache.addImage(res.start_tutorial_1);
            this.tutorials.push(cc.SpriteFrame.create(texture1, cc.rect(0, 0, 512, 400)));
            var texture2 = cc.textureCache.addImage(res.start_tutorial_2);
            this.tutorials.push(cc.SpriteFrame.create(texture2, cc.rect(0, 0, 512, 400)));
            var texture3 = cc.textureCache.addImage(res.start_tutorial_3);
            this.tutorials.push(cc.SpriteFrame.create(texture3, cc.rect(0, 0, 512, 400)));
            var texture4 = cc.textureCache.addImage(res.start_tutorial_4);
            this.tutorials.push(cc.SpriteFrame.create(texture4, cc.rect(0, 0, 512, 400)));
            var texture5 = cc.textureCache.addImage(res.start_tutorial_5);
            this.tutorials.push(cc.SpriteFrame.create(texture5, cc.rect(0, 0, 512, 400)));
            this.tutorialSprite = cc.Sprite.create(texture1);
            this.tutorialSprite.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2,
                scale: 1.5
            });
            this.addChild(this.tutorialSprite);
            // 左箭头
            this.leftArrow = cc.MenuItemSprite.create(cc.Sprite.create(res.button_end_menu)
                , null, null, this.onClickLeftArrow, this);

            this.leftArrow.attr({
                x: -440,
                y: 0
            });
            this.leftArrow.setVisible(false);
            // 右箭头
            this.rightArrow = cc.MenuItemSprite.create(cc.Sprite.create(res.button_end_continue)
                , null, null, this.onClickRightArrow, this);
            this.rightArrow.attr({
                x: 440,
                y: 0
            });
            // 确定按钮
            this.confirmButton = cc.MenuItemSprite.create(cc.Sprite.create(res.btn_OK)
                , null, null, this.onClickConfirmBtn, this);
            this.confirmButton.attr({
                x: 440,
                y: 0
            });
            this.confirmButton.setVisible(false);
            this.confirmButton.setEnabled(false);
            var menu = cc.Menu.create([this.leftArrow, this.rightArrow, this.confirmButton]);
            this.addChild(menu);
            this.setColor(cc.color(0, 0, 0, 0));
            this.setOpacity(180);
            return true;
        }
    },
    onClickLeftArrow: function () {
        // 点击左箭头
        this.currentIndex--;
        this.tutorialSprite.setSpriteFrame(this.tutorials[this.currentIndex]);
        if (this.currentIndex === 0) {
            this.leftArrow.setVisible(false);
        }
        if(this.rightArrow.isVisible() === false) {
            this.rightArrow.setVisible(true);
            this.rightArrow.setEnabled(true);
            this.confirmButton.setVisible(false);
            this.confirmButton.setEnabled(false);
        }
    },
    onClickRightArrow: function () {
        // 点击右箭头
        this.currentIndex++;
        this.tutorialSprite.setSpriteFrame(this.tutorials[this.currentIndex]);
        this.leftArrow.setVisible(true);
        if(this.currentIndex === 4){
            this.confirmButton.setVisible(true);
            this.confirmButton.setEnabled(true);
            this.rightArrow.setVisible(false);
            this.rightArrow.setEnabled(false);
        }
    },
    onClickConfirmBtn: function () {
        cc.eventManager.resumeTarget(this.getParent(), true);
        // 帮助菜单消失
        this.stopAllActions();
        var action = cc.MoveTo.create(FRAME_RATE.start_helper_move, cc.p(this.width / 2, 0));
        var _this = this;
        var actionFin = cc.CallFunc.create(function() {
            _this.removeFromParent();
            // 注册用户
            var player = {
                endlessModeRecord: 0,
                coinNumber: 500,
                personalSkill: [
                    {
                        skillName: "eye",
                        detail: "火眼金睛:帮你找到一个目标",
                        availableNumber: 5,
                        price: 200
                    },
                    {
                        skillName: "time",
                        detail: "时间机器:给你加上30秒额外时间",
                        availableNumber: 5,
                        price: 300
                    },
                    {
                        skillName: "brush",
                        detail: "强力扫把:帮你清除当前一切干扰物",
                        availableNumber: 5,
                        price: 150
                    },
                    {
                        skillName: "relive",
                        detail: "复活药水:故事模式失败后复活,重新挑战当前关卡",
                        availableNumber: 3,
                        price: 500
                    }
                ],
                leaveTheme: 3,
                themes: [
                    {
                        islock: false,
                        themeName: "",
                        themeImage: "theme_0",
                        currentProcess: 1
                    },
                    {
                        islock: false,
                        themeName: "致青春",
                        themeImage: "theme_1",
                        currentProcess: 1
                    },
                    {
                        islock: false,
                        themeName: "无尽模式",
                        themeImage: "theme_2",
                        currentProcess: 0
                    },
                    {
                        islock: false,
                        themeName: "冰雪世界",
                        themeImage: "theme_3",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_4",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_5",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_6",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_7",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_8",
                        currentProcess: 1
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_9",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_10",
                        currentProcess: 1
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_11",
                        currentProcess: 1
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_12",
                        currentProcess: 1
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_13",
                        currentProcess: 1
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_14",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_15",
                        currentProcess: 0
                    },
                    {
                        themeName: "冰雪世界",
                        islock: true,
                        themeImage: "theme_16",
                        currentProcess: 0
                    }
                ]
            };
            var localStorageUtil = LocalStorageUtil.getInstance();
            localStorageUtil.setNewPlayer(player);
        });
        this.runAction(cc.Sequence.create([action, actionFin]));
    }
});
HelpLayer.create = function () {
    var layer = new HelpLayer();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};