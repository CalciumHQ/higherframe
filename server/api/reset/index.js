'use strict';

var express = require('express');
var controller = require('./reset.controller');

var router = express.Router();

router.get('/:uuid', controller.show);

module.exports = router;
