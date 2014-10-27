/**
 * Created by chengzhenhua on 14-10-8.
 */
/**
 *  手把手教你消除
 */
var HelpLayer = cc.Layer.extend({
    eliminateLayer: null,
    fingerLayer: null,
    swapAnimals: [],
    selectedAnimal: null,
    beginXY: null,
    initWithAnimalsAndGuide: function (animals, guideIndex) {
        this.eliminateLayer = cc.Layer.create();    // 动物层
        this.fingerLayer = cc.Layer.create();   // 手指动画层
        for (var i = 0, len = animals.length; i < len; i++) {
            var originalAnimal = animals[i];
            var copyAnimal = AnimalSprite.createWithImageIndex(originalAnimal.animal_index);
            copyAnimal.tag = originalAnimal.tag;
            copyAnimal.setPosition(originalAnimal.getPosition());
            if (originalAnimal.swap != undefined && originalAnimal.swap === true) {
                copyAnimal.swap = originalAnimal.swap;
                copyAnimal.swapDirection = originalAnimal.swapDirection;
                this.swapAnimals.push(copyAnimal);
            }
            this.eliminateLayer.addChild(copyAnimal);
        }
        this.addChild(this.eliminateLayer);
        switch (guideIndex) {
            case GUIDE_INDEX.vertical:
                var beginPoint = cc.p(188, 480);
                var isVertical = true;
                this.playFingerEffect(beginPoint, isVertical);
                break;
        }
        // 添加事件监听器
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    /**
     * 手把手交换
     */
    playFingerEffect: function (beginPoint, isVertical) {
        // 手指
        var finger = cc.Sprite.create("#guide_hand_2.png");
        finger.setScale(0.8);
        finger.setPosition(beginPoint);
        this.fingerLayer.addChild(finger);
        this.addChild(this.fingerLayer);
        var moveAction = null;
        if (isVertical === true) {
            // 上下交换
            moveAction = cc.moveBy(0.8, cc.p(0, -44));
        } else {
            // 水平交换
            moveAction = cc.moveBy(0.8, cc.p(44, 0));
        }
        var moveFin = cc.callFunc(function () {
            finger.setVisible(false);
            finger.setPosition(beginPoint);
        }, this);
        var animFrames = [];
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("guide_hand_2.png"));
        animFrames.push(cc.spriteFrameCache.getSpriteFrame("guide_hand_1.png"));
        var animation = cc.Animation.create(animFrames, 0.2);
        var animate = cc.Animate.create(animation);
        var moveSequence = cc.sequence(animate, moveAction, moveFin);
        finger.runAction(moveSequence);
        this.schedule(function () {
            finger.setVisible(true);
            finger.runAction(moveSequence);
        }, 3);
    },
    onTouchBegan: function (touch, event) {
        var _this = event.getCurrentTarget();
        var touchXY = _this.beginXY =  touch.getLocation();
        var firstAnimal = _this.swapAnimals[0];
        var secondAnimal = _this.swapAnimals[1];
        var firstRect = cc.rect(firstAnimal.x - firstAnimal.width / 2, firstAnimal.y - firstAnimal.height / 2, firstAnimal.width, firstAnimal.height);
        var secondRect = cc.rect(secondAnimal.x - secondAnimal.width / 2, secondAnimal.y - secondAnimal.height / 2, secondAnimal.width, secondAnimal.height);
        if (_this.selectedAnimal === null) {
            if (cc.rectContainsPoint(firstRect, touchXY)) {
                _this.selectedAnimal = firstAnimal;
            }
            if (cc.rectContainsPoint(secondRect, touchXY)) {
                _this.selectedAnimal = secondAnimal;
            }
            if (_this.selectedAnimal != null) {
                _this.selectedAnimal.displayLightRing();
            }
        } else {
            var currentAnimal = null;
            if (cc.rectContainsPoint(firstRect, touchXY)) {
                currentAnimal = firstAnimal;
            }
            if (cc.rectContainsPoint(secondRect, touchXY)) {
                currentAnimal = secondAnimal;
            }
            if (currentAnimal != null) {
                /**
                 * 交换情况一：
                 * 两次点击的动物是相邻的两个
                 */
                if (currentAnimal.tag != _this.selectedAnimal.tag) {
                    _this.getParent().finishOneGuide(_this.selectedAnimal.tag, currentAnimal.tag);
                    _this.selectedAnimal.removeChildByTag(SPRITE_TAG.animal_light_ring);
                    _this.selectedAnimal = null;
                    cc.eventManager.removeListeners(_this, true);
                    _this.removeFromParent();
                }
            }
        }
        return true;
    },
    onTouchEnded: function (touch, event) {
        var _this = event.getCurrentTarget();
        var touchXY = touch.getLocation();
        /**
         * 交换情况二：
         * 拖动交换相邻的两个动物
         */
        if (_this.selectedAnimal != null) {
            switch(_this.selectedAnimal.swapDirection) {
                case "up":
                    if(touchXY.y - _this.beginXY.y > 10) {
                        _this.selectedAnimal.removeChildByTag(SPRITE_TAG.animal_light_ring);
                        _this.selectedAnimal = null;
                        _this.getParent().finishOneGuide(_this.swapAnimals[0].tag, _this.swapAnimals[1].tag);
                        _this.removeFromParent();
                    }
                    break;
                case "down":
                    if(_this.beginXY.y - touchXY.y > 10) {
                        _this.selectedAnimal.removeChildByTag(SPRITE_TAG.animal_light_ring);
                        _this.selectedAnimal = null;
                        _this.getParent().finishOneGuide(_this.swapAnimals[0].tag, _this.swapAnimals[1].tag);
                        _this.removeFromParent();
                    }
                    break;
                case "left":
                    break;
                case "right":
                    break;
            }
        }
    }
});
HelpLayer.createWithAnimalsAndGuide = function (animals, guideIndex) {
    var layer = new HelpLayer();
    layer.initWithAnimalsAndGuide(animals, guideIndex);
    return layer;
};

