const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('./s3');  // Import the configured s3 client
const dotenv = require('dotenv');
dotenv.config();

//function to generate pre-signed urls 
//-> allows temp access w/o making then publicly accessible 


const generatePresignUrl = async (bucketName, fileKey) => {
    try{
    const params = {
      Bucket: bucketName,
      Key: fileKey,
    };
    
    const command = new GetObjectCommand(params);

    //generate presigned url w 1 hour exp time
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL: ', error);
    throw new Error('Error generating presigned URL');
  }
  };
  
  module.exports = generatePresignUrl;