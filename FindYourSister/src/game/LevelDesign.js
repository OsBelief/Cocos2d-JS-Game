/**
 * Created by yicha on 14-8-12.
 */
/*
 关卡设计
 关卡设计的输入是主题索引和关卡索引
 可进行设计的维度有东西的数量、东西的种类，提供的东西的数量，东西的种类
 关卡设计的输出是{
 [{目标名称,目标数量,已完成数]],
 任务数
 东西数组,
 剩余东西数组
 }
 主题     关卡    目标种类     每种数目   总共的数目 任务数(大于目标数)
 3-5      1-15       1            1-2         150       2
 16-31                   2-3         150       3
 6-8      1-10       2            2-3         180      3
 11-20                   2-3         180      3
 21-31                   3-4         180      4
 9-12     1-10       3            3-4         200      5
 11-20                   4-5
 21-31
 13-16    1-10      3             4-5         220      6
 11-20                   5-6
 21-31
 */
var LevelDesign = function (thing_array, themeIndex, checkpoint) {
    this.thing_array = thing_array;
    this.themeIndex = themeIndex;
    this.checkpoint = checkpoint;
    this.createNewLevel = function () {
        if (this.checkpoint["state"] === 1) {
            // 正常
            var task = this.initNewLevel();
            return task;
        } else {
            // 抢金币
        }
    };
    this.initNewLevel = function () {
        // 关卡设计
        var len = this.thing_array.length;
        var index = this.checkpoint["index"];
        if (this.themeIndex >= 3 && this.themeIndex <= 5) {
            var m = parseInt(Math.random() * len, 10);
            var thing = this.thing_array[m];
            var tagNames = thing.tagName;
            var targetName = [tagNames[parseInt(Math.random() * tagNames.length, 10)]];
            var targetThings = this.matchTargetThings(targetName);
            var task;
            if (index >= 1 && index <= 15) {
                var targets = this.generateTarget(2, targetThings);
                task = this.generateFinalTask(2, targets, 150);
            }
            if (index >= 16 && index <= 31) {
                var targets = this.generateTarget(3, targetThings);
                task = this.generateFinalTask(3, targets, 150);
            }
            return task;
        }
        if (this.themeIndex >= 6 && this.themeIndex <= 8) {
            var targetName = null;
            for (var i = 0; i < 2; i++) {
                var m = parseInt(Math.random() * len, 10);
                var thing = this.thing_array[m];
                var tagNames = thing.tagName;
                targetName.push(tagNames[parseInt(Math.random() * tagNames.length, 10)]);
            }
            var targetThings = this.matchTargetThings(targetName);
            var task;
            if (index >= 1 && index <= 10) {
                var targets = this.generateTarget(3, targetThings);
                task = this.generateFinalTask(3, targets, 180);
            }
            if (index >= 11 && index <= 20) {
                var targets = this.generateTarget(3, targetThings);
                task = this.generateFinalTask(3, targets, 180);
            }
            if (index >= 21 && index <= 31) {
                var targets = this.generateTarget(4, targetThings);
                task = this.generateFinalTask(4, targets, 180);
            }
            return task;
        }
        if (this.themeIndex >= 9 && this.themeIndex <= 12) {
            var targetName = null;
            for (var i = 0; i < 3; i++) {
                var m = parseInt(Math.random() * len, 10);
                var thing = this.thing_array[m];
                var tagNames = thing.tagName;
                targetName.push(tagNames[parseInt(Math.random() * tagNames.length, 10)]);
            }
            var targetThings = this.matchTargetThings(targetName);
            var task;
            if (index >= 1 && index <= 10) {
                var targets = this.generateTarget(4, targetThings);
                task = this.generateFinalTask(5, targets, 200);
            }
            if (index >= 11 && index <= 20) {
                var targets = this.generateTarget(5, targetThings);
                task = this.generateFinalTask(5, targets, 200);
            }
            if (index >= 21 && index <= 31) {
                var targets = this.generateTarget(5, targetThings);
                task = this.generateFinalTask(5, targets, 200);
            }
            return task;
        }
        if (this.themeIndex >= 13 && this.themeIndex <= 16) {
            var targetName = null;
            for (var i = 0; i < 3; i++) {
                var m = parseInt(Math.random() * len, 10);
                var thing = this.thing_array[m];
                var tagNames = thing.tagName;
                targetName.push(tagNames[parseInt(Math.random() * tagNames.length, 10)]);
            }
            var targetThings = this.matchTargetThings(targetName);
            var task;
            if (index >= 1 && index <= 10) {
                var targets = this.generateTarget(5, targetThings);
                task = this.generateFinalTask(6, targets, 220);
            }
            if (index >= 11 && index <= 20) {
                var targets = this.generateTarget(6, targetThings);
                task = this.generateFinalTask(6, targets, 220);
            }
            if (index >= 21 && index <= 31) {
                var targets = this.generateTarget(6, targetThings);
                task = this.generateFinalTask(6, targets, 220);
            }
            return task;
        }
    };
    this.matchTargetThings = function (targetNames) {
        // 匹配出目标种类的所有东西
        var targetThings = [];
        var matchIndex = [];
        var len = this.thing_array.length;
        for (var i = 0; i < targetNames.length; i++) {
            var targetThing = [];
            for (var j = 0; j < len; j++) {
                var thing = this.thing_array[j];
                var tagNames = thing.tagName;
                for (var k = 0; k < tagNames.length; k++) {
                    if (tagNames[k] == targetNames[i]) {
                        targetThing.push(thing);
                        matchIndex.push(j);
                        break;
                    }
                }
            }
            targetThings.push({"targetName": targetNames[i], "targetThing": targetThing});
        }
        // 将匹配出来的东西从总的里面删除
//        matchIndex.sort(this.sortNumber);
//        var n = matchIndex.length;
//        while (n--) {
//            this.thing_array.splice(matchIndex[n], 1);
//        }
        return targetThings;
    };
    this.generateTarget = function (basicNumber, targetThings) {
        // 最终的目标数组
        var targets = [];
        for (var i = 0; i < targetThings.length; i++) {
            var r = Math.ceil(Math.random() * 1 + (basicNumber - 1));  // 该类型所需的数目
            var targetThing = targetThings[i]["targetThing"];
            var len = targetThing.length;
            var newTargetThing = [];
            var randomArray = noRepeatRandom(len);
            for (var j = 0; j < r; j++) {
                newTargetThing.push(targetThing[randomArray.pop()]);
            }
            targets.push({"targetName": targetThings[i]["targetName"], "targetThing": newTargetThing});
        }
        return targets;
    };
    this.generateFinalTask = function (taskNumber, targets, allThingsNumber) {
        //  生成最终的任务
        var finalThings = [];
        var finalTargets = [];
        var allTargetNumbers = 0;
        var finalThingsIndex = [];
        for (var i = 0; i < targets.length; i++) {
            var targetThing = targets[i]["targetThing"];
            allTargetNumbers += targetThing.length;
            finalTargets.push({"targetName": targets[i]["targetName"], "thingsNumber": targetThing.length, "completed": 0});
            for (var j = 0; j < targetThing.length; j++) {
                finalThings.push(targetThing[j]);
            }
            // 将目标东西从总的东西里面删除
            var m = targetThing.length;
            while (m--) {
                this.thing_array.splice(targetThing[m], 1);
            }
        }
        // 添加非目标东西
        var needNumbers = allThingsNumber - allTargetNumbers;
        var len = this.thing_array.length;
        var randomArray = noRepeatRandom(len);
        for (var k = 0; k < needNumbers; k++) {
            var n = randomArray.pop();
            finalThings.push(this.thing_array[n]);
            finalThingsIndex.push(n);
        }
        // 将finalThings乱序
        finalThings.sort(function () {
            return 0.5 - Math.random();
        });
        // 将起干扰作用的东西从总的东西里删除
        finalThingsIndex.sort(this.sortNumber);
        var m = finalThingsIndex.length;
        while (m--) {
            this.thing_array.splice(finalThingsIndex[m], 1);
        }
        return {targets: finalTargets, taskNumber: taskNumber, things: finalThings, otherThings: this.thing_array};
    };
    this.sortNumber = function (a, b) {
        return a - b;
    }
};