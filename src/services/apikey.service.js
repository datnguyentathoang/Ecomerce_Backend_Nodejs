'use strict';


const ApiKeyModel = require('../models/apikey.model');



const findByid = async ( key ) => {
    // const newKey = await ApiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'),permissions: ['0000'] });
    // console.log({newKey});
    const objKey = await ApiKeyModel.findOne({ key, status: true }).lean();
    if (!objKey) {
      throw new Error("Invalid API Key");
    }
    return objKey;
}



module.exports = {
    findByid
}