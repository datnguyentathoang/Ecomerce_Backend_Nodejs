require("dotenv").config({ path: "./src/.env" });
const app = require("./src/app");

const env = process.env.NODE_ENV === "pro" ? "PRO" : "DEV";
const port = process.env[`${env}_APP_PORT`] || 3055;

// Start the server

const server = app.listen(port, () => {
  console.log(`WSV eCommerce is running on port ${port}`);
});

// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log('Exiting WSV eCommerce server gracefully...');

//     });
// })
