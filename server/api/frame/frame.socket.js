/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Frame = require('./frame.model');

exports.register = function(socket, socketio) {

	socket.on('collaborator:save', function (data) {

		// Add to the frame
		Frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $addToSet: { collaborators: data.user._id }},
			{ safe: true, upsert: false },
			function (err, frame) {

				// Broadcast to children
				socketio.sockets.emit('collaborator:save', data.user);
			}
		);
	});

	socket.on('collaborator:remove', function (data) {

		// Add to the frame
		Frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $pull: { collaborators: data.user._id }},
			{ safe: true, upsert: false },
			function (err, Frame) {

				// Broadcast to children
				socketio.sockets.emit('collaborator:remove', data.user);
			}
		);
	});

  Frame.schema.post('save', function (doc) {

		Frame.populate(doc, {path:'organisation users'}, function(err, frame) {

      onSave(socket, frame);
    });
  });

  Frame.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('frame:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('frame:remove', doc);
}
