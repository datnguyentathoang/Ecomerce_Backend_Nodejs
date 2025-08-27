"use strict";

const { token } = require("morgan");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privatekey }) => {
    try {

      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privatekey
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = KeyTokenService;
