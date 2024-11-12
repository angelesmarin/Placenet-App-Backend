/*
file will handle only pdf file uploads using mutler 
 */

const multer = require('multer');

//storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  //pdf uploaded locally 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random());
    cb(null, `${uniqueSuffix}-${file.originalname}`);  //file name 
  },
});

//only PDFs
const fileFilter = (req, file, cb) => {
  //check for PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Please upload a PDF file!'), false);  //error
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB max file size
  fileFilter: fileFilter,  
});

module.exports = upload;
