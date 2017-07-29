const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todo',() => {

  it('Should save data',(done) => {
      var text = "save data";
      request(app)
      .post('/todo')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err)
          return done(err);
        Todo.find().then((docs) => {
          expect(docs.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should fail',(done) => {
    request(app)
    .post('/todo')
    .send({})
    .expect(400)
    .end((err,res) => {
        if(err)
        return  done(err);
        Todo.find({}).then((docs) => {
          expect(docs.length).toBe(2);
          done();
        }).catch((e) => done(e));
    });
  });
});

describe('GET /todo',() => {
  it('Should fetch all todos',(done) =>{
    request(app)
    .get('/todo')
    .expect(200)
    .end((err,res) => {
        if(err)
          return done(err);
        Todo.find().then((docs) => {
          expect(docs.length).toBe(2);
          console.log(JSON.stringify(docs,undefined,2));
          done();
        }).catch((e) => done(e));
    });
  });
});

describe('GET /todo/:id', () => {
  it('should fetch data for id', (done) => {
    request(app)
    .get(`/todo/${todos[0]._id}`)
    .expect(200)
    .expect((res) =>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should fail to fetch for invalid id',(done) => {
    const id = todos[0]._id.toHexString() + '1';
    request(app)
    .get(`/todo/${id}`)
    .expect(404)
    .end(done);
  });


    it('Should return empty array for id',(done) => {
      const id = new ObjectId();
      request(app)
      .get(`/todo/${id}`)
      .expect(404)
      .expect((res) => {
        expect(typeof res.body.todo).toBe('undefined');
      })
      .end(done);
    });

});

describe('Delete /todo/:id',() => {

  it('should remove a todo',(done) => {
      const id = todos[0]._id.toHexString();
      request(app)
      .delete(`/todo/${todos[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err,res) => {
        if(err)
          done(err);
        Todo.findById(todos[0]._id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found',(done) => {
    const id = new ObjectId();
    request(app)
    .get(`/todo/${id}`)
    .expect(404)
    .expect((res) => {
      expect(typeof res.body.todo).toBe('undefined');
    })
    .end(done);
  });

  it('Should fail to fetch for invalid id',(done) => {
    const id = todos[0]._id.toHexString() + '1';
    request(app)
    .get(`/todo/${id}`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todo',() => {

  it('should make completedAt true',(done) => {
    const id = todos[0]._id.toHexString();
    const body = {
      text: "Update test",
      completed: true
    };
    request(app)
    .patch(`/todo/${id}`)
    .send(body)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("Update test");
      expect(typeof res.body.todo.completedAt).toBe('number');
      expect(res.body.todo.completed).toBe(true) ;
    })
    .end(done);
});

  it('should make completedAt null',(done) => {
    const id = todos[1]._id.toHexString();
    const body = {
      text: "false completed"
    };
    request(app)
    .patch(`/todo/${id}`)
    .send(body)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(body.text);
      expect(res.body.todo.completedAt).toNotExist();
      expect(res.body.todo.completed).toBe(false) ;
    })
    .end(done);
  });
});

describe('GET/ user/me',() => {

  it('should get user back',(done) => {
      request(app)
      .get('/user/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
      })
      .end(done);
  });

  it('should get 401',(done) => {
    request(app)
    .get('/user/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST/ user',() => {
  it('should save user for valid data',(done) => {
    var email = "email@email.com";
    var password = "examplepassword";
    request(app)
    .post('/user')
    .send({email,password})
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(email);
      expect(res.body.password).toNotBe(password);
    })
    .end(done);
  });

  it('should not save user for invalid data',(done) => {
      var email = "emailnotvalid";
      var password = "wordpss";
      request(app)
      .post('/user')
      .send({email,password})
      .expect(400)
      .end(done);
  });

  it('should not create user for duplicate email',(done) => {
    request(app)
    .post('/user')
    .send(users[0])
    .expect(400)
    .end(done);
  });
});

describe('POST/ user/login',() => {
  it('should login user and return auth token',(done) => {
    var user1 = users[1];
    request(app)
    .post('/user/login')
    .send(user1)
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
    })
    .end((err,res) =>{
      User.findById(user1._id).then((user) => {
          expect(user._id.toHexString()).toBe(res.body._id);
          expect(user.tokens[0]).toInclude({
            access : "auth",
            token : res.headers['x-auth']
          });
          done();
      }).catch((e) => done(e));
    });
  });

  it('should return 400 for invalid login credentials',(done) => {
      request(app)
      .post('/user/login')
      .send({
        email : users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res) =>{
        if(err)
          return  done(err);
        User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
        }).catch((e) => done(e));
      });
  });
});

describe('/user/me/token',() => {
  it('should remove token',(done) => {
    var user = users[0];
    request(app)
    .delete('/user/me/token')
    .set('x-auth',user.tokens[0].token)
    .expect(200)
    .end((err,res) => {
      if(err)
        done(err);
      User.findById(user._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
