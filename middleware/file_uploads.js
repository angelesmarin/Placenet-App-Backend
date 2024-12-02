const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../aws/s3'); 
require('dotenv').config();

//uploads pdf files to s3 using multer 

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `documents/${uniqueSuffix}-${file.originalname}`); //originalname 
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, //max file size 10mb
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); //only pdf 
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
});

module.exports = upload;
