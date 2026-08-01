const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});