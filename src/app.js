require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// console.log(' porocess: ',process.env)
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
require("./dbs/init.mongodb");
//const {checkOverload} = require('./helpers/check.connect');
//checkOverload();

// init routes
app.use("/v1/api", require("./routes/index"));

// handling errors

module.exports = app;
