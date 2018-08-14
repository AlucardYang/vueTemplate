import wxShare from '../shared/wxshare/wxshare.js'
import readReport from '../shared/readreport/readreport.js'

export default {
    name: 'Home',
    components: {
        wxShare,
        readReport
    },
    data() {
        return {
            sayHello: 'Hello World!',
            readUuid: '',
            isOnlyShare: false,
            shareTitle: '',
            shareImg: '',
            shareDes: '',
            shareCuid: '',
        }
    },
    mounted: function () {
        const _this = this;
        setTimeout(() => {
            _this.shareTitle = 'aaaa';
            _this.shareImg = 'http：//baidu.com';
            _this.shareDes = 'Hello World!';
        }, 2000);
    },
    methods: {

    }
}