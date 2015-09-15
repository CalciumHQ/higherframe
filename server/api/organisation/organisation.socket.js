/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Organisation = require('./organisation.model');

exports.register = function(socket, socketio) {

  Organisation.schema.post('save', function (doc) {

		Organisation.populate(doc, {path:'users'}, function(err, organisation) {

      onSave(socket, organisation);
    });
  });

  Organisation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('organisation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('organisation:remove', doc);
}
