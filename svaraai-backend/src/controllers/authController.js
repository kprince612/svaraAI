const authService = require('../services/authService');

const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
