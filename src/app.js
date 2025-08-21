require('dotenv').config();
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();


// console.log(' porocess: ',process.env)
//init middleware
app.use(morgan('dev'));
app.use(helmet()); 
app.use(compression());


//init db
require('./dbs/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
//checkOverload();

// init routes
app.get('/', (req, res, next) => {
    // const strName = "Hello World";

  return res.status(200).json({
    message: 'Welcome to WSV eCommerce API',
    
  });
});

// handling errors

module.exports = app;