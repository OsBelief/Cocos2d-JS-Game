/**
 * Created by yicha on 14-8-14.
 */
// 上端右边的波数
var TaskNumberSprite = cc.Sprite.extend({
    finishedLabel: null,
    finishNumber: null,
    totalNumber: null,
    initWithTaskNumber: function (number) {
        this.initWithSpriteFrameName("stage.png");
        // 已完成的任务数
        this.finishNumber = 0;
        this.totalNumber = number;
        this.finishedLabel = cc.LabelTTF.create("0", "Arial", 36);
        this.finishedLabel.attr({
            x: this.width / 2 - 20,
            y: this.height / 2
        });
        this.finishedLabel.setColor(cc.color(255, 0, 0, 0));
        this.addChild(this.finishedLabel);
        // 中间的横杠
        var line = cc.LabelTTF.create("-", "Arial", 36);
        line.attr({
            x: this.width / 2,
            y: this.height / 2
        });
        line.setColor(cc.color(255, 0, 0, 0));
        this.addChild(line);
        // 总共的任务数
        var totalLabel = cc.LabelTTF.create(number, "Arial", 36);
        totalLabel.attr({
            x: this.width / 2 + 20,
            y: this.height / 2
        });
        totalLabel.setColor(cc.color(255, 0, 0, 0));
        this.addChild(totalLabel);
    },
    updateFinished: function() {
        this.finishNumber++;
        this.finishedLabel.setString(this.finishNumber);
    },
    isCompleted: function() {
        if(this.finishNumber === this.totalNumber){
            return true;
        }
        return false;
    }
});
TaskNumberSprite.createWithTaskNumber = function (number) {
    var sprite = new TaskNumberSprite();
    sprite.initWithTaskNumber(number);
    return  sprite;
};