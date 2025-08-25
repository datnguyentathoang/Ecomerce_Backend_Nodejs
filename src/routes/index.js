"use strict";

const express = require("express");
const router = express.Router();

router.use("/", require("./access/index"));
// router.get('/', (req, res, next) => {
//   return res.status(200).json({
//     message: 'Welcome my friend',

//   });
// });

module.exports = router;
