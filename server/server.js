var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

app.use(bodyparser.json());

app.post('/post',(req,res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then((doc) => {
      res.send(doc);
    },(err) => {
      res.status(400).send(err);
    });
});


// var newTodo = new Todo({
//   text: "Setup express"
// });
//
// newTodo.save().then((doc) => console.log(doc),(err) => console.log(err));

app.listen('3000',() => {
  console.log('Server started');
});
