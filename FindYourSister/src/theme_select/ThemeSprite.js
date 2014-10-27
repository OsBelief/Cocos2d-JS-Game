/**
 * Created by yicha on 14-8-6.
 */
// 主题精灵
var ThemeSprite = cc.Sprite.extend({
    themeImage: null,
    themeName: null,
    islock: null,
    currentProcess: null,
    initWithTheme: function(theme) {
        this.themeImage = theme["themeImage"];
        this.themeName = theme["themeName"];
        this.islock = theme["islock"];
        this.currentProcess = theme["currentProcess"];
        if(theme["islock"] === false) {
            this.initWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(theme["themeImage"] + "_1.png"));
        } else {
            this.initWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(theme["themeImage"] + "_2.png"));
        }
    },
    setThemeImage: function(i) {
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.themeImage + "_" + i + ".png"));
    },
    getThemeName: function() {
        if(this.islock === false) {
            return this.themeName;
        } else {
            return "故事锁定"
        }
    },
    getCurrentProcess: function() {
        if(this.islock === false && this.currentProcess > 0) {
            return this.currentProcess;
        } else {
            return null
        }
    }
});
ThemeSprite.createWithTheme = function(theme) {
    var sp = new ThemeSprite();
    sp.initWithTheme(theme);
    return sp;
};