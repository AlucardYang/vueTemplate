window.remCount = 0;
var setRem = function () {
    var size = document.documentElement.clientWidth / 375 * 100;
    //PC端訪問時，默認viewport為100
    if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        size = 100;
    }
    document.documentElement.style.fontSize = size + 'px';
}

setRem();

//解决iOS safari 禁用缩放无效问题
window.onload = function () {
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    document.addEventListener('dblclick', function (e) {
        e.preventDefault();
    });
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
};