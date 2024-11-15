const express = require('express');
const router = express.Router();
const { getProfileSummary } = require('../controllers/summaryController');

//define route
router.get('/:userId/summary', getProfileSummary); // dynamic :userId 

module.exports = router;

