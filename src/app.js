require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

// console.log(' porocess: ',process.env)
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require("./dbs/init.mongodb");
//const {checkOverload} = require('./helpers/check.connect');
//checkOverload();

// init routes
app.use("/v1/api", require("./routes/index"));

// handling errors

module.exports = app;
