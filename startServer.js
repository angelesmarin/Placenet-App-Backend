//const https = require('https');
const fs = require('fs');
const app = require('./server');  
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const express = require('express');

//server start logic imports the backend server from app.js and starts the server
app.use(cors({ origin: 'http://10.222.82.59:8081' })); 
app.use(express.json()); 

// //NEW:  SSL certificate and key
// const sslOptions = {
//   key: fs.readFileSync('/Users/angelesmarin/key.pem'),
//   cert: fs.readFileSync('/Users/angelesmarin/cert.pem')
// };

// //start https server
// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`HTTPS Server is running on port: ${PORT}`);
// });

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

