/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Frame = require('./frame.model');

exports.init = function(socketio) {

	Frame.schema.post('save', function(doc) {

		Frame.populate(doc, {path:'organisation users media'}, function(err, frame) {

      onSave(socketio, frame);
    });
  });

  Frame.schema.post('remove', function (doc) {

    onRemove(socketio, doc);
  });
}

exports.register = function(socket, socketio) {

	socket.on('frame:subscribe', function(id) {

		console.info('[%s] SUBSCRIBE frame:%s', socket.address, id);
		socket.join('frame:' + id);
	});

	socket.on('frame:unsubscribe', function(id) {

		console.info('[%s] UNSUBSCRIBE frame:%s', socket.address, id);
		socket.leave('frame:' + id);
	});

	socket.on('frame:media:save', function(data) {

		// Add to the frame
		Frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $addToSet: { media: data.media._id }},
			{ safe: true, upsert: false },
			function (err, frame) {

				// Broadcast to children
				socketio.sockets.emit('frame:media:save', data.media);
			}
		);
	});

	socket.on('frame:collaborator:save', function(data) {

		// Add to the frame
		Frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $addToSet: { collaborators: data.user._id }},
			{ safe: true, upsert: false },
			function (err, frame) {

				// Broadcast to children
				socketio.sockets.emit('frame:collaborator:save', data.user);
			}
		);
	});

	socket.on('frame:collaborator:remove', function(data) {

		// Add to the frame
		Frame.findOneAndUpdate(
			{ _id: data.frame._id },
			{ $pull: { collaborators: data.user._id }},
			{ safe: true, upsert: false },
			function (err, Frame) {

				// Broadcast to children
				socketio.sockets.emit('frame:collaborator:remove', data.user);
			}
		);
	});
}

function onSave(socketio, doc, cb) {

  socketio.sockets
		.in('frame:' + doc._id)
		.emit('frame:save', doc)
		.emit('media:save', doc.media);
}

function onRemove(socketio, doc, cb) {

  socketio.sockets
		.in('frame:' + doc._id)
		.emit('frame:remove', doc);
}
