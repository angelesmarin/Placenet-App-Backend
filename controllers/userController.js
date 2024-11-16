const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//authenticate 
const authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Received login attempt:', username, password); // Check received values
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', user.username);
    console.log('Checking password:', user.password_hash, password);

    //compare hash pw
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    //res.status(200).json({ userId: user.user_id });

    //NEW: generate jwt
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed', error });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users', error });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error getting user', error });
  }
};

// make new user
const createUser = async (req, res) => {
  try {
    const { username, password_hash } = req.body;
    const newUser = await User.create({ username, password_hash });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error making user', error });
  }
};

// update user 
const updateUser = async (req, res) => {
  try {
    const { username, password_hash } = req.body;
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ username, password_hash });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// delete user 
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser,
};