/**
 * Created by yicha on 14-7-10.
 */
var PenguinSprite = cc.Sprite.extend({
    landing_Y : null,
    p_reference : null,
    v_friction : null,
    h_friction : null,
    rate_X : null,
    rate_Y : null,
    move_time : null,
    current_X : null,
    current_Y : null,
    start_X : null,
    start_Y : null,
    start_point_X: null,
    milestone_number: null,
    ctor : function() {
        this._super();
        this.landing_Y = 75;    // 地面高度
        this.p_reference = cc.p(450, 130);   // 击打处参考点
        this.h_friction = 50;    // 水平减速系数
        this.v_friction = 50;    // 垂直减速系数
        this.rate_X = 0;    // 企鹅水平速度
        this.rate_Y = 0;    // 企鹅垂直速度
        this.time_interval = 0.1;   //  企鹅飞时刷新时间间隔
        this.milestone_number = 1;
    },
    init : function(res_imag) {
        this.initWithFile(res_imag);
    },
    re_stand: function() {
        // 企鹅重新上台
        this.milestone_number = 1;
        this.setRotation(0);
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.penguin_step_left_1);
        animation.addSpriteFrameWithFile(res.penguin_step_left_2);
        animation.addSpriteFrameWithFile(res.penguin_step_left_3);
        animation.addSpriteFrameWithFile(res.penguin_step_right_1);
        animation.addSpriteFrameWithFile(res.penguin_step_right_2);
        animation.addSpriteFrameWithFile(res.penguin_step_right_3);
        animation.addSpriteFrameWithFile(res.penguin_idle);
        animation.addSpriteFrameWithFile(res.penguin_jump_1);
        animation.addSpriteFrameWithFile(res.penguin_jump_2);
        animation.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate = cc.Animate.create(animation);
        this.runAction(animate);
    },
    playFreeFall : function() {
        this.stopAllActions();
        // 企鹅下落时准备动画
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.penguin_jump_3);
        animation.addSpriteFrameWithFile(res.penguin_jump_4);
        animation.addSpriteFrameWithFile(res.penguin_jump_5);
        animation.addSpriteFrameWithFile(res.penguin_jump_6);
        animation.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate = cc.Animate.create(animation);
        // 自由落体动画
        var freeFallAction = FreeFallAction.create(this.getPositionY() - 75);
        // 合并动画序列
        this.runAction(cc.Sequence.create([animate, freeFallAction]));
    },
    flyAfterStrike : function(rate) {
        this.fly_animate();
        this.current_X = this.start_X = this.start_point_X = this.getPositionX();   // X轴坐标
        this.current_Y = this.start_Y = this.getPositionY();   // Y轴坐标
        this.divide_rate(rate * 20);    // 设置速度放大倍数
        this.schedule(this.on_tick, this.time_interval);
    },
    landing_vertical : function() {
        // 垂直停下来
        var animation_vertical = cc.Animation.create();
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_1);
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_2);
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_3);
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_4);
        animation_vertical.setDelayPerUnit(0.1);
        var animate_vertical = cc.Animate.create(animation_vertical);
        this.runAction(animate_vertical);
        this.getParent().getParent().displayMenu();
    },
    landing_horizon : function() {
        this.stopAllActions();
        // 水平停下来
        var animation_landing = cc.Animation.create();
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_1);
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_2);
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_3);
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_4);
        animation_landing.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate_landing = cc.Animate.create(animation_landing);
        this.runAction(animate_landing);
        this.unscheduleAllCallbacks();
        var gameLayer = this.getParent().getParent();
        gameLayer.displayMenu(this.calculate_score());
    },
    fly_animate : function() {
        this.stopAllActions();
        // 飞
        var animation_fly = cc.Animation.create();
        animation_fly.addSpriteFrameWithFile(res.penguin_fly_1);
        animation_fly.addSpriteFrameWithFile(res.penguin_fly_2);
        animation_fly.addSpriteFrameWithFile(res.penguin_fly_3);
        animation_fly.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate_fly = cc.Animate.create(animation_fly);
        this.runAction(cc.RepeatForever.create(animate_fly));
    },
    add_black_landing : function(x) {
        // 在落地点添加黑色标记
        var backgroundLayer = this.getParent().getParent().getChildByTag(100);
        var black_landing = cc.Sprite.create(res.penguin_nick);
        black_landing.setPosition(x, this.landing_Y-10);
        backgroundLayer.addChild(black_landing, 1);
        backgroundLayer.bg_array.push(black_landing);
    },
    on_tick : function() {
        this.move_X();
        this.move_Y();
        if(this.getPositionX() <= 75) {
            this.setPosition(75, this.current_Y);
            var backgroundLayer = this.getParent().getParent().getChildByTag(100);
            backgroundLayer.move_Sprite(Math.abs(this.current_X - this.start_X));
            var d = Math.abs(this.current_X - this.start_point_X);
            if(parseInt(d / 500) === this.milestone_number) {
                backgroundLayer.load_milestone(this.milestone_number * 500);
                this.milestone_number++;
            }
            if (this.getPositionY() <= this.landing_Y) {
                if ((this.rate_X >= (-this.h_friction / 5)) && (this.rate_Y >= -this.v_friction && this.rate_Y <= this.v_friction)) {
                    this.landing_horizon();
                    this.add_black_landing(75);
                } else {
                    this.add_black_landing(75);
                    this.rate_Y = -this.rate_Y - this.v_friction;
                }
                this.setRotation(0);
                this.setPositionY(this.landing_Y);
            } else {
                this.setRotation(this.calculate_rotation());
                this.fly_animate();
            }
        } else {
            this.setPosition(this.current_X, this.current_Y);
            if (this.getPositionY() <= this.landing_Y) {
                if ((this.rate_X >= (-this.h_friction / 5)) && (this.rate_Y >= -this.v_friction && this.rate_Y <= this.v_friction)) {
                    this.landing_horizon();
                    this.add_black_landing(this.current_X);
                } else {
                    this.add_black_landing(this.current_X);
                    this.rate_Y = -this.rate_Y - this.v_friction;
                }
                this.setRotation(0);
                this.setPositionY(this.landing_Y);
            } else {
                this.setRotation(this.calculate_rotation());
                this.fly_animate();
            }
        }
        this.start_X = this.current_X;
        this.start_Y = this.current_Y;
    },
    divide_rate : function(rate) {
        // 分解初始速度(正方向以cocos2d的坐标轴为准)
        // X分量始终为负
        var c = Math.sqrt((this.p_reference.x - this.getPositionX())*(this.p_reference.x - this.getPositionX()) + (this.p_reference.y - this.getPositionY())*(this.p_reference.y - this.getPositionY()));
        this.rate_X = -rate * (this.p_reference.x - this.getPositionX())/c;
        // Y分量可能为正,可能为负
        this.rate_Y = rate * (this.getPositionY()-this.p_reference.y)/c;
    },
    move_X : function() {
        // 水平运动
        this.current_X = this.start_X + this.rate_X * this.time_interval;
        if(this.rate_X < (-this.h_friction/5)) {
            if(this.getPositionY() > this.landing_Y) {
                this.rate_X += this.h_friction / 10; // 水平默认减速幅度
            } else {
                this.rate_X += this.h_friction; // 擦地时减速
            }
        }
    },
    move_Y : function() {
        // 垂直运动
        this.current_Y = this.start_Y + this.rate_Y * this.time_interval;
        if(this.rate_Y > this.v_friction) {
            this.rate_Y -= this.v_friction;
        } else {
            this.rate_Y -= this.v_friction / 5;
        }
    },
    calculate_score: function() {
        // 计算分数
        return parseInt(Math.abs(this.current_X - this.start_point_X));
    },
    calculate_rotation: function() {
        var angle = -Math.atan2(this.rate_X, this.rate_Y);
        angle = 90 - angle * (180/Math.PI);
        return angle;
    }
});