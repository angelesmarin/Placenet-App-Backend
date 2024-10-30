/*
managing sequelize connection: connecting to database 
*/

const { sequelize, Sequelize } = require('sequelize'); //import sequelize
require('dotenv'). config(); //load my info

const sequelize = new Sequelize( //new instance of sequelize 
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    { //configure connection
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
    }
);

module.exports = sequelize;