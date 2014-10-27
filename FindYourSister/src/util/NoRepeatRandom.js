/**
 * Created by yicha on 14-8-18.
 */
/*
 生成非重复的随机数
 */
var noRepeatRandom = function(len) {
    var array = [];
    for(var i = 0; i < len; i++) {
       array.push(i);
    }
    var i = array.length, j = 0, temp;
    while(i--) {
        j = Math.floor(Math.random() * i);
        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};