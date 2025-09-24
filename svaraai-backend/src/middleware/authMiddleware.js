const jwt = require('jsonwebtoken');

const jwtSecret = "change_me_strong_secret";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { sub: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
