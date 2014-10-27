/**
 * Created by chengzhenhua on 14-9-29.
 */
/**
 * 动物层
 * 消除类游戏的主要逻辑可以分为以下几步：
 * 交换、检测、消除、填充、再检测
 * 每次检测只检测位置发生变动的精灵
 * @type {Function}
 */
var rowNumber = null;
var columnNumber = null;
var AnimalsLayer = cc.Layer.extend({
    clippingBgSprite: null, // 用于裁剪背景图片
    eliminateLayer: null,
    selectedAnimal: null,
    m_animalMatrix: [], // 存储动物矩阵
    leftBottomPosition: null,
    isResponseEvent: false, // 设置是否响应事件的字段,引擎的相关方法总是存在问题
    touchAfterThrees: 0,    // 点击之后，连续消除的3个次数，用于计算分数
    initWithProcess: function (jsondata) {
        cc.spriteFrameCache.addSpriteFrames(res.animals_plist);
        cc.spriteFrameCache.addSpriteFrames(res.tile_select_plist);
        cc.spriteFrameCache.addSpriteFrames(res.destroy_effect_plist);
        cc.spriteFrameCache.addSpriteFrames(res.explode_plist);
        cc.spriteFrameCache.addSpriteFrames(res.title_text_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bear_plist);
        cc.spriteFrameCache.addSpriteFrames(res.cat_plist);
        cc.spriteFrameCache.addSpriteFrames(res.chicken_plist);
        cc.spriteFrameCache.addSpriteFrames(res.fox_plist);
        cc.spriteFrameCache.addSpriteFrames(res.frog_plist);
        cc.spriteFrameCache.addSpriteFrames(res.horse_plist);
        this.eliminateLayer = cc.Layer.create();    // 消除层
        this.createMatrix(jsondata);
        this.addChild(this.eliminateLayer);
        // 添加事件监听器
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    /**
     * 确定左下角精灵的坐标
     * @param y_len
     * @param x_len
     * @returns {{x: null, y: null}}
     */
    determineLeftBottom: function (y_len, x_len) {
        this.leftBottomPosition = {x: null, y: null};
        var centerP = cc.p(WinSize.width / 2, WinSize.height / 2);
        if (y_len & 1) {
            // 奇数行
            this.leftBottomPosition.y = centerP.y - parseInt(y_len / 2) * 44;
        } else {
            // 偶数行
            this.leftBottomPosition.y = centerP.y - (parseInt(y_len / 2) - 0.5) * 44;
        }
        this.leftBottomPosition.y = this.leftBottomPosition.y - 25; // 往下偏移
        if (x_len & 1) {
            // 奇数列
            this.leftBottomPosition.x = centerP.x - parseInt(x_len / 2) * 44;
        } else {
            // 偶数列
            this.leftBottomPosition.x = centerP.x - (parseInt(x_len / 2) - 0.5) * 44;
        }
    },
    /**
     * 创建动物矩阵
     * @param jsondata
     */
    createMatrix: function (jsondata) {
        var y_len = rowNumber = jsondata.length;
        var x_len = columnNumber = jsondata[0].length;
        this.clippingBgSprite = cc.Sprite.create(); // 动物的背景层
        var animalBgLayer = cc.Layer.create();
        this.addChild(animalBgLayer);
        this.determineLeftBottom(y_len, x_len);
        for (var i = y_len - 1; i >= 0; i--) {
            var animalsRow = jsondata[i];
            for (var j = 0; j < x_len; j++) {
                var animal = animalsRow[j];
                var index = animal["index"];
                // 只添加非空白的
                if (index > 0) {
                    var position = cc.p(this.leftBottomPosition.x + j * 44, this.leftBottomPosition.y + (y_len - 1 - i) * 44);
                    // 动物的背景
                    var bgSprite = cc.Sprite.create("#animal_bg.png");
                    bgSprite.setPosition(position);
                    animalBgLayer.addChild(bgSprite);
                    var copyBgSprite = cc.Sprite.create("#animal_bg.png");
                    copyBgSprite.setPosition(position);
                    this.clippingBgSprite.addChild(copyBgSprite);
                    // 动物
                    var animalSprite = AnimalSprite.createWithImageIndex(index);
                    animalSprite.setPosition(position);
                    animalSprite.tag = i * x_len + j;
                    this.m_animalMatrix[animalSprite.tag] = animalSprite;
                    this.eliminateLayer.addChild(animalSprite);
                }
            }
        }
        animalBgLayer.bake();
    },
    onTouchBegan: function (touch, event) {
        var _this = event.getCurrentTarget();
        if (_this.isResponseEvent) {
            var touchXY = _this.beginXY = touch.getLocation();
            var animals = _this.eliminateLayer.getChildren();
            if (_this.selectedAnimal === null) {
                for (var i = 0, len = animals.length; i < len; i++) {
                    var animal = animals[i];
                    var rect = cc.rect(animal.x - animal.width / 2, animal.y - animal.height / 2, animal.width, animal.height);
                    if (cc.rectContainsPoint(rect, touchXY)) {
                        _this.selectedAnimal = animal;
                        break;
                    }
                }
                if (_this.selectedAnimal != null) {
                    _this.selectedAnimal.displayLightRing();
                }
            } else {
                var currentAnimal = null;
                for (var i = 0, len = animals.length; i < len; i++) {
                    var animal = animals[i];
                    var rect = cc.rect(animal.x - animal.width / 2, animal.y - animal.height / 2, animal.width, animal.height);
                    if (cc.rectContainsPoint(rect, touchXY)) {
                        currentAnimal = animal;
                        break;
                    }
                }
                if (currentAnimal != null) {
                    /**
                     * 交换情况一：
                     * 两次点击的动物是相邻的两个
                     */
                    _this.handleAnimalSwap(_this.selectedAnimal, currentAnimal);
                }
            }
        }
        return true;
    },
    onTouchEnded: function (touch, event) {
        var _this = event.getCurrentTarget();
        if (_this.isResponseEvent) {
            var touchXY = touch.getLocation();
            /**
             * 交换情况二：
             * 拖动交换相邻的两个动物
             */
            if (_this.selectedAnimal != null) {
                var selectedTag = _this.selectedAnimal.tag;
                var adjoinedTag = null;
                // 向上
                if (touchXY.y - _this.beginXY.y > 10 && Math.abs(_this.beginXY.x - touchXY.x) < 10) {
                    adjoinedTag = selectedTag - columnNumber;
                    if (adjoinedTag >= 0) {
                        _this.handleAnimalSwap(_this.selectedAnimal, _this.m_animalMatrix[adjoinedTag]);
                    }
                }
                // 向下
                if (_this.beginXY.y - touchXY.y > 10 && Math.abs(_this.beginXY.x - touchXY.x) < 10) {
                    adjoinedTag = selectedTag + columnNumber;
                    if (adjoinedTag < columnNumber * rowNumber) {
                        _this.handleAnimalSwap(_this.selectedAnimal, _this.m_animalMatrix[adjoinedTag]);
                    }
                }
                // 向左
                if (_this.beginXY.x - touchXY.x > 10 && Math.abs(_this.beginXY.y - touchXY.y) < 10) {
                    adjoinedTag = selectedTag - 1;
                    if (adjoinedTag >= 0) {
                        _this.handleAnimalSwap(_this.selectedAnimal, _this.m_animalMatrix[adjoinedTag]);
                    }
                }
                // 向右
                if (touchXY.x - _this.beginXY.x > 10 && Math.abs(_this.beginXY.y - touchXY.y) < 10) {
                    adjoinedTag = selectedTag + 1;
                    if (adjoinedTag < columnNumber * rowNumber) {
                        _this.handleAnimalSwap(_this.selectedAnimal, _this.m_animalMatrix[adjoinedTag]);
                    }
                }
            }
        }
    },
    /**
     * 处理交换
     * @param firstTag
     * @param secondTag
     */
    handleAnimalSwap: function (selectedAnimal, currentAnimal) {
        if (this.isAdjoined(selectedAnimal, currentAnimal)) {
            this.swapAdjoinAnimal(selectedAnimal, currentAnimal);
            if (this.selectedAnimal != null) {
                this.selectedAnimal.removeChildByTag(SPRITE_TAG.animal_light_ring);
                this.selectedAnimal = null;
            }
        } else {
            this.selectedAnimal.removeChildByTag(SPRITE_TAG.animal_light_ring);
            this.selectedAnimal = currentAnimal;
            this.selectedAnimal.displayLightRing();
        }
    },
    /**
     * 判断两个动物是否相邻
     * @param firstTag
     * @param secondTag
     * @returns {boolean}
     */
    isAdjoined: function (firstAnimal, secondAnimal) {
        var firstTag = firstAnimal.tag;
        var secondTag = secondAnimal.tag;
        var first_i = parseInt(firstTag / columnNumber);
        var first_j = firstTag % columnNumber;
        var second_i = parseInt(secondTag / columnNumber);
        var second_j = secondTag % columnNumber;
        if (first_i === second_i && (Math.abs(first_j - second_j)) === 1) {
            return true;
        }
        if (first_j === second_j && (Math.abs(first_i - second_i)) === 1) {
            return true;
        }
        return false;
    },
    /**
     * 获得可以消除的动物
     * @param animalSprite
     */
    getCanEliminateAnimals: function (animalSprite) {
        var row = parseInt(animalSprite.tag / columnNumber);
        var col = animalSprite.tag % columnNumber;
        // 垂直方向寻找
        var eliminateVertical = [];
        eliminateVertical.push(animalSprite);
        // 向上
        var neighbor = row - 1;
        var neighborAnimal = null;
        while (neighbor >= 0) {
            neighborAnimal = this.eliminateLayer.getChildByTag(neighbor * columnNumber + col);
            if (neighborAnimal != null && neighborAnimal.animal_index === animalSprite.animal_index) {
                eliminateVertical.push(neighborAnimal);
                neighbor--;
            } else {
                break;
            }
        }
        // 向下
        neighbor = row + 1;
        while (neighbor < rowNumber) {
            neighborAnimal = this.eliminateLayer.getChildByTag(neighbor * columnNumber + col);
            if (neighborAnimal != null && neighborAnimal.animal_index === animalSprite.animal_index) {
                eliminateVertical.push(neighborAnimal);
                neighbor++;
            } else {
                break;
            }
        }
        // 水平方向寻找
        var eliminateHorizontal = [];
        eliminateHorizontal.push(animalSprite);
        // 向前
        neighbor = col - 1;
        while (neighbor >= 0) {
            neighborAnimal = this.eliminateLayer.getChildByTag(row * columnNumber + neighbor);
            if (neighborAnimal != null && neighborAnimal.animal_index === animalSprite.animal_index) {
                eliminateHorizontal.push(neighborAnimal);
                neighbor--;
            } else {
                break;
            }
        }
        // 向后
        neighbor = col + 1;
        while (neighbor < columnNumber) {
            neighborAnimal = this.eliminateLayer.getChildByTag(row * columnNumber + neighbor);
            if (neighborAnimal != null && neighborAnimal.animal_index === animalSprite.animal_index) {
                eliminateHorizontal.push(neighborAnimal);
                neighbor++;
            } else {
                break;
            }
        }
        return eliminateHorizontal.length >= eliminateVertical.length ? eliminateHorizontal : eliminateVertical;
    },
    /**
     * 交换相邻动物
     * @param firstAnimal
     * @param secondAnimal
     */
    swapAdjoinAnimal: function (firstAnimal, secondAnimal) {
        var firstPosition = this.positionOfItem(Math.floor(firstAnimal.tag / rowNumber), firstAnimal.tag % rowNumber);
        var secondPosition = this.positionOfItem(Math.floor(secondAnimal.tag / rowNumber), secondAnimal.tag % rowNumber);
        var tempTag = firstAnimal.tag;
        firstAnimal.tag = secondAnimal.tag;
        secondAnimal.tag = tempTag;
        this.m_animalMatrix[firstAnimal.tag] = firstAnimal;
        this.m_animalMatrix[secondAnimal.tag] = secondAnimal;
        var countCallback = 0;
        var moveFin = cc.callFunc(function () {
            countCallback++;
            if (countCallback === 2) {
                // 判断交换后是否可以消除
                var checkFirst = this.checkOnceEliminate(firstAnimal);
                var checkSecond = this.checkOnceEliminate(secondAnimal);
                if (checkFirst === false && checkSecond === false) {
                    var tempTag = firstAnimal.tag;
                    firstAnimal.tag = secondAnimal.tag;
                    secondAnimal.tag = tempTag;
                    this.m_animalMatrix[firstAnimal.tag] = firstAnimal;
                    this.m_animalMatrix[secondAnimal.tag] = secondAnimal;
                    firstAnimal.runAction(cc.moveTo(0.2, firstPosition));
                    secondAnimal.runAction(cc.moveTo(0.2, secondPosition));
                } else {
                    this.touchAfterThrees = 0;
                    gameLayer.gameStatusLayer.updateStepNumber(1);
                }
            }
        }, this);
        firstAnimal.runAction(cc.sequence(cc.moveTo(0.2, secondPosition), moveFin));
        secondAnimal.runAction(cc.sequence(cc.moveTo(0.2, firstPosition), moveFin));
    },
    /**
     * 删除动物
     * @param eliminateAnimals
     */
    removeAnimal: function (removedAnimal) {
        this.m_animalMatrix[removedAnimal.tag] = null;
        cc.pool.putInPool(removedAnimal);
    },
    /**
     * 处理消除逻辑
     * @param animal    被检测的元素
     */
    checkOnceEliminate: function (animal) {
        var eliminateAnimals = this.getCanEliminateAnimals(animal);
        var removeLength = eliminateAnimals.length;
        var isEliminated = false;
        if (removeLength >= 3) {
            // 优先处理特殊消除
            for (var k = 0; k < removeLength; k++) {
                var sprite = eliminateAnimals[k];
                if (sprite != null) {
                    // 直线消除
                    if (sprite.eliminate_type === ELIMINATE_TYPE.line_eliminate ||
                        sprite.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
                        this.isResponseEvent = false;
                        gameLayer.handleLineEliminate(sprite, eliminateAnimals);
                        isEliminated = true;
                    }
                }
            }
            if (isEliminated === false) {
                var score = null;
                if (removeLength === 3) {
                    this.isResponseEvent = false;
                    this.touchAfterThrees++;
                    score = this.touchAfterThrees * 30;
                    gameLayer.handleThreeEliminate(score, eliminateAnimals);
                    isEliminated = true;
                }
                if (removeLength >= 4) {
                    this.isResponseEvent = false;
                    this.touchAfterThrees++;
                    score = this.touchAfterThrees * 30;
                    // 标记直线消除元素(注意垂直关系)
                    var makeUpAnimal = eliminateAnimals[0];
                    if (makeUpAnimal.tag % rowNumber === eliminateAnimals[1].tag % rowNumber) {
                        makeUpAnimal.eliminate_type = ELIMINATE_TYPE.line_eliminate;
                    } else {
                        makeUpAnimal.eliminate_type = ELIMINATE_TYPE.column_eliminate;
                    }
                    makeUpAnimal.makeUpLineEffect();
                    eliminateAnimals.splice(0, 1);
                    gameLayer.handleThreeEliminate(score, eliminateAnimals);
                    isEliminated = true;
                }
            }
        }
        return isEliminated;
    },
    /**
     * 填补空缺
     * @param _this
     */
    fillVacancies: function (eliminateNumOfAnimal, _this) {
        // 1.每一列将上边的移动到下边
        var animal = null;
        var waitCheckAnimals = [];
        var eliminateNumOfAnimal = eliminateNumOfAnimal;
        for (var j = 0; j < columnNumber; j++) {
            var removeOfCol = 0;    // 记录一列中空缺的精灵数
            // 有空缺的列上边的动物往下移
            for (var i = rowNumber - 1; i >= 0; i--) {
                animal = _this.m_animalMatrix[i * rowNumber + j];
                if (typeof animal != "undefined") {
                    if (animal === null) {
                        removeOfCol++;
                    } else {
                        if (removeOfCol > 0) {
                            waitCheckAnimals.push(animal);
                            // 计算精灵的新行数
                            var newRow = i + removeOfCol;
                            // 移动到下面的空缺位
                            _this.m_animalMatrix[newRow * rowNumber + j] = animal;
                            _this.m_animalMatrix[i * rowNumber + j] = null;
                            animal.tag = newRow * rowNumber + j;
                            var move_action = cc.moveTo(0.5, _this.positionOfItem(newRow, j));
                            animal.stopAllActions();    // 必须停止，否则会出错
                            animal.runAction(move_action);
                        }
                    }
                }
            }
            // 创建新的精灵并让其落到上方空缺的位置
            if (removeOfCol > 0) {
                // 由于矩形是不规则的，要矫正出现位置
                var undefinedOfCol = 0;
                for (var m = 0; m < rowNumber; m++) {
                    animal = _this.m_animalMatrix[m * rowNumber + j];
                    if (typeof animal === "undefined") {
                        undefinedOfCol++;
                    } else {
                        break;
                    }
                }
                var tempRemoveOfCol = removeOfCol;
                for (var i = removeOfCol + undefinedOfCol - 1; i >= undefinedOfCol; i--) {
                    var newAnimal = _this.createNewAnimal();
                    waitCheckAnimals.push(newAnimal);
                    newAnimal.tag = i * rowNumber + j;
                    _this.m_animalMatrix[newAnimal.tag] = newAnimal;
                    newAnimal.setPosition(_this.positionOfItem(i - tempRemoveOfCol, j));
                    var moveAction = cc.moveTo(0.5, _this.positionOfItem(i, j));
                    var afterFill = cc.callFunc(function () {
                        eliminateNumOfAnimal--;
                        if (eliminateNumOfAnimal === 0) {
                            _this.checkContinuousEliminate(waitCheckAnimals);
                        }
                    }, _this);
                    newAnimal.runAction(cc.sequence(moveAction, afterFill));
                    _this.eliminateLayer.addChild(newAnimal);
                }
            }
        }
    },
    /**
     * 检测是否可以继续消除
     * @param moveAnimals 每次消除只检测位置发生变动的元素，新的消除是由其造成的
     */
    checkContinuousEliminate: function (moveAnimals) {
        if (gameLayer.isGameOver === false) {
            var failureLength = 0;
            var checkLength = moveAnimals.length;
            for (var k = 0; k < checkLength; k++) {
                var checkAnimal = moveAnimals[k];
                if (checkAnimal != null) {
                    if (this.checkOnceEliminate(checkAnimal) === false) {
                        failureLength++;
                    }
                }
            }
            if (checkLength === failureLength) {
                this.isResponseEvent = true;    // 不能再继续消除
                // 10秒中内用户没有成功消除则提示
                this.unscheduleAllCallbacks();
                this.schedule(function () {
                    if (this.isResponseEvent && gameLayer.isTaskFinished === false) {
                        var promptAnimals = this.findSwapCanEliminate();
                        if (promptAnimals != null) {
                            for (var i = 0, len = promptAnimals.length; i < len; i++) {
                                promptAnimals[i].showShakePrompt();
                            }
                        }
                    } else {
                        this.unscheduleAllCallbacks();
                    }
                }, 10);
            }
        }
    },
    /**
     * 显示销毁特效
     * @param position
     * @param eliminateNum
     * @param afterDestroy
     */
    displayDestroyEffect: function (position, eliminateNum, afterDestroy) {
        var destroy_effect = cc.Sprite.create("#destroy_effect_2.png");
        destroy_effect.setPosition(position);
        var animFrames = [];
        for (var i = 0; i < 21; i++) {
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("destroy_effect_" + i + ".png"));
        }
        var animation = cc.Animation.create(animFrames, 0.02);
        var animate = cc.Animate.create(animation);
        var callback = cc.callFunc(function () {
            destroy_effect.removeFromParent();
            if (afterDestroy != null) {
                afterDestroy(eliminateNum, this);
            }
        }, this);
        destroy_effect.runAction(cc.sequence(animate, callback));
        gameLayer.commonEffectLayer.addChild(destroy_effect);
    },
    /**
     * 由行列号获得位置坐标
     * @param row
     * @param col
     * @returns {cc.Point|*}
     */
    positionOfItem: function (row, col) {
        return cc.p(this.leftBottomPosition.x + col * 44,
                this.leftBottomPosition.y + (rowNumber - 1 - row) * 44);
    },
    /**
     * 显示每次消除的得分情况
     */
    displayScoreEffect: function (score, position) {
        // 找出标签最小的在它的左上角显示这次的得分
        var scoreLabel = cc.LabelBMFont.create(score || "0", res.rising_score_fnt);
        scoreLabel.attr({
            scale: 0.8,
            x: position.x - 12,
            y: position.y
        });
        var scoreMove = cc.moveBy(0.2, cc.p(0, 10));
        var scoreFadeout = cc.fadeOut(1.5);
        var callback = cc.callFunc(function () {
            scoreLabel.removeFromParent();
        }, this);
        scoreLabel.runAction(cc.sequence(scoreMove, scoreFadeout, callback));
        gameLayer.commonEffectLayer.addChild(scoreLabel);
    },
    /**
     * 显示直线消除特效
     * @param animal
     */
    displayLineEffect: function (animal, callbackFunc) {
        var sprite = cc.Sprite.create("#speed_line0000");
        sprite.setPosition(animal.getPosition());
        if (animal.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
            sprite.setRotation(90); // 列
        }
        var scaleAction = cc.scaleTo(0.3, 2, 1.2);
        var callback = cc.callFunc(function () {
            if (callbackFunc != null) {
                callbackFunc();
            }
            sprite.removeFromParent();
        }, this);
        sprite.runAction(cc.sequence(scaleAction, callback));
        gameLayer.commonEffectLayer.addChild(sprite);
    },
    /**
     * 直线特效中，找到属于同一行或列的动物
     * @param animal
     * @param columnOrLine
     */
    findSameLineAnimal: function (animal) {
        var animals = [];
        if (animal.eliminate_type === ELIMINATE_TYPE.line_eliminate) {
            //  同一行
            var startIndex = parseInt(animal.tag / rowNumber) * columnNumber;
            for (var i = 0; i < columnNumber; i++) {
                var sprite = this.m_animalMatrix[startIndex + i];
                if (sprite != null) {
                    animals.push(sprite)
                }
            }
        }
        if (animal.eliminate_type === ELIMINATE_TYPE.column_eliminate) {
            //  同一列
            var col = animal.tag % rowNumber;
            for (var i = 0; i < rowNumber; i++) {
                var sprite = this.m_animalMatrix[rowNumber * i + col];
                if (sprite != null) {
                    animals.push(sprite)
                }
            }
        }
        return animals;
    },
    /**
     * 获得交换后可消除的元素
     * 分两种情况: 1.两个紧挨着相同的元素
     *             2.两个相同的元素中间空一个
     */
    findSwapCanEliminate: function () {
        var totalLength = this.m_animalMatrix.length;
        var eliminates = null;
        for (var i = 0; i < totalLength; i++) {
            var animalSp = this.m_animalMatrix[i];
            if (animalSp != null) {
                var row = parseInt(animalSp.tag / columnNumber);
                var col = animalSp.tag % columnNumber;
                // 第一种情况
                // 上边
                if (row >= 2 && this.m_animalMatrix[(row - 2) * columnNumber + col] != null) {
                    eliminates = this.checkSwapCanEliminate(animalSp, (row - 1) * columnNumber + col, (row - 2) * columnNumber + col - 1,
                            (row - 2) * columnNumber + col + 1, (row - 3) * columnNumber + col);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 下边
                if (row <= rowNumber - 3 && this.m_animalMatrix[(row + 2) * columnNumber + col] != null) {
                    eliminates = this.checkSwapCanEliminate(animalSp, (row + 1) * columnNumber + col, (row + 2) * columnNumber + col - 1,
                            (row + 2) * columnNumber + col + 1, (row + 3) * columnNumber + col);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 左边
                if (col >= 2 && this.m_animalMatrix[row * columnNumber + col - 2] != null) {
                    eliminates = this.checkSwapCanEliminate(animalSp, row * columnNumber + col - 1, (row - 1) * columnNumber + col - 2,
                            (row + 1) * columnNumber + col - 2, col === 2 ? null : col);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 右边
                if (col <= rowNumber - 3 && this.m_animalMatrix[row * columnNumber + col + 2] != null) {
                    eliminates = this.checkSwapCanEliminate(animalSp, row * columnNumber + col + 1, (row - 1) * columnNumber + col + 2,
                            (row + 1) * columnNumber + col + 2, col === rowNumber - 3 ? null : col);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 第二种情况
                // 上边
                if (row >= 2) {
                    eliminates = this.checkSwapCanEliminate(animalSp, (row - 2) * columnNumber + col, (row - 1) * columnNumber + col - 1,
                            (row - 1) * columnNumber + col + 1, null);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 下边
                if (row <= rowNumber - 3) {
                    eliminates = this.checkSwapCanEliminate(animalSp, (row + 2) * columnNumber + col, (row + 1) * columnNumber + col - 1,
                            (row + 1) * columnNumber + col + 1, null);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 左边
                if (col >= 2) {
                    eliminates = this.checkSwapCanEliminate(animalSp, row * columnNumber + col - 2, (row - 1) * columnNumber + col - 1,
                            (row + 1) * columnNumber + col - 1, null);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
                // 右边
                if (col <= rowNumber - 3) {
                    eliminates = this.checkSwapCanEliminate(animalSp, row * columnNumber + col + 2, (row - 1) * columnNumber + col + 1,
                            (row + 1) * columnNumber + col + 1, null);
                    if (eliminates != null && eliminates.length === 3) {
                        return eliminates;
                    }
                }
            }
        }
        return eliminates;
    },
    checkSwapCanEliminate: function (animalSp, adjoinIndex, one, two, three) {
        var canEliminates = [];
        var adjoinSp = this.m_animalMatrix[adjoinIndex];
        if (adjoinSp != null && adjoinSp.animal_index === animalSp.animal_index) {
            var firstSp = this.m_animalMatrix[one];
            if (firstSp != null && firstSp.animal_index === animalSp.animal_index) {
                canEliminates.push(animalSp, adjoinSp, firstSp)
                return canEliminates;
            }
            var secondSp = this.m_animalMatrix[two];
            if (secondSp != null && secondSp.animal_index === animalSp.animal_index) {
                canEliminates.push(animalSp, adjoinSp, secondSp)
                return canEliminates;
            }
            if (three != null) {
                var thirdSp = this.m_animalMatrix[three];
                if (thirdSp != null && thirdSp.animal_index === animalSp.animal_index) {
                    canEliminates.push(animalSp, adjoinSp, thirdSp)
                    return canEliminates;
                }
            }
        }
        return null;
    },
    /**
     * 创造新的动物
     * 不同的关卡需要的动物的种类不同
     */
    createNewAnimal: function () {
        var randomIndex = null;
        // 第一关不产生小熊
        if (gameLayer.processIndex === 1) {
            while (true) {
                randomIndex = Math.floor(Math.random() * 6) + 1;
                if (randomIndex != 3) {
                    break;
                }
            }
        }
        if (cc.pool.hasObject(AnimalSprite)) {
            return  cc.pool.getFromPool(AnimalSprite, randomIndex);
        } else {
            return AnimalSprite.createWithImageIndex(randomIndex);
        }
    }
});
AnimalsLayer.createWithProcess = function (jsondata) {
    var layer = new AnimalsLayer();
    layer.initWithProcess(jsondata);
    return layer;
};
