"use strict";
const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { KeyTokenService } = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { format } = require("path");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require("../core/error.respone");
const { find } = require("lodash");

//service
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("delKey:: ", delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    /*
    1 - check email
    2 - match password
    3 - create PL, PR and save
    4 - generate tokens
    5 - get data return login
    */

    //1
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }

    //2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Password not correct");
    }

    //3 create publicKey, privateKey
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

    //4 generate token
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privatekey: privateKey,
      publicKey,
    });

    //5

    return {
      shop: getInfoData({ field: ["_id", "name", "email"], object: foundShop }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      //step 1: check email exists??

      const checkExist_Shop = await ShopModel.findOne({ email }).lean();
      if (checkExist_Shop) {
        throw new ConflictRequestError("Shop already registered");
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

        console.log("🔑 SIGNUP - Generated keys:", {
          privateKey: privateKey.substring(0, 50) + "...",
          publicKey: publicKey.substring(0, 50) + "...",
        });

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privatekey: privateKey,
        });

        if (!keyStore) {
          throw new BadRequestError();
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
