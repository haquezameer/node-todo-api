const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err)
    return console.log('Connect failed!');
    console.log('Successfully connected to database!');
    //   text: 'Study Mean stack'
    // db.collection('todos').insertOne({
    // },(err,res) => {
    //   if(err)
    //   return console.log('Failed to save!');
    //   console.log(JSON.stringify(res.ops,undefined,2));
    // });
    db.collection('user').find({
      name: "Shantam"
    }).toArray().then((doc) => {
      console.log(doc);
    }, (err) => {
      console.log(err);
    });
  db.close();
});
