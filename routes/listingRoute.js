const express = require('express');
const router = express.Router();
const { getListingSummaries } = require('../controllers/listingController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);//protect route
router.get('/', getListingSummaries); 

module.exports = router;