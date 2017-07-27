require('./config/config');
const _ = require('lodash');
var express = require('express');
var bodyparser = require('body-parser');
var {ObjectId} = require('mongodb');

var app = express();
const port = process.env.PORT;

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
  Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo)
        res.status(404).send();
      res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.patch('/todo/:id',(req,res) => {

  let body = _.pick(req.body,['completed','text']);
  let id = req.params.id;

  if(!ObjectId.isValid(id))
    res.status(404).send();

  if(_.isBoolean(body.completed) && body.completed)
    {
      body.completedAt = new Date().getTime();
    }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set : body},{new : true}).then((todo) => {
    if(!todo)
      res.status(404).send();
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.listen(port,() => {
  console.log(`Server started at port ${port}`);
});

module.exports ={
  app
};
