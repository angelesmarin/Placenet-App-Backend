const express = require('express');
const router = express.Router();
const { getProfileSummary } = require('../controllers/summaryController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);//protect route
router.get('/', getProfileSummary); 

module.exports = router;

