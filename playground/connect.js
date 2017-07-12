const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err)
    return console.log('Connect failed!');
    console.log('Successfully connected todatabase!');
    // db.collection('todos').insertOne({
    //   text: 'Study Mean stack'
    // },(err,res) => {
    //   if(err)
    //   return console.log('Failed to save!');
    //   console.log(JSON.stringify(res.ops,undefined,2));
    // });

    db.collection('user').insertOne({
      name: 'Zameer',
      location: 'Itangar'
    },(err,res) =>{
      if(err)
        return console.log('Failed to save user!');
      console.log(JSON.stringify(res.ops,undefined,2));
    });
  db.close();
});
