const wx = require('weixin-js-sdk');

// 分享组件
export default {
    name: 'readReport',
    template: '<div></div>',
    props: {
        readUuid: ''
    },
    mounted: function () {
        this.readReport(this.readUuid);
    },
    methods: {
        guid: function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
        },
        readReport: function (readUuid, onReadyeNoReport) {
            var startTime = new Date().getTime();
            var maxScroll = 0;
            var isRdady = false;

            if (!readUuid) {
                const readUuid = this.guid();
            }

            var reportInterval = null;
            $(window).scroll(function () {
                var scrollTop = $(window).scrollTop();
                maxScroll = scrollTop > maxScroll ? scrollTop : maxScroll;
            })

            var report = function () {
                var pageH = document.body.scrollHeight;
                var windowH = $(window).height();
                var nowTime = +new Date();
                var time = Math.round((nowTime - startTime) / 1000);
                var degree = ((maxScroll + windowH) / pageH).toFixed(2) * 1;
                if (degree > 1) {
                    degree = 1;
                }
                $.ajax({
                    url: '/browse/submit?p=' + encodeURIComponent(window.location.href) + '&id=' + readUuid + '&time=5&degree=' + degree,
                    type: 'get'
                });
                // var browImg = new Image();
                if (time > 5 * 40) {
                    clearInterval(reportInterval);
                }
            }

            if (!onReadyeNoReport) {
                var pageH = document.body.scrollHeight;
                var windowH = $(window).height();
                var degree = ((maxScroll + windowH) / pageH).toFixed(2) * 1;
                if (degree > 1) {
                    degree = 1;
                }
                $.ajax({
                    type: 'get',
                    url: '/browse/index?p=' + encodeURIComponent(window.location.href) + '&id=' + readUuid + '&time=5&degree=' + degree,
                    success: function () {
                        isRdady = true;
                    }
                });
            }
            reportInterval = setInterval(function () {
                if (isRdady) {
                    report();
                }
            }, 5000)
        }
    }
}