const db = require('./postgres.js');

db.selectAllRows();
db.closeConnection();