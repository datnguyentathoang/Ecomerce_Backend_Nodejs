"use strict";

const express = require("express");
const router = express.Router();
const AccessController = require("../../controllers/access.controller");
const { asyncHandler, authentication } = require("../../auth/checkAuth");

//signup
router.post("/shop/signup", asyncHandler(AccessController.signup));
router.post("/shop/login", asyncHandler(AccessController.login));

//authentication
router.use(authentication);

//logout
router.post("/shop/logout", asyncHandler(AccessController.logout));

module.exports = router;
