console.log('testing DataController.js...');
require('./dataController_test.js').simpleCrudTest();

console.log('testing postgres.js...');
require('./postgres_test.js').simpleCrudTest();

console.log('done.');