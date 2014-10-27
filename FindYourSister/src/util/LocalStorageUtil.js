/**
 * Created by yicha on 14-8-5.
 */
// 利用HTML5的本地存储保存游戏配置信息
var LocalStorageUtil = function () {
};
LocalStorageUtil.prototype = {
    playerKey: "PLAYER",
    player: null,
    getPlayer: function () {
        if (!localStorage) return;
        var playerStr = localStorage.getItem(this.playerKey);
        if (playerStr != null) {
            this.player = JSON.parse(playerStr);
        }
        return this.player;
    },
    setNewPlayer: function (player) {
        // 设置新用户
        var str = JSON.stringify(player);
        localStorage.setItem(this.playerKey, str);
    },
    setLeaveTheme: function (level) {
        this.player.leaveTheme = level;
        this.setNewPlayer(this.player);
    },
    getAllThemes: function () {
        if (this.player === null) {
            this.getPlayer();
        }
        return this.player.themes;
    },
    getLeaveThemeIndex: function () {
        return this.player["leaveTheme"];
    },
    getCurrentProcess: function (index) {
        var themes = this.player["themes"];
        var theme = themes[index];
        return theme["currentProcess"];
    },
    getBossAndName: function () {
        return {
            bossIndex: this.player["bossIndex"],
            playerName: this.player["playerName"]
        };
    },
    getPersonalSkill: function () {
        return this.player.personalSkill
    },
    getCoinNumber: function () {
        return this.player.coinNumber
    },
    setCurrentProcess: function (themeIndex, number) {
        // 更新该主题的当前进度
        var themes = this.player["themes"];
        var theme = themes[themeIndex];
        theme.currentProcess = number;
        this.setNewPlayer(this.player);
    },
    setRestartProcess: function (themeIndex) {
        // 设置重新开始该主题
        var themes = this.player["themes"];
        var theme = themes[themeIndex];
        theme.currentProcess = 0;
        this.setNewPlayer(this.player);
    },
    decreaseSkillNumber: function (skillName) {
        var personalSkill = this.player.personalSkill;
        for (var i = 0; i < personalSkill.length; i++) {
            var skill = personalSkill[i];
            if (skill.skillName === skillName) {
                skill.availableNumber--;
                this.setNewPlayer(this.player);
                break;
            }
        }
    },
    increaseSkillNumber: function (skillName) {
        var personalSkill = this.player.personalSkill;
        for (var i = 0; i < personalSkill.length; i++) {
            var skill = personalSkill[i];
            if (skill.skillName === skillName) {
                skill.availableNumber++;
                this.setNewPlayer(this.player);
                break;
            }
        }
    },
    increaseCoinNumber: function (n) {
        this.player.coinNumber += n;
        this.setNewPlayer(this.player);
    },
    decreaseCoinNumber: function (n) {
        this.player.coinNumber -= n;
        this.setNewPlayer(this.player);
    },
    getCoinAndSkill: function () {
        var coinNumber = this.getCoinNumber();
        var skill = this.getPersonalSkill();
        return {coinNumber: coinNumber, personalSkill: skill};
    }
};
var localStorageUtil;
LocalStorageUtil.getInstance = function () {
    if (!localStorageUtil) {
        localStorageUtil = new LocalStorageUtil();
    }
    return localStorageUtil;
};