const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/wsv-ecommerce";

mongoose
  .connect(connectString)
  .then((_) => console.log("Connected to MongoDB Successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//dev

module.exports = mongoose;
