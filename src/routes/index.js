"use strict";

const express = require("express");
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  return res.status(200).json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/", require("./access/index"));
// router.get('/', (req, res, next) => {
//   return res.status(200).json({
//     message: 'Welcome my friend',

//   });
// });

module.exports = router;
