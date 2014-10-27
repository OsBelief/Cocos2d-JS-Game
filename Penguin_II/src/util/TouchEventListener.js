/**
 * Created by yicha on 14-7-10.
 */
var TOUCH_COUNT = 0;    // 点击次数
var TouchEventListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: false,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
    onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件回调函数
        return true;
    },
    onTouchEnded: function (touch, event) {         // 点击事件结束处理
        TOUCH_COUNT++;
        var target = event.getCurrentTarget();
        // 第一次点击，进度条停止刷新，企鹅自由落体；第二次点击，熊挥杆
        if(TOUCH_COUNT == 1) {
            var penguinLayer = target.getChildByTag(300);
            var penguinSprite = penguinLayer.getChildByTag(3001);
            penguinSprite.playFreeFall();

            var backgroundLayer = target.getChildByTag(100);
            var bearSprite = backgroundLayer.getChildByTag(1001);
            bearSprite.readyBaseBall();
        }
        if(TOUCH_COUNT == 2) {
            var backgroundLayer = target.getChildByTag(100);
            var bearSprite = backgroundLayer.getChildByTag(1001);
            var penguinLayer = target.getChildByTag(300);
            var pressTimer = penguinLayer.getChildByTag(3002);
            pressTimer.stopAllActions();
            var penguinSprite = penguinLayer.getChildByTag(3001);
            bearSprite.playBaseBall(penguinSprite, pressTimer.getPercentage());
        }
    }
});