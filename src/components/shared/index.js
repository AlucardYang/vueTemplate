const wx = require('weixin-js-sdk'),
    readUuid = '',
    lang = navigator.language.toLowerCase(),
    isOnTheMini = window.__wxjs_environment === 'miniprogram',
    isWeiXin = /micromessenger/.test(navigator.userAgent.toLowerCase());

function showContact() {
    var mask = $("<div class='pageMask'>");
    body.append(mask);
    $(".contactBtn").css({
        "transform": "rotate(45deg)"
    });
    $(".contactNav").slideDown(200, function () {
        $(".contactNav span").fadeIn(200)
    });
    $(".contact").addClass("active");
    document.querySelector('.pageMask').addEventListener('click', function (e) {
        hideContact()
    });
    document.querySelector('.pageMask').addEventListener('touchmove', function (e) {
        e.preventDefault()
    });
};

function hideContact() {
    $(".contactNav span").fadeOut(200);
    $(".contactNav").slideUp(200, function () {
        $(".pageMask").fadeOut(200, function () {
            $(".pageMask").remove();
            $(".contactNav span").show();
        })
    });
    $(".contactBtn").css({
        "transform": "rotate(0)"
    });
    $(".contact").removeClass("active");
};

function newHtml() {
    var authArea = '';
    var mm = document.getElementById('auth-mobile');
    if (mm && mm.value !== '') {
        var authMobile = mm.value;
        var len = Math.floor(authMobile.length / 3);
        var lastLen = authMobile.length - len - 4;
        var reg = new RegExp('(\\d{' + len + '})\\d{4}(\\d{' + lastLen + '})');
        var m = authMobile.replace(reg, "$1****$2");
        var play = 'none';
        authArea = '<div id="autoArea" style="margin: .47rem 0;font-size: .16rem;width: 2.4rem"><span>授權手機號：' + m + '</span><span id="changeAuto" style="float: right;color: #1097d5">更改</span></div>'
    }
    var mainArea = '<div class="select" style="display: ' + play + '">' + '<div class="selected">' + '<span id="login-pre">' + areaCode + '</span>' + '<select class="select-box">' + '<option value="+852">中國香港 +852</option>' + '<option value="+853">中國澳門 +853</option>' + '<option value="+86">中國大陸 +86</option>' + '<option value="+1">美國 +1</option>' + '</select>' + '</div>' + '<input id="tel" type="tel" placeholder="請輸入您的手機號" autofocus>' + '<em class="warning"></em>' + '</div>';
    return ('<div class="login"><header></header><main>' + mainArea + authArea + '<button id="confirm">確定</button><footer>授權即代表您已閱讀並同意<em id="protocol">《私隱協議》</em></footer></main></div>');
}

function againRegister(self) {
    againPost = !0;
    var num = 60;
    $.ajax({
        url: '/sms/register',
        type: 'GET',
        dataType: 'json',
        data: {
            mobile_pre: mobile_pre,
            mobile: mobile,
            "_csrf-frontend": csrfToken
        },
        success: function (res) {
            if (res.code === 0) {
                layer.msg(res.msg, {
                    time: 1500
                });
                timer = setInterval(function () {
                    num--;
                    if (num < 0) {
                        clearInterval(timer);
                        self.text('重新發送');
                        againPost = !1
                    } else {
                        self.text(num + 's')
                    }
                }, 1000)
            } else {
                layer.msg(res.msg, {
                    time: 1500
                }, function () {
                    againPost = !1;
                })
            }
        }
    })
}

function register(data) {
    flag = !0;
    $.ajax({
        url: '/user/action',
        type: 'post',
        dataType: 'json',
        data: data,
        success: function (res) {
            if (res.code === 0) {
                var remsg = $('.send-tips').length ? '授權成功' : res.msg;
                layer.msg(remsg, {
                    time: 2500
                }, function () {
                    location.reload();
                })
            } else {
                layer.msg(res.msg, {
                    time: 2500
                }, function () {
                    flag = !1;
                    var d = document.querySelector('.phone-confirm').querySelectorAll('div');
                    var input = document.querySelector('.phone-confirm').querySelector('input');
                    $.each(d, function (index, item) {
                        item.textContent = ""
                    });
                    input.value = '';
                    input.style.left = 0;
                    input.removeAttribute('disabled');
                    fakeDIv = d[0];
                    fakeVal = d[0];
                    fakeNum = '';
                })
            }
        }
    })
}

function htmlInput(phone) {
    return ('<div class="phone-confirm"><header>請輸入手機簡訊驗證碼</header><span>' + phone + '</span><main><div></div><div></div><div></div><div></div><input type="tel" autofocus maxlength="4" minlength="1" size="1" min="0" max="9999" pattern="[0-9]{4}" /></main><footer>收不到驗證碼？<em id="again">59s</em></footer></div>')
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function mainRegister() {
    var ua = navigator.userAgent.toLowerCase();
    ua.match(/weibo/gi) && body.scrollTop(0);
    var mobileLayer = layer.open({
        type: 1,
        title: 0,
        closeBtn: 1,
        content: newHtml(),
        shadeClose: 0,
        resize: 0,
        skin: 'card-layer',
        success: function () {
            body.css("position", "fixed");
            var op = document.querySelector('.select-box').querySelectorAll('option')[regIndex];
            op.selected = 'selected';
            op.setAttribute('selected', 'selected');
        },
        cancel: function () {
            body.css("position", "initial");
            if ($('.send-tips').length) {
                $('.send-tips').show();
            }
        }
    });
    var div = document.querySelector('.selected').querySelector('span');
    var select = document.querySelector('select');
    var confirm = document.getElementById('confirm');
    var telPhone = document.getElementById('tel');
    var warning = document.querySelector('.warning');
    var p = document.querySelector('#protocol');
    var index = regIndex;
    var changeAuto = document.getElementById('changeAuto');
    if (changeAuto) {
        var ar = document.getElementById('autoArea');
        changeAuto.addEventListener('click', function () {
            document.querySelector('.select').style.display = 'flex';
            ar.parentNode.removeChild(ar);
        }, !1)
    }
    telPhone.addEventListener('focus', function () {
        warning.style.display = 'none'
    });
    select.addEventListener('change', function () {
        div.textContent = select.options[select.selectedIndex].value;
        index = select.selectedIndex;
    }, !1);
    p.addEventListener('click', function () {
        layer.open({
            type: 1,
            title: !1,
            closeBtn: 1,
            content: $('.pro-detail'),
            shadeClose: 1,
            resize: !1,
            area: ['3.75rem', '100%'],
            skin: 'pro'
        })
    });
    confirm.addEventListener('click', function () {
        if (document.getElementById('changeAuto')) {
            $.ajax({
                url: '/user/action',
                type: 'post',
                dataType: 'json',
                data: {
                    act: 'register_use_auth_phone',
                    "iberId": getCookie('iberId'),
                    "_csrf-frontend": csrfToken
                },
                success: function (res) {
                    if (res.code === 0) {
                        layer.msg('授權成功', {
                            time: 2500
                        }, function () {
                            location.reload();
                        })
                    } else {
                        layer.msg(res.msg, {
                            time: 2500
                        })
                    }
                }
            });
            return
        }
        mobile_pre = div.textContent.replace(/[^0-9]/ig, '');
        mobile = document.getElementById('tel').value;
        if (!mobile) {
            warning.style.display = 'block';
            warning.textContent = '請輸入手機號';
            return !1
        }
        if (!(reg[index].test(mobile))) {
            warning.style.display = 'block';
            warning.textContent = '手機號碼格式不正確';
            return !1
        }
        var self = this;
        self.setAttribute('disabled', 'disabled');
        $.ajax({
            url: '/sms/register',
            type: 'GET',
            dataType: 'json',
            data: {
                mobile_pre: mobile_pre,
                mobile: mobile,
                "_csrf-frontend": csrfToken
            },
            success: function (res) {
                if (res.code === 0) {
                    layer.close(mobileLayer);
                    layer.open({
                        type: 1,
                        title: 0,
                        closeBtn: 1,
                        content: htmlInput('已發送到手機號碼：+' + mobile_pre + " " + mobile),
                        shadeClose: 0,
                        resize: 0,
                        skin: 'card-mdrt-skin',
                        success: function () {
                            body.css("position", "fixed");
                            firstNOPost();
                            $('#again').on('click', function () {
                                !againPost && againRegister($(this))
                            });
                            getInput()
                        },
                        cancel: function () {
                            body.css("position", "initial");
                            if ($('.send-tips').length) {
                                $('.send-tips').show();
                            };
                            flag = !1;
                            againPost = !1
                        }
                    })
                } else {
                    layer.msg(res.msg, {
                        time: 1500
                    })
                }
                self.removeAttribute('disabled');
            },
            error: function (res) {
                layer.msg(res.status, {
                    time: 1500
                }, function () {
                    self.removeAttribute('disabled');
                })
            }
        });
        warning.style.display = 'none';
    }, !1)
}

function getInput() {
    var input = document.querySelector('.phone-confirm').querySelector('input');
    fakeVal = document.querySelector('.phone-confirm').querySelector('div');
    fakeDIv = fakeVal;
    fakeNum = '';
    $('.phone-confirm').on('keyup', 'input', function (e) {
        fakeVal.textContent = $(this).val();
        fakeNum += $(this).val();
        if (fakeNum.length === 4) {
            $(this).prop('disabled', 'disabled');
            !flag && register({
                mobile_pre: mobile_pre,
                mobile: mobile,
                code: fakeNum,
                act: 'register',
                backUrl: p,
                "_csrf-frontend": csrfToken,
                "iberId": getCookie('iberId')
            })
        }
        if (fakeVal.nodeName.toLowerCase() === 'div') {
            if (e.which === 8) {
                if (fakeVal === fakeDIv) {
                    fakeVal = fakeDIv;
                } else {
                    fakeVal = fakeVal.previousElementSibling;
                }
                fakeVal.textContent = '';
                fakeNum = fakeNum.slice(0, -1)
            } else {
                fakeVal = fakeVal.nextElementSibling;
            }
            this.value = ''
        } else {
            return !1
        }
        input.style.left = fakeNum.length * .64 + 'rem';
    })
}

function firstNOPost() {
    againPost = !0;
    var a = $('#again');
    var n = 58;
    var t = setInterval(function () {
        if (n < 0) {
            clearInterval(t);
            a.text('重新發送');
            againPost = !1
        } else {
            a.text(n + 's');
            n--;
        }
    }, 1000)
}

function likeBtn($btn) {
    $btn.addClass('favBtn-deg');
    setTimeout(function () {
        $btn.removeClass('favBtn-active').addClass('favBtn-precum');
        $btn.find('.newnavText').text('立即諮詢');
        $btn.find('.newnavText').css('fontSize', '.14rem');
        $btn.find('.navBtn').html('&#xe6c9;')
    }, 500);
    $('.favBtn-deg').on('click', function () {
        if (isOnTheMini) {
            wx.miniProgram.navigateTo({
                url: '/pages/chat/chat?id=' + $btn.attr("data-id")
            })
        } else {
            var url = $btn.attr('data-href');
            if (url.indexOf('?') == -1) {
                url += "?from_ib_url=" + encodeURIComponent(window.location.href);
            } else {
                url += "&from_ib_url=" + encodeURIComponent(window.location.href);
            }
            location.href = url;
        }
    });
    scrollEvent($('.favBtn-deg'));
}

function codeHtml(num, code, imgSrc, sp) {
    var str = isOnTheMini ? '長按保存 QR Code' : '長按識別 QR Code';
    var code2Text = num.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    var oldHtml = '<div class="card-qrcode">' + '<main class="card-qrcode-oldmain">' + '<div class="card-qrcode-box">' + '<img src="' + imgSrc + '">' + '</div>' + '</main>' + '<aside class="card-qrcode-aside" style="margin-bottom: .4rem">' + str + '</aside>' + '</div>';
    var newHtml = '<div class="card-qrcode">' + '<header>顧問微信</header>' + '<main>' + '<div class="card-qrcode-box">' + '<img src="' + imgSrc + '">' + '</div>' + '</main>' + '<aside class="card-qrcode-long">' + str + '</aside>' + '<aside class="card-qrcode-info">' + '<i class="iconfont">&#xe717;</i>' + '<span>WeChat ID: </span>' + '<span>' + code2Text + '</span>' + '</aside>' + '<footer data-clipboard-text="' + code2Text + '" class="btnbtn" onclick="copyNum()">複製WeChat ID</footer>' + '</div>';
    var newOption = '<div class="card-qrcode">' + '<header>顧問微信</header>' + '<main></main>' + '<aside class="card-qrcode-info">' + '<i class="iconfont">&#xe717;</i>' + '<span>WeChat ID: </span>' + '<span>' + code2Text + '</span>' + '</aside>' + '<footer data-clipboard-text="' + code2Text + '" class="btnbtn" onclick="copyNum()">複製WeChat ID</footer>' + '</div>';
    if (num && !asyncScirpt) {
        asyncScirpt = document.createElement('script');
        asyncScirpt.src = '/static/js/clipboard.js';
        document.body.appendChild(asyncScirpt)
    }
    return (code && num) ? newHtml : sp ? newOption : oldHtml;
}

function copyNum() {
    var clip = new Clipboard('.btnbtn');
    clip.on('success', function () {
        layer.msg('已複製到粘貼板', {
            time: 1500
        })
    })
}

function scrollEvent(ele) {
    window.addEventListener('scroll', function () {
        var maxHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        var oneHeight = document.documentElement.getBoundingClientRect().height * 2;
        var maxTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        oneHeight + maxTop >= maxHeight ? ele.fadeOut() : ele.fadeIn();
    })
}

function appHref(targetUrl) {
    var message = JSON.stringify({
        type: 'open_page',
        data: {
            url: targetUrl,
        }
    });
    console.log(message);
    postMessage(message, "*");
}

function closePage() {
    var message = JSON.stringify({
        type: 'close_page',
        data: {}
    });
    console.log(message);
    postMessage(message, "*");
}

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
};

function readReport(onReadyeNoReport) {
    var startTime = new Date().getTime();
    var maxScroll = 0;
    var isRdady = false;

    if (!readUuid) {
        const readUuid = guid();
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
};

function reportWxShare() {
    $.ajax({
        url: '/share/second-submit?logId=' + readUuid + '&url=' + encodeURIComponent(window.location.href.split('#')[0])
    });
}

function initWX(shareTitle, shareImg, shareDes, shareCuid, isOnlyShare) {
    if (wx && navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0) {
        let link = window.location.href.replace('wac=1', '');
        link = link.replace('forwarder_id=', 're_forwarder_id='); //原来的转发者重新命名
        if (shareCuid !== undefined && link.indexOf('?') === -1) {
            link += '?forwarder_id=' + shareCuid;
        } else {
            link += '&forwarder_id=' + shareCuid;
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
}

export {
    wx,
    readUuid,
    lang,
    isOnTheMini,
    isWeiXin,
    showContact,
    hideContact,
    newHtml,
    againRegister,
    register,
    htmlInput,
    getCookie,
    mainRegister,
    getInput,
    firstNOPost,
    likeBtn,
    codeHtml,
    copyNum,
    scrollEvent,
    appHref,
    closePage,
    guid,
    readReport,
    reportWxShare,
    initWX,
}