var ScoreLabel = cc.LabelBMFont.extend({
    size: null,
    init: function () {
        if (this._super()) {
            this.size = cc.director.getWinSize();
            this.initWithString("0", res.number84);
            return true;
        }
    },
    scale_disappear: function () {
        var action = cc.ScaleTo.create(0.5, 0, 0);   // 内缩消失
        this.runAction(action);
    },
    fly_from_right: function () {
        // 从右侧复原飞入
        this.setScale(1.5);
        this.setString("0");
        this.setPosition(this.size.width, this.size.height / 2);
        var moveAction = cc.MoveTo.create(0.5, cc.p(100, this.size.height / 2 + 400));
        var scaleAction = cc.ScaleTo.create(0.5, 1, 1);
        var action = cc.Spawn.create(moveAction, scaleAction);
        this.runAction(action);
    },
    show_narrow: function () {
        // 缩小出现
        this.setScale(1.5);
        var action = cc.ScaleTo.create(0.2, 1, 1);
        this.runAction(action);
    }
});
ScoreLabel.create = function () {
    var sp = new ScoreLabel();
    if (sp && sp.init()) {
        return sp;
    }
    return null;
};