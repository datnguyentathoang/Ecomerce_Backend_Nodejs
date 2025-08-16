"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000; // 5 seconds

// Function to count active MongoDB connections
const countconnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of active MongoDB connections: ${numConnections}`);
};

//check overload connections
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximun connections limit based on CPU cores
    const maxConnections = numCores * 5;

    console.log(`Active connections: ${numConnections}`);
    console.log(`memoryUsage: ${memoryUsage/1024 / 1024} MB`);

    if (numConnections > maxConnections) {
        console.log(`Warning: Overload detected! Active connections: ${numConnections}, Max allowed: ${maxConnections}`);
    }
  }, _SECONDS);
};

module.exports = { countconnect, checkOverload };
