"use strict";

const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const { authentication } = require("../auth/authUtils");
const router = express.Router();

//check apiKey
router.use(apiKey);
//check permissions
router.use(permissions('0000'));

router.use("/", require("./access/index"));


module.exports = router;
