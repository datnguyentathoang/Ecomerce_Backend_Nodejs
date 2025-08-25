"use strict";

const { token } = require("morgan");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ user, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keytokenModel.create({
        user,
        publicKey: publicKeyString,
      });
      return tokens ? token.publicKey : null;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = KeyTokenService;
