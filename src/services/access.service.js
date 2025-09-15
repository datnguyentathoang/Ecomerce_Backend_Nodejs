"use strict";
const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { format } = require("path");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};



class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1: check email exists??
      const holderShop = await ShopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Email already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newShop = await ShopModel.create({
        name,
        email,
        password: hashedPassword,
        role: RoleShop.SHOP,
      });

      if (newShop) {
        //created privatekey, public key
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log({ privateKey, publicKey });

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privatekey: privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "keyStore error",
          };
        }

        //created token pair
        const token = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`created token successfully:`, token);

        return {
          code: "201",
          metadata: {
            shop: getInfoData({
              field: ["_id", "name", "email"],
              object: newShop,
            }),
            token,
          },
        };
      }

      return {
        code: "200",
        metadata: null,
      };
    } catch (error) {
      console.log("error signUp:: ", error);
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
