const env = process.env.NODE_ENV || 'development';

if(env === "development" || env === "test"){
  var configjson = require('./config.json');
  var envconfig = configjson[env];
  var envconfigvar = Object.keys(envconfig);
  envconfigvar.forEach((key) => {
    process.env[key] = envconfig[key];
  });
}

//
// if(env === "development"){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }
//
// else if(env === "test"){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
// }
