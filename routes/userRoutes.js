const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

/*
CRUD operations 
*/

router.post('/', createUser); //create 

router.get('/', getAllUsers); //read: all

router.get('/:userId', getUser); //read: 1

router.put('/:userId', updateUser); // update 

router.delete('/:userId', deleteUser); //delete 

module.exports = router;
