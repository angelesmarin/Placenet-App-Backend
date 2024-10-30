/*
server start logic 
imports the backend server from app.js and starts the server.

*/

const app = require('./server');  // Import the app
const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
