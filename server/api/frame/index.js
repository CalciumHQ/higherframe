'use strict';

var express = require('express');
var controller = require('./frame.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/:id/users', controller.addUser);

router.post('/:id/components', controller.createComponent);
router.delete('/:frameId/components/:componentId', controller.deleteComponent);

router.get('/:id/export', controller.export);

module.exports = router;
