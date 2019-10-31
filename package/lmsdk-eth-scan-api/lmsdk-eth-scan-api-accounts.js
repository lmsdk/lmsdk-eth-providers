import request from './lmsdk-eth-scan-request.js'

var LMPEthscanAPIAccounts = function LMPEthscanAPIAccounts( host ) {
	this.host = host
}

//Get a list of 'Normal' Transactions 
LMPEthscanAPIAccounts.prototype.transactionsListRequest = function(options) {

	if (!options.sort) {
		options.sort = 'desc';
	}
	
	if(!options.page){
		options.page = 1
	}
	
	if(!options.offset){
		options.offset = 20
	}
	
	return new request( this.host, {
		module: 'account',
		action: 'txlist', // 代币: tokentx  以太坊: txlist
		address: options.address,
		startblock: 0,
		page: options.page,
		offset: options.offset,
		endblock: 'latest',
		sort: options.sort,
		apikey: 'YourApiKeyToken',
	});
}

module.exports = LMPEthscanAPIAccounts;