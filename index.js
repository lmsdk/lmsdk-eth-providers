const url = require('url');
const Web3 = require('web3');
import httpProvider from './package/lmsdk-eth-providers-http';

var localURL = url.parse(location.href, true);

if ( localURL.query._lmt === "ethereum" ) {
    
    if (localURL.query._lmv.indexOf("http") === 0) {
        window.ethereum = new httpProvider(localURL.query._lmv);
    } else if ( localURL.query._lmv.indexOf("ws") === 0 ) {
        /// websocket provider
    }
    
    window.web3 = new Web3(window.ethereum);
}

module.exports = {
    httpProvider: httpProvider
};
