const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_KEY;

const jwtMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {

                const currentTimestamp = Date.now();
                const tokenExpirationTimestamp = decoded.exp * 1000; 
                const refreshThreshold = 15 * 60 * 1000;             //setting token refresh to 15 mins

                if (currentTimestamp < tokenExpirationTimestamp - refreshThreshold) {

                    const newToken = jwt.sign(decoded, secretKey, { expiresIn: '1h' });

                    req.headers.authorization = newToken;

                    req.user = decoded;
                    next();
                } else {

                    return res.status(401).json({ message: 'Token expired' });
                }
            } else {

                return res.status(401).json({ message: 'Invalid token' });
            }
        } else {

            req.user = decoded;
            next();
        }
    });
};

module.exports = jwtMiddleware;
