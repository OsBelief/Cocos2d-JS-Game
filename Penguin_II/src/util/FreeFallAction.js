/**
 * Created by yicha on 14-7-10.
 */
// 自定义自由落体的Action
var FreeFallAction = cc.ActionInterval.extend( {
    timeElasped:0,
    m_positionDeltaY:null,
    m_startPosition:null,
    m_targetPosition:null,
    _target : null,
    k_Acceleration : 10,
    v0:30,
    ctor:function() {
        cc.ActionInterval.prototype.ctor.call(this);
        this.yOffsetElasped = 0;
        this.timeElasped = 0;
        this.m_positionDeltaY = 0;  // 垂直偏移量
        this.m_startPosition = cc.p(0, 0);  // 起点坐标
        this.m_targetPosition = cc.p(0, 0); // 终点坐标
    },
    // 设置该Action运行的时间
    initWithDuration:function (duration) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            return true;
        }
        return false;
    },

    initWithOffset:function(deltaPosition) {
        var dropTime = (-this.v0 + Math.sqrt(this.v0*this.v0 + 2*this.k_Acceleration*Math.abs(deltaPosition)))/this.k_Acceleration;
        if(this.initWithDuration(dropTime)) {
            this.m_positionDeltaY = deltaPosition;
            return true;
        }
        //cc.log("dropTime =" + dropTime + "; deltaPosition=" + deltaPosition);
        return false;
    },

    isDone:function() {
        if (this.m_targetPosition.y >= this._target.getPositionY()) {
            return true;
        }
        return false;
    },

    // Node的runAction函数会调用ActionManager的addAction函数，在ActionManager的addAction函数中会调用Action的startWithTarget，然后在Action类的startWithTarget函数中设置_target的值。
    startWithTarget:function(target) {
        //cc.log("startWithTarget target=" + target);
        this._target = target;
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this.m_startPosition = target.getPosition();
        this.m_targetPosition = cc.p(this.m_startPosition.x, this.m_startPosition.y - this.m_positionDeltaY);
    },

    update:function(dt) {
        this.timeElasped += dt;
        if (this._target && this.m_targetPosition.y < this._target.getPositionY()) {
            var yMoveOffset = 0.5 * this.k_Acceleration * this.timeElasped * this.timeElasped + this.v0 * this.timeElasped;
            if (cc.ENABLE_STACKABLE_ACTIONS) {
                var newPos = cc.p(this.m_startPosition.x, this.m_startPosition.y - yMoveOffset);
                if (this.m_targetPosition.y > newPos.y) {
                    newPos.y = this.m_targetPosition.y;
                    this._target.stopAllActions();
                    this._target.landing_vertical();
                }
                this._target.setPosition(newPos);
            } else {
                this._target.setPosition(cc.p(this.m_startPosition.x, this.m_startPosition.y + this.m_positionDeltaY * dt));
            }
        }
    }

});

FreeFallAction.create = function(deltaPosition) {
    var ff = new FreeFallAction();
    ff.initWithOffset(deltaPosition);
    return ff;
};