/**
 * Created by yicha on 14-7-28.
 */
// 利用HTML5的本地存储保存游戏的进度
var LocalStorageUtil = function(){
    this.init();
}
LocalStorageUtil.prototype={
    themesKey:"THEMES",
    init:function(){
        if(!localStorage) return;
        var themeObjStr = localStorage.getItem(this.themesKey);
        var themeObjs;
        if(!themeObjStr){
            // 第一次玩游戏时初始化进度，并存储到localStorage
            themeObjs = this.initThemeObjs();
            localStorage.setItem(this.themesKey,JSON.stringify(themeObjs));
        }
        if(!themeObjs){
            themeObjs = JSON.parse(themeObjStr);
        }
        return themeObjs;
    },
    initThemeObjs:function(){
        var themeObjs = [];
        for(var i=0;i<6;i++){
            if(i===0){
                themeObjs.push({
                    "islock":false,
                    "checkpoints":this.initCheckpointObjs()
                })
            }else{
                themeObjs.push({
                    "islock":true,
                    "checkpoints":this.initCheckpointObjs()
                })
            }
        }
        return themeObjs;
    },
    initCheckpointObjs:function(){
        // 初始化关卡
        var checkpointObjs = [];
        for(var i=0;i<40;i++){
            if(i===0){
                checkpointObjs.push({
                    "islock":false
                })
            }else{
                checkpointObjs.push({
                    "islock":true
                })
            }
        }
        return checkpointObjs;
    },
    getThemes:function(){
        // 返回主题是否上锁的数组
        if(!localStorage) return;
        var parksObjStr = localStorage.getItem(this.themesKey);
        if(parksObjStr){
            var themes = JSON.parse(parksObjStr);
            var themeLocks = [];
            for(var i=0;i<themes.length;i++){
                var theme = themes[i];
                themeLocks.push(theme["islock"]);
            }
            return themeLocks;
        }
        return [false];
    },
    getCheckpointByThemeIndex:function(index){
        // 根据主题返回对应的关卡是否上锁的数组
        if(!localStorage) return;
        var themeObjStr = localStorage.getItem(this.themesKey);
        if(themeObjStr){
            var themeObj = JSON.parse(themeObjStr);
            return themeObj[index];
        }
        return null;
    },
    setLastThemeCheckpoint: function(themeIndex, checkpointIndex) {
        // 设置新开启的关卡
        if (!localStorage)return;
        var themes = JSON.parse(localStorage.getItem(this.themesKey));
        var checkpoints = themes[themeIndex]["checkpoints"];
        checkpoints[checkpointIndex]["islock"] = false;
        if(checkpointIndex <= 38) {
            themes[themeIndex]["checkpoints"] = checkpoints;
        }
        if(checkpointIndex === 39) {
            themes[themeIndex+1]["islock"] = false;
            themes[themeIndex]["checkpoints"] = checkpoints;
        }
        localStorage.setItem(this.themesKey, JSON.stringify(themes));
    }
}
var localStorageUtil;
LocalStorageUtil.getInstance = function(){
    if(!localStorageUtil){
        localStorageUtil = new LocalStorageUtil();
    }
    return localStorageUtil;
}