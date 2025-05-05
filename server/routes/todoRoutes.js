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

router.use(protect);

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id')
  .get(getTodo)
  .patch(updateTodo)
  .delete(deleteTodo);

module.exports = router;