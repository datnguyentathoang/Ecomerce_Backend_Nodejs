require("dotenv").config();
const app = require("./src/app");

// Set environment variables if not loaded from .env
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "dev";
}
if (!process.env.DEV_APP_PORT) {
  process.env.DEV_APP_PORT = "3052";
}

const env = process.env.NODE_ENV === "pro" ? "PRO" : "DEV";
const port = process.env[`${env}_APP_PORT`] || 3055;

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("env:", env);
console.log("DEV_APP_PORT:", process.env.DEV_APP_PORT);
console.log("port:", port);

// Start the server

const server = app.listen(port, () => {
  console.log(`WSV eCommerce is running on port ${port}`);
});

// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log('Exiting WSV eCommerce server gracefully...');

//     });
// })
