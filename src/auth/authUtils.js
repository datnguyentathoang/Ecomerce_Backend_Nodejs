"use strict";

const JWT = require("jsonwebtoken");

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

module.exports = {
  createTokenPair,
};
