cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    LoaderScene.preload(start_resources, function () {
        cc.director.runScene(new StartScene());
    }, this);
};
cc.game.run();