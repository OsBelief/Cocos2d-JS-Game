var ListViewLayer = cc.Layer.extend({
    sprites: [],
    contentWidth: null,//listView的宽高
    contentHeight: null,
    spriteHeight: null,//单行的高度

    contentLayer: null,

    touchBeginPos: null,
    touchMovePos: null,
    currentContentLayerPos: null,
    touchable: true,
    touchItem: null,
    init: function () {
        if (this._super()) {
            this.initLayer();
            this.initItems();
            this.initListenner();
            this.tick();
            return true;
        }
        return false;
    },
    initWithItems: function (items, contentWidth, contentHeight, itemHeight) {
        this.sprites = items;
        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;
        this.spriteHeight = itemHeight;
        this.init();
    },
    initLayer: function () {
        this.contentLayer = cc.Layer.create();
        this.addChild(this.contentLayer);
    },
    initItems: function () {
        var len = this.sprites.length;
        var height = this.spriteHeight;
        var beginY = -height / 2;
        cc.log("len:" + len);
        for (var i = 0; i < len; i++) {
            var sprite = this.sprites[i];
            this.contentLayer.addChild(sprite);
            var spritePos = cc.p(0, beginY - this.spriteHeight * i);
            sprite.setPosition(spritePos);
        }
    },
    tick: function () {
        var children = this.contentLayer.getChildren();
        var len = children.length;
        var layerPos = this.contentLayer.getPosition();
        var layerY = layerPos.y;
        for (var i = 0; i < len; i++) {
            var sprite = children[i];
            var pos = sprite.getPosition();
            var y = pos.y;
            if (y + layerY > 0 || y + layerY + this.contentHeight < 0) {
                //没有在显示范围内
                sprite.setVisible(false);
            } else {
                sprite.setVisible(true);
            }
        }
    },
    resumeLayer: function () {
        //调整
        var layerPos = this.contentLayer.getPosition();
        if (layerPos.y < 0) {//滑动到0
            this.moveZero();
        }
        var tempY = this.spriteHeight * this.sprites.length - this.contentHeight;
        if (layerPos.y > tempY) {
            if (tempY > 0) {
                this.moveBottem();
            } else {
                this.moveZero();
            }
        }
    },
    moveZero: function () {
        var layerPos = this.contentLayer.getPosition();
        this.moveLayer(cc.p(layerPos.x, 0))
    },
    moveBottem: function () {
        var layerPos = this.contentLayer.getPosition();
        var tempY = this.spriteHeight * this.sprites.length - this.contentHeight;
        this.moveLayer(cc.p(layerPos.x, tempY))
    },
    moveLayer: function (desPos) {
        var moveAction = cc.MoveTo.create(0.2, desPos);
        this.schedule(this.tick, 0.1, 2);
        this.contentLayer.runAction(moveAction);
    },
    setEnable: function (flag) {
        this.touchable = flag;
    },
    initListenner: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    isContainPoint: function (pos) {
        var selfPos = this.getPosition();
        var beginX = selfPos.x - this.contentWidth / 2;
        var endX = selfPos.x + this.contentWidth / 2;
        var beginY = selfPos.y - this.contentHeight;
        var endY = selfPos.y;
        if (pos.x > beginX && pos.x < endX && pos.y > beginY && pos.y < endY) {
            return true;
        }
        return false;
    },
    onTouchBegan: function (touch, event) {
        var _this = event.getCurrentTarget();
        if (!_this.touchable)return;
        var touchPos = touch.getLocation();
        if (_this.isContainPoint(touchPos)) {
            _this.touchBeginPos = touch.getLocation();
            _this.currentContentLayerPos = _this.contentLayer.getPosition();
            return true;
        }
        return false;
    },
    onTouchMoved: function (touch, event) {
        var _this = event.getCurrentTarget();
        if (!_this.touchable)return;
        var currentPos = touch.getLocation();
        var desY = currentPos.y - _this.touchBeginPos.y + _this.currentContentLayerPos.y;
        _this.contentLayer.setPosition(cc.p(_this.currentContentLayerPos.x, desY));
        _this.tick();
        return false;
    },
    onTouchEnded: function (touch, event) {
        var _this = event.getCurrentTarget();
        if (!_this.touchable)return;
        _this.touchBeginPos = null;
        _this.currentContentLayerPos = null;
        _this.resumeLayer();
    }
});
ListViewLayer.createWithItems = function (items, width, height, lineHeight) {
    var listView = new ListViewLayer();
    listView.initWithItems(items, width, height, lineHeight);
    return listView;
}
