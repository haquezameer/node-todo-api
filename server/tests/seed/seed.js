const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const todos = [{
  _id: new ObjectId(),
  text: "test 1",
  completed: false,
  completedAt: null
},{
  _id: new ObjectId(),
  text: "test 2"
}];

var userOneId = new ObjectId();

const users = [{
  email : "andrew@gmail.com",
  password: "passwordforone",
  _id : userOneId,
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id : userOneId,access: 'auth'},'abc123').toString()
  }]
},
{
  email: 'haquezameer@gmail.com',
  password: 'passwordfortwo',
  _id : new ObjectId()
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(()=>done());
}

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
