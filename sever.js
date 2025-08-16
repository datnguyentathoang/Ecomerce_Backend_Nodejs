const app = require("./src/app");

const port = 3055;

// Start the server

const server = app.listen(port, () => {
  console.log(`WSV eCommerce is running on port ${port}`);
});

// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log('Exiting WSV eCommerce server gracefully...');

//     });
// })
