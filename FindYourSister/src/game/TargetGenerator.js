/**
 * Created by yicha on 14-8-19.
 */
var TargetGenerator = function (themeIndex, checkpointIndex, things_array) {
    this.things_array = things_array;
    this.themeIndex = themeIndex;
    this.checkpointIndex = checkpointIndex;
    this.createNewTarget = function () {
        var len = this.things_array.length;
        var m = parseInt(Math.random() * len, 10);
        var thing = this.things_array[m];
        var tagNames = thing.tagName;
        var targetName = tagNames[parseInt(Math.random() * tagNames.length, 10)];
        var targetThings = this.matchTargetThings(targetName);
        var target;
        if (this.themeIndex >= 3 && this.themeIndex <= 5) {
            if (this.checkpointIndex >= 1 && this.checkpointIndex <= 15) {
                target = this.generateTarget(2, targetThings);
            }
            if (this.checkpointIndex >= 16 && this.checkpointIndex <= 31) {
                target = this.generateTarget(3, targetThings);
            }
            return target;
        }
        if (this.themeIndex >= 6 && this.themeIndex <= 8) {
            if (this.checkpointIndex >= 1 && this.checkpointIndex <= 10) {
                target = this.generateTarget(3, targetThings);
            }
            if (this.checkpointIndex >= 11 && this.checkpointIndex <= 20) {
                target = this.generateTarget(3, targetThings);
            }
            if (this.checkpointIndex >= 21 && this.checkpointIndex <= 31) {
                target = this.generateTarget(4, targetThings);
            }
            return target;
        }
        if (this.themeIndex >= 9 && this.themeIndex <= 12) {
            if (this.checkpointIndex >= 1 && this.checkpointIndex <= 10) {
                target = this.generateTarget(5, targetThings);
            }
            if (this.checkpointIndex >= 11 && this.checkpointIndex <= 20) {
                target = this.generateTarget(5, targetThings);
            }
            if (this.checkpointIndex >= 21 && this.checkpointIndex <= 31) {
                target = this.generateTarget(5, targetThings);
            }
            return target;
        }
        if (this.themeIndex >= 13 && this.themeIndex <= 16) {
            if (this.checkpointIndex >= 1 && this.checkpointIndex <= 10) {
                target = this.generateTarget(6, targetThings);
            }
            if (this.checkpointIndex >= 11 && this.checkpointIndex <= 20) {
                target = this.generateTarget(6, targetThings);
            }
            if (this.checkpointIndex >= 21 && this.checkpointIndex <= 31) {
                target = this.generateTarget(6, targetThings);
            }
            return target;
        }
    };
    this.matchTargetThings = function (targetName) {
        // 匹配出目标种类的所有东西
        var len = this.things_array.length;
        var targetThing = [];
        for (var j = 0; j < len; j++) {
            var thing = this.things_array[j];
            var tagNames = thing.tagName;
            for (var k = 0; k < tagNames.length; k++) {
                if (tagNames[k] == targetName) {
                    targetThing.push(thing);
                    break;
                }
            }
        }
        return {"targetName": targetName, "targetThing": targetThing};
    };
    this.generateTarget = function (basicNumber, targetThings) {
        var r = parseInt(Math.random() * 1 + (basicNumber-1), 10);  // 该类型所需的数目
        var len = targetThings.targetThing.length;
        if (r < len) {
            return {"targetName": targetThings["targetName"], "thingsNumber": r, "completed": 0};
        } else {
            return {"targetName": targetThings["targetName"], "thingsNumber": len, "completed": 0};
        }
    };
};