/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file httpprovider.js
 * @authors:
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea
 *   Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2015
 */

var errors = require('web3-core-helpers').errors;
var XHR2 = require('xhr2-cookies').XMLHttpRequest // jshint ignore: line
var http = require('http');
var https = require('https');

/**
 * HttpProvider should be used to send rpc calls over http
 */
var HttpProvider = function HttpProvider(host, options) {

    options = options || {};

    var keepAlive =
        (options.keepAlive === true || options.keepAlive !== false) ?
        true :
        false;
    this.host = host || 'http://localhost:8545';
    if (this.host.substring(0, 5) === "https") {
        this.httpsAgent = new https.Agent({
            keepAlive: keepAlive
        });
    } else {
        this.httpAgent = new http.Agent({
            keepAlive: keepAlive
        });
    }
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.connected = false;
    
    
    this.on("networkChanged", function(netid) {
        if (this.autoRefreshOnNetworkChange === true) {
            window.location.reload()
        }
    })
    
    this.on("accountsChanged", function(accounts) {
        ethereum.selectedAddress = accounts[0];
    })
};

HttpProvider.prototype._prepareRequest = function() {

    process.versions = {
        node: "unkown",
        v8: "unkown"
    }

    var request = new XHR2();

    request.nodejsSet({
        httpsAgent: this.httpsAgent,
        httpAgent: this.httpAgent
    });

    request.open('POST', this.host, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.timeout = this.timeout && this.timeout !== 1 ? this.timeout : 0;
    request.withCredentials = true;

    if (this.headers) {
        this.headers.forEach(function(header) {
            request.setRequestHeader(header.name, header.value);
        });
    }

    return request;
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.send = function(payload, callback) {

    var _this = this;
    var request = this._prepareRequest();

    request.onreadystatechange = function() {

        if (request.readyState === 4 && request.timeout !== 1) {
            var result = request.responseText;
            var error = null;
            try {
                result = JSON.parse(result);
            } catch (e) {
                error = errors.InvalidResponse(request.responseText);
            }

            _this.connected = true;
            callback(error, result);
        }
    };

    request.ontimeout = function() {
        _this.connected = false;
        callback(errors.ConnectionTimeout(this.timeout));
    };

    if ( window.lmdapp && window.lmdapp.lmt === 'ethereum' && payload.method === "eth_sendTransaction" && typeof(callback) ===
        "function") {

        var success = function(rawTx) {
            payload.method = "eth_sendRawTransaction";
            payload.params = [rawTx];
            try {
                request.send(JSON.stringify(payload));
            } catch (error) {
                this.connected = false;
                callback(errors.InvalidConnection(this.host));
            }
        }

        var fail = function(e) {
            callback(e, r)
        }

        plus.bridge.exec("LMETH", "eth_sendTransaction", [plus.bridge.callbackId(success, fail)], payload)

        return;

    } else if ( window.lmdapp && window.lmdapp.lmt === 'ethereum' && payload.method === "eth_sign" && typeof(callback) === "function") {

        var success = function(rawTx) {
            callback(null, {
                id: payload.id,
                jsonrpc: payload.jsonrpc,
                result: rawTx
            })
        }

        var fail = function(e) {
            callback(e, null)
        }

        plus.bridge.exec("LMETH", "eth_sign", [plus.bridge.callbackId(success, fail)], payload)

        return;

    } else {

        try {
            request.send(JSON.stringify(payload));
        } catch (error) {
            this.connected = false;
            callback(errors.InvalidConnection(this.host));
        }
    }
};

HttpProvider.prototype.disconnect = function() {
    //NO OP
};
HttpProvider.prototype.enable = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        var success = function(address) {
            _this.selectedAddress = address[0];
            window.web3.eth.defaultAccount = address[0];
            window.web3.eth.accounts = address;
            resolve(address);
        }
        if (window.lmdapp.lmt === 'ethereum') {
            plus.bridge.exec("LMETH", "enable", [plus.bridge.callbackId(success, reject)])
        } else {
            reject("not in lmwallet")
        }
    })
}
HttpProvider.prototype.isMetaMask = true;
HttpProvider.prototype.isLimoWallet = true;
HttpProvider.prototype.autoRefreshOnNetworkChange = true;
HttpProvider.prototype._eventObservers = [];
HttpProvider.prototype.on = function(eventName, action) {
    this._eventObservers.push({
        name: eventName,
        fun: action,
    })
}
/// accountsChanged, returns updated account array.
/// networkChanged, returns network ID string.
HttpProvider.prototype._emitEvent = function(eventName, ...objs) {
    for (var index in this._eventObservers) {
        var observer = this._eventObservers[index];
        if ( observer.name === eventName) {
            observer.fun(objs)
        }
    }
}

module.exports = HttpProvider;
