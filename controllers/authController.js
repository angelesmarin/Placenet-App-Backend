const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 

//create new user 
const register = async (req, res) => {
    const { username, password } = req.body; //expect plaintext pw 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);//hash pw
        const newUser = await User.create({ username, password_hash: hashedPassword });//new user
        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error making user', error });
    }
  };

//login
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      //generate token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Login failed', error });
    }
  };

module.exports = {
  register,
  login,
};
