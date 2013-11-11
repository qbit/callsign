// var http = require( 'http' ),
// url = require('url'),
// cache = {};
// var server = http.createServer( function( req, res ) {
//	}
// 
// }).listen( 3014 );
var express = require("express"),
http = require('http'),
server = express.createServer(),
ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
port = process.env.OPENSHIFT_NODEJS_PORT || 3014,
cache = {};
server.enable("jsonp callback");
setTimeout( function() {
	'use strict';
	cache = {};
}, 86400000 * 4);
server.get("/:id", function(req, res) {
	'use strict';
	var call = req.params.id,
	curl = 'http://data.fcc.gov/api/license-view/basicSearch/getLicenses?searchValue=%S&format=json';
	console.log(call);
	if ( cache[call] ) {
		res.jsonp(cache[call]);
	} else {
		http.get( curl.replace('%S', call), function(response) {
			var data = [];
			response.on('data', function(chunk) {
				data.push(chunk);
			}).on('end', function() {
				data = data.join('');
				cache[call] = data;

				res.jsonp(cache[call]);
			});
		}).on('error', function(e) {
			console.log(e);
		});
	}
});

server.listen(port, ip);
