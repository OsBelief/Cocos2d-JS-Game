/**
 * Created by chengzhenhua on 14-9-28.
 */
/**
 * 游戏场景
 * @type {Function}
 */
var WinSize = null;
var gameLayer = null;
var GameLayer = cc.Layer.extend({
    processData: null,
    processIndex: null,
    gameStatusLayer: null,
    animalLayer: null,
    isTaskFinished: false,  // 任务是否已完成
    commonEffectLayer: null,   // 用来显示各种特效
    isGameOver: false,
    initWithProcess: function (processIndex) {
        cc.spriteFrameCache.addSpriteFrames(res.home_effects_plist);
        this.processIndex = processIndex;
        switch (processIndex) {
            case 1:
                this.guide_status = 1;  // 每一关的指导内容不同
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
        }
        WinSize = cc.director.getWinSize();
        var dataURL = "res/process/process_" + processIndex + ".json";
        this.loadProcessData(dataURL, this.initSubLayers);
        gameLayer = this;
    },
    /**
     * 裁剪背景图片
     */
    clippingBackGround: function (stencil) {
        // 对于裁剪，虽然不是很理解，但是目的达到了
        var bgLayer = cc.Layer.create();
        var bgSprite = cc.Sprite.create(res.background_png);
        bgSprite.attr({
            x: WinSize.width / 2,
            y: WinSize.height / 2
        });
        bgLayer.addChild(bgSprite);
        var clippingNode = cc.ClippingNode.create();
        clippingNode.setInverted(true);
        clippingNode.setStencil(stencil);   // 设置模板
        clippingNode.addChild(bgLayer); // 设置底板
        bgLayer.bake();
        this.addChild(clippingNode);
    },
    /**
     * 加载关卡数据
     */
    loadProcessData: function (processData, parseData) {
        var _this = this;
        cc.loader.loadJson(processData, function (err, data) {
            if (err) {
                return cc.log("load failed");
            } else {
                parseData(data, _this);
            }
        })
    },
    /**
     * 初始化子图层
     * @param data
     */
    initSubLayers: function (data, _this) {
        _this.processData = data;
        _this.animalLayer = AnimalsLayer.createWithProcess(_this.processData["animal_matrix"]);
        _this.animalLayer.tag = LAYER_TAG.animal_layer;
        _this.addChild(_this.animalLayer);
        _this.clippingBackGround(_this.animalLayer.clippingBgSprite);
        _this.gameStatusLayer = GameStatusLayer.createWithTasks(_this.processIndex, _this.processData["steps"], _this.processData["tasks"]);
        _this.gameStatusLayer.tag = LAYER_TAG.game_status_layer;
        _this.addChild(_this.gameStatusLayer);
        var taskHelperLayer = TaskHelperLayer.createWithTarget(_this.processData["tasks"]);
        _this.scheduleOnce(function () {
            _this.addChild(taskHelperLayer)
        }, 0.5);
        _this.commonEffectLayer = cc.Layer.create();
        _this.addChild(_this.commonEffectLayer);
    },
    /**
     * 开始游戏指导
     */
    beginGuideGame: function () {
        if (this.guide_status != null) {
            var gameStatusLayer = this.getChildByTag(LAYER_TAG.game_status_layer);
            gameStatusLayer.playTaskBoardEffect();
            this.doWithGameGuide(this.guide_status);
        }
    },
    /**
     * 处理游戏指导
     * @param guideType
     */
    doWithGameGuide: function (guideType) {
        var guideLayer = GuideLayer.createWithGuideIndex(guideType);
        guideLayer.tag = LAYER_TAG.guide_layer;
        this.addChild(guideLayer);
        if (guideType === GUIDE_INDEX.vertical) {
            var m_animalMatrix = this.animalLayer.m_animalMatrix;
            var animals = [];
            for (var i = 0; i < 4; i++) {
                var animal = m_animalMatrix[1 + i * 7];
                if (i === 0) {
                    animal.swap = true;
                    animal.swapDirection = "down";
                }
                if (i === 1) {
                    animal.swap = true;
                    animal.swapDirection = "up";
                }
                animals.push(animal);
            }
            var helpLayer = HelpLayer.createWithAnimalsAndGuide(animals, guideType);
            helpLayer.tag = LAYER_TAG.help_layer;
            this.addChild(helpLayer);
        }
        if (guideType === GUIDE_INDEX.horizontal) {

        }
    },
    /**
     * 完成一次指导
     * @param firstTag
     * @param secondTag
     */
    finishOneGuide: function (firstTag, secondTag) {
        var animalLayer = this.getChildByTag(LAYER_TAG.animal_layer);
        animalLayer.handleAnimalSwap(animalLayer.m_animalMatrix[firstTag], animalLayer.m_animalMatrix[secondTag]);
        var guideLayer = this.getChildByTag(LAYER_TAG.guide_layer);
        guideLayer.removeFromParent();
        if (this.processIndex === 1) {
            if (this.guide_status > 0 && this.guide_status < 3) {
                this.guide_status++;
            } else {
                this.guide_status = 0;
            }
        }
    },
    /**
     * 检查消除的元素是否是任务要求的
     * @param sprite
     */
    isTarget: function (sprite) {
        var tasks = this.processData["tasks"];
        for (var i = 0, len = tasks.length; i < len; i++) {
            if (sprite.animal_index === tasks[i]["target"]) {
                return true;
            }
        }
        return false;
    },
    /**
     * 处理三消的情况
     * @param eliminates
     */
    handleThreeEliminate: function (score, eliminates) {
        var minimumAnimal = eliminates[0];
        var isTarget = false;
        var eliminateNumOfAnimal = eliminates.length;
        var tempEliminateNum = eliminateNumOfAnimal;
        if (this.isTaskFinished === false) {
            isTarget = this.isTarget(minimumAnimal);
        }
        for (var i = 0; i < eliminateNumOfAnimal; i++) {
            var animal = eliminates[i];
            if (animal.tag < minimumAnimal.tag) {
                minimumAnimal = animal;
            }
            // 判断是否是任务要消除的
            if (isTarget) {
                var flyAnimal = AnimalSprite.createWithImageIndex(animal.animal_index);
                flyAnimal.setPosition(animal.getPosition());
                var afterFly = cc.callFunc(function (flyAnimal) {
                    return function () {
                        eliminateNumOfAnimal--;
                        if (eliminateNumOfAnimal === 0) {
                            this.gameStatusLayer.updateAnimalAmount(tempEliminateNum);
                            // 判断是否开始下一次指导
                            if (this.guide_status != null && this.guide_status != 0) {
                                this.scheduleOnce(function () {
//                                        this.doWithGameGuide(this.guide_status);
                                }, 1);
                            }
                        }
                        // 此处要多加注意，回调的时候flyAnimal已经改变了
                        flyAnimal.removeFromParent();
                    }
                }(flyAnimal), this);
                flyAnimal.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5, cc.p(190, 743)), cc.scaleTo(0.5, 0.8, 0.8))
                    , afterFly));
                this.commonEffectLayer.addChild(flyAnimal);
            }
            this.animalLayer.removeAnimal(animal);
            if (i === tempEliminateNum - 1) {
                this.animalLayer.displayDestroyEffect(animal.getPosition(), tempEliminateNum, this.animalLayer.fillVacancies);
            } else {
                this.animalLayer.displayDestroyEffect(animal.getPosition());
            }

        }
        this.gameStatusLayer.updateScore(score);
        this.animalLayer.displayScoreEffect(score, minimumAnimal.getPosition());
    },
    /**
     * 处理直线消除
     * @param makeupAnimal  标记为直线消除的动物
     * @param eliminateAnimals  和标记的一起消除的动物
     */
    handleLineEliminate: function (makeupAnimal, eliminateAnimals) {
        // 判断直线的方向和消除元素的方向是否一致
        if(eliminateAnimals != null) {
            if (makeupAnimal.eliminate_type === ELIMINATE_TYPE.line_eliminate) {
                // 同一列
                if (makeupAnimal.tag % rowNumber === eliminateAnimals[1].tag % rowNumber) {
                    for (var m = 0, len = eliminateAnimals.length; m < len; m++) {
                        var sameCol = eliminateAnimals[m];
                        if (sameCol != null && sameCol.eliminate_type === ELIMINATE_TYPE.normal_eliminate) {
                            this.animalLayer.removeAnimal(sameCol);
                            this.animalLayer.displayDestroyEffect(sameCol.getPosition());
                            this.gameStatusLayer.updateScore(10);
                            this.animalLayer.displayScoreEffect(10, sameCol.getPosition());
                        }
                    }
                }
            } else {
                // 同一行
                if (makeupAnimal.tag % rowNumber != eliminateAnimals[1].tag % rowNumber) {
                    for (var m = 0, len = eliminateAnimals.length; m < len; m++) {
                        var sameRow = eliminateAnimals[m];
                        if (sameRow != null && sameRow.eliminate_type === ELIMINATE_TYPE.normal_eliminate) {
                            this.animalLayer.removeAnimal(sameRow);
                            this.animalLayer.displayDestroyEffect(sameRow.getPosition());
                            this.gameStatusLayer.updateScore(10);
                            this.animalLayer.displayScoreEffect(10, sameRow.getPosition());
                        }
                    }
                }
            }
        }
        var removeAnimals = this.animalLayer.findSameLineAnimal(makeupAnimal);  // 第一个元素被标记为特殊消除
        var eliminateNumOfAnimal = removeAnimals.length;
        this.animalLayer.displayLineEffect(makeupAnimal);
        var numOfTarget = 0;
        for (var i = 0; i < eliminateNumOfAnimal; i++) {
            var animal = removeAnimals[i];
            // 判断是否是任务要消除的
            if (this.isTaskFinished === false && this.isTarget(animal)) {
                numOfTarget++;
                var flyAnimal = AnimalSprite.createWithImageIndex(animal.animal_index);
                flyAnimal.setPosition(animal.getPosition());
                var afterFly = cc.callFunc(function (flyAnimal) {
                    return function () {
                        numOfTarget--;
                        if (numOfTarget === 0) {
                            this.gameStatusLayer.updateAnimalAmount(numOfTarget);
                            // 判断是否开始下一次指导
                            if (this.guide_status != null && this.guide_status != 0) {
                                this.scheduleOnce(function () {
//                                        this.doWithGameGuide(this.guide_status);
                                }, 1);
                            }
                        }
                        flyAnimal.removeFromParent();
                    }
                }(flyAnimal), this);
                flyAnimal.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5, cc.p(190, 743)), cc.scaleTo(0.5, 0.8, 0.8))
                    , afterFly));
                this.commonEffectLayer.addChild(flyAnimal);
            }
            this.animalLayer.removeAnimal(animal);
            if (i === eliminateNumOfAnimal - 1) {
                this.animalLayer.displayDestroyEffect(animal.getPosition(), eliminateNumOfAnimal, this.animalLayer.fillVacancies);
            } else {
                this.animalLayer.displayDestroyEffect(animal.getPosition());
            }
            if (animal.eliminate_type === ELIMINATE_TYPE.line_eliminate
                || animal.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
                this.gameStatusLayer.updateScore(200);
                this.animalLayer.displayScoreEffect(200, animal.getPosition());
            } else {
                this.gameStatusLayer.updateScore(15);
                this.animalLayer.displayScoreEffect(15, animal.getPosition());
            }
        }
    },
    /**
     * 游戏成功
     */
    onGameSuccess: function () {
        this.isTaskFinished = true;
        cc.eventManager.removeListeners(this.animalLayer);  // 移除事件监听器
        this.schedule(function () {
            if (this.animalLayer.isResponseEvent) {
                var canSpecialEliminate = this.doWithSpecialEliminate(this.animalLayer.m_animalMatrix);
                if (canSpecialEliminate === false) {
                    this.unscheduleAllCallbacks();
                    this.isGameOver = true;
                    this.displayBonusTime();
                }
            }
        }, 0.5);
    },
    /**
     * 显示BonusTime
     */
    displayBonusTime: function () {
        var sprite = cc.Sprite.create("#title_text_overlay instance 10000");
        sprite.setPosition(cc.p(WinSize.width / 2, WinSize.height / 2));
        var scaleAction_1 = cc.scaleTo(0.3, 1.5, 1.5);
        var callback_1 = cc.callFunc(function () {
            sprite.setSpriteFrame("speed_line_yellow0000");
            var scaleAction_2 = cc.scaleTo(0.3, 1.2, 2);
            var callback_2 = cc.callFunc(function () {
                sprite.setSpriteFrame("bonustime_icon instance 10000");
                this.scheduleOnce(function () {
                    var sprite_2 = cc.Sprite.create("#speed_line_yellow0000");
                    sprite_2.setPosition(cc.p(WinSize.width / 2, WinSize.height / 2));
                    var scaleAction_3 = cc.scaleTo(0.3, 1.2, 1.5);
                    var scaleAction_4 = cc.scaleTo(0.5, 1.2, 2);
                    var callback_3 = cc.callFunc(function () {
                        sprite.removeFromParent();
                        sprite_2.removeFromParent();
                        this.displaySpeedLine();
                    }, this);
                    sprite_2.runAction(cc.sequence(scaleAction_3, callback_3));
                    sprite.runAction(scaleAction_4);
                    this.addChild(sprite_2);
                }, 0.8);
            }, this);
            sprite.runAction(cc.sequence(scaleAction_2, callback_2));
        }, this);
        sprite.runAction(cc.sequence(scaleAction_1, callback_1));
        this.addChild(sprite);
    },
    /**
     * 处理特殊的消除
     * @param animals
     */
    doWithSpecialEliminate: function (animals) {
        var isEliminated = false;
        for (var i = 0, len = animals.length; i < len; i++) {
            var sprite = animals[i];
            // 直线消除
            if (sprite != null) {
                if (sprite.eliminate_type === ELIMINATE_TYPE.line_eliminate || sprite.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
                    this.isResponseEvent = false;
                    gameLayer.handleLineEliminate(sprite);
                    isEliminated = true;
                }
            }
        }
        return isEliminated;
    },
    /**
     * 流星落到动物的位置
     */
    displaySpeedLine: function () {
        // 剩余步数每减一，飞星落下
        var steps_label = this.gameStatusLayer.steps_label;
        var m_animalMatrix = this.animalLayer.m_animalMatrix;
        var length = m_animalMatrix.length;
        var steps = null;
        var lineRemoves = [];   // 最后一次待消除的动物
        var count = parseInt(steps_label.getString());  // 此计数器用来判断所有的流星是否已消除
        this.schedule(function () {
            steps = parseInt(steps_label.getString());
            if (steps > 0) {
                steps--;
                var scaleAction = cc.scaleTo(0.1, 1.2, 1.2);
                var callback = cc.callFunc(function () {
                    steps_label.setScale(1, 1);
                    steps_label.setString(steps || "0");
                    // 流星随机落到动物上
                    var fallingstar_white = cc.Sprite.create("#fallingstar_white0000");
                    fallingstar_white.setAnchorPoint(cc.p(0.5, 1));
                    fallingstar_white.setPosition(steps_label.getPosition());
                    this.commonEffectLayer.addChild(fallingstar_white);
                    var animal = null;
                    while (true) {
                        var random = Math.floor(Math.random() * length);
                        animal = m_animalMatrix[random];
                        if (animal != null && animal.eliminate_type === ELIMINATE_TYPE.normal_eliminate) {
                            animal.eliminate_type = Math.floor(Math.random() * 2) + 1;
                            lineRemoves.push(animal);
                            break;
                        }
                    }
                    var position = this.animalLayer.positionOfItem(parseInt(animal.tag / rowNumber), animal.tag % rowNumber);
                    var endPosition = cc.p(position.x, position.y);
                    var angle = -Math.atan2(endPosition.x - steps_label.x, endPosition.y - steps_label.y);
                    angle = 180 - cc.radiansToDegrees(angle);
                    fallingstar_white.setRotation(angle);       // 以角度为单位
                    endPosition.y = endPosition.y + fallingstar_white.height * Math.sin(cc.degreesToRadians(90 - angle));   // 以弧度为单位
                    endPosition.x = endPosition.x + fallingstar_white.height * Math.cos(cc.degreesToRadians(90 - angle));
                    var moveAction = cc.moveTo(0.3, endPosition);
                    var callback = cc.callFunc(function () {
                        fallingstar_white.removeFromParent();
                        // 这也加分
                        this.gameStatusLayer.updateScore(2500);
                        this.animalLayer.displayScoreEffect(2500, animal.getPosition());
                        animal.makeUpLineEffect();
                        count--;
                    }, this);
                    fallingstar_white.runAction(cc.sequence(moveAction, callback));
                }, this);
                steps_label.runAction(cc.sequence(scaleAction, callback));
            } else {
                if (count === 0) {
                    this.unscheduleAllCallbacks();
                    this.doWithLastEliminate(lineRemoves);
                }
            }
        }, 0.2);
    },
    /**
     * 流星散落后，进行最后一次消除
     */
    doWithLastEliminate: function (lineRemoves) {
        var _this = this;
        var length = lineRemoves.length;
        // 逐个展示行(列)消除特效
        var recursiveRemove = function (i) {
            if (i >= length) {
                return;
            } else {
                var animal = lineRemoves[i];
                if (animal != null) {
                    var nextEliminate = function () {
                        var removeAnimals = _this.animalLayer.findSameLineAnimal(animal);
                        for (var j = 0, len = removeAnimals.length; j < len; j++) {
                            var animalTemp = removeAnimals[j];
                            if (animalTemp != null) {
                                _this.animalLayer.removeAnimal(animalTemp);
                                if (j === len - 1) {
                                    _this.animalLayer.displayDestroyEffect(animalTemp.getPosition(), len, _this.animalLayer.fillVacancies);
                                } else {
                                    _this.animalLayer.displayDestroyEffect(animalTemp.getPosition());
                                }
                                if (animalTemp.eliminate_type === ELIMINATE_TYPE.line_eliminate
                                    || animalTemp.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
                                    _this.gameStatusLayer.updateScore(200);
                                    _this.animalLayer.displayScoreEffect(200, animalTemp.getPosition());
                                } else {
                                    // 只消除进入视野的
                                    if (animalTemp.y < 500) {
                                        _this.gameStatusLayer.updateScore(15);
                                        _this.animalLayer.displayScoreEffect(15, animalTemp.getPosition());
                                    }
                                }
                            }
                        }
                        i = i + 1;
                        recursiveRemove(i);
                    };
                    _this.animalLayer.displayLineEffect(animal, nextEliminate);
                }
            }
        };
        recursiveRemove(0);
        // 最后检查是否有可消除的
        this.schedule(function () {
            if (this.commonEffectLayer.getChildren().length === 0) {
                this.isGameOver = false;
                this.unscheduleAllCallbacks();
                this.animalLayer.checkContinuousEliminate(this.animalLayer.m_animalMatrix);
                this.schedule(function () {
                    if (this.animalLayer.isResponseEvent) {
                        var canSpecialEliminate = this.doWithSpecialEliminate(this.animalLayer.m_animalMatrix);
                        if (canSpecialEliminate === false) {
                            this.unscheduleAllCallbacks();
                            this.onTrialEnd();
                        }
                    }
                }, 0.5);
            }
        }, 0.5);
    },
    /**
     * 试玩结束
     */
    onTrialEnd: function () {
        cc.pool.drainAllPools();    // 清空对象缓冲池
        var downLoadAppLayer = DownloadAppLayer.create();
        this.addChild(downLoadAppLayer);
    }
});
var GameScene = cc.Scene.extend({
    initWithProcess: function (processIndex, task) {
        var layer = new GameLayer();
        layer.initWithProcess(processIndex, task);
        this.addChild(layer);
    }
});
GameScene.createWithProcess = function (processIndex) {
    var gameScene = new GameScene();
    gameScene.initWithProcess(processIndex);
    return gameScene;
};