const jwt = require('jsonwebtoken');
//use token to access app 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization; //get the token from request header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token required for authentication' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        console.log('Decoded Token:', decoded); 
        req.user = decoded; //attach user info from token payload to request
        next();
    });
};

module.exports = authenticateToken;
