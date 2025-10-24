"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");
const { countconnect } = require("../helpers/check.connect");
const connectString = `mongodb://${host}:${port}/${name}`;

console.log("Connecting to MongoDB at:", connectString);
class database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log("Connected to MongoDB Successfully Pro");
        countconnect();
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  static getInstance() {
    if (!database.instance) {
      database.instance = new database();
    }
    return database.instance;
  }
}
const instanceMongodb = database.getInstance();
module.exports = instanceMongodb;
