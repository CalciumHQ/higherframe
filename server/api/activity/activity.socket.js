/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Activity = require('./activity.model');

exports.init = function(socketio) {

  Activity.schema.post('save', function (doc) {

		Activity.populate(doc, {path:'frame user'}, function(err, activity) {

      onSave(socketio, activity);
    });
  });

  Activity.schema.post('remove', function (doc) {

    onRemove(socketio, doc);
  });
}

function onSave(socketio, doc, cb) {

  socketio.sockets
    .in('frame:' + doc.frame._id)
    .emit('activity:save', doc);
}

function onRemove(socketio, doc, cb) {
  
  socketio.sockets
    .in('frame:' + doc.frame)
    .emit('activity:remove', doc);
}
