/**
 * Created by yicha on 14-8-13.
 */
// 散落的东西层
var ThingsLayer = cc.Layer.extend({
    regionXY: null,
    rightThings: null,
    thingSprite_array: null,
    touchMoveX: null,
    touchBeingX: null,
    touchThing: null,
    imageSets: null,
    texture_array: null,
    rightBoundary: 0,
    initWithThingsAndImgData: function (things, imgData) {
        this.imageSets = imgData["data"]["Imageset"];
        this.regionXY = cc.p(0, 72);
        this.rightThings = [];  // 存储最右边的东西，以确定下一列的摆放
        this.tempRightThings = [];
        this.thingSprite_array = [];    // 存放东西精灵的数组
        // 加载纹理图
        this.texture_array = [];
        this.texture_array.push(cc.textureCache.addImage(res.things_1_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_2_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_3_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_4_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_5_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_6_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_7_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_8_1));
        this.texture_array.push(cc.textureCache.addImage(res.things_9_1));
        this.createLittleThing(this.texture_array, things, imgData);
        // 添加事件监听器
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        this.tag = LAYER_TAG.things_layer;
    },
    getThingRect: function (thing) {
        var thingIndex = thing.thingIndex;
//        cc.log(thingIndex);
        var items = thingIndex.split("_");
        var textureIndex = parseInt(items[0].slice(1), 10) - 1;
        var imageSet = this.imageSets[textureIndex];
        var imageSetHeight = parseInt(imageSet["-Height"], 10);
        var imageSetWidth = parseInt(imageSet["-Width"], 10);
        var images = imageSet["Image"];
        var image = images[parseInt(items[1], 10)];
        var x = parseInt(image["-XPos"], 10) / imageSetWidth * 1024;
        var y = parseInt(image["-YPos"], 10) / imageSetHeight * 1024;
        var w = parseInt(image["-Width"], 10) / imageSetWidth * 1024;
        var h = parseInt(image["-Height"], 10) / imageSetHeight * 1024;
        if (x + w > 1024) {
            w = 1024 - x;
        }
        if (y + h > 1024) {
            h = 1024 - y;
        }
        return{textureIndex: textureIndex, x: x, y: y, w: w, h: h};
    },
    createLittleThing: function (textures, things, imgData) {
        var len = things.length;
        for (var i = 0; i < len; i++) {
            var thing = things[i];
            var rect = this.getThingRect(thing);
            var frame = cc.SpriteFrame.create(textures[rect.textureIndex], cc.rect(rect.x, rect.y, rect.w, rect.h));
            var sprite = ThingSprite.createWithProperty(i, thing.tagName);
            sprite.initWithSpriteFrame(frame);
            sprite.setAnchorPoint(cc.p(0, 0));
            // 测试
//            var label = cc.LabelTTF.create(thing.thingIndex, "Arial", "24");
//            label.attr({
//                x: sprite.width / 2,
//                y: sprite.height / 2
//            });
//            sprite.addChild(label);
            this.thingSprite_array.push(sprite);
        }
        for (var i = 0; i < this.thingSprite_array.length; i++) {
            this.placeThing(this.thingSprite_array[i], i);
        }
    },
    changeRightBoundary: function(sprite) {
        var x = sprite.x + sprite.width;
        if(x > this.rightBoundary) {
            this.rightBoundary = x;
        }
    },
    /**
     * 摆放位置
     * @param sprite
     */
    placeThing: function (sprite, i) {
        // 从下到上，从左到右
        if (this.regionXY.y + sprite.height > 576) {
            var flag = false;
            // 从后面找出可以放的下的东西
            for (var j = i + 1; j < this.thingSprite_array.length; j++) {
                var sp = this.thingSprite_array[j];
                if (this.regionXY.y + sp.height < 576) {
                    flag = true;
                    // 交换
                    var temp = this.thingSprite_array[j];
                    this.thingSprite_array[j] = sprite;
                    this.thingSprite_array[j].tag = i;
                    this.thingSprite_array[i] = temp;
                    this.thingSprite_array[i].tag = j;
                    sprite = temp;
                    break;
                }
            }
            if (flag === false) {
                this.regionXY.y = 72;
                this.rightThings = this.tempRightThings;
                this.tempRightThings = [];
            }
        }
        var x = this.determineX(this.regionXY.y, this.regionXY.y + sprite.height);
        sprite.attr({
            x: x,
            y: this.regionXY.y
        });
        this.tempRightThings.push(sprite);  // 缓存最右边的东西
        this.regionXY.y += sprite.height + 10;  // 10是间距
        this.addChild(sprite);
        this.changeRightBoundary(sprite);
    },
    determineX: function (y1, y2) {
        var max_X = 0;
        // 可以影响这个东西放置位置的东西
        var len = this.rightThings.length;
        for (var i = 0; i < len; i++) {
            var thing = this.rightThings[i];
            if ((thing.y >= y1 && thing.y <= y2) || ((thing.y + thing.height) >= y1 && (thing.y + thing.height <= y2))
                || (thing.y <= y1 && (thing.y + thing.height) >= y2)) {
                var x = thing.x + thing.width;
                if (x > max_X) {
                    max_X = x;
                }
            }
        }
        if (max_X === 0 && len != 0) {
            // 如果该东西的左边没有东西,一般是最上面，所以取最上面的
            max_X = this.rightThings[len - 1].x;
        }
        max_X += 10;
        return max_X;
    },
    onTouchBegan: function (touch, event) {
        cc.log("x: " + touch.getLocationX() + " , y: " + touch.getLocationY());
        var target = event.getCurrentTarget();
        var targetY = touch.getLocationY();
        if (targetY >= 580 || targetY <= 60) {
            return false;
        }
        target.touchMoveX = touch.getLocationX();
        target.touchLayerX = target.x;
        for (var i = 0; i < target.thingSprite_array.length; i++) {
            var sp = target.thingSprite_array[i];
            var rect = cc.rect(target.x + sp.x, target.y + sp.y, sp.width, sp.height);
            if (cc.rectContainsPoint(rect, touch.getLocation())) {
                target.touchThing = sp;
                target.touchBeingX = touch.getLocationX();
                break;
            }
        }
        return true;
    },
    onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset = target.touchMoveX - touchPoint.x;
        if (Math.abs(offset) > 10) {
            target.x -= offset;
            target.touchMoveX = touchPoint.x;
        }
    },
    onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var leftSprite = target.thingSprite_array[0];
        // 检测左边界
        if (target.x > 0) {
            target.x = 0;
        }
        // 检测右边界
        if (target.x + target.rightBoundary < 960) {
            target.x = 960 - target.rightBoundary;
        }
        // 判断点击前后是否是同一个精灵
        var touchEndThing = null;
        for (var i = 0; i < target.thingSprite_array.length; i++) {
            var sp = target.thingSprite_array[i];
            var rect = cc.rect(target.x + sp.x, target.y + sp.y, sp.width, sp.height);
            if (cc.rectContainsPoint(rect, touch.getLocation())) {
                touchEndThing = sp;
                break;
            }
        }
        if (touchEndThing != null && target.touchThing != null && touchEndThing === target.touchThing) {
            // 排除滑动的情况
            var dx = Math.abs(target.touchBeingX - (touchEndThing.x + target.x));
            if (dx < 100) {
                target.checkTouchThing();
            }
        }
    },
    checkTouchThing: function () {
        // 检测点击的是否是任务要求的
        var scene = this.getParent();
        var targets = scene.checkPointTask.targets;
        var flag = this.touchThing.isTaskContain(targets);
        var p = cc.p(this.x + this.touchThing.x + this.touchThing.width / 2,
                this.y + this.touchThing.y + this.touchThing.height / 2);
        if (flag === true) {
            // 点击正确
            scene.touchSuccess(p, this.touchThing);
        } else {
            // 点击失败
            scene.touchFailure(p);
        }
    },
    addNewThing: function (oldThing, index) {
        // 东西点击正确后在原来位置添加新的东西
        var task = this.getParent().checkPointTask;
        var otherThings = task.otherThings;
        var things = task.things;
        var randomArray = noRepeatRandom(otherThings.length);
        while (true) {
            var newThingIndex = randomArray.pop();
            var newThing = otherThings[newThingIndex];
            var rect = this.getThingRect(newThing);
            if (oldThing.width + 10 >= rect.w && oldThing.height + 10 >= rect.h) {
                var frame = cc.SpriteFrame.create(this.texture_array[rect.textureIndex], cc.rect(rect.x, rect.y, rect.w, rect.h));
                var sprite = ThingSprite.createWithProperty(index, newThing.tagName);
                sprite.initWithSpriteFrame(frame);
                sprite.setAnchorPoint(0, 0);
                sprite.attr({
                    x: oldThing.x - oldThing.width / 2,
                    y: oldThing.y - oldThing.height / 2
                });
                this.thingSprite_array.splice(index, 1, sprite);
                this.addChild(sprite);
                this.changeRightBoundary(sprite);
                // 更新原有任务列表
                otherThings.splice(newThingIndex, 1);
                things.splice(index, 1, newThing);
                break;
            }
        }
    },
    pauseEventResponse: function () {
        cc.eventManager.pauseTarget(this, true);
    },
    resumeEventResponse: function () {
        cc.eventManager.resumeTarget(this, true);
    }
});
ThingsLayer.createWithThingsAndImgData = function (things, imgData) {
    var layer = new ThingsLayer();
    layer.initWithThingsAndImgData(things, imgData);
    return layer;
};