const express = require('express');
const { protect} = require('../middleware/authMiddleware'); // Assuming you have these middleware
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require('../controllers/userController');

const router = express.Router();


// routes/userRoutes.js
router.get('/', getUsers); // No `protect` middleware here

router.route('/')
  .get(protect, getUsers)
  .post(protect, createUser);

router.route('/me')
  .get(protect, getCurrentUser);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
