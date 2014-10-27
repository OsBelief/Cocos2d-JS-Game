/**
 * Created by chengzhenhua on 14-10-8.
 */
/**
 * 提示任务的小浣熊
 * @type {Function}
 */
var TaskHelperLayer = cc.Layer.extend({
    initWithTarget: function (tasks) {
        // 此精灵从天而降
        var sprite = cc.Sprite.create();
        sprite.attr({
            x: 225,
            y: 400
        });
        // 边框
        var border = cc.Sprite.create("#small_p_background0000");
        border.attr({
            x: 0,
            y: -70,
            scaleX: 1.8,
            scaleY: 1.3
        });
        sprite.addChild(border);
        // 小浣熊
        var huanxiong = cc.Sprite.create("#npc_small_10000");
        huanxiong.attr({
            x: -150,
            y: -80
        });
        sprite.addChild(huanxiong);
        // 红绸缎
        var title = cc.Sprite.create("#small_p_fabric0000");
        title.attr({
            x: -0,
            y: -8
        });
        sprite.addChild(title);
        // 目标二字
        var objective = cc.LabelBMFont.create("目标", res.objectives_fnt);
        objective.attr({
            x: 2,
            y: -8
        });
        sprite.addChild(objective);
        // 请消除足够数量的下列目标
        var hint = cc.LabelBMFont.create("请消除足够数量的下列目标", res.tutorial_fnt);
        hint.attr({
            x: 0,
            y: -50,
            scale: 0.8
        });
        sprite.addChild(hint);
        // 目标任务
        var length = tasks.length;
        if (length === 1) {
            var animalIndex = tasks[0]["target"];
            var animalBoard = cc.Sprite.create("#target_panel_tile_bg0000");
            animalBoard.attr({
                x: 0,
                y: -110
            });
            sprite.addChild(animalBoard);
            var animalSprite = AnimalSprite.createWithImageIndex(animalIndex);
            animalSprite.attr({
                x: 0,
                y: -110,
                scale: 0.9
            });
            sprite.addChild(animalSprite);
        }
        this.addChild(sprite);
        this.popupEffect(sprite, hint, animalSprite);
    },
    /**
     * 表演特效
     * @param sprite
     */
    popupEffect: function (sprite, hint, animalSprite) {
        // 实现运动特效,要从时间、距离、加速度这几方面考虑
        var downMove = cc.moveBy(0.2, cc.p(0, -20));
        downMove.easing(cc.easeInOut(2));
        var upMove = cc.moveBy(0.2, cc.p(0, 20));
        upMove.easing(cc.easeInOut(2));
        var down_up = cc.callFunc(function () {
            // "请消除足够数量的下列目标"放大
            var scaleHint = cc.scaleTo(0.2, 1.2, 1.2);
            var scaleHintFin = cc.callFunc(function() {
                // 小动物放大缩小
                var scaleAnimal = cc.scaleTo(0.2, 1.4, 1.4);
                var reduceAnimal = cc.scaleTo(0.2, 1, 1);
                // 飞到枝头
                var moveAnimal = cc.moveTo(1, cc.p(-35, 343));
                moveAnimal.easing(cc.easeIn(4));
                var reduceAnimal_2 = cc.scaleTo(0.2, 0.8, 0.8);
                var spawnAnimal = cc.spawn(moveAnimal, reduceAnimal_2);
                // 任务板摆动,删除该图层
                var gameLayer = this.getParent();
                var animalFin = cc.callFunc(function(){
                    gameLayer.beginGuideGame();
                    this.removeFromParent();
                }, this);
                animalSprite.runAction(cc.sequence([scaleAnimal, reduceAnimal, spawnAnimal, animalFin]));
            }, this);
            hint.runAction(cc.sequence(scaleHint, scaleHintFin));
        }, this);
        sprite.runAction(cc.sequence([downMove, upMove, down_up]));
    }
});
TaskHelperLayer.createWithTarget = function (tasks) {
    var layer = new TaskHelperLayer();
    layer.initWithTarget(tasks);
    return layer;
};