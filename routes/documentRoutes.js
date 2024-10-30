const express = require('express');
const router = express.Router();
const upload = require('../middleware/file_uploads');  // File upload middleware
const { addDocument, getAllDocuments } = require('../controllers/documentController');

/*
add new documents
get documents 
*/

router.get('/', getAllDocuments);

router.post('/', upload.single('file'), addDocument);

module.exports = router;
