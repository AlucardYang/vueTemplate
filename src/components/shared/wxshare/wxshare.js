const wx = require('weixin-js-sdk');

// 分享组件
export default {
    name: 'wxShare',
    template: '<div></div>',
    props: [
        'readUuid',
        'shareTitle',
        'shareImg',
        'shareDes',
        'shareCuid',
        'isOnlyShare'
    ],
    watch: {
        shareTitle() {
            this.initWX(this.readUuid, this.shareTitle, this.shareImg, this.shareDes, this.shareCuid, this.isOnlyShare);
        }
    },
    methods: {
        initWX: function (readUuid, shareTitle, shareImg, shareDes, shareCuid, isOnlyShare) {
            if (wx && navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0) {
                let link = window.location.href.replace('wac=1', '');
                link = link.replace('forwarder_id=', 're_forwarder_id='); //原来的转发者重新命名
                if (shareCuid !== undefined && link.indexOf('?') === -1) {
                    link += '?forwarder_id=' + shareCuid
                } else {
                    link += '&forwarder_id=' + shareCuid
                }
                $.ajax({
                    type: 'get',
                    url: '/wx/signature',
                    dataType: 'json',
                    async: !1,
                    data: {
                        url: location.href.split('#')[0]
                    },
                    success: function (data) {
                        if (data.code == 0) {
                            const config = data.data.config;
                            wx.config({
                                debug: !1,
                                appId: config.appId,
                                timestamp: config.timestamp,
                                nonceStr: config.nonceStr,
                                signature: config.signature,
                                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                            });
                            wx.ready(function () {
                                wx.onMenuShareTimeline({
                                    title: shareTitle,
                                    link: link,
                                    imgUrl: shareImg,
                                    success: function () {
                                        isOnlyShare && reportWxShare(readUuid);
                                    }
                                });
                                wx.onMenuShareAppMessage({
                                    title: shareTitle,
                                    desc: shareDes,
                                    link: link,
                                    imgUrl: shareImg,
                                    success: function () {
                                        isOnlyShare && reportWxShare(readUuid);
                                    },
                                });
                                wx.onMenuShareQQ({
                                    title: shareTitle,
                                    desc: shareDes,
                                    link: link,
                                    imgUrl: shareImg,
                                    success: function () {
                                        isOnlyShare && reportWxShare(readUuid);
                                    }
                                });
                                wx.onMenuShareWeibo({
                                    title: shareTitle,
                                    desc: shareDes,
                                    link: link,
                                    imgUrl: shareImg,
                                    success: function () {
                                        isOnlyShare && reportWxShare(readUuid);
                                    }
                                });
                                wx.onMenuShareQZone({
                                    title: shareTitle,
                                    desc: shareDes,
                                    link: link,
                                    imgUrl: shareImg,
                                    success: function () {
                                        isOnlyShare && reportWxShare(readUuid);
                                    }
                                })
                            })
                        }
                    }
                })
            }
        },
        reportWxShare: function (readUuid) {
            $.ajax({
                url: '/share/second-submit?logId=' + readUuid + '&url=' + encodeURIComponent(window.location.href.split('#')[0])
            });
        }
    }
}