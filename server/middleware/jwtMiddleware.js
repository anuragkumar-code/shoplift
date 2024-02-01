const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_KEY;

const jwtMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            req.user = decoded;
            next();
        }
    });
};

module.exports = jwtMiddleware;
