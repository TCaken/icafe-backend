// middleware.js

const jwt = require('jsonwebtoken');
const secret = 'secret';

const withAuth = function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            res.status(401).send('Unauthorized: Invalid token');
        } else {
            req.id = decoded.id;
            next();
        }
        });
    }
}

module.exports = { withAuth };