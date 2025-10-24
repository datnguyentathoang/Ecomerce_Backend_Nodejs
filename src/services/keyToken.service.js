"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privatekey,
    refreshToken,
  }) => {
    try {
      //lv0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privatekey
      // });
      //return tokens ? tokens.publicKey : null;

      //lvxxx
      const filter = { user: userId },
        update = { publicKey, privatekey, refreshTokenUsed: [], refreshToken };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return null;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };
  static removeKeyById = async (id) => {
    return await keytokenModel.findByIdAndDelete(id);
  };
}

module.exports = {
  KeyTokenService,
  findByUserId: KeyTokenService.findByUserId,
  removeKeyById: KeyTokenService.removeKeyById,
  createKeyToken: KeyTokenService.createKeyToken,
};
