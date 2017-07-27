const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text: "test 1",
  completed: false,
  completedAt: null
},{
  _id: new ObjectId(),
  text: "test 2"
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});


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
