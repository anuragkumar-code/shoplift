const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY;

const customerMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        if (decoded.role !== 'CUS') {
            return res.status(403).json({ error: 'Forbidden - User does not have customer privileges' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = customerMiddleware;
