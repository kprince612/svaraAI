const userRepo = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

const jwtSecret = "change_me_strong_secret";

const signup = async ({ email, password, name }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 400 });
  const user = await userRepo.createUser({ email, password, name });
  return user;
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await user.comparePassword(password);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  return { user, token };
};

module.exports = { signup, login };
