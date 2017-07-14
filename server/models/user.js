var mongoose = require('mongoose');

var User = mongoose.model('user',{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required : true,
    trim: true
  }
});

module.exports = {
  User
};
