/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Project = require('./project.model');

exports.init = function(socketio) {

	Project.schema.post('save', function(doc) {

		Project.populate(doc, {path:'frames'}, function(err, project) {

      onSave(socketio, project);
    });
  });

  Project.schema.post('remove', function (doc) {

    onRemove(socketio, doc);
  });
}

exports.register = function(socket, socketio) {

	socket.on('project:subscribe', function(id) {

		console.info('[%s] SUBSCRIBE project:%s', socket.address, id);
		socket.join('project:' + id);
	});

	socket.on('project:unsubscribe', function(id) {

		console.info('[%s] UNSUBSCRIBE project:%s', socket.address, id);
		socket.leave('project:' + id);
	});
}

function onSave(socketio, doc, cb) {

  socketio.sockets
		.in('project:' + doc._id)
		.emit('project:save', doc);

	socketio.sockets
		.in('user:' + doc.owner)
		.emit('project:save', doc);
}

function onRemove(socketio, doc, cb) {

  socketio.sockets
		.in('project:' + doc._id)
		.emit('project:remove', doc);

	socketio.sockets
		.in('user:' + doc.owner)
		.emit('project:remove', doc);
}
