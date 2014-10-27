/**
 * Created by chengzhenhua on 14-9-28.
 */
/**
 * 消除精灵类
 * @type {Function}
 */
var AnimalSprite = cc.Sprite.extend({
    animal_index: null,
    eliminate_type: 0,
    ctor: function(index) {
        this._super();
        this.initWithImageIndex(index);
    },
    initWithImageIndex: function(index) {
        this.animal_index = index;
        this.initWithSpriteFrameName("animal_" + index + ".png");
    },
    /**
     * 要使用对象缓冲池的话要实现以下两个方法
     */
    unuse: function () {
        this.animal_index = null;
        this.eliminate_type = 0;
        this.setVisible(false);
        this.removeFromParent(true);
    },
    reuse: function (index) {
        this.initWithImageIndex(index);
        this.setVisible(true);
    },
    /**
     * 显示主角光环
     */
    displayLightRing: function () {
        this.stopAllActions();
        var selectedLight = cc.Sprite.create("#tile_select_0000.png");
        selectedLight.tag = SPRITE_TAG.animal_light_ring;
        selectedLight.attr({
            x: 22 - (44 - this.width) / 2,
            y: 22 - (44 - this.height) / 2
        });
        this.addChild(selectedLight);
        var animFrames = [];
        for (var i = 0; i < 30; i++) {
            if (i < 10) {
                animFrames.push(cc.spriteFrameCache.getSpriteFrame("tile_select_000" + i + ".png"));
            } else {
                animFrames.push(cc.spriteFrameCache.getSpriteFrame("tile_select_00" + i + ".png"));
            }
        }
        var animation = cc.Animation.create(animFrames, 0.1);
        var animate = cc.Animate.create(animation);
        animate.tag = ACTION_TAG.animal_light_ring;
        selectedLight.runAction(cc.RepeatForever.create(animate));
    },
    /**
     *  表征直线特效
     */
    makeUpLineEffect: function () {
        var animalName = null;
        switch (this.animal_index) {
            case 1:
                animalName = "horse";
                break;
            case 2:
                animalName = "frog";
                break;
            case 3:
                animalName = "bear";
                break;
            case 4:
                animalName = "cat";
                break;
            case 5:
                animalName = "fox";
                break;
            case 6:
                animalName = "chicken";
                break;
        }
        var animFrames = [];
        if(this.eliminate_type === ELIMINATE_TYPE.line_eliminate) {
            animalName = animalName + "_line_"; // 行
        }
        if(this.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
            animalName = animalName + "_column_"; // 列
        }
        for (var i = 0; i < 10; i++) {
            animFrames.push(cc.spriteFrameCache.getSpriteFrame(animalName + i + ".png"));
        }
        var animation = cc.Animation.create(animFrames, 0.1);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
    },
    /**
     * 提示时左右摇摆
     */
    showShakePrompt: function() {
        var tempPosition = this.getPosition();
        var leftMove = cc.moveBy(0.3, cc.p(-3, 0));
        var rightMove = cc.moveTo(0.3, tempPosition);
        this.stopAllActions();
        this.runAction(cc.repeat(cc.sequence(leftMove, rightMove), 3));
    }
});
AnimalSprite.createWithImageIndex = function (index) {
    var sp = new AnimalSprite(index);
    return sp;
};