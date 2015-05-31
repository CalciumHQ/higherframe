/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var frame = require('./frame.model');

exports.register = function(socket) {
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