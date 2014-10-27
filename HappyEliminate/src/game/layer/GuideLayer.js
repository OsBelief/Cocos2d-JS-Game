/**
 * Created by chengzhenhua on 14-9-29.
 */
/**
 * 指导层
 * @type {Function}
 */
var GuideLayer = cc.LayerColor.extend({
    initWithGuideIndex: function (guideIndex) {
        cc.spriteFrameCache.addSpriteFrames(res.guide_elem_plist);
        this.setColor(cc.color(0, 0, 0, 0));
        this.setOpacity(0);
        this.runAction(cc.fadeTo(1, 150));  // 由亮变暗
        switch (guideIndex) {
            case GUIDE_INDEX.vertical:
                this.setVerticalGuide();
                break;
        }
    },
    /**
     * 垂直指导
     * @param attr
     */
    setVerticalGuide: function () {
        // 左边的框(九宫格的使用)
        var spriteTmp = cc.Sprite.create("#guide_rect.png");
        var spriteSize = spriteTmp.getContentSize();
        var capInsets = cc.rect(32, 32, spriteSize.width - 64, spriteSize.height - 64);
        var scale9sprite = cc.Scale9Sprite.createWithSpriteFrameName("guide_rect.png", capInsets);
        scale9sprite.setContentSize(spriteSize.width * 3, spriteSize.height * 1.3);
        scale9sprite.attr({
            x: 210,
            y: 250
        });
        this.addChild(scale9sprite);
        // 右边的圆
        var circleSprite = cc.Sprite.create("#guide_circle.png");
        circleSprite.attr({
            x: 350,
            y: 250
        });
        this.addChild(circleSprite);
        // 指导的内容
        var guideContent = cc.LabelBMFont.create("向下拖动        ，\n交换        与下方        ，\n三只青蛙相连即可消除。", res.tutorial_fnt);
        guideContent.attr({
            x: 160,
            y: 260
        });
        this.addChild(guideContent);
        // 在指导的内容中嵌入动物
        var animal_1 = AnimalSprite.createWithImageIndex(2);
        animal_1.attr({
            x: 155,
            y: 290,
            scale: 0.9
        });
        this.addChild(animal_1);
        var animal_2 = AnimalSprite.createWithImageIndex(2);
        animal_2.attr({
            x: 108,
            y: 262,
            scale: 0.9
        });
        this.addChild(animal_2);
        var animal_3 = AnimalSprite.createWithImageIndex(6);
        animal_3.attr({
            x: 225,
            y: 262,
            scale: 0.9
        });
        this.addChild(animal_3);
        // 小浣熊
        var huanxiong = cc.Sprite.create(res.xiaohuanxiong_png);
        huanxiong.attr({
            x: 360,
            y: 258,
            scale: 1.2,
            rotationY: 180
        });
        this.addChild(huanxiong);
    }
});
GuideLayer.createWithGuideIndex = function (guideIndex) {
    var guideLayer = new GuideLayer();
    guideLayer.initWithGuideIndex(guideIndex);
    return guideLayer;
};