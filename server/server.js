require('./config/config');
const validator = require('validator');
const _ = require('lodash');
const  express = require('express');
const bodyparser = require('body-parser');
const {ObjectId} = require('mongodb');

const app = express();
const port = process.env.PORT;

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');


app.use(bodyparser.json());


app.post('/todo',authenticate,(req,res) => {
    var todo = new Todo({
      text: req.body.text,
    _creator: req.user._id
    });
    todo.save().then((doc) => {
      res.send(doc);
    },(err) => {
      res.status(400).send(err);
    });
});

app.get('/todo',authenticate,(req,res) => {
  Todo.find({_creator:req.user._id}).then((todo) => {
    res.send({todo});
  },(err) => {
    res.status(400).send(err);
  });
});

app.get('/todo/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if(!ObjectId.isValid(id))
    res.status(404).send();

  Todo.findOne({_id : id,_creator: req.user._id}).then((todo) => {
      if(!todo)
        res.status(404).send();
      res.send({todo});
    }).catch((e) => {
      res.status(400).send()
    });
});

app.delete('/todo/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if(!ObjectId.isValid(id))
    res.status(404).send();
  Todo.findOneAndRemove({_id : id, _creator : req.user._id}).then((todo) => {
      if(!todo)
        res.status(404).send();
      res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.patch('/todo/:id',authenticate,(req,res) => {

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

  Todo.findOneAndUpdate({_id : id, _creator : req.user._id},{$set : body},{new : true}).then((todo) => {
    if(!todo)
      res.status(404).send();
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.post('/user',(req,res) => {
  const body = _.pick(req.body,['email','password','_creator']);
  var user = new User(body);
  user.save().then(() => {
      return user.generateAuthToken();
  }).then((token) => {
  res.header('x-auth',token).send(user);
}).catch((e) => res.status(400).send(e));
});


app.get('/user/me',authenticate,(req,res) => {
  res.send(req.user);
});

app.post('/user/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);
   User.findByCredentials(body.email,body.password).then((user) => {
    return  user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((e) => res.status(400).send(e));
});


app.delete('/user/me/token',authenticate,(req,res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    },() => {
      res.status(400).send();
    });
});

app.listen(port,() => {
  console.log(`Server started at port ${port}`);
});

module.exports ={
  app
};
