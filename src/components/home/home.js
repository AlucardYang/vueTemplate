import { initWX, readReport } from '../shared/index.js';

export default {
    name: 'Home',
    data() {
        return {
            sayHello: 'Hello World!',
            // isOnlyShare: false,
            // shareTitle: 'aaaa',
            // shareImg: 'http：//baidu.com',
            // shareDes: 'Hello World!',
            // shareCuid: '',
        }
    },
    mounted: function () {
        // initWX(this.shareTitle, this.shareImg, this.shareDes, this.shareCuid, this.isOnlyShare);
        // readReport();
    },
    methods: {

    }
}