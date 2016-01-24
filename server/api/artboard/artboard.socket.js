/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Artboard = require('./artboard.model');

exports.init = function(socketio) {

  Artboard.schema.post('save', function (artboard) {

    onSave(socketio, artboard);
  });

  Artboard.schema.post('remove', function (artboard) {

    onRemove(socketio, artboard);
  });
}

function onSave(socketio, doc, cb) {

  socketio.sockets
    .in('frame:' + doc.frame)
    .emit('artboard:save', doc);
}

function onRemove(socketio, doc, cb) {

  socketio.sockets
    .in('frame:' + doc.frame)
    .emit('artboard:remove', doc);
}
