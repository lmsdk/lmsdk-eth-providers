let http = require('http');

var LMPEthscanAPIRequest = function LMPEthscanAPIRequest(host, options) {

	return new Promise((resolve, reject) => {

		var parmas = [];

		for (let k in options) {
			parmas.push(k + "=" + options[k]);
		}

		var url = host + "?" + parmas.join("&");

		http.get(url, function(res) {
			res.setEncoding("utf-8");
			res.on("data", function(data) {
				resolve(data.toString())
			})
			

		}).on("error", function(err) {

			reject(err)

		})
	})

}


module.exports = LMPEthscanAPIRequest;
