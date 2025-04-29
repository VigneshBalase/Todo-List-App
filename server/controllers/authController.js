const jwt = require('jsonwebtoken');
const httpErrors = require('http-errors');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    );

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw httpErrors(400, 'Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw httpErrors(401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw httpErrors(401, 'Invalid credentials');
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username, // or `user.name` or whatever field holds the username
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    );
    

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};