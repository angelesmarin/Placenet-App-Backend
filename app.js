/*
this is the server to connect to postgresql database 
*/

//initialize 
const express = require(`express`);
const { Pool } = require('pg'); //pool class will manage db connctions 
require('dotenv').config(); 

const app = express() //init exppress app 
const port = process.env.PORT || 3000; //use port 3000

//import routes 
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const documentRoutes = require('./routes/documentRoutes');

//pg connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

//to handle JSON requests 
app.use(express.json());

//define route
pool.connect((error) => {
    if (error) {
        console.error('Trouble connecting to database :(', error);
    } else {
        console.log('Database connection successfull!');
    }
})

//defining routes; 4 different end points 
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);

//start server 
app.listen(port, () =>{
    console.log(`port: ${port}`)
})

//make router availble to other files 
module.exports = Pool;