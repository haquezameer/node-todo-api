const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err)
    return console.log('Connect failed!');
    console.log('Successfully connected to database!');
    // db.collection('todos').insertOne({
    //   text: 'Study Mean stack'
    // },(err,res) => {
    //   if(err)
    //   return console.log('Failed to save!');
    //   console.log(JSON.stringify(res.ops,undefined,2));
    // });
    db.collection('user').findOneAndDelete({
      _id: new ObjectID("59658fae12e36d19ad333823")
    }).then((res) => {
      console.log(res);
    },(err) => {
      console.log(err);
    });
  db.close();
});
