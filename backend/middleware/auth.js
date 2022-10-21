// middleware/auth.js
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('here');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization Required'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Authorization Required'));
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};

module.exports = auth;
