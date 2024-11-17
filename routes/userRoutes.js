const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.get('/', getAllUsers); //read: all
router.get('/:userId', getUser); //read: 1
router.put('/:userId', updateUser); 
router.delete('/:userId', deleteUser); 

module.exports = router;
