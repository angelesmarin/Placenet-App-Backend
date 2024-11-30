//has exports to start_server.js
const express = require('express');
const sequelize = require('./database'); 
require('dotenv').config();  

const server = express();
server.use(express.json());

// import routes 
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const documentRoutes = require('./routes/documentRoutes');
const summaryRoutes = require('./routes/summaryRoutes');//new route
const authRoutes = require('./routes/authRoutes'); //new route 
const listingRoutes = require('./routes/listingRoute'); //new route

// register routes 
server.use('/api/users', userRoutes);
server.use('/api/properties', propertyRoutes);
server.use('/api/projects', projectRoutes);
server.use('/api/documents', documentRoutes);
server.use('/api/users', summaryRoutes);
server.use('/api/auth', authRoutes);//new route
server.use('/api/summary', summaryRoutes);//new route 
server.use('/api/listings', listingRoutes);//new route

//test 
server.get('/api/test', (req, res) => {
  res.send({ message: 'API is working!' });
});



// db connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// sync models 
sequelize.sync({ alter: true })  // dont want to change existing db tables
  .then(() => console.log('Models synced with database.'))
  .catch(err => console.log('Error syncing models: ' + err));

module.exports = server;  // export  configured server
