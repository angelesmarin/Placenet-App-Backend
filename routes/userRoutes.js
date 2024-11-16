const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser
} = require('../controllers/userController');

router.post('/authenticate', authenticateUser);
router.post('/', createUser); 
router.get('/', getAllUsers); //read: all
router.get('/:userId', getUser); //read: 1
router.put('/:userId', updateUser); 
router.delete('/:userId', deleteUser); 

module.exports = router;
