const express = require('express');
const router = express.Router();
const { getPropertySummary } = require('../controllers/summaryController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);//protect route
router.get('/', getPropertySummary); 

module.exports = router;

