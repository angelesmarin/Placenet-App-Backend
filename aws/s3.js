const {S3} = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();

//file handles aws s3 configs + basic functionality for interacting with s3

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


module.exports = s3;
