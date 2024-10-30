/*
expess server configuration: has all middleware, routes, and database connection 
exports the configured server to start_server.js
*/

const express = require('express');
const sequelize = require('./database');  // make instance of sequelize 
require('dotenv').config();  // load my db info

// initialize  server
const server = express();

server.use(express.json());

// import routes 
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const documentRoutes = require('./routes/documentRoutes');

// register routes 
server.use('/api/users', userRoutes);
server.use('/api/properties', propertyRoutes);
server.use('/api/projects', projectRoutes);
server.use('/api/documents', documentRoutes);

// db connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// sync models 
sequelize.sync({ alter: false })  // dont want to change existing db tables
  .then(() => console.log('Models synced with database.'))
  .catch(err => console.log('Error syncing models: ' + err));

module.exports = server;  // export  configured server
