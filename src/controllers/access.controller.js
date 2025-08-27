"use strict";
const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log(`[P]::signup: `, req.body);
      /*
        200 ok
        201 CREATED
        */
      if (!req.body) {
        return res.status(400).json({ message: "Missing request body" });
      }
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}

module.exports = new AccessController();
