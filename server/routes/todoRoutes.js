const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

router.get('/todo', getTodos); // No `protect` middleware here

router.route('/')
  .get(protect, getTodos)
  .post(protect, createTodo);

router.route('/:id')
  .get(protect, getTodo)
  .put(protect, updateTodo)
  .delete(protect, deleteTodo)
  .patch(protect, updateTodo);
module.exports = router;