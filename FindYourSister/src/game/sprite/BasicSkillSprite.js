/**
 * Created by yicha on 14-8-14.
 */
// 技能基类
var BasicSkillSprite = cc.Sprite.extend({
    numberLabel: null,
    number: null,
    coolTimer: null,
    initWithSkill: function (skill) {
        this.initWithSpriteFrameName(skill.imgsrc);
        // 显示该技能的可用数目
        this.number = skill.number;
        this.numberLabel = cc.LabelTTF.create(skill.number || "0", "Arial", 40);
        this.numberLabel.setColor(cc.color(255, 0, 0, 0));
        this.numberLabel.attr({
            x: this.width - 27,
            y: 27
        });
        this.addChild(this.numberLabel);
    },
    handleCooling: function (skillname) {
        // 处理技能的冷却
        if(this.number > 0) {
            if (this.coolTimer === null) {
                this.coolTimer = cc.ProgressTimer.create(cc.Sprite.create("#coolDownFrame.png"));
                this.coolTimer.attr({
                    x: this.width / 2,
                    y: this.height / 2
                });
                this.coolTimer.setType(cc.ProgressTimer.TYPE_BAR);
                this.coolTimer.setBarChangeRate(cc.p(0, 1));  // 垂直进度条
                this.coolTimer.setMidpoint(cc.p(1, 0)); // 从上到下
                this.addChild(this.coolTimer);
            }
            var action = this.coolTimer.getActionByTag(ACTION_TAG.skill_cooling);
            if(action === null || action.isDone()) {
                this.coolTimer.setPercentage(100);
                var action = cc.ProgressFromTo.create(10, 100, 0);
                action.tag = ACTION_TAG.skill_cooling;
                this.coolTimer.runAction(action);
                this.number--;
                this.numberLabel.setString(this.number);
                var localStorageUtil = LocalStorageUtil.getInstance();
                localStorageUtil.decreaseSkillNumber(skillname);
                return SKILL_STATE.enable;
            } else {
                return SKILL_STATE.cooling;
            }
        } else {
            return SKILL_STATE.zero;
        }
    },
    updateLabel: function(n) {
        this.number += n;
        this.numberLabel.setString(this.number);
    }
});
BasicSkillSprite.createWithSkill = function (skill) {
    var sp = new BasicSkillSprite();
    sp.initWithSkill(skill);
    return sp;
};