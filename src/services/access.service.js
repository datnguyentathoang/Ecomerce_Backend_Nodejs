"use strict";
const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const RoleShop ={
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

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
         role: RoleShop.SHOP
       });


       if (newShop) {
         //created privatekey, public key
         const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
           modulusLength: 2048,
           publicKeyEncoding: {
             type: 'spki',
             format: 'pem'
           },
           privateKeyEncoding: {
             type: 'pkcs8',
             format: 'pem'
           }
         });
       }

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
