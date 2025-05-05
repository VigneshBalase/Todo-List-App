const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const httpErrors = require('http-errors');

// Helper function for ID validation
const validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpErrors.BadRequest('Invalid ID format');
  }
};

// @desc    Get all todos for authenticated user
// @route   GET /api/v1/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ createdBy: req.user.id })
      .populate('createdBy', 'username email')
      .populate('mentionedUsers', 'username email');
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
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

// @desc    Get single todo
// @route   GET /api/v1/todos/:id
// @access  Private
const getTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id);

    const todo = await Todo.findOne({
      _id: id,
      createdBy: req.user.id
    }).populate('mentionedUsers', 'username email');

    if (!todo) {
      throw httpErrors.NotFound(`Todo not found with id of ${id}`);
    }

    res.status(200).json({
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
    const { id } = req.params;
    validateId(id);

    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user.id
      }, 
      req.body, 
      {
        new: true,
        runValidators: true,
      }
    ).populate('mentionedUsers', 'username email');

    if (!todo) {
      throw httpErrors.NotFound(`Todo not found with id of ${id}`);
    }

    res.status(200).json({ 
      success: true, 
      data: todo 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/v1/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id);

    const todo = await Todo.findOneAndDelete({
      _id: id,
      createdBy: req.user.id
    });

    if (!todo) {
      throw httpErrors.NotFound(`Todo not found with id of ${id}`);
    }

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