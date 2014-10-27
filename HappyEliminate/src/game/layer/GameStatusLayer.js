/**
 * Created by chengzhenhua on 14-10-8.
 */
/**
 * 游戏的状态层
 * @type {Function}
 */
var GameStatusLayer = cc.Layer.extend({
    animal_amount_label: null,
    steps_label: null,
    score_label: null,
    tasks: null,
    initWithTasks: function (processIndex, steps, tasks) {
        this.tasks = tasks;
        cc.spriteFrameCache.addSpriteFrames(res.target_helper_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gamePlaySceneUI_plist, res.gamePlaySceneUI_png);
        cc.spriteFrameCache.addSpriteFrames(res.ladybug_plist, res.ladybug_png);
        // 纷杂的树叶
        var leaf_1 = cc.Sprite.create("#assert/dfsagrg0000");
        leaf_1.attr({
            x: 300,
            y: 795
        });
        this.addChild(leaf_1);
        var leaf_2 = cc.Sprite.create("#assert/faewwe0000");
        leaf_2.attr({
            x: 395,
            y: 790
        });
        this.addChild(leaf_2);
        var leaf_3 = cc.Sprite.create("#assert/gabdff0000");
        leaf_3.attr({
            x: 445,
            y: 736
        });
        this.addChild(leaf_3);
        var leaf_4 = cc.Sprite.create("#assert/shucong 副本0000");
        leaf_4.attr({
            x: 60,
            y: 780,
            scaleX: -1
        });
        this.addChild(leaf_4);
        var leaf_5 = cc.Sprite.create("#assert/faewwe0000");
        leaf_5.attr({
            x: 80,
            y: 790
        });
        this.addChild(leaf_5);
        var leaf_6 = cc.Sprite.create("#assert/faewwe0000");
        leaf_6.attr({
            x: 20,
            y: 780,
            rotationX: -90
        });
        this.addChild(leaf_6);
        // 大树枝
        var treeBranch = cc.Sprite.create("#background_branch0000");
        treeBranch.attr({
            x: 160,
            y: 710
        });
        this.addChild(treeBranch);
        // 显示第几关
        var processText = cc.LabelBMFont.create("第  关", res.titles_fnt);
        processText.attr({
            x: 40,
            y: 777,
            scale: 0.9
        });
        this.addChild(processText);
        // 显示关数
        var processText = cc.LabelBMFont.create(processIndex || "0", res.level_seq_upon_entering_fnt);
        processText.attr({
            x: 38,
            y: 777,
            scale: 0.8
        });
        this.addChild(processText);
        // 显示分数二字
        var scoreText = cc.LabelBMFont.create("分数", res.game_scores_fnt);
        scoreText.attr({
            x: 25,
            y: 695,
            scale: 1.3
        });
        this.addChild(scoreText);
        // 显示分数标签
        this.score_label = cc.LabelBMFont.create("0", res.game_scores_fnt);
        this.score_label.setAnchorPoint(cc.p(0, 0.5));
        this.score_label.attr({
            x: 3,
            y: 674
        });
        this.addChild(this.score_label);
        var sprite = cc.Sprite.create();
        sprite.tag = SPRITE_TAG.target_board;
        sprite.attr({
            x: 189,
            y: 745
        });
        // 底层板
        var BoardSprite_1 = cc.Sprite.create("#small_p_board_bg0000");
        BoardSprite_1.attr({
            x: 0,
            y: 0,
            scaleX: 1.2,
            scaleY: 1.1
        });
        sprite.addChild(BoardSprite_1);
        // 上层板
        var BoardSprite_2 = cc.Sprite.create("#small_p_board_hi_bg0000");
        BoardSprite_2.attr({
            x: 0,
            y: -2,
            scaleX: 1.6,
            scaleY: 1.3
        });
        sprite.addChild(BoardSprite_2);
        // 绳子
        var ropeSprite = cc.Sprite.create("#p_small_rope0000");
        ropeSprite.attr({
            x: 0,
            y: 38
        });
        sprite.addChild(ropeSprite);
        // 应该消除的动物
        var animalIndex = tasks[0]["target"];
        var animalSprite = AnimalSprite.createWithImageIndex(animalIndex);
        animalSprite.tag = SPRITE_TAG.target_animal;
        animalSprite.attr({
            x: 1,
            y: -2,
            scale: 0.8
        });
        animalSprite.setVisible(false);
        sprite.addChild(animalSprite);
        this.addChild(sprite);
        // 显示剩余步数的牌子
        var remainderBoard = cc.Sprite.create("#moveortimecounterbg0000");
        remainderBoard.attr({
            x: 385,
            y: 760
        });
        this.addChild(remainderBoard);
        // "剩余步数"四个大字
        var remainderStep = cc.Sprite.create(res.shengyubushu_png);
        remainderStep.attr({
            x: 387,
            y: 760,
            scale: 0.7
        });
        this.addChild(remainderStep);
        // 显示剩余步数
        this.steps_label = cc.LabelBMFont.create(steps || "0", res.steps_cd_fnt);
        this.steps_label.attr({
            x: 385,
            y: 732
        });
        this.addChild(this.steps_label);
    },
    /**
     * 任务板摆动特效
     */
    playTaskBoardEffect: function () {
        var sprite = this.getChildByTag(SPRITE_TAG.target_board);
        var animalSprite = sprite.getChildByTag(SPRITE_TAG.target_animal);
        animalSprite.setVisible(true);
        this.animal_amount_label = cc.LabelBMFont.create(this.tasks[0]["number"] || "0", res.target_amount_fnt);
        this.animal_amount_label.attr({
            x: 18,
            y: -18,
            scale: 1.2
        });
        sprite.addChild(this.animal_amount_label);
    },
    /**
     * 更新分数
     * @param score
     */
    updateScore: function(score) {
        var newScore = parseInt(this.score_label.getString()) + score;
        this.score_label.setString(newScore);
    },
    /**
     * 更新剩余动物数
     * @param amount
     */
    updateAnimalAmount: function(amount) {
        var newAmount = parseInt(this.animal_amount_label.getString()) - amount;
        if(newAmount <= 0) {
            // 保证执行一次
            if(gameLayer.isGameOver === false) {
                this.animal_amount_label.removeFromParent();
                var sprite = cc.Sprite.create("#level_help_finished_icon0000");
                sprite.attr({
                    scale: 0.8,
                    x: 210,
                    y: 730
                });
                this.addChild(sprite);
                gameLayer.onGameSuccess();
            }
        } else {
            this.animal_amount_label.setString(newAmount);
        }
    },
    /**
     * 更新剩余步数
     * @param n
     */
    updateStepNumber: function(n) {
        var newSteps = parseInt(this.steps_label.getString()) - n;
        this.steps_label.setString(newSteps);
    }
});
GameStatusLayer.createWithTasks = function (processIndex, steps, tasks) {
    var layer = new GameStatusLayer();
    layer.initWithTasks(processIndex, steps, tasks);
    return layer;
};