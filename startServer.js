/*
server start logic 
imports the backend server from app.js and starts the server.

*/

const app = require('./server');  // Import the app
const PORT = process.env.PORT || 3000;
const cors = require('cors'); // Import CORS
const express = require('express');

app.use(cors({ origin: 'http://10.222.82.59:8081' })); 
app.use(express.json()); 

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

