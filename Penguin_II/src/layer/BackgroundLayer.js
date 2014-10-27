/**
 * Created by yicha on 14-7-14.
 */
var BackgroundLayer = cc.Layer.extend({
    size: null,
    bg_array: null,
    backgroundSprite_2: null,
    ctor:function (space) {
        this._super();
    },
    init: function() {
        this.removeAllChildren();
        this.size = cc.director.getWinSize();
        // 游戏场景开始时背景
        var backgroundSprite_1 = cc.Sprite.create(res.background);
        backgroundSprite_1.setPosition(this.size.width / 2, this.size.height / 2);
        backgroundSprite_1.tag = 1002;
        this.addChild(backgroundSprite_1, 0);
        this.bg_array = this.bg_array || new Array();   // 存储背景图层上的精灵
        this.bg_array = [];
        this.bg_array.push(backgroundSprite_1);
        this.backgroundSprite_2 = this.backgroundSprite_2 || cc.Sprite.create(res.background2);
        this.backgroundSprite_2.attr({
            x: this.size.width / 2,
            y: this.size.height / 2
        });
        this.addChild(this.backgroundSprite_2, -1);
    },
    move_Sprite: function(dx) {
        // 企鹅打飞时移动背景图层中的精灵
        var i = this.bg_array.length;
        while(i--) {
            var sp = this.bg_array[i];
            if(sp.x > this.size_width + 240) {
                this.bg_array.splice(i, 1); // 如果不在屏幕之内，则不再移动
                this.removeChild(sp);
            } else {
                sp.setPositionX(sp.x + dx);
            }
        }
    },
    load_milestone: function(score) {
        // 添加里程碑
        var milestone = cc.Sprite.create(res.milestone);
        milestone.setPosition(milestone.width, 90);
        // 显示分数
        var score_Label = cc.LabelTTF.create(score, "Arial", 14);
        score_Label.setColor(cc.color(0, 191, 255, 0));
        score_Label.setPosition(milestone.width + 10, 102);
        this.addChild(milestone, 1);
        this.addChild(score_Label, 1)
        this.bg_array.push(milestone);
        this.bg_array.push(score_Label);
    }
});
