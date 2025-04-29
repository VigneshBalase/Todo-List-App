const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path to your User model

const protect = async (req, res, next) => {
  let token;

  // Check if token is in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if decoded token has user id
      if (!decoded || !decoded.id) {
        return res.status(401).json({ success: false, message: 'Invalid token, no user ID found' });
      }

      // Find the user by ID in the database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Attach the user to the request object
      req.user = user;

      // Allow the request to proceed
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
