"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};

const { findByid } = require("../services/apikey.service");
const { findByUserId } = require("../services/keyToken.service");
const JWT = require("jsonwebtoken");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.trim();
    if (!key) {
      return res.status(403).json({ message: "Forbidden Error" });
    }
    //check objkey
    const objectKey = await findByid(key);
    if (!objectKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }
    req.objectKey = objectKey;
    return next();
  } catch (error) {
    console.error("API Key error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const permissions = (permissions) => {
  return (req, res, next) => {
    // permissions có thể là mảng hoặc chuỗi
    const required = Array.isArray(permissions) ? permissions : [permissions];
    const userPermissions = req.objectKey.permissions || [];
    const hasPermission = required.every((p) => userPermissions.includes(p));
    if (!hasPermission) {
      return res.status(403).json({ message: "permission denied" });
    }
    console.log("permissions:: ", userPermissions);
    return next();
  };
};

const authentication = async (req, res, next) => {
  try {
    // 1. Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      return res.status(401).json({
        message: "Invalid Request",
      });
    }

    // 2. Get access token
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
      return res.status(401).json({
        message: "Not found keyStore",
      });
    }

    // 3. Verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
      return res.status(401).json({
        message: "Invalid Request",
      });
    }

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      req.keyStore = keyStore;
      req.user = decodeUser;
      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid Request",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permissions,
  asyncHandler,
  authentication,
};
