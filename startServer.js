const http = require('http');
const fs = require('fs');
const app = require('./server');  
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const express = require('express');

app.use(cors({
  origin: ['http://10.190.191.40:8081', 'http://localhost:8081'], //mobile and web
}));
app.use(express.json()); 

// //NEW:  SSL certificate and key
// const sslOptions = {
//   key: fs.readFileSync('/Users/angelesmarin/key.pem'),
//   cert: fs.readFileSync('/Users/angelesmarin/cert.pem')
// };

//start https server
// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`HTTPS Server is running on port: ${PORT}`);
// });

http.createServer(app).listen(PORT, () => {
  console.log(`HTTP Server is running on port: ${PORT}`);
});

