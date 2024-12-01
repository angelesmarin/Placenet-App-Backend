const http = require('http');
const fs = require('fs');
const app = require('./server');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const express = require('express');


app.use(cors({
origin: ['http://10.222.82.59:8081'], // expo IP and port
}));
app.use(express.json());


//for https 
// SSL certificate and key 
// const sslOptions = {
//   key: fs.readFileSync('/Users/angelesmarin/key.pem'),
//   cert: fs.readFileSync('/Users/angelesmarin/cert.pem')
// };

// Start HTTPS server 
// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`HTTPS Server is running on port: ${PORT}`);
// });


// Start HTTP server
http.createServer(app).listen(PORT, () => {
console.log(`HTTP Server is running on port: ${PORT}`);
});

