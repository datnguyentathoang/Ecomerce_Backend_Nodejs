'use strict'

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');

//signup
router.post('/shop/signup', AccessController.signup);

module.exports = router;