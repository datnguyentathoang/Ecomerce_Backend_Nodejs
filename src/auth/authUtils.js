"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("./checkAuth");
const { AuthFailureError, NotFoundError } = require("../core/error.respone");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    console.log("Creating token pair with payload:", payload);
    console.log("Public key type:", typeof publicKey);
    console.log("Private key type:", typeof privateKey);

    // accessToken - use RS256 algorithm for asymmetric keys
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    // Verify token with public key
    JWT.verify(
      accessToken,
      publicKey,
      { algorithms: ["RS256"] },
      (err, decode) => {
        if (err) {
          console.error(`error verify::`, err);
        } else {
          console.log(`decode verify::`, decode);
        }
      }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair:", error);
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1. Check userId missing???
    2 -  get accessToken
    3 - verify token
    4- check user in db?
    5 - check keyStore with userId?
    6 - OK all -> return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }

  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore");
  }

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid user");
    req.keyStore = keyStore;
    return next();
  } catch (error) {}
});

module.exports = {
  createTokenPair,
  authentication,
};
