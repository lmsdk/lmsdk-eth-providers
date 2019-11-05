const url = require('url');
const Web3 = require('web3');

import httpProvider from './package/lmsdk-eth-providers-http';
import ethScanApi from './package/lmsdk-eth-scan-api'
import LMPUtils from '../lmsdk-core/package/lmsdk-core-utils';

if ( LMPUtils.lmt === "ethereum" ) {
    
    if ( LMPUtils.lmv.indexOf("http") === 0 ) {
        window.ethereum = new httpProvider(LMPUtils.lmv);
    } else if ( LMPUtils.lmv.indexOf("ws") === 0 ) {
        /// websocket provider
    }
    
    window.web3 = new Web3(window.ethereum);
}

module.exports = {
    httpProvider: httpProvider,
	ethScanApi: ethScanApi
};
