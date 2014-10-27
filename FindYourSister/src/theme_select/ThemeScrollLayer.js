/**
 * Created by yicha on 14-8-7.
 */
// 主题滚动的效果
var ThemeScrollLayer = cc.Layer.extend({
    theme_array: null,
    current_Index: null,
    lightSprite: null,
    themeNameLabel: null,
    cur_theme: null,
    touchStartX: null,
    touchMoveX: null,
    chosen_index: null,
    localStorageUtil: null,
    currentProcessLabel: null,
    init: function () {
        if (this._super()) {
            // 初始化动画图层
            cc.spriteFrameCache.addSpriteFrames(res.themeselect_theme_plist);
            this.theme_array = [];
            this.localStorageUtil = LocalStorageUtil.getInstance();
            var themes = this.localStorageUtil.getAllThemes();
            this.current_Index = localStorageUtil.getLeaveThemeIndex();
            for (var i = 0; i < themes.length; i++) {
                var sprite = ThemeSprite.createWithTheme(themes[i]);
                // 设置当前默认选中的主题
                if (i < this.current_Index) {
                    sprite.attr({
                        x: 480 - (this.current_Index - i) * 450,
                        y: 480
                    });
                }
                if (i === this.current_Index) {
                    sprite.attr({
                        x: 480,
                        y: 480
                    });
                }
                if (i > this.current_Index) {
                    sprite.attr({
                        x: 480 + (i - this.current_Index) * 450,
                        y: 480
                    });
                }
                this.theme_array.push(sprite);
                this.addChild(sprite);
            }
            this.cur_theme = this.theme_array[this.current_Index];
            this.cur_theme.setThemeImage(0);
            // 灯光
            this.lightSprite = cc.Sprite.create("#ppt_light_alpha.png");
            this.lightSprite.attr({
                x: WinSize.width / 2 + 23,
                y: 175
            });
            var sp = cc.Sprite.create("#light_alpha.png");
            sp.attr({
                x: 65,
                y: 380
            });
            this.lightSprite.addChild(sp);
            this.addChild(this.lightSprite);
            // 主题名称
            var themeName = this.cur_theme.getThemeName();
            this.themeNameLabel = cc.LabelTTF.create(themeName, "Arial", 36);
            this.themeNameLabel.attr({
                x: WinSize.width / 2,
                y: WinSize.height / 2 - 30
            });
            this.addChild(this.themeNameLabel);
            // 该主题的当前进度
            var currentProcess = this.cur_theme.getCurrentProcess();
            if (currentProcess != null) {
                this.currentProcessLabel = cc.LabelTTF.create("当前进度,第" + currentProcess + "关", "Arial", 24);
                this.currentProcessLabel.setColor(cc.color(255, 0, 0, 0));
                this.currentProcessLabel.attr({
                    x: WinSize.width / 2,
                    y: WinSize.height / 2 - 70
                });
                this.addChild(this.currentProcessLabel);
            }
            // 添加事件监听器
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded
            }, this);
            return true;
        }
    },
    onTouchBegan: function (touch, event) {
        if(touch.getLocationY() < 120) {
            return false;
        } else {
            var target = event.getCurrentTarget();
            target.lightSprite.setVisible(false);
            if (target.cur_theme.islock === false) {
                target.cur_theme.setThemeImage(1);
            } else {
                target.cur_theme.setThemeImage(2);
            }
            for (var i = 0; i < target.theme_array.length; i++) {
                var sp = target.theme_array[i];
                var rect = cc.rect(sp.x - sp.width / 2, sp.y - sp.height / 2, sp.width, sp.height);
                if (cc.rectContainsPoint(rect, touch.getLocation())) {
                    target.chosen_index = i;
                    break;
                }
            }
            target.touchStartX = touch.getLocationX();
            target.touchMoveX = touch.getLocationX();
            return true;
        }
    },
    onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset = target.touchMoveX - touchPoint.x;
        if (Math.abs(offset) > 10) {
            target.scrollTheme(offset);
            target.touchMoveX = touchPoint.x;
        }
    },
    onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var sp = target.cur_theme;
        target.handleTouchEndedLogic(touch.getLocationX());
    },
    scrollTheme: function (offset) {
        for (var i = 0; i < this.theme_array.length; i++) {
            var sp = this.theme_array[i];
            sp.x += -offset;
        }
    },
    handleTouchEndedLogic: function (x) {
        var offset = this.touchStartX - x;
        if (offset < -10 && this.current_Index > 0) {
            this.current_Index--;
        }
        if (offset > 10 && this.current_Index < 16) {
            this.current_Index++;
        }
        this.cur_theme = this.theme_array[this.current_Index];
        // 调整位置
        var dx = this.cur_theme.x - 480;
        this.themeNameLabel.setString("");
        if (this.currentProcessLabel != null) {
            this.currentProcessLabel.setString("");
        }
        for (var i = 0; i < this.theme_array.length; i++) {
            var sp = this.theme_array[i];
            var action = cc.MoveBy.create(0.1, cc.p(-dx, 0));
            var _this = this;
            var actionFin = cc.CallFunc.create(function () {
                _this.lightSprite.setVisible(true);
                if (_this.cur_theme.islock === false) {
                    _this.cur_theme.setThemeImage(0);
                } else {
                    _this.cur_theme.setThemeImage(2);
                }
                _this.themeNameLabel.setString(_this.cur_theme.getThemeName());
                if (_this.currentProcessLabel != null) {
                    var currentProcess = _this.cur_theme.getCurrentProcess();
                    if (currentProcess != null) {
                        _this.currentProcessLabel.setString("当前进度,第" + currentProcess + "关");
                    }
                }
            });
            sp.runAction(cc.Sequence.create([action, actionFin]));
        }
        // 进入地图场景
        if (this.chosen_index === this.current_Index && this.cur_theme.islock === false) {
            if (this.current_Index === 1) {
                var layer = DevelopingDialog.create();
                this.addChild(layer);
                this.getParent().pauseTouchEvent();
            }
            if (this.current_Index === 2) {
                var layer = DevelopingDialog.create();
                this.addChild(layer);
                this.getParent().pauseTouchEvent();
            }
            if (this.current_Index >= 3) {
                if(this.currentProcessLabel != null) {
                    this.getParent().showProcessDialog();
                } else {
                    this.startMapScene(false);
                }
            }
        }
    },
    startMapScene: function(is_restart) {
        if(is_restart === true) {
            var localStorageUtil = LocalStorageUtil.getInstance();
            localStorageUtil.setRestartProcess(this.current_Index);
        }
        var common_resource = theme_map_common_resources;
        var theme_map_resource = window["theme_map_" + this.current_Index + "_resources"];  // 全局对象都是window对象的属性
        var resource = common_resource.concat(theme_map_resource);
        var _this = this;
        LoaderScene.preload(resource, function () {
            var scene = ThemeMapScene.createWithThemeIndex(_this.current_Index);
            cc.director.runScene(scene);
            _this.localStorageUtil.setLeaveTheme(_this.current_Index);
        });
    }
});
ThemeScrollLayer.create = function () {
    var layer = new ThemeScrollLayer();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};