/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var component = require('./component.model');

exports.init = function(socketio) {

	component.schema.post('save', function (doc) {

    onSave(socketio, doc);
  });

  component.schema.post('remove', function (doc) {

    onRemove(socketio, doc);
  });
}

exports.register = function(socket, socketio) {

	socket.on('component:select', function (data) {

		socketio.sockets.emit('component:select', data);
	});

	socket.on('component:deselect', function (data) {

		socketio.sockets.emit('component:deselect', data);
	});
}

function onSave(socketio, doc, cb) {

  socketio.sockets
		.in('frame:' + doc.frame)
		.emit('component:save', doc);
}

function onRemove(socketio, doc, cb) {

  socketio.sockets
		.in('frame:' + doc.frame)
		.emit('component:remove', doc);
}
