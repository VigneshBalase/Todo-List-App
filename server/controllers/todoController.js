const Todo = require('../models/Todo');
const httpErrors = require('http-errors');

// @desc    Get all todos
// @route   GET /api/v1/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single todo
// @route   GET /api/v1/todos/:id
// @access  Private
const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!todo) {
      throw httpErrors(404, `Todo not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new todo
// @route   POST /api/v1/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    const todo = await Todo.create(req.body);
    
    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update todo
// @route   PUT /api/v1/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    let todo = await Todo.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!todo) {
      throw httpErrors(404, `Todo not found with id of ${req.params.id}`);
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete todo
// @route   DELETE /api/v1/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!todo) {
      throw httpErrors(404, `Todo not found with id of ${req.params.id}`);
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
};