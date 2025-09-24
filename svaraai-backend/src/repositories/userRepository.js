const User = require('../models/User');

const createUser = async (payload) => {
  const user = new User(payload);
  return user.save();
};

const findByEmail = async (email) => User.findOne({ email });
const findById = async (id) => User.findById(id);

module.exports = { createUser, findByEmail, findById };
