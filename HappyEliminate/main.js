cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(450, 800, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    LoaderScene.preload(g_resources, function () {
        var gameScene = GameScene.createWithProcess(1);
        cc.director.runScene(gameScene);
    }, this);
};
cc.game.run();