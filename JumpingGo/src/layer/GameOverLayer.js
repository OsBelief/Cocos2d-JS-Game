/**
 * Created by yicha on 14-7-22.
 */
var GameOverLayer = cc.Layer.extend({
    gameOverSprite: null,
    scoreSprite: null,
    scoreLabel: null,
    bestScoreLabel: null,
    retryMenu: null,
    queenSprite: null,
    init: function () {
        if (this._super()) {
            var centerPoint = cc.p(WinSize.width / 2, WinSize.height / 2);
            // gameover图标
            this.gameOverSprite = cc.Sprite.create("#game_over.png");
            this.gameOverSprite.attr({
                x: centerPoint.x,
                y: WinSize.height
            });
            this.addChild(this.gameOverSprite, 0);
            // 分数背景
            this.scoreSprite = cc.Sprite.create("#score_best.png");
            this.scoreSprite.attr({
                x: centerPoint.x,
                y: centerPoint.y + 50
            });
            this.addChild(this.scoreSprite, 0);
            // 最终分数
            this.scoreLabel = ScoreLabel.create();
            this.scoreLabel.attr({
                x: centerPoint.x + 30,
                y: centerPoint.y + 100
            });
//            this.scoreLabel.setColor(cc.color(255, 0, 0, 0));
            this.addChild(this.scoreLabel, 1);
            // 最好分数
            this.bestScoreLabel = ScoreLabel.create();
            this.bestScoreLabel.attr({
                x: centerPoint.x + 30,
                y: centerPoint.y + 5
            });
//            this.bestScoreLabel.setColor(cc.color(255, 0, 0, 0));
            this.addChild(this.bestScoreLabel, 1);
            // 再试一次
            var retryMenuItem = cc.MenuItemSprite.create(
                cc.Sprite.create("#retry_normal.png"), // normal state image
                cc.Sprite.create("#retry_press.png"), //select state image
                this.onRetry, this);
            this.retryMenu = cc.Menu.create(retryMenuItem);  //7. create the menu
            this.retryMenu.attr({
                x: centerPoint.x - 80,
                y: centerPoint.y - 180
            });
            this.addChild(this.retryMenu, 0);
            // queen
            this.queenSprite = cc.Sprite.create("#queen_1.png");
            this.queenSprite.attr({
                x: centerPoint.x + 180,
                y: centerPoint.y - 190
            });
            this.addChild(this.queenSprite, 0);
            return true;
        }
    },
    onRetry: function() {
        g_sharedGameLayer.onRetry();
    },
    display_effects: function () {
        // gameover图层显示的特效
        this.scoreSprite.setVisible(false);
        this.scoreLabel.setVisible(false);
        this.bestScoreLabel.setVisible(false);
        this.retryMenu.setVisible(false);
        this.queenSprite.setVisible(false);
        var moveAction = cc.MoveTo.create(0.5, cc.p(WinSize.width / 2, WinSize.height / 2 + 250));
        var _this = this;
        var actionFin = cc.CallFunc.create(function () {
            _this.showScoreCard();
        });
//        var actionFin = cc.CallFunc.create(function () {
//            this.showScoreCard();
//        }.bind(this));    // 其实这里可以这么写，.bind函数会将回调函数内部的this指向传进去的参数，以维持作用域上下文，但是在IOS上有bug
        this.gameOverSprite.runAction(cc.Sequence.create([moveAction, actionFin]));
    },
    showScoreCard: function () {
        this.scoreSprite.setVisible(true);
        this.scoreSprite.setScale(1.5);
        var action = cc.ScaleTo.create(0.2, 1, 1);
        var _this = this;
        var actionFin = cc.CallFunc.create(function () {
            _this.scoreLabel.setVisible(true);
            _this.bestScoreLabel.setVisible(true);
            _this.bestScoreLabel.show_narrow();
        });
        this.scoreSprite.runAction(cc.Sequence.create([action, actionFin]));
        this.retryMenu.setVisible(true);
        this.queenSprite.setVisible(true);
    }
});
GameOverLayer.create = function () {
    var sp = new GameOverLayer();
    if (sp && sp.init()) {
        return sp;
    }
    return null;
};