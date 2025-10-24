"use strict";
const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require("../core/successs.response");

class AccessController {
  logout = async (req, res, next) => {
    new OK("Logout success!", await AccessService.logout(req.keyStore)).send(
      res
    );
  };
  login = async (req, res, next) => {
    new OK("Login OK!", await AccessService.login(req.body)).send(res);
  };
  signup = async (req, res, next) => {
    new CREATED("Register OK!", await AccessService.signUp(req.body)).send(res);
  };
}

module.exports = new AccessController();
