var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

app.use(bodyparser.json());

app.post('/todo',(req,res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then((doc) => {
      res.send(doc);
    },(err) => {
      res.status(400).send(err);
    });
});

app.get('/todo',(req,res) => {
  Todo.find().then((docs) => {
    res.send(docs);
  },(err) => {
    res.status(400).send(err);
  });
});

app.listen('3000',() => {
  console.log('Server started');
});

module.exports = {
  app
};
