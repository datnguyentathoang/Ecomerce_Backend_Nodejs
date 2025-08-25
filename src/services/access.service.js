
"use strict";
const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { format } = require("path");

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

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
          };
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        //created token pair
        const token = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log(`created token successfully:`, token);

        return {
          code: "201",
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }

      return {
        code: "200",
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
