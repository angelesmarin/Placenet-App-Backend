const express = require('express');
const router = express.Router();
const upload = require('../middleware/file_uploads');  
const { addDocument, getAllDocuments, deleteDocument, downloadDocument } = require('../controllers/documentController');
const authenticateToken = require('../middleware/authMiddleware');


router.use(authenticateToken);//protect routes 

router.get('/', getAllDocuments); 
router.post('/', upload.single('file'), addDocument);
router.delete('/:document_id', deleteDocument);
router.get('/:document_id/download', downloadDocument); 

module.exports = router;
