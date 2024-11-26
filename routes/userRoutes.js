// userRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.use(authenticateToken);

router.get('/', getAllUsers); 
router.get('/:userId', getUser);
router.put('/:userId', updateUser); 
router.delete('/:userId', deleteUser);

module.exports = router;