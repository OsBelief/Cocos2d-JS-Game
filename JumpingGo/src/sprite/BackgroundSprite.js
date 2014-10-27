/**
 * Created by yicha on 14-7-21.
 */
var BackgroundSprite = cc.Sprite.extend({
    color_index: null,
    ctor: function() {
        this._super();
        this.initWithFile(res.bg);
    },
    init: function(centerPoint) {
        this.setPosition(centerPoint);
//        this.schedule(this.changeColor, BG_FRAME_RATE, cc.REPEAT_FOREVER, 0);
//        this.color_index = Math.floor(Math.random()*10);
//        var rgb = BG_RGB[this.color_index];
//        this.setColor(cc.color(rgb.r, rgb.g, rgb.b, 0));
    }
//    changeColor: function() {
//        if(this.color_index === BG_RGB.length - 1) {
//            this.color_index = 0;
//        } else {
//            this.color_index++;
//        }
//        this.setColor(BG_RGB[this.color_index]);
//    }
});