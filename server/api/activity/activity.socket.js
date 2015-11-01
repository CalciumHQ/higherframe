/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Activity = require('./activity.model');

exports.register = function(socket, socketio) {

  Activity.schema.post('save', function (doc) {

		Activity.populate(doc, {path:'frame user'}, function(err, activity) {

      onSave(socket, activity);
    });
  });

  Activity.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('activity:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('activity:remove', doc);
}
