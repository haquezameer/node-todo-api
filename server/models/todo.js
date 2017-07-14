var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
  text: {
    type: String,
    required: true,
    trim: true
  },
  completedAt: {
    type: Number,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  Todo
};
