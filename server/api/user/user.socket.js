/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var User = require('./user.model');

exports.init = function(socketio) {}

exports.register = function(socket, socketio) {

	socket.on('user:subscribe', function(id) {

		console.info('[%s] SUBSCRIBE user:%s', socket.address, id);
		socket.join('user:' + id);
	});

	socket.on('user:unsubscribe', function(id) {

		console.info('[%s] UNSUBSCRIBE user:%s', socket.address, id);
		socket.leave('user:' + id);
	});
}
