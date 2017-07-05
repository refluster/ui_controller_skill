'use strict';
var Alexa = require("alexa-sdk");
var http = require ('http');

exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
};

var handlers = {
	'LaunchRequest': function () {
		this.emit('SayHello');
	},
	'HelloWorldIntent': function () {
		this.emit('SayHello')
	},
    'SayHello': function () {
        console.log('sayHellow called')
		sendMessage2(function() {
			this.emit(':tell', 'Hello World!');
		}.bind(this));
		console.log('sayHellow called 2')
	}
};

function sendMessage(callback) {
	http.get("http://52.198.86.179:8100/test1", function(res) {
		console.log("http.get response: " + res.statusCode);
		res.on("data", function(chunk) {
			console.log('http.get success')
			callback();
		});
	}).on('error', function(e) {
		console.log('http.get error')
		callback();
	});
}

function sendMessage2(callback) {
	let postData = {
		"name": "n0bisuke",
		"comment": "nemui"
	};

	let postDataStr = JSON.stringify(postData);
	let options = {
		host: '52.198.86.179',
		port: 8100,
		path: '/test1',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': postDataStr.length
		}
	};

	let req = http.request(options, (res) => {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log('BODY: ' + chunk);
			callback();
		});
	});
	req.on('error', (e) => {
		console.log('problem with request: ' + e.message);
	});
	req.write(postDataStr);
	req.end();	
}
