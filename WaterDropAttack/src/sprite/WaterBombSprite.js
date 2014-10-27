/**
 * Created by yicha on 14-7-30.
 */
// 大水滴爆破后的水弹
var WaterBombSprite = cc.Sprite.extend({
    waterDropRow: null,
    waterDropColumn: null,
    is_exit: true,
    initWithDirector: function (d, waterDropIndex) {
        if (this.init()) {
            // 水弹所属水滴的行号和列号
            this.waterDropRow = parseInt(parseInt(waterDropIndex, 10) / 6, 10);
            this.waterDropColumn = parseInt(parseInt(waterDropIndex, 10) % 6, 10);
            switch (d) {
                case "l":
                    this.initWithSpriteFrameName("left_60.png");
                    this.schedule(this.toLeftWall, FRAME_RATE.waterBomb_move);
                    break;
                case "r":
                    this.initWithSpriteFrameName("right_59.png");
                    this.schedule(this.toRightWall, FRAME_RATE.waterBomb_move);
                    break;
                case "u":
                    this.initWithSpriteFrameName("up_43.png");
                    this.schedule(this.toUpWall, FRAME_RATE.waterBomb_move);
                    break;
                case "d":
                    this.initWithSpriteFrameName("down_44.png");
                    this.schedule(this.toDownWall, FRAME_RATE.waterBomb_move);
                    break;
            }
        }
    },
    toLeftWall: function () {
        if (this.x <= 10) {
            this.unscheduleAllCallbacks();
            this.x = 10;
            if(VOICE_STATE === 0) {
                cc.audioEngine.playEffect(res.voice_drop_break);
            }
            var animFrames = [];
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("leftHitWall_42.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("leftHitWall_34.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("leftHitWall_27.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("leftHitWall_18.png"));
            var animation = cc.Animation.create(animFrames, FRAME_RATE.waterBomb_hitWall);
            var _this = this;
            var actionFin = cc.CallFunc.create(function () {
                _this.is_exit = false;
                _this.removeFromParent();
            });
            var animate = cc.Animate.create(animation);
            this.runAction(cc.Sequence.create(animate, actionFin));
        } else {
            this.x = this.x - 15;
            var j = this.waterDropColumn;
            while (--j >= 0) {
                if(this.checkWaterBombMotion(this.waterDropRow, j)) {
                    break;
                }
            }
        }
    },
    toRightWall: function () {
        if (this.x >= 470) {
            this.unscheduleAllCallbacks();
            this.x = 470;
            if(VOICE_STATE === 0) {
                cc.audioEngine.playEffect(res.voice_drop_break);
            }
            var animFrames = [];
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("rightHitWall_41.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("rightHitWall_33.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("rightHitWall_26.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("rightHitWall_17.png"));
            var animation = cc.Animation.create(animFrames, FRAME_RATE.waterBomb_hitWall);
            var _this = this;
            var actionFin = cc.CallFunc.create(function () {
                _this.is_exit = false;
                _this.removeFromParent();
            });
            var animate = cc.Animate.create(animation);
            this.runAction(cc.Sequence.create(animate, actionFin));
        } else {
            this.x = this.x + 15;
            var j = this.waterDropColumn;
            while (++j <= 5) {
                if(this.checkWaterBombMotion(this.waterDropRow, j)) {
                    break;
                }
            }
        }
    },
    toUpWall: function () {
        // 向上飞
        if (this.y >= 670) {
            this.unscheduleAllCallbacks();
            this.y = 670;
            if(VOICE_STATE === 0) {
                cc.audioEngine.playEffect(res.voice_drop_break);
            }
            var animFrames = [];
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("upHitWall_48.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("upHitWall_63.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("upHitWall_61.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("upHitWall_54.png"));
            var animation = cc.Animation.create(animFrames, FRAME_RATE.waterBomb_hitWall);
            var _this = this;
            var actionFin = cc.CallFunc.create(function () {
                _this.is_exit = false;
                _this.removeFromParent();
            });
            var animate = cc.Animate.create(animation);
            this.runAction(cc.Sequence.create(animate, actionFin));
        } else {
            this.y = this.y + 15;
            var i = this.waterDropRow;
            while (--i >= 0) {
                if(this.checkWaterBombMotion(i, this.waterDropColumn)) {
                    break;
                }
            }
        }
    },
    toDownWall: function () {
        if (this.y <= 190) {
            this.unscheduleAllCallbacks();
            this.y = 190;
            if(VOICE_STATE === 0) {
                cc.audioEngine.playEffect(res.voice_drop_break);
            }
            var animFrames = [];
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("downHitWall_49.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("downHitWall_64.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("downHitWall_62.png"));
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("downHitWall_55.png"));
            var animation = cc.Animation.create(animFrames, FRAME_RATE.waterBomb_hitWall);
            var _this = this;
            var actionFin = cc.CallFunc.create(function () {
                _this.is_exit = false;
                _this.removeFromParent();
            });
            var animate = cc.Animate.create(animation);
            this.runAction(cc.Sequence.create(animate, actionFin));
        } else {
            this.y = this.y - 15;
            var i = this.waterDropRow;
            while (++i <= 5) {
                if(this.checkWaterBombMotion(i, this.waterDropColumn)) {
                    break;
                }
            }
        }
    },
    // 检查水弹是否与水滴碰撞
    checkWaterBombMotion: function(i, j) {
        var sp = g_sharedGameLayer.waterDrop_array[6 * i + j];
        if(sp != null) {
            var rect = cc.rect(sp.x - sp.width / 2, sp.y - sp.height / 2, sp.width, sp.height);
            if(cc.rectContainsPoint(rect, this.getPosition())) {
                this.is_exit = false;
                this.unscheduleAllCallbacks();
                this.removeFromParent();
                if (sp.state != 4) {
                    sp.expandWaterDrop();
                } else {
                    // 将击中的水滴在数组中置空
                    g_sharedGameLayer.waterDrop_array[6 * i + j] = null;
                    sp.breakWaterDrop();
                }
            }
            return true;
        }
    }
});
WaterBombSprite.initWithDirector = function (d, waterDropIndex) {
    var sp = new WaterBombSprite();
    sp.initWithDirector(d, waterDropIndex);
    return sp;
}