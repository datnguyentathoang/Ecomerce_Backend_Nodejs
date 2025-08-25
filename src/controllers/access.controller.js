"use strict";

class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log(`[P]::signup: `, req.body);
      /*
        200 ok
        201 CREATED
        */
      return res.status(201).json({
        code: 201,
        metadata: {
          userID: 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
