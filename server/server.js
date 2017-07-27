var express = require('express');
var bodyparser = require('body-parser');
var {ObjectId} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

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
  Todo.find().then((todo) => {
    res.send({todo});
  },(err) => {
    res.status(400).send(err);
  });
});

app.get('/todo/:id',(req,res) => {
  var id = req.params.id;
  if(!ObjectId.isValid(id))
    res.status(404).send();

  Todo.findById(id).then((todo) => {
      if(!todo)
        res.status(404).send();
      res.send({todo});
    }).catch((e) => {
      res.status(400).send()
    });
});

app.delete('/todo/:id',(req,res) => {
  var id = req.params.id;
  if(!ObjectId.isValid(id))
    res.status(404).send();
  Todo.findByIdAndRemove(id).then((doc) => {
      if(!doc)
        res.status(404).send();
      res.send(doc);
  }).catch((e) => res.status(400).send());
});

app.listen(port,() => {
  console.log(`Server started at port ${port}`);
});
