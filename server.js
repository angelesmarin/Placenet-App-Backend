// server.js
const express = require('express');
const sequelize = require('./database');
require('dotenv').config(); 

const server = express();
server.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const documentRoutes = require('./routes/documentRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const authRoutes = require('./routes/authRoutes'); 
const listingRoutes = require('./routes/listingRoute'); 

//register routes
server.use('/api/users', userRoutes);
server.use('/api/properties', propertyRoutes);
server.use('/api/projects', projectRoutes);
server.use('/api/documents', documentRoutes);
server.use('/api/users', summaryRoutes);
server.use('/api/auth', authRoutes);
server.use('/api/summary', summaryRoutes); 
server.use('/api/listings', listingRoutes);

//db connection
sequelize.authenticate()
 .then(() => console.log('Database connected...'))
 .catch(err => console.log('Error: ' + err));

//sync w db
sequelize.sync({ alter: true }) //change tables 
 .then(() => console.log('Models synced with database.'))
 .catch(err => console.log('Error syncing models: ' + err));

module.exports = server; 
