<<<<<<< HEAD
//has exports to start_server.js
const express = require('express');
const sequelize = require('./database'); 
require('dotenv').config();  
=======
// server.js
const express = require('express');
const sequelize = require('./database');
require('dotenv').config(); 
>>>>>>> 2781eb1 (Resolved conflicts for commit d73f466)

const server = express();
server.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const documentRoutes = require('./routes/documentRoutes');
const summaryRoutes = require('./routes/summaryRoutes');//new route
const authRoutes = require('./routes/authRoutes'); //new route 
<<<<<<< HEAD
const listingRoutes = require('./routes/listingRoute'); //new route
=======
>>>>>>> 2781eb1 (Resolved conflicts for commit d73f466)

//register routes
server.use('/api/users', userRoutes);
server.use('/api/properties', propertyRoutes);
server.use('/api/projects', projectRoutes);
server.use('/api/documents', documentRoutes);
server.use('/api/users', summaryRoutes);
server.use('/api/auth', authRoutes);//new route
server.use('/api/summary', summaryRoutes);//new route 
<<<<<<< HEAD
server.use('/api/listings', listingRoutes);//new route

//test 
server.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});


=======
>>>>>>> 2781eb1 (Resolved conflicts for commit d73f466)

//test 
server.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});




//db connection
sequelize.authenticate()
 .then(() => console.log('Database connected...'))
 .catch(err => console.log('Error: ' + err));

//sync w db
sequelize.sync({ alter: true }) //change tables 
 .then(() => console.log('Models synced with database.'))
 .catch(err => console.log('Error syncing models: ' + err));

module.exports = server; 
