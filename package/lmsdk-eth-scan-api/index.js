let accounts = require("./lmsdk-eth-scan-api-accounts.js")

var LMPEthscanAPI = function LMPEthscanAPI() {
	
	this.host = "http://api-cn.etherscan.com/api"
	
	this.accounts = new accounts(this.host);
}

module.exports = LMPEthscanAPI;