let Web3 = require('web3');
let httpProvider = require('./package/lmsdk-eth-providers-http');
let ethScanApi = require('./package/lmsdk-eth-scan-api');

if ( window.lmdapp && window.lmdapp.lmt === "ethereum" ) {
    
    if ( window.lmdapp.lmv.indexOf("http") === 0 ) {
        window.ethereum = new httpProvider(window.lmdapp.lmv);
    } else if ( window.lmdapp.lmv.indexOf("ws") === 0 ) {
        /// websocket provider
    }
    
    window.web3 = new Web3(window.ethereum);
}

window.Web3 = Web3;

module.exports = {
    httpProvider: httpProvider,
	ethScanApi: ethScanApi
};