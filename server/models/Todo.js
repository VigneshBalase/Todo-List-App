const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  mentionedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  notes: [{
    content: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Todo', todoSchema);