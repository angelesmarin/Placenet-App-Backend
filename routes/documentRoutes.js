const express = require('express');
const router = express.Router();
const upload = require('../middleware/file_uploads');  // File upload middleware
const { addDocument, getAllDocuments, deleteDocument } = require('../controllers/documentController');
const authenticateToken = require('../middleware/authMiddleware');
/*
add new documents
get documents 
*/
router.use(authenticateToken);//protect routes 

router.get('/', getAllDocuments); 
router.post('/', upload.single('file'), addDocument);
router.delete('/:document_id', deleteDocument);//new delete doc route 

module.exports = router;
