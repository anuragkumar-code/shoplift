const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY;

const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        if (decoded.role !== 'A') {
            return res.status(403).json({ error: 'Forbidden - User does not have admin privileges' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = adminMiddleware;
