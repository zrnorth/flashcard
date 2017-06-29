var bcrypt = require('bcryptjs');

const db = require('./postgres.js');

// Create a new user and store it in the database
exports.createUser = function(username, password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  return db.createUser(username, hash).then(function(data) {
    return data.id;
  }, function(err) { // Error is usually from already-taken username
    console.log(err);
    return null;
  });
}

exports.login = function(username, password) {
  // get user by username from db
  return db.getUserByUsername(username).then(function(data) {
    // user exists, so compare password.
    var hash = data.password;
    if (bcrypt.compareSync(password, hash)) {
      // password matches, so login is success
      return data.id;
    }
    else {
      throw new Error('incorrect password');  
    }
  }, function(err) { 
    throw new Error('user does not exist'); 
  });
}