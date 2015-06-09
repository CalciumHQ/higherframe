/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var component = require('./component.model');

exports.register = function(socket, socketio) {
	
	socket.on('component:select', function (data) {
		
		socketio.sockets.emit('component:select', data);
	});
	
	socket.on('component:deselect', function (data) {
		
		socketio.sockets.emit('component:deselect', data);
	});
	
  component.schema.post('save', function (doc) {
		
    onSave(socket, doc);
  });
	
  component.schema.post('remove', function (doc) {
		
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('component:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('component:remove', doc);
}