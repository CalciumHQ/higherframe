/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var frame = require('./frame.model');

exports.register = function(socket, socketio) {

	socket.on('collaborator:save', function (data) {

		// Add to the frame
		frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $addToSet: { collaborators: data.user._id }},
			{ safe: true, upsert: false },
			function (err, Frame) {

				// Broadcast to children
				socketio.sockets.emit('collaborator:save', data.user);
			}
		);
	});

	socket.on('collaborator:remove', function (data) {
		
		// Add to the frame
		frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $pull: { collaborators: data.user._id }},
			{ safe: true, upsert: false },
			function (err, Frame) {

				// Broadcast to children
				socketio.sockets.emit('collaborator:remove', data.user);
			}
		);
	});

  frame.schema.post('save', function (doc) {
    onSave(socket, doc);
  });

  frame.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('frame:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('frame:remove', doc);
}
