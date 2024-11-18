const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 

//create new user 
const register = async (req, res) => {
    const { username, password } = req.body; // expect plaintext pw
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // hash pw
        const newUser = await User.create({ username, password_hash: hashedPassword }); // new user
        res.status(201).json({ 
            message: 'User created successfully', 
            user: { user_id: newUser.user_id, username: newUser.username } 
        });
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
        //make JWT with user_id in payload
        const token = jwt.sign(
            { userId: user.user_id }, //payload
            process.env.JWT_SECRET,  //.env
            { expiresIn: '1h' } 
        );
        //return token and user ID in the response
        return res.status(200).json({
            token,
            userId: user.user_id,
            message: 'Login successful',
        });

    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Login failed', error });
    }
};

module.exports = {
  register,
  login,
};
